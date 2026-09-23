import React, { useState } from 'react';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  Clock, 
  Coffee, 
  Flame, 
  CheckCircle2, 
  MapPin, 
  Star, 
  Search, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface CustomerOrdersViewProps {
  orders: Order[];
  onOpenTracker: (orderId?: string) => void;
  onOpenReviewModal: (order: Order) => void;
  onNavigateToStore: () => void;
}

export const CustomerOrdersView: React.FC<CustomerOrdersViewProps> = ({
  orders,
  onOpenTracker,
  onOpenReviewModal,
  onNavigateToStore
}) => {
  const { userProfile } = useAuth();
  const [filterQuery, setFilterQuery] = useState('');

  // Filter orders matching current user, or show all if guest/demo
  const userOrders = orders.filter((o) => {
    if (userProfile?.uid && o.userId === userProfile.uid) return true;
    if (userProfile?.email && o.customerEmail?.toLowerCase() === userProfile.email.toLowerCase()) return true;
    if (userProfile?.phone && o.customerPhone === userProfile.phone) return true;
    return true; // allow customer to view the active session orders
  }).filter((o) =>
    o.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
    o.customerName.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Order Received
          </span>
        );
      case 'brewing':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 animate-pulse">
            <Flame className="w-3.5 h-3.5" />
            Barista Pulling Espresso
          </span>
        );
      case 'ready':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <Coffee className="w-3.5 h-3.5" />
            Ready for Pickup / Out
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed & Enjoyed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-800">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-[#C68B59]/30">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C68B59] mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Order History & Live Fulfillment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            My Coffee Orders & Receipts
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Real-time tracking for Cash on Delivery and Counter pickups in Banani.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToStore}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C68B59] to-[#9E5D2A] text-white text-xs font-bold shadow-md hover:brightness-110 transition-all self-start flex items-center gap-2"
        >
          <Coffee className="w-4 h-4" />
          <span>Order More Coffee</span>
        </button>
      </div>

      {/* Search by tracking id */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filter by Order ID (e.g. AHN-1082)..."
          className="w-full bg-[#1e1612] border border-stone-700/80 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#C68B59]"
        />
      </div>

      {/* Orders List */}
      {userOrders.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl text-stone-400 space-y-3">
          <ShoppingBag className="w-12 h-12 text-stone-600 mx-auto" />
          <h3 className="text-base font-serif font-bold text-white">No orders found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            You haven't placed an order yet, or no orders match your search.
          </p>
          <button
            onClick={onNavigateToStore}
            className="mt-2 px-5 py-2.5 rounded-xl bg-[#C68B59] text-white text-xs font-bold"
          >
            Explore Menu & Place Order
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((ord) => (
            <div
              key={ord.id}
              className="glass-panel p-6 rounded-3xl border border-stone-800 hover:border-[#C68B59]/40 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-bold text-[#C68B59]">{ord.id}</span>
                    <span className="text-xs text-stone-400">
                      • {new Date(ord.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <span className="text-xs text-stone-400">{ord.orderType}</span>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(ord.status)}
                  <span className="text-lg font-extrabold text-white">৳ {ord.totalAmount}</span>
                </div>
              </div>

              {/* Items summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ord.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#1b1410] border border-stone-800/80 flex items-center gap-2.5"
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover border border-stone-700/60"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-stone-200 truncate">{item.name}</p>
                      <p className="text-[11px] text-[#C68B59]">
                        {item.quantity}x @ ৳{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-stone-400 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 text-[11px] font-semibold border border-amber-800/60">
                    {ord.paymentMethod}
                  </span>
                  {ord.deliveryAddress && (
                    <span className="text-stone-400 text-[11px] hidden sm:inline">
                      • {ord.deliveryAddress}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenReviewModal(ord)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#221812] hover:bg-[#2d2018] border border-stone-700 text-stone-300 hover:text-amber-300 flex items-center gap-1.5 font-semibold transition-all"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span>Review Drinks</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenTracker(ord.id)}
                    className="px-4 py-1.5 rounded-xl bg-[#C68B59] hover:bg-[#b07849] text-white flex items-center gap-1.5 font-bold transition-all shadow"
                  >
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Open Live Tracker</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
