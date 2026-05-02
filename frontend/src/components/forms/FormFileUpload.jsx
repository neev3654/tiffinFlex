import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormikContext } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, File, CheckCircle, AlertCircle } from 'lucide-react';

const FormFileUpload = ({ name, label, accept = { 'image/*': [] }, maxSize = 5242880 }) => {
  const { setFieldValue, values, errors, touched } = useFormikContext();
  const [preview, setPreview] = useState(null);
  const isError = touched[name] && errors[name];

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFieldValue(name, file);
      setPreview(URL.createObjectURL(file));
    }
  }, [name, setFieldValue]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  const removeFile = (e) => {
    e.stopPropagation();
    setFieldValue(name, null);
    setPreview(null);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="text-sm font-medium text-warm-grey mb-1.5 block">
          {label}
        </label>
      )}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer text-center ${
          isDragActive 
            ? 'border-gold bg-gold/5' 
            : isError 
              ? 'border-red-500/30 bg-red-500/5' 
              : 'border-white/10 bg-white/5 hover:border-white/20'
        }`}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {values[name] ? (
            <motion.div
              key="file-preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
            >
              {preview ? (
                <div className="relative w-20 h-20 mb-4">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl border border-white/10" />
                  <button
                    onClick={removeFile}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 bg-gold/10 rounded-xl flex items-center justify-center mb-4 text-gold">
                  <File className="w-8 h-8" />
                </div>
              )}
              <p className="text-sm font-bold text-offwhite max-w-[200px] truncate">{values[name].name}</p>
              <p className="text-xs text-warm-grey mt-1">{(values[name].size / 1024 / 1024).toFixed(2)} MB</p>
              <div className="flex items-center gap-1.5 mt-4 text-emerald-400 text-xs font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                Ready to upload
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="drop-zone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${isDragActive ? 'bg-gold text-espresso' : 'bg-white/5 text-warm-grey'}`}>
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-offwhite mb-1">
                {isDragActive ? 'Drop it here!' : 'Click or drag to upload'}
              </p>
              <p className="text-xs text-warm-grey">PNG, JPG or GIF up to 5MB</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AnimatePresence>
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-1.5 mt-2 text-red-400 text-xs font-medium"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {errors[name]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormFileUpload;
