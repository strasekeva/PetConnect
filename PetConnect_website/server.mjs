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
  const API_URL = 'https://api.openai.com/v1/chat/completions';

  const requestBody = {
    stream: false,
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: `Odgovori na naslednje vprašanje kot veterinar za male živali in v slovenščini: ${question}`,
      },
    ],
    max_tokens: 400,
  };

  try {
    console.log('Sending request to OpenAI with body:', requestBody);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json(); // Use json() to parse the response

    console.log('Received response from OpenAI:', data);

    // Preverite in dostopajte do pravilnih podatkov v odgovoru
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      const answer = data.choices[0].message.content;
      res.json({ answer });
    } else {
      console.error('Invalid response format:', data);
      res.status(500).json({ error: 'Invalid response format from OpenAI' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error fetching the answer' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});