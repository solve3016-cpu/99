const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/chat', async (req, res) => {
  try {
    const { message, projectId, cookies } = req.body;

    // We'll try the most common prompt endpoint for Lovable
    const lovableUrl = `https://lovable.dev/api/projects/${projectId}/prompts`;

    const response = await axios.post(lovableUrl, {
      content: message,
    }, {
      headers: {
        'Cookie': cookies,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64 ) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': `https://lovable.dev/projects/${projectId}`,
        'Origin': 'https://lovable.dev'
      }
    } );

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(error.response?.status || 500).json({ 
      success: false, 
      message: error.response?.data?.message || 'Failed to connect to Lovable' 
    });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
