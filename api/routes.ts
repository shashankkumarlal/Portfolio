import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import path from "path";
import { promises as fsp } from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple per-IP rate limiter for contact endpoint
  const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
  const MAX_REQUESTS = 5; // max 5 messages per IP per window
  const hits = new Map<string, { count: number; reset: number }>();
  // Simple per-IP rate limiter for chat endpoint
  const CHAT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
  const CHAT_MAX_REQUESTS = 15; // allow more for chat
  const chatHits = new Map<string, { count: number; reset: number }>();

  app.use("/api/contact", (req, res, next) => {
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const entry = hits.get(ip);
    if (!entry || now > entry.reset) {
      hits.set(ip, { count: 1, reset: now + WINDOW_MS });
      return next();
    }
    if (entry.count >= MAX_REQUESTS) {
      res.status(429).json({ success: false, message: "Too many requests. Please try again later." });
      return;
    }
    entry.count++;
    next();
  });

  // Chat endpoint (Groq)
  app.use("/api/chat", (req, res, next) => {
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const entry = chatHits.get(ip);
    if (!entry || now > entry.reset) {
      chatHits.set(ip, { count: 1, reset: now + CHAT_WINDOW_MS });
      return next();
    }
    if (entry.count >= CHAT_MAX_REQUESTS) {
      res.status(429).json({ success: false, message: "Too many chat requests. Please try again later." });
      return;
    }
    entry.count++;
    next();
  });

  const chatBodySchema = z.object({ message: z.string().min(1).max(2000) });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = chatBodySchema.parse(req.body);

      const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
      const apiKey = process.env.GROQ_API_KEY || "";
      if (!apiKey) {
        return res.status(500).json({ success: false, message: "GROQ_API_KEY is not configured" });
      }

      // Load site knowledge
      const knowledgePath = path.resolve(import.meta.dirname, "data", "site_knowledge.json");
      let knowledgeText = "";
      try {
        const raw = await fsp.readFile(knowledgePath, "utf-8");
        const items = JSON.parse(raw) as Array<{ section: string; title: string; content: string }>;
        knowledgeText = items.map(i => `[#${i.section}] ${i.title}: ${i.content}`).join("\n\n");
      } catch {}

      const system = `You are an assistant for Shashank's portfolio website. Answer strictly using the provided site knowledge. If something is not covered, say you don't have that info and suggest contacting via the Contact section.`;

      const body = {
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: `Site Knowledge as context:\n\n${knowledgeText}\n\nUser question: ${message}` },
        ],
        temperature: 0.4,
        max_tokens: 500,
      } as const;

      const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        return res.status(500).json({ success: false, message: "Groq request failed", detail: txt });
      }
      const data: any = await resp.json();
      const reply: string = data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

      res.json({ success: true, reply });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid chat input", errors: err.errors });
      }
      console.error("/api/chat error", err);
      res.status(500).json({ success: false, message: "Chat request failed" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      // Optional reCAPTCHA verification (only if RECAPTCHA_SECRET is set)
      if (process.env.RECAPTCHA_SECRET) {
        const token = (req.headers["x-recaptcha-token"] as string) || "";
        if (!token) {
          return res.status(400).json({ success: false, message: "Missing reCAPTCHA token" });
        }
        const verify = await fetch("https://www.google.com/recaptcha/api/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: process.env.RECAPTCHA_SECRET,
            response: token,
          }),
        });
        const vjson: any = await verify.json();
        if (!vjson.success || (typeof vjson.score === "number" && vjson.score < 0.5)) {
          return res.status(400).json({ success: false, message: "reCAPTCHA verification failed" });
        }
      }

      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      // Forward to Google Sheets Apps Script Web App if configured
      const gsheetUrl = process.env.GSHEET_WEBAPP_URL;
      const sheetsToken = process.env.SHEETS_TOKEN;
      if (gsheetUrl) {
        try {
          await fetch(gsheetUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(sheetsToken ? { "X-Auth-Token": sheetsToken } : {}),
            },
            body: JSON.stringify({ ...validatedData, ...(sheetsToken ? { token: sheetsToken } : {}) }),
          });
        } catch (forwardErr) {
          console.error("Failed to forward to Google Sheets:", forwardErr);
        }
      }

      // Optional email notification via Resend
      const RESEND_API_KEY = process.env.RESEND_API_KEY;
      const TO_EMAIL = process.env.NOTIFY_EMAIL || process.env.TO_EMAIL;
      const FROM_EMAIL = process.env.FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
      if (RESEND_API_KEY && TO_EMAIL) {
        try {
          const subject = `New contact from ${validatedData.name}: ${validatedData.subject}`;
          const html = `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Subject:</strong> ${validatedData.subject}</p>
            <p><strong>Message:</strong></p>
            <pre style="white-space:pre-wrap">${validatedData.message}</pre>
          `;
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: FROM_EMAIL,
              to: [TO_EMAIL],
              subject,
              html,
            }),
          });
        } catch (emailErr) {
          console.error("Failed to send email notification:", emailErr);
        }
      }
      
      res.status(201).json({
        success: true,
        message: "Message sent successfully!",
        data: message,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid input data",
          errors: error.errors,
        });
      } else {
        console.error("Error creating contact message:", error);
        res.status(500).json({
          success: false,
          message: "Failed to send message. Please try again later.",
        });
      }
    }
  });

  app.get("/api/contact", async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json({
        success: true,
        data: messages,
      });
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch messages",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
