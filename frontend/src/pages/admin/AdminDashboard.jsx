import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';
import {
  ShoppingBag, Users, IndianRupee, UtensilsCrossed, ArrowRightLeft,
  XCircle, TrendingUp, Search, ChevronDown,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

/* Dummy data */
const revenueData = [
  { week: 'W1', revenue: 42000 },
  { week: 'W2', revenue: 58000 },
  { week: 'W3', revenue: 51000 },
  { week: 'W4', revenue: 67000 },
];

const ordersToday = [
  { id: '#TF-1042', name: 'Priya Sharma', plan: 'Pro', meal: 'Paneer Butter Masala', status: 'Delivered', time: '12:35 PM' },
  { id: '#TF-1041', name: 'Rahul Mehta', plan: 'Regular', meal: 'Dal Tadka + Rice', status: 'Out for delivery', time: '12:20 PM' },
  { id: '#TF-1040', name: 'Ananya Desai', plan: 'Regular', meal: 'Chole Bhature', status: 'Preparing', time: '11:50 AM' },
  { id: '#TF-1039', name: 'Vikram Singh', plan: 'Pro', meal: 'Grilled Chicken Bowl', status: 'Delivered', time: '12:30 PM' },
  { id: '#TF-1038', name: 'Sneha Patel', plan: 'Starter', meal: 'Veg Thali', status: 'Swapped', time: '11:15 AM' },
];

const subscriberData = [
  { name: 'Priya Sharma', email: 'priya@email.com', plan: 'Pro', status: 'Active', joined: 'Jan 15, 2026' },
  { name: 'Rahul Mehta', email: 'rahul@email.com', plan: 'Regular', status: 'Active', joined: 'Feb 03, 2026' },
  { name: 'Ananya Desai', email: 'ananya@email.com', plan: 'Regular', status: 'Active', joined: 'Mar 12, 2026' },
  { name: 'Vikram Singh', email: 'vikram@email.com', plan: 'Pro', status: 'Paused', joined: 'Dec 01, 2025' },
  { name: 'Sneha Patel', email: 'sneha@email.com', plan: 'Starter', status: 'Active', joined: 'Apr 20, 2026' },
  { name: 'Arjun Reddy', email: 'arjun@email.com', plan: 'Pro', status: 'Active', joined: 'Mar 28, 2026' },
];

const statusColors = {
  Delivered: 'text-emerald-400 bg-emerald-400/10',
  'Out for delivery': 'text-blue-400 bg-blue-400/10',
  Preparing: 'text-gold bg-gold/10',
  Swapped: 'text-purple-400 bg-purple-400/10',
  Cancelled: 'text-red-400 bg-red-400/10',
};

const planColors = {
  Starter: 'text-warm-grey bg-white/5',
  Regular: 'text-blue-400 bg-blue-400/10',
  Pro: 'text-gold bg-gold/10',
};

const userStatusColors = {
  Active: 'text-emerald-400 bg-emerald-400/10',
  Paused: 'text-orange-400 bg-orange-400/10',
  Cancelled: 'text-red-400 bg-red-400/10',
};

/* Revenue tooltip */
const RevenueTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-cocoa border border-white/10 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-warm-grey mb-1">{label}</p>
      <p className="text-sm font-bold text-gold">₹{payload[0].value.toLocaleString()}</p>
    </div>
  );
};

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('All');

  const filteredSubscribers = subscriberData.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPlan = filterPlan === 'All' || s.plan === filterPlan;
    return matchSearch && matchPlan;
  });

  const summaryCards = [
    { icon: ShoppingBag, label: 'Orders Today', value: '148', change: '+12%', color: 'text-gold' },
    { icon: ArrowRightLeft, label: 'Swaps Today', value: '23', change: '+5%', color: 'text-purple-400' },
    { icon: XCircle, label: 'Cancellations', value: '3', change: '-18%', color: 'text-red-400' },
    { icon: Users, label: 'Active Subscribers', value: '2,412', change: '+8%', color: 'text-blue-400' },
    { icon: IndianRupee, label: 'Revenue (MTD)', value: '₹2.18L', change: '+14%', color: 'text-emerald-400' },
    { icon: UtensilsCrossed, label: 'Meals Served', value: '4,820', change: '+6%', color: 'text-orange-400' },
  ];

  return (
    <div className="min-h-screen bg-espresso">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-offwhite mb-2">
              Admin Dashboard <span className="text-gold">🛡️</span>
            </h1>
            <p className="text-warm-grey">Manage orders, menus, and subscribers.</p>
          </div>
          <Link
            to="/admin/menu"
            className="flex items-center gap-2 bg-gold hover:bg-gold-light text-espresso px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
          >
            <UtensilsCrossed className="w-4 h-4" /> Manage Menu
          </Link>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {summaryCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-cocoa border border-white/5 rounded-2xl p-4"
            >
              <card.icon className={`w-5 h-5 ${card.color} mb-3`} />
              <p className="text-xl font-bold text-offwhite">{card.value}</p>
              <p className="text-[10px] text-warm-grey mb-1">{card.label}</p>
              <span className={`text-[10px] font-bold ${
                card.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {card.change} vs last week
              </span>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-cocoa border border-white/5 rounded-3xl p-6"
          >
            <h2 className="text-base font-bold text-offwhite mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold" /> Monthly Revenue
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" tick={{ fill: '#A39690', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#A39690', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip content={<RevenueTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="revenue" radius={[8, 8, 0, 0]} fill="#DAA520" fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Orders Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-cocoa border border-white/5 rounded-3xl p-6"
          >
            <h2 className="text-base font-bold text-offwhite mb-6 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold" /> Recent Orders
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-3 text-xs font-medium text-warm-grey">Order</th>
                    <th className="pb-3 text-xs font-medium text-warm-grey">Customer</th>
                    <th className="pb-3 text-xs font-medium text-warm-grey hidden sm:table-cell">Meal</th>
                    <th className="pb-3 text-xs font-medium text-warm-grey">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersToday.map((order) => (
                    <tr key={order.id} className="border-b border-white/5 last:border-0">
                      <td className="py-3 text-xs text-warm-grey font-mono">{order.id}</td>
                      <td className="py-3">
                        <p className="text-xs font-medium text-offwhite">{order.name}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${planColors[order.plan]}`}>{order.plan}</span>
                      </td>
                      <td className="py-3 text-xs text-warm-grey hidden sm:table-cell">{order.meal}</td>
                      <td className="py-3">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Subscriber Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-cocoa border border-white/5 rounded-3xl p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-base font-bold text-offwhite flex items-center gap-2">
              <Users className="w-5 h-5 text-gold" /> Subscribers ({filteredSubscribers.length})
            </h2>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-offwhite placeholder-warm-grey/40 focus:outline-none focus:border-gold/30 w-48"
                  id="admin-search"
                />
              </div>
              <div className="relative">
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-warm-grey appearance-none pr-8 focus:outline-none focus:border-gold/30"
                  id="admin-filter"
                >
                  <option value="All">All Plans</option>
                  <option value="Starter">Starter</option>
                  <option value="Regular">Regular</option>
                  <option value="Pro">Pro</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-warm-grey pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-3 text-xs font-medium text-warm-grey">Name</th>
                  <th className="pb-3 text-xs font-medium text-warm-grey hidden sm:table-cell">Email</th>
                  <th className="pb-3 text-xs font-medium text-warm-grey">Plan</th>
                  <th className="pb-3 text-xs font-medium text-warm-grey">Status</th>
                  <th className="pb-3 text-xs font-medium text-warm-grey hidden md:table-cell">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.map((sub) => (
                  <tr key={sub.email} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 text-sm font-medium text-offwhite">{sub.name}</td>
                    <td className="py-3 text-xs text-warm-grey hidden sm:table-cell">{sub.email}</td>
                    <td className="py-3">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${planColors[sub.plan]}`}>{sub.plan}</span>
                    </td>
                    <td className="py-3">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${userStatusColors[sub.status]}`}>{sub.status}</span>
                    </td>
                    <td className="py-3 text-xs text-warm-grey hidden md:table-cell">{sub.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
