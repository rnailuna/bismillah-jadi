import React, { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Video,
  MessageSquare,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  TrendingDown,
  Info,
  ThumbsUp,
  Award,
} from 'lucide-react';
import { Product, Review } from '../../types';
import { REVIEWS } from '../../data/mockData';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onStartVideoCall: (product: Product) => void;
  onOpenChat: (product: Product) => void;
  onInstantCheckout?: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onStartVideoCall,
  onOpenChat,
  onInstantCheckout,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'info' | 'reviews' | 'farmer'>('info');
  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);

  if (!isOpen || !product) return null;

  const currentImg = selectedImage || product.images[0];
  const savingsAmount = product.supermarketPrice - product.pricePerUnit;
  const savingsPct = Math.round((savingsAmount / product.supermarketPrice) * 100);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      userName: 'Anda (Pembeli Terverifikasi)',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      userCity: 'Kawasan Jawa',
      rating: newReviewRating,
      date: 'Baru saja',
      comment: newReviewText,
      productQuality: 'Sangat Segar',
      helpfulCount: 1,
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewText('');
    setShowAddReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        
        {/* Header bar */}
        <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {product.originLocation}
            </span>
            {product.isPreOrder && (
              <span className="text-xs font-extrabold text-amber-900 dark:text-amber-200 bg-amber-200 dark:bg-amber-950 px-2.5 py-1 rounded-full">
                Pre-Order
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors cursor-pointer"
            id="btn-close-product-detail"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Image Gallery & Video Call Badge */}
            <div className="space-y-3">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <img
                  src={currentImg}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Harvest Time Badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full bg-emerald-800/90 backdrop-blur-md text-white shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    {product.harvestTimeAgo}
                  </span>
                </div>

                {/* Savings Badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-xl bg-red-600 text-white text-xs font-black shadow-md">
                    Hemat {savingsPct}% vs Supermarket
                  </span>
                </div>

                {/* Direct Video Call Inspection Banner */}
                <div className="absolute bottom-3 inset-x-3 bg-stone-950/85 backdrop-blur-md p-2.5 rounded-xl border border-white/20 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold">Ragu dengan kualitas?</span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onStartVideoCall(product);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer"
                    id="btn-call-from-detail"
                  >
                    <Video className="w-3.5 h-3.5 text-amber-300" />
                    <span>Video Call Petani</span>
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        currentImg === img ? 'border-emerald-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Pricing, Farmer, Tags, and Specs */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 leading-snug">
                  {product.name}
                </h2>

                <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-stone-400">({product.reviewCount} ulasan)</span>
                  </div>
                  <span>•</span>
                  <span>Terjual {product.soldCount} {product.unit}</span>
                  <span>•</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Stok: {product.stock} {product.unit}</span>
                </div>
              </div>

              {/* Price card */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-800 dark:text-emerald-300">
                      Rp {product.pricePerUnit.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-stone-500 font-semibold"> / {product.unit}</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-lg bg-emerald-600 text-white">
                    Harga Petani Langsung
                  </span>
                </div>

                {/* Supermarket & Traditional Market Comparison */}
                <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
                  <span>Harga Ritel Supermarket:</span>
                  <span className="line-through text-stone-400 font-medium">
                    Rp {product.supermarketPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
                  <span>Harga Pasar Tradisional:</span>
                  <span>Rp {product.traditionalMarketPrice.toLocaleString('id-ID')}</span>
                </div>
                <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 pt-1">
                  💡 Kamu menghemat Rp {savingsAmount.toLocaleString('id-ID')} per {product.unit}!
                </p>
              </div>

              {/* Pre-Order Banner if PO */}
              {product.isPreOrder && (
                <div className="p-3 rounded-2xl bg-amber-100/70 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-extrabold text-amber-950 dark:text-amber-200">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      Pre-Order Musim Panen
                    </span>
                    <span>Tersedia {product.preOrderQuota! - product.preOrderBooked!} slot lagi</span>
                  </div>
                  <p className="text-amber-900/90 dark:text-amber-300 text-[11px]">
                    Hasil panen dipetik tepat saat matang sempurna pada tanggal <strong>{product.preOrderEstimatedHarvest}</strong> dan langsung dikirim di hari yang sama.
                  </p>
                </div>
              )}

              {/* Farmer Profile Card */}
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={product.farmer.avatar}
                    alt={product.farmer.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                        {product.farmer.name}
                      </h4>
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-xs text-stone-500">{product.farmer.farmName}</p>
                    <p className="text-[11px] text-stone-400">{product.farmer.city}, {product.farmer.province}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenChat(product);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-600 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Tabs for Details, Reviews, and Farmer Story */}
          <div className="border-t border-stone-200 dark:border-stone-800 pt-4">
            <div className="flex items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-2">
              <button
                onClick={() => setActiveTab('info')}
                className={`text-xs sm:text-sm font-bold pb-1 transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'info'
                    ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Deskripsi & Tips Penyimpanan
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`text-xs sm:text-sm font-bold pb-1 transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'reviews'
                    ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Ulasan Pelanggan ({reviewsList.length})
              </button>
              <button
                onClick={() => setActiveTab('farmer')}
                className={`text-xs sm:text-sm font-bold pb-1 transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'farmer'
                    ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Tentang Kebun Petani
              </button>
            </div>

            {/* Tab: Info & Storage */}
            {activeTab === 'info' && (
              <div className="py-4 space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-1">Tentang Produk:</h4>
                  <p>{product.description}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-1">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 text-xs">
                    <Info className="w-4 h-4 text-emerald-600" />
                    Panduan & Tips Penyimpanan Segar:
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300">{product.storageTips}</p>
                </div>
              </div>
            )}

            {/* Tab: Reviews & Ratings */}
            {activeTab === 'reviews' && (
              <div className="py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                      {product.rating} dari 5.0
                    </span>
                    <span className="text-xs text-stone-400">({reviewsList.length} pembeli terverifikasi)</span>
                  </div>

                  <button
                    onClick={() => setShowAddReviewForm(!showAddReviewForm)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 cursor-pointer transition-colors"
                  >
                    + Tulis Ulasan Anda
                  </button>
                </div>

                {/* Form to submit review */}
                {showAddReviewForm && (
                  <form onSubmit={handleAddReview} className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-3">
                    <h5 className="font-bold text-xs text-stone-900 dark:text-stone-100">
                      Berikan Ulasan Kesegaran Hasil Panen
                    </h5>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-500">Peringkat Bintang:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewReviewRating(star)}
                            className="cursor-pointer"
                          >
                            <Star className={`w-5 h-5 ${star <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder="Bagaimana kesegaran, rasa, dan pengemasan hasil panen saat tiba?"
                      rows={3}
                      className="w-full p-2.5 text-xs rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddReviewForm(false)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-500 hover:bg-stone-200 cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer"
                      >
                        Kirim Ulasan
                      </button>
                    </div>
                  </form>
                )}

                {/* Reviews List */}
                <div className="space-y-3">
                  {reviewsList.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.userAvatar}
                            alt={rev.userName}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                                {rev.userName}
                              </span>
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                {rev.userCity}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-amber-500">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                              ))}
                              <span className="text-stone-400 ml-1">{rev.date}</span>
                            </div>
                          </div>
                        </div>

                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          {rev.productQuality}
                        </span>
                      </div>

                      <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                        {rev.comment}
                      </p>

                      {/* Farmer reply */}
                      {rev.farmerReply && (
                        <div className="ml-4 pl-3 border-l-2 border-emerald-500 py-1 text-xs text-stone-600 dark:text-stone-400 bg-stone-100/60 dark:bg-stone-900/60 p-2 rounded-r-xl">
                          <p className="font-bold text-emerald-800 dark:text-emerald-300 text-[11px]">
                            Balasan dari {product.farmer.name}:
                          </p>
                          <p>{rev.farmerReply}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-[11px] text-stone-400 pt-1">
                        <button className="flex items-center gap-1 hover:text-emerald-600 cursor-pointer">
                          <ThumbsUp className="w-3 h-3" /> Membantu ({rev.helpfulCount})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Farmer Story */}
            {activeTab === 'farmer' && (
              <div className="py-4 space-y-3 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                <p>{product.farmer.description}</p>
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-emerald-900 dark:text-emerald-200 text-xs">
                      Petani Terverifikasi AgroGo Jawa
                    </h5>
                    <p className="text-xs text-emerald-800/80 dark:text-emerald-300">
                      Total Transaksi Panen: {product.farmer.totalSales.toLocaleString('id-ID')} order berhasil
                    </p>
                  </div>
                  <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer sticky checkout bar */}
        <div className="p-4 sm:p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/80 flex flex-wrap items-center justify-between gap-3">
          {/* Quantity selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-stone-500">Jumlah:</span>
            <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-xl bg-white dark:bg-stone-800">
              <button
                onClick={() => setQuantity(Math.max(product.minOrder, quantity - 1))}
                className="px-3 py-1.5 font-extrabold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-l-xl cursor-pointer"
              >
                -
              </button>
              <span className="px-3 font-bold text-xs text-stone-900 dark:text-stone-100">
                {quantity} {product.unit}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-1.5 font-extrabold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-r-xl cursor-pointer"
              >
                +
              </button>
            </div>
            <span className="text-xs text-stone-500">
              Total: <strong className="text-emerald-700 dark:text-emerald-400 text-sm">Rp {(product.pricePerUnit * quantity).toLocaleString('id-ID')}</strong>
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onAddToCart(product, quantity);
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl border border-emerald-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-colors"
              id="btn-add-cart-modal"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Masukkan Keranjang</span>
            </button>

            {onInstantCheckout && (
              <button
                onClick={() => {
                  onClose();
                  onInstantCheckout(product, quantity);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#244F1F] via-[#2F6527] to-emerald-700 hover:from-emerald-800 hover:to-emerald-900 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
                id="btn-instant-checkout-modal"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Beli Langsung</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
