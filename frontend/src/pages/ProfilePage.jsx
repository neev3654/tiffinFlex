import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Heart, CreditCard, Settings, Camera, Save, CheckCircle,
  Phone, Mail, MapPin, Bell, Lock, ChevronRight, Flame, Crown, Zap, Gem,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import plans from '../data/plans';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'preferences', label: 'Preferences', icon: Heart },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const allergenOptions = ['Dairy', 'Gluten', 'Nuts', 'Soy', 'Eggs', 'Shellfish', 'Sesame', 'Mustard'];
const cuisineOptions = ['North Indian', 'South Indian', 'Chinese', 'Continental', 'Italian', 'Thai'];

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [toast, setToast] = useState(null);

  /* Editable form state */
  const [form, setForm] = useState({
    name: user?.name || 'Neev Patel',
    email: user?.email || 'demo@tiffinflex.com',
    phone: '+91 98765 43210',
    address: '42, Bandra West, Mumbai — 400050',
    diet: user?.diet || 'Vegetarian',
    allergies: ['Nuts', 'Gluten'],
    spiceLevel: 3,
    cuisines: ['North Indian', 'South Indian', 'Chinese'],
    notifications: { email: true, sms: false, push: true, promotional: false },
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAllergen = (a) => {
    setForm((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(a)
        ? prev.allergies.filter((x) => x !== a)
        : [...prev.allergies, a],
    }));
  };

  const toggleCuisine = (c) => {
    setForm((prev) => ({
      ...prev,
      cuisines: prev.cuisines.includes(c)
        ? prev.cuisines.filter((x) => x !== c)
        : [...prev.cuisines, c],
    }));
  };

  const toggleNotification = (key) => {
    setForm((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
    }));
  };

  const handleSave = () => {
    setToast('Changes saved successfully!');
    setTimeout(() => setToast(null), 3000);
  };

  const currentPlan = plans.find((p) => p.id === (user?.plan || 'regular'));
  const planIcon = { starter: Zap, regular: Crown, pro: Gem }[currentPlan?.id] || Crown;
  const PlanIcon = planIcon;

  return (
    <div className="min-h-screen bg-espresso">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10"
        >
          {/* Avatar */}
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/30 to-gold/10 border-2 border-gold/30 flex items-center justify-center text-gold text-3xl font-serif font-bold">
              {form.name.charAt(0)}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-cocoa border border-white/10 flex items-center justify-center text-warm-grey hover:text-gold transition-colors">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-offwhite">{form.name}</h1>
            <p className="text-warm-grey text-sm">{form.email} • {form.diet}</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8 overflow-x-auto pb-2"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gold text-espresso'
                  : 'bg-cocoa border border-white/5 text-warm-grey hover:text-offwhite hover:border-gold/20'
              }`}
              id={`tab-${tab.id}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {/* ─── PROFILE TAB ─── */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <Card title="Personal Information">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField
                      icon={User}
                      label="Full Name"
                      value={form.name}
                      onChange={(v) => handleChange('name', v)}
                    />
                    <InputField
                      icon={Mail}
                      label="Email"
                      value={form.email}
                      onChange={(v) => handleChange('email', v)}
                      type="email"
                    />
                    <InputField
                      icon={Phone}
                      label="Phone"
                      value={form.phone}
                      onChange={(v) => handleChange('phone', v)}
                    />
                    <InputField
                      icon={MapPin}
                      label="Delivery Address"
                      value={form.address}
                      onChange={(v) => handleChange('address', v)}
                    />
                  </div>
                </Card>
              </div>
            )}

            {/* ─── PREFERENCES TAB ─── */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                {/* Dietary Type */}
                <Card title="Dietary Type">
                  <div className="flex flex-wrap gap-3">
                    {['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian'].map((diet) => (
                      <button
                        key={diet}
                        onClick={() => handleChange('diet', diet)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          form.diet === diet
                            ? 'bg-gold text-espresso shadow-lg shadow-gold/20'
                            : 'bg-white/5 text-warm-grey hover:text-offwhite border border-white/5 hover:border-gold/20'
                        }`}
                      >
                        {diet === 'Vegetarian' && '🥗 '}
                        {diet === 'Non-Vegetarian' && '🍗 '}
                        {diet === 'Vegan' && '🌱 '}
                        {diet === 'Eggetarian' && '🥚 '}
                        {diet}
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Allergens */}
                <Card title="Allergens">
                  <p className="text-warm-grey text-sm mb-4">Select any allergies so we can keep them out of your meals.</p>
                  <div className="flex flex-wrap gap-2">
                    {allergenOptions.map((a) => (
                      <button
                        key={a}
                        onClick={() => toggleAllergen(a)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          form.allergies.includes(a)
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-white/5 text-warm-grey border border-white/5 hover:border-white/20'
                        }`}
                      >
                        {form.allergies.includes(a) ? '✕ ' : '+ '}{a}
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Spice Level */}
                <Card title="Spice Level">
                  <div className="flex items-center gap-4">
                    <span className="text-warm-grey text-sm w-12">Mild</span>
                    <div className="flex-1 relative">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={form.spiceLevel}
                        onChange={(e) => handleChange('spiceLevel', Number(e.target.value))}
                        className="w-full accent-gold h-2 rounded-full appearance-none bg-white/10 cursor-pointer"
                        id="spice-slider"
                      />
                      <div className="flex justify-between mt-2 px-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <span
                            key={level}
                            className={`text-xs ${form.spiceLevel >= level ? 'text-gold' : 'text-warm-grey/40'}`}
                          >
                            {'🌶️'.repeat(level)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-warm-grey text-sm w-16 text-right">Extreme</span>
                  </div>
                </Card>

                {/* Cuisine Preferences */}
                <Card title="Cuisine Preferences">
                  <div className="flex flex-wrap gap-2">
                    {cuisineOptions.map((c) => (
                      <button
                        key={c}
                        onClick={() => toggleCuisine(c)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          form.cuisines.includes(c)
                            ? 'bg-gold/20 text-gold border border-gold/30'
                            : 'bg-white/5 text-warm-grey border border-white/5 hover:border-white/20'
                        }`}
                      >
                        {form.cuisines.includes(c) ? '✓ ' : '+ '}{c}
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* ─── SUBSCRIPTION TAB ─── */}
            {activeTab === 'subscription' && (
              <div className="space-y-6">
                {/* Current Plan */}
                <Card>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                        <PlanIcon className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-bold text-offwhite">{currentPlan?.name} Plan</h3>
                        <p className="text-warm-grey text-sm">₹{currentPlan?.monthlyPrice?.toLocaleString()}/month • Renews May 27, 2026</p>
                      </div>
                    </div>
                    <button className="bg-gold/10 border border-gold/30 text-gold px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gold/20 transition-colors">
                      Change Plan
                    </button>
                  </div>
                </Card>

                {/* Usage Stats */}
                <Card title="Usage This Month">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Meals Delivered', value: '42', icon: '🍛' },
                      { label: 'Swaps Made', value: '12', icon: '🔄' },
                      { label: 'Calories Tracked', value: '48.2k', icon: '🔥' },
                      { label: 'Days Active', value: '24', icon: '📅' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white/[0.03] rounded-xl p-4 text-center">
                        <p className="text-2xl mb-1">{stat.icon}</p>
                        <p className="text-xl font-bold text-offwhite">{stat.value}</p>
                        <p className="text-xs text-warm-grey mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Billing History */}
                <Card title="Billing History">
                  <div className="space-y-3">
                    {[
                      { date: 'Apr 27, 2026', amount: '₹3,999', status: 'Paid', method: 'UPI' },
                      { date: 'Mar 27, 2026', amount: '₹3,999', status: 'Paid', method: 'UPI' },
                      { date: 'Feb 27, 2026', amount: '₹3,999', status: 'Paid', method: 'Card ••4242' },
                      { date: 'Jan 27, 2026', amount: '₹2,499', status: 'Paid', method: 'Card ••4242' },
                    ].map((bill, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-offwhite">{bill.date}</p>
                          <p className="text-xs text-warm-grey">{bill.method}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-offwhite">{bill.amount}</span>
                          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-medium">
                            {bill.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* ─── SETTINGS TAB ─── */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Notification Toggles */}
                <Card title="Notifications">
                  <div className="space-y-4">
                    {[
                      { key: 'email', label: 'Email Notifications', desc: 'Receive order updates via email' },
                      { key: 'sms', label: 'SMS Notifications', desc: 'Get delivery alerts via SMS' },
                      { key: 'push', label: 'Push Notifications', desc: 'In-app alerts for swaps and updates' },
                      { key: 'promotional', label: 'Promotional', desc: 'Receive offers and discount alerts' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <Bell className="w-4 h-4 text-warm-grey" />
                          <div>
                            <p className="text-sm font-medium text-offwhite">{item.label}</p>
                            <p className="text-xs text-warm-grey">{item.desc}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleNotification(item.key)}
                          className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                            form.notifications[item.key] ? 'bg-gold' : 'bg-white/10'
                          }`}
                          id={`toggle-${item.key}`}
                        >
                          <motion.div
                            className="absolute top-0.5 w-5 h-5 rounded-full bg-espresso shadow"
                            animate={{ left: form.notifications[item.key] ? '1.375rem' : '0.125rem' }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Delivery Address */}
                <Card title="Delivery Address">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-offwhite">{form.address}</p>
                      <button className="text-xs text-gold font-bold mt-2 hover:text-gold-light transition-colors flex items-center gap-1">
                        Change Address <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </Card>

                {/* Password */}
                <Card title="Security">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-warm-grey" />
                      <div>
                        <p className="text-sm font-medium text-offwhite">Password</p>
                        <p className="text-xs text-warm-grey">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <button className="bg-white/5 border border-white/10 hover:border-gold/20 text-offwhite px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                      Change
                    </button>
                  </div>
                </Card>

                {/* Danger Zone */}
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-400">Delete Account</p>
                      <p className="text-xs text-warm-grey">Permanently delete your account and all data</p>
                    </div>
                    <button className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-colors">
                      Delete
                    </button>
                  </div>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            className="bg-gold hover:bg-gold-light text-espresso px-8 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-gold/20 flex items-center gap-2"
            id="save-profile"
          >
            <Save className="w-4 h-4" /> Save Changes
          </motion.button>
        </motion.div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 font-bold text-sm z-50"
          >
            <CheckCircle className="w-5 h-5" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* Reusable Card Wrapper */
const Card = ({ title, children }) => (
  <div className="bg-cocoa border border-white/5 rounded-2xl p-6">
    {title && <h3 className="text-base font-bold text-offwhite mb-4">{title}</h3>}
    {children}
  </div>
);

/* Reusable Input Field */
const InputField = ({ icon: Icon, label, value, onChange, type = 'text' }) => (
  <div>
    <label className="text-xs text-warm-grey font-medium mb-1.5 block">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey" />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-offwhite focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all placeholder-warm-grey/50"
      />
    </div>
  </div>
);

export default ProfilePage;
