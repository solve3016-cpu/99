const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Main Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, projectId, cookies } = req.body;

    if (!message || !projectId || !cookies) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required data (message, projectId, or cookies)' 
      });
    }

    console.log(`🚀 Sending message to project: ${projectId}`);

    // Lovable.dev Internal API Endpoint
    // Note: This is a middleman. We forward the request using the cookies captured by the extension.
    const lovableUrl = `https://lovable.dev/api/projects/${projectId}/chat`;

    const response = await axios.post(lovableUrl, {
      content: message,
      role: 'user'
    }, {
      headers: {
        'Cookie': cookies,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    console.log('✅ Lovable responded:', response.status);

    res.json({ 
      success: true, 
      message: 'Message forwarded to Lovable successfully!',
      data: response.data 
    });

  } catch (error) {
    console.error('❌ Error forwarding message:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data.message || 'Error from Lovable API',
        error: error.response.data
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error while forwarding to Lovable' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Stateless Backend running on port ${PORT}`);
});
