import React from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';

const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-espresso flex flex-col items-center justify-center">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-6"
      >
        <UtensilsCrossed className="w-8 h-8 text-gold" />
      </motion.div>
      <h2 className="text-xl font-serif font-bold text-offwhite mb-2 tracking-wide">
        TiffinFlex
      </h2>
      <div className="flex gap-1.5 mt-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -8, 0],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
            className="w-2 h-2 bg-gold rounded-full"
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingPage;
