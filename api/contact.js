export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed" });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Your deployed Google Apps Script Web App URL
    const scriptURL = process.env.GSHEET_WEBAPP_URL;

    const response = await fetch(scriptURL, {
      method: "POST",
      mode: "no-cors", // Apps Script requires no-cors
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, subject, message })
    });

    res.status(200).json({ success: true, message: "Form submitted successfully!" });
  } catch (err) {
    console.error("Contact API Error:", err);
    res.status(500).json({ error: "Failed to submit form" });
  }
}
