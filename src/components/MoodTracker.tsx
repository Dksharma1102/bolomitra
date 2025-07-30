import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  TrendingUp, 
  Calendar, 
  Heart, 
  Smile, 
  Meh, 
  Frown,
  BarChart3,
  Target,
  Award
} from 'lucide-react';

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(2);
  const [weekData, setWeekData] = useState([3, 4, 2, 5, 3, 4, 4]);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const moods = [
    { icon: Frown, label: 'Sad', color: 'text-red-400', bg: 'bg-red-100' },
    { icon: Meh, label: 'Okay', color: 'text-yellow-400', bg: 'bg-yellow-100' },
    { icon: Smile, label: 'Good', color: 'text-green-400', bg: 'bg-green-100' },
    { icon: Heart, label: 'Great', color: 'text-coral-pink', bg: 'bg-coral-pink/20' },
    { icon: Award, label: 'Amazing', color: 'text-purple-400', bg: 'bg-purple-100' }
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const insights = [
    {
      icon: TrendingUp,
      title: 'Mood Trend',
      value: '+15%',
      description: 'Your mood has improved this week!'
    },
    {
      icon: Target,
      title: 'Daily Goal',
      value: '6/7',
      description: 'Days you checked in this week'
    },
    {
      icon: Heart,
      title: 'Support Sessions',
      value: '12',
      description: 'Conversations with your AI buddy'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setWeekData(prev => prev.map(val => Math.max(1, Math.min(5, val + (Math.random() - 0.5)))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-dusty-teal/10 via-mint-green/5 to-coral-pink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-700 mb-6">
            📊 Mood Tracker & <span className="text-coral-pink">Emotional Journal</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Track your emotional journey and celebrate your progress with AI-powered insights
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side - Mood Selection & Weekly Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Daily Mood Check-in */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-700 mb-6 flex items-center gap-3">
                <Calendar className="text-coral-pink" />
                How are you feeling today?
              </h3>
              
              <div className="grid grid-cols-5 gap-4 mb-6">
                {moods.map((mood, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMood(index)}
                    className={`p-4 rounded-2xl transition-all duration-300 ${
                      selectedMood === index 
                        ? `${mood.bg} scale-110 shadow-lg` 
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    <mood.icon 
                      size={32} 
                      className={`mx-auto mb-2 ${
                        selectedMood === index ? mood.color : 'text-slate-400'
                      }`} 
                    />
                    <p className={`text-sm font-medium ${
                      selectedMood === index ? 'text-slate-700' : 'text-slate-500'
                    }`}>
                      {mood.label}
                    </p>
                  </button>
                ))}
              </div>

              <button className="w-full bg-gradient-to-r from-coral-pink to-dusty-teal text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                Log Today's Mood
              </button>
            </div>

            {/* Weekly Mood Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-3">
                <BarChart3 className="text-coral-pink" />
                This Week's Journey
              </h3>
              
              <div className="flex items-end justify-between h-32 mb-4">
                {weekData.map((value, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${value * 20}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-gradient-to-t from-coral-pink to-dusty-teal rounded-t-lg w-8 min-h-[8px]"
                    />
                    <span className="text-xs text-slate-600">{days[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Insights & Recommendations */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* AI Insights */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-700 mb-6 flex items-center gap-3">
                <TrendingUp className="text-coral-pink" />
                AI Insights
              </h3>
              
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-mint-green/10 to-dusty-teal/10"
                  >
                    <div className="bg-coral-pink/20 p-3 rounded-xl">
                      <insight.icon size={24} className="text-coral-pink" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-slate-700">{insight.title}</h4>
                        <span className="text-lg font-bold text-coral-pink">{insight.value}</span>
                      </div>
                      <p className="text-sm text-slate-600">{insight.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-gradient-to-br from-coral-pink/10 to-dusty-teal/10 rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-slate-700 mb-6">🤖 AI Recommendations</h3>
              
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-2xl">
                  <h4 className="font-semibold text-slate-700 mb-2">🚶‍♀️ Take a Walk</h4>
                  <p className="text-sm text-slate-600">Based on your mood pattern, a 10-minute walk could boost your energy!</p>
                </div>
                
                <div className="bg-white/60 p-4 rounded-2xl">
                  <h4 className="font-semibold text-slate-700 mb-2">💭 Journal Time</h4>
                  <p className="text-sm text-slate-600">You haven't journaled in 2 days. Writing can help process emotions.</p>
                </div>
                
                <div className="bg-white/60 p-4 rounded-2xl">
                  <h4 className="font-semibold text-slate-700 mb-2">🎵 Music Therapy</h4>
                  <p className="text-sm text-slate-600">Your AI buddy suggests some calming music for relaxation.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Privacy Assurance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-slate-700 to-stone-blue rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-3">
              <Heart className="text-coral-pink" />
              Your Privacy Matters
            </h3>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              All your mood data and conversations are encrypted and stored securely. 
              You have complete control over your emotional journey data.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MoodTracker;