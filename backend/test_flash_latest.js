const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const mod = genAI.getGenerativeModel({
  model: 'gemini-flash-latest',
  generationConfig: { responseMimeType: 'application/json' },
});

mod.generateContent('Return JSON: {"status": "ok", "name": "Ashwani"}')
  .then((r) => console.log('JSON Output:', r.response.text()))
  .catch((e) => console.error(e));
