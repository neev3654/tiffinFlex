import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Crown, Zap, Gem, Star, ArrowRight, CreditCard, Shield } from 'lucide-react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PaymentModal from '../components/PaymentModal';
import plans from '../data/plans';
import { useNavigate } from 'react-router-dom';

const planIcons = {
  starter: Zap,
  regular: Crown,
  pro: Gem,
};

const planGradients = {
  starter: 'from-amber-900/30 to-cocoa',
  regular: 'from-gold/20 to-cocoa',
  pro: 'from-purple-900/30 to-cocoa',
};

const planBorders = {
  starter: 'border-amber-700/30 hover:border-amber-500/50',
  regular: 'border-gold/50 hover:border-gold',
  pro: 'border-purple-500/30 hover:border-purple-400/50',
};

const planCtaColors = {
  starter: 'bg-amber-600 hover:bg-amber-500',
  regular: 'bg-gold hover:bg-gold-light',
  pro: 'bg-purple-600 hover:bg-purple-500',
};

/* All features for the comparison table */
const allFeatures = [
  { name: 'Meals per day', starter: '1 (Lunch)', regular: '2 (Lunch + Dinner)', pro: '3 (All meals)' },
  { name: 'Meal swaps', starter: '3/week', regular: 'Unlimited', pro: 'Unlimited + add-ons' },
  { name: 'Dietary customization', starter: 'Basic', regular: 'Full', pro: 'Full + AI recs' },
  { name: 'Delivery window', starter: 'Standard', regular: 'Priority', pro: 'Express (30 min)' },
  { name: 'Nutrition tracking', starter: false, regular: true, pro: true },
  { name: 'Chat support', starter: false, regular: true, pro: true },
  { name: 'AI meal recommendations', starter: false, regular: false, pro: true },
  { name: 'Dedicated account manager', starter: false, regular: false, pro: true },
  { name: 'Family sharing', starter: false, regular: false, pro: 'Up to 3' },
  { name: 'Calorie tracking', starter: false, regular: true, pro: true },
];

const SubscriptionPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, plan: null });
  const { user, token } = useSelector((state) => state.auth);
  const isAuthenticated = !!token;
  const navigate = useNavigate();

  const getPrice = (plan) => {
    if (isAnnual) return plan.annualPrice;
    return plan.monthlyPrice;
  };

  const getSavings = (plan) => {
    const monthlyTotal = plan.monthlyPrice * 12;
    const annualTotal = plan.annualPrice * 12;
    return monthlyTotal - annualTotal;
  };

  const isCurrentPlan = (planId) => {
    return isAuthenticated && user?.plan === planId;
  };

  const getCtaText = (planId) => {
    if (!isAuthenticated) return 'Start Free Trial';
    if (isCurrentPlan(planId)) return 'Current Plan';
    const currentIndex = plans.findIndex((p) => p.id === user?.plan);
    const targetIndex = plans.findIndex((p) => p.id === planId);
    if (targetIndex > currentIndex) return 'Upgrade';
    return 'Downgrade';
  };

  const handleCtaClick = (plan) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isCurrentPlan(plan.id)) return;
    
    // Open payment modal
    setPaymentModal({ isOpen: true, plan });
  };

  return (
    <div className="min-h-screen bg-espresso">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold text-sm font-bold px-4 py-1.5 rounded-full mb-6">
            <Star className="w-4 h-4" /> Choose Your Plan
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-offwhite mb-4">
            Fuel Your Day,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light">
              Your Way
            </span>
          </h1>
          <p className="text-warm-grey text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Flexible tiffin plans tailored to your taste, schedule, and budget. Cancel anytime.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center justify-center gap-4 mb-14">
            <span className={`text-sm font-bold transition-colors ${!isAnnual ? 'text-offwhite' : 'text-warm-grey'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                isAnnual ? 'bg-gold' : 'bg-white/10'
              }`}
              aria-label="Toggle annual billing"
              id="billing-toggle"
            >
              <motion.div
                className="absolute top-0.5 w-6 h-6 rounded-full bg-espresso shadow-lg"
                animate={{ left: isAnnual ? '1.75rem' : '0.25rem' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-bold transition-colors ${isAnnual ? 'text-offwhite' : 'text-warm-grey'}`}>
              Annual
            </span>
            {isAnnual && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full"
              >
                Save 20%
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => {
            const Icon = planIcons[plan.id];
            const isCurrent = isCurrentPlan(plan.id);

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className={`relative bg-gradient-to-b ${planGradients[plan.id]} border ${planBorders[plan.id]} rounded-3xl p-8 text-left transition-all duration-300 ${
                  plan.popular ? 'md:-mt-4 md:mb-4 shadow-2xl shadow-gold/10' : ''
                } ${isCurrent ? 'ring-2 ring-gold' : ''}`}
                id={`plan-${plan.id}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-gold text-espresso text-xs font-bold px-5 py-1.5 rounded-full shadow-lg shadow-gold/30 uppercase tracking-wider whitespace-nowrap">
                      ⭐ Most Popular
                    </span>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrent && (
                  <div className="absolute -top-3.5 right-4">
                    <span className="bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                      ✓ Current
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      plan.popular ? 'bg-gold/20' : 'bg-white/5'
                    }`}>
                      <Icon className={`w-5 h-5 ${plan.popular ? 'text-gold' : 'text-warm-grey'}`} />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-offwhite">{plan.name}</h3>
                  </div>
                  <p className="text-warm-grey text-sm">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isAnnual ? 'annual' : 'monthly'}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-baseline gap-1"
                    >
                      <span className="text-4xl font-bold text-offwhite">₹{getPrice(plan).toLocaleString()}</span>
                      <span className="text-warm-grey text-sm">/month</span>
                    </motion.div>
                  </AnimatePresence>
                  {isAnnual && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-emerald-400 text-xs mt-1 font-medium"
                    >
                      Save ₹{getSavings(plan).toLocaleString()}/year
                    </motion.p>
                  )}
                  {!isAnnual && (
                    <p className="text-warm-grey/50 text-xs mt-1 line-through">
                      ₹{plan.monthlyPrice.toLocaleString()} without annual plan
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-offwhite/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: isCurrent ? 1 : 1.02 }}
                  whileTap={{ scale: isCurrent ? 1 : 0.98 }}
                  disabled={isCurrent}
                  onClick={() => handleCtaClick(plan)}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-white/5 text-warm-grey cursor-default border border-white/10'
                      : `${planCtaColors[plan.id]} text-espresso shadow-lg`
                  }`}
                  id={`cta-${plan.id}`}
                >
                  {getCtaText(plan.id)}
                  {!isCurrent && <ArrowRight className="w-4 h-4" />}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-offwhite text-center mb-2">
            Compare Plans
          </h2>
          <p className="text-warm-grey text-center mb-10">
            See exactly what you get with each tier
          </p>

          <div className="overflow-x-auto">
            <table className="w-full" id="comparison-table">
              {/* Header */}
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-sm font-bold text-warm-grey w-1/4">Feature</th>
                  {plans.map((plan) => {
                    const Icon = planIcons[plan.id];
                    return (
                      <th key={plan.id} className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Icon className={`w-5 h-5 ${plan.popular ? 'text-gold' : 'text-warm-grey'}`} />
                          <span className={`text-sm font-bold ${plan.popular ? 'text-gold' : 'text-offwhite'}`}>
                            {plan.name}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {allFeatures.map((feature, i) => (
                  <motion.tr
                    key={feature.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-4 px-4 text-sm text-offwhite/70">{feature.name}</td>
                    {['starter', 'regular', 'pro'].map((planId) => {
                      const val = feature[planId];
                      return (
                        <td key={planId} className="py-4 px-4 text-center">
                          {val === true ? (
                            <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                          ) : val === false ? (
                            <X className="w-5 h-5 text-white/10 mx-auto" />
                          ) : (
                            <span className="text-sm text-offwhite/80 font-medium">{val}</span>
                          )}
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>

      {/* Razorpay / Trust Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-cocoa border border-white/5 rounded-3xl p-8 md:p-12 text-center"
        >
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-warm-grey text-sm">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2 text-warm-grey text-sm">
              <CreditCard className="w-5 h-5 text-blue-400" />
              <span>Razorpay Powered</span>
            </div>
          </div>

          <h3 className="text-xl md:text-2xl font-serif font-bold text-offwhite mb-3">
            Ready to get started?
          </h3>
          <p className="text-warm-grey max-w-lg mx-auto mb-8">
            Start with a 7-day free trial. No credit card required. Cancel anytime — no questions asked.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCtaClick(plans[1])} // Default to regular
              className="bg-gold hover:bg-gold-light text-espresso px-8 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-gold/20 flex items-center gap-2"
              id="cta-start-trial"
            >
              Start 7-Day Free Trial <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="border border-white/10 hover:border-gold/30 text-offwhite px-8 py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
              id="cta-contact-sales"
            >
              Contact Sales
            </motion.button>
          </div>

          <p className="text-warm-grey/50 text-xs mt-6">
            Prices are in INR. GST applicable. Plans auto-renew unless cancelled.
          </p>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-offwhite text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I switch plans anytime?',
                a: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect from the next billing cycle. Pro-rated refunds are processed for downgrades.',
              },
              {
                q: 'What happens after the free trial?',
                a: 'After your 7-day free trial, you\'ll be billed for your chosen plan. You can cancel during the trial with no charges — we\'ll send reminders before it ends.',
              },
              {
                q: 'How does the annual discount work?',
                a: 'When you choose annual billing, you save 20% compared to monthly. You\'re billed once per year at the discounted rate. Cancel anytime with a pro-rated refund.',
              },
              {
                q: 'Is there a refund policy?',
                a: 'Yes! If you\'re not satisfied, contact us within 7 days of any billing for a full refund. We want you to love every meal.',
              },
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />

      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, plan: null })}
        plan={paymentModal.plan}
        isAnnual={isAnnual}
      />
    </div>
  );
};

/* FAQ Accordion Item */
const FAQItem = ({ question, answer, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="bg-cocoa border border-white/5 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
        id={`faq-${index}`}
      >
        <span className="text-sm font-bold text-offwhite">{question}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          className="text-gold text-xl font-light flex-shrink-0 ml-4"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="px-6 pb-5 text-sm text-warm-grey leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SubscriptionPage;
