import React, { useState } from 'react';
import {
  Store,
  TrendingUp,
  Package,
  Plus,
  Video,
  UploadCloud,
  Play,
  Film,
  Eye,
  Heart,
  CheckCircle2,
  AlertCircle,
  Truck,
  Sparkles,
  DollarSign,
  Users,
  Clock,
  MapPin,
  CreditCard,
  Building,
  HelpCircle,
  ArrowDownLeft,
  FileText,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Product, MarketPriceData, Order, WithdrawalRecord } from '../../types';
import { MARKET_PRICES, LUMAJANG_DISTRICTS, INITIAL_WITHDRAWALS } from '../../data/mockData';

interface FarmerDashboardProps {
  products: Product[];
  orders: Order[];
  onAddNewProduct: (product: Partial<Product>) => void;
  onUpdateProductPrice: (productId: string, newPrice: number) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['shippingStatus']) => void;
  onAcceptSimulatedCall: (product: Product) => void;
  onAddNewReel?: (data: {
    title: string;
    description: string;
    videoUrl: string;
    thumbnail?: string;
    productId: string;
    harvestHighlight: string;
  }) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  products,
  orders,
  onAddNewProduct,
  onUpdateProductPrice,
  onUpdateOrderStatus,
  onAcceptSimulatedCall,
  onAddNewReel,
}) => {
  // Navigation tabs within Farmer Portal
  const [activeTab, setActiveTab] = useState<'catalog' | 'withdraw' | 'orders' | 'market' | 'reels'>('catalog');

  // Add Product Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<'sayur' | 'buah' | 'peternakan' | 'susu_telur'>('buah');
  const [newProductPrice, setNewProductPrice] = useState(18000);
  const [newProductUnit, setNewProductUnit] = useState('kg');
  const [newProductStock, setNewProductStock] = useState(150);
  const [newProductHarvestDate, setNewProductHarvestDate] = useState('Dipetik Subuh Tadi (05:30 WIB)');
  const [newProductDistrict, setNewProductDistrict] = useState('Senduro');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductImage, setNewProductImage] = useState('/src/assets/images/lumajang_fresh_eggs_1792595225732.jpg');
  const [isPreOrder, setIsPreOrder] = useState(false);
  const [preOrderDate, setPreOrderDate] = useState('3 Hari Lagi');
  const [preOrderQuota, setPreOrderQuota] = useState(50);

  // Farmer Balance & Withdrawal State (Bank General tanpa embel-embel daerah)
  const [farmerBalance, setFarmerBalance] = useState(14820000);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(INITIAL_WITHDRAWALS);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(3000000);
  const [selectedBank, setSelectedBank] = useState('Bank BRI');
  const [accountNumber, setAccountNumber] = useState('0281-9921-88');
  const [accountHolder, setAccountHolder] = useState('Slamet Hariyadi');
  const [withdrawSuccessToast, setWithdrawSuccessToast] = useState<string | null>(null);

  // Seller Reels Management State
  const [showUploadReelModal, setShowUploadReelModal] = useState(false);
  const [reelTitle, setReelTitle] = useState('');
  const [reelLinkedProductId, setReelLinkedProductId] = useState(products[0]?.id || 'p1');
  const [reelDescription, setReelDescription] = useState('');
  const [reelHighlight, setReelHighlight] = useState('Petik Subuh Lereng Semeru');
  const [reelDuration, setReelDuration] = useState('0:35');
  const [realVideoFile, setRealVideoFile] = useState<File | null>(null);
  const [realVideoPreview, setRealVideoPreview] = useState<string | null>(null);
  const farmerVideoInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploadingReel, setIsUploadingReel] = useState(false);
  const [reelUploadProgress, setReelUploadProgress] = useState(0);
  const [reelSuccessToast, setReelSuccessToast] = useState<string | null>(null);
  const [sellerReels, setSellerReels] = useState([
    {
      id: 'sr-1',
      title: 'Pemerahan Susu Sapi Segar Subuh 04:30 WIB di Senduro',
      productName: 'Susu Sapi Murni Pasteurisasi Senduro Semeru',
      views: 3420,
      likes: 642,
      ordersGenerated: 48,
      duration: '0:32',
      thumbnail: '/src/assets/images/lumajang_senduro_milk_1792595226961.jpg',
      status: 'Tayang di AgroReels',
    },
    {
      id: 'sr-2',
      title: 'Pemotongan Gandik Sapi Merah Segar Pilihan RPH Senduro',
      productName: 'Daging Sapi Segar Bagian Gandik (RPH Senduro)',
      views: 5890,
      likes: 1120,
      ordersGenerated: 86,
      duration: '0:45',
      thumbnail: '/src/assets/images/lumajang_fresh_red_beef_1792597522221.jpg',
      status: 'Tayang di AgroReels',
    },
    {
      id: 'sr-3',
      title: 'Panen Telur Ayam Kampung Herbal Bebas Antibiotik Sukodono',
      productName: 'Telur Ayam Herbal Omega-3 Sukodono',
      views: 4180,
      likes: 835,
      ordersGenerated: 62,
      duration: '0:28',
      thumbnail: '/src/assets/images/lumajang_fresh_eggs_1792595225732.jpg',
      status: 'Tayang di AgroReels',
    },
  ]);

  // 5% Admin Fee Calculation
  const adminFeeRate = 0.05;
  const currentAdminFee = Math.round(withdrawAmount * adminFeeRate);
  const currentNetAmount = withdrawAmount - currentAdminFee;

  // Curated Preset High-Definition Image Options for Easy Farmer Upload
  const imagePresets = [
    { label: 'Daging Sapi Merah Segar HD (RPH Senduro)', url: '/src/assets/images/lumajang_fresh_red_beef_1792597522221.jpg', cat: 'peternakan' },
    { label: 'Ayam Kampung Segar Potong HD', url: '/src/assets/images/lumajang_fresh_kampung_poultry_1792597522140.jpg', cat: 'peternakan' },
    { label: 'Telur Ayam Herbal Sukodono HD', url: '/src/assets/images/lumajang_fresh_eggs_1792595225732.jpg', cat: 'susu_telur' },
    { label: 'Susu Sapi Murni Senduro HD', url: '/src/assets/images/lumajang_senduro_milk_1792595226961.jpg', cat: 'susu_telur' },
    { label: 'Pisang Mas Kirana IG HD', url: '/src/assets/images/lumajang_pisang_kirana_1792595227784.jpg', cat: 'buah' },
    { label: 'Sayuran Brokoli Semeru', url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=800&q=80', cat: 'sayur' },
    { label: 'Salak Manis Pronojiwo', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80', cat: 'buah' },
    { label: 'Durian Ranu Klakah', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80', cat: 'buah' },
  ];

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    onAddNewProduct({
      name: newProductName,
      category: newProductCategory,
      pricePerUnit: Number(newProductPrice),
      unit: newProductUnit,
      stock: Number(newProductStock),
      harvestTimeAgo: newProductHarvestDate,
      originLocation: `${newProductDistrict}, Kab. Lumajang`,
      district: newProductDistrict,
      isPreOrder,
      preOrderEstimatedHarvest: isPreOrder ? preOrderDate : undefined,
      preOrderQuota: isPreOrder ? Number(preOrderQuota) : undefined,
      supermarketPrice: Math.round(Number(newProductPrice) * 1.6),
      traditionalMarketPrice: Math.round(Number(newProductPrice) * 1.25),
      images: [newProductImage],
      tags: ['Petik Segar Lumajang', `Khas ${newProductDistrict}`],
      description: newProductDescription || `Hasil panen segar langsung dari kebun petani di ${newProductDistrict}, Kabupaten Lumajang. Tanpa zat kimia berbahaya, garansi sampai dapur dalam keadaan prima.`,
      storageTips: 'Simpan di tempat sejuk terlindung sinar matahari langsung.',
      minOrder: 1,
    });

    setNewProductName('');
    setShowAddModal(false);
  };

  const handleProcessWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount > farmerBalance) {
      alert('Nominal penarikan melebihi saldo aktif Anda.');
      return;
    }
    if (withdrawAmount < 50000) {
      alert('Batas penarikan minimum adalah Rp 50.000.');
      return;
    }

    const newRecord: WithdrawalRecord = {
      id: `wd-${Date.now()}`,
      date: 'Hari ini (Baru saja)',
      grossAmount: withdrawAmount,
      adminFee: currentAdminFee,
      netAmount: currentNetAmount,
      destinationBank: selectedBank,
      accountNumber,
      accountHolder,
      status: 'Berhasil Ditransfer',
      receiptRef: `TRX-${selectedBank.slice(0, 3).toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`,
    };

    setFarmerBalance(prev => prev - withdrawAmount);
    setWithdrawals([newRecord, ...withdrawals]);
    setShowWithdrawModal(false);
    setWithdrawSuccessToast(`Penarikan dana bersih Rp ${currentNetAmount.toLocaleString('id-ID')} berhasil ditransfer ke ${selectedBank} (${accountNumber}) setelah potongan admin 5% (Rp ${currentAdminFee.toLocaleString('id-ID')}).`);
    setTimeout(() => setWithdrawSuccessToast(null), 6000);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* Toast Notification for Withdrawal Success */}
      {withdrawSuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-800 text-white shadow-xl border border-emerald-500/40 flex items-center justify-between gap-3 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold">{withdrawSuccessToast}</p>
          </div>
          <button onClick={() => setWithdrawSuccessToast(null)} className="text-emerald-200 hover:text-white font-bold text-xs cursor-pointer">
            Tutup
          </button>
        </div>
      )}

      {/* Header Mode Petani Lumajang */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#244F1F] via-[#2F6527] to-[#1E4319] text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-amber-400 text-stone-950 text-xs font-black uppercase tracking-wider">
              Portal Mitra Tani Kabupaten Lumajang
            </span>
            <span className="text-xs text-emerald-200">Mode Penjual Aktif</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black">
            Dashboard Penjualan Hasil Bumi Lumajang
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
            Kelola panen buah, sayur, susu, dan peternakan langsung dari kebun. Dapatkan harga jual lebih menguntungkan tanpa tengkulak, cairkan dana ke rekening, dan layani inspeksi live video call pembeli.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-900 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer transition-transform active:scale-95"
            id="farmer-withdraw-btn"
          >
            <CreditCard className="w-4 h-4 text-emerald-700" />
            <span>Tarik Saldo Petani</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer transition-transform active:scale-95"
            id="farmer-add-crop-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Unggah Barang Dagangan</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-[#244F1F] text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          Katalog Dagangan & Stok ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('withdraw')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'withdraw'
              ? 'bg-[#244F1F] text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 text-amber-400" />
          <span>Cara Petani Mengambil Uang (Admin 5%)</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-[#244F1F] text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Pesanan Masuk & Cold Chain ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('market')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'market'
              ? 'bg-[#244F1F] text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
          <span>Pantau Harga Pasar Lumajang</span>
        </button>
        <button
          onClick={() => setActiveTab('reels')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'reels'
              ? 'bg-[#244F1F] text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
          id="farmer-tab-reels-btn"
        >
          <Video className="w-3.5 h-3.5 text-pink-500" />
          <span>Cara Unggah Reels Panen ({sellerReels.length})</span>
        </button>
      </div>

      {/* Overview Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <p className="text-xs text-stone-500 font-semibold">Saldo Siap Ditarik</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
            Rp {farmerBalance.toLocaleString('id-ID')}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px]">
            <span className="text-stone-400">Biaya Admin: 5%</span>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              Cairkan &rarr;
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <p className="text-xs text-stone-500 font-semibold">Pesanan Masuk</p>
          <p className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
            {orders.length} Pesanan Aktif
          </p>
          <span className="text-[10px] text-amber-600 font-bold block mt-1">
            Armada Cold Chain Lumajang Standby
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <p className="text-xs text-stone-500 font-semibold">Inspeksi Live Video Call</p>
          <p className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            Tersedia (HD)
          </p>
          <span className="text-[10px] text-stone-400 block mt-1">
            Meningkatkan kepercayaan pembeli 95%
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <p className="text-xs text-stone-500 font-semibold">Penilaian Petani</p>
          <p className="text-xl sm:text-2xl font-black text-amber-500 mt-1">
            ⭐ 4.97 / 5.0
          </p>
          <span className="text-[10px] text-stone-400 block mt-1">
            Terverifikasi Kelompok Tani Lumajang
          </span>
        </div>
      </div>

      {/* TAB 1: KATALOG DAGANGAN (Menampilkan Foto Menarik HD Sesuai Keterangan) */}
      {activeTab === 'catalog' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-4 sm:p-6 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                Katalog Hasil Panen Petani Lumajang
              </h3>
              <p className="text-xs text-stone-500">
                Foto produk asli definisi tinggi (HD), harga langsung tanpa perantara, dan stok terkini.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Unggah Komoditas Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">Foto & Komoditas</th>
                  <th className="py-3 px-3">Kecamatan Asal</th>
                  <th className="py-3 px-3">Waktu Petik / Panen</th>
                  <th className="py-3 px-3">Harga Petani Langsung</th>
                  <th className="py-3 px-3">Perbandingan Swalayan</th>
                  <th className="py-3 px-3">Sisa Stok</th>
                  <th className="py-3 px-3">Inspeksi Video Call</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-stone-200 dark:border-stone-700 shadow-xs">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                          {prod.isPreOrder && (
                            <span className="absolute bottom-0 inset-x-0 bg-amber-500 text-stone-950 font-black text-[9px] text-center py-0.5 uppercase">
                              Pre-Order
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-extrabold text-stone-900 dark:text-stone-100 text-xs sm:text-sm">
                            {prod.name}
                          </p>
                          <span className="text-[10px] text-stone-400 font-medium">
                            Kategori: {prod.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-stone-700 dark:text-stone-300">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {prod.district || prod.originLocation}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-emerald-700 dark:text-emerald-400">
                      {prod.harvestTimeAgo}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-stone-900 dark:text-stone-100">
                          Rp {prod.pricePerUnit.toLocaleString('id-ID')}
                        </span>
                        <span className="text-stone-400 text-[10px]">/{prod.unit}</span>
                        <button
                          onClick={() => {
                            const val = prompt(`Ubah harga per ${prod.unit} untuk ${prod.name}:`, prod.pricePerUnit.toString());
                            if (val && !isNaN(Number(val))) {
                              onUpdateProductPrice(prod.id, Number(val));
                            }
                          }}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold hover:bg-emerald-200 cursor-pointer"
                        >
                          Ubah
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="text-stone-400 line-through">
                        Rp {prod.supermarketPrice.toLocaleString('id-ID')}
                      </span>
                      <span className="block text-[10px] text-emerald-600 font-bold">
                        Hemat {Math.round(((prod.supermarketPrice - prod.pricePerUnit) / prod.supermarketPrice) * 100)}%
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-bold text-stone-800 dark:text-stone-200">
                        {prod.stock} {prod.unit}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => onAcceptSimulatedCall(prod)}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
                      >
                        <Video className="w-3.5 h-3.5 text-amber-300" />
                        <span>Live Test</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CARA PETANI MENGAMBIL UANG & KETERANGAN BIAYA ADMIN 5% */}
      {activeTab === 'withdraw' && (
        <div className="space-y-6">
          {/* Detailed explanation banner for 5% Admin Fee */}
          <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500 text-stone-950 shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-sm sm:text-base text-amber-950 dark:text-amber-100">
                  Panduan & Ketentuan Biaya Admin 5% Pengambilan Uang Hasil Penjualan Petani
                </h4>
                <p className="text-xs text-amber-900/90 dark:text-amber-200 leading-relaxed">
                  Untuk setiap penarikan dana dari hasil penjualan panen ke rekening bank atau e-wallet petani, dikenakan <strong>biaya administrasi platform sebesar 5%</strong>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px] text-amber-800 dark:text-amber-300">
                  <div className="p-2.5 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-amber-200 dark:border-amber-800">
                    <span className="font-bold block text-stone-900 dark:text-stone-100">1. Cold-Chain Logistik</span>
                    Menjaga suhu armada pendingin 2-4°C agar susu & sayur tetap segar.
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-amber-200 dark:border-amber-800">
                    <span className="font-bold block text-stone-900 dark:text-stone-100">2. Server Live Video Call</span>
                    Kapasitas bandwidth HD tanpa lag untuk inspeksi produk sebelum bayar.
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-amber-200 dark:border-amber-800">
                    <span className="font-bold block text-stone-900 dark:text-stone-100">3. Asuransi Rusak di Jalan</span>
                    Ganti rugi 100% jika hasil panen rusak selama pengantaran.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Balance & Instant Withdraw Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-900 to-[#193a15] text-white space-y-4 shadow-lg md:col-span-1">
              <span className="text-xs text-emerald-200 uppercase tracking-wider font-semibold">
                Dompet Hasil Panen
              </span>
              <div>
                <p className="text-3xl font-black text-amber-300">
                  Rp {farmerBalance.toLocaleString('id-ID')}
                </p>
                <p className="text-xs text-emerald-200/80 mt-1">
                  Saldo bersih setelah dikurangi potongan transaksi penjualan
                </p>
              </div>

              <button
                onClick={() => setShowWithdrawModal(true)}
                className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-sm shadow-md cursor-pointer transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>Tarik Dana Sekarang</span>
              </button>

              <div className="pt-2 border-t border-emerald-800 text-[11px] text-emerald-200/90 space-y-1">
                <p>• Minimum penarikan: Rp 50.000</p>
                <p>• Estimasi pencairan: 1 - 5 Menit (Instan BI-FAST / E-Wallet)</p>
                <p>• Rekening Terdaftar: Bank Jatim / BRI Cabang Lumajang</p>
              </div>
            </div>

            {/* Withdrawal History Table */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                    Riwayat Pengambilan Uang Petani
                  </h4>
                  <p className="text-xs text-stone-500">
                    Daftar transfer dana hasil panen lengkap dengan rincian biaya admin 5%
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-2">Tanggal & Ref</th>
                      <th className="py-2.5 px-2">Bank Tujuan</th>
                      <th className="py-2.5 px-2">Nominal Kotor</th>
                      <th className="py-2.5 px-2">Biaya Admin (5%)</th>
                      <th className="py-2.5 px-2">Diterima Bersih</th>
                      <th className="py-2.5 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {withdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                        <td className="py-3 px-2">
                          <p className="font-bold text-stone-900 dark:text-stone-100">{w.date}</p>
                          <span className="text-[10px] text-stone-400 font-mono">{w.receiptRef}</span>
                        </td>
                        <td className="py-3 px-2">
                          <p className="font-semibold text-stone-800 dark:text-stone-200">{w.destinationBank}</p>
                          <p className="text-[10px] text-stone-400">{w.accountNumber} ({w.accountHolder})</p>
                        </td>
                        <td className="py-3 px-2 font-semibold text-stone-700 dark:text-stone-300">
                          Rp {w.grossAmount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-2 text-red-600 font-semibold">
                          - Rp {w.adminFee.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-2 font-black text-emerald-700 dark:text-emerald-400">
                          Rp {w.netAmount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {w.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PESANAN MASUK & STATUS COLD-CHAIN */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-4 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                Kelola Pesanan Masuk Pembeli
              </h3>
              <p className="text-xs text-stone-500">
                Pantau pesanan yang harus dipetik subuh dan dimasukkan ke box berpendingin
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-stone-900 dark:text-stone-100">
                      Pesanan #{ord.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                      {ord.paymentStatus}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    Pembeli: <strong>{ord.customerName}</strong> ({ord.customerPhone}) • Alamat: {ord.destinationAddress}
                  </p>
                  <p className="text-xs text-stone-500">
                    Item: {ord.items.map(it => `${it.product.name} (${it.quantity} ${it.product.unit})`).join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">Total Transaksi</span>
                    <span className="font-black text-emerald-700 dark:text-emerald-400 text-sm">
                      Rp {ord.totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <select
                    value={ord.shippingStatus}
                    onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any)}
                    className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-bold text-stone-800 dark:text-stone-200 cursor-pointer"
                  >
                    <option value="Dikemas">1. Dikemas di Kebun</option>
                    <option value="Truk Pendingin Tol Trans-Jawa">2. Truk Pendingin Cold Chain</option>
                    <option value="Kurir AgroGo Lumajang Mengantar">3. Kurir Lokal Mengantar</option>
                    <option value="Selesai">4. Selesai (Diterima)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PANTAU HARGA PASAR REAL-TIME */}
      {activeTab === 'market' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80">
            <h4 className="font-black text-sm text-amber-900 dark:text-amber-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>Pembaruan Harga Pasar Induk Lumajang Real-Time</span>
            </h4>
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
              Data harga disinkronkan harian dari Pasar Serunai Lumajang, Pasar Pasirian, dan Pasar Senduro untuk membantu petani menentukan strategi harga terbaik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MARKET_PRICES.map((mp) => (
              <div
                key={mp.id}
                className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-stone-900 dark:text-stone-100 text-xs sm:text-sm">
                    {mp.commodityName}
                  </span>
                  <span className={`text-xs font-bold ${mp.trend === 'naik' ? 'text-red-500' : 'text-emerald-600'}`}>
                    {mp.trend === 'naik' ? `▲ +${mp.priceChangePercent}%` : `▼ ${mp.priceChangePercent}%`}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 text-[11px] text-center">
                  <div>
                    <span className="text-stone-400 block text-[10px]">AgroGo</span>
                    <span className="font-black text-emerald-700 dark:text-emerald-400">Rp {mp.agrogoPrice.toLocaleString('id-ID')}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Pasar Tradisional</span>
                    <span className="font-semibold text-stone-700 dark:text-stone-300">Rp {mp.traditionalMarketPrice.toLocaleString('id-ID')}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Supermarket</span>
                    <span className="font-semibold text-stone-500">Rp {mp.supermarketPrice.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-500 leading-relaxed pt-1">
                  {mp.farmerRecommendation}
                </p>
                <span className="text-[10px] text-stone-400 block">
                  Sumber: {mp.marketSource}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CARA UNGGAH REELS & VIDEO PANEN UNTUK PENJUAL */}
      {activeTab === 'reels' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fitur AgroReels Mitra Penjual</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black">
                Cara Unggah Video Reels Panen Lumajang
              </h3>
              <p className="text-xs sm:text-sm text-pink-100 max-w-xl leading-relaxed">
                Tampilkan kesegaran nyata hasil panen dan peternakan Anda lewat video vertikal (9:16). Pembeli dapat langsung memesan produk dari video yang Anda unggah!
              </p>
            </div>

            <button
              onClick={() => setShowUploadReelModal(true)}
              className="px-5 py-3 rounded-2xl bg-white text-stone-900 hover:bg-stone-100 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl cursor-pointer transition-transform active:scale-95 flex-shrink-0"
              id="btn-open-upload-reels-modal"
            >
              <UploadCloud className="w-4 h-4 text-pink-600" />
              <span>Unggah Reels Sekarang</span>
            </button>
          </div>

          {/* Success Toast */}
          {reelSuccessToast && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center justify-between animate-fade-in shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{reelSuccessToast}</span>
              </div>
              <button
                onClick={() => setReelSuccessToast(null)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* 4 Panduan Praktis Cara Unggah Reels yang Sukses */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Film className="w-4 h-4 text-pink-500" />
                <span>Panduan 4 Langkah Mengunggah Video Reels untuk Penjual</span>
              </h4>
              <span className="text-xs text-stone-500">Tips Konversi Penjualan Tinggi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2 relative overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-950/80 text-pink-600 dark:text-pink-400 font-black text-sm flex items-center justify-center">
                  1
                </div>
                <h5 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                  Rekam Vertikal (9:16)
                </h5>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Gunakan posisi HP tegak dengan durasi ideal 15–45 detik. Rekam saat panen subuh (05:00–07:00 WIB) saat embun masih menempel untuk membuktikan kesegaran asli.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2 relative overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-black text-sm flex items-center justify-center">
                  2
                </div>
                <h5 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                  Tautkan Produk Toko
                </h5>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Pilih produk yang sedang ditampilkan dalam video (misal: Susu Senduro atau Daging Sapi Gandik). Tombol keranjang belanja otomatis terpasang di video Anda.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2 relative overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 font-black text-sm flex items-center justify-center">
                  3
                </div>
                <h5 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                  Beri Judul & Lokasi Kebun
                </h5>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Tuliskan judul yang menarik disertai nama kecamatan (contoh: <em>"Petik Pisang Mas Kirana Manis Tempursari"</em>). Tambahkan tagar #PanenLumajang.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2 relative overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-black text-sm flex items-center justify-center">
                  4
                </div>
                <h5 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                  Tayang & Terima Pesanan
                </h5>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Setelah diunggah, video Anda langsung tayang di menu AgroReels beranda pembeli se-Lumajang. Notifikasi pesanan akan masuk otomatis setiap ada yang checkout.
                </p>
              </div>
            </div>
          </div>

          {/* Daftar Reels Toko Saya yang Sedang Tayang */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-sm sm:text-base text-stone-900 dark:text-stone-100">
                  Daftar Reels Toko Anda yang Sedang Tayang ({sellerReels.length})
                </h4>
                <p className="text-xs text-stone-500">
                  Statistik penonton, suka, dan pesanan yang dihasilkan dari setiap video reels panen Anda.
                </p>
              </div>
              <button
                onClick={() => setShowUploadReelModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Video Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sellerReels.map((reel) => (
                <div
                  key={reel.id}
                  className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-[9/12] w-full bg-stone-900 overflow-hidden">
                    <img
                      src={reel.thumbnail}
                      alt={reel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                    
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      <span>{reel.status}</span>
                    </span>

                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white font-mono text-[10px]">
                      {reel.duration}
                    </span>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <p className="font-black text-xs line-clamp-2 drop-shadow-md">
                        {reel.title}
                      </p>
                      <p className="text-[10px] text-amber-300 font-semibold mt-1">
                        🛍️ Produk: {reel.productName}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 dark:bg-stone-800/60 border-t border-stone-200 dark:border-stone-800 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Dilihat</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center justify-center gap-1">
                        <Eye className="w-3 h-3 text-stone-400" />
                        {reel.views.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block">Suka</span>
                      <span className="font-bold text-rose-600 flex items-center justify-center gap-1">
                        <Heart className="w-3 h-3 fill-rose-600" />
                        {reel.likes.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block">Pesanan</span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400">
                        {reel.ordersGenerated} paket
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL UNGGAH REELS BARU UNTUK PENJUAL */}
      {showUploadReelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-2xl border border-stone-200 dark:border-stone-800 my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-stone-900 dark:text-stone-100">
                    Unggah Video Reels Panen Baru
                  </h3>
                  <p className="text-xs text-stone-500">
                    Video berdurasi 15–45 detik untuk dipromosikan ke pembeli AgroGo
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadReelModal(false)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!reelTitle.trim()) return;

                setIsUploadingReel(true);
                setReelUploadProgress(15);

                const t1 = setTimeout(() => setReelUploadProgress(65), 500);
                const t2 = setTimeout(() => {
                  setReelUploadProgress(100);
                  setIsUploadingReel(false);

                  const linkedProduct = products.find((p) => p.id === reelLinkedProductId) || products[0];
                  const newReelItem = {
                    id: `sr-${Date.now()}`,
                    title: reelTitle,
                    productName: linkedProduct.name,
                    views: 1,
                    likes: 1,
                    ordersGenerated: 0,
                    duration: reelDuration,
                    thumbnail: linkedProduct.images[0] || '/src/assets/images/lumajang_fresh_eggs_1792595225732.jpg',
                    status: 'Tayang di AgroReels',
                  };

                  setSellerReels((prev) => [newReelItem, ...prev]);
                  setShowUploadReelModal(false);
                  setReelSuccessToast(`Video Reels "${reelTitle}" berhasil dipublikasikan dan langsung tayang di menu AgroReels beranda pembeli!`);
                  setReelTitle('');
                  setReelDescription('');
                }, 1100);
              }}
              className="space-y-4 text-xs"
            >
              {/* Judul Reels */}
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Judul Video Panen (Menarik & Jelas) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Panen Telur Ayam Kampung Herbal Subuh Ini di Sukodono"
                  value={reelTitle}
                  onChange={(e) => setReelTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold"
                />
              </div>

              {/* Tautkan Produk Toko */}
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Tautkan Produk Toko yang Dijual di Video *
                </label>
                <select
                  value={reelLinkedProductId}
                  onChange={(e) => setReelLinkedProductId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 cursor-pointer font-semibold"
                >
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name} — Rp {prod.pricePerUnit.toLocaleString('id-ID')}/{prod.unit}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-stone-400 mt-1">
                  💡 Tombol "Beli Langsung" akan otomatis dipasang di bawah video agar penonton bisa langsung checkout.
                </p>
              </div>

              {/* Durasi & Sorotan Panen */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Estimasi Durasi Video
                  </label>
                  <select
                    value={reelDuration}
                    onChange={(e) => setReelDuration(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 cursor-pointer font-semibold"
                  >
                    <option value="0:15">15 Detik (Cepat & Padat)</option>
                    <option value="0:30">30 Detik (Standar Rekomendasi)</option>
                    <option value="0:45">45 Detik (Detail Panen Lengkap)</option>
                    <option value="1:00">60 Detik (Cerita Edukasi Kebun)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Label Sorotan
                  </label>
                  <input
                    type="text"
                    value={reelHighlight}
                    onChange={(e) => setReelHighlight(e.target.value)}
                    placeholder="Contoh: Petik Subuh Senduro"
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold"
                  />
                </div>
              </div>

              {/* Area File Video / Rekam Kamera */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40 text-center space-y-2">
                <UploadCloud className="w-8 h-8 text-pink-500 mx-auto" />
                <div>
                  <p className="font-bold text-stone-800 dark:text-stone-200 text-xs">
                    Pilih File Video MP4/MOV atau Rekam dari Kamera HP
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Format Vertikal 9:16 • Maksimal ukuran file 80 MB
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 text-[11px] font-bold">
                  ✓ File rekaman panen siap diunggah
                </div>
              </div>

              {/* Deskripsi & Tagar */}
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Deskripsi & Cerita Panen
                </label>
                <textarea
                  rows={2}
                  placeholder="Ceritakan keistimewaan panen hari ini... #PanenLumajang #SegarSemeru"
                  value={reelDescription}
                  onChange={(e) => setReelDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-normal"
                />
              </div>

              {/* Upload Progress Bar if processing */}
              {isUploadingReel && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-pink-600">
                    <span>Sedang mengunggah video ke server AgroGo...</span>
                    <span>{reelUploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full bg-pink-600 rounded-full transition-all duration-300"
                      style={{ width: `${reelUploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowUploadReelModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploadingReel}
                  className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-black flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Video className="w-4 h-4" />
                  <span>{isUploadingReel ? 'Memproses Video...' : 'Publikasikan ke AgroReels'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: FORM UNGGAH HASIL PANEN BARU (Cara Penjual Mengunggah Barang) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-xl p-5 sm:p-6 space-y-4 shadow-2xl border border-stone-200 dark:border-stone-800 my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <h3 className="font-black text-base sm:text-lg text-stone-900 dark:text-stone-100">
                  Unggah Barang Dagangan Hasil Panen Lumajang
                </h3>
                <p className="text-xs text-stone-500">
                  Lengkapi data hasil panen agar konsumen dapat membeli langsung dengan harga terbaik.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs max-h-[70vh] overflow-y-auto pr-1">
              {/* Product Photo Selector / Preview */}
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Pilih Foto Asli Berkualitas Tinggi (HD)
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-emerald-500 shrink-0 shadow-sm">
                    <img src={newProductImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[11px] text-stone-500">
                    <p className="font-semibold text-stone-800 dark:text-stone-200">Foto Menarik Sesuai Keterangan</p>
                    <p>Pilih dari galeri foto panen HD Lumajang di bawah ini:</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {imagePresets.map((imgOpt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setNewProductImage(imgOpt.url);
                        setNewProductCategory(imgOpt.cat as any);
                      }}
                      className={`p-1.5 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-2 ${
                        newProductImage === imgOpt.url
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500'
                          : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
                      }`}
                    >
                      <img src={imgOpt.url} alt={imgOpt.label} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                      <span className="text-[10px] font-bold truncate">{imgOpt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Nama Hasil Panen / Peternakan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Cth: Pisang Mas Kirana Matang Pohon Tempursari"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                />
              </div>

              {/* Category & District in Lumajang */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    Kategori Komoditas
                  </label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 cursor-pointer"
                  >
                    <option value="buah">Buah-Buahan</option>
                    <option value="sayur">Sayur-Sayuran</option>
                    <option value="peternakan">Daging / Peternakan</option>
                    <option value="susu_telur">Susu & Telur Segar</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    Kecamatan Asal Kebun (Lumajang)
                  </label>
                  <select
                    value={newProductDistrict}
                    onChange={(e) => setNewProductDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 cursor-pointer"
                  >
                    {LUMAJANG_DISTRICTS.map((dist) => (
                      <option key={dist.id} value={dist.name}>
                        Kecamatan {dist.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price, Unit & Stock */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    Harga Jual Petani (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    Satuan
                  </label>
                  <input
                    type="text"
                    value={newProductUnit}
                    onChange={(e) => setNewProductUnit(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    placeholder="kg / sisir / liter / pack"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    Stok Tersedia
                  </label>
                  <input
                    type="number"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Harvest Time Ago */}
              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Keterangan Waktu Petik / Panen
                </label>
                <input
                  type="text"
                  value={newProductHarvestDate}
                  onChange={(e) => setNewProductHarvestDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  placeholder="Cth: Dipetik subuh jam 05:00 WIB"
                />
              </div>

              {/* Pre-Order Toggle */}
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="farmer-po-toggle"
                    checked={isPreOrder}
                    onChange={(e) => setIsPreOrder(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                  <label htmlFor="farmer-po-toggle" className="font-bold text-amber-950 dark:text-amber-100 cursor-pointer">
                    Aktifkan Fitur Pre-Order (PO Panen Terjadwal)
                  </label>
                </div>
                {isPreOrder && (
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div>
                      <span className="text-stone-500 block">Estimasi Tanggal Panen:</span>
                      <input
                        type="text"
                        value={preOrderDate}
                        onChange={(e) => setPreOrderDate(e.target.value)}
                        className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                      />
                    </div>
                    <div>
                      <span className="text-stone-500 block">Kuota Pre-Order:</span>
                      <input
                        type="number"
                        value={preOrderQuota}
                        onChange={(e) => setPreOrderQuota(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2.5 pt-2 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold cursor-pointer shadow-md transition-all active:scale-95"
                >
                  Terbitkan Hasil Panen ke Aplikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PENARIKAN SALDO PETANI DENGAN BIAYA ADMIN 5% (Cara Petani Mengambil Uang) */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-2xl border border-stone-200 dark:border-stone-800 my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <h3 className="font-black text-base sm:text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span>Penarikan Saldo Hasil Jualan Petani</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Transfer langsung ke rekening bank atau e-wallet petani
                </p>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProcessWithdrawal} className="space-y-4 text-xs">
              {/* Saldo Aktif */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">
                    Saldo Aktif Siap Ditarik:
                  </span>
                  <p className="text-xl font-black text-emerald-900 dark:text-emerald-200">
                    Rp {farmerBalance.toLocaleString('id-ID')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWithdrawAmount(farmerBalance)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-bold text-[11px] cursor-pointer hover:bg-emerald-800"
                >
                  Tarik Semua
                </button>
              </div>

              {/* Nominal Input */}
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Nominal Penarikan Dana (Rp)
                </label>
                <input
                  type="number"
                  required
                  min={50000}
                  max={farmerBalance}
                  step={10000}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-black text-base"
                />
              </div>

              {/* Destination Bank / E-Wallet */}
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Rekening Tujuan Pencairan
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 cursor-pointer font-semibold"
                >
                  <option value="Bank BRI">Bank BRI</option>
                  <option value="Bank BCA">Bank BCA</option>
                  <option value="Bank Mandiri">Bank Mandiri</option>
                  <option value="Bank BNI">Bank BNI</option>
                  <option value="Bank BSI (Bank Syariah Indonesia)">Bank BSI (Bank Syariah Indonesia)</option>
                  <option value="Bank Jatim">Bank Jatim</option>
                  <option value="Bank CIMB Niaga">Bank CIMB Niaga</option>
                  <option value="Bank Permata">Bank Permata</option>
                  <option value="Bank Danamon">Bank Danamon</option>
                  <option value="Bank BTN">Bank BTN</option>
                  <option value="SeaBank">SeaBank</option>
                  <option value="Bank Jago">Bank Jago</option>
                  <option value="DANA">DANA (Nomor HP Terdaftar)</option>
                  <option value="GoPay">GoPay (Nomor HP Terdaftar)</option>
                  <option value="OVO">OVO (Nomor HP Terdaftar)</option>
                  <option value="ShopeePay">ShopeePay (Nomor HP Terdaftar)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                    Nomor Rekening / HP
                  </label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                    Nama Pemilik Rekening
                  </label>
                  <input
                    type="text"
                    required
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>
              </div>

              {/* Transparent 5% Admin Calculation Box */}
              <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-1.5">
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Nominal Penarikan Kotor:</span>
                  <span className="font-semibold">Rp {withdrawAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-red-600 font-semibold">
                  <span>Biaya Admin Platform (5%):</span>
                  <span>- Rp {currentAdminFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-black text-stone-900 dark:text-stone-100 text-sm pt-1 border-t border-stone-200 dark:border-stone-700">
                  <span>Dana Bersih Masuk Rekening:</span>
                  <span className="text-emerald-700 dark:text-emerald-400">
                    Rp {currentNetAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-black cursor-pointer shadow-md transition-all active:scale-95"
                >
                  Konfirmasi & Kirim Transfer Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
