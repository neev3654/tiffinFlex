import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ArrowRightLeft, CalendarDays, CreditCard, Truck, Gift, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { markAsRead, markAllRead } from '../store/slices/uiSlice';

const typeIcons = {
  swap: ArrowRightLeft,
  menu: CalendarDays,
  subscription: CreditCard,
  delivery: Truck,
  reward: Gift,
};

const typeColors = {
  swap: 'text-gold bg-gold/10',
  menu: 'text-blue-400 bg-blue-400/10',
  subscription: 'text-purple-400 bg-purple-400/10',
  delivery: 'text-emerald-400 bg-emerald-400/10',
  reward: 'text-orange-400 bg-orange-400/10',
};

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { persistentNotifications: notifications } = useSelector((state) => state.ui);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id) => dispatch(markAsRead(id));
  const handleMarkAllRead = () => dispatch(markAllRead());

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-warm-grey hover:text-gold hover:border-gold/20 transition-all"
        id="notification-bell"
        aria-label="Notifications"
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-80 sm:w-96 bg-cocoa border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
            id="notification-dropdown"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <h3 className="text-sm font-bold text-offwhite">
                Notifications {unreadCount > 0 && <span className="text-gold">({unreadCount})</span>}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-gold hover:text-gold-light font-medium transition-colors flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notif) => {
                const Icon = typeIcons[notif.type] || Bell;
                const colorClass = typeColors[notif.type] || 'text-warm-grey bg-white/5';
                return (
                  <button
                    key={notif.id}
                    onClick={() => handleMarkAsRead(notif.id)}
                    className={`w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-white/[0.03] transition-colors border-b border-white/5 last:border-0 ${
                      !notif.read ? 'bg-white/[0.02]' : ''
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium truncate ${notif.read ? 'text-warm-grey' : 'text-offwhite'}`}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-warm-grey/70 mt-0.5 line-clamp-2">{notif.message}</p>
                      <p className="text-[10px] text-warm-grey/40 mt-1">{notif.time}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/5 text-center">
              <button className="text-xs text-gold hover:text-gold-light font-medium transition-colors">
                View All Notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
