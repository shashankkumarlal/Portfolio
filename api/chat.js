export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required" });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are a friendly portfolio assistant for Shashank Kumar Lal. Answer questions about his projects, skills, or experience clearly and conversationally.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't get an answer right now.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Groq API error:", error);
    res.status(500).json({ message: "Error generating chatbot reply." });
  }
}
