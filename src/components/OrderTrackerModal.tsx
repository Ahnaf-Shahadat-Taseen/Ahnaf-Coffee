import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { 
  X, 
  Search, 
  Coffee, 
  Clock, 
  CheckCircle2, 
  Package, 
  Flame, 
  MapPin, 
  Phone, 
  Star,
  Receipt,
  RotateCcw
} from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  initialOrderId?: string;
  onOpenReview: (order: Order) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
  initialOrderId = '',
  onOpenReview
}) => {
  const [searchId, setSearchId] = useState(initialOrderId);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    initialOrderId || (orders.length > 0 ? orders[0].id : '')
  );

  if (!isOpen) return null;

  const currentOrder = orders.find(
    (o) => o.id.toLowerCase() === (selectedOrderId || searchId).trim().toLowerCase()
  );

  const steps: { key: OrderStatus; label: string; description: string; icon: any }[] = [
    {
      key: 'pending',
      label: 'Order Placed',
      description: 'Waiting for barista confirmation',
      icon: Clock
    },
    {
      key: 'brewing',
      label: 'Brewing & Crafting',
      description: 'Extracting beans & steaming foam',
      icon: Flame
    },
    {
      key: 'ready',
      label: 'Ready for Pickup / Out',
      description: 'At pickup counter or with rider',
      icon: Coffee
    },
    {
      key: 'completed',
      label: 'Fulfilled & Enjoyed',
      description: 'Payment collected at counter/door',
      icon: CheckCircle2
    }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'brewing': return 1;
      case 'ready': return 2;
      case 'completed': return 3;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const activeStepIdx = currentOrder ? getStepIndex(currentOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#1a1410] border border-[#C68B59]/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C68B59]/20 border border-[#C68B59]/40 flex items-center justify-center text-[#C68B59]">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white">
                Live Order Tracker
              </h2>
              <p className="text-xs text-stone-400">
                Real-time roasting & fulfillment progression
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar for Order ID */}
        <div className="mt-5 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter tracking code (e.g. AHN-1082)..."
              className="w-full bg-[#241a14] border border-stone-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#C68B59]"
            />
          </div>
          <button
            type="button"
            onClick={() => setSelectedOrderId(searchId)}
            className="px-4 py-2.5 rounded-xl bg-[#C68B59] hover:bg-[#b07849] text-white text-xs font-bold transition-all shadow-md"
          >
            Track
          </button>
        </div>

        {/* Quick order picker list */}
        {orders.length > 1 && (
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[11px] text-stone-400 shrink-0">Recent Orders:</span>
            {orders.slice(0, 5).map((ord) => (
              <button
                key={ord.id}
                onClick={() => {
                  setSearchId(ord.id);
                  setSelectedOrderId(ord.id);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 transition-colors ${
                  currentOrder?.id === ord.id
                    ? 'bg-[#C68B59] text-white'
                    : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                }`}
              >
                {ord.id} (৳{ord.totalAmount})
              </button>
            ))}
          </div>
        )}

        {/* Tracker Body */}
        {currentOrder ? (
          <div className="mt-6 space-y-6">
            
            {/* Status overview banner */}
            <div className="p-4 rounded-2xl bg-[#221812] border border-[#C68B59]/30 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
                  Tracking ID
                </span>
                <span className="text-xl font-mono font-extrabold text-[#C68B59]">
                  {currentOrder.id}
                </span>
                <p className="text-xs text-stone-400 mt-0.5">
                  Placed {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
                  Payment Mode
                </span>
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentOrder.paymentMethod}
                </span>
                <p className="text-sm font-extrabold text-white mt-1">
                  ৳ {currentOrder.totalAmount}
                </p>
              </div>
            </div>

            {/* Stepper Pipeline */}
            {currentOrder.status === 'cancelled' ? (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800 text-center text-rose-300">
                <p className="font-bold text-sm">This order was cancelled.</p>
                <p className="text-xs text-rose-400 mt-1">Please place a new order or speak with our barista counter.</p>
              </div>
            ) : (
              <div className="relative py-2">
                <div className="hidden sm:block absolute top-1/2 left-6 right-6 h-1 bg-stone-800 -translate-y-1/2 -z-0" />
                <div 
                  className="hidden sm:block absolute top-1/2 left-6 h-1 bg-[#C68B59] -translate-y-1/2 -z-0 transition-all duration-500" 
                  style={{ width: `${(activeStepIdx / (steps.length - 1)) * 90}%` }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
                  {steps.map((step, idx) => {
                    const Icon = step.icon;
                    const isDone = activeStepIdx >= idx;
                    const isCurrent = activeStepIdx === idx;

                    return (
                      <div key={step.key} className="flex sm:flex-col items-center gap-3 sm:text-center">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md shrink-0 ${
                            isCurrent
                              ? 'bg-[#C68B59] text-white ring-4 ring-[#C68B59]/30 scale-110'
                              : isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-900 border border-stone-700 text-stone-500'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isDone ? 'text-stone-100' : 'text-stone-500'}`}>
                            {step.label}
                          </p>
                          <p className="text-[10px] text-stone-400 leading-tight mt-0.5">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Details & Items */}
            <div className="bg-[#150f0c] p-4 rounded-2xl border border-stone-800 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                <span className="text-stone-400 font-semibold uppercase tracking-wider text-[11px]">
                  Ordered Items ({currentOrder.items.length})
                </span>
                <span className="text-stone-400">
                  {currentOrder.orderType}
                </span>
              </div>

              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {currentOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-stone-800 text-stone-300 font-bold text-[10px] flex items-center justify-center">
                        {item.quantity}x
                      </span>
                      <span className="font-medium text-stone-200">{item.name}</span>
                    </div>
                    <span className="font-bold text-[#C68B59]">
                      ৳ {item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {currentOrder.deliveryAddress && (
                <div className="pt-2 border-t border-stone-800 flex items-center gap-2 text-stone-400">
                  <MapPin className="w-3.5 h-3.5 text-[#C68B59] shrink-0" />
                  <span className="truncate">Destination: {currentOrder.deliveryAddress}</span>
                </div>
              )}

              {currentOrder.notes && (
                <div className="text-stone-400 italic">
                  Note: "{currentOrder.notes}"
                </div>
              )}
            </div>

            {/* Review Button */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => onOpenReview(currentOrder)}
                className="px-4 py-2.5 rounded-xl bg-[#2b1f18] hover:bg-[#3d2b21] border border-[#C68B59]/40 text-xs font-bold text-stone-100 flex items-center gap-2 transition-all shadow-md"
              >
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Rate & Review this Brew</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="mt-8 text-center py-10 text-stone-400">
            <Package className="w-12 h-12 text-stone-600 mx-auto mb-2" />
            <p className="text-sm font-semibold">No order found with ID "{searchId}"</p>
            <p className="text-xs text-stone-500 mt-1">Please check your tracking receipt code.</p>
          </div>
        )}

      </div>
    </div>
  );
};
