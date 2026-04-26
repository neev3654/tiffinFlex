import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, User, Mail, Lock, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import plans from '../data/plans';

const steps = ['Account', 'Preferences', 'Plan'];

const allergies = ['Gluten', 'Dairy', 'Nuts', 'Soy', 'Eggs', 'Shellfish'];
const spiceLevels = ['Mild', 'Medium', 'Spicy', 'Extra Spicy'];

const SignupPage = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    diet: '', selectedAllergies: [], spiceLevel: 'Medium', selectedPlan: 'regular',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup } = useAuth();

  const update = (field, value) => setForm({ ...form, [field]: value });

  const toggleAllergy = (a) => {
    const list = form.selectedAllergies.includes(a)
      ? form.selectedAllergies.filter((x) => x !== a)
      : [...form.selectedAllergies, a];
    update('selectedAllergies', list);
  };

  const nextStep = () => {
    setError('');
    if (step === 0) {
      if (!form.name || !form.email || !form.password) return setError('All fields are required.');
      if (form.password.length < 6) return setError('Password must be at least 6 characters.');
      if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    }
    if (step === 1 && !form.diet) return setError('Please select a dietary preference.');
    if (step < 2) setStep(step + 1);
  };

  const handleSubmit = () => {
    signup({ name: form.name, email: form.email, plan: form.selectedPlan, diet: form.diet });
    navigate('/dashboard');
  };

  const slideVariants = {
    enter: { x: 40, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -40, opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-espresso flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <UtensilsCrossed className="w-8 h-8 text-gold" />
          <span className="text-xl font-serif font-bold italic text-gold">TiffinFlex</span>
        </Link>

        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                i < step ? 'bg-gold text-espresso' : i === step ? 'bg-gold/20 text-gold border-2 border-gold' : 'bg-white/5 text-warm-grey border border-white/10'
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < 2 && <div className={`w-12 h-0.5 transition-colors duration-300 ${i < step ? 'bg-gold' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-cocoa border border-white/5 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Account */}
            {step === 0 && (
              <motion.div key="s1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="text-2xl font-serif font-bold text-offwhite mb-6">Create Account</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-warm-grey mb-1 block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey" />
                      <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Nee Patel" className="w-full bg-espresso border border-white/10 rounded-xl pl-11 pr-4 py-3 text-offwhite placeholder:text-warm-grey/50 focus:outline-none focus:border-gold/50 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-warm-grey mb-1 block">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey" />
                      <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" className="w-full bg-espresso border border-white/10 rounded-xl pl-11 pr-4 py-3 text-offwhite placeholder:text-warm-grey/50 focus:outline-none focus:border-gold/50 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-warm-grey mb-1 block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey" />
                      <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Min 6 characters" className="w-full bg-espresso border border-white/10 rounded-xl pl-11 pr-4 py-3 text-offwhite placeholder:text-warm-grey/50 focus:outline-none focus:border-gold/50 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-warm-grey mb-1 block">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey" />
                      <input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} placeholder="Repeat password" className="w-full bg-espresso border border-white/10 rounded-xl pl-11 pr-4 py-3 text-offwhite placeholder:text-warm-grey/50 focus:outline-none focus:border-gold/50 transition-all" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Preferences */}
            {step === 1 && (
              <motion.div key="s2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="text-2xl font-serif font-bold text-offwhite mb-6">Dietary Preferences</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm text-warm-grey mb-3 block">I eat</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Vegetarian', 'Non-Veg', 'Vegan'].map((d) => (
                        <button key={d} onClick={() => update('diet', d)} className={`py-3 rounded-xl text-sm font-bold transition-all ${form.diet === d ? 'bg-gold text-espresso' : 'bg-espresso border border-white/10 text-warm-grey hover:border-gold/30'}`}>{d}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-warm-grey mb-3 block">Allergies (if any)</label>
                    <div className="flex flex-wrap gap-2">
                      {allergies.map((a) => (
                        <button key={a} onClick={() => toggleAllergy(a)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${form.selectedAllergies.includes(a) ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-espresso border border-white/10 text-warm-grey hover:border-gold/30'}`}>{a}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-warm-grey mb-3 block">Spice Level</label>
                    <div className="grid grid-cols-4 gap-2">
                      {spiceLevels.map((s) => (
                        <button key={s} onClick={() => update('spiceLevel', s)} className={`py-2.5 rounded-xl text-xs font-bold transition-all ${form.spiceLevel === s ? 'bg-gold text-espresso' : 'bg-espresso border border-white/10 text-warm-grey hover:border-gold/30'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Plan */}
            {step === 2 && (
              <motion.div key="s3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="text-2xl font-serif font-bold text-offwhite mb-6">Choose Your Plan</h2>
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <button key={plan.id} onClick={() => update('selectedPlan', plan.id)} className={`w-full text-left p-5 rounded-xl border transition-all ${form.selectedPlan === plan.id ? 'border-gold bg-gold/5' : 'border-white/10 hover:border-gold/30'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-offwhite flex items-center gap-2">
                          {plan.name} {plan.popular && <span className="text-[10px] bg-gold text-espresso px-2 py-0.5 rounded-full font-bold">POPULAR</span>}
                        </span>
                        <span className="text-gold font-bold">₹{plan.monthlyPrice}<span className="text-warm-grey text-xs font-normal">/mo</span></span>
                      </div>
                      <p className="text-warm-grey text-xs">{plan.description}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 0 && (
              <button onClick={() => { setStep(step - 1); setError(''); }} className="flex-1 border border-white/10 text-offwhite py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            {step < 2 ? (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={nextStep} className="flex-1 bg-gold text-espresso py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gold-light transition-colors">
                Next <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} className="flex-1 bg-gold text-espresso py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gold-light transition-colors">
                Start My Tiffin <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Login Link */}
        <p className="text-center text-warm-grey mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-gold font-bold hover:text-gold-light transition-colors">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;
