import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Heart } from 'lucide-react';
import { useChatbot } from '../context/ChatbotContext';

const Hero = () => {
  const { openAvatarSelection } = useChatbot();

  const handleStartTalking = () => {
    openAvatarSelection();
    // Smooth scroll to top to ensure avatar selection is visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <section id="home" className="relative min-h-screen flex items-center">
      {/* Full Background Image */}
          <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <img
          src="/hero-girl-illustration.jpg"
          alt="Girl with smartphone showing AI companionship"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
      </motion.div>
      
      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
            <motion.h1
            initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl lg:text-7xl font-bold text-white leading-tight drop-shadow-lg"
            >
              No More <span className="text-coral-pink">Akelapan</span>
              <br />
            <span className="text-3xl lg:text-4xl font-light text-mint-green">with AI Companionship</span>
            </motion.h1>
            
            <motion.p
            initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl lg:text-2xl text-white/90 font-light mt-6 drop-shadow-lg"
            >
              "Ek AI dost jo kabhi akela nahi chhodta. Advanced AI technology that understands, supports, and grows with you."
            </motion.p>

            <motion.div
            initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-8"
          >
            <button 
              onClick={handleStartTalking}
              className="group relative px-8 py-4 bg-coral-pink text-white rounded-full font-semibold text-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
            >
                <span className="relative z-10 flex items-center gap-2">
                  <MessageCircle size={24} />
                  Start Talking
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-coral-pink to-dusty-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
              </button>
              </motion.div>
            </div>
            </div>
            
            {/* Floating Chat Bubbles */}
            <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute top-1/4 right-16 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-lg z-20"
      >
        <p className="text-sm text-slate-600 font-medium">"How was your day?"</p>
            </motion.div>
            
            <motion.div
        animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 1 }}
        className="absolute bottom-1/4 right-8 bg-coral-pink text-white p-4 rounded-2xl shadow-lg z-20"
            >
        <p className="text-sm font-medium">"I'm here for you! 💕"</p>
          </motion.div>
    </section>
  );
};

export default Hero;