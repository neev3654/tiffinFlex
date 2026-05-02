import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Menu, X, LogOut, LayoutDashboard, Shield, Moon, Sun } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const isAuthenticated = !!token;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsOpen(false);
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const navLinks = [
    { name: 'Our Menu', href: '/menu' },
    { name: 'Subscription Plans', href: '/subscription' },
    { name: 'Nutrition Tracker', href: '/nutrition' },
    { name: 'Refer & Earn', href: '/referral' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-espresso/80 backdrop-blur-md py-3 shadow-xl' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" aria-label="TiffinFlex Home" className="flex items-center gap-2 group cursor-pointer">
            <UtensilsCrossed className="w-8 h-8 text-gold group-hover:rotate-12 transition-transform" />
            <span className="text-xl font-serif font-bold tracking-tight italic text-gold">TiffinFlex</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.href} className="text-sm font-medium text-offwhite/80 hover:text-gold transition-colors relative group">
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={handleToggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center text-warm-grey hover:bg-white/5 hover:text-gold transition-colors hidden md:flex"
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-offwhite/80 hover:text-gold transition-colors">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-2 text-sm font-medium text-offwhite/80 hover:text-gold transition-colors">
                    <Shield className="w-4 h-4" /> Admin
                  </Link>
                )}
                <NotificationBell />
                <Link to="/profile" className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold font-bold text-sm hover:bg-gold/30 transition-colors">
                  {user?.name?.charAt(0) || 'U'}
                </Link>
                <button onClick={handleLogout} className="text-sm text-warm-grey hover:text-red-400 transition-colors flex items-center gap-1">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-sm font-medium text-gold hover:text-gold-light transition-colors">Login</button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/signup')} className="bg-gold hover:bg-gold-light text-espresso px-6 py-2 rounded-full font-bold text-sm transition-colors shadow-lg shadow-gold/20">
                  Subscribe Now
                </motion.button>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={handleToggleTheme}
              className="text-warm-grey hover:text-gold transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              className="text-gold p-2" 
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-cocoa border-t border-white/5 px-4 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)} className="text-lg font-medium text-offwhite hover:text-gold">{link.name}</Link>
          ))}
          <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-gold font-bold flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> Dashboard</Link>
                <button onClick={handleLogout} className="text-red-400 font-bold flex items-center gap-2"><LogOut className="w-4 h-4" /> Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => { navigate('/login'); setIsOpen(false); }} className="text-gold font-bold">Login</button>
                <button onClick={() => { navigate('/signup'); setIsOpen(false); }} className="bg-gold text-espresso py-3 rounded-full font-bold">Subscribe Now</button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
