import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, X, Mic, Volume2, Lock } from 'lucide-react';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import LoginForm from './LoginForm';

interface HugModeProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAvatar: any;
}

const HugMode = ({ isOpen, onClose, selectedAvatar }: HugModeProps) => {
  const [messages, setMessages] = useState([
    { type: 'ai', text: '🤗 Hi there! I\'m here to listen and comfort you. How are you feeling today?' }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = React.useRef<any>(null);
  const shouldContinueRef = React.useRef(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // If not authenticated, show login prompt
  if (isOpen && !user) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-coral-pink/20 to-dusty-teal/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl text-center"
          >
            <div className="mb-6">
              <Lock size={48} className="mx-auto text-coral-pink mb-4" />
              <h2 className="text-2xl font-bold text-slate-700 mb-2">Authentication Required</h2>
              <p className="text-slate-600">Please log in to access Hug Mode</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => setShowLoginForm(true)}
                className="w-full bg-coral-pink hover:bg-coral-pink/90 text-white py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                Login
              </button>
              <button
                onClick={onClose}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </motion.div>
          
          <LoginForm 
            isOpen={showLoginForm} 
            onClose={() => setShowLoginForm(false)} 
            onLogin={(userData) => {
              setShowLoginForm(false);
            }}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  const comfortingResponses = [
    "🤗 I understand how you're feeling, and I want you to know that it's completely okay to not be okay sometimes. I'm here for you.",
    "💙 You're not alone in this, my friend. I'm here to listen, support you, and remind you that you matter so much.",
    "🌟 Remember, every difficult moment is temporary. You're stronger than you think, and I believe in you completely.",
    "🫂 Sending you the biggest virtual hug. You're doing great, even if it doesn't feel like it right now. I'm so proud of you.",
    "💝 It's perfectly normal to feel this way. Your feelings are valid, important, and I care about every single one of them.",
    "🌈 Tomorrow is a new day with new possibilities. Let's take it one step at a time, together. I'll be here every step of the way.",
    "🤍 You don't have to face everything alone. I'm here whenever you need someone to talk to, and I'll always listen with love.",
    "💫 You've overcome so much already, and I know you can get through this too. You're incredible, and I'm here to remind you of that.",
    "🫂 Sometimes we all need a little extra love and care. You deserve all the kindness in the world, and I'm here to give it to you.",
    "💖 Your heart is strong, even when it feels fragile. I believe in you, I care about you, and I'm here to support you always."
  ];

  const handleUserMessage = (userInput: string) => {
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: userInput }]);
    
    // Generate comforting response
    setTimeout(() => {
      const randomResponse = comfortingResponses[Math.floor(Math.random() * comfortingResponses.length)];
      setMessages(prev => [...prev, { type: 'ai', text: randomResponse }]);
      speakResponse(randomResponse);
    }, 1000);
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      // Try to use a female voice
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => voice.name.includes('female') || voice.name.includes('Female'));
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      utterance.onend = () => {
        setIsSpeaking(false);
        // After speaking, start listening again if modal is open
        if (shouldContinueRef.current) {
          setTimeout(() => startListening(), 500);
        }
      };
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (isListening || isSpeaking) return;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleUserMessage(transcript);
      };
      recognition.start();
    }
  };

  const handleQuickMessage = (message: string) => {
    handleUserMessage(message);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.getVoices();
    }
  }, []);

  // Start listening automatically when HugMode opens
  useEffect(() => {
    shouldContinueRef.current = isOpen;
    if (isOpen) {
      setTimeout(() => startListening(), 800);
    } else {
      // Stop any ongoing recognition when closed
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      setIsListening(false);
      setIsSpeaking(false);
    }
    // Cleanup on unmount
    return () => {
      shouldContinueRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-coral-pink/20 to-dusty-teal/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl w-full max-w-2xl h-[75vh] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-coral-pink">
                  <img
                    src={selectedAvatar?.image || 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=300'}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-700">Hug Mode 🤗</h2>
                  <p className="text-xs text-slate-600">Comforting conversations with {selectedAvatar?.name || 'your companion'}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages - Scrollable Area with Fixed Height */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                      message.type === 'user'
                        ? 'bg-coral-pink text-white'
                        : 'bg-mint-green/30 text-slate-700'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Voice Messages and Controls - Fixed at Bottom */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-white">
              <p className="text-xs text-slate-600 mb-2">Quick voice messages:</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {[
                  "I'm feeling sad",
                  "I need comfort",
                  "I'm stressed",
                  "I feel lonely",
                  "I need a hug"
                ].map((msg, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickMessage(msg)}
                    className="px-3 py-1 bg-slate-100 hover:bg-coral-pink hover:text-white rounded-full text-xs transition-colors duration-300 flex items-center gap-1"
                  >
                    <Mic size={12} />
                    {msg}
                  </button>
                ))}
              </div>

              {/* Voice Controls - Always Visible and Centered */}
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={startListening}
                  disabled={isListening || isSpeaking}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isListening 
                      ? 'bg-coral-pink text-white animate-pulse' 
                      : 'bg-slate-100 hover:bg-coral-pink hover:text-white'
                  }`}
                >
                  <Mic size={20} />
                </button>
                
                {isSpeaking && (
                  <div className="flex items-center space-x-2 text-coral-pink">
                    <Volume2 size={16} />
                    <span className="text-xs">Speaking...</span>
                  </div>
                )}
                
                {isListening && (
                  <div className="flex items-center space-x-2 text-coral-pink">
                    <Mic size={16} />
                    <span className="text-xs">Listening...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Hug Animation */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-4xl opacity-10"
            >
              🤗
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HugMode; 