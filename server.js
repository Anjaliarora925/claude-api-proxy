const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/claude', (req, res) => {
  const { prompt } = req.body;
  const safePrompt = prompt.replace(/["$`]/g, ''); // sanitize

  const command = `
    ANTHROPIC_AUTH_TOKEN=${process.env.ANTHROPIC_AUTH_TOKEN} \
    ANTHROPIC_BASE_URL=${process.env.ANTHROPIC_BASE_URL} \
    npx claude <<< "${safePrompt}"
  `;

  exec(command, (err, stdout, stderr) => {
    if (err || stderr) {
      return res.status(500).send(stderr || err.message);
    }
    res.send(stdout);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
