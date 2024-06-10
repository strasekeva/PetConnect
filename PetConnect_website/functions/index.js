const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

// Dinamični uvoz node-fetch
let fetch;

// Nastavite Express aplikacijo
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Primer API poti
app.post('/get-answer', async (req, res) => {
  if (!fetch) {
    fetch = (await import('node-fetch')).default;
  }
  
  const { question } = req.body;
  const API_KEY = functions.config().openai.key; // Nastavitev prek Firebase Config
  const API_URL = 'https://api.openai.com/v1/chat/completions';

  const requestBody = {
    stream: false,
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'user',
      content: `Odgovori na naslednje vprašanje kot veterinar za male živali in v slovenščini: ${question}`,
    }],
    max_tokens: 400,
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

    const data = await response.text();
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

// Izvozite Express aplikacijo kot Firebase funkcijo
exports.api = functions.https.onRequest(app);
