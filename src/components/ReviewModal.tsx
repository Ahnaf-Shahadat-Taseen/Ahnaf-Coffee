import React, { useState } from 'react';
import { Order, Review } from '../types';
import { useAuth } from '../context/AuthContext';
import { createReview } from '../services/dbService';
import { X, Star, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order | null;
  productName?: string;
  productId?: string;
  onReviewSubmitted: (reviewId: string) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  order,
  productName: propProductName,
  productId: propProductId,
  onReviewSubmitted
}) => {
  const { userProfile } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<{ id?: string; name: string }>(() => {
    if (propProductName) return { id: propProductId, name: propProductName };
    if (order && order.items.length > 0) return { id: order.items[0].productId, name: order.items[0].name };
    return { name: 'Espresso Maestro' };
  });
  const [reviewerName, setReviewerName] = useState(userProfile?.displayName || 'Coffee Enthusiast');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('Please write a short comment about your coffee experience.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const revId = await createReview({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        customerName: reviewerName.trim(),
        userId: userProfile?.uid,
        rating,
        comment: comment.trim()
      });
      onReviewSubmitted(revId);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#1a1410] border border-[#C68B59]/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-stone-100 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-white">
                Review Coffee & Pastry
              </h3>
              <p className="text-[11px] text-stone-400">
                Share your tasting notes with Ahnaf Coffee community
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* If from an order with multiple items, let user pick the item */}
          {order && order.items.length > 1 && (
            <div>
              <label className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                Select Item from Order:
              </label>
              <select
                value={selectedProduct.name}
                onChange={(e) => {
                  const item = order.items.find(i => i.name === e.target.value);
                  if (item) setSelectedProduct({ id: item.productId, name: item.name });
                }}
                className="w-full bg-[#241a14] border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-[#C68B59]"
              >
                {order.items.map((i, idx) => (
                  <option key={idx} value={i.name}>
                    {i.name} (৳{i.price})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Star rating selector */}
          <div className="text-center py-2 bg-[#221812] rounded-2xl border border-stone-800">
            <span className="text-xs font-semibold text-stone-400 block mb-2">
              Your Rating Score
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                        : 'text-stone-700'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-[#C68B59] mt-2 block">
              {rating === 5 ? '⭐⭐⭐⭐⭐ Exceptional Roast!' :
               rating === 4 ? '⭐⭐⭐⭐ Very Good Aroma' :
               rating === 3 ? '⭐⭐⭐ Satisfactory' :
               rating === 2 ? '⭐⭐ Needs Improvement' : '⭐ Subpar'}
            </span>
          </div>

          {/* Reviewer Name */}
          <div>
            <label className="text-[11px] font-semibold text-stone-400 block mb-1">
              Your Display Name
            </label>
            <input
              type="text"
              required
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="w-full bg-[#241a14] border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#C68B59]"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="text-[11px] font-semibold text-stone-400 block mb-1">
              Tasting Notes & Comments *
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the crema, milk texture, sweetness, freshness, or cafe ambiance..."
              className="w-full bg-[#241a14] border border-stone-700 rounded-xl p-3 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#C68B59] resize-none"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-950/40 text-rose-300 text-xs border border-rose-800">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C68B59] to-[#9E5D2A] hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-[#C68B59]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Submitting Review...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Post Verified Review</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
