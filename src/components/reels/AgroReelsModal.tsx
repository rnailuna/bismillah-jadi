import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Heart,
  MessageCircle,
  Share2,
  ShoppingBag,
  MapPin,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Video,
  UploadCloud,
  Film,
  Plus,
} from 'lucide-react';
import { AgroReel, Product } from '../../types';
import { AGRO_REELS, PRODUCTS } from '../../data/mockData';

interface AgroReelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onOpenProductDetail?: (product: Product) => void;
  onStartVideoCall?: (product: Product) => void;
  isSubscribed?: boolean;
  reels?: AgroReel[];
  initialReelId?: string | null;
  products?: Product[];
  onAddNewReel?: (data: {
    title: string;
    description: string;
    videoUrl: string;
    thumbnail?: string;
    productId: string;
    harvestHighlight: string;
  }) => void;
}

// Contoh Iklan Disponsori untuk Pembeli Non-Langganan
const SPONSORED_AD_REEL = {
  id: 'ad-reel-semeru-1',
  sponsorName: 'Koperasi Tani Pupuk Hayati Semeru Makmur Lumajang',
  title: 'Promo Spesial: Pupuk Organik Vulkanik Semeru & Bibit Unggul (Diskon 40%)',
  description: 'Gunakan nutrisi batuan vulkanik Gunung Semeru untuk hasil panen sayur, pisang, dan buah berbobot maksimal. Bebas bahan kimia berbahaya!',
  tag: 'IKLAN DISPONSORI',
  thumbnail: '/src/assets/images/lumajang_nature_ranu_klakah_1792598474146.jpg',
  ctaText: 'Klaim Diskon 40% Sponsor',
  discountBadge: 'VOUCHER: PUPUKSEMERU40',
};

