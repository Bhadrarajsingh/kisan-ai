const axios = require('axios');

async function getModels() {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.log("No GROQ_API_KEY set in environment variables");
      return;
    }
    const res = await axios.get('https://api.groq.com/openai/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    console.log("AVAILABLE MODELS:");
    res.data.data.forEach(m => console.log(m.id));
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}

getModels();
