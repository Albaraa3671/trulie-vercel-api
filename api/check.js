import fetch from "node-fetch";

export default async function handler(req, res) {
  // 🛡 Allow requests from your HTML (CORS)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed." });
  }

  try {
    // ✅ Read the user's text correctly
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: "⚠️ No input received." });
    }

    // 🔑 Send request to OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Trulie, a fact-checking assistant." },
          { role: "user", content: query },
        ],
      }),
    });

    const data = await response.json();

    // ✅ Handle success or failure
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res
      .status(200)
      .json({ result: data.choices?.[0]?.message?.content || "No output" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
