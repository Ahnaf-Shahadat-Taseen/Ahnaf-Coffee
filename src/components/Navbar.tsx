import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  Coffee, 
  ShoppingBag, 
  User, 
  ShieldCheck, 
  Sparkles, 
  LogOut, 
  Menu, 
  X, 
  Clock, 
  Search,
  ChevronDown,
  Phone,
  Lock,
  LogIn
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentView: 'store' | 'admin' | 'staff' | 'orders';
  onNavigate: (view: 'store' | 'admin' | 'staff' | 'orders') => void;
  onOpenAuth: () => void;
  onOpenTracker: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenTracker
}) => {
  const { userProfile, role, logout, isAdmin, isStaff, isAuthenticated } = useAuth();
  const { totalItems, subtotal, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getRoleBadge = (r: UserRole | null) => {
    switch (r) {
      case 'admin':
        return (
          <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            Super Admin
          </span>
        );
      case 'staff':
        return (
          <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <Coffee className="w-3 h-3 text-emerald-400" />
            Staff Barista
          </span>
        );
      case 'customer':
        return (
          <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-stone-700/60 text-stone-300 border border-stone-600">
            Customer
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-stone-800 text-stone-400 border border-stone-700">
            Not Signed In
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#17110e]/95 backdrop-blur-md border-b border-[#C68B59]/20 shadow-xl">
      {/* Top boutique announcement & Status bar */}
      <div className="bg-[#120d0b] border-b border-stone-800/80 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-stone-400 text-[11px]">
            <span className="flex items-center gap-1 text-[#C68B59] font-medium">
              <Sparkles className="w-3 h-3 text-amber-400" /> Freshly Roasted Arabica Daily
            </span>
            <span className="hidden sm:inline-block text-stone-600">|</span>
            <span className="hidden sm:flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-500" /> 7:30 AM - 11:00 PM (Banani, Dhaka)
            </span>
            <span className="hidden md:inline-block text-stone-600">|</span>
            <span className="hidden md:flex items-center gap-1 text-stone-400">
              <Phone className="w-3 h-3 text-[#C68B59]" /> +880 1711-002233
            </span>
          </div>

          {/* Active Session Status */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-stone-400 hidden xs:inline">Active Interface:</span>
                {getRoleBadge(role)}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="text-[11px] text-[#C68B59] hover:underline flex items-center gap-1 font-medium"
              >
                <Lock className="w-3 h-3" />
                <span>Sign in with Email & Password</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand identity */}
        <div 
          onClick={() => {
            if (isAdmin) onNavigate('admin');
            else if (isStaff) onNavigate('staff');
            else onNavigate('store');
          }} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C68B59] to-[#8C5329] p-0.5 shadow-lg shadow-[#C68B59]/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#1e1713] rounded-[14px] flex items-center justify-center">
              <Coffee className="w-6 h-6 text-[#C68B59] group-hover:rotate-6 transition-transform" />
            </div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#FBF8F5] block leading-tight">
              Ahnaf <span className="text-[#C68B59]">Coffee</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase text-stone-400 font-medium block">
              Artisanal Roasters • Banani
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links — Customized per Role */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#1a1410]/70 p-1.5 rounded-full border border-stone-800">
          
          {/* Super Admin Dashboard tab */}
          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 transition-all ${
                currentView === 'admin'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-300 hover:bg-amber-950/40'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Super Admin Operations
            </button>
          )}

          {/* Staff Barista Station tab */}
          {(isStaff || isAdmin) && (
            <button
              onClick={() => onNavigate('staff')}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 transition-all ${
                currentView === 'staff'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-300 hover:bg-emerald-950/40'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              Barista POS Station
            </button>
          )}

          {/* Customer / Storefront Menu */}
          <button
            onClick={() => onNavigate('store')}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              currentView === 'store'
                ? 'bg-[#C68B59] text-white shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/40'
            }`}
          >
            Menu & Store
          </button>

          {/* My Orders & Tracking */}
          <button
            onClick={() => onNavigate('orders')}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              currentView === 'orders'
                ? 'bg-[#C68B59] text-white shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/40'
            }`}
          >
            Orders & Tracking
          </button>
        </nav>

        {/* Right action icons & user profile */}
        <div className="flex items-center gap-3">
          
          {/* Quick Track Search Button */}
          <button
            type="button"
            onClick={onOpenTracker}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700/60 text-stone-300 hover:border-[#C68B59] hover:text-[#C68B59] text-xs font-medium transition-all"
            title="Track Order with ID"
          >
            <Search className="w-3.5 h-3.5 text-[#C68B59]" />
            <span>Track Order</span>
          </button>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#261c16] hover:bg-[#32241c] border border-[#C68B59]/30 transition-all shadow-md group"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#C68B59] group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#C68B59] to-amber-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border border-[#17110e]">
                  {totalItems}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                Cart
              </span>
              <span className="text-xs font-bold text-[#FBF8F5]">
                ৳ {subtotal}
              </span>
            </div>
          </button>

          {/* User Profile / Auth Button */}
          {isAuthenticated && userProfile ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-stone-900/90 border border-stone-700/70 hover:border-[#C68B59] transition-all"
              >
                <img
                  src={userProfile.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={userProfile.displayName}
                  className="w-8 h-8 rounded-lg object-cover border border-[#C68B59]/40"
                />
                <div className="hidden md:block text-left pr-1">
                  <p className="text-xs font-semibold text-stone-200 leading-tight truncate max-w-[110px]">
                    {userProfile.displayName}
                  </p>
                  <p className="text-[10px] text-[#C68B59] font-medium capitalize">
                    {userProfile.role}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden md:block" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 glass-dropdown rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="p-3 border-b border-stone-800">
                    <p className="text-xs text-stone-400">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">{userProfile.displayName}</p>
                    <p className="text-[11px] text-stone-400 truncate">{userProfile.email}</p>
                    <div className="mt-2">{getRoleBadge(userProfile.role)}</div>
                  </div>

                  <div className="p-1 space-y-1">
                    {isAdmin && (
                      <button
                        onClick={() => {
                          onNavigate('admin');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-950/40 rounded-lg flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        Super Admin Dashboard
                      </button>
                    )}

                    {(isStaff || isAdmin) && (
                      <button
                        onClick={() => {
                          onNavigate('staff');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-950/40 rounded-lg flex items-center gap-2"
                      >
                        <Coffee className="w-4 h-4 text-emerald-400" />
                        Staff Barista Station
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onNavigate('store');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800/70 rounded-lg flex items-center gap-2"
                    >
                      <Coffee className="w-4 h-4 text-[#C68B59]" />
                      Browse Coffee Menu
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('orders');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800/70 rounded-lg flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#C68B59]" />
                      My Orders & History
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                        onNavigate('store');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/30 rounded-lg flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C68B59] to-[#9E5D2A] text-white text-xs font-bold shadow-md hover:brightness-110 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#17110e] border-b border-stone-800 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col gap-1.5 pt-2">
            {isAdmin && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 ${
                  currentView === 'admin' ? 'bg-amber-600 text-white' : 'text-amber-400 hover:bg-stone-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Super Admin Dashboard
              </button>
            )}

            {(isStaff || isAdmin) && (
              <button
                onClick={() => {
                  onNavigate('staff');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 ${
                  currentView === 'staff' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:bg-stone-800'
                }`}
              >
                <Coffee className="w-4 h-4" />
                Staff Barista Station
              </button>
            )}

            <button
              onClick={() => {
                onNavigate('store');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                currentView === 'store' ? 'bg-[#C68B59] text-white' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              Menu & Coffee Catalog
            </button>

            <button
              onClick={() => {
                onNavigate('orders');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                currentView === 'orders' ? 'bg-[#C68B59] text-white' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              My Orders & Live Tracker
            </button>
          </div>

          <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onOpenTracker();
                setMobileMenuOpen(false);
              }}
              className="px-4 py-2 rounded-xl bg-stone-800 text-xs font-semibold text-stone-200 flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-[#C68B59]" />
              Track by Code
            </button>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-950/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#C68B59] text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
