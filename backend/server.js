import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config({ path: '/Users/uzair_chaudhry/cs316-project/.env' });

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const BASE_URL = process.env.BASE_URL;
const modelName = 'GPT 4.1 Nano'

app.post("/api/openai", async (req, res) => {
  const { prompt, systemPrompt } = req.body;

  try {
    const response = await fetch(`${process.env.BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: 'system', content: systemPrompt ?? 'You are an academic advisor for Duke Univerisity. Answer the question in the most helpful and accurate way or respond that you do not know the answer.' },
        { role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    res.json(data); // send JSON back to frontend
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});