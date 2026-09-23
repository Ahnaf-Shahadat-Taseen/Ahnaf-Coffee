import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  User as UserIcon, 
  FileText, 
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { createOrder } from '../services/dbService';
import { OrderType } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const { userProfile } = useAuth();

  const [orderType, setOrderType] = useState<OrderType>('Pay at Counter / Dine-in');
  const [customerName, setCustomerName] = useState(userProfile?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const deliveryFee = orderType === 'Cash on Delivery' ? 50 : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Your coffee cart is empty.');
      return;
    }

    if (!customerName.trim()) {
      setErrorMsg('Please provide your name for the order.');
      return;
    }

    if (!customerPhone.trim()) {
      setErrorMsg('Please enter a phone number so we can notify you.');
      return;
    }

    if (orderType === 'Cash on Delivery' && !deliveryAddress.trim()) {
      setErrorMsg('Please enter delivery address for Cash on Delivery.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = items.map(i => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        imageUrl: i.product.imageUrl
      }));

      const newOrderId = await createOrder({
        customerName: customerName.trim(),
        customerEmail: userProfile?.email,
        customerPhone: customerPhone.trim(),
        deliveryAddress: orderType === 'Cash on Delivery' ? deliveryAddress.trim() : 'Pickup at Counter / Dine-in',
        orderType,
        paymentMethod: 'Cash on Delivery / Pay at Counter',
        items: orderItems,
        totalAmount: grandTotal,
        status: 'pending',
        userId: userProfile?.uid,
        notes: notes.trim() || undefined
      });

      clearCart();
      onClose();
      onOrderSuccess(newOrderId);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#18120e] border-l border-[#C68B59]/30 text-stone-100 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-[#1f1712]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#C68B59]/20 border border-[#C68B59]/40 flex items-center justify-center text-[#C68B59]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-serif font-bold text-stone-100">
                  Your Coffee Cart
                </h2>
                <p className="text-[11px] text-stone-400">
                  {items.length} unique {items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-stone-500">
                <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8 text-stone-600" />
                </div>
                <p className="text-base font-serif text-stone-300">Your cart is empty</p>
                <p className="text-xs text-stone-500 max-w-xs mt-1">
                  Explore our handcrafted hot coffees, cold brews, and fresh bakery treats.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400 pb-1 border-b border-stone-800/60">
                  <span>Selected Brews & Pastries</span>
                  <button
                    onClick={clearCart}
                    className="text-rose-400 hover:text-rose-300 text-[11px] flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Clear all
                  </button>
                </div>

                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-2.5 rounded-xl bg-[#221a15] border border-stone-800 hover:border-stone-700 transition-all"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover border border-stone-700/60 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-stone-200 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-[#C68B59] font-bold mt-0.5">
                        ৳ {item.product.price}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity adjuster */}
                        <div className="flex items-center bg-[#150f0c] rounded-lg border border-stone-700/80 px-1 py-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-stone-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-stone-100 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-stone-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-extrabold text-stone-100">
                          ৳ {item.product.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Checkout Form */}
            {items.length > 0 && (
              <form onSubmit={handleCheckout} className="pt-4 border-t border-stone-800 space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#C68B59] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Order & Pickup Details
                </h3>

                {/* Fulfillment Selector */}
                <div className="grid grid-cols-2 gap-2 bg-[#140f0c] p-1 rounded-xl border border-stone-800">
                  <button
                    type="button"
                    onClick={() => setOrderType('Pay at Counter / Dine-in')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold text-center transition-all ${
                      orderType === 'Pay at Counter / Dine-in'
                        ? 'bg-[#C68B59] text-white shadow-sm'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    ☕ Counter / Dine-in
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('Cash on Delivery')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold text-center transition-all ${
                      orderType === 'Cash on Delivery'
                        ? 'bg-[#C68B59] text-white shadow-sm'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    🛵 Cash on Delivery
                  </button>
                </div>

                {/* Strictly Cash on Delivery Notice */}
                <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-2.5 flex items-start gap-2 text-[11px] text-amber-200">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Payment Method: <strong>Cash on Delivery / Pay at Counter</strong> strictly. No online card required. Pay upon receiving!
                  </span>
                </div>

                {/* Customer Name */}
                <div>
                  <label className="text-[11px] font-medium text-stone-400 flex items-center gap-1 mb-1">
                    <UserIcon className="w-3 h-3 text-[#C68B59]" />
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Sofia Rahman"
                    className="w-full bg-[#1b1410] border border-stone-700/80 rounded-lg px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#C68B59]"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="text-[11px] font-medium text-stone-400 flex items-center gap-1 mb-1">
                    <Phone className="w-3 h-3 text-[#C68B59]" />
                    Contact Phone (for Barista / Delivery SMS) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+880 17..."
                    className="w-full bg-[#1b1410] border border-stone-700/80 rounded-lg px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#C68B59]"
                  />
                </div>

                {/* Delivery Address (if Cash on Delivery) */}
                {orderType === 'Cash on Delivery' && (
                  <div>
                    <label className="text-[11px] font-medium text-stone-400 flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3 text-[#C68B59]" />
                      Delivery Address (Banani/Gulshan/Dhaka) *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. House 14, Road 7, Banani"
                      className="w-full bg-[#1b1410] border border-stone-700/80 rounded-lg px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#C68B59]"
                    />
                  </div>
                )}

                {/* Notes for Barista */}
                <div>
                  <label className="text-[11px] font-medium text-stone-400 flex items-center gap-1 mb-1">
                    <FileText className="w-3 h-3 text-[#C68B59]" />
                    Special Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Extra hot, low sugar, warm croissant"
                    className="w-full bg-[#1b1410] border border-stone-700/80 rounded-lg px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#C68B59]"
                  />
                </div>

                {errorMsg && (
                  <div className="text-rose-400 text-xs bg-rose-950/40 p-2.5 rounded-lg border border-rose-800">
                    {errorMsg}
                  </div>
                )}

                {/* Summary Breakdown */}
                <div className="bg-[#150f0c] p-3 rounded-xl border border-stone-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-400">
                    <span>Subtotal</span>
                    <span>৳ {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Fulfillment</span>
                    <span>{deliveryFee === 0 ? 'Free (Counter)' : `৳ ${deliveryFee}`}</span>
                  </div>
                  <div className="pt-2 border-t border-stone-800 flex justify-between font-bold text-sm text-white">
                    <span>Total Due (BDT)</span>
                    <span className="text-[#C68B59] text-base">৳ {grandTotal}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C68B59] to-[#9E5D2A] hover:brightness-110 active:scale-[0.99] text-white text-sm font-bold shadow-lg shadow-[#C68B59]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Placing Order with Barista...</span>
                  ) : (
                    <>
                      <span>Confirm Order (Pay on Delivery / Counter)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
