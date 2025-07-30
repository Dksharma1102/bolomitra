// Simple test script to verify Gemini API connection
// Run this with: node test-chatbot.js

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testGeminiAPI() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ No API key found! Please set VITE_GEMINI_API_KEY in your .env file');
    console.log('📝 Get your API key from: https://makersuite.google.com/app/apikey');
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    console.log('🔄 Testing Gemini API connection...');
    
    const result = await model.generateContent('Hello! Please respond with "API connection successful!"');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ API connection successful!');
    console.log('🤖 Response:', text);
    
  } catch (error) {
    console.log('❌ API connection failed:', error.message);
    console.log('💡 Make sure your API key is correct and you have internet connection');
  }
}

testGeminiAPI(); 