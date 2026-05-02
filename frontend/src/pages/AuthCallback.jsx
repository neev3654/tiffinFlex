import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');
    const error = searchParams.get('error');

    console.log('AuthCallback received:', { 
      hasToken: !!token, 
      hasUser: !!userStr, 
      hasError: !!error,
      allParams: Object.fromEntries(searchParams.entries())
    });

    if (error) {
      console.log('Error detected:', error);
      navigate('/login?error=google_auth_failed');
      return;
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        console.log('Parsed user:', user);
        
        // Store token and user data
        localStorage.setItem('tf_token', token);
        localStorage.setItem('tf_user', JSON.stringify(user));
        console.log('Stored token and user data');
        
        // Redirect to dashboard
        console.log('Redirecting to dashboard');
        navigate('/dashboard');
      } catch (err) {
        console.error('Auth callback error:', err);
        navigate('/login?error=auth_failed');
      }
    } else {
      console.log('Missing token or user, redirecting to login');
      navigate('/login?error=auth_failed');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-espresso flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-4" />
        <p className="text-warm-grey">Completing sign in...</p>
      </motion.div>
    </div>
  );
};

export default AuthCallback;
