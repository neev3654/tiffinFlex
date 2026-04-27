import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, plan, isAnnual }) => {
  const [step, setStep] = useState('checkout'); // checkout, processing, success, error
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStep('checkout');
      setCouponCode('');
      setDiscount(0);
    }
  }, [isOpen]);

  if (!isOpen || !plan) return null;

  const basePrice = isAnnual ? plan.annualPrice * 12 : plan.monthlyPrice;
  const subtotal = basePrice - discount;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'WELCOME20') {
      setDiscount(basePrice * 0.2); // 20% off
    } else if (couponCode.toUpperCase() === 'FLAT500') {
      setDiscount(500);
    } else {
      setDiscount(0);
    }
  };

  const handlePayment = () => {
    setStep('processing');
    
    // Simulate payment gateway delay
    setTimeout(() => {
      // 90% chance of success for demo purposes
      if (Math.random() > 0.1) {
        setStep('success');
      } else {
        setStep('error');
      }
    }, 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={step === 'processing' ? undefined : onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-espresso border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-cocoa">
            <h2 className="text-lg font-bold text-offwhite flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gold" /> Secure Checkout
            </h2>
            {step !== 'processing' && (
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-warm-grey hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="p-6">
            {step === 'checkout' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Plan Summary */}
                <div className="bg-cocoa border border-white/5 rounded-2xl p-4 mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-base font-bold text-offwhite">{plan.name} Plan</h3>
                      <p className="text-sm text-warm-grey">
                        {isAnnual ? 'Billed annually' : 'Billed monthly'}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-gold">₹{basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5 text-xs text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Includes 7-day free trial</span>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-warm-grey uppercase tracking-wider mb-2">
                    Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. WELCOME20"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-offwhite placeholder-warm-grey/40 focus:outline-none focus:border-gold/30 uppercase"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-white/10 hover:bg-white/20 text-offwhite px-4 py-2.5 rounded-xl font-bold text-sm transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {discount > 0 && (
                    <p className="text-xs text-emerald-400 mt-2">Coupon applied! ₹{discount.toLocaleString()} off.</p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-sm text-warm-grey">
                    <span>Subtotal</span>
                    <span>₹{basePrice.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-400">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-warm-grey">
                    <span>GST (18%)</span>
                    <span>₹{gst.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-offwhite pt-3 border-t border-white/5">
                    <span>Total</span>
                    <span>₹{total.toFixed(0)}</span>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  className="w-full bg-[#3395FF] hover:bg-[#2084f0] text-white py-3.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-[#3395FF]/20 flex items-center justify-center gap-2"
                >
                  Pay with Razorpay
                </button>
                <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-warm-grey">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Payments are 100% secure & encrypted</span>
                </div>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 flex flex-col items-center text-center"
              >
                <Loader2 className="w-12 h-12 text-[#3395FF] animate-spin mb-4" />
                <h3 className="text-lg font-bold text-offwhite mb-2">Processing Payment</h3>
                <p className="text-sm text-warm-grey">Please don't close this window.</p>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-offwhite mb-2">Payment Successful!</h3>
                <p className="text-sm text-warm-grey mb-8">
                  Welcome to TiffinFlex {plan.name}. Your subscription is now active.
                </p>
                <button
                  onClick={onClose}
                  className="w-full bg-white/10 hover:bg-white/20 text-offwhite py-3 rounded-xl font-bold text-sm transition-colors"
                >
                  Go to Dashboard
                </button>
              </motion.div>
            )}

            {step === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-offwhite mb-2">Payment Failed</h3>
                <p className="text-sm text-warm-grey mb-8">
                  We couldn't process your payment. Please try again or use a different card.
                </p>
                <div className="w-full flex gap-3">
                  <button
                    onClick={() => setStep('checkout')}
                    className="flex-1 bg-gold hover:bg-gold-light text-espresso py-3 rounded-xl font-bold text-sm transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-offwhite py-3 rounded-xl font-bold text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;
