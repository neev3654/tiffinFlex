import React from 'react';
import { UtensilsCrossed, Instagram, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-cocoa border-t border-white/5 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <UtensilsCrossed className="w-7 h-7 text-gold" />
              <span className="text-xl font-serif font-bold italic text-gold">TiffinFlex</span>
            </div>
            <p className="text-warm-grey text-sm leading-relaxed">
              Subscribe once. Customize daily. Your tiffin, your rules.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gold mb-4">Explore</h4>
            <ul className="space-y-3">
              {['Our Menu', 'Subscription Plans', 'How It Works', 'FAQ'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-warm-grey hover:text-offwhite transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gold mb-4">Company</h4>
            <ul className="space-y-3">
              {['About Us', 'Sustainability', 'Careers', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-warm-grey hover:text-offwhite transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gold mb-4">Connect</h4>
            <div className="flex gap-4">
              {[Instagram, Twitter, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold/20 transition-colors">
                  <Icon className="w-4 h-4 text-warm-grey hover:text-gold" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-warm-grey">
            © 2026 TiffinFlex. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service'].map((item) => (
              <a key={item} href="#" className="text-xs text-warm-grey hover:text-offwhite transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
