import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useChatbot } from '../context/ChatbotContext';
import VoiceChatbot from './VoiceChatbot';

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
    name: 'Priya',
    image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=300',
    personality: 'Warm and nurturing, like a caring friend who always listens',
    voice: 'Soft and comforting',
    color: 'coral-pink'
  },
  {
    id: '2',
    name: 'Arjun',
    image: 'https://images.pexels.com/photos/4946515/pexels-photo-4946515.jpeg?auto=compress&cs=tinysrgb&w=300',
    personality: 'Energetic and motivating, perfect for cheering you up',
    voice: 'Enthusiastic and encouraging',
    color: 'mint-green'
  },
  {
    id: '3',
    name: 'Maya',
    image: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=300',
    personality: 'Wise and thoughtful, great for deep conversations',
    voice: 'Calm and reflective',
    color: 'dusty-teal'
  },
  {
    id: '4',
    name: 'Rohan',
    image: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=300',
    personality: 'Fun and playful, always ready for a good laugh',
    voice: 'Cheerful and light-hearted',
    color: 'coral-pink'
  }
];

const AvatarSelection: React.FC = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const { showAvatarSelection, closeAvatarSelection } = useChatbot();

  if (!showAvatarSelection) {
    return null;
  }

  if (showVoiceChat && selectedAvatar) {
    return <VoiceChatbot selectedAvatar={selectedAvatar} />;
  }

  const handleAvatarSelect = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
    // Transition to voice chat after a brief delay
    setTimeout(() => {
      setShowVoiceChat(true);
    }, 1500);
  };

  const goBack = () => {
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