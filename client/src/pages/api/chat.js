import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const chatCompletion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: "You are a friendly portfolio assistant. Keep replies concise and relevant.",
        },
        { role: "user", content: message },
      ],
    });

    const reply = chatCompletion.choices[0]?.message?.content || "No response from model";
    res.status(200).json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: "Error generating response" });
  }
}
