import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  Flame, Target, TrendingUp, Award, Zap, ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* Dummy weekly calorie data */
const weeklyCalories = [
  { day: 'Mon', calories: 1850, goal: 2000 },
  { day: 'Tue', calories: 2100, goal: 2000 },
  { day: 'Wed', calories: 1780, goal: 2000 },
  { day: 'Thu', calories: 1920, goal: 2000 },
  { day: 'Fri', calories: 2200, goal: 2000 },
  { day: 'Sat', calories: 1650, goal: 2000 },
  { day: 'Sun', calories: 1900, goal: 2000 },
];

/* Macro data for donut chart */
const macroData = [
  { name: 'Protein', value: 28, color: '#DAA520' },
  { name: 'Carbs', value: 48, color: '#3B82F6' },
  { name: 'Fats', value: 24, color: '#F97316' },
];

/* Weekly report card */
const reportCard = [
  { label: 'Avg Daily Calories', value: '1,914', trend: '-4%', good: true },
  { label: 'Protein Intake', value: '82g/day', trend: '+8%', good: true },
  { label: 'Sugar Intake', value: '32g/day', trend: '-12%', good: true },
  { label: 'Fiber Intake', value: '18g/day', trend: '+3%', good: false },
];

/* Custom tooltip for bar chart */
const CalorieTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const cal = payload[0].value;
  const goal = payload[0].payload.goal;
  const over = cal > goal;
  return (
    <div className="bg-cocoa border border-white/10 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-warm-grey mb-1">{label}</p>
      <p className={`text-sm font-bold ${over ? 'text-orange-400' : 'text-emerald-400'}`}>
        {cal} cal {over ? `(+${cal - goal} over)` : `(${goal - cal} under)`}
      </p>
    </div>
  );
};

const NutritionPage = () => {
  const { user } = useAuth();
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [showGoalPicker, setShowGoalPicker] = useState(false);

  const avgCalories = Math.round(weeklyCalories.reduce((s, d) => s + d.calories, 0) / 7);
  const daysUnderGoal = weeklyCalories.filter((d) => d.calories <= dailyGoal).length;

  /* Health score (0-100) */
  const healthScore = Math.min(100, Math.round(
    (daysUnderGoal / 7) * 40 + (macroData[0].value / 30) * 30 + 30
  ));

  const getScoreColor = () => {
    if (healthScore >= 80) return 'text-emerald-400';
    if (healthScore >= 60) return 'text-gold';
    return 'text-orange-400';
  };

  const getScoreLabel = () => {
    if (healthScore >= 80) return 'Excellent';
    if (healthScore >= 60) return 'Good';
    return 'Needs Work';
  };

  return (
    <div className="min-h-screen bg-espresso">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-offwhite mb-2">
            Nutrition Tracker <span className="text-gold">📊</span>
          </h1>
          <p className="text-warm-grey">
            Track your daily intake. Stay on top of your health goals, {user?.name?.split(' ')[0] || 'Chef'}.
          </p>
        </motion.div>

        {/* Top Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          {[
            { icon: Flame, label: 'Avg Calories', value: `${avgCalories}`, sub: '/day', color: 'text-orange-400' },
            { icon: Target, label: 'Daily Goal', value: `${dailyGoal}`, sub: 'cal', color: 'text-gold' },
            { icon: TrendingUp, label: 'Under Goal', value: `${daysUnderGoal}/7`, sub: 'days', color: 'text-emerald-400' },
            { icon: Award, label: 'Health Score', value: `${healthScore}`, sub: '/100', color: getScoreColor() },
          ].map((stat, i) => (
            <div key={stat.label} className="bg-cocoa border border-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-warm-grey font-medium">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-offwhite">
                {stat.value}<span className="text-sm text-warm-grey font-normal ml-1">{stat.sub}</span>
              </p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Bar Chart (spans 2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-cocoa border border-white/5 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-offwhite">Daily Calorie Intake</h2>
              {/* Goal Setter */}
              <div className="relative">
                <button
                  onClick={() => setShowGoalPicker(!showGoalPicker)}
                  className="flex items-center gap-1 text-xs bg-white/5 border border-white/10 text-warm-grey px-3 py-1.5 rounded-lg hover:border-gold/20 transition-colors"
                  id="goal-picker"
                >
                  Goal: {dailyGoal} cal <ChevronDown className="w-3 h-3" />
                </button>
                {showGoalPicker && (
                  <div className="absolute right-0 top-9 bg-cocoa border border-white/10 rounded-xl shadow-2xl p-3 z-10 space-y-1">
                    {[1500, 1800, 2000, 2200, 2500].map((g) => (
                      <button
                        key={g}
                        onClick={() => { setDailyGoal(g); setShowGoalPicker(false); }}
                        className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          dailyGoal === g ? 'bg-gold/20 text-gold' : 'text-warm-grey hover:text-offwhite hover:bg-white/5'
                        }`}
                      >
                        {g} cal/day
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyCalories} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#A39690', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#A39690', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 2600]} />
                <Tooltip content={<CalorieTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar
                  dataKey="calories"
                  radius={[8, 8, 0, 0]}
                  fill="#DAA520"
                  fillOpacity={0.8}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Goal line legend */}
            <div className="flex items-center gap-4 mt-4 text-xs text-warm-grey">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-gold/80" /> Calories
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-red-400 inline-block" style={{ borderTop: '2px dashed #F87171' }} /> Goal ({dailyGoal} cal)
              </span>
            </div>
          </motion.div>

          {/* Right — Donut Chart + Health Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Macro Breakdown */}
            <div className="bg-cocoa border border-white/5 rounded-3xl p-6">
              <h2 className="text-base font-bold text-offwhite mb-4">Macro Breakdown</h2>
              <div className="flex justify-center">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {macroData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-5 mt-4">
                {macroData.map((m) => (
                  <div key={m.name} className="text-center">
                    <div className="flex items-center gap-1.5 justify-center mb-1">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                      <span className="text-xs text-warm-grey">{m.name}</span>
                    </div>
                    <p className="text-sm font-bold text-offwhite">{m.value}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Score Badge */}
            <div className="bg-cocoa border border-white/5 rounded-3xl p-6 text-center">
              <Zap className={`w-8 h-8 mx-auto mb-3 ${getScoreColor()}`} />
              <p className={`text-4xl font-bold ${getScoreColor()}`}>{healthScore}</p>
              <p className="text-sm text-warm-grey mt-1">Health Score</p>
              <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${
                healthScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                healthScore >= 60 ? 'bg-gold/20 text-gold' : 'bg-orange-500/20 text-orange-400'
              }`}>
                {getScoreLabel()}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Weekly Report Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-cocoa border border-white/5 rounded-3xl p-6"
        >
          <h2 className="text-base font-bold text-offwhite mb-6">Weekly Report Card</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportCard.map((item) => (
              <div key={item.label} className="bg-white/[0.03] rounded-xl p-4">
                <p className="text-xs text-warm-grey mb-2">{item.label}</p>
                <p className="text-xl font-bold text-offwhite mb-1">{item.value}</p>
                <span className={`text-xs font-bold ${
                  item.good ? 'text-emerald-400' : 'text-orange-400'
                }`}>
                  {item.trend} vs last week
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default NutritionPage;
