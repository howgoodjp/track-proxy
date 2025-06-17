const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = 'C2A6FA484B06594319BD7B09C8951BBF'; // 你的17TRACK金鑰

// 註冊單號
async function registerTracking(number) {
  const regRes = await fetch('https://api.17track.net/track/v1/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      '17token': API_KEY,
    },
    body: JSON.stringify([
      {
        number: number,
        carrier: "190456"
      }
    ]),
  });
  return regRes.json();
}

app.post('/track', async (req, res) => {
  const { shipCode } = req.body;
  if (!shipCode) return res.status(400).json({ error: 'Missing shipCode' });

  try {
    // 先註冊單號
    await registerTracking(shipCode);

    // 再查詢單號
    const apiRes = await fetch('https://api.17track.net/track/v1/gettrackinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        '17token': API_KEY,
      },
      body: JSON.stringify([
        {
          number: shipCode,
          carrier: "190456"
        }
      ]),
    });
    const data = await apiRes.json();
    console.log('shipCode:', shipCode, 'result:', JSON.stringify(data));
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'API failed', detail: String(e) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('17TRACK Proxy API running on ' + port));
