import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Lock, ArrowLeft } from 'lucide-react';
import { useChatbot } from '../context/ChatbotContext';
import VoiceChatbot from './VoiceChatbot';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import LoginForm from './LoginForm';

interface Avatar {
  id: string;
  name: string;
  image: string;
  personality: string;
  voice: string;
  color: string;
}

const avatars: Avatar[] = [
  {
    id: '1',
    name: 'Aria',
    image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=300',
    personality: 'Cheerful & Optimistic',
    voice: 'Cheerful and light-hearted',
    color: 'coral-pink'
  },
  {
    id: '2',
    name: 'Maya',
    image: 'https://images.pexels.com/photos/4946515/pexels-photo-4946515.jpeg?auto=compress&cs=tinysrgb&w=300',
    personality: 'Calm & Thoughtful',
    voice: 'Calm and soothing',
    color: 'dusty-teal'
  },
  {
    id: '3',
    name: 'Zara',
    image: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=300',
    personality: 'Energetic & Fun',
    voice: 'Energetic and enthusiastic',
    color: 'mint-green'
  }
];

const AvatarSelection: React.FC = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const { showAvatarSelection, closeAvatarSelection } = useChatbot();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [showLoginForm, setShowLoginForm] = useState(false);

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  if (!showAvatarSelection) {
    return null;
  }

  // If not authenticated, show login prompt
  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl text-center"
        >
          <div className="mb-6">
            <Lock size={48} className="mx-auto text-coral-pink mb-4" />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Authentication Required</h2>
            <p className="text-slate-600">Please log in to select your AI companion</p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => setShowLoginForm(true)}
              className="w-full bg-coral-pink hover:bg-coral-pink/90 text-white py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              Login
            </button>
            <button
              onClick={closeAvatarSelection}
              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              Cancel
            </button>
          </div>

          <LoginForm 
            isOpen={showLoginForm} 
            onClose={() => setShowLoginForm(false)} 
            onLogin={(userData) => {
              setShowLoginForm(false);
            }}
          />
        </motion.div>
      </div>
    );
  }

  if (showVoiceChat && selectedAvatar) {
    return (
      <VoiceChatbot 
        selectedAvatar={selectedAvatar} 
        key={selectedAvatar.id} // Add key to force re-render
      />
    );
  }

  const handleAvatarSelect = (avatar: Avatar) => {
    console.log('Avatar selected:', avatar.name);
    setSelectedAvatar(avatar);
    // Transition to voice chat after a brief delay
    setTimeout(() => {
      console.log('Transitioning to voice chat...');
      setShowVoiceChat(true);
    }, 1000); // Reduced delay
  };

  const goBack = () => {
    console.log('Going back to avatar selection');
    setSelectedAvatar(null);
    setShowVoiceChat(false);
  };

  if (!selectedAvatar) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-700 mb-4">Choose Your AI Companion</h2>
            <p className="text-slate-600">Select an avatar that resonates with you. Each companion has a unique personality and voice.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {avatars.map((avatar) => (
              <motion.div
                key={avatar.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAvatarSelect(avatar)}
                className="bg-gray-50 rounded-xl p-6 cursor-pointer border-2 border-transparent hover:border-coral-pink transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={avatar.image}
                    alt={avatar.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-700">{avatar.name}</h3>
                    <p className="text-sm text-slate-500">{avatar.voice}</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm">{avatar.personality}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={closeAvatarSelection}
              className="text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft size={20} className="inline mr-2" />
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={selectedAvatar.image}
              alt={selectedAvatar.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-slate-700">{selectedAvatar.name}</h2>
              <p className="text-sm text-slate-500">Your AI Companion</p>
            </div>
          </div>
          <button
            onClick={goBack}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-coral-pink rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-coral-pink rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-coral-pink rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-slate-600">Preparing your voice chat with {selectedAvatar.name}...</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AvatarSelection; 