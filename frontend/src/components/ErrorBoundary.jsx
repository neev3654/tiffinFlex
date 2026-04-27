import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-espresso flex flex-col items-center justify-center p-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-cocoa border border-red-500/20 p-8 rounded-3xl max-w-md w-full shadow-2xl"
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertOctagon className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-offwhite mb-3">Oops! Something went wrong.</h1>
            <p className="text-warm-grey mb-8 text-sm">
              We're having trouble loading this page. Please try refreshing or come back later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gold hover:bg-gold-light text-espresso py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Refresh Page
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
