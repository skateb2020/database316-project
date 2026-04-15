import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();
const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json());
app.use(express.static(path.join(__dirname, 'chatbot')));

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'chatbot')));

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch(process.env.AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${process.env.AI_API_AUTH_TYPE} ${process.env.AI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL,
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();

    // Try to handle different API response formats
    let reply = "No reply from AI.";
    if (data.choices && data.choices[0]?.message?.content) {
      reply = data.choices[0].message.content; // OpenAI style
    } else if (data.output && typeof data.output === "string") {
      reply = data.output; // Some other APIs
    } else if (data.completion) {
      reply = data.completion; // Cohere style
    }

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

// Root route
app.get('/', (req, res) => {
  res.send('Hello! Your server is working 🚀');
});

// Example API route
app.get('/api/data', (req, res) => {
  res.json({ message: 'Here is your data' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



