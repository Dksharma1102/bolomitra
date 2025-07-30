import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Heart, MessageSquare, Shield } from 'lucide-react';

const WhySection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const features = [
    {
      icon: MessageSquare,
      title: 'AI-Powered Conversations',
      description: 'Advanced NLP technology creates natural, empathetic dialogue for meaningful conversations'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-700 mb-6">
            Why use <span className="text-coral-pink">Bolo Mitra</span>?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We use Bolo Mitra to provide instant, caring support and transform loneliness into genuine connection through a friendly digital companion.
          </p>
        </motion.div>

        <div className="flex justify-center">
          <div className="max-w-md">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gradient-to-br from-mint-green/10 to-dusty-teal/10 p-8 rounded-2xl text-center hover:shadow-xl transition-all duration-300 group hover:scale-105"
            >
              <div className="bg-coral-pink/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-coral-pink/20 transition-colors duration-300">
                <feature.icon size={32} className="text-coral-pink" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-4">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </motion.div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;