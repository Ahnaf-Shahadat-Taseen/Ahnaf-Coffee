import React, { useState } from 'react';
import { Product, Order, UserProfile, OrderStatus } from '../types';
import { 
  Coffee, 
  Clock, 
  Flame, 
  CheckCircle2, 
  ShoppingBag, 
  Users, 
  Plus, 
  Search, 
  ToggleLeft, 
  ToggleRight, 
  Check, 
  Sparkles, 
  Receipt, 
  X,
  Minus
} from 'lucide-react';
import { updateOrderStatus, updateProduct, createOrder } from '../services/dbService';

interface StaffDashboardViewProps {
  products: Product[];
  orders: Order[];
  users: UserProfile[];
}

export const StaffDashboardView: React.FC<StaffDashboardViewProps> = ({
  products,
  orders,
  users
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'pos' | 'stock' | 'roster'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | OrderStatus>('all');

  // Manual Counter POS Modal / State
  const [posCart, setPosCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [customerName, setCustomerName] = useState('Walk-in Patron');
  const [tableNumber, setTableNumber] = useState('Table #1');
  const [isSubmittingPos, setIsSubmittingPos] = useState(false);
  const [posSuccessCode, setPosSuccessCode] = useState<string | null>(null);

  // Staff list for read-only roster
  const staffMembers = users.filter(u => u.role === 'staff' || u.role === 'admin');

  // Quick order status transition handler
  const handleAdvanceStatus = async (order: Order) => {
    let nextStatus: OrderStatus = 'pending';
    if (order.status === 'pending') nextStatus = 'brewing';
    else if (order.status === 'brewing') nextStatus = 'ready';
    else if (order.status === 'ready') nextStatus = 'completed';

    await updateOrderStatus(order.id, nextStatus);
  };

  // Quick Stock & Availability toggle for staff
  const handleToggleAvailability = async (product: Product) => {
    await updateProduct(product.id, { isAvailable: !product.isAvailable });
  };

  const handleAdjustStock = async (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    await updateProduct(product.id, { stock: newStock });
  };

  // POS methods
  const addToPosCart = (p: Product) => {
    setPosCart(prev => {
      const exists = prev.find(item => item.product.id === p.id);
      if (exists) {
        return prev.map(item =>
          item.product.id === p.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product: p, quantity: 1 }];
    });
  };

  const removeFromPosCart = (productId: string) => {
    setPosCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const updatePosQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromPosCart(productId);
      return;
    }
    setPosCart(prev =>
      prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i)
    );
  };

  const posTotal = posCart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);

  const handleCreateCounterOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (posCart.length === 0) return;
    setIsSubmittingPos(true);
    try {
      const newId = await createOrder({
        customerName: customerName.trim() || 'Walk-in Patron',
        customerPhone: '+880 1700-000000',
        deliveryAddress: `${tableNumber} (Counter Pickup)`,
        orderType: 'Pay at Counter / Dine-in',
        paymentMethod: 'Cash on Delivery / Pay at Counter',
        items: posCart.map(i => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          imageUrl: i.product.imageUrl
        })),
        totalAmount: posTotal,
        status: 'brewing', // Immediately starts brewing!
        notes: `Offline counter order placed by barista. Cash collected: ৳${posTotal}`
      });

      // Deduct stock
      for (const item of posCart) {
        handleAdjustStock(item.product, -item.quantity);
      }

      setPosSuccessCode(newId);
      setPosCart([]);
      setActiveTab('orders');
    } finally {
      setIsSubmittingPos(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesFilter = selectedStatusFilter === 'all' || o.status === selectedStatusFilter;
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner with Staff Role Badge */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold text-white">
                Barista & Counter Station
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Staff RBAC Mode
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Live brewing queue, quick status transitions, counter POS punch-in, and inventory toggle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('pos')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:brightness-110 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
          >
            <Receipt className="w-4 h-4" />
            <span>Punch Counter Order (POS)</span>
          </button>
        </div>
      </div>

      {posSuccessCode && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>
              Counter Order <strong>{posSuccessCode}</strong> created & sent to Brewing queue!
            </span>
          </div>
          <button onClick={() => setPosSuccessCode(null)} className="text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-stone-800">
        {[
          { key: 'orders', label: `☕ Brewing Queue (${orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length} Active)` },
          { key: 'pos', label: '🧾 Walk-In Counter POS' },
          { key: 'stock', label: `📦 Quick Stock & Availability (${products.length})` },
          { key: 'roster', label: `👥 Employee Directory (View-Only)` }
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === t.key
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 1. ORDERS / BREWING QUEUE */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by Order ID or customer..."
                className="w-full bg-[#1e1612] border border-stone-700/80 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-[#1a1410] p-1 rounded-2xl border border-stone-800 overflow-x-auto text-xs">
              {(['all', 'pending', 'brewing', 'ready', 'completed'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-all ${
                    selectedStatusFilter === st
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className={`glass-panel rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                  ord.status === 'brewing' ? 'border-amber-500/50 bg-[#251a13]' :
                  ord.status === 'ready' ? 'border-emerald-500/50 bg-[#16221a]' :
                  ord.status === 'pending' ? 'border-blue-500/40 bg-[#1a1b24]' : 'border-stone-800'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-white text-base block">{ord.id}</span>
                      <span className="text-[11px] text-stone-400">{ord.orderType}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      ord.status === 'completed' ? 'bg-emerald-950 text-emerald-300' :
                      ord.status === 'ready' ? 'bg-amber-950 text-amber-300 animate-pulse' :
                      ord.status === 'brewing' ? 'bg-blue-950 text-blue-300' : 'bg-stone-800 text-stone-300'
                    }`}>
                      {ord.status}
                    </span>
                  </div>

                  <div className="bg-[#140f0c] p-3 rounded-xl border border-stone-800/80 text-xs">
                    <p className="font-bold text-stone-200">{ord.customerName}</p>
                    <p className="text-stone-400 text-[11px]">{ord.customerPhone}</p>
                    {ord.deliveryAddress && (
                      <p className="text-stone-400 text-[11px] truncate mt-1">
                        📍 {ord.deliveryAddress}
                      </p>
                    )}
                  </div>

                  {/* Item List */}
                  <div className="space-y-1.5 text-xs max-h-32 overflow-y-auto pr-1">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-stone-300">
                        <span>
                          <strong className="text-amber-400">{item.quantity}x</strong> {item.name}
                        </span>
                        <span className="font-semibold text-stone-400">৳ {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {ord.notes && (
                    <p className="text-[11px] text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-900/60 italic">
                      Note: "{ord.notes}"
                    </p>
                  )}
                </div>

                {/* Bottom Status Controller */}
                <div className="pt-4 border-t border-stone-800/80 mt-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-400">Collect Cash:</span>
                    <span className="font-bold text-base text-amber-400">৳ {ord.totalAmount}</span>
                  </div>

                  {/* 1-Click Status Advance */}
                  {ord.status !== 'completed' && ord.status !== 'cancelled' && (
                    <button
                      type="button"
                      onClick={() => handleAdvanceStatus(ord)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all ${
                        ord.status === 'pending'
                          ? 'bg-blue-600 hover:bg-blue-500'
                          : ord.status === 'brewing'
                          ? 'bg-amber-600 hover:bg-amber-500'
                          : 'bg-emerald-600 hover:bg-emerald-500'
                      }`}
                    >
                      {ord.status === 'pending' && (
                        <>
                          <Flame className="w-4 h-4" />
                          <span>Start Brewing Espresso</span>
                        </>
                      )}
                      {ord.status === 'brewing' && (
                        <>
                          <Coffee className="w-4 h-4" />
                          <span>Mark Ready for Pickup / Out</span>
                        </>
                      )}
                      {ord.status === 'ready' && (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark Completed & Paid</span>
                        </>
                      )}
                    </button>
                  )}

                  {ord.status === 'completed' && (
                    <div className="py-2 text-center text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Fulfilled & Closed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. WALK-IN COUNTER POS */}
      {activeTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200">
          
          {/* Left: Product Selector */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <Coffee className="w-4 h-4 text-emerald-400" />
              <span>Select Items for Walk-in Patron</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[550px] overflow-y-auto pr-1">
              {products.filter(p => p.isAvailable).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => addToPosCart(p)}
                  className="text-left p-3 rounded-2xl bg-[#1b1410] border border-stone-800 hover:border-emerald-500/50 hover:bg-[#251a14] transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-2">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-200 truncate">{p.name}</h4>
                    <p className="text-[10px] text-stone-400">{p.category}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs font-extrabold text-[#C68B59]">৳ {p.price}</span>
                      <span className="text-[10px] text-stone-400">Stock: {p.stock}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Register Ticket */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-emerald-500/30 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <span className="text-sm font-serif font-bold text-white">Counter Register Ticket</span>
                <span className="text-[11px] text-emerald-400 font-bold">Cash on Counter</span>
              </div>

              {/* Patron Info */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-stone-400 block mb-1">Customer / Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#18110d] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-400 block mb-1">Table / Counter</label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-[#18110d] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Items in ticket */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {posCart.length === 0 ? (
                  <p className="text-center py-8 text-xs text-stone-500">
                    Click menu items to add to this counter ticket
                  </p>
                ) : (
                  posCart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-2 rounded-xl bg-[#17100d] border border-stone-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-semibold text-stone-200 truncate">{item.product.name}</p>
                        <p className="text-[11px] text-[#C68B59]">৳ {item.product.price} each</p>
                      </div>

                      <div className="flex items-center gap-1.5 bg-[#120d0a] px-1.5 py-0.5 rounded-lg border border-stone-700">
                        <button
                          type="button"
                          onClick={() => updatePosQty(item.product.id, item.quantity - 1)}
                          className="text-stone-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white px-1">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updatePosQty(item.product.id, item.quantity + 1)}
                          className="text-stone-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold text-white ml-2 text-xs">
                        ৳ {item.product.price * item.quantity}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800 space-y-3">
              <div className="flex justify-between items-center font-bold text-base text-white">
                <span>Total Cash Due</span>
                <span className="text-emerald-400 text-xl">৳ {posTotal}</span>
              </div>

              <button
                type="button"
                disabled={posCart.length === 0 || isSubmittingPos}
                onClick={handleCreateCounterOrder}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold text-xs shadow-lg hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{isSubmittingPos ? 'Processing Ticket...' : 'Confirm & Collect Cash at Counter'}</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 3. QUICK STOCK & AVAILABILITY TOGGLE */}
      {activeTab === 'stock' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Staff Role Policy: You can adjust daily stock counters and toggle items on/off. Creating new items or deleting products requires Super Admin credentials.
            </span>
          </div>

          <div className="glass-panel rounded-3xl overflow-hidden border border-stone-800 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-[#19110d] text-[11px] uppercase tracking-wider text-stone-400 border-b border-stone-800">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Unit Price</th>
                    <th className="py-3 px-4">Current Stock</th>
                    <th className="py-3 px-4">Quick Adjust Stock</th>
                    <th className="py-3 px-4 text-right">Available for Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-800/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2.5">
                        <img src={p.imageUrl} alt={p.name} className="w-9 h-9 rounded-lg object-cover" />
                        <span>{p.name}</span>
                      </td>
                      <td className="py-3 px-4 text-stone-400">{p.category}</td>
                      <td className="py-3 px-4 font-bold text-white">৳ {p.price}</td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${p.stock <= 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleAdjustStock(p, -1)}
                            className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300"
                            title="Decrease stock by 1"
                          >
                            -1
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdjustStock(p, +5)}
                            className="px-2 py-1 rounded bg-[#241a14] hover:bg-[#32231b] text-amber-300 font-bold border border-amber-900/60"
                            title="Increase stock by 5"
                          >
                            +5 Restock
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(p)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                            p.isAvailable
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {p.isAvailable ? '✅ Available' : '⏸️ Paused'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. ROSTER (VIEW-ONLY RBAC FOR STAFF) */}
      {activeTab === 'roster' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-400 flex items-center justify-between">
            <span>Staff Roster View-Only: You can see duty shifts and colleagues. Account edits require Super Admin.</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Read-Only View
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffMembers.map((st) => (
              <div
                key={st.uid}
                className="glass-panel p-5 rounded-3xl border border-stone-800 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={st.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={st.displayName}
                    className="w-12 h-12 rounded-2xl object-cover border border-[#C68B59]/40"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{st.displayName}</h4>
                    <p className="text-xs text-emerald-400 font-medium">{st.dutyTitle || 'Barista'}</p>
                  </div>
                </div>

                <div className="text-xs space-y-1 text-stone-400 pt-2 border-t border-stone-800">
                  <p>📧 {st.email}</p>
                  {st.phone && <p>📞 {st.phone}</p>}
                  {st.shift && <p className="text-stone-300 font-medium">⏰ {st.shift}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
