import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AvatarPreview = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const avatars = [
    {
      id: 1,
      name: 'Aria',
      personality: 'Cheerful & Optimistic',
      image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-coral-pink to-dusty-teal'
    },
    {
      id: 2,
      name: 'Maya',
      personality: 'Calm & Thoughtful',
      image: 'https://images.pexels.com/photos/4946515/pexels-photo-4946515.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-mint-green to-stone-blue'
    },
    {
      id: 3,
      name: 'Zara',
      personality: 'Energetic & Fun',
      image: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-dusty-teal to-coral-pink'
    },
    {
      id: 4,
      name: 'Luna',
      personality: 'Wise & Caring',
      image: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-stone-blue to-mint-green'
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % avatars.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + avatars.length) % avatars.length);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-700 mb-6">
            Choose Your <span className="text-coral-pink">Mitra Look</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Personalize your AI companion with avatars that match your vibe
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Avatar Display */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-mint-green/10 to-dusty-teal/10 rounded-3xl p-8 text-center"
          >
            <div className={`bg-gradient-to-r ${avatars[currentIndex].color} w-48 h-48 mx-auto rounded-full p-2 mb-6`}>
              <img
                src={avatars[currentIndex].image}
                alt={avatars[currentIndex].name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">{avatars[currentIndex].name}</h3>
            <p className="text-lg text-slate-600">{avatars[currentIndex].personality}</p>
          </motion.div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-coral-pink hover:text-white transition-colors duration-300 group"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-coral-pink hover:text-white transition-colors duration-300 group"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dot Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {avatars.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentIndex ? 'bg-coral-pink' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvatarPreview;