const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = 'C2A6FA484B06594319BD7B09C8951BBF'; // 你的17TRACK金鑰

// 前端呼叫這個API即可查貨態
app.post('/track', async (req, res) => {
  const { shipCode } = req.body;
  if (!shipCode) return res.status(400).json({ error: 'Missing shipCode' });

  try {
    // 17track 正確 endpoint
    const apiRes = await fetch('https://api.17track.net/track/v2/gettrackinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        '17token': API_KEY,
      },
      body: JSON.stringify({
        nums: [shipCode]   // 必須是 array
      }),
    });
    const data = await apiRes.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'API failed', detail: String(e) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('17TRACK Proxy API running on ' + port));
