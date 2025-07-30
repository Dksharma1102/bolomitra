import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Crown, MessageCircle, Heart, Calendar } from 'lucide-react';

const ServicesSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const services = [
    {
      icon: Crown,
      title: 'Premium Membership',
      description: 'Unlock advanced features and unlimited conversations',
      color: 'from-coral-pink to-dusty-teal'
    },
    {
      icon: MessageCircle,
      title: 'Daily Conversations',
      description: 'Regular check-ins and meaningful daily interactions',
      color: 'from-mint-green to-dusty-teal'
    },
    {
      icon: Heart,
      title: 'Mental Health Support',
      description: 'Professional guidance and emotional wellness resources',
      color: 'from-dusty-teal to-stone-blue'
    },
    {
      icon: Calendar,
      title: 'Emotional Check-ins',
      description: 'Regular mood tracking and personalized support',
      color: 'from-stone-blue to-coral-pink'
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-mint-green/5 to-dusty-teal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-700 mb-6">
            Our <span className="text-coral-pink">Services</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            More than a business company – We are a digital family
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                <div className={`bg-gradient-to-r ${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4 text-center">{service.title}</h3>
                <p className="text-slate-600 text-center leading-relaxed">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;