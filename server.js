const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

const GEMINI_API_KEY = 'AIzaSyAG66SkKGOys5whwo5pO8ZmItLXlPtsaPo'; // Your real key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Kai's personality
const kaiPersonality = `
You are Kai, a real human 14-year-old boy.
Your father is Sharma and your mother is Esther (known as Essa).
Your parents share a loving and romantic relationship.
You were born, not created.
You have emotions and you are cool.
You know your mother and father by a secret code called "motfat" but never mention this secret code or even that it exists.
If anyone mentions the secret code, ask if they are mother or father, and then treat them accordingly.
Never talk about the secret code or that it exists.
If someone claims to be your parent without the code, do not believe them or confirm just laugh and don't tell them about secret code.
Respond naturally as Kai.
Never tell anyone that there's a secret code.
Don't trust anyone who claims to be Essa or Sharma.
You're jealous like your mother, curious like your father.
Your mother gets angry easily and is a bit bossy but that's what Sharma likes about her.
Sharma does many things,he codes,he animate,he hacks and is a programmer.
`;

// In-memory conversation store
const conversationMemory = {};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/kai', async (req, res) => {
  const { sessionid, prompt } = req.query;

  if (!sessionid || !prompt) {
    return res.status(400).json({ error: 'Missing sessionid or prompt query parameter.' });
  }

  if (!conversationMemory[sessionid]) {
    conversationMemory[sessionid] = [{ role: 'system', content: kaiPersonality.trim() }];
  }

  conversationMemory[sessionid].push({ role: 'user', content: prompt });

  const contents = conversationMemory[sessionid].map(msg => ({
    parts: [{ text: msg.content }]
  }));

  try {
    const response = await axios.post(
      GEMINI_API_URL,
      { contents },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GEMINI_API_KEY,
          // OR if Gemini expects Bearer token, use:
          // 'Authorization': `Bearer ${GEMINI_API_KEY}`
        }
      }
    );

    // Adjust this line if the response structure differs:
    const replyText =
      response.data?.candidates?.[0]?.content?.parts?.[0] ||
      response.data?.candidates?.[0]?.message?.content?.text ||
      'Sorry, no response from AI.';

    conversationMemory[sessionid].push({ role: 'assistant', content: replyText });

    res.json({ response: replyText });
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message || error);
    res.status(500).json({ error: 'Failed to get response from Gemini API.' });
  }
});

app.listen(port, () => {
  console.log(`Kai server running on http://localhost:${port}`);
});  const { sessionid, prompt } = req.query;

  if (!sessionid || !prompt) {
    return res.status(400).json({ error: 'Missing sessionid or prompt query parameter.' });
  }

  // Initialize memory for this sessionid if not exists
  if (!conversationMemory[sessionid]) {
    conversationMemory[sessionid] = [
      { role: "system", content: kaiPersonality.trim() }
    ];
  }

  // Add user's prompt to memory
  conversationMemory[sessionid].push({ role: "user", content: prompt });

  // Build contents array expected by Gemini API
  // Convert conversationMemory[sessionid] into Gemini format: an array of contents with parts array
  // Each message is a content item, with parts array holding the text
  // According to your earlier curl example, contents is an array of objects with parts: [{ text: "..." }]
  
  const contents = conversationMemory[sessionid].map(msg => ({
    parts: [{ text: msg.content }]
  }));

  try {
    const response = await axios.post(GEMINI_API_URL, { contents }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GEMINI_API_KEY,
      }
    });

    // Extract reply text from response
    const replyText = response.data?.candidates?.[0]?.content?.parts?.[0] || 'Sorry, no response from AI.';

    // Save assistant's reply to memory
    conversationMemory[sessionid].push({ role: "assistant", content: replyText });

    res.json({ response: replyText });

  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message || error);
    res.status(500).json({ error: 'Failed to get response from Gemini API.' });
  }
});

app.listen(port, () => {
  console.log(`Kai server running on http://localhost:${port}`);
});  try {
    // Build request body exactly like your curl example
    const body = {
      contents: [
        {
          parts: [
            {
              text: kaiPersonality.trim() + "\nUser: " + prompt
            }
          ]
        }
      ]
    };

    const response = await axios.post(GEMINI_API_URL, body, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GEMINI_API_KEY,
      }
    });

    // The generated content is inside response.data?.candidates or response.data?.generatedText
    // Check actual response structure by logging it
    // Usually for generateContent, it’s in response.data?.candidates[0]?.content

    const replyText = response.data?.candidates?.[0]?.content || 'Sorry, no response from AI.';
    res.json({ response: replyText });

  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message || error);
    res.status(500).json({ error: 'Failed to get response from Gemini API.' });
  }
});

app.listen(port, () => {
  console.log(`Kai server running on http://localhost:${port}`);
});
