export type JavaProvince = 
  | 'Jawa Timur'
  | 'Jawa Tengah'
  | 'Jawa Barat'
  | 'DI Yogyakarta'
  | 'DKI Jakarta'
  | 'Banten';

export interface JavaCity {
  id: string;
  name: string;
  province: JavaProvince;
  district?: string;
  shippingBaseCost: number; // in IDR
  deliveryTimeDays: string;
  isLumajang?: boolean;
}

export interface LumajangDistrict {
  id: string;
  name: string;
  specialty: string;
  shippingBaseCost: number;
  deliveryEstimate: string;
  isMountainArea: boolean; // Lereng Semeru or Pesisir Selatan
}

export type ProductCategory = 
  | 'semua'
  | 'buah'
  | 'sayur'
  | 'peternakan'
  | 'susu_telur'
  | 'preorder';

export interface Farmer {
  id: string;
  name: string;
  farmName: string;
  avatar: string;
  city: string;
  province: JavaProvince;
  district: string;
  rating: number;
  totalSales: number;
  isOnline: boolean;
  verifiedBadge: boolean;
  videoCallAvailable: boolean;
  description: string;
  poktanName?: string; // Kelompok Tani Lumajang
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  userCity: string;
  rating: number;
  date: string;
  comment: string;
  productQuality: 'Sangat Segar' | 'Segar' | 'Manis Alami' | 'Sesuai Deskripsi';
  images?: string[];
  farmerReply?: string;
  helpfulCount: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'buah' | 'sayur' | 'peternakan' | 'susu_telur';
  subCategory: string;
  farmer: Farmer;
  pricePerUnit: number;
  unit: string; // 'kg', 'ikat', 'liter', 'pack', 'butir'
  minOrder: number;
  supermarketPrice: number; // comparison price in retail supermarkets
  traditionalMarketPrice: number;
  stock: number;
  images: string[];
  harvestTimeAgo: string; // e.g. "Dipetik tadi pagi 05:30 WIB"
  harvestDate: string;
  isPreOrder?: boolean;
  preOrderEstimatedHarvest?: string;
  preOrderQuota?: number;
  preOrderBooked?: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  discountPercentage?: number;
  tags: string[];
  description: string;
  storageTips: string;
  originLocation: string; // e.g. "Senduro, Lereng Semeru Lumajang"
  district?: string;
}

export interface MarketPriceData {
  id: string;
  commodityName: string;
  category: 'sayur' | 'buah' | 'peternakan';
  unit: string;
  agrogoPrice: number;
  traditionalMarketPrice: number;
  supermarketPrice: number;
  priceChangePercent: number; // e.g. -4.5 (turun) or +6.2 (naik)
  trend: 'naik' | 'turun' | 'stabil';
  updatedAt: string;
  farmerRecommendation: string;
  marketSource: string; // e.g. "Pasar Serunai & Pasar Pasirian Lumajang"
}

export interface FruitHarvestCalendar {
  id: string;
  fruitName: string;
  variety: string;
  region: string;
  province: JavaProvince;
  harvestPeakMonth: string;
  harvestStatus: 'Sedang Panen Raya' | 'Akan Panen (1-2 Minggu)' | 'Musim Berbunga';
  estimatedDaysToHarvest: number;
  subscribersCount: number;
  image: string;
  sweetnessBrix: string;
  isLumajangSpecialty?: boolean;
}

export interface AgroReel {
  id: string;
  farmer: Farmer;
  product: Product;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  likes: number;
  views: number;
  commentsCount: number;
  harvestHighlight: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 
  | 'qris' 
  | 'va_bca' 
  | 'va_mandiri' 
  | 'va_bri' 
  | 'va_bankjatim' 
  | 'gopay' 
  | 'ovo' 
  | 'shopeepay' 
  | 'cod';

export interface OrderTrackingStep {
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
  location: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  totalAmount: number;
  shippingCost: number;
  discountAmount: number;
  pointsRedeemed: number;
  pointsEarned: number;
  destinationCity: string;
  destinationDistrict?: string;
  destinationAddress: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Lunas' | 'Menunggu Pembayaran' | 'COD (Bayar ke Kurir)';
  shippingStatus: 'Dikemas' | 'Truk Pendingin Tol Trans-Jawa' | 'Kurir AgroGo Lumajang Mengantar' | 'Selesai';
  temperatureCelsius?: number; // cold chain tracking
  courierName: string;
  courierPhone: string;
  courierPhoto?: string;
  vehicleType?: string;
  vehiclePlate: string;
  courierRating?: number;
  courierTripsCount?: number;
  liveGpsLocation?: string;
  estimatedArrival: string;
  trackingSteps: OrderTrackingStep[];
  isPreOrder?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'buyer' | 'farmer';
  text: string;
  timestamp: string;
  productAttachment?: Product;
}

export interface AppNotification {
  id: string;
  type: 'market_price' | 'harvest_time' | 'order_update' | 'regional_discount' | 'video_call' | 'premium_early_access';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  discountCode?: string;
}

// User Profile & Authentication
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'farmer';
  district: string; // Kecamatan di Lumajang
  address: string;
  isPremium: boolean;
  premiumTier?: 'Sultan Lumajang';
  premiumExpiry?: string;
  points: number;
  avatar: string;
  referralCode: string;
  hasStore?: boolean;
  storeName?: string;
  storeCategory?: string;
  storePhoto?: string;
  farmerDetails?: {
    farmName: string;
    poktanName: string; // Nama Kelompok Tani
    nik: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    balance: number; // Saldo petani yang bisa ditarik
  };
}

// Withdrawal / Pencairan Saldo Petani (5% Fee)
export interface WithdrawalRecord {
  id: string;
  date: string;
  grossAmount: number;
  adminFee: number; // 5% fee
  netAmount: number;
  destinationBank: string;
  accountNumber: string;
  accountHolder: string;
  status: 'Berhasil Ditransfer' | 'Sedang Diproses' | 'Dibatalkan';
  receiptRef: string;
}

// Sponsor Ads in App
export interface SponsoredAd {
  id: string;
  title: string;
  sponsor: string;
  tagline: string;
  imageUrl: string;
  badge: 'Bersponsor' | 'Iklan Mitra Tani' | 'Dinas Pertanian Lumajang';
  ctaText: string;
}
