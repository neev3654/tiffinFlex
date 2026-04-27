import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, ThumbsUp, IndianRupee, Users } from 'lucide-react';

const statsData = [
  { icon: UtensilsCrossed, value: 15000, suffix: '+', label: 'Meals Customized', color: 'text-gold' },
  { icon: ThumbsUp, value: 98, suffix: '%', label: 'Satisfaction Rate', color: 'text-emerald-400' },
  { icon: IndianRupee, value: 2.4, suffix: 'L Saved', label: 'By Our Subscribers', color: 'text-blue-400', decimals: 1 },
  { icon: Users, value: 2400, suffix: '+', label: 'Happy Subscribers', color: 'text-purple-400' },
];

/* Animated counter hook */
const useCounter = (target, duration = 2000, inView = false, decimals = 0) => {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      /* Ease-out cubic */
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration, decimals]);

  return count;
};

const StatCard = ({ icon: Icon, value, suffix, label, color, decimals = 0, index }) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const count = useCounter(value, 2000, inView, decimals);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className="text-center group"
    >
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-4 group-hover:border-gold/20 transition-colors">
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <p className="text-3xl md:text-4xl font-bold text-offwhite mb-1">
        {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}
        <span className={`${color}`}>{suffix}</span>
      </p>
      <p className="text-sm text-warm-grey">{label}</p>
    </motion.div>
  );
};

const Stats = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto" id="stats">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-cocoa border border-white/5 rounded-3xl p-10 md:p-14"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {statsData.map((stat, i) => (
            <StatCard key={stat.label} {...stat} index={i} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Stats;
