import React from 'react';
import { Coffee, MapPin, Phone, Mail, Clock, Heart, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'store' | 'admin' | 'staff' | 'orders') => void;
  onOpenSeedModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#120d0a] border-t border-stone-800/80 text-stone-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#C68B59]/20 border border-[#C68B59]/40 flex items-center justify-center text-[#C68B59]">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="text-lg font-serif font-bold text-stone-100">
                Ahnaf <span className="text-[#C68B59]">Coffee</span>
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Handcrafted single-origin coffees, velvety microfoam lattes, and artisanal French pastries. Freshly pulled for Dhaka's coffee lovers.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-amber-400/90 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Strictly Cash on Delivery & Counter Pickup</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-stone-200 font-serif font-bold text-sm tracking-wide">
              Boutique Menu
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onNavigate('store')} className="hover:text-[#C68B59] transition-colors">
                  Hot Coffees & Espressos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('store')} className="hover:text-[#C68B59] transition-colors">
                  Cold Brews & Chilled Americanos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('store')} className="hover:text-[#C68B59] transition-colors">
                  Artisanal French Croissants & Bakery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('orders')} className="hover:text-[#C68B59] transition-colors">
                  Live Order Tracker & Receipts
                </button>
              </li>
            </ul>
          </div>

          {/* Store Location & Hours */}
          <div className="space-y-2">
            <h4 className="text-stone-200 font-serif font-bold text-sm tracking-wide">
              Banani Roastery
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C68B59] shrink-0 mt-0.5" />
                <span>Plot 42, Road 11, Block D, Banani, Dhaka-1213</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C68B59] shrink-0" />
                <span>Daily: 7:30 AM – 11:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C68B59] shrink-0" />
                <span>+880 1711-002233 / +880 1822-445566</span>
              </div>
            </div>
          </div>

          {/* Management & Access */}
          <div className="space-y-2">
            <h4 className="text-stone-200 font-serif font-bold text-sm tracking-wide">
              Shop Roles & Staff
            </h4>
            <p className="text-xs text-stone-400">
              Role-Based Access Control (RBAC) portal for Ahnaf Coffee Shop operations.
            </p>
            <div className="pt-1 flex flex-col gap-1.5">
              <button
                onClick={() => onNavigate('admin')}
                className="text-left text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 font-medium"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Super Admin Operations
              </button>
              <button
                onClick={() => onNavigate('staff')}
                className="text-left text-xs text-emerald-300 hover:text-emerald-200 flex items-center gap-1 font-medium"
              >
                <Coffee className="w-3.5 h-3.5" />
                Staff Barista Station & POS
              </button>
            </div>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} Ahnaf Coffee Shop. All rights reserved. Dhaka, Bangladesh.</p>
          <p className="flex items-center gap-1">
            Handcrafted with <Heart className="w-3 h-3 text-[#C68B59] fill-[#C68B59]" /> by Ahnaf Roasters
          </p>
        </div>
      </div>
    </footer>
  );
};
