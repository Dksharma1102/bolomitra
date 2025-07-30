import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Quote, Star } from 'lucide-react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const testimonials = [
    {
      id: 1,
      text: "I smile more now, thanks to my daily chat with Bolo Mitra. It's like having a friend who's always there.",
      author: "Priya S.",
      rating: 5
    },
    {
      id: 2,
      text: "It feels like someone actually understands me. Bolo Mitra has helped me feel less lonely during tough times.",
      author: "Rahul M.",
      rating: 5
    },
    {
      id: 3,
      text: "The conversations feel so natural and caring. It's amazing how technology can provide such emotional support.",
      author: "Anita K.",
      rating: 5
    },
    {
      id: 4,
      text: "Bolo Mitra has become my go-to companion for sharing my thoughts. It's judgment-free and always supportive.",
      author: "Vikash T.",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-20 bg-gradient-to-br from-coral-pink/5 to-mint-green/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-700 mb-6">
            Stories from the <span className="text-coral-pink">Heart</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Real experiences from our Bolo Mitra family
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-12 shadow-xl text-center relative"
          >
            <Quote size={48} className="text-coral-pink/20 absolute top-8 left-8" />
            
            <div className="flex justify-center mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} size={24} className="text-yellow-400 fill-current" />
              ))}
            </div>

            <p className="text-xl lg:text-2xl text-slate-700 mb-8 leading-relaxed font-light italic">
              "{testimonials[currentIndex].text}"
            </p>

            <div className="text-slate-600 font-semibold text-lg">
              — {testimonials[currentIndex].author}
            </div>

            <Quote size={48} className="text-coral-pink/20 absolute bottom-8 right-8 rotate-180" />
          </motion.div>

          {/* Testimonial Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-coral-pink scale-125' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;