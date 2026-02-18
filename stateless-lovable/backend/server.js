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

    // THE CORRECT ENDPOINT FROM YOUR BROWSER!
    const lovableUrl = `https://api.lovable.dev/projects/${projectId}/latest-message`;

    console.log(`🚀 Forwarding message to: ${lovableUrl}` );

    const response = await axios.post(lovableUrl, {
      content: message,
    }, {
      headers: {
        'Cookie': cookies,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://lovable.dev',
        'Referer': `https://lovable.dev/projects/${projectId}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    } );

    console.log('✅ Lovable Success:', response.status);
    res.json({ success: true, data: response.data });

  } catch (error) {
    console.error('❌ Lovable Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data));
      return res.status(error.response.status).json({
        success: false,
        message: `Lovable API Error (${error.response.status})`,
        details: error.response.data
      });
    }
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
