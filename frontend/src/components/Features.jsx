import React from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Clock, Truck } from 'lucide-react';

const features = [
  {
    icon: SlidersHorizontal,
    title: 'Choose Plan',
    description: 'Select a subscription that fits your lifestyle. Starter, Regular, or Pro.',
  },
  {
    icon: Clock,
    title: 'Customize by 10AM',
    description: 'Swap, skip, or double up on portions before the morning cutoff.',
  },
  {
    icon: Truck,
    title: 'Hot Delivery',
    description: 'Arrives in premium insulated tiffins, ready to eat immediately.',
  },
];

const Features = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-espresso">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-serif font-bold text-center text-offwhite mb-16"
        >
          Simple as Ordering Chai
        </motion.h2>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-cocoa border border-white/5 rounded-2xl p-8 text-center hover:border-gold/30 transition-colors duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-gold" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-serif font-bold text-offwhite mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-warm-grey text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
