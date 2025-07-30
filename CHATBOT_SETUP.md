# Gemini Chatbot Setup Guide

## Prerequisites

1. **Get a Gemini API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the API key

## Setup Instructions

1. **Create Environment File:**
   Create a `.env` file in the root directory of your project with the following content:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
   Replace `your_actual_api_key_here` with your actual Gemini API key.

2. **Install Dependencies:**
   ```bash
   npm install @google/generative-ai
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

## Features

The chatbot includes:
- ✅ Modern, responsive chat interface
- ✅ Real-time conversation with Gemini AI
- ✅ Minimize/maximize functionality
- ✅ Message history with timestamps
- ✅ Typing indicators
- ✅ Error handling
- ✅ Keyboard shortcuts (Enter to send)
- ✅ Auto-scroll to latest messages

## Usage

1. Click the chat bubble icon in the bottom-right corner to open the chatbot
2. Type your message and press Enter or click the send button
3. The AI will respond using Gemini's advanced language model
4. You can minimize the chat window or close it entirely

## Security Notes

- Never commit your `.env` file to version control
- The API key is only used on the client side for this demo
- For production, consider implementing server-side API calls for better security

## Troubleshooting

- **"API key not found" error:** Make sure your `.env` file is in the root directory and contains the correct API key
- **"Network error" error:** Check your internet connection and ensure the API key is valid
- **Chatbot not appearing:** Make sure the Chatbot component is properly imported in `App.tsx` 