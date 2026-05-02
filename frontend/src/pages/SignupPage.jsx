import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, User, Mail, Lock, ArrowRight, ArrowLeft, Check, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { signup, clearError } from '../store/slices/authSlice';
import { signupSchema } from '../utils/validationSchemas';
import FormInput from '../components/forms/FormInput';
import useFormPersistence from '../hooks/useFormPersistence';
import plans from '../data/plans';

const steps = ['Account', 'Preferences', 'Plan'];
const allergies = ['Gluten', 'Dairy', 'Nuts', 'Soy', 'Eggs', 'Shellfish'];
const spiceLevels = ['Mild', 'Medium', 'Spicy', 'Extra Spicy'];

const SignupContent = ({ step, setStep, loading, error, localError, setLocalError, handleSubmit }) => {
  const { values, setFieldValue, validateForm, setFieldTouched } = useFormikContext();
  useFormPersistence('signup-form-v1');

  const nextStep = async () => {
    setLocalError('');
    // Validate only current step fields
    const errors = await validateForm();
    if (step === 0) {
      const step0Fields = ['name', 'email', 'password', 'phone'];
      const hasErrors = step0Fields.some(f => errors[f]);
      if (hasErrors) {
        step0Fields.forEach(f => setFieldTouched(f, true));
        return;
      }
    }
    if (step === 1 && !values.diet) {
      setLocalError('Please select a dietary preference.');
      return;
    }
    if (step < 2) setStep(step + 1);
  };

  const slideVariants = {
    enter: { x: 40, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -40, opacity: 0 },
  };

  const toggleAllergy = (a) => {
    const list = values.selectedAllergies.includes(a)
      ? values.selectedAllergies.filter((x) => x !== a)
      : [...values.selectedAllergies, a];
    setFieldValue('selectedAllergies', list);
  };

  return (
    <Form className="bg-cocoa border border-white/5 rounded-2xl p-8">
      {(localError || error) && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">{localError || error}</div>
      )}

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h2 className="text-2xl font-serif font-bold text-offwhite mb-6">Create Account</h2>
            <div className="space-y-4">
              <FormInput label="Full Name" name="name" placeholder="Nee Patel" icon={User} />
              <FormInput label="Email" name="email" type="email" placeholder="you@example.com" icon={Mail} />
              <FormInput label="Phone Number" name="phone" placeholder="10-digit number" icon={Phone} />
              <FormInput label="Password" name="password" type="password" placeholder="Min 8 characters" icon={Lock} />
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="s2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h2 className="text-2xl font-serif font-bold text-offwhite mb-6">Dietary Preferences</h2>
            <div className="space-y-6">
              <div>
                <label className="text-sm text-warm-grey mb-3 block">I eat</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Vegetarian', 'Non-Veg', 'Vegan'].map((d) => (
                    <button key={d} type="button" onClick={() => setFieldValue('diet', d)} className={`py-3 rounded-xl text-sm font-bold transition-all ${values.diet === d ? 'bg-gold text-espresso' : 'bg-espresso border border-white/10 text-warm-grey hover:border-gold/30'}`}>{d}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-warm-grey mb-3 block">Allergies (if any)</label>
                <div className="flex flex-wrap gap-2">
                  {allergies.map((a) => (
                    <button key={a} type="button" onClick={() => toggleAllergy(a)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${values.selectedAllergies.includes(a) ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-espresso border border-white/10 text-warm-grey hover:border-gold/30'}`}>{a}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-warm-grey mb-3 block">Spice Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {spiceLevels.map((s) => (
                    <button key={s} type="button" onClick={() => setFieldValue('spiceLevel', s)} className={`py-2.5 rounded-xl text-xs font-bold transition-all ${values.spiceLevel === s ? 'bg-gold text-espresso' : 'bg-espresso border border-white/10 text-warm-grey hover:border-gold/30'}`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            <h2 className="text-2xl font-serif font-bold text-offwhite mb-6">Choose Your Plan</h2>
            <div className="space-y-4">
              {plans.map((plan) => (
                <button key={plan.id} type="button" onClick={() => setFieldValue('selectedPlan', plan.id)} className={`w-full text-left p-5 rounded-xl border transition-all ${values.selectedPlan === plan.id ? 'border-gold bg-gold/5' : 'border-white/10 hover:border-gold/30'}`}>
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

      <div className="flex gap-4 mt-8">
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className="flex-1 border border-white/10 text-offwhite py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
        {step < 2 ? (
          <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={nextStep} className="flex-1 bg-gold text-espresso py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gold-light transition-colors">
            Next <ArrowRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.button 
            type="submit"
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            disabled={loading}
            className={`flex-1 bg-gold text-espresso py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gold-light transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-espresso border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>Start My Tiffin <ArrowRight className="w-4 h-4" /></>
            )}
          </motion.button>
        )}
      </div>
    </Form>
  );
};

// Wrapper for useFormikContext access
import { useFormikContext } from 'formik';

const SignupPage = () => {
  const [step, setStep] = useState(0);
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (values) => {
    setLocalError('');
    dispatch(clearError());

    const resultAction = await dispatch(signup(values));

    if (signup.fulfilled.match(resultAction)) {
      if (resultAction.payload.requiresVerification) {
        sessionStorage.removeItem('signup-form-v1'); // Clear on success
        navigate('/verify-otp', { state: { email: resultAction.payload.email } });
      }
    }
  };

  return (
    <div className="min-h-screen bg-espresso flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
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

        <Formik
          initialValues={{
            name: '', email: '', password: '', phone: '',
            diet: '', selectedAllergies: [], spiceLevel: 'Medium', selectedPlan: 'regular'
          }}
          validationSchema={signupSchema}
          onSubmit={handleSubmit}
        >
          <SignupContent 
            step={step} 
            setStep={setStep} 
            loading={loading} 
            error={error} 
            localError={localError} 
            setLocalError={setLocalError} 
          />
        </Formik>

        <p className="text-center text-warm-grey mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-gold font-bold hover:text-gold-light transition-colors">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;

