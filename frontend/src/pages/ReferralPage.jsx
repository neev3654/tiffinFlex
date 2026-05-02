import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gift, Copy, Share2, CheckCircle, Users, Trophy, Star,
  ArrowRight, Crown, Medal, Award,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addNotification } from '../store/slices/uiSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* Dummy referral data */
const referralStats = { sent: 7, signups: 4, rewardsEarned: '₹1,200' };

const rewardTiers = [
  { count: 3, reward: '₹200 credit', icon: Gift, reached: true },
  { count: 5, reward: '1 free week', icon: Star, reached: false },
  { count: 10, reward: '1 free month', icon: Crown, reached: false },
  { count: 25, reward: 'Lifetime 10% off', icon: Trophy, reached: false },
];

const leaderboard = [
  { rank: 1, name: 'Sneha Patel', referrals: 18, avatar: 'https://i.pravatar.cc/150?img=9' },
  { rank: 2, name: 'Arjun Reddy', referrals: 14, avatar: 'https://i.pravatar.cc/150?img=12' },
  { rank: 3, name: 'Priya Sharma', referrals: 11, avatar: 'https://i.pravatar.cc/150?img=1' },
  { rank: 4, name: 'Rahul Mehta', referrals: 9, avatar: 'https://i.pravatar.cc/150?img=3' },
  { rank: 5, name: 'Ananya Desai', referrals: 6, avatar: 'https://i.pravatar.cc/150?img=5' },
];

const rankColors = {
  1: 'text-gold',
  2: 'text-gray-300',
  3: 'text-amber-600',
};

const ReferralPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [copied, setCopied] = useState(false);

  const referralCode = `TIFFIN-${(user?.name || 'NEEV').split(' ')[0].toUpperCase()}-2026`;
  const referralLink = `https://tiffinflex.com/join?ref=${referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    dispatch(addNotification({ message: 'Referral link copied!', type: 'success' }));
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `🍛 Hey! I've been using TiffinFlex for daily tiffin and it's amazing. Use my code ${referralCode} to get started — we both earn rewards! ${referralLink}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const progress = (referralStats.signups / 5) * 100; // progress toward next tier (5)

  return (
    <div className="min-h-screen bg-espresso">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold text-sm font-bold px-4 py-1.5 rounded-full mb-5">
            <Gift className="w-4 h-4" /> Refer & Earn
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-offwhite mb-3">
            Share the Love,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light">
              Earn Rewards
            </span>
          </h1>
          <p className="text-warm-grey text-lg max-w-xl mx-auto">
            Invite friends to TiffinFlex and earn free meals, credits, and exclusive perks for every signup.
          </p>
        </motion.div>

        {/* Referral Code + Share */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-cocoa border border-white/5 rounded-3xl p-8 mb-8"
        >
          <h2 className="text-lg font-bold text-offwhite mb-4">Your Referral Link</h2>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite/80 font-mono truncate">
              {referralLink}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={copyLink}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gold hover:bg-gold-light text-espresso'
              }`}
              id="copy-referral"
            >
              {copied ? <><CheckCircle className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
            </motion.button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-warm-grey flex items-center gap-2">
              <span className="text-offwhite font-bold">Code:</span> {referralCode}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={shareWhatsApp}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors"
              id="share-whatsapp"
            >
              <Share2 className="w-4 h-4" /> Share via WhatsApp
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: 'Invites Sent', value: referralStats.sent, icon: Share2, color: 'text-blue-400' },
            { label: 'Friends Signed Up', value: referralStats.signups, icon: Users, color: 'text-emerald-400' },
            { label: 'Rewards Earned', value: referralStats.rewardsEarned, icon: Gift, color: 'text-gold' },
          ].map((stat, i) => (
            <div key={stat.label} className="bg-cocoa border border-white/5 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-offwhite">{stat.value}</p>
                <p className="text-xs text-warm-grey">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reward Tiers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-cocoa border border-white/5 rounded-3xl p-8"
          >
            <h2 className="text-lg font-bold text-offwhite mb-2">Reward Tiers</h2>
            <p className="text-sm text-warm-grey mb-6">
              Unlock bigger rewards as you refer more friends.
            </p>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-warm-grey mb-2">
                <span>{referralStats.signups} referrals</span>
                <span>Next: 5 referrals</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full"
                />
              </div>
            </div>

            <div className="space-y-3">
              {rewardTiers.map((tier) => (
                <div
                  key={tier.count}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                    tier.reached
                      ? 'bg-gold/10 border-gold/20'
                      : 'bg-white/[0.02] border-white/5'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tier.reached ? 'bg-gold/20' : 'bg-white/5'
                  }`}>
                    <tier.icon className={`w-5 h-5 ${tier.reached ? 'text-gold' : 'text-warm-grey'}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${tier.reached ? 'text-gold' : 'text-offwhite'}`}>
                      {tier.reward}
                    </p>
                    <p className="text-xs text-warm-grey">{tier.count} referrals</p>
                  </div>
                  {tier.reached && (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  )}
                  {!tier.reached && (
                    <ArrowRight className="w-4 h-4 text-warm-grey/30" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-cocoa border border-white/5 rounded-3xl p-8"
          >
            <h2 className="text-lg font-bold text-offwhite mb-2 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gold" /> Top Referrers
            </h2>
            <p className="text-sm text-warm-grey mb-6">
              This month's referral champions.
            </p>

            <div className="space-y-3">
              {leaderboard.map((entry) => {
                const RankIcon = entry.rank <= 3 ? Medal : Award;
                return (
                  <div
                    key={entry.rank}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-gold/10 transition-colors"
                  >
                    <span className={`text-lg font-bold w-6 text-center ${rankColors[entry.rank] || 'text-warm-grey'}`}>
                      {entry.rank <= 3 ? <RankIcon className={`w-5 h-5 ${rankColors[entry.rank]}`} /> : `#${entry.rank}`}
                    </span>
                    <img
                      src={entry.avatar}
                      alt={entry.name}
                      className="w-10 h-10 rounded-full border border-white/10 object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-offwhite">{entry.name}</p>
                      <p className="text-xs text-warm-grey">{entry.referrals} referrals</p>
                    </div>
                    {entry.rank === 1 && (
                      <span className="text-xs bg-gold/20 text-gold px-3 py-1 rounded-full font-bold">👑 Leader</span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReferralPage;
