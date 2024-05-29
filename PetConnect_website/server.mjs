import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Dodano CORS middleware
app.use(express.json());

// Endpoint to get answer based on question
app.post('/api/get-answer', async (req, res) => {
  const { question } = req.body;

  const API_KEY = process.env.OPENAI_API_KEY;
  const API_URL = 'https://zukijourney.xyzbot.net/v1/chat/completions';

  const requestBody = {
    stream: false,
    model: 'gpt-4',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'user',
        content: `Odgovori na naslednje vprašanje kot veterinar za male živali in v slovenščini: ${question}`,
      },
    ],
    max_tokens: 150,
  };

  try {
    console.log('Sending request to API with body:', requestBody);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.text(); // Use text() instead of json() for debugging purposes

    if (!response.ok) {
      console.error('Error from API:', data);
      return res.status(response.status).json({ error: data });
    }

    console.log('Received response from API:', data);

    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error fetching the answer' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
