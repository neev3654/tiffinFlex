import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, ArrowRightLeft, Flame, TrendingUp, ChefHat, Clock, Activity, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import SwapModal from '../components/SwapModal';
import { MealCardSkeleton, StatSkeleton } from '../components/ui/LoadingSkeletons';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import SEO from '../components/SEO';
import API from '../utils/api';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedDay, setSelectedDay] = useState(0);
  const [swapModal, setSwapModal] = useState({ open: false, meal: null, type: '' });
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const todayMenu = menus[selectedDay];

  // Fetch meals and construct weekly menu
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const { data } = await API.get('/meals?active=true');
        if (data.length > 0) {
          const generatedMenu = days.map((day, i) => ({
            day,
            date: `2026-04-${27 + i}`,
            lunch: data[i % data.length],
            dinner: data[(i + 5) % data.length],
            swapOptions: [
              data[(i + 2) % data.length],
              data[(i + 4) % data.length],
              data[(i + 7) % data.length],
            ].filter(Boolean),
            isCustomized: i === 1 || i === 4,
            isSkipped: i === 6,
          }));
          setMenus(generatedMenu);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load menu');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeals();
  }, []);


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

  const stats = useMemo(() => [
    { icon: ArrowRightLeft, label: 'Swaps This Month', value: '12', color: 'text-gold' },
    { icon: Flame, label: 'Day Streak', value: '18', color: 'text-orange-400' },
    { icon: TrendingUp, label: 'Money Saved', value: '₹740', color: 'text-emerald-400' },
    { icon: Activity, label: 'Health Score', value: '85', color: 'text-blue-400', link: '/nutrition' },
  ], []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-espresso flex items-center justify-center p-6">
        <ErrorMessage onRetry={() => setError(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-espresso">
      <SEO title="Dashboard" description="Manage your daily tiffin meals and nutrition." />
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
          {isLoading 
            ? Array(4).fill(0).map((_, i) => <StatSkeleton key={i} />)
            : stats.map((stat, i) => {
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
                  selectedDay === i ? 'bg-gold text-espresso' : menus[i]?.isSkipped ? 'bg-white/5 text-warm-grey/40 line-through' : 'bg-cocoa border border-white/5 text-warm-grey hover:border-gold/30'
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

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MealCardSkeleton />
              <MealCardSkeleton />
            </div>
          ) : todayMenu?.isSkipped ? (
            <EmptyState 
              title="Rest Day" 
              message="No meals scheduled for this day. Enjoy your break!" 
              icon={Clock} 
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lunch */}
              <MealCard 
                type="Lunch" 
                meal={todayMenu?.lunch} 
                onSwap={() => setSwapModal({ open: true, meal: todayMenu?.lunch, type: 'Lunch' })} 
              />
              {/* Dinner */}
              <MealCard 
                type="Dinner" 
                meal={todayMenu?.dinner} 
                onSwap={() => setSwapModal({ open: true, meal: todayMenu?.dinner, type: 'Dinner' })} 
              />
            </div>
          )}
        </motion.div>

        {/* Swap Options Preview */}
        {!isLoading && !todayMenu?.isSkipped && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-10">
            <h2 className="text-lg font-bold text-offwhite mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gold" /> Available Swaps
            </h2>
            {todayMenu?.swapOptions?.length > 0 ? (
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
            ) : (
              <p className="text-warm-grey text-sm italic">No swap options available for today.</p>
            )}
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

// Extracted for performance (React.memo)
const MealCard = React.memo(({ type, meal, onSwap }) => (
  <div className="bg-cocoa border border-white/5 rounded-2xl overflow-hidden group">
    <div className="h-40 overflow-hidden">
      <img src={meal?.image} alt={meal?.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    </div>
    <div className="p-5">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-xs text-gold font-bold uppercase tracking-wider mb-1">
            {type === 'Lunch' ? '🍛 Lunch' : '🌙 Dinner'}
          </p>
          <h3 className="text-lg font-serif font-bold text-offwhite">{meal?.name}</h3>
        </div>
        <span className="text-xs bg-white/5 px-3 py-1 rounded-full text-warm-grey">{meal?.calories} cal</span>
      </div>
      <p className="text-warm-grey text-sm mb-4">{meal?.description}</p>
      <motion.button 
        onClick={onSwap} 
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }} 
        className="w-full bg-gold/10 border border-gold/30 text-gold py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gold/20 transition-colors"
      >
        <ArrowRightLeft className="w-4 h-4" /> Swap Meal
      </motion.button>
    </div>
  </div>
));

export default DashboardPage;

