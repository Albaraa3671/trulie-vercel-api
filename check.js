import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed." });
  }

  const userInput = req.body?.query;
  if (!userInput) {
    return res.status(400).json({ message: "⚠️ No input received." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are Trulie, an AI fact-checker and reliability analyzer."
          },
          { role: "user", content: userInput }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices?.[0]) {
      return res.status(500).json({ message: "No response from OpenAI." });
    }

    res.status(200).json({ result: data.choices[0].message.content });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message });
  }
}
