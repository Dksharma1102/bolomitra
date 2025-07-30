import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  User, 
  MessageSquare, 
  Heart, 
  BarChart3, 
  Shield, 
  Mic,
  Camera,
  Brain,
  Clock,
  Lock
} from 'lucide-react';
import { useChatbot } from '../context/ChatbotContext';

const KeyFeatures = () => {
  const { openChatbot } = useChatbot();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const features = [
    // Features removed as requested
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-mint-green/5 to-dusty-teal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-700 mb-6">
            🧠 Key <span className="text-coral-pink">AI Features</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Advanced AI technology for meaningful conversations and companionship
          </p>
        </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg">
            <h3 className="text-2xl font-bold text-slate-700 mb-4">
              AI Features Coming Soon
            </h3>
            <p className="text-lg text-slate-600">
              We're working on bringing you the most advanced AI companionship features. Stay tuned for updates!
            </p>
              </div>
            </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-coral-pink/10 via-mint-green/10 to-dusty-teal/10 rounded-3xl p-12">
            <h3 className="text-3xl font-bold text-slate-700 mb-6">
              Ready to Meet Your AI Companion?
            </h3>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Join thousands who have found comfort, support, and friendship through Bolo Mitra
            </p>
            <button 
              onClick={openChatbot}
              className="group relative px-8 py-4 bg-gradient-to-r from-coral-pink to-dusty-teal text-white rounded-full font-semibold text-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Heart size={24} />
                Start Your Journey
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-dusty-teal to-coral-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default KeyFeatures;