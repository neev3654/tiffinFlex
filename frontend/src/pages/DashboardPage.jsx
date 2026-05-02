import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, ArrowRightLeft, Flame, TrendingUp, ChefHat, Clock, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import SwapModal from '../components/SwapModal';
import weeklyMenu from '../data/weeklyMenu';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedDay, setSelectedDay] = useState(0);
  const [swapModal, setSwapModal] = useState({ open: false, meal: null, type: '' });
  const [menus, setMenus] = useState(weeklyMenu);
  const todayMenu = menus[selectedDay];

  const handleSwapClose = (swappedMeal) => {
    if (swappedMeal) {
      setMenus((prev) => prev.map((day, i) => {
        if (i !== selectedDay) return day;
        const field = swapModal.type === 'Lunch' ? 'lunch' : 'dinner';
        return { ...day, [field]: swappedMeal };
      }));
    }
    setSwapModal({ open: false, meal: null, type: '' });
  };

  const stats = [
    { icon: ArrowRightLeft, label: 'Swaps This Month', value: '12', color: 'text-gold' },
    { icon: Flame, label: 'Day Streak', value: '18', color: 'text-orange-400' },
    { icon: TrendingUp, label: 'Money Saved', value: '₹740', color: 'text-emerald-400' },
    { icon: Activity, label: 'Health Score', value: '85', color: 'text-blue-400', link: '/nutrition' },
  ];


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-espresso">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-offwhite mb-2">
            {getGreeting()}, <span className="text-gold">{user?.name?.split(' ')[0] || 'Chef'}</span>! 👋
          </h1>
          <p className="text-warm-grey">Here's your tiffin dashboard. Customize before <span className="text-gold font-bold">10:00 AM</span>.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => {
            const CardContent = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-cocoa border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 ${stat.link ? 'hover:border-gold/30 transition-colors' : ''}`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-2xl font-bold text-offwhite">{stat.value}</p>
                  <p className="text-xs text-warm-grey">{stat.label}</p>
                </div>
              </motion.div>
            );

            return stat.link ? (
              <Link to={stat.link} key={stat.label} className="block">
                {CardContent}
              </Link>
            ) : (
              <div key={stat.label}>{CardContent}</div>
            );
          })}
        </div>

        {/* Weekly Calendar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-10">
          <h2 className="text-lg font-bold text-offwhite mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-gold" /> This Week
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, i) => (
              <button
                key={day}
                onClick={() => setSelectedDay(i)}
                className={`py-3 rounded-xl text-center text-sm font-bold transition-all ${
                  selectedDay === i ? 'bg-gold text-espresso' : weeklyMenu[i]?.isSkipped ? 'bg-white/5 text-warm-grey/40 line-through' : 'bg-cocoa border border-white/5 text-warm-grey hover:border-gold/30'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Today's Meal */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-lg font-bold text-offwhite mb-4 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-gold" /> {todayMenu?.day}'s Meals
          </h2>

          {todayMenu?.isSkipped ? (
            <div className="bg-cocoa border border-white/5 rounded-2xl p-8 text-center">
              <p className="text-warm-grey text-lg">This day is skipped 🏖️</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lunch */}
              <div className="bg-cocoa border border-white/5 rounded-2xl overflow-hidden group">
                <div className="h-40 overflow-hidden">
                  <img src={todayMenu?.lunch?.image} alt={todayMenu?.lunch?.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs text-gold font-bold uppercase tracking-wider mb-1">🍛 Lunch</p>
                      <h3 className="text-lg font-serif font-bold text-offwhite">{todayMenu?.lunch?.name}</h3>
                    </div>
                    <span className="text-xs bg-white/5 px-3 py-1 rounded-full text-warm-grey">{todayMenu?.lunch?.calories} cal</span>
                  </div>
                  <p className="text-warm-grey text-sm mb-4">{todayMenu?.lunch?.description}</p>
                  <motion.button onClick={() => setSwapModal({ open: true, meal: todayMenu?.lunch, type: 'Lunch' })} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-gold/10 border border-gold/30 text-gold py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gold/20 transition-colors">
                    <ArrowRightLeft className="w-4 h-4" /> Swap Meal
                  </motion.button>
                </div>
              </div>

              {/* Dinner */}
              <div className="bg-cocoa border border-white/5 rounded-2xl overflow-hidden group">
                <div className="h-40 overflow-hidden">
                  <img src={todayMenu?.dinner?.image} alt={todayMenu?.dinner?.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs text-gold font-bold uppercase tracking-wider mb-1">🌙 Dinner</p>
                      <h3 className="text-lg font-serif font-bold text-offwhite">{todayMenu?.dinner?.name}</h3>
                    </div>
                    <span className="text-xs bg-white/5 px-3 py-1 rounded-full text-warm-grey">{todayMenu?.dinner?.calories} cal</span>
                  </div>
                  <p className="text-warm-grey text-sm mb-4">{todayMenu?.dinner?.description}</p>
                  <motion.button onClick={() => setSwapModal({ open: true, meal: todayMenu?.dinner, type: 'Dinner' })} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-gold/10 border border-gold/30 text-gold py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gold/20 transition-colors">
                    <ArrowRightLeft className="w-4 h-4" /> Swap Meal
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Swap Options Preview */}
        {!todayMenu?.isSkipped && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-10">
            <h2 className="text-lg font-bold text-offwhite mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gold" /> Available Swaps
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {todayMenu?.swapOptions?.map((meal) => (
                <div key={meal.id} className="bg-cocoa border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-gold/30 transition-colors cursor-pointer">
                  <img src={meal.image} alt={meal.name} className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-offwhite">{meal.name}</p>
                    <p className="text-xs text-warm-grey">{meal.calories} cal • {meal.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Swap Modal */}
      <SwapModal
        isOpen={swapModal.open}
        onClose={handleSwapClose}
        currentMeal={swapModal.meal}
        swapOptions={todayMenu?.swapOptions}
        mealType={swapModal.type}
      />
    </div>
  );
};

export default DashboardPage;
