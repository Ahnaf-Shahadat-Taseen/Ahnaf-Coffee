import React, { useState } from 'react';
import { Product, Order, UserProfile, OrderStatus, ProductCategory } from '../types';
import { 
  ShieldCheck, 
  Coffee, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  TrendingUp, 
  Sparkles, 
  Package, 
  Clock, 
  CheckCircle2, 
  Database, 
  X, 
  Phone, 
  Mail, 
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { ImagePresetPicker } from '../components/ImagePresetPicker';
import { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  createOrder,
  updateOrderStatus, 
  deleteOrder, 
  createUser, 
  updateUser, 
  deleteUser, 
  seedEntireDatabase 
} from '../services/dbService';

interface AdminDashboardViewProps {
  products: Product[];
  orders: Order[];
  users: UserProfile[];
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  products,
  orders,
  users
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'products' | 'staff' | 'orders' | 'customers'>('metrics');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  
  // Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<UserProfile | null>(null);

  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const [isSeeding, setIsSeeding] = useState(false);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  // Form states for Product Modal
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState(250);
  const [prodCategory, setProdCategory] = useState<ProductCategory>('Hot Coffee');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodStock, setProdStock] = useState(30);
  const [prodAvailable, setProdAvailable] = useState(true);
  const [prodFeatured, setProdFeatured] = useState(false);

  // Form states for Staff Modal
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffRole, setStaffRole] = useState<'staff' | 'admin'>('staff');
  const [staffDuty, setStaffDuty] = useState('Head Barista');
  const [staffShift, setStaffShift] = useState('Morning Shift (7:30 AM - 3:30 PM)');
  const [staffAvatar, setStaffAvatar] = useState('');

  // Real-time Calculated Metrics
  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const staffList = users.filter(u => u.role === 'staff' || u.role === 'admin');
  const customerList = users.filter(u => u.role === 'customer');
  const totalEmployees = staffList.length;
  const totalCustomers = customerList.length;

  // Handlers for Product CRUD
  const openNewProductModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdPrice(220);
    setProdCategory('Hot Coffee');
    setProdDescription('');
    setProdImageUrl('https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80');
    setProdStock(35);
    setProdAvailable(true);
    setProdFeatured(false);
    setProductModalOpen(true);
  };

  const openEditProductModal = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdPrice(p.price);
    setProdCategory(p.category);
    setProdDescription(p.description);
    setProdImageUrl(p.imageUrl);
    setProdStock(p.stock);
    setProdAvailable(p.isAvailable);
    setProdFeatured(!!p.featured);
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        name: prodName.trim(),
        price: Number(prodPrice),
        category: prodCategory,
        description: prodDescription.trim(),
        imageUrl: prodImageUrl,
        stock: Number(prodStock),
        isAvailable: prodAvailable,
        featured: prodFeatured
      });
    } else {
      await createProduct({
        name: prodName.trim(),
        price: Number(prodPrice),
        category: prodCategory,
        description: prodDescription.trim(),
        imageUrl: prodImageUrl,
        stock: Number(prodStock),
        isAvailable: prodAvailable,
        featured: prodFeatured
      });
    }
    setProductModalOpen(false);
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      await deleteProduct(id);
    }
  };

  // Handlers for Staff CRUD
  const openNewStaffModal = () => {
    setEditingStaff(null);
    setStaffName('');
    setStaffEmail('');
    setStaffPhone('+880 18');
    setStaffRole('staff');
    setStaffDuty('Barista & Roaster');
    setStaffShift('Morning Shift (7:30 AM - 3:30 PM)');
    setStaffAvatar('https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80');
    setStaffModalOpen(true);
  };

  const openEditStaffModal = (s: UserProfile) => {
    setEditingStaff(s);
    setStaffName(s.displayName);
    setStaffEmail(s.email);
    setStaffPhone(s.phone || '');
    setStaffRole(s.role === 'admin' ? 'admin' : 'staff');
    setStaffDuty(s.dutyTitle || 'Barista');
    setStaffShift(s.shift || 'Full Day');
    setStaffAvatar(s.avatarUrl || '');
    setStaffModalOpen(true);
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffEmail.trim()) return;

    if (editingStaff) {
      await updateUser(editingStaff.uid, {
        displayName: staffName.trim(),
        email: staffEmail.trim(),
        phone: staffPhone.trim(),
        role: staffRole,
        dutyTitle: staffDuty.trim(),
        shift: staffShift.trim(),
        avatarUrl: staffAvatar
      });
    } else {
      await createUser({
        uid: 'staff-' + Date.now(),
        displayName: staffName.trim(),
        email: staffEmail.trim(),
        phone: staffPhone.trim(),
        role: staffRole,
        dutyTitle: staffDuty.trim(),
        shift: staffShift.trim(),
        avatarUrl: staffAvatar,
        createdAt: new Date().toISOString()
      });
    }
    setStaffModalOpen(false);
  };

  const handleDeleteStaff = async (uid: string, name: string) => {
    if (window.confirm(`Remove staff member "${name}" from roster?`)) {
      await deleteUser(uid);
    }
  };

  // Handlers for Order CRUD
  const handleUpdateOrderStatus = async (id: string, status: OrderStatus) => {
    await updateOrderStatus(id, status);
  };

  const handleDeleteOrder = async (id: string) => {
    if (window.confirm(`Delete order ${id}? This cannot be undone.`)) {
      await deleteOrder(id);
      setOrderModalOpen(false);
    }
  };

  // Seed DB Handler
  const handleSeedDB = async () => {
    setIsSeeding(true);
    setSeedNotice(null);
    try {
      const res = await seedEntireDatabase();
      setSeedNotice(`Database successfully synchronized! Added/Verified ${res.count} records.`);
    } catch (err: any) {
      setSeedNotice(`Seed error: ${err.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  // Filtered lists
  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesQuery =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery);
    return matchesStatus && matchesQuery;
  });

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Super Admin Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-amber-500/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold text-white">
                Super Admin Operations
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Full RBAC Authority
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Live BDT revenue analytics, complete product & staff CRUD, and cash order oversight
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSeedDB}
            disabled={isSeeding}
            className="px-4 py-2.5 rounded-xl bg-[#241a14] hover:bg-[#32231b] border border-[#C68B59]/40 text-[#C68B59] hover:text-white text-xs font-bold flex items-center gap-2 transition-all shadow disabled:opacity-50"
          >
            <Database className="w-4 h-4 text-[#C68B59]" />
            <span>{isSeeding ? 'Syncing Firestore...' : 'Seed / Reset DB'}</span>
          </button>
        </div>
      </div>

      {seedNotice && (
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {seedNotice}
          </span>
          <button onClick={() => setSeedNotice(null)} className="text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-stone-800">
        {[
          { key: 'metrics', label: '📊 Metrics Dashboard', icon: TrendingUp },
          { key: 'products', label: `☕ Products (${products.length})`, icon: Coffee },
          { key: 'orders', label: `📦 Orders (${orders.length})`, icon: ShoppingBag },
          { key: 'staff', label: `👥 Staff Roster (${totalEmployees})`, icon: Users },
          { key: 'customers', label: `👤 Customers (${totalCustomers})`, icon: UserCheck }
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setActiveTab(t.key as any);
              setSearchQuery('');
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === t.key
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
            }`}
          >
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* 1. METRICS DASHBOARD TAB */}
      {activeTab === 'metrics' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Real-time counters required in prompt */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* 1. Total Revenue in BDT */}
            <div className="glass-panel p-5 rounded-3xl border border-amber-500/30 flex flex-col justify-between">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span className="font-semibold uppercase tracking-wider">Total Revenue</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  ৳
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-extrabold text-white">
                  ৳ {totalRevenue.toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-400 block mt-0.5">
                  Cash on Delivery / Counter
                </span>
              </div>
            </div>

            {/* 2. Total Stock */}
            <div className="glass-panel p-5 rounded-3xl border border-stone-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span className="font-semibold uppercase tracking-wider">Total Stock</span>
                <div className="w-8 h-8 rounded-xl bg-stone-800 text-[#C68B59] flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-extrabold text-white">
                  {totalStock} <span className="text-xs text-stone-400 font-normal">units</span>
                </span>
                <span className="text-[11px] text-stone-400 block mt-0.5">
                  Across {products.length} menu items
                </span>
              </div>
            </div>

            {/* 3. Total Orders */}
            <div className="glass-panel p-5 rounded-3xl border border-stone-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span className="font-semibold uppercase tracking-wider">Total Orders</span>
                <div className="w-8 h-8 rounded-xl bg-stone-800 text-blue-400 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-extrabold text-white">
                  {totalOrders}
                </span>
                <span className="text-[11px] text-stone-400 block mt-0.5">
                  Live Firestore queue
                </span>
              </div>
            </div>

            {/* 4. Total Customers */}
            <div className="glass-panel p-5 rounded-3xl border border-stone-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span className="font-semibold uppercase tracking-wider">Total Customers</span>
                <div className="w-8 h-8 rounded-xl bg-stone-800 text-purple-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-extrabold text-white">
                  {totalCustomers}
                </span>
                <span className="text-[11px] text-stone-400 block mt-0.5">
                  Registered drinkers
                </span>
              </div>
            </div>

            {/* 5. Total Employees */}
            <div className="glass-panel p-5 rounded-3xl border border-stone-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span className="font-semibold uppercase tracking-wider">Staff Roster</span>
                <div className="w-8 h-8 rounded-xl bg-stone-800 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-extrabold text-white">
                  {totalEmployees}
                </span>
                <span className="text-[11px] text-emerald-400 block mt-0.5">
                  Baristas & Cashiers active
                </span>
              </div>
            </div>

          </div>

          {/* Quick Shortcuts & Live Status breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Orders Overview */}
            <div className="glass-panel p-6 rounded-3xl border border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C68B59]" />
                  Recent Order Stream
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#C68B59] hover:underline"
                >
                  View all ({orders.length})
                </button>
              </div>

              <div className="space-y-2.5">
                {orders.slice(0, 4).map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3 rounded-2xl bg-[#1b1410] border border-stone-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{ord.id}</span>
                        <span className="text-stone-400">• {ord.customerName}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {ord.items.length} items • {ord.orderType}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-[#C68B59]">৳ {ord.totalAmount}</span>
                      <span className={`block text-[10px] uppercase font-bold mt-0.5 ${
                        ord.status === 'completed' ? 'text-emerald-400' :
                        ord.status === 'ready' ? 'text-amber-400' :
                        ord.status === 'brewing' ? 'text-blue-400' :
                        ord.status === 'cancelled' ? 'text-rose-400' : 'text-stone-400'
                      }`}>
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Alerts */}
            <div className="glass-panel p-6 rounded-3xl border border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-400" />
                  Inventory & Stock Health
                </h3>
                <button
                  onClick={() => setActiveTab('products')}
                  className="text-xs text-[#C68B59] hover:underline"
                >
                  Manage Products
                </button>
              </div>

              <div className="space-y-2.5">
                {products.filter(p => p.stock <= 25).slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-[#1b1410] border border-stone-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={p.imageUrl} alt={p.name} className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-white">{p.name}</p>
                        <p className="text-[11px] text-stone-400">{p.category}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stock <= 5 ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                      }`}>
                        {p.stock} units left
                      </span>
                      <span className="block text-[11px] text-stone-400 mt-1">৳ {p.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. PRODUCT MANAGEMENT (FULL CRUD) */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name or category..."
                className="w-full bg-[#1e1612] border border-stone-700/80 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#C68B59]"
              />
            </div>

            <button
              type="button"
              onClick={openNewProductModal}
              className="px-4 py-2.5 rounded-2xl bg-[#C68B59] hover:bg-[#b07849] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Coffee / Pastry</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-stone-800 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-[#19110d] text-[11px] uppercase tracking-wider text-stone-400 border-b border-stone-800">
                  <tr>
                    <th className="py-3 px-4">Item Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (BDT)</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-stone-700 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-white text-sm">{p.name}</p>
                            <p className="text-[11px] text-stone-400 line-clamp-1 max-w-xs">
                              {p.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-800 text-stone-300">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        ৳ {p.price}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        <span className={p.stock <= 5 ? 'text-rose-400' : 'text-stone-200'}>
                          {p.stock} pcs
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {p.isAvailable && p.stock > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            Available
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                            Unavailable
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditProductModal(p)}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. ORDER MANAGEMENT (FULL CRUD) */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order ID, customer name, or phone..."
                className="w-full bg-[#1e1612] border border-stone-700/80 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#C68B59]"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-[#1a1410] p-1 rounded-2xl border border-stone-800 overflow-x-auto text-xs">
              {(['all', 'pending', 'brewing', 'ready', 'completed', 'cancelled'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-all ${
                    statusFilter === st
                      ? 'bg-[#C68B59] text-white shadow'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-stone-800 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-[#19110d] text-[11px] uppercase tracking-wider text-stone-400 border-b border-stone-800">
                  <tr>
                    <th className="py-3 px-4">Order Code</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Type & Payment</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Status & Action</th>
                    <th className="py-3 px-4 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setViewingOrder(ord);
                            setOrderModalOpen(true);
                          }}
                          className="font-mono font-bold text-[#C68B59] hover:underline"
                        >
                          {ord.id}
                        </button>
                        <p className="text-[10px] text-stone-500">
                          {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-white">{ord.customerName}</p>
                        <p className="text-[11px] text-stone-400">{ord.customerPhone}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-stone-200">{ord.orderType}</p>
                        <span className="text-[10px] text-amber-400 font-medium">
                          {ord.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-white text-sm">
                        ৳ {ord.totalAmount}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className={`bg-[#1e1612] border rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none ${
                            ord.status === 'completed' ? 'border-emerald-600 text-emerald-300' :
                            ord.status === 'ready' ? 'border-amber-500 text-amber-300' :
                            ord.status === 'brewing' ? 'border-blue-500 text-blue-300' :
                            ord.status === 'cancelled' ? 'border-rose-600 text-rose-300' : 'border-stone-700 text-stone-300'
                          }`}
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="brewing">☕ Brewing</option>
                          <option value="ready">✨ Ready</option>
                          <option value="completed">✅ Completed</option>
                          <option value="cancelled">❌ Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(ord.id)}
                          className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300"
                          title="Cancel/Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* 4. STAFF MANAGEMENT (FULL CRUD) */}
      {activeTab === 'staff' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-white">Employee & Barista Directory</h2>
              <p className="text-xs text-stone-400">Add, edit shift assignments, or remove staff accounts</p>
            </div>

            <button
              type="button"
              onClick={openNewStaffModal}
              className="px-4 py-2.5 rounded-2xl bg-[#C68B59] hover:bg-[#b07849] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Add Staff Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffList.map((st) => (
              <div
                key={st.uid}
                className="glass-panel p-5 rounded-3xl border border-stone-800 hover:border-amber-500/30 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={st.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                      alt={st.displayName}
                      className="w-12 h-12 rounded-2xl object-cover border border-[#C68B59]/40"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{st.displayName}</h4>
                      <p className="text-xs text-[#C68B59] font-medium">{st.dutyTitle || 'Barista'}</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-stone-400 pt-1">
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-stone-500" />
                      <span className="truncate">{st.email}</span>
                    </p>
                    {st.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-stone-500" />
                        <span>{st.phone}</span>
                      </p>
                    )}
                    {st.shift && (
                      <p className="flex items-center gap-2 text-stone-300">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{st.shift}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-800/80 mt-4 flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    st.role === 'admin' ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
                  }`}>
                    {st.role === 'admin' ? 'Super Admin' : 'Staff Barista'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditStaffModal(st)}
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                      title="Edit Staff"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {st.role !== 'admin' && (
                      <button
                        type="button"
                        onClick={() => handleDeleteStaff(st.uid, st.displayName)}
                        className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300"
                        title="Remove Staff"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CUSTOMER MANAGEMENT */}
      {activeTab === 'customers' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-white">Registered Customer Accounts</h2>
              <p className="text-xs text-stone-400">View customer roster, order activity, or remove accounts</p>
            </div>

            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers..."
                className="w-full bg-[#1e1612] border border-stone-700 rounded-xl pl-10 pr-3.5 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#C68B59]"
              />
            </div>
          </div>

          <div className="glass-panel rounded-3xl overflow-hidden border border-stone-800 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-[#19110d] text-[11px] uppercase tracking-wider text-stone-400 border-b border-stone-800">
                  <tr>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4 text-right">Delete Account</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  {customerList
                    .filter(c => c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((c) => (
                      <tr key={c.uid} className="hover:bg-stone-800/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">
                          <div className="flex items-center gap-2">
                            <img
                              src={c.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                              alt={c.displayName}
                              className="w-7 h-7 rounded-full object-cover border border-stone-700"
                            />
                            <span>{c.displayName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-stone-300">{c.email}</td>
                        <td className="py-3 px-4 text-stone-400">{c.phone || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-800 text-stone-300">
                            Customer
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete customer ${c.displayName}?`)) {
                                deleteUser(c.uid);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300"
                            title="Remove Customer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* PRODUCT CREATE / EDIT MODAL (WITH IMAGE PRESET PICKER) */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-[#19130f] border border-[#C68B59]/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-stone-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Coffee className="w-5 h-5 text-[#C68B59]" />
                {editingProduct ? 'Edit Coffee/Pastry Item' : 'Add New Menu Item'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="p-1.5 rounded-lg text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-stone-400 block mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. Spanish Latte"
                    className="w-full bg-[#241a14] border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#C68B59]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-400 block mb-1">
                    Price in BDT (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-[#241a14] border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-[#C68B59]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-stone-400 block mb-1">
                    Category *
                  </label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as ProductCategory)}
                    className="w-full bg-[#241a14] border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-[#C68B59]"
                  >
                    <option value="Hot Coffee">Hot Coffee</option>
                    <option value="Cold Brews">Cold Brews</option>
                    <option value="Pastries & Bakery">Pastries & Bakery</option>
                    <option value="Specialty Blends">Specialty Blends</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-400 block mb-1">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full bg-[#241a14] border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-[#C68B59]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-400 block mb-1">
                  Description & Tasting Notes
                </label>
                <textarea
                  rows={2}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Notes on roasting, beans, extraction, milk texture..."
                  className="w-full bg-[#241a14] border border-stone-700 rounded-xl p-3 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#C68B59] resize-none"
                />
              </div>

              {/* Zero-Cost Image Architecture Preset Picker */}
              <div className="bg-[#1e1511] p-3.5 rounded-2xl border border-stone-800">
                <ImagePresetPicker
                  value={prodImageUrl}
                  onChange={setProdImageUrl}
                  label="Product Photo (Unsplash Zero-Cost Storage)"
                  defaultCategory={prodCategory === 'Pastries & Bakery' ? 'bakery' : 'coffee'}
                />
              </div>

              <div className="flex items-center gap-6 pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={prodAvailable}
                    onChange={(e) => setProdAvailable(e.target.checked)}
                    className="accent-[#C68B59]"
                  />
                  <span>Is Available to Order</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={prodFeatured}
                    onChange={(e) => setProdFeatured(e.target.checked)}
                    className="accent-[#C68B59]"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C68B59] to-[#9E5D2A] text-white text-xs font-bold shadow-md hover:brightness-110"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STAFF CREATE / EDIT MODAL */}
      {staffModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#19130f] border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-stone-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                {editingStaff ? 'Edit Staff Profile' : 'Add New Staff Member'}
              </h3>
              <button onClick={() => setStaffModalOpen(false)} className="p-1.5 rounded-lg text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-stone-400 block mb-1">
                    Staff Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    placeholder="e.g. Maya Chowdhury"
                    className="w-full bg-[#241a14] border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-[#C68B59]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-400 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    placeholder="maya@ahnafcoffee.com"
                    className="w-full bg-[#241a14] border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-[#C68B59]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-stone-400 block mb-1">
                    Assigned Duty / Title
                  </label>
                  <input
                    type="text"
                    value={staffDuty}
                    onChange={(e) => setStaffDuty(e.target.value)}
                    placeholder="Head Barista / POS Cashier"
                    className="w-full bg-[#241a14] border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-[#C68B59]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-400 block mb-1">
                    Shift Time
                  </label>
                  <input
                    type="text"
                    value={staffShift}
                    onChange={(e) => setStaffShift(e.target.value)}
                    placeholder="Morning (7:30 AM - 3:30 PM)"
                    className="w-full bg-[#241a14] border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-[#C68B59]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-400 block mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  placeholder="+880 1..."
                  className="w-full bg-[#241a14] border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-[#C68B59]"
                />
              </div>

              {/* Profile Avatar Preset Picker */}
              <div className="bg-[#1e1511] p-3 rounded-2xl border border-stone-800">
                <ImagePresetPicker
                  value={staffAvatar}
                  onChange={setStaffAvatar}
                  label="Staff Avatar Photo"
                  defaultCategory="profile"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setStaffModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-bold shadow-md hover:brightness-110"
                >
                  Save Staff Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ORDER DETAILS MODAL */}
      {orderModalOpen && viewingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#19130f] border border-[#C68B59]/40 rounded-3xl p-6 shadow-2xl text-stone-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div>
                <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                  Order Details
                </span>
                <h3 className="text-lg font-mono font-bold text-white">{viewingOrder.id}</h3>
              </div>
              <button onClick={() => setOrderModalOpen(false)} className="p-1.5 rounded-lg text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#221812] p-3 rounded-2xl border border-stone-800">
                <div>
                  <span className="text-stone-500 block text-[10px]">Customer</span>
                  <span className="font-bold text-stone-200">{viewingOrder.customerName}</span>
                  <span className="text-stone-400 block">{viewingOrder.customerPhone}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">Fulfillment</span>
                  <span className="font-bold text-stone-200">{viewingOrder.orderType}</span>
                  <span className="text-amber-400 font-semibold block">{viewingOrder.paymentMethod}</span>
                </div>
              </div>

              {viewingOrder.deliveryAddress && (
                <div className="text-stone-300 bg-[#160f0c] p-2.5 rounded-xl border border-stone-800">
                  <span className="text-stone-500 block text-[10px]">Delivery Note:</span>
                  {viewingOrder.deliveryAddress}
                </div>
              )}

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                  Items ({viewingOrder.items.length})
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {viewingOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-[#201712] p-2 rounded-lg">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-bold text-[#C68B59]">৳ {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between font-bold text-sm">
                <span>Total Collected (BDT)</span>
                <span className="text-amber-400 text-base">৳ {viewingOrder.totalAmount}</span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => handleDeleteOrder(viewingOrder.id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Order</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-stone-400">Status:</span>
                  <select
                    value={viewingOrder.status}
                    onChange={(e) => {
                      const next = e.target.value as OrderStatus;
                      handleUpdateOrderStatus(viewingOrder.id, next);
                      setViewingOrder({ ...viewingOrder, status: next });
                    }}
                    className="bg-[#241a14] border border-stone-700 rounded-lg px-2.5 py-1 text-xs text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="brewing">Brewing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
