import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRightLeft, Clock, Star, Check } from 'lucide-react';

const SwapModal = ({ isOpen, onClose, currentMeal, swapOptions, mealType }) => {
  const [selected, setSelected] = useState(null);
  const [swapped, setSwapped] = useState(false);

  const handleSwap = () => {
    if (!selected) return;
    setSwapped(true);
    setTimeout(() => {
      setSwapped(false);
      setSelected(null);
      onClose(selected);
    }, 1500);
  };

  const handleClose = () => {
    setSelected(null);
    setSwapped(false);
    onClose(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-cocoa border border-white/10 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-white/5">
            <h2 className="text-xl font-serif font-bold text-offwhite flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-gold" /> Swap {mealType}
            </h2>
            <button onClick={handleClose} className="text-warm-grey hover:text-offwhite transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success State */}
          {swapped ? (
            <div className="p-10 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                <div className="w-20 h-20 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-10 h-10 text-emerald-400" />
                </div>
              </motion.div>
              <h3 className="text-2xl font-serif font-bold text-offwhite mb-2">Meal Swapped! 🎉</h3>
              <p className="text-warm-grey">Your {mealType?.toLowerCase()} has been updated.</p>
            </div>
          ) : (
            <>
              {/* Current Meal */}
              <div className="p-6 border-b border-white/5">
                <p className="text-xs text-warm-grey uppercase tracking-wider mb-3">Current {mealType}</p>
                <div className="flex items-center gap-4 bg-espresso rounded-xl p-4">
                  <img src={currentMeal?.image} alt={currentMeal?.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-bold text-offwhite">{currentMeal?.name}</h4>
                    <p className="text-xs text-warm-grey">{currentMeal?.calories} cal • ₹{currentMeal?.price}</p>
                  </div>
                </div>
              </div>

              {/* Cutoff Timer */}
              <div className="px-6 pt-4">
                <div className="flex items-center gap-2 text-xs text-gold bg-gold/5 border border-gold/20 px-4 py-2 rounded-full w-fit">
                  <Clock className="w-3 h-3" /> Swap cutoff: 10:00 AM today
                </div>
              </div>

              {/* Alternatives */}
              <div className="p-6">
                <p className="text-xs text-warm-grey uppercase tracking-wider mb-3">Choose Alternative</p>
                <div className="space-y-3">
                  {swapOptions?.map((meal) => (
                    <button
                      key={meal.id}
                      onClick={() => setSelected(meal)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                        selected?.id === meal.id ? 'border-gold bg-gold/5' : 'border-white/5 bg-espresso hover:border-gold/30'
                      }`}
                    >
                      <img src={meal.image} alt={meal.name} className="w-14 h-14 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h4 className="font-bold text-offwhite text-sm">{meal.name}</h4>
                        <p className="text-xs text-warm-grey">{meal.calories} cal • {meal.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-3 h-3 text-gold fill-gold" />
                          <span className="text-xs font-bold text-offwhite">{meal.rating}</span>
                        </div>
                        <span className="text-xs text-gold font-bold">₹{meal.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirm */}
              <div className="p-6 border-t border-white/5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSwap}
                  disabled={!selected}
                  className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    selected ? 'bg-gold text-espresso hover:bg-gold-light' : 'bg-white/5 text-warm-grey cursor-not-allowed'
                  }`}
                >
                  <ArrowRightLeft className="w-4 h-4" /> {selected ? `Swap to ${selected.name}` : 'Select a meal'}
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SwapModal;
