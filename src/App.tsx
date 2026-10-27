import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  TrendingDown,
  ShieldCheck,
  Video,
  Play,
  Calendar,
  Truck,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Clock,
  MapPin,
  Tag,
  Star,
  ArrowRight,
  RefreshCw,
  Bell,
  Heart,
  ChevronRight,
  TrendingUp,
  Crown,
  Gift,
  Zap,
  Store,
  X,
} from 'lucide-react';

// Domain Types
import {
  Product,
  CartItem,
  JavaCity,
  Order,
  AppNotification,
  Farmer,
  UserProfile,
  LumajangDistrict,
} from './types';

// Mock Data
import {
  JAVA_CITIES,
  LUMAJANG_DISTRICTS,
  PRODUCTS,
  INITIAL_NOTIFICATIONS,
  MARKET_PRICES,
  AGRO_REELS,
  DEMO_USERS,
  REVIEWS,
  FARMERS,
} from './data/mockData';

// Components
import { Header } from './components/common/Header';
import { RegionalDiscountBanner } from './components/common/RegionalDiscountBanner';
import { ProductCard } from './components/products/ProductCard';
import { ProductDetailModal } from './components/products/ProductDetailModal';
import { VideoCallModal } from './components/videocall/VideoCallModal';
import { AgroReelsModal } from './components/reels/AgroReelsModal';
import { MarketPriceTicker } from './components/market/MarketPriceTicker';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderTrackingModal } from './components/tracking/OrderTrackingModal';
import { LiveChatModal } from './components/chat/LiveChatModal';
import { HarvestCalendarModal } from './components/harvest/HarvestCalendarModal';
import { ReferralModal } from './components/referral/ReferralModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { WelcomeAuthGate } from './components/auth/WelcomeAuthGate';
import { OpenStoreModal } from './components/profile/OpenStoreModal';
import { PremiumModal } from './components/premium/PremiumModal';
import { SponsoredAdBanner } from './components/ads/SponsoredAdBanner';
import { LumajangNatureShowcase } from './components/nature/LumajangNatureShowcase';

