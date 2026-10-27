import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  QrCode,
  CreditCard,
  Truck,
  CheckCircle2,
  Copy,
  Landmark,
  Banknote,
  ArrowRight,
  Sparkles,
  Crown,
  Clock,
  ArrowLeft,
  Check,
  Phone,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, JavaCity, PaymentMethod, Order, LumajangDistrict, UserProfile } from '../../types';
import { LUMAJANG_DISTRICTS } from '../../data/mockData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: {
    items: CartItem[];
    subtotal: number;
    shippingCost: number;
    discountAmount: number;
    pointsRedeemed: number;
    finalTotal: number;
    voucherApplied: string;
  } | null;
  currentCity: JavaCity;
  selectedDistrict: LumajangDistrict;
  currentUser: UserProfile;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  summary,
  currentCity,
  selectedDistrict,
  currentUser,
  onOrderSuccess,
}) => {
  // Step in checkout: 'details' (pengiriman & metode) -> 'payment_simulator' (layar gerbang bayar)
  const [step, setStep] = useState<'details' | 'payment_simulator'>('details');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [selectedBank, setSelectedBank] = useState<'bankjatim' | 'bca' | 'bri' | 'mandiri'>('bankjatim');
  
  // Customer delivery details
  const [customerName, setCustomerName] = useState(currentUser.name || 'Salsa Tahara');
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '0812-8899-2341');
  const [districtName, setDistrictName] = useState(selectedDistrict.name);
  const [customerAddress, setCustomerAddress] = useState(
    currentUser.address || `Jl. Alun-Alun No. 12, RT 02/RW 04, Kec. ${selectedDistrict.name}, Lumajang`
  );
  const [orderNotes, setOrderNotes] = useState('Mohon sayur dan susu ditaruh di box pendingin cold-chain dengan es gel.');

  // Payment Simulation states
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedVA, setCopiedVA] = useState(false);
  const [copiedTotal, setCopiedTotal] = useState(false);
  const [payCountdown, setPayCountdown] = useState(899); // 14:59 minutes

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setIsProcessing(false);
      setDistrictName(selectedDistrict.name);
      setPayCountdown(899);
    }
  }, [isOpen, selectedDistrict]);

  // Payment countdown timer
  useEffect(() => {
    if (!isOpen || step !== 'payment_simulator') return;
    const timer = setInterval(() => {
      setPayCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, step]);

  if (!isOpen || !summary) return null;

  // Premium Sultan gets 100% Free Shipping!
  const effectiveShipping = currentUser.isPremium ? 0 : summary.shippingCost;
  const effectiveFinalTotal = Math.max(0, summary.subtotal - summary.discountAmount - summary.pointsRedeemed + effectiveShipping);

  // Virtual Account number based on selected bank
  const vaNumbers = {
    bankjatim: '1350 8812 9901 4421',
    bca: '8801 9482 9104 8291',
    bri: '0281 9901 8823 1190',
    mandiri: '8910 2291 0038 4120',
  };

  const currentVaNumber = vaNumbers[selectedBank];

  const handleCopyVA = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentVaNumber.replace(/\s/g, ''));
    }
    setCopiedVA(true);
    setTimeout(() => setCopiedVA(false), 2000);
  };

  const handleCopyTotal = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(effectiveFinalTotal.toString());
    }
    setCopiedTotal(true);
    setTimeout(() => setCopiedTotal(false), 2000);
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // EXECUTE REAL PAYMENT SIMULATION -> DIRECT TO COURIER TRACKING
  const handleExecutePaymentSimulation = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2D5A27', '#F59E0B', '#10B981', '#FBBF24'],
        });
      } catch (e) {}

      const orderNumber = `AGR-LUM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

      // Generate created order with dedicated Lumajang Cold-Chain Courier
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        createdAt: 'Hari ini, Baru saja',
        items: summary.items,
        totalAmount: effectiveFinalTotal,
        shippingCost: effectiveShipping,
        discountAmount: summary.discountAmount,
        pointsRedeemed: summary.pointsRedeemed,
        pointsEarned: Math.floor(effectiveFinalTotal / (currentUser.isPremium ? 50 : 100)), // 2x points for Sultan
        destinationCity: 'Kabupaten Lumajang, Jawa Timur',
        destinationDistrict: districtName,
        destinationAddress: customerAddress,
        customerName,
        customerPhone,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'COD (Bayar Tunai ke Kurir)' : 'Lunas (Verifikasi Otomatis)',
        shippingStatus: 'Kurir AgroGo Lumajang Mengantar',
        temperatureCelsius: 3.8,
        courierName: 'Wahyu Prasetyo (Kurir Kilat AgroGo Lumajang)',
        courierPhone: '0878-3344-9021',
        courierPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        vehicleType: 'Motor Box Termal Cold-Chain (Suhu 2-4°C Sayur, Susu & Daging)',
        vehiclePlate: 'N 1945 AG (Lumajang)',
        courierRating: 4.98,
        courierTripsCount: 1842,
        liveGpsLocation: `Jl. Lintas Timur Lumajang - Menuju ke Kec. ${districtName}`,
        estimatedArrival: `Hari ini (15-25 Menit lagi)`,
        trackingSteps: [
          {
            title: 'Pembayaran Terverifikasi & Pesanan Diterima',
            description: paymentMethod === 'cod'
              ? 'Metode COD terverifikasi. Kurir AgroGo menyiapkan uang kembalian dan packing dingin.'
              : `Pembayaran digital Rp ${effectiveFinalTotal.toLocaleString('id-ID')} terverifikasi instan 100% aman.`,
            timestamp: 'Baru saja',
            completed: true,
            current: false,
            location: `Sentra Panen Petani Lumajang`,
          },
          {
            title: 'Petik Segar & Packing Box Pendingin (Cold-Chain 3.8°C)',
            description: 'Komoditas sayur, buah, atau susu dimasukkan ke insulated thermal box berpengawet es gel food-grade.',
            timestamp: 'Baru saja',
            completed: true,
            current: false,
            location: `Hub Cold-Chain AgroGo Lumajang`,
          },
          {
            title: 'Kurir AgroGo Lumajang Sedang Mengantar',
            description: `Mas Wahyu Prasetyo (N 1945 AG) sedang berkendara melintasi jalur utama menuju alamat Anda di Kec. ${districtName}.`,
            timestamp: 'Saat ini (Dalam Perjalanan)',
            completed: false,
            current: true,
            location: `Jl. Lintas Timur Lumajang (2.1 km lagi)`,
          },
          {
            title: 'Pesanan Tiba & Verifikasi Kesegaran',
            description: paymentMethod === 'cod'
              ? 'Konsumen memeriksa kesegaran hasil panen lalu menyerahkan uang tunai pas ke Kurir.'
              : 'Konsumen menerima box dingin dan memverifikasi kualitas hasil panen segar.',
            timestamp: 'Estimasi 15-25 Menit lagi',
            completed: false,
            current: false,
            location: customerAddress,
          },
        ],
      };

      onOrderSuccess(newOrder);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-auto">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#244F1F] via-[#2F6527] to-emerald-800 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            {step === 'payment_simulator' && (
              <button
                onClick={() => setStep('details')}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                title="Kembali ke Rincian Pesanan"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black uppercase tracking-wider">
                  {step === 'details' ? 'Tahap 1: Rincian Checkout' : 'Tahap 2: Menu Pembayaran Nyata'}
                </span>
                <span className="text-[11px] text-emerald-200 hidden sm:inline">Kurir Cold-Chain Lumajang</span>
              </div>
              <h3 className="text-base sm:text-xl font-black mt-0.5">
                {step === 'details' ? 'Konfirmasi Pengiriman & Pembayaran' : 'Gerbang Pembayaran & Lacak Kurir'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            id="close-checkout-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ===================== VIEW 1: DETAILS & SHIPPING ===================== */}
        {step === 'details' ? (
          <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            {/* Sultan VIP Alert if active */}
            {currentUser.isPremium && (
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
                  <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Akun Sultan Lumajang: Ongkir Dingin Termal 100% GRATIS!</span>
                </div>
                <span className="text-[10px] font-black text-amber-600 dark:text-amber-300 bg-amber-200/80 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                  HEMAT Rp {summary.shippingCost.toLocaleString('id-ID')}
                </span>
              </div>
            )}

            {/* Delivery Destination in Lumajang */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-stone-200/70 dark:border-stone-700">
                <span className="font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 text-xs">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Alamat Pengiriman di Kabupaten Lumajang
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">
                  ✓ Pengantaran Kilat 15-30 Menit
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    Nama Penerima
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    Nomor WhatsApp / HP Kurir
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    Pilih Kecamatan di Lumajang
                  </label>
                  <select
                    value={districtName}
                    onChange={(e) => setDistrictName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold cursor-pointer"
                  >
                    {LUMAJANG_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.name}>
                        Kec. {d.name} ({d.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    Alamat Lengkap (Jalan, RT/RW, Patokan)
                  </label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-semibold"
                    placeholder="Nama jalan, nomor rumah, atau patokan lokasi..."
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                  Catatan untuk Petani & Kurir AgroGo
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 text-[11px]"
                />
              </div>
            </div>

            {/* Product Items Breakdown */}
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-2">
              <span className="font-extrabold text-stone-900 dark:text-stone-100 block text-xs">
                Barang yang Dipesan ({summary.items.length} Komoditas):
              </span>
              <div className="divide-y divide-stone-200/60 dark:divide-stone-700 max-h-36 overflow-y-auto pr-1">
                {summary.items.map((item) => (
                  <div key={item.product.id} className="py-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-stone-900 dark:text-stone-100 truncate text-xs">
                          {item.product.name}
                        </p>
                        <p className="text-[11px] text-stone-400">
                          {item.quantity} {item.product.unit} × Rp {item.product.pricePerUnit.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-emerald-700 dark:text-emerald-400 shrink-0 text-xs">
                      Rp {(item.product.pricePerUnit * item.quantity).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Choice of Payment Method */}
            <div className="space-y-2">
              <label className="font-extrabold text-stone-900 dark:text-stone-100 block text-xs">
                Pilih Menu Pembayaran:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* QRIS */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    paymentMethod === 'qris'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500'
                      : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                  id="select-method-qris"
                >
                  <div className="flex items-center justify-between mb-1">
                    <QrCode className="w-5 h-5 text-emerald-600" />
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-black">
                      TERPOPULER
                    </span>
                  </div>
                  <p className="font-extrabold text-stone-900 dark:text-stone-100 text-xs">QRIS Instan</p>
                  <p className="text-[10px] text-stone-400">Scan m-Banking & E-Wallet</p>
                </button>

                {/* Virtual Account */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('va_bca')}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    paymentMethod.startsWith('va')
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 ring-2 ring-indigo-500'
                      : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                  id="select-method-va"
                >
                  <div className="flex items-center justify-between mb-1">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                      Bank Jatim / BCA
                    </span>
                  </div>
                  <p className="font-extrabold text-stone-900 dark:text-stone-100 text-xs">Virtual Account</p>
                  <p className="text-[10px] text-stone-400">Transfer ATM & Mobile</p>
                </button>

                {/* Cash On Delivery (COD) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 ring-2 ring-amber-400'
                      : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                  id="select-method-cod"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Banknote className="w-5 h-5 text-amber-600" />
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">
                      BAYAR DI TEMPAT
                    </span>
                  </div>
                  <p className="font-extrabold text-stone-900 dark:text-stone-100 text-xs">COD Tunai</p>
                  <p className="text-[10px] text-stone-400">Bayar ke Kurir saat Tiba</p>
                </button>
              </div>
            </div>

            {/* Price Calculation Summary */}
            <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-1.5">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Subtotal Hasil Panen:</span>
                <span className="font-semibold">Rp {summary.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Ongkir Box Termal (Kec. {districtName}):</span>
                <span className="font-semibold">
                  {currentUser.isPremium ? (
                    <span className="text-emerald-600 font-bold">GRATIS (Sultan)</span>
                  ) : (
                    `Rp ${summary.shippingCost.toLocaleString('id-ID')}`
                  )}
                </span>
              </div>
              {summary.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Diskon Kupon ({summary.voucherApplied}):</span>
                  <span>- Rp {summary.discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              {summary.pointsRedeemed > 0 && (
                <div className="flex justify-between text-amber-600 font-semibold">
                  <span>Tukar AgroPoints:</span>
                  <span>- Rp {summary.pointsRedeemed.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex justify-between items-center text-sm font-black">
                <span className="text-stone-900 dark:text-stone-100">Total Pembayaran:</span>
                <span className="text-emerald-700 dark:text-emerald-400 text-base">
                  Rp {effectiveFinalTotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* ===================== VIEW 2: INTERACTIVE REAL PAYMENT SIMULATION ===================== */
          <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs animate-in fade-in zoom-in-95 duration-150">
            {/* Top Timer & Invoice Info */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-extrabold uppercase tracking-wider block">
                    Menunggu Pembayaran
                  </span>
                  <p className="font-mono font-bold text-xs text-stone-900 dark:text-stone-100">
                    INV-AGR-2026-98120
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-stone-500 block">Sisa Waktu Bayar:</span>
                <span className="font-mono font-black text-sm text-rose-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatCountdown(payCountdown)}
                </span>
              </div>
            </div>

            {/* Total Tagihan Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#244F1F] via-[#2F6527] to-emerald-800 text-white flex items-center justify-between shadow-md">
              <div>
                <span className="text-[10px] text-emerald-200 font-semibold block uppercase">
                  Total Tagihan Pembayaran
                </span>
                <p className="text-2xl font-black text-amber-300">
                  Rp {effectiveFinalTotal.toLocaleString('id-ID')}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyTotal}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedTotal ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTotal ? 'Tersalin' : 'Salin Jumlah'}</span>
              </button>
            </div>

            {/* PAYMENT METHOD DETAILS */}

            {/* Option A: QRIS Instan */}
            {paymentMethod === 'qris' && (
              <div className="p-4 rounded-3xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3.5 text-center">
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                    QRIS Standar Bank Indonesia
                  </span>
                  <h4 className="font-black text-sm text-stone-900 dark:text-stone-100">
                    Scan Kode QRIS AgroGo Lumajang
                  </h4>
                  <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
                    NMID: ID1020268899120 • Merchant: <strong>AGROGO PASAR TANI LUMAJANG</strong>
                  </p>
                </div>

                {/* Realistic QRIS Graphic Box */}
                <div className="p-3 bg-white rounded-2xl shadow-md border-2 border-emerald-500/30 inline-block mx-auto relative group">
                  <div className="w-48 h-48 sm:w-52 sm:h-52 bg-white flex flex-col items-center justify-center p-2 rounded-xl relative">
                    {/* QR Code graphic */}
                    <QrCode className="w-40 h-40 sm:w-44 sm:h-44 text-stone-900 mx-auto" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md border border-emerald-500 flex items-center justify-center">
                        <img
                          src="/assets/aistudio/logo_agrogo_fiks_96e4e8f2.jpeg"
                          alt="AgroGo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200 text-left space-y-1">
                  <p className="font-bold text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Cara Bayar dengan Simulasi Nyata:</span>
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Klik tombol hijau <strong>"Simulasikan Scan & Bayar QRIS Sukses"</strong> di bawah. Sistem akan memverifikasi pembayaran secara otomatis dan langsung membuka layar pelacakan kurir yang membawa hasil panen Anda!
                  </p>
                </div>
              </div>
            )}

            {/* Option B: Virtual Account */}
            {paymentMethod.startsWith('va') && (
              <div className="p-4 rounded-3xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3.5">
                <div className="space-y-1">
                  <label className="font-bold text-stone-800 dark:text-stone-200 block text-xs">
                    Pilih Bank Virtual Account:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'bankjatim', name: 'Bank Jatim' },
                      { id: 'bca', name: 'BCA' },
                      { id: 'bri', name: 'BRI' },
                      { id: 'mandiri', name: 'Mandiri' },
                    ].map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBank(b.id as any)}
                        className={`p-2 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                          selectedBank === b.id
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500'
                            : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* VA Number Card */}
                <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-indigo-200 dark:border-indigo-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>Nomor Virtual Account ({selectedBank.toUpperCase()}):</span>
                    <span className="font-semibold text-emerald-600">Verifikasi Otomatis</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-black text-lg sm:text-xl text-stone-900 dark:text-stone-100 tracking-wider">
                      {currentVaNumber}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyVA}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedVA ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedVA ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200 space-y-1 text-[11px]">
                  <p className="font-bold">Langkah Pembayaran m-Banking:</p>
                  <ol className="list-decimal list-inside space-y-0.5 text-stone-600 dark:text-stone-300">
                    <li>Buka aplikasi m-Banking atau ATM {selectedBank.toUpperCase()}.</li>
                    <li>Pilih menu <strong>Transfer &gt; Virtual Account</strong>.</li>
                    <li>Masukkan nomor VA di atas lalu pastikan nominal pas Rp {effectiveFinalTotal.toLocaleString('id-ID')}.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Option C: Cash On Delivery (COD) */}
            {paymentMethod === 'cod' && (
              <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm">Ketentuan Bayar di Tempat (COD)</h4>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300">
                      Bayar tunai kepada Kurir AgroGo saat paket tiba di alamat Anda.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-300 dark:border-amber-700 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-600 dark:text-stone-400">Uang Pas yang Harus Disiapkan:</span>
                    <span className="font-black text-emerald-700 dark:text-emerald-400 text-base">
                      Rp {effectiveFinalTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700 text-[11px] text-stone-500 space-y-1">
                    <p>✓ Kurir kami membawa pesanan dalam <strong>Box Termal Suhu 3.8°C</strong>.</p>
                    <p>✓ Anda berhak memeriksa kesegaran barang sebelum menyerahkan uang tunai.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Destination Info Pill */}
            <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-[11px]">
              <div>
                <span className="text-stone-400 block">Tujuan Pengiriman:</span>
                <p className="font-bold text-stone-800 dark:text-stone-200">
                  {customerName} • Kec. {districtName}, Lumajang
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                Ubah Alamat
              </button>
            </div>
          </div>
        )}

        {/* Bottom Action Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-stone-500 self-start sm:self-center">
            <span className="flex items-center gap-1 font-semibold text-stone-700 dark:text-stone-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Garansi Uang Kembali 100% jika Rusak / Layu
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {step === 'details' ? (
              <button
                type="button"
                onClick={() => setStep('payment_simulator')}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#244F1F] hover:bg-[#1B3F17] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
                id="proceed-to-payment-step-btn"
              >
                <span>Lanjut ke Menu Pembayaran (Rp {effectiveFinalTotal.toLocaleString('id-ID')})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleExecutePaymentSimulation}
                disabled={isProcessing}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs sm:text-sm shadow-xl cursor-pointer transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                id="btn-confirm-payment-simulation"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memverifikasi Pembayaran & Menugaskan Kurir...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    {paymentMethod === 'cod' ? (
                      <span>Konfirmasi Pesanan COD (Bayar ke Kurir) & Lacak</span>
                    ) : paymentMethod === 'qris' ? (
                      <span>Simulasikan Scan & Bayar QRIS Sukses (Lunas) & Lacak Kurir</span>
                    ) : (
                      <span>Simulasikan Transfer Bank Selesai (Lunas) & Lacak Kurir</span>
                    )}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
