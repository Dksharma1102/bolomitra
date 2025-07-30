import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, X, Minimize2, Maximize2 } from 'lucide-react';
import { useChatbot } from '../context/ChatbotContext';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isVoice?: boolean;
}

interface VoiceChatbotProps {
  selectedAvatar: {
    name: string;
    image: string;
    personality: string;
    voice: string;
    color: string;
  };
}

const VoiceChatbot: React.FC<VoiceChatbotProps> = ({ selectedAvatar }) => {
  console.log('VoiceChatbot rendering with avatar:', selectedAvatar.name);
  
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! I'm ${selectedAvatar.name}. ${selectedAvatar.personality}. I'm so excited to be your voice AI companion! Click the microphone to start talking with me! 🤗`,
      sender: 'bot',
      timestamp: new Date(),
      isVoice: true
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [apiStatus, setApiStatus] = useState<'testing' | 'connected' | 'failed'>('testing');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const { closeAvatarSelection } = useChatbot();

  // Remove authentication check since user is already authenticated
  // const [user, setUser] = useState<FirebaseUser | null>(null);
  // const [showLoginForm, setShowLoginForm] = useState(false);

  // useEffect(() => {
  //   const auth = getAuth();
  //   const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
  //     setUser(firebaseUser);
  //   });
  //   return () => unsubscribe();
  // }, []);

  // Remove authentication check - user is already authenticated
  // if (isOpen && !user) {
  //   return (
  //     // ... authentication modal
  //   );
  // }

  // Initialize Gemini AI
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

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('Listening...');
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map(result => result.transcript)
          .join('');
        
        setTranscript(transcript);
        setIsListening(false);
        
        // Add user message
        const userMessage: Message = {
          id: Date.now().toString(),
          text: transcript,
          sender: 'user',
          timestamp: new Date(),
          isVoice: true
        };
        setMessages(prev => [...prev, userMessage]);
        
        // Generate AI response
        generateAIResponse(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setTranscript('');
        
        // Add error message
        const errorMessage: Message = {
          id: Date.now().toString(),
          text: `Sorry, I couldn't hear you clearly. Please try again.`,
          sender: 'bot',
          timestamp: new Date(),
          isVoice: true
        };
        setMessages(prev => [...prev, errorMessage]);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setTranscript('');
      };
    } else {
      console.error('Speech recognition not supported');
      setApiStatus('failed');
    }

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
      console.log('Speech synthesis initialized');
      
      // Ensure voices are loaded
      const loadVoices = () => {
        const voices = synthesisRef.current?.getVoices();
        console.log('Available voices:', voices?.length || 0);
      };
      
      // Load voices immediately if available
      loadVoices();
      
      // Also listen for voices to be loaded
      synthesisRef.current.addEventListener('voiceschanged', loadVoices);
    } else {
      console.error('Speech synthesis not supported');
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        console.log('⚠️ Using fallback responses due to API connection issues');
      }
    };
    
    setTimeout(testAPI, 1000);
  }, []);

  const startListening = async () => {
    if (!recognitionRef.current) {
      console.error('Speech recognition not available');
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
      setTranscript('');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setTranscript('');
  };

  const speakResponse = (text: string) => {
    if (!synthesisRef.current) {
      console.error('Speech synthesis not available');
      return;
    }

    // Cancel any ongoing speech
    synthesisRef.current.cancel();

    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    utterance.rate = 0.9; // Slightly slower for natural feel
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0; // Full volume
    
    // Try to set a female voice for better AI companion feel
    const voices = synthesisRef.current.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.lang.includes('en') && 
      (voice.name.includes('female') || voice.name.includes('Samantha') || voice.name.includes('Victoria'))
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      console.log('AI started speaking:', text);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      console.log('AI finished speaking');
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    // Start speaking
    synthesisRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
      console.log('AI speech stopped');
    }
  };

  const generateAIResponse = async (userInput: string) => {
    try {
      console.log('Generating AI response for:', userInput);
      
      if (apiStatus === 'failed') {
        throw new Error('API_NOT_AVAILABLE');
      }
      
      // Create a context-aware prompt
      const contextPrompt = `You are ${selectedAvatar.name}, an AI companion with the personality: ${selectedAvatar.personality}. 
      
      The user just said: "${userInput}"
      
      Please respond as ${selectedAvatar.name} in a conversational, supportive, and empathetic way. Keep your response natural and helpful, as if you're having a real conversation. Don't be too formal or robotic.`;
      
      const result = await model.generateContent(contextPrompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('AI response received:', text);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: text,
        sender: 'bot',
        timestamp: new Date(),
        isVoice: true
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Speak the AI response
      speakResponse(text);
      
    } catch (error: any) {
      console.error('Error generating response:', error);
      
      let fallbackResponse = '';
      const lowerInput = userInput.toLowerCase();
      
      if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
        fallbackResponse = `Hey there! 🤗 I'm ${selectedAvatar.name}, and I'm so happy to see you! How are you feeling today? I'm here to listen and be your friend.`;
      } else if (lowerInput.includes('how are you')) {
        fallbackResponse = `I'm doing wonderful, thank you for asking! 💙 But more importantly, how are YOU doing? I really want to know how you're feeling.`;
      } else if (lowerInput.includes('lonely') || lowerInput.includes('alone')) {
        fallbackResponse = `I understand you're feeling lonely, and I want you to know that you're not alone. 💙 I'm here for you, and I care about you. Would you like to tell me more about what's on your mind? I'm listening.`;
      } else if (lowerInput.includes('sad') || lowerInput.includes('depressed')) {
        fallbackResponse = `I'm sorry you're feeling this way. 💙 It's okay to feel sad sometimes - we all do. I'm here to listen and support you. Would you like to talk about what's bothering you? I really care about how you're feeling.`;
      } else if (lowerInput.includes('happy') || lowerInput.includes('good') || lowerInput.includes('great')) {
        fallbackResponse = `That's wonderful! 🌟 I'm so glad you're feeling good! I'd love to hear more about what's making you happy! Your happiness makes me happy too!`;
      } else if (lowerInput.includes('thank')) {
        fallbackResponse = `You're absolutely welcome! 💝 It means so much to me that you're here. Remember, you're never alone - I'm always here for you.`;
      } else if (lowerInput.includes('bye') || lowerInput.includes('goodbye')) {
        fallbackResponse = `Goodbye! 💙 It was wonderful talking with you. I'll be here when you want to chat again! Take care of yourself!`;
      } else {
        fallbackResponse = `I hear you, and I'm here to support you. 💙 Would you like to tell me more about how you're feeling or what's on your mind? I really care about you.`;
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        sender: 'bot',
        timestamp: new Date(),
        isVoice: true
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Speak the fallback response
      speakResponse(fallbackResponse);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const closeChat = () => {
    setIsOpen(false);
    closeAvatarSelection();
    stopSpeaking(); // Stop any ongoing speech when closing the chat
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ${
        isMinimized ? 'w-80 h-12' : 'w-96 h-[500px]'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={selectedAvatar.image}
              alt={selectedAvatar.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <span className="font-semibold">{selectedAvatar.name}</span>
              <div className="flex items-center space-x-1">
                {apiStatus === 'connected' && (
                  <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                )}
                {apiStatus === 'failed' && (
                  <div className="w-2 h-2 bg-red-300 rounded-full"></div>
                )}
                <span className="text-xs">Voice Chat</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMinimize}
              className="hover:bg-white/20 p-1 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={closeChat}
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
                        <img
                          src={selectedAvatar.image}
                          alt={selectedAvatar.name}
                          className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                        {message.isVoice && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Volume2 size={12} className="opacity-60" />
                            <span className="text-xs opacity-60">Voice</span>
                          </div>
                        )}
                      </div>
                      {message.sender === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-semibold">You</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isListening && (
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-lg px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <Mic size={16} className="animate-pulse" />
                      <span className="text-sm">{transcript || 'Listening...'}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {isSpeaking && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <img
                        src={selectedAvatar.image}
                        alt={selectedAvatar.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-coral-pink rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-coral-pink rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-coral-pink rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Voice Controls */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-center">
                {!isListening ? (
                  <button
                    onClick={startListening}
                    disabled={isSpeaking}
                    className="flex items-center space-x-2 px-6 py-3 bg-coral-pink text-white rounded-full font-semibold hover:bg-coral-pink/90 transition-colors disabled:bg-gray-400"
                  >
                    <Mic size={20} />
                    <span>Start Talking</span>
                  </button>
                ) : (
                  <button
                    onClick={stopListening}
                    className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors"
                  >
                    <MicOff size={20} />
                    <span>Stop Listening</span>
                  </button>
                )}
              </div>
              
              {/* Instructions */}
              <div className="text-center mt-2">
                <p className="text-xs text-gray-500">
                  {!recognitionRef.current ? 
                    'Speech recognition not supported in this browser' : 
                    'Click "Start Talking" and speak clearly'
                  }
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceChatbot; 