export default function App() {
  // Theme & Mode State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFarmerMode, setIsFarmerMode] = useState(false);

  // User Profile (Initialized to Premium Buyer "Salsa Tahara" as requested)
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS.premiumBuyer);

  // Region State (Focused specifically on Kabupaten Lumajang, Jawa Timur)
  const [currentCity, setCurrentCity] = useState<JavaCity>(JAVA_CITIES[0]); // Lumajang Pusat
  const [selectedDistrict, setSelectedDistrict] = useState<LumajangDistrict>(LUMAJANG_DISTRICTS[0]); // Senduro

  // Product Catalog & Inventory
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('semua');
  const [sortBy, setSortBy] = useState<'termurah' | 'terdekat' | 'rating'>('terdekat');

  // Cart & Orders State
  const [cart, setCart] = useState<CartItem[]>([
    { product: PRODUCTS[0], quantity: 2 }, // Telur Herbal Sukodono
    { product: PRODUCTS[1], quantity: 2 }, // Susu Murni Senduro
    { product: PRODUCTS[2], quantity: 1 }, // Pisang Mas Kirana IG
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-lum-01',
      orderNumber: 'AGR-LUM-2026-9812',
      createdAt: 'Hari ini, 08:30 WIB',
      items: [
        { product: PRODUCTS[0], quantity: 2 },
        { product: PRODUCTS[1], quantity: 1 },
      ],
      totalAmount: 63000,
      shippingCost: 0, // Free shipping for Sultan member
      discountAmount: 10000,
      pointsRedeemed: 0,
      pointsEarned: 1260,
      destinationCity: 'Kab. Lumajang, Jawa Timur',
      destinationDistrict: 'Lumajang Kota',
      destinationAddress: 'Jl. Alun-Alun No. 18, RT 02/RW 04, Lumajang Kota',
      customerName: 'Salsa Tahara',
      customerPhone: '0812-8899-2341',
      paymentMethod: 'qris',
      paymentStatus: 'Lunas',
      shippingStatus: 'Kurir AgroGo Lumajang Mengantar',
      temperatureCelsius: 3.8,
      courierName: 'Wahyu Prasetyo (Kurir AgroGo Lumajang)',
      courierPhone: '0878-3344-9021',
      courierPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      vehicleType: 'Motor Box Termal Cold-Chain (Suhu 2-4°C Sayur & Daging)',
      vehiclePlate: 'N 1945 AG (Lumajang)',
      courierRating: 4.98,
      courierTripsCount: 1842,
      liveGpsLocation: 'Jl. Gatot Subroto - 2.1 km lagi',
      estimatedArrival: 'Hari ini (25 Menit lagi - Tiba 10:15 WIB)',
      trackingSteps: [
        {
          title: 'Pesanan Diterima & Verifikasi Pembayaran',
          description: 'Pembayaran QRIS terverifikasi instan tanpa biaya admin tambahan.',
          timestamp: '08:30 WIB',
          completed: true,
          current: false,
          location: 'Koperasi Senduro & Sukodono Lumajang',
        },
        {
          title: 'Petik Segar & Packing Dingin (Cold-Chain 3.8°C)',
          description: 'Telur diambil jam 05:00 subuh & susu murni dimasukkan ke insulated thermal box.',
          timestamp: '09:00 WIB',
          completed: true,
          current: false,
          location: 'Sentra Pangan Sukodono & Senduro',
        },
        {
          title: 'Kurir AgroGo Lumajang Mengantar',
          description: 'Kurir melintasi jalur Jl. Lintas Timur menuju alamat penerima.',
          timestamp: '09:40 WIB',
          completed: false,
          current: true,
          location: 'Jl. Gatot Subroto Lumajang',
        },
        {
          title: 'Pesanan Tiba & Verifikasi Kesegaran',
          description: 'Konsumen memverifikasi kondisi kesegaran telur dan susu.',
          timestamp: 'Estimasi 10:15 WIB',
          completed: false,
          current: false,
          location: 'Jl. Alun-Alun No. 18, Lumajang Kota',
        },
      ],
    },
  ]);

  // Points & Vouchers
  const [userPoints, setUserPoints] = useState(currentUser.points || 4500);
  const [appliedPromoCode, setAppliedPromoCode] = useState('LUMAJANGSEGAR');
  const [hasClaimedReferral, setHasClaimedReferral] = useState(true);
  const [subscribedFruits, setSubscribedFruits] = useState<string[]>([
    'Pisang Mas Kirana Lumajang',
    'Durian Ranu Klakah Lumajang',
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Modals visibility states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeVideoCallProduct, setActiveVideoCallProduct] = useState<Product | null>(null);
  const [isReelsOpen, setIsReelsOpen] = useState(false);
  const [initialReelId, setInitialReelId] = useState<string | undefined>(undefined);
  const [isMarketTickerOpen, setIsMarketTickerOpen] = useState(false);
  const [isHarvestCalendarOpen, setIsHarvestCalendarOpen] = useState(false);
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatFarmer, setActiveChatFarmer] = useState<Farmer>(PRODUCTS[0].farmer);
  const [activeChatProduct, setActiveChatProduct] = useState<Product | undefined>(PRODUCTS[0]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isOpenStoreModalOpen, setIsOpenStoreModalOpen] = useState(false);

  // Authentication Gate State (Step required before entering web app)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Checkout summary state
  const [checkoutSummary, setCheckoutSummary] = useState<{
    items: CartItem[];
    subtotal: number;
    shippingCost: number;
    discountAmount: number;
    pointsRedeemed: number;
    finalTotal: number;
    voucherApplied: string;
  } | null>(null);

  // Sync dark mode class on HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle Cart Operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Farmer operations
  const handleAddNewProduct = (newProd: Partial<Product>) => {
    const created: Product = {
      id: `p-${Date.now()}`,
      name: newProd.name || 'Hasil Panen Baru Lumajang',
      category: newProd.category || 'buah',
      pricePerUnit: newProd.pricePerUnit || 18000,
      unit: newProd.unit || 'kg',
      traditionalMarketPrice: newProd.traditionalMarketPrice || 22000,
      supermarketPrice: newProd.supermarketPrice || 28000,
      stock: newProd.stock || 50,
      rating: 5.0,
      reviewCount: 0,
      harvestTimeAgo: newProd.harvestTimeAgo || 'Dipetik Subuh Tadi',
      harvestDate: 'Hari ini',
      soldCount: 0,
      subCategory: 'Komoditas Unggulan Lumajang',
      farmer: PRODUCTS[0].farmer,
      originLocation: newProd.originLocation || `${selectedDistrict.name}, Kab. Lumajang`,
      district: newProd.district || selectedDistrict.name,
      isPreOrder: newProd.isPreOrder || false,
      preOrderEstimatedHarvest: newProd.preOrderEstimatedHarvest,
      preOrderQuota: newProd.preOrderQuota,
      preOrderBooked: 0,
      images: newProd.images || ['/src/assets/images/lumajang_fresh_eggs_1792595225732.jpg'],
      tags: newProd.tags || ['Petik Segar Lumajang', `Khas ${selectedDistrict.name}`],
      description: newProd.description || 'Hasil panen segar langsung dari kebun petani Kabupaten Lumajang.',
      storageTips: newProd.storageTips || 'Simpan di tempat sejuk terlindung sinar matahari langsung.',
      minOrder: 1,
    };

    setProducts((prev) => [created, ...prev]);
  };

  const handleUpdateProductPrice = (productId: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, pricePerUnit: newPrice } : p))
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['shippingStatus']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, shippingStatus: status } : o))
    );
  };

  // Referral bonus claim
  const handleClaimReferralBonus = (points: number, voucherCode: string) => {
    setUserPoints((prev) => prev + points);
    setAppliedPromoCode(voucherCode);
    setHasClaimedReferral(true);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'regional_discount',
        title: 'Referral Berhasil Diklaim!',
        message: `Selamat, voucher diskon Rp 25.000 (${voucherCode}) & bonus +${points} Poin telah ditambahkan.`,
        timestamp: 'Baru saja',
        read: false,
        discountCode: voucherCode,
      },
      ...prev,
    ]);
  };

  // Fruit harvest notification toggle
  const handleToggleFruitNotification = (fruitName: string) => {
    setSubscribedFruits((prev) => {
      const exists = prev.includes(fruitName);
      if (exists) {
        return prev.filter((f) => f !== fruitName);
      } else {
        setNotifications((n) => [
          {
            id: `notif-fruit-${Date.now()}`,
            type: 'harvest_time',
            title: `Pengingat Panen Lumajang: ${fruitName}`,
            message: `Kamu akan mendapatkan notifikasi push prioritas 24 jam sebelum panen ${fruitName} dipublikasikan.`,
            timestamp: 'Baru saja',
            read: false,
          },
          ...n,
        ]);
        return [...prev, fruitName];
      }
    });
  };

  // Handle Initial Registration & Login from Welcome Gate
  const handleInitialAuthenticate = (user: UserProfile) => {
    setCurrentUser(user);
    setUserPoints(user.points);
    if (user.role === 'farmer' || user.hasStore) {
      setIsFarmerMode(true);
    } else {
      setIsFarmerMode(false);
    }
    const foundDistrict = LUMAJANG_DISTRICTS.find((d) => d.name === user.district);
    if (foundDistrict) {
      setSelectedDistrict(foundDistrict);
    }
    setIsAuthenticated(true);
  };

  // Handle Login & Profile Switch
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setUserPoints(user.points);
    if (user.role === 'farmer' || user.hasStore) {
      setIsFarmerMode(true);
    } else {
      setIsFarmerMode(false);
    }
    // Match district
    const foundDistrict = LUMAJANG_DISTRICTS.find(d => d.name === user.district);
    if (foundDistrict) {
      setSelectedDistrict(foundDistrict);
    }
  };

  // Toggle Premium Status
  const handleTogglePremium = (active: boolean) => {
    setCurrentUser((prev) => ({
      ...prev,
      isPremium: active,
      premiumTier: active ? 'Sultan Lumajang' : undefined,
    }));
  };

  // Filtered Products computation with multi-field search (nama, kategori, tag, peternak, dll)
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products
      .filter((p) => {
        const matchesCategory =
          activeCategory === 'semua'
            ? true
            : activeCategory === 'preorder'
            ? p.isPreOrder
            : p.category === activeCategory;

        const matchesQuery =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.farmer.name.toLowerCase().includes(q) ||
          p.farmer.farmName.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          p.originLocation.toLowerCase().includes(q) ||
          (p.district && p.district.toLowerCase().includes(q));

        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'termurah') return a.pricePerUnit - b.pricePerUnit;
        if (sortBy === 'rating') return b.rating - a.rating;
        // default 'terdekat': sort matching district first
        const aNearby = (a.district === selectedDistrict.name) ? 1 : 0;
        const bNearby = (b.district === selectedDistrict.name) ? 1 : 0;
        return bNearby - aNearby;
      });
  }, [products, activeCategory, searchQuery, sortBy, selectedDistrict]);

  // Matching Farmers / Sellers based on search query (misal ketik 'telur' -> muncul peternak telur)
  const matchingFarmers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return FARMERS.filter((f) => {
      const matchDirect =
        f.name.toLowerCase().includes(q) ||
        f.farmName.toLowerCase().includes(q) ||
        f.poktanName.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.district.toLowerCase().includes(q);

      const matchProduct = products.some(
        (p) =>
          p.farmer.id === f.id &&
          (p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.subCategory.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q)))
      );

      return matchDirect || matchProduct;
    });
  }, [searchQuery, products]);

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  // STEP REQUIRED BEFORE ENTERING WEB: Welcome Account Creation Gate
  if (!isAuthenticated) {
    return <WelcomeAuthGate onAuthenticate={handleInitialAuthenticate} />;
  }

  return (
    <div className="min-h-screen bg-[#FBFDF9] dark:bg-[#111611] text-stone-900 dark:text-stone-100 transition-colors duration-200 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navigation Header */}
      <Header
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        currentCity={currentCity}
        onSelectCity={setCurrentCity}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenPremium={() => setIsPremiumModalOpen(true)}
        onOpenStore={() => setIsOpenStoreModalOpen(true)}
        onLogout={() => setIsAuthenticated(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        userPoints={userPoints}
        isDarkMode={isDarkMode}
        darkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isFarmerMode={isFarmerMode}
        onToggleFarmerMode={() => setIsFarmerMode(!isFarmerMode)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMarketPrices={() => setIsMarketTickerOpen(true)}
        onOpenMarketPrice={() => setIsMarketTickerOpen(true)}
        onOpenHarvestCalendar={() => setIsHarvestCalendarOpen(true)}
        onOpenReels={() => setIsReelsOpen(true)}
        onOpenReferral={() => setIsReferralOpen(true)}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenOrders={() => {
          if (orders.length > 0) {
            setActiveTrackingOrder(orders[0]);
            setIsTrackingOpen(true);
          }
        }}
        onOpenTracking={() => {
          if (orders.length > 0) {
            setActiveTrackingOrder(orders[0]);
            setIsTrackingOpen(true);
          }
        }}
        unreadNotificationsCount={unreadNotifCount}
      />

      {/* Sponsored Ads (Visible only for non-premium users, hidden for Sultan members!) */}
      <SponsoredAdBanner
        isPremium={currentUser.isPremium}
        onOpenPremium={() => setIsPremiumModalOpen(true)}
      />

      {/* Mode View Switcher: Farmer Dashboard vs. Consumer Marketplace */}
      {isFarmerMode ? (
        <FarmerDashboard
          products={products}
          orders={orders}
          onAddNewProduct={handleAddNewProduct}
          onUpdateProductPrice={handleUpdateProductPrice}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onAcceptSimulatedCall={(prod) => setActiveVideoCallProduct(prod)}
        />
      ) : (
        <main className="flex-1 space-y-6 pb-24">
          
          {/* Regional Discount & Special Local Deals Banner for Lumajang */}
          <RegionalDiscountBanner
            currentCity={currentCity}
            selectedDistrict={selectedDistrict}
            onOpenReferral={() => setIsReferralOpen(true)}
            onApplyRegionalDiscount={(code) => {
              setAppliedPromoCode(code);
              setIsCartOpen(true);
            }}
          />

          {/* 3D & KEKINIAN HERO SECTION: HASIL BUMI LUMAJANG (KEMILAU SEMERU) */}
          <section className="max-w-7xl mx-auto px-3 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B4317] via-[#22571D] to-[#163612] text-white p-5 sm:p-8 lg:p-10 shadow-2xl border border-emerald-700/50">
              
              {/* Background Landscape: Pemandangan Alam Asri Cerah Tumpak Sewu & Semeru */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src="/src/assets/images/lumajang_nature_tumpak_sewu_1792597521623.jpg"
                  alt="Keindahan Alam Tumpak Sewu & Semeru Lumajang"
                  className="w-full h-full object-cover object-center scale-105 opacity-70 dark:opacity-55 filter brightness-110 saturate-140 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#143611]/90 via-[#184614]/75 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#122e0f]/90 via-transparent to-black/15" />
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Hero Text Zone */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/30 text-amber-300 text-xs font-black uppercase tracking-wider shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                    <span>Hasil Bumi Asli Lumajang • Alam Asri Semeru • 100% Petik Segar</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
                    E-Commerce Hasil Pertanian Lumajang,{' '}
                    <span className="text-amber-300 underline decoration-amber-400 decoration-wavy underline-offset-6">
                      Langsung Petik Subuh
                    </span>
                  </h1>

                  <p className="text-xs sm:text-base text-emerald-100/95 leading-relaxed max-w-xl font-normal drop-shadow-xs">
                    Daging Sapi Gandik Segar merah merona RPH Senduro, Susu Sapi Murni lereng Semeru, Pisang Mas Kirana bersertifikat IG, Telur Herbal Sukodono, dan Salak Pronojiwo. Pantau harga pasar induk, inspeksi kualitas via <strong>Live Video Call</strong> sebelum beli, dan nikmati pengantaran instan se-Kabupaten Lumajang!
                  </p>

                  {/* Hero Quick Action Buttons */}
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    <button
                      onClick={() => {
                        const target = document.getElementById('catalog-products-section');
                        target?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:shadow-amber-400/20 transition-all cursor-pointer active:scale-95"
                      id="hero-explore-produce-btn"
                    >
                      <Sparkles className="w-4 h-4 text-stone-900" />
                      <span>Belanja Panen Hari Ini</span>
                    </button>

                    <button
                      onClick={() => setActiveVideoCallProduct(products[0])}
                      className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs sm:text-sm backdrop-blur-md border border-white/30 flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-md"
                      id="hero-live-inspection-btn"
                    >
                      <Video className="w-4 h-4 text-amber-300" />
                      <span>Coba Video Call Petani (Live)</span>
                    </button>

                    <button
                      onClick={() => setIsMarketTickerOpen(true)}
                      className="px-4 py-2.5 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 font-bold text-xs sm:text-sm border border-emerald-500/40 flex items-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <TrendingDown className="w-4 h-4 text-amber-300" />
                      <span>Pantau Harga Pasar Induk</span>
                    </button>
                  </div>
                </div>

                {/* 3D Modern Glassmorphic Spotlight Cards with Colorful Accents */}
                <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                  
                  {/* Spotlight 1: Telur Herbal Sukodono */}
                  <div
                    onClick={() => setSelectedProduct(products[0])}
                    className="group relative p-3.5 rounded-3xl bg-white/15 dark:bg-black/40 backdrop-blur-md border border-white/25 hover:border-amber-400/90 transition-all cursor-pointer shadow-lg hover:-translate-y-1 duration-200"
                  >
                    <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-2 border border-white/20 shadow-xs">
                      <img
                        src="/src/assets/images/lumajang_fresh_eggs_1792595225732.jpg"
                        alt="Telur Herbal Sukodono"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-[9px] shadow-sm">
                        Sukodono
                      </span>
                    </div>
                    <p className="font-extrabold text-xs text-white truncate group-hover:text-amber-300">
                      Telur Herbal Omega-3
                    </p>
                    <p className="text-[11px] font-black text-amber-300 mt-0.5">
                      Rp 24.500 <span className="text-[9px] font-normal text-stone-300">/kg</span>
                    </p>
                  </div>

                  {/* Spotlight 2: Susu Murni Senduro */}
                  <div
                    onClick={() => setSelectedProduct(products[1])}
                    className="group relative p-3.5 rounded-3xl bg-white/15 dark:bg-black/40 backdrop-blur-md border border-white/25 hover:border-amber-400/90 transition-all cursor-pointer shadow-lg hover:-translate-y-1 duration-200"
                  >
                    <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-2 border border-white/20 shadow-xs">
                      <img
                        src="/src/assets/images/lumajang_senduro_milk_1792595226961.jpg"
                        alt="Susu Sapi Senduro"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white font-black text-[9px] shadow-sm">
                        Senduro
                      </span>
                    </div>
                    <p className="font-extrabold text-xs text-white truncate group-hover:text-amber-300">
                      Susu Pasteurisasi Semeru
                    </p>
                    <p className="text-[11px] font-black text-amber-300 mt-0.5">
                      Rp 14.000 <span className="text-[9px] font-normal text-stone-300">/liter</span>
                    </p>
                  </div>

                  {/* Spotlight 3: Pisang Mas Kirana IG Tempursari */}
                  <div
                    onClick={() => setSelectedProduct(products[2])}
                    className="group relative p-3.5 rounded-3xl bg-white/15 dark:bg-black/40 backdrop-blur-md border border-white/25 hover:border-amber-400/90 transition-all cursor-pointer shadow-lg hover:-translate-y-1 duration-200"
                  >
                    <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-2 border border-white/20 shadow-xs">
                      <img
                        src="/src/assets/images/lumajang_pisang_kirana_1792595227784.jpg"
                        alt="Pisang Mas Kirana"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-black text-[9px] shadow-sm">
                        Sertifikat IG
                      </span>
                    </div>
                    <p className="font-extrabold text-xs text-white truncate group-hover:text-amber-300">
                      Pisang Mas Kirana
                    </p>
                    <p className="text-[11px] font-black text-amber-300 mt-0.5">
                      Rp 18.000 <span className="text-[9px] font-normal text-stone-300">/sisir</span>
                    </p>
                  </div>

                  {/* Spotlight 4: Daging Sapi Segar Merah RPH Senduro */}
                  <div
                    onClick={() => setSelectedProduct(products[4])}
                    className="group relative p-3.5 rounded-3xl bg-white/15 dark:bg-black/40 backdrop-blur-md border border-white/25 hover:border-amber-400/90 transition-all cursor-pointer shadow-lg hover:-translate-y-1 duration-200"
                  >
                    <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-2 border border-white/20 shadow-xs">
                      <img
                        src="/src/assets/images/lumajang_fresh_red_beef_1792597522221.jpg"
                        alt="Daging Sapi Gandik Segar RPH Senduro"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-red-600 text-white font-black text-[9px] shadow-sm">
                        Merah Segar
                      </span>
                    </div>
                    <p className="font-extrabold text-xs text-white truncate group-hover:text-amber-300">
                      Daging Sapi Gandik Segar
                    </p>
                    <p className="text-[11px] font-black text-amber-300 mt-0.5">
                      Rp 115.000 <span className="text-[9px] font-normal text-stone-300">/kg</span>
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </section>

          {/* Real-time Market Price Comparison Ticker Strip (Pasar Serunai & Pasar Pasirian) */}
          <section className="max-w-7xl mx-auto px-3 sm:px-6">
            <div
              onClick={() => setIsMarketTickerOpen(true)}
              className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-amber-100/70 transition-colors shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shrink-0">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs sm:text-sm text-amber-950 dark:text-amber-100">
                      Pantauan Harga Pasar Induk Lumajang Real-Time:
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-700 text-white animate-pulse">
                      Hemat s.d 40%
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-900/80 dark:text-amber-300 mt-0.5">
                    Data terkini Pasar Serunai Lumajang, Pasar Pasirian, dan Pasar Hewan Senduro. Beli langsung dari petani tanpa biaya perantara.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-amber-900 dark:text-amber-200">
                <span>Lihat Selisih Harga Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </section>

          {/* Shoppable Reels Bar preview (TikTok/Reels Style) */}
          <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <h3 className="font-black text-base sm:text-lg text-stone-900 dark:text-stone-100">
                  AgroReels: Video Suasana Panen Lumajang Hari Ini
                </h3>
              </div>
              <button
                onClick={() => setIsReelsOpen(true)}
                className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Tonton Semua Reels</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {AGRO_REELS.map((reel) => (
                <div
                  key={reel.id}
                  onClick={() => {
                    setInitialReelId(reel.id);
                    setIsReelsOpen(true);
                  }}
                  className="group relative h-48 sm:h-52 rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-stone-200 dark:border-stone-800"
                >
                  <img
                    src={reel.thumbnail}
                    alt={reel.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Play badge */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1.5 border border-white/20">
                    <Play className="w-3 h-3 text-amber-300 fill-amber-300" />
                    <span>{reel.views.toLocaleString('id-ID')} Penonton</span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white space-y-1">
                    <p className="font-extrabold text-xs sm:text-sm line-clamp-1 group-hover:text-amber-300 transition-colors">
                      {reel.title}
                    </p>
                    <p className="text-[10px] text-stone-300 line-clamp-1">
                      {reel.farmer.name} • {reel.farmer.district}, Lumajang
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PESONA ALAM & EKOSISTEM PANEN ASLI LUMAJANG (Pembeda Eksklusif AgroGo) */}
          <LumajangNatureShowcase
            onSelectDistrict={(districtName) => {
              const matched = LUMAJANG_DISTRICTS.find((d) => d.name.toLowerCase() === districtName.toLowerCase());
              if (matched) {
                setSelectedDistrict(matched);
              }
            }}
            onFilterCategory={(cat) => {
              setActiveCategory(cat);
            }}
          />

          {/* Search, Filter & Product Catalog Section */}
          <section id="catalog-products-section" className="max-w-7xl mx-auto px-3 sm:px-6 space-y-5 pt-2">
            
            {/* Search & Sort Controls */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                {/* Search Bar with Instant Clear */}
                <div className="relative flex-1 max-w-lg">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <input
                    type="text"
                    placeholder="Ketik produk atau peternak (contoh: telur, daging sapi, pisang, susu, beras)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-stone-900 border-2 border-emerald-500/30 focus:border-emerald-500 dark:border-stone-800 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-sm transition-all"
                    id="product-search-input"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 cursor-pointer"
                      title="Hapus pencarian"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sort Selector */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <SlidersHorizontal className="w-4 h-4 text-stone-400" />
                  <span className="text-xs text-stone-500 font-semibold">Urutkan:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 font-bold focus:outline-none cursor-pointer shadow-xs"
                    id="sort-products-select"
                  >
                    <option value="terdekat">Terdekat ke Kec. {selectedDistrict.name}</option>
                    <option value="termurah">Harga Petani Termurah</option>
                    <option value="rating">Rating Petani Tertinggi</option>
                  </select>
                </div>
              </div>

              {/* Quick Search Shortcut Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                <span className="text-[11px] font-bold text-stone-400 shrink-0">Cepat Cari:</span>
                {[
                  { label: '🥚 Telur Herbal', query: 'telur' },
                  { label: '🥩 Daging Sapi Senduro', query: 'daging sapi' },
                  { label: '🥛 Susu Segar', query: 'susu' },
                  { label: '🍌 Pisang Kirana', query: 'pisang' },
                  { label: '🌶️ Cabai Rawit', query: 'cabai' },
                  { label: '🌾 Beras Organik', query: 'beras' },
                  { label: '🍗 Ayam Kampung', query: 'ayam' },
                  { label: '☕ Kopi Semeru', query: 'kopi' },
                  { label: '🍵 Teh Kertowono', query: 'teh' },
                  { label: '🍯 Madu Hutan', query: 'madu' },
                  { label: '🥑 Salak Pronojiwo', query: 'salak' },
                ].map((pill) => (
                  <button
                    key={pill.query}
                    onClick={() => {
                      setSearchQuery(pill.query);
                      setActiveCategory('semua');
                    }}
                    className={`shrink-0 px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer border ${
                      searchQuery.toLowerCase() === pill.query
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 text-[11px]'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* HASIL PENCARIAN PENJUAL & PETANI TERKAIT (Ketika menulis 'telur', muncul penjual telur dll) */}
            {searchQuery.trim().length > 0 && matchingFarmers.length > 0 && (
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-stone-900 dark:to-emerald-950/30 border-2 border-emerald-300 dark:border-emerald-700 shadow-md space-y-3 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 uppercase tracking-wider">
                        Mitra Penjual & Peternak Terkait "{searchQuery}"
                      </h4>
                      <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                        Ditemukan <strong>{matchingFarmers.length} mitra tani</strong> siap melayani panen segar
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-1 rounded-full self-start sm:self-auto">
                    ✓ Garansi Langsung dari Tangan Pertama
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {matchingFarmers.map((farmer) => (
                    <div
                      key={farmer.id}
                      className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-800 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={farmer.avatar}
                          alt={farmer.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h5 className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-stone-100 truncate">
                              {farmer.name}
                            </h5>
                            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                              {farmer.rating}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 truncate">
                            {farmer.farmName}
                          </p>
                          <span className="inline-block text-[10px] text-stone-500 font-medium">
                            📍 Kec. {farmer.district}, Lumajang
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed bg-stone-50 dark:bg-stone-800/50 p-2 rounded-xl">
                        {farmer.description}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800 text-[11px]">
                        <span className="text-stone-500 font-medium">
                          {farmer.totalSales.toLocaleString('id-ID')} pesanan
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              const relatedProd = products.find((p) => p.farmer.id === farmer.id);
                              setActiveChatFarmer(farmer);
                              if (relatedProd) setActiveChatProduct(relatedProd);
                              setIsChatOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold hover:bg-emerald-200 cursor-pointer"
                          >
                            Chat WA
                          </button>
                          <button
                            onClick={() => {
                              const relatedProd = products.find((p) => p.farmer.id === farmer.id);
                              if (relatedProd) {
                                setSelectedProduct(relatedProd);
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer"
                          >
                            Lihat Toko
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category Filter Buttons with Vibrant Colorful Themed Gradients */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                {
                  id: 'semua',
                  label: '🌾 Semua Hasil Bumi Lumajang',
                  activeClass: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-400',
                  inactiveClass: 'hover:border-emerald-400/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200',
                },
                {
                  id: 'buah',
                  label: '🍌 Buah Tropis (Pisang IG & Durian)',
                  activeClass: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md shadow-amber-500/25 ring-2 ring-amber-300',
                  inactiveClass: 'hover:border-amber-400/50 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-950 dark:text-amber-200',
                },
                {
                  id: 'susu_telur',
                  label: '🥛 Susu Senduro & Telur Herbal',
                  activeClass: 'bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-600 text-white shadow-md shadow-sky-500/25 ring-2 ring-sky-300',
                  inactiveClass: 'hover:border-sky-400/50 hover:bg-sky-50 dark:hover:bg-sky-950/30 text-sky-950 dark:text-sky-200',
                },
                {
                  id: 'sayur',
                  label: '🥬 Sayuran Hijau Dataran Tinggi',
                  activeClass: 'bg-gradient-to-r from-emerald-500 via-lime-600 to-green-600 text-white shadow-md shadow-lime-500/25 ring-2 ring-lime-300',
                  inactiveClass: 'hover:border-lime-400/50 hover:bg-lime-50 dark:hover:bg-lime-950/30 text-lime-950 dark:text-lime-200',
                },
                {
                  id: 'peternakan',
                  label: '🥩 Daging Sapi Merah & Ayam Segar',
                  activeClass: 'bg-gradient-to-r from-rose-500 via-red-600 to-rose-700 text-white shadow-md shadow-rose-500/25 ring-2 ring-rose-300',
                  inactiveClass: 'hover:border-rose-400/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-950 dark:text-rose-200',
                },
                {
                  id: 'preorder',
                  label: '⏳ Pre-Order Panen Terjadwal',
                  activeClass: 'bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-600 text-white shadow-md shadow-purple-500/25 ring-2 ring-purple-300',
                  inactiveClass: 'hover:border-purple-400/50 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-purple-950 dark:text-purple-200',
                },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
                    activeCategory === cat.id
                      ? `${cat.activeClass} border-transparent`
                      : `bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 ${cat.inactiveClass}`
                  }`}
                  id={`cat-btn-${cat.id}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-3">
                <p className="font-bold text-stone-700 dark:text-stone-300">
                  Tidak ada hasil panen yang cocok dengan pencarian "{searchQuery}" di wilayah Lumajang.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('semua');
                  }}
                  className="text-xs text-emerald-700 dark:text-emerald-400 font-bold underline cursor-pointer"
                >
                  Reset Filter & Tampilkan Semua Hasil Bumi
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetail={(p) => setSelectedProduct(p)}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    onStartVideoCall={(p) => setActiveVideoCallProduct(p)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Social Proof & Customer Trust Reviews Section for Lumajang */}
          <section className="max-w-7xl mx-auto px-3 sm:px-6 pt-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-500 font-black text-xs uppercase tracking-wider">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>Ulasan Pelanggan Terverifikasi Kabupaten Lumajang</span>
                  </div>
                  <h3 className="font-black text-xl sm:text-2xl text-stone-900 dark:text-stone-100 mt-1">
                    Dipercaya Ribuan Warga & Restoran di Jawa Timur
                  </h3>
                  <p className="text-xs text-stone-500">
                    Transparansi penuh tanpa tengkulak dengan jaminan kesegaran sampai dapur
                  </p>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-center">
                    <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">4.95</p>
                    <p className="text-[10px] text-stone-500 font-bold">dari 5.0 Bintang</p>
                  </div>
                  <div className="border-l border-emerald-200 dark:border-emerald-800 pl-3">
                    <p className="text-xs font-black text-stone-900 dark:text-stone-100">100% Petani Lumajang Asli</p>
                    <p className="text-[11px] text-stone-500">Garansi ganti baru jika tidak segar</p>
                  </div>
                </div>
              </div>

              {/* Verified Reviews Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {REVIEWS.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/80 space-y-2.5 text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2.5">
                        <img src={rev.userAvatar} alt={rev.userName} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <h4 className="font-extrabold text-stone-900 dark:text-stone-100">{rev.userName}</h4>
                          <p className="text-[10px] text-stone-500">📍 {rev.userCity}</p>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-stone-600 dark:text-stone-300 leading-relaxed italic">
                      "{rev.comment}"
                    </p>

                    {rev.farmerReply && (
                      <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] text-emerald-800 dark:text-emerald-300">
                        <span className="font-bold block">Respon Petani:</span>
                        <span>{rev.farmerReply}</span>
                      </div>
                    )}

                    <span className="text-[10px] text-stone-400 block pt-1 border-t border-stone-200 dark:border-stone-700">
                      {rev.date} • Kualitas: <strong>{rev.productQuality}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Floating Quick Action Dock */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-1.5 rounded-full bg-stone-900/95 dark:bg-white/95 backdrop-blur-md shadow-2xl border border-stone-700/50 text-white dark:text-stone-900">
        <button
          onClick={() => setIsCartOpen(true)}
          className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
          id="floating-cart-btn"
        >
          <span>Keranjang</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white text-emerald-800 text-[10px] font-black">
            {cart.reduce((a, b) => a + b.quantity, 0)}
          </span>
        </button>

        <button
          onClick={() => {
            if (orders.length > 0) {
              setActiveTrackingOrder(orders[0]);
              setIsTrackingOpen(true);
            }
          }}
          className="px-3.5 py-2 rounded-full hover:bg-stone-800 dark:hover:bg-stone-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          id="floating-tracking-btn"
        >
          <Truck className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
          <span>Lacak Kiriman</span>
        </button>

        <button
          onClick={() => {
            setActiveChatProduct(products[0]);
            setActiveChatFarmer(products[0].farmer);
            setIsChatOpen(true);
          }}
          className="px-3.5 py-2 rounded-full hover:bg-stone-800 dark:hover:bg-stone-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          id="floating-chat-btn"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-700" />
          <span>Chat Petani</span>
        </button>
      </div>

      {/* Modals & Drawers */}

      {/* Authentication Modal (Buyer & Farmer Login/Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Premium Membership Modal (AgroGo Sultan Lumajang) */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        currentUser={currentUser}
        onTogglePremium={handleTogglePremium}
      />

      {/* Modal Pendaftaran Buka Toko Mitra Tani di APK AgroGo */}
      <OpenStoreModal
        isOpen={isOpenStoreModalOpen}
        onClose={() => setIsOpenStoreModalOpen(false)}
        currentUser={currentUser}
        onStoreCreated={(updatedUser) => {
          setCurrentUser(updatedUser);
          setIsFarmerMode(true);
          const foundDistrict = LUMAJANG_DISTRICTS.find(d => d.name === updatedUser.district);
          if (foundDistrict) {
            setSelectedDistrict(foundDistrict);
          }
          setNotifications((prev) => [
            {
              id: `notif-${Date.now()}`,
              type: 'order_update',
              title: `🎉 Toko Berhasil Dibuka: ${updatedUser.storeName}`,
              message: `Selamat! Toko hasil panenmu di Kecamatan ${updatedUser.district} telah aktif. Kamu sekarang dapat mengunggah komoditas dagangan dan melayani video call pembeli.`,
              timestamp: 'Baru saja',
              read: false,
            },
            ...prev,
          ]);
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty) => handleAddToCart(p, qty)}
        onStartVideoCall={(p) => {
          setSelectedProduct(null);
          setActiveVideoCallProduct(p);
        }}
        onOpenChat={(p) => {
          setSelectedProduct(null);
          setActiveChatProduct(p);
          setActiveChatFarmer(p.farmer);
          setIsChatOpen(true);
        }}
      />

      {/* Live Video Call Modal */}
      <VideoCallModal
        product={activeVideoCallProduct}
        isOpen={!!activeVideoCallProduct}
        onClose={() => setActiveVideoCallProduct(null)}
        onAddToCart={(p, qty) => handleAddToCart(p, qty || 1)}
        onInstantBuy={(p, qty) => handleAddToCart(p, qty || 1)}
        onOpenChat={(p) => {
          setActiveVideoCallProduct(null);
          setActiveChatProduct(p);
          setActiveChatFarmer(p.farmer);
          setIsChatOpen(true);
        }}
      />

      {/* Shoppable AgroReels Modal */}
      <AgroReelsModal
        isOpen={isReelsOpen}
        onClose={() => setIsReelsOpen(false)}
        reels={AGRO_REELS}
        initialReelId={initialReelId}
        onAddToCart={(prod) => handleAddToCart(prod, 1)}
        onOpenProductDetail={(prod) => setSelectedProduct(prod)}
        onStartVideoCall={(prod) => {
          setIsReelsOpen(false);
          setActiveVideoCallProduct(prod);
        }}
        isSubscribed={currentUser.isPremium}
      />

      {/* Real-time Market Price Comparison Ticker Modal */}
      <MarketPriceTicker
        isOpen={isMarketTickerOpen}
        onClose={() => setIsMarketTickerOpen(false)}
        marketPrices={MARKET_PRICES}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        currentCity={currentCity}
        selectedDistrict={selectedDistrict}
        isPremium={currentUser.isPremium}
        userPoints={userPoints}
        appliedPromoCode={appliedPromoCode}
        onSetAppliedPromoCode={setAppliedPromoCode}
        onOpenCheckout={(summary) => {
          setCheckoutSummary(summary);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Integrated Secure Digital Payment & COD Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        summary={checkoutSummary}
        currentCity={currentCity}
        selectedDistrict={selectedDistrict}
        currentUser={currentUser}
        onOrderSuccess={(createdOrder) => {
          setOrders((prev) => [createdOrder, ...prev]);
          setActiveTrackingOrder(createdOrder);
          setIsTrackingOpen(true);
          handleClearCart();
          setUserPoints((prev) => prev + createdOrder.pointsEarned);
          setNotifications((prev) => [
            {
              id: `notif-${Date.now()}`,
              type: 'order_update',
              title: `Pesanan Baru #${createdOrder.orderNumber}`,
              message: `Pesanan hasil panenmu sedang disiapkan dan dikemas dingin (Cold-Chain) di Lumajang. Terima kasih telah mendukung petani lokal!`,
              timestamp: 'Baru saja',
              read: false,
            },
            ...prev,
          ]);
        }}
      />

      {/* Real-Time Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        order={activeTrackingOrder}
        onContactDriver={(name) => {
          alert(`Menghubungi Kurir Kilat AgroGo Lumajang: ${name}`);
        }}
      />

      {/* Real-Time Buyer - Farmer Live Chat */}
      <LiveChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        product={activeChatProduct}
        farmer={activeChatFarmer}
        onStartVideoCall={(p) => setActiveVideoCallProduct(p)}
      />

      {/* Seasonal Fruit Harvest Calendar & Notification Modal */}
      <HarvestCalendarModal
        isOpen={isHarvestCalendarOpen}
        onClose={() => setIsHarvestCalendarOpen(false)}
        onSubscribeNotification={handleToggleFruitNotification}
        subscribedFruits={subscribedFruits}
      />

      {/* Referral & AgroPoints Modal */}
      <ReferralModal
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
        userPoints={userPoints}
        onClaimReferralBonus={handleClaimReferralBonus}
        hasClaimedReferral={hasClaimedReferral}
      />

      {/* Real-Time Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onNotificationClick={(notif) => {
          if (notif.type === 'market_price') {
            setIsMarketTickerOpen(true);
          } else if (notif.type === 'harvest_time') {
            setIsHarvestCalendarOpen(true);
          } else if (notif.type === 'order_update' && orders.length > 0) {
            setActiveTrackingOrder(orders[0]);
            setIsTrackingOpen(true);
          } else if (notif.type === 'regional_discount') {
            setIsCartOpen(true);
          } else if (notif.type === 'premium_early_access') {
            setIsPremiumModalOpen(true);
          }
          setIsNotificationOpen(false);
        }}
      />
    </div>
  );
}
