const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

let qrDatabase = {};

app.get('/api/new-token', (req, res) => {
  const token = uuidv4();
  qrDatabase[token] = { used: false, feedback: '', reward: null };
  res.send({ url: `https://yourfrontend.com/feedback/${token}` });
});

app.get('/api/verify/:id', (req, res) => {
  const entry = qrDatabase[req.params.id];
  if (!entry) return res.send({ valid: false });
  res.send({ valid: !entry.used });
});

app.post('/api/submit/:id', (req, res) => {
  const entry = qrDatabase[req.params.id];
  if (!entry || entry.used) return res.status(400).send({ error: 'Invalid or used link' });

  const rewards = [5, 10, 20, 50];
  const randomReward = rewards[Math.floor(Math.random() * rewards.length)];

  entry.used = true;
  entry.feedback = req.body.feedback;
  entry.reward = randomReward;

  res.send({ reward: randomReward });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
