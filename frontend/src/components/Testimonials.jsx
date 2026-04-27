import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import testimonials from '../data/testimonials';

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  /* Auto-scroll every 4s */
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const go = (dir) => {
    clearInterval(intervalRef.current);
    setCurrent((prev) => {
      if (dir === 'next') return (prev + 1) % testimonials.length;
      return (prev - 1 + testimonials.length) % testimonials.length;
    });
  };

  const t = testimonials[current];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto" id="testimonials">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold text-sm font-bold px-4 py-1.5 rounded-full mb-5">
          ⭐ What Our Subscribers Say
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-offwhite mb-3">
          Loved by <span className="text-gold">2,400+</span> Happy Subscribers
        </h2>
        <p className="text-warm-grey max-w-xl mx-auto">
          Real stories from real people who transformed their daily meals.
        </p>
      </motion.div>

      {/* Carousel */}
      <div className="relative max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="bg-cocoa border border-white/5 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden"
          >
            {/* Quote icon bg */}
            <Quote className="absolute top-6 left-6 w-16 h-16 text-white/[0.03]" />

            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < t.rating ? 'text-gold fill-gold' : 'text-white/10'}`}
                />
              ))}
            </div>

            {/* Quote */}
            <p className="text-lg md:text-xl text-offwhite/90 font-medium leading-relaxed mb-8 italic">
              "{t.quote}"
            </p>

            {/* Avatar + Info */}
            <div className="flex items-center justify-center gap-4">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-12 h-12 rounded-full border-2 border-gold/30 object-cover"
              />
              <div className="text-left">
                <p className="text-sm font-bold text-offwhite">{t.name}</p>
                <p className="text-xs text-warm-grey">{t.role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nav Arrows */}
        <button
          onClick={() => go('prev')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-14 w-10 h-10 rounded-full bg-cocoa border border-white/10 flex items-center justify-center text-warm-grey hover:text-gold hover:border-gold/30 transition-all"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => go('next')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-14 w-10 h-10 rounded-full bg-cocoa border border-white/10 flex items-center justify-center text-warm-grey hover:text-gold hover:border-gold/30 transition-all"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => { clearInterval(intervalRef.current); setCurrent(i); }}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-gold' : 'w-2 bg-white/10 hover:bg-white/20'
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
