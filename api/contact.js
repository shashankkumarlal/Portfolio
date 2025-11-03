export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const response = await fetch(process.env.GSHEET_WEBAPP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: process.env.SHEETS_TOKEN,
        name,
        email,
        subject,
        message,
      }),
    });

    const data = await response.json();

    if (data?.result === "success") {
      return res
        .status(200)
        .json({ success: true, message: "Message saved to Google Sheet!" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Failed to send message to Sheet." });
    }
  } catch (error) {
    console.error("Contact form error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error sending message." });
  }
}
