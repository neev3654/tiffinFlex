import React from 'react';
import { useField } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ChevronDown } from 'lucide-react';

const FormSelect = ({ label, options, icon: Icon, ...props }) => {
  const [field, meta] = useField(props);
  const isError = meta.touched && meta.error;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={props.id || props.name} 
          className="text-sm font-medium text-warm-grey mb-1.5 block"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isError ? 'text-red-400' : 'text-warm-grey'}`} />
        )}
        <select
          {...field}
          {...props}
          className={`w-full bg-cocoa border rounded-xl py-3.5 px-4 appearance-none transition-all outline-none text-offwhite ${
            Icon ? 'pl-11' : ''
          } ${
            isError 
              ? 'border-red-500/50 focus:border-red-500 ring-1 ring-red-500/20' 
              : 'border-white/10 focus:border-gold/50 focus:ring-1 focus:ring-gold/30'
          }`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-espresso">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey pointer-events-none" />
      </div>
      <AnimatePresence>
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs font-medium"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {meta.error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormSelect;
