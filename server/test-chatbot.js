/**
 * Quick test script — run with: node test-chatbot.js
 * Tests the AI chatbot endpoint directly
 */
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:5000';

async function testChatbot() {
  console.log('\n🧪 Testing KisanAI Chatbot...\n');

  const testMessages = [
    { message: 'Should I sow soybean now?', label: 'Sowing advice (English)' },
    { message: 'क्या अभी बुवाई करनी चाहिए?', label: 'Sowing advice (Hindi)' },
    { message: 'What is the monsoon forecast?', label: 'Monsoon forecast' },
  ];

  for (const test of testMessages) {
    try {
      console.log(`📤 Test: "${test.label}"`);
      const start = Date.now();

      const res = await axios.post(`${BASE_URL}/api/ai/chat`, {
        message: test.message,
        locationId: 'raj-jai-chomu',
        crop: 'Soybean'
      }, { timeout: 15000 });

      const data = res.data?.data || res.data;
      const ms = Date.now() - start;

      console.log(`✅ Status    : ${res.status} OK (${ms}ms)`);
      console.log(`🤖 Provider  : ${data.provider}`);
      console.log(`🌐 Live AI?  : ${data.isLiveAI ? '✅ YES — Gemini is responding!' : '⚠️  NO — using local fallback'}`);
      console.log(`💬 Reply     : ${data.reply?.slice(0, 120)}...`);
      console.log('─'.repeat(70));
    } catch (err) {
      console.error(`❌ FAILED: ${err.response?.data?.message || err.message}`);
      console.log('─'.repeat(70));
    }
  }
}

testChatbot();
