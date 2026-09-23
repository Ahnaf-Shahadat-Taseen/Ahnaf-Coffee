import React, { useState } from 'react';
import { Product, ProductCategory, Review, Order } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  Coffee, 
  Search, 
  Sparkles, 
  Star, 
  ShoppingBag, 
  Clock, 
  Flame, 
  Check, 
  Filter, 
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronRight,
  MessageSquarePlus,
  SlidersHorizontal
} from 'lucide-react';

interface StorefrontViewProps {
  products: Product[];
  reviews: Review[];
  onOpenTracker: () => void;
  onOpenReviewModal: (productName?: string, productId?: string) => void;
}

const CATEGORIES: ('All' | ProductCategory)[] = [
  'All',
  'Hot Coffee',
  'Cold Brews',
  'Pastries & Bakery',
  'Specialty Blends'
];

export const StorefrontView: React.FC<StorefrontViewProps> = ({
  products,
  reviews,
  onOpenTracker,
  onOpenReviewModal
}) => {
  const { addToCart } = useCart();
  const { userProfile } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<'All' | ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(450);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [addedItemAnim, setAddedItemAnim] = useState<string | null>(null);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = p.price <= maxPrice;
    const matchesStock = !onlyInStock || (p.isAvailable && p.stock > 0);
    return matchesCategory && matchesSearch && matchesPrice && matchesStock;
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedItemAnim(product.id);
    setTimeout(() => setAddedItemAnim(null), 1200);
  };

  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '4.9';

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24">
        {/* Ambient atmospheric glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C68B59]/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#261c16] border border-[#C68B59]/40 text-[#C68B59] text-xs font-bold tracking-wide shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Handcrafted Artisanal Brews • Banani Road 11</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-[#FBF8F5] leading-[1.15] tracking-tight">
                Pure Coffee Bliss, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0A97E] via-[#C68B59] to-[#D49B6A]">
                  Slowly Extracted.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-300 max-w-xl font-light leading-relaxed">
                Welcome to <strong>Ahnaf Coffee Shop</strong>. From our velvet Spanish Lattes to flaky Parisian croissants, every cup is crafted with meticulously sourced beans and local warmth in Dhaka.
              </p>

              {/* Guarantees */}
              <div className="flex flex-wrap gap-4 pt-1 text-xs text-stone-300">
                <div className="flex items-center gap-2 bg-[#1f1712] px-3 py-1.5 rounded-xl border border-stone-800">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Cash on Delivery / Counter</span>
                </div>
                <div className="flex items-center gap-2 bg-[#1f1712] px-3 py-1.5 rounded-xl border border-stone-800">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Fresh Morning Bakes</span>
                </div>
                <div className="flex items-center gap-2 bg-[#1f1712] px-3 py-1.5 rounded-xl border border-stone-800">
                  <Clock className="w-4 h-4 text-[#C68B59]" />
                  <span>Live Barista Tracking</span>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3 pt-3">
                <a
                  href="#menu"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#C68B59] to-[#9E5D2A] text-white font-bold text-sm shadow-xl shadow-[#C68B59]/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Coffee className="w-4 h-4" />
                  <span>Browse Fresh Menu</span>
                </a>
                <button
                  type="button"
                  onClick={onOpenTracker}
                  className="px-6 py-3.5 rounded-2xl bg-[#241a14] border border-[#C68B59]/40 hover:bg-[#2d211a] text-stone-200 font-bold text-sm transition-all flex items-center gap-2 shadow-md"
                >
                  <Search className="w-4 h-4 text-[#C68B59]" />
                  <span>Track Active Order</span>
                </button>
              </div>
            </div>

            {/* Right Featured Coffee Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden glass-panel p-3 border border-[#C68B59]/40 shadow-2xl">
                <div className="relative h-72 rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80"
                    alt="Spanish Latte Maestro"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#18110e]/90 backdrop-blur-md border border-[#C68B59]/40 text-amber-300 text-xs font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>Top Pick: 4.9/5</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C68B59]">
                      Signature Specialty
                    </span>
                    <h3 className="text-xl font-serif font-bold text-white leading-tight">
                      Spanish Latte Royale
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-extrabold text-[#FBF8F5]">
                        ৳ 340 <span className="text-[10px] text-stone-400 font-normal">BDT</span>
                      </span>
                      <span className="text-xs text-emerald-400 font-medium bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800">
                        In Stock • Fresh Brew
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#17100d] rounded-xl mt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#C68B59]/20 flex items-center justify-center text-[#C68B59]">
                      ☕
                    </div>
                    <div>
                      <p className="font-semibold text-stone-200">Banani Roastery Counter</p>
                      <p className="text-[11px] text-stone-400">Pickup ready in ~8 mins</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const featuredItem = products.find(p => p.name.includes('Spanish Latte')) || products[0];
                      if (featuredItem) handleAddToCart(featuredItem);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#C68B59] hover:bg-[#b07849] text-white font-bold text-xs shadow transition-all"
                  >
                    Quick Add
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C68B59] mb-1">
              <Coffee className="w-4 h-4" />
              <span>Boutique Menu & Counter Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
              Artisan Coffee & Warm Pastries
            </h2>
            <p className="text-sm text-stone-400 mt-1">
              Select items for Cash on Delivery or fast Counter Pickup in Banani.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400">
              Showing <strong>{filteredProducts.length}</strong> creations
            </span>
          </div>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="glass-panel p-4 sm:p-5 rounded-3xl space-y-4">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search espresso, caramel macchiato, croissant, cheesecake..."
                className="w-full bg-[#18110e] border border-stone-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#C68B59]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-2.5 text-xs text-stone-500 hover:text-stone-300"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Price Filter Slider */}
            <div className="flex items-center gap-3 bg-[#18110e] px-4 py-2 rounded-2xl border border-stone-700/80 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-[#C68B59]" />
              <span className="text-xs text-stone-300 font-medium">Max Price:</span>
              <input
                type="range"
                min="150"
                max="450"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 accent-[#C68B59] cursor-pointer"
              />
              <span className="text-xs font-bold text-[#C68B59] min-w-[50px]">
                ৳ {maxPrice}
              </span>
            </div>

            {/* In stock toggle */}
            <label className="flex items-center gap-2 bg-[#18110e] px-3.5 py-2.5 rounded-2xl border border-stone-700/80 cursor-pointer text-xs select-none">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="accent-[#C68B59] rounded"
              />
              <span className="text-stone-300">In-Stock Only</span>
            </label>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#C68B59] text-white shadow-md'
                    : 'bg-[#1e1612] text-stone-400 hover:text-stone-200 hover:bg-[#281d18]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl text-stone-400">
            <Coffee className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="text-base font-serif font-bold text-stone-200">No coffee or pastry match found</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords, price filter, or browse all categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setMaxPrice(450);
                setOnlyInStock(false);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#C68B59] text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const isAvailable = product.isAvailable && product.stock > 0;
              const isAdded = addedItemAnim === product.id;

              return (
                <div
                  key={product.id}
                  className="group rounded-3xl overflow-hidden glass-panel border border-[#C68B59]/20 hover:border-[#C68B59]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#C68B59]/10 flex flex-col justify-between"
                >
                  <div>
                    {/* Image thumbnail with badges */}
                    <div className="relative h-56 overflow-hidden bg-stone-900">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-[#C68B59] border border-[#C68B59]/30">
                          {product.category}
                        </span>
                        {product.featured && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/80 backdrop-blur-md text-white shadow">
                            ★ Signature
                          </span>
                        )}
                      </div>

                      {/* Stock indicator badge */}
                      <div className="absolute bottom-3 right-3">
                        {product.stock <= 0 || !product.isAvailable ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800">
                            Sold Out
                          </span>
                        ) : product.stock <= 5 ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800">
                            Only {product.stock} left
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                            In Stock ({product.stock})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-serif font-bold text-stone-100 group-hover:text-[#C68B59] transition-colors">
                          {product.name}
                        </h3>
                        <span className="text-base font-extrabold text-[#C68B59] shrink-0">
                          ৳ {product.price}
                        </span>
                      </div>

                      <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-stone-800/60 mt-2">
                    <button
                      type="button"
                      onClick={() => onOpenReviewModal(product.name, product.id)}
                      className="text-[11px] text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-1 py-1"
                      title="Read and add tasting review"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span>Review</span>
                    </button>

                    <button
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => handleAddToCart(product)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                        !isAvailable
                          ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                          : isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gradient-to-r from-[#C68B59] to-[#9E5D2A] text-white hover:brightness-110 active:scale-95'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* Customer Reviews & Tasting Notes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>Verified Patron Feedback</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-stone-100">
              Coffee Connoisseurs Love Ahnaf
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Real reviews from daily Banani regulars and takeout guests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-[#221812] border border-amber-500/30 flex items-center gap-2">
              <span className="text-lg font-bold text-amber-400">{averageRating}</span>
              <div className="text-left text-[10px] text-stone-400 leading-tight">
                <span className="text-stone-200 font-bold block">Overall Score</span>
                <span>{reviews.length} reviews</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenReviewModal()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C68B59] to-[#9E5D2A] text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:brightness-110 transition-all"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((rev) => (
            <div
              key={rev.id}
              className="glass-panel p-5 rounded-3xl border border-stone-800 hover:border-[#C68B59]/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-stone-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-stone-500">
                    {new Date(rev.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div className="bg-[#18110e] px-2.5 py-1 rounded-lg border border-stone-800 text-[11px] text-[#C68B59] font-semibold w-fit">
                  {rev.productName}
                </div>

                <p className="text-xs text-stone-300 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-800/80 mt-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#C68B59]/20 text-[#C68B59] font-bold text-xs flex items-center justify-center">
                    {rev.customerName.charAt(0)}
                  </div>
                  <span className="font-semibold text-stone-200">{rev.customerName}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-medium">Verified Drinker</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roasting Philosophy Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-[#C68B59]/30 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C68B59]">
              The Ahnaf Standard
            </span>
            <h2 className="text-3xl font-serif font-bold text-white leading-tight">
              No Shortcuts. Pure Roastery Quality.
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              We source raw green beans directly from high-altitude estates, roasting in small 5kg micro-batches right here in Banani. We pull shots at 9 bars of pressure with calibrated temperature stability, giving every espresso, flat white, or Spanish latte a smooth, velvety mouthfeel without harsh bitterness.
            </p>
            <div className="pt-2 flex items-center gap-6 text-xs text-stone-400">
              <div>
                <span className="text-xl font-bold text-[#C68B59] block">100%</span>
                <span>Arabica Single Origin</span>
              </div>
              <div className="w-px h-8 bg-stone-800" />
              <div>
                <span className="text-xl font-bold text-[#C68B59] block">72-Layer</span>
                <span>Fresh Butter Croissants</span>
              </div>
              <div className="w-px h-8 bg-stone-800" />
              <div>
                <span className="text-xl font-bold text-[#C68B59] block">0 Gateway Fee</span>
                <span>Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
