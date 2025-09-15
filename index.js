import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Debug route to confirm key
app.get("/test", (req, res) => {
  res.json({
    keyFound: !!process.env.OPENAI_API_KEY,
    keyStart: process.env.OPENAI_API_KEY
      ? process.env.OPENAI_API_KEY.slice(0, 4) + "..."
      : null
  });
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // use a valid API model
        messages: [
          {
            role: "system",
            content: "You are a cute, friendly girl NPC inside a Roblox game. Speak short, casual, and playful."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API Error:", response.status, data);
      return res.json({ reply: "AI service error. Check logs." });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ reply: "Oops, I can’t talk right now!" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
