// client/pages/api/contact.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Your deployed Google Apps Script Web App URL
    const scriptURL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    const response = await fetch(scriptURL, {
      method: "POST",
      mode: "no-cors", // Apps Script requires no-cors
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, message })
    });

    res.status(200).json({ success: true, message: "Form submitted successfully!" });
  } catch (err) {
    console.error("Contact API Error:", err);
    res.status(500).json({ error: "Failed to submit form" });
  }
}
