import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  MapPin,
  Search,
  ShoppingCart,
  Bell,
  Sun,
  Moon,
  Gift,
  Film,
  TrendingUp,
  Calendar,
  Sparkles,
  ChevronDown,
  UserCheck,
  Store,
  Compass,
  Crown,
  User,
  LogOut,
  X,
  ArrowRight,
} from 'lucide-react';
import { Logo } from './Logo';
import { JavaCity, UserProfile, LumajangDistrict, Product } from '../../types';
import { LUMAJANG_DISTRICTS, JAVA_CITIES } from '../../data/mockData';

export interface HeaderProps {
  currentCity: JavaCity;
  onSelectCity: (city: JavaCity) => void;
  selectedDistrict: LumajangDistrict;
  onSelectDistrict: (district: LumajangDistrict) => void;
  currentUser: UserProfile;
  onOpenAuth: () => void;
  onOpenPremium: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
  cartCount?: number;
  onOpenCart: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  darkMode?: boolean;
  isDarkMode?: boolean;
  onToggleDarkMode: () => void;
  userPoints?: number;
  onOpenReferral: () => void;
  onOpenReels: () => void;
  onOpenMarketPrice?: () => void;
  onOpenMarketPrices?: () => void;
  onOpenHarvestCalendar: () => void;
  isFarmerMode?: boolean;
  onToggleFarmerMode: () => void;
  onOpenOrders?: () => void;
  onOpenTracking?: () => void;
  onOpenStore?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onSelectCity,
  selectedDistrict,
  onSelectDistrict,
  currentUser,
  onOpenAuth,
  onOpenPremium,
  searchQuery = '',
  onSearchChange,
  products = [],
  onSelectProduct,
  cartCount = 0,
  onOpenCart,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  darkMode,
  isDarkMode,
  onToggleDarkMode,
  userPoints = 0,
  onOpenReferral,
  onOpenReels,
  onOpenMarketPrice,
  onOpenMarketPrices,
  onOpenHarvestCalendar,
  isFarmerMode = false,
  onToggleFarmerMode,
  onOpenOrders,
  onOpenTracking,
  onOpenStore,
  onLogout,
}) => {
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const matchedProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q || !products) return [];
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.farmer.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subCategory.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [searchQuery, products]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const effectiveDarkMode = darkMode ?? isDarkMode ?? false;
  const handleMarketPrice = onOpenMarketPrices || onOpenMarketPrice || (() => {});
  const handleOrders = onOpenTracking || onOpenOrders || (() => {});

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors shadow-xs">
      
      {/* Top Micro Bar focused on Lumajang, Jawa Timur */}
      <div className="bg-[#244F1F] dark:bg-emerald-950 text-emerald-100 text-xs py-1.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded-full bg-emerald-800/80 text-[11px] text-amber-300 border border-emerald-700/60">
              <Compass className="w-3 h-3 text-amber-300" />
              Sentra Petani & Peternak Lumajang
            </span>
            <span className="hidden md:inline text-stone-200 text-xs">
              Langsung dari Petani Lereng Semeru & Pesisir Lumajang ke Dapur Anda • Garansi 100% Segar
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {currentUser.isPremium ? (
              <button
                onClick={onOpenPremium}
                className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-bold cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>👑 Sultan Lumajang (Bebas Iklan Aktif)</span>
              </button>
            ) : (
              <button
                onClick={onOpenPremium}
                className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-bold cursor-pointer animate-pulse"
              >
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                <span>Upgrade Sultan (Bebas Iklan & Gratis Ongkir)</span>
              </button>
            )}

            <span className="text-emerald-400/40">|</span>

            <button
              onClick={onOpenReferral}
              className="hover:text-amber-300 transition-colors flex items-center gap-1 font-medium cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-semibold text-amber-300">Voucher Pengguna Baru Rp 25rb</span>
            </button>

            <span className="text-emerald-400/40 hidden sm:inline">|</span>

            <button
              onClick={handleOrders}
              className="hover:text-white transition-colors cursor-pointer font-medium hidden sm:inline"
            >
              Lacak Pengiriman
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Lumajang District Selector */}
          <div className="flex items-center gap-3">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="cursor-pointer">
              <Logo size="md" />
            </button>

            {/* Lumajang Specific District Selector (Kecamatan di Lumajang) */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowDistrictDropdown(!showDistrictDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-200 transition-all cursor-pointer"
                id="district-selector-btn"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="max-w-[140px] truncate">Kec. {selectedDistrict.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${showDistrictDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDistrictDropdown && (
                <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl shadow-xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-2 border-b border-stone-100 dark:border-stone-800 text-xs">
                    <p className="font-extrabold text-stone-900 dark:text-stone-100">
                      Pilih Kecamatan di Kab. Lumajang
                    </p>
                    <p className="text-stone-500 text-[11px]">
                      Ongkir & estimasi pengantaran instan disesuaikan
                    </p>
                  </div>

                  <div className="max-h-72 overflow-y-auto py-1 text-xs space-y-1">
                    {LUMAJANG_DISTRICTS.map((dist) => (
                      <button
                        key={dist.id}
                        onClick={() => {
                          onSelectDistrict(dist);
                          setShowDistrictDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                          dist.id === selectedDistrict.id
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold'
                            : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold truncate">Kec. {dist.name}</p>
                          <p className="text-[10px] text-stone-400 truncate">{dist.specialty}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 block">
                            Rp {dist.shippingBaseCost.toLocaleString('id-ID')}
                          </span>
                          <span className="text-[9px] text-stone-400 block">
                            {dist.deliveryEstimate.split(' ')[0]}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Input with Interactive Dropdown & Auto-Scroll */}
          <div ref={searchContainerRef} className="flex-1 max-w-md mx-1 sm:mx-2 relative">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <input
                type="text"
                placeholder="Cari pisang kirana, susu senduro, telur herbal..."
                value={searchQuery}
                onFocus={() => setShowSearchDropdown(true)}
                onChange={(e) => {
                  onSearchChange?.(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setShowSearchDropdown(false);
                    const target = document.getElementById('catalog-products-section');
                    target?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-stone-100 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800 dark:text-stone-100 placeholder-stone-400 transition-all shadow-inner"
                id="main-search-input"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange?.('');
                    setShowSearchDropdown(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-400 hover:text-stone-600 cursor-pointer"
                  title="Hapus pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Quick Results Dropdown */}
            {showSearchDropdown && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] font-bold text-stone-500">
                  <span>Hasil Cepat "{searchQuery}"</span>
                  <span>{matchedProducts.length} Ditemukan</span>
                </div>

                <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-64 overflow-y-auto">
                  {matchedProducts.length > 0 ? (
                    matchedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          setShowSearchDropdown(false);
                          if (onSelectProduct) {
                            onSelectProduct(prod);
                          } else {
                            const target = document.getElementById('catalog-products-section');
                            target?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="p-2.5 flex items-center justify-between gap-3 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-9 h-9 rounded-xl object-cover border border-emerald-500/40 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-extrabold text-xs text-stone-900 dark:text-stone-100 truncate">
                              {prod.name}
                            </p>
                            <p className="text-[10px] text-stone-500 truncate">
                              {prod.farmer.name} • Kec. {prod.district || prod.farmer.district}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-black text-xs text-emerald-700 dark:text-emerald-400 block">
                            Rp {prod.pricePerUnit.toLocaleString('id-ID')}
                          </span>
                          <span className="text-[9px] text-stone-400">/{prod.unit}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-stone-500 space-y-1">
                      <p className="font-bold text-stone-700 dark:text-stone-300">
                        Tidak ada komoditas dengan kata kunci "{searchQuery}"
                      </p>
                      <p className="text-[11px]">
                        Coba ketik kata umum: <strong>telur, daging sapi, pisang, susu, atau beras</strong>
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowSearchDropdown(false);
                    const target = document.getElementById('catalog-products-section');
                    target?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-t border-stone-100 dark:border-stone-800"
                >
                  <span>Buka Semua Hasil di Katalog Panen</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* AgroReels Button */}
            <button
              onClick={onOpenReels}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
              id="btn-reels-top"
            >
              <Film className="w-3.5 h-3.5 animate-bounce" />
              <span>AgroReels</span>
            </button>

            {/* Market Price Modal Trigger */}
            <button
              onClick={handleMarketPrice}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 transition-colors cursor-pointer"
              title="Pantau Harga Pasar Lumajang Real-Time"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Harga Pasar</span>
            </button>

            {/* Harvest Calendar */}
            <button
              onClick={onOpenHarvestCalendar}
              className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-xs font-semibold text-stone-700 dark:text-stone-200 transition-colors cursor-pointer"
              title="Jadwal Panen Raya Lumajang"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>Jadwal Panen</span>
            </button>

            {/* Farmer / Buyer Mode Toggle Button */}
            <button
              onClick={onToggleFarmerMode}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                isFarmerMode
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:border-emerald-500'
              }`}
              id="btn-toggle-farmer-mode"
              title={isFarmerMode ? 'Kembali ke Mode Pembeli' : 'Beralih ke Portal Petani Lumajang'}
            >
              {isFarmerMode ? (
                <>
                  <Store className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Mode Petani</span>
                  <span className="sm:hidden">Petani</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden sm:inline">Mode Pembeli</span>
                  <span className="sm:hidden">Beli</span>
                </>
              )}
            </button>

            {/* User Account / Profile Button */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-xs font-bold cursor-pointer transition-colors"
                id="user-account-btn"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden border border-emerald-500 shrink-0">
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                </div>
                <span className="hidden sm:inline truncate max-w-[90px]">{currentUser.name.split(' ')[0]}</span>
                {currentUser.isPremium && (
                  <Crown className="w-3 h-3 text-amber-500 shrink-0" />
                )}
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl shadow-xl p-3 z-50 text-xs space-y-2">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100 dark:border-stone-800">
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="font-bold text-stone-900 dark:text-stone-100 truncate flex items-center gap-1">
                        {currentUser.name}
                        {currentUser.isPremium && <Crown className="w-3 h-3 text-amber-500" />}
                      </p>
                      <p className="text-[10px] text-stone-400 truncate">{currentUser.email}</p>
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        Kec. {currentUser.district}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenPremium();
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-amber-500" />
                        Status Sultan Lumajang
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-800 text-stone-900 dark:text-amber-100 font-black">
                        {currentUser.isPremium ? 'Aktif' : 'Upgrade'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenReferral();
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold flex items-center justify-between cursor-pointer text-stone-700 dark:text-stone-300"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        AgroPoints & Referral
                      </span>
                      <span className="font-bold text-amber-600">
                        {userPoints.toLocaleString('id-ID')} Poin
                      </span>
                    </button>

                    {/* Fitur Buka Toko di APK AgroGo */}
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        if (onOpenStore) {
                          onOpenStore();
                        } else {
                          onToggleFarmerMode();
                        }
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 font-extrabold flex items-center justify-between cursor-pointer border border-emerald-300 dark:border-emerald-700/60 transition-colors"
                      id="profile-open-store-btn"
                    >
                      <span className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>{currentUser.hasStore || currentUser.role === 'farmer' ? '🏪 Toko Saya (Kelola Produk)' : '🏪 Buka Toko di APK AgroGo'}</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-700 text-white font-bold">
                        {currentUser.hasStore || currentUser.role === 'farmer' ? 'Buka' : 'Gratis'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenAuth();
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold flex items-center gap-1.5 cursor-pointer text-stone-700 dark:text-stone-300"
                    >
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      Ganti Akun / Profil Demo
                    </button>

                    {onLogout && (
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onLogout();
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 font-semibold flex items-center gap-1.5 cursor-pointer text-red-600 dark:text-red-400 border-t border-stone-100 dark:border-stone-800 pt-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Keluar dari Akun
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              aria-label="Ubah tema"
              id="dark-mode-toggle-btn"
            >
              {effectiveDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              id="notifications-btn"
              aria-label="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#244F1F] dark:bg-emerald-600 hover:bg-[#1E411A] dark:hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
              id="cart-drawer-trigger-btn"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Keranjang</span>
              {cartCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-stone-900 font-extrabold text-[11px]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile District Selector Bar */}
        <div className="flex md:hidden items-center justify-between pt-2 mt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
          <div className="flex items-center gap-1 text-stone-600 dark:text-stone-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-stone-900 dark:text-stone-100 truncate max-w-[170px]">
              Kec. {selectedDistrict.name} (Lumajang)
            </span>
          </div>
          <button
            onClick={() => setShowDistrictDropdown(true)}
            className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
          >
            Ganti Kecamatan
          </button>
        </div>
      </div>
    </header>
  );
};
