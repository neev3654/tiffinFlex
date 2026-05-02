import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Heart, CreditCard, Settings, Camera, Save, CheckCircle,
  Phone, Mail, MapPin, Bell, Lock, ChevronRight, Crown, Zap, Gem,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, useFormikContext } from 'formik';
import { addNotification } from '../store/slices/uiSlice';
import { profileSchema } from '../utils/validationSchemas';
import FormInput from '../components/forms/FormInput';
import FormFileUpload from '../components/forms/FormFileUpload';
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

const ProfileContent = ({ activeTab, setActiveTab, user }) => {
  const { values, setFieldValue, handleSubmit, isSubmitting } = useFormikContext();

  const toggleAllergen = (a) => {
    const current = values.allergies || [];
    const list = current.includes(a)
      ? current.filter((x) => x !== a)
      : [...current, a];
    setFieldValue('allergies', list);
  };

  const toggleCuisine = (c) => {
    const current = values.cuisines || [];
    const list = current.includes(c)
      ? current.filter((x) => x !== c)
      : [...current, c];
    setFieldValue('cuisines', list);
  };

  const toggleNotification = (key) => {
    setFieldValue(`notifications.${key}`, !values.notifications[key]);
  };

  const currentPlan = plans.find((p) => p.id === (user?.plan || 'regular'));
  const planIcon = { starter: Zap, regular: Crown, pro: Gem }[currentPlan?.id] || Crown;
  const PlanIcon = planIcon;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10"
      >
        <div className="relative group">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gold/30 to-gold/10 border-2 border-gold/30 flex items-center justify-center text-gold text-4xl font-serif font-bold overflow-hidden">
            {values.avatar ? (
              <img 
                src={typeof values.avatar === 'string' ? values.avatar : URL.createObjectURL(values.avatar)} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              values.name.charAt(0)
            )}
          </div>
          <div className="absolute -bottom-2 -right-2">
             <FormFileUpload name="avatar" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-offwhite">{values.name}</h1>
          <p className="text-warm-grey text-sm">{values.email} • {values.diet}</p>
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
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-gold text-espresso'
                : 'bg-cocoa border border-white/5 text-warm-grey hover:text-offwhite hover:border-gold/20'
            }`}
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
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <Card title="Personal Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormInput label="Full Name" name="name" icon={User} />
                  <FormInput label="Email" name="email" type="email" icon={Mail} />
                  <FormInput label="Phone" name="phone" icon={Phone} />
                  <FormInput label="Delivery Address" name="address" icon={MapPin} />
                </div>
              </Card>
              <Card title="Profile Picture">
                 <FormFileUpload name="avatar" label="Upload a new profile picture" />
              </Card>
            </div>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <Card title="Dietary Type">
                <div className="flex flex-wrap gap-3">
                  {['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian'].map((diet) => (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => setFieldValue('diet', diet)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        values.diet === diet
                          ? 'bg-gold text-espresso shadow-lg shadow-gold/20'
                          : 'bg-white/5 text-warm-grey hover:text-offwhite border border-white/5 hover:border-gold/20'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </Card>

              <Card title="Allergens">
                <div className="flex flex-wrap gap-2">
                  {allergenOptions.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAllergen(a)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        values.allergies.includes(a)
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-white/5 text-warm-grey border border-white/5 hover:border-white/20'
                      }`}
                    >
                      {values.allergies.includes(a) ? '✕ ' : '+ '}{a}
                    </button>
                  ))}
                </div>
              </Card>

              <Card title="Spice Level">
                <div className="flex items-center gap-4">
                  <span className="text-warm-grey text-sm w-12">Mild</span>
                  <div className="flex-1 relative">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={values.spiceLevel}
                      onChange={(e) => setFieldValue('spiceLevel', Number(e.target.value))}
                      className="w-full accent-gold h-2 rounded-full appearance-none bg-white/10 cursor-pointer"
                    />
                    <div className="flex justify-between mt-2 px-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <span key={level} className={`text-xs ${values.spiceLevel >= level ? 'text-gold' : 'text-warm-grey/40'}`}>
                          {'🌶️'.repeat(level)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-warm-grey text-sm w-16 text-right">Extreme</span>
                </div>
              </Card>

              <Card title="Cuisine Preferences">
                <div className="flex flex-wrap gap-2">
                  {cuisineOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCuisine(c)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        values.cuisines.includes(c)
                          ? 'bg-gold/20 text-gold border border-gold/30'
                          : 'bg-white/5 text-warm-grey border border-white/5 hover:border-white/20'
                      }`}
                    >
                      {values.cuisines.includes(c) ? '✓ ' : '+ '}{c}
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* SUBSCRIPTION TAB (Keep as static display for now) */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
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
                  <button type="button" className="bg-gold/10 border border-gold/30 text-gold px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gold/20 transition-colors">
                    Change Plan
                  </button>
                </div>
              </Card>
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
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
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
                        type="button"
                        onClick={() => toggleNotification(item.key)}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                          values.notifications[item.key] ? 'bg-gold' : 'bg-white/10'
                        }`}
                      >
                        <motion.div
                          className="absolute top-0.5 w-5 h-5 rounded-full bg-espresso shadow"
                          animate={{ left: values.notifications[item.key] ? '1.375rem' : '0.125rem' }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="Security">
                <button type="button" className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:border-gold/20 transition-all">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-warm-grey" />
                    <span className="text-sm font-bold text-offwhite">Change Password</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-warm-grey" />
                </button>
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
          type="button"
          onClick={handleSubmit}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={isSubmitting}
          className="bg-gold hover:bg-gold-light text-espresso px-8 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-gold/20 flex items-center gap-2"
        >
          {isSubmitting ? (
             <div className="w-4 h-4 border-2 border-espresso border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </motion.button>
      </motion.div>
    </div>
  );
};

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');

  const handleSave = async (values, { setSubmitting }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    dispatch(addNotification({ message: 'Profile updated successfully!', type: 'success' }));
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-espresso">
      <Navbar />
      <Formik
        initialValues={{
          name: user?.name || 'Neev Patel',
          email: user?.email || 'demo@tiffinflex.com',
          phone: user?.phone || '9876543210',
          address: user?.address || '42, Bandra West, Mumbai — 400050',
          diet: user?.diet || 'Vegetarian',
          allergies: user?.allergies || ['Nuts', 'Gluten'],
          spiceLevel: user?.spiceLevel || 3,
          cuisines: user?.cuisines || ['North Indian', 'South Indian', 'Chinese'],
          notifications: { email: true, sms: false, push: true, promotional: false },
          avatar: null,
        }}
        validationSchema={profileSchema}
        onSubmit={handleSave}
      >
        <ProfileContent activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      </Formik>
    </div>
  );
};

const Card = ({ title, children }) => (
  <div className="bg-cocoa border border-white/5 rounded-2xl p-6">
    {title && <h3 className="text-base font-bold text-offwhite mb-4">{title}</h3>}
    {children}
  </div>
);

export default ProfilePage;

