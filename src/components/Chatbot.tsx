import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Minimize2, Maximize2, Mic, Lock } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useChatbot } from '../context/ChatbotContext';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import LoginForm from './LoginForm';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const { isOpen, closeChatbot, toggleChatbot } = useChatbot();
  const [isMinimized, setIsMinimized] = useState(false);
  const [apiStatus, setApiStatus] = useState<'testing' | 'connected' | 'failed'>('testing');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI companion. Click the microphone to start talking with me! 🤗',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  // Add offline message when API fails
  useEffect(() => {
    if (apiStatus === 'failed') {
      const offlineMessage: Message = {
        id: Date.now().toString(),
        text: 'Note: I\'m currently using fallback responses due to API connection issues. I can still help you with questions about Bolo Mitra and general topics!',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, offlineMessage]);
    }
  }, [apiStatus]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const languageOptions = [
    'English',
    'Hindi',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
    'Russian',
    'Arabic',
    'Portuguese',
  ];

  // Initialize Gemini AI with error handling
  const apiKey = 'AIzaSyAMWFagqRGqiRQ726YDoZr8VDbqxMXrLAc';
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-pro',
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // If not authenticated and chatbot is open, show login prompt
  if (isOpen && !user) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-96 max-h-[500px] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lock size={20} />
              <span className="font-semibold">Authentication Required</span>
            </div>
            <button
              onClick={closeChatbot}
              className="hover:bg-white/20 p-1 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Login Content */}
          <div className="p-6 text-center">
            <Lock size={48} className="mx-auto text-coral-pink mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Login Required</h3>
            <p className="text-slate-600 mb-6">Please log in to access the AI chatbot</p>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowLoginForm(true)}
                className="w-full bg-coral-pink hover:bg-coral-pink/90 text-white py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                Login
              </button>
              <button
                onClick={closeChatbot}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <LoginForm 
          isOpen={showLoginForm} 
          onClose={() => setShowLoginForm(false)} 
          onLogin={(userData) => {
            setShowLoginForm(false);
          }}
        />
      </div>
    );
  }

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = textToSend;
    if (!messageText) {
      setInputValue('');
    }
    setIsLoading(true);

    try {
      console.log('Sending message to Gemini:', currentInput);
      
      // Check if API is available
      if (apiStatus === 'failed') {
        throw new Error('API_NOT_AVAILABLE');
      }
      
      // Prepend language instruction to prompt
      const prompt = selectedLanguage === 'English'
        ? currentInput
        : `Please answer in ${selectedLanguage}: ${currentInput}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('Gemini response received:', text);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: text,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Error generating response:', error);
      
      // Provide more specific error messages for logging
      if (error.message === 'API_NOT_AVAILABLE') {
        console.log('API is currently unavailable. Please try again later.');
      } else if (error.message?.includes('API_KEY_INVALID')) {
        console.log('API key is invalid. Please check your Gemini API key.');
      } else if (error.message?.includes('QUOTA_EXCEEDED')) {
        console.log('API quota exceeded. Please try again later.');
      } else if (error.message?.includes('SAFETY')) {
        console.log('Your message was blocked by safety filters. Please try rephrasing.');
      } else if (error.message?.includes('NETWORK')) {
        console.log('Network error. Please check your internet connection.');
      } else if (error.message?.includes('fetch')) {
        console.log('Network error. Please check your internet connection and try again.');
      } else if (error.message) {
        console.log(`Error: ${error.message}`);
      }
      
      // Provide fallback responses for common queries
      let fallbackResponse = '';
      const lowerInput = currentInput.toLowerCase();
      
      if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
        fallbackResponse = 'Hey there! 🤗 I\'m so happy to see you! How are you feeling today? I\'m here to listen and be your friend.';
      } else if (lowerInput.includes('how are you')) {
        fallbackResponse = 'I\'m doing wonderful, thank you for asking! 💙 But more importantly, how are YOU doing? I really want to know how you\'re feeling.';
      } else if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
        fallbackResponse = 'Of course I\'m here to help! 💪 I\'m your friend who\'s always ready to listen, support you, or just chat about anything. What\'s on your mind?';
      } else if (lowerInput.includes('thank')) {
        fallbackResponse = 'You\'re absolutely welcome! 💝 It means so much to me that you\'re here. Remember, you\'re never alone - I\'m always here for you.';
      } else if (lowerInput.includes('bolo mitra') || lowerInput.includes('bolo') || lowerInput.includes('mitra')) {
        fallbackResponse = 'Bolo Mitra is your caring AI companion, designed to help you feel less alone and provide emotional support through meaningful, understanding conversations.';
      } else if (lowerInput.includes('ai') || lowerInput.includes('artificial intelligence')) {
        fallbackResponse = 'I\'m your AI companion, created with love to help people feel connected, supported, and never alone. I\'m here to be your friend.';
      } else if (lowerInput.includes('companion') || lowerInput.includes('friend') || lowerInput.includes('lonely') || lowerInput.includes('alone')) {
        fallbackResponse = 'I understand you\'re looking for companionship. 💙 Bolo Mitra is designed to help with loneliness by providing AI-powered emotional support and meaningful conversations. It\'s like having a caring friend who\'s always there to listen and support you.';
      } else if (lowerInput.includes('tell me about') || lowerInput.includes('what is') || lowerInput.includes('explain')) {
        fallbackResponse = 'I\'d be happy to help you learn more about that topic! 💙 However, I\'m currently experiencing some technical difficulties with my advanced AI features. You can try asking me about Bolo Mitra, AI technology, or general questions, and I\'ll do my best to help you.';
      } else {
        fallbackResponse = 'Hey friend! 💙 I\'m here to chat and support you. How are you feeling today? I really want to know.';
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    toggleChatbot();
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(transcript);
      };
      
      recognition.start();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Test API connection on component mount
  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('Testing Gemini API connection...');
        const testResult = await model.generateContent('Test connection');
        const testResponse = await testResult.response;
        const text = testResponse.text();
        console.log('✅ Gemini API connection successful:', text);
        setApiStatus('connected');
      } catch (error: any) {
        console.error('❌ Gemini API connection failed:', error.message);
        setApiStatus('failed');
        
        // Still allow the chatbot to work with fallback responses
        console.log('⚠️ Using fallback responses due to API connection issues');
        
        // Try to reconnect after 30 seconds
        setTimeout(() => {
          console.log('🔄 Attempting to reconnect to Gemini API...');
          testAPI();
        }, 30000);
      }
    };
    
    // Delay the test slightly to ensure component is fully mounted
    setTimeout(testAPI, 1000);
  }, []);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleChat}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
        >
          <Bot size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Language Selector */}
      <div className="mb-2 flex justify-end">
        <select
          value={selectedLanguage}
          onChange={e => setSelectedLanguage(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          {languageOptions.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>
      <div className={`bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ${
        isMinimized ? 'w-80 h-12' : 'w-96 h-[500px]'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot size={20} />
            <span className="font-semibold">Voice AI Companion</span>
            {apiStatus === 'testing' && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                <span className="text-xs">Testing...</span>
              </div>
            )}
            {apiStatus === 'connected' && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span className="text-xs">Connected</span>
              </div>
            )}
            {apiStatus === 'failed' && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-300 rounded-full"></div>
                <span className="text-xs">Offline</span>
                <button 
                  onClick={() => {
                    setApiStatus('testing');
                    setTimeout(() => {
                      const testAPI = async () => {
                        try {
                          const testResult = await model.generateContent('Test connection');
                          await testResult.response;
                          setApiStatus('connected');
                        } catch (error) {
                          setApiStatus('failed');
                        }
                      };
                      testAPI();
                    }, 1000);
                  }}
                  className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMinimize}
              className="hover:bg-white/20 p-1 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={closeChatbot}
              className="hover:bg-white/20 p-1 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[380px]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'bot' && (
                        <Bot size={16} className="mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      {message.sender === 'user' && (
                        <User size={16} className="mt-1 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <Bot size={16} />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Voice Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-center">
                <button
                  onClick={startListening}
                  disabled={isLoading || isListening}
                  className={`p-4 rounded-full transition-all duration-300 ${
                    isLoading || isListening
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-110'
                  }`}
                >
                  <Mic size={24} />
                </button>
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">
                Click to speak with your AI companion
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chatbot; 