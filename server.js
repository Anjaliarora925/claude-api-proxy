const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Environment Variables
const API_URL = process.env.ANTHROPIC_BASE_URL || "https://anyrouter.top";
const API_KEY = process.env.ANTHROPIC_AUTH_TOKEN;

// ✅ Claude 4 (Opus) Proxy Endpoint
app.post("/claude", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const response = await axios.post(
      `${API_URL}/v1/messages`,
      {
        prompt: prompt,
        model: "claude-opus-4-20250514",  // 🆕 Claude 4 (Opus) model ID
        max_tokens: 1000
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Claude API Error:", error.message);
    res.status(500).json({
      error: "Claude API call failed.",
      detail: error.message
    });
  }
});

// ✅ Homepage Route for Browser Visit
app.get("/", (req, res) => {
  res.send(`
    <h2>✅ Claude API Proxy (Claude 4 Ready)</h2>
    <p>Send <code>POST</code> requests to <code>/claude</code> with a JSON body:</p>
    <pre>{
  "prompt": "Your message here"
}</pre>
  `);
});

// ✅ Dynamic Port (for Railway, etc.)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Claude 4 Proxy Server running on port ${PORT}`);
});
