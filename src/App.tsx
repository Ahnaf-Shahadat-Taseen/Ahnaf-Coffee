import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { ReviewModal } from './components/ReviewModal';
import { AuthModal } from './components/AuthModal';
import { StorefrontView } from './views/StorefrontView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { StaffDashboardView } from './views/StaffDashboardView';
import { CustomerOrdersView } from './views/CustomerOrdersView';
import { 
  subscribeToProducts, 
  subscribeToOrders, 
  subscribeToUsers, 
  subscribeToReviews 
} from './services/dbService';
import { Product, Order, UserProfile, Review, UserRole } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USERS, INITIAL_REVIEWS } from './data/initialSeedData';
import { CheckCircle2, ShieldCheck, Coffee, Lock } from 'lucide-react';

function CoffeeShopApp() {
  const { role, isAdmin, isStaff, isAuthenticated, userProfile } = useAuth();
  const { setIsCartOpen, isCartOpen } = useCart();

  // Navigation state defaults based on role if logged in
  const [currentView, setCurrentView] = useState<'store' | 'admin' | 'staff' | 'orders'>('store');

  // Firestore real-time collections
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [activeTrackingId, setActiveTrackingId] = useState<string>('');
  
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [targetReviewOrder, setTargetReviewOrder] = useState<Order | null>(null);
  const [targetReviewProduct, setTargetReviewProduct] = useState<{ name?: string; id?: string }>({});

  // Toast notification banner
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle?: string } | null>(null);

  const showToast = (title: string, subtitle?: string) => {
    setToastMessage({ title, subtitle });
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Subscribe to real-time Firestore collections
  useEffect(() => {
    const unsubProducts = subscribeToProducts((list) => setProducts(list));
    const unsubOrders = subscribeToOrders((list) => setOrders(list));
    const unsubUsers = subscribeToUsers((list) => setUsers(list));
    const unsubReviews = subscribeToReviews((list) => setReviews(list));

    return () => {
      unsubProducts();
      unsubOrders();
      unsubUsers();
      unsubReviews();
    };
  }, []);

  // When role changes, guarantee access routing
  useEffect(() => {
    if (currentView === 'admin' && !isAdmin) {
      setCurrentView('store');
    } else if (currentView === 'staff' && !isStaff && !isAdmin) {
      setCurrentView('store');
    }
  }, [role, isAdmin, isStaff, currentView]);

  // Handler when user successfully signs in with Email and Password
  const handleAuthSuccess = (loggedRole: UserRole) => {
    if (loggedRole === 'admin') {
      setCurrentView('admin');
      showToast('Welcome, Super Admin!', 'Opened Super Admin Operations & Analytics Console');
    } else if (loggedRole === 'staff') {
      setCurrentView('staff');
      showToast('Welcome, Barista!', 'Opened Barista Station & POS Brewing Queue');
    } else {
      setCurrentView('store');
      showToast('Welcome to Ahnaf Coffee!', 'Browsing handcrafted coffee menu');
    }
  };

  // Safe navigation guard
  const handleNavigate = (view: 'store' | 'admin' | 'staff' | 'orders') => {
    if (view === 'admin' && !isAdmin) {
      setAuthModalOpen(true);
      showToast('Admin Credentials Required', 'Please sign in with Admin email & password to access');
      return;
    }
    if (view === 'staff' && !isStaff && !isAdmin) {
      setAuthModalOpen(true);
      showToast('Staff Credentials Required', 'Please sign in with Barista email & password to access');
      return;
    }
    setCurrentView(view);
  };

  // Order placed handler
  const handleOrderSuccess = (orderId: string) => {
    showToast(`Order Placed Successfully!`, `Tracking ID: ${orderId} (Pay at Counter / Cash on Delivery)`);
    setActiveTrackingId(orderId);
    setTrackerModalOpen(true);
  };

  // Open review modal for an order or product
  const handleOpenReviewForOrder = (order: Order) => {
    setTargetReviewOrder(order);
    setTargetReviewProduct({});
    setReviewModalOpen(true);
  };

  const handleOpenReviewForProduct = (productName?: string, productId?: string) => {
    setTargetReviewOrder(null);
    setTargetReviewProduct({ name: productName, id: productId });
    setReviewModalOpen(true);
  };

  const handleReviewSubmitted = () => {
    showToast('Review Received!', 'Thank you for sharing your tasting notes with Ahnaf Coffee.');
  };

  return (
    <div className="min-h-screen bg-[#140f0c] text-[#FBF8F5] flex flex-col font-sans selection:bg-[#C68B59] selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-sm glass-dropdown p-4 rounded-2xl border border-amber-500/50 text-white shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">{toastMessage.title}</p>
              {toastMessage.subtitle && (
                <p className="text-[11px] text-stone-300 mt-0.5">{toastMessage.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar with Role Badge and Cart Badge */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenTracker={() => {
          setActiveTrackingId(orders.length > 0 ? orders[0].id : '');
          setTrackerModalOpen(true);
        }}
      />

      {/* Dynamic View Rendering According to Role */}
      <main className="flex-1">
        
        {/* 1. Super Admin View (Admin credentials only) */}
        {currentView === 'admin' && isAdmin && (
          <AdminDashboardView
            products={products}
            orders={orders}
            users={users}
          />
        )}

        {/* 2. Staff Barista View (Staff credentials) */}
        {currentView === 'staff' && (isStaff || isAdmin) && (
          <StaffDashboardView
            products={products}
            orders={orders}
            users={users}
          />
        )}

        {/* 3. Customer Storefront View */}
        {currentView === 'store' && (
          <StorefrontView
            products={products}
            reviews={reviews}
            onOpenTracker={() => {
              setActiveTrackingId(orders.length > 0 ? orders[0].id : '');
              setTrackerModalOpen(true);
            }}
            onOpenReviewModal={handleOpenReviewForProduct}
          />
        )}

        {/* 4. Customer Orders & Tracking View */}
        {currentView === 'orders' && (
          <CustomerOrdersView
            orders={orders}
            onOpenTracker={(id) => {
              setActiveTrackingId(id || (orders.length > 0 ? orders[0].id : ''));
              setTrackerModalOpen(true);
            }}
            onOpenReviewModal={handleOpenReviewForOrder}
            onNavigateToStore={() => setCurrentView('store')}
          />
        )}
      </main>

      {/* Brand Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Real-time Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={trackerModalOpen}
        onClose={() => setTrackerModalOpen(false)}
        orders={orders}
        initialOrderId={activeTrackingId}
        onOpenReview={handleOpenReviewForOrder}
      />

      {/* Tasting Review & 5-Star Rating Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        order={targetReviewOrder}
        productName={targetReviewProduct.name}
        productId={targetReviewProduct.id}
        onReviewSubmitted={handleReviewSubmitted}
      />

      {/* Strict Authentication Modal (Requires Email & Password) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CoffeeShopApp />
      </CartProvider>
    </AuthProvider>
  );
}