export const AgroReelsModal: React.FC<AgroReelsModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  onOpenProductDetail,
  onStartVideoCall,
  isSubscribed = false,
  reels = AGRO_REELS,
  initialReelId,
  products = PRODUCTS,
  onAddNewReel,
}) => {
  const activeReels = reels && reels.length > 0 ? reels : AGRO_REELS;

  // Unconditional Hooks (must be called in the exact same order every render)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedReels, setLikedReels] = useState<{ [id: string]: boolean }>({});
  const [likeCounts, setLikeCounts] = useState<{ [id: string]: number }>({});
  const [isMuted, setIsMuted] = useState(false);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State mode langganan vs non-langganan
  const [isFreeUser, setIsFreeUser] = useState(!isSubscribed);
  const [showingAd, setShowingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [canSkipAd, setCanSkipAd] = useState(false);

  // Reel Real Video Upload State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadVideoPreview, setUploadVideoPreview] = useState<string | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadProductId, setUploadProductId] = useState(products[0]?.id || 'p1');
  const [uploadHighlight, setUploadHighlight] = useState('Petik Subuh Senduro');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync user subscription state when prop changes
  useEffect(() => {
    setIsFreeUser(!isSubscribed);
  }, [isSubscribed]);

  // Sync initial reel selection whenever modal opens or initialReelId changes
  useEffect(() => {
    if (isOpen && initialReelId) {
      const idx = activeReels.findIndex((r) => r.id === initialReelId);
      if (idx !== -1) {
        setCurrentIndex(idx);
        setShowingAd(false);
      }
    }
  }, [isOpen, initialReelId, activeReels]);

  // Reset ad timer state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowingAd(false);
      setAdCountdown(5);
      setCanSkipAd(false);
      setToastMessage(null);
      setAddedItemNotice(null);
      setShowUploadModal(false);
    }
  }, [isOpen]);

  // Countdown timer for sponsored ad (runs unconditionally at top-level)
  useEffect(() => {
    if (!isOpen || !showingAd) return;

    const timer = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          setCanSkipAd(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, showingAd]);

  // Toast auto-clear effect
  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
    return () => clearTimeout(t);
  }, [toastMessage]);

  // Early return ONLY after all hooks are executed
  if (!isOpen) return null;

  const currentReel = activeReels[currentIndex] || activeReels[0] || AGRO_REELS[0];
  const isLiked = likedReels[currentReel.id] || false;
  const currentLikes = likeCounts[currentReel.id] || currentReel.likes;

  const handleToggleLike = (id: string) => {
    if (isLiked) {
      setLikedReels((prev) => ({ ...prev, [id]: false }));
      setLikeCounts((prev) => ({ ...prev, [id]: (prev[id] || currentReel.likes) - 1 }));
    } else {
      setLikedReels((prev) => ({ ...prev, [id]: true }));
      setLikeCounts((prev) => ({ ...prev, [id]: (prev[id] || currentReel.likes) + 1 }));
    }
  };

  // Trigger ad every 2 reels if non-subscriber
  const handleNext = () => {
    if (isFreeUser && !showingAd && (currentIndex + 1) % 2 === 0) {
      setShowingAd(true);
      setAdCountdown(5);
      setCanSkipAd(false);
      return;
    }
    setShowingAd(false);
    setCurrentIndex((prev) => (prev + 1) % activeReels.length);
  };

  const handlePrev = () => {
    setShowingAd(false);
    setCurrentIndex((prev) => (prev - 1 + activeReels.length) % activeReels.length);
  };

  const handleAddCurrentProduct = () => {
    onAddToCart(currentReel.product);
    setAddedItemNotice(currentReel.product.name);
    setTimeout(() => {
      setAddedItemNotice(null);
    }, 2500);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Handle REAL video file selection
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      const blobUrl = URL.createObjectURL(file);
      setUploadVideoPreview(blobUrl);
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  // Handle Reel upload submission
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadVideoPreview && !uploadFile) {
      showToast('Harap pilih berkas video MP4/MOV dari perangkat Anda.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 250);

    setTimeout(() => {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(100);

      const targetProduct = products.find((p) => p.id === uploadProductId) || products[0];

      if (onAddNewReel) {
        onAddNewReel({
          title: uploadTitle.trim() || `Panen Segar ${targetProduct.name}`,
          description: uploadDescription.trim() || 'Dokumentasi panen langsung dari kebun petani Lumajang hari ini.',
          videoUrl: uploadVideoPreview || targetProduct.images[0],
          thumbnail: targetProduct.images[0],
          productId: uploadProductId,
          harvestHighlight: uploadHighlight.trim() || 'Petik Segar Hari Ini',
        });
      }

      setShowUploadModal(false);
      setCurrentIndex(0); // View the newest reel
      showToast('✓ Video panen berhasil diunggah & tayang di AgroReels!');

      // Reset
      setUploadFile(null);
      setUploadVideoPreview(null);
      setUploadTitle('');
      setUploadDescription('');
      setUploadProgress(0);
    }, 1200);
  };

  const isVideoFormat = (url?: string) => {
    if (!url) return false;
    return (
      url.startsWith('blob:') ||
      url.endsWith('.mp4') ||
      url.endsWith('.webm') ||
      url.startsWith('data:video')
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer border border-white/20"
        id="close-agroreels-btn"
        aria-label="Tutup AgroReels"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Reels Card (9:16 vertical ratio) */}
      <div className="relative w-full max-w-sm sm:max-w-md h-full sm:h-[90vh] bg-stone-950 rounded-none sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
        
        {/* In-app Toast Banner */}
        {toastMessage && (
          <div className="absolute top-16 left-4 right-4 z-50 p-3 rounded-2xl bg-emerald-800 text-white text-xs font-bold shadow-xl border border-emerald-500/50 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span className="flex-1">{toastMessage}</span>
          </div>
        )}

        {/* VIEW 1: CONTOH IKLAN UNTUK PEMBELI NON-LANGGANAN */}
        {showingAd ? (
          <>
            {/* Background Image Iklan */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-stone-900">
              <img
                src={SPONSORED_AD_REEL.thumbnail}
                alt={SPONSORED_AD_REEL.title}
                className="w-full h-full object-cover scale-105 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/95" />
            </div>

            {/* Top Bar Iklan */}
            <div className="relative z-10 p-4 pt-10 sm:pt-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-amber-400 text-stone-950 font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-stone-900" />
                  <span>{SPONSORED_AD_REEL.tag}</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-600/90 text-white font-bold">
                  Akun Gratis (Non-Langganan)
                </span>
              </div>

              {/* Tombol Lewati Iklan / Countdown */}
              <div>
                {canSkipAd ? (
                  <button
                    onClick={() => {
                      setShowingAd(false);
                      setCurrentIndex((prev) => (prev + 1) % activeReels.length);
                    }}
                    className="px-3 py-1.5 rounded-full bg-white text-stone-950 font-black text-xs hover:bg-amber-300 transition-colors shadow-lg cursor-pointer flex items-center gap-1"
                  >
                    <span>Lewati Iklan</span>
                    <span>&rsaquo;</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 font-bold text-xs border border-white/20">
                    Lewati dalam {adCountdown}s
                  </span>
                )}
              </div>
            </div>

            {/* Middle Notice Upgrade VIP */}
            <div className="relative z-10 px-5 text-center my-auto space-y-3">
              <div className="p-3.5 rounded-2xl bg-black/70 backdrop-blur-md border border-amber-400/40 text-left space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-amber-300 flex items-center gap-1">
                    👑 Bebas Iklan dengan AgroGo VIP
                  </span>
                  <button
                    onClick={() => {
                      setIsFreeUser(false);
                      showToast('Mode VIP aktif: Bebas iklan sponsor!');
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-amber-400 text-stone-950 font-black hover:bg-amber-300 cursor-pointer"
                  >
                    Uji Mode VIP
                  </button>
                </div>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  Sebagai pembeli non-langganan, iklan sponsor akan muncul berkala. Tingkatkan ke <strong>AgroGo VIP</strong> untuk menikmati video panen tanpa jeda iklan dan gratis ongkir!
                </p>
              </div>
            </div>

            {/* Bottom Card Sponsor */}
            <div className="relative z-10 p-4 space-y-3">
              <div className="space-y-1.5 text-white">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                  🏢 {SPONSORED_AD_REEL.sponsorName}
                </span>
                <h3 className="font-black text-sm sm:text-base leading-snug drop-shadow-md">
                  {SPONSORED_AD_REEL.title}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed line-clamp-2">
                  {SPONSORED_AD_REEL.description}
                </p>
              </div>

              {/* Action Button Iklan */}
              <div className="p-3 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md shadow-2xl border border-white/20 flex items-center justify-between gap-3 text-stone-900 dark:text-stone-100">
                <div>
                  <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 block">
                    {SPONSORED_AD_REEL.discountBadge}
                  </span>
                  <p className="font-extrabold text-xs">Pupuk Hayati Semeru (Diskon 40%)</p>
                </div>
                <button
                  onClick={() => {
                    showToast('Kupon "PUPUKSEMERU40" berhasil diklaim & disalin!');
                    setShowingAd(false);
                    setCurrentIndex((prev) => (prev + 1) % activeReels.length);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md cursor-pointer transition-transform active:scale-95"
                >
                  {SPONSORED_AD_REEL.ctaText}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Background Video (Real Video Playback if video file / Blob) or Animated Visualizer */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-stone-900 flex items-center justify-center">
              {isVideoFormat(currentReel.videoUrl) ? (
                <video
                  key={currentReel.id + currentReel.videoUrl}
                  src={currentReel.videoUrl}
                  autoPlay
                  loop
                  playsInline
                  muted={isMuted}
                  className="w-full h-full object-cover scale-105"
                />
              ) : (
                <img
                  src={currentReel.thumbnail}
                  alt={currentReel.title}
                  className="w-full h-full object-cover scale-105"
                />
              )}
              {/* Subtle overlay gradients */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95 pointer-events-none" />
            </div>

            {/* Top Bar: Title, Mode Indicator & Unggah Reel Button */}
            <div className="relative z-10 p-4 pt-10 sm:pt-4 flex items-center justify-between text-white flex-wrap gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 font-black text-xs flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  AgroReels
                </span>
                <span className="text-xs font-semibold text-stone-300">
                  {currentIndex + 1} dari {activeReels.length}
                </span>

                {/* Upload Reel Button for Buyer & Farmer */}
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-black text-[10px] flex items-center gap-1 shadow-md cursor-pointer transition-transform active:scale-95"
                  title="Unggah Video Panen Sungguhan"
                  id="btn-upload-reel-header"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Unggah Video</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Audio toggle */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
                  title={isMuted ? 'Nyalakan Audio' : 'Bisukan'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Right Side Vertical Action Bar (Like, Comment, Share, Next/Prev) */}
            <div className="absolute right-3.5 bottom-36 z-20 flex flex-col items-center gap-3.5 text-white">
              {/* Like */}
              <button
                onClick={() => handleToggleLike(currentReel.id)}
                className="flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-125"
                id="reel-like-btn"
              >
                <div className={`p-3 rounded-full backdrop-blur-md transition-colors ${
                  isLiked ? 'bg-red-600 text-white' : 'bg-black/50 text-white hover:bg-black/70'
                }`}>
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-white' : ''}`} />
                </div>
                <span className="text-[11px] font-bold">{currentLikes.toLocaleString('id-ID')}</span>
              </button>

              {/* Comments */}
              <div className="flex flex-col items-center gap-1">
                <div className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold">{currentReel.commentsCount}</span>
              </div>

              {/* Share */}
              <button
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    showToast('Tautan Reel panen disalin ke clipboard!');
                  } else {
                    showToast('Tautan berhasil disalin!');
                  }
                }}
                className="flex flex-col items-center gap-1 cursor-pointer"
                title="Bagikan Reel"
              >
                <div className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70">
                  <Share2 className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold">Bagikan</span>
              </button>

              {/* Live Video Call with Farmer shortcut if supported */}
              {onStartVideoCall && (
                <button
                  onClick={() => {
                    onClose();
                    onStartVideoCall(currentReel.product);
                  }}
                  className="flex flex-col items-center gap-1 cursor-pointer"
                  title="Video Call Petani Langsung"
                >
                  <div className="p-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-md animate-pulse">
                    <Video className="w-6 h-6 text-amber-200" />
                  </div>
                  <span className="text-[10px] font-black text-amber-300">Live Call</span>
                </button>
              )}

              {/* Prev/Next reel navigation */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/20">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white cursor-pointer"
                  title="Reel Sebelumnya"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white cursor-pointer"
                  title="Reel Berikutnya"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Bottom Section: Farmer Info, Description & Shoppable Product Card */}
            <div className="relative z-10 p-4 space-y-3">
              {/* Farmer & Description */}
              <div className="space-y-1.5 max-w-[80%]">
                <div className="flex items-center gap-2">
                  <img
                    src={currentReel.farmer.avatar}
                    alt={currentReel.farmer.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-amber-400"
                  />
                  <div>
                    <p className="font-extrabold text-sm text-white">{currentReel.farmer.name}</p>
                    <p className="text-[11px] text-amber-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {currentReel.farmer.city}, {currentReel.farmer.province}
                    </p>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-white leading-tight drop-shadow-sm">
                  {currentReel.title}
                </h4>
                <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                  {currentReel.description}
                </p>
              </div>

              {/* Shoppable Floating Product Card */}
              <div className="p-3 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md shadow-2xl border border-white/20 flex items-center justify-between gap-3 text-stone-900 dark:text-stone-100">
                <div
                  onClick={() => {
                    onClose();
                    onOpenProductDetail?.(currentReel.product);
                  }}
                  className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer group"
                >
                  <img
                    src={currentReel.product.images[0]}
                    alt={currentReel.product.name}
                    className="w-12 h-12 rounded-xl object-cover border border-emerald-500 flex-shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0">
                    <span className="inline-block text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                      {currentReel.harvestHighlight}
                    </span>
                    <p className="font-extrabold text-xs truncate group-hover:text-emerald-600 transition-colors">
                      {currentReel.product.name}
                    </p>
                    <p className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                      Rp {currentReel.product.pricePerUnit.toLocaleString('id-ID')}
                      <span className="text-[10px] text-stone-400 font-normal">/{currentReel.product.unit}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleAddCurrentProduct}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md flex-shrink-0 cursor-pointer transition-transform active:scale-95"
                  id="reel-buy-now-btn"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Beli Langsung</span>
                </button>
              </div>

              {/* Added Notice Toast */}
              {addedItemNotice && (
                <div className="p-2 rounded-xl bg-emerald-600 text-white text-center text-xs font-bold animate-in fade-in flex items-center justify-center gap-1.5 shadow-lg">
                  <CheckCircle2 className="w-4 h-4" />
                  {addedItemNotice} berhasil masuk ke keranjang!
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ===================== MODAL REAL UPLOAD REEL SUNGGUHAN ===================== */}
      {showUploadModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-auto p-5 sm:p-6 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950 flex items-center justify-center text-pink-600">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-stone-900 dark:text-stone-100">
                    Unggah Video Reel Panen Baru
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Video vertikal 9:16 untuk dipromosikan ke seluruh pembeli AgroGo
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 max-h-[75vh] overflow-y-auto pr-1">
              {/* File Input Real (Drag & Drop or Choose File) */}
              <div className="space-y-1.5">
                <label className="font-bold text-stone-800 dark:text-stone-200 block text-xs">
                  Pilih Berkas Video Rekaman Panen:
                </label>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  className="hidden"
                  id="real-video-file-input"
                />

                {uploadVideoPreview ? (
                  <div className="space-y-2">
                    <div className="relative rounded-2xl overflow-hidden bg-black max-h-48 flex items-center justify-center border-2 border-emerald-500 shadow-md">
                      <video
                        src={uploadVideoPreview}
                        controls
                        className="w-full max-h-48 object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span className="font-semibold text-emerald-600 truncate max-w-[200px]">
                        ✓ {uploadFile?.name || 'Video Terpilih'}
                      </span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-pink-600 hover:underline font-bold cursor-pointer"
                      >
                        Ganti Video
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-6 rounded-2xl border-2 border-dashed border-pink-400/80 hover:border-pink-500 bg-pink-50/50 dark:bg-pink-950/20 text-center space-y-2 cursor-pointer transition-colors"
                  >
                    <UploadCloud className="w-9 h-9 text-pink-500 mx-auto animate-bounce" />
                    <div>
                      <p className="font-extrabold text-stone-800 dark:text-stone-100 text-xs">
                        Klik untuk Pilih Video dari HP / Laptop Anda
                      </p>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Format MP4, MOV, WEBM • Rekam dari kebun / sawah
                      </p>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-pink-500 text-white font-black text-[10px] shadow-xs">
                      Pilih Video Sekarang
                    </span>
                  </div>
                )}
              </div>

              {/* Judul Reel */}
              <div>
                <label className="font-bold text-stone-800 dark:text-stone-200 block mb-1">
                  Judul Video Panen:
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Contoh: Suasana Petik Pisang Kirana Emas Tempursari"
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold"
                />
              </div>

              {/* Hubungkan dengan Komoditas / Produk */}
              <div>
                <label className="font-bold text-stone-800 dark:text-stone-200 block mb-1">
                  Produk yang Dijual di Bawah Video:
                </label>
                <select
                  value={uploadProductId}
                  onChange={(e) => setUploadProductId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold cursor-pointer"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — Rp {p.pricePerUnit.toLocaleString('id-ID')}/{p.unit} ({p.farmer.district})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-stone-400 mt-1">
                  💡 Penonton video akan dapat mengklik tombol "Beli Langsung" pada produk ini.
                </p>
              </div>

              {/* Sorotan Panen */}
              <div>
                <label className="font-bold text-stone-800 dark:text-stone-200 block mb-1">
                  Label Sorotan (Badge):
                </label>
                <input
                  type="text"
                  value={uploadHighlight}
                  onChange={(e) => setUploadHighlight(e.target.value)}
                  placeholder="Contoh: Petik Subuh Senduro / 100% Organik"
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold"
                />
              </div>

              {/* Deskripsi & Cerita Panen */}
              <div>
                <label className="font-bold text-stone-800 dark:text-stone-200 block mb-1">
                  Deskripsi & Cerita Kebun:
                </label>
                <textarea
                  rows={2}
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Ceritakan keistimewaan panen hari ini... #PetaniLumajang #SegarSemeru"
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              {/* Progress Bar when uploading */}
              {isUploading && (
                <div className="p-3 rounded-2xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 space-y-1.5">
                  <div className="flex justify-between font-bold text-[11px] text-pink-700 dark:text-pink-300">
                    <span>Sedang mengunggah dan mengompres video...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full bg-pink-600 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-black flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  id="btn-submit-upload-reel"
                >
                  <Video className="w-4 h-4" />
                  <span>{isUploading ? 'Memproses Video...' : 'Publikasikan ke AgroReels'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
