import React, { useState } from 'react';
import {
  X,
  Store,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Building,
  Landmark,
  MapPin,
  FileText,
  Camera,
  ArrowRight,
  Info,
  DollarSign,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, LumajangDistrict } from '../../types';
import { LUMAJANG_DISTRICTS } from '../../data/mockData';

interface OpenStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onStoreCreated: (updatedUser: UserProfile) => void;
}

export const OpenStoreModal: React.FC<OpenStoreModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onStoreCreated,
}) => {
  const [storeName, setStoreName] = useState(
    currentUser.farmerDetails?.farmName || `Kebun Tani ${currentUser.name.split(' ')[0]}`
  );
  const [storeCategory, setStoreCategory] = useState<'buah' | 'sayur' | 'peternakan' | 'susu_telur'>('buah');
  const [storeDistrict, setStoreDistrict] = useState(currentUser.district || 'Senduro');
  const [poktanName, setPoktanName] = useState(
    currentUser.farmerDetails?.poktanName || 'Kelompok Tani Makmur Sejahtera Lumajang'
  );
  const [nik, setNik] = useState(currentUser.farmerDetails?.nik || '3508110908750002');
  const [bankName, setBankName] = useState(
    currentUser.farmerDetails?.bankName || 'Bank Jatim Cabang Lumajang'
  );
  const [accountNumber, setAccountNumber] = useState(
    currentUser.farmerDetails?.accountNumber || '0281-9921-88'
  );
  const [accountHolder, setAccountHolder] = useState(
    currentUser.farmerDetails?.accountHolder || currentUser.name
  );
  const [storeAddress, setStoreAddress] = useState(
    currentUser.address || `Kecamatan ${storeDistrict}, Kabupaten Lumajang, Jawa Timur`
  );
  const [selectedPhoto, setSelectedPhoto] = useState(
    '/src/assets/images/lumajang_fresh_eggs_1792595225732.jpg'
  );
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const photoOptions = [
    { label: 'Daging Sapi Merah Segar Senduro', url: '/src/assets/images/lumajang_fresh_red_beef_1792597522221.jpg' },
    { label: 'Ayam Kampung Segar Potong', url: '/src/assets/images/lumajang_fresh_kampung_poultry_1792597522140.jpg' },
    { label: 'Telur Ayam Herbal Sukodono', url: '/src/assets/images/lumajang_fresh_eggs_1792595225732.jpg' },
    { label: 'Susu Sapi Murni Senduro', url: '/src/assets/images/lumajang_senduro_milk_1792595226961.jpg' },
    { label: 'Pisang Mas Kirana IG', url: '/src/assets/images/lumajang_pisang_kirana_1792595227784.jpg' },
    { label: 'Sayuran Lereng Semeru', url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=800&q=80' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      alert('Harap setujui syarat kemitraan & ketentuan biaya admin 5% platform.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      // Trigger festive celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2D5A27', '#F59E0B', '#10B981', '#FBBF24'],
        });
      } catch (err) {
        // Fallback
      }

      const updatedUser: UserProfile = {
        ...currentUser,
        role: 'farmer',
        hasStore: true,
        storeName,
        storeCategory,
        district: storeDistrict,
        storePhoto: selectedPhoto,
        farmerDetails: {
          farmName: storeName,
          poktanName,
          nik,
          bankName,
          accountNumber,
          accountHolder,
          balance: currentUser.farmerDetails?.balance || 5000000, // Initial ready-to-withdraw funds
        },
      };

      onStoreCreated(updatedUser);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-br from-emerald-800 via-[#244F1F] to-emerald-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
              <Store className="w-3.5 h-3.5" />
              Pendaftaran Mitra Tani Lumajang
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Buka Toko di AgroGo Lumajang
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-md">
            Jual hasil panen dan peternakanmu langsung ke ribuan konsumen di Jawa Timur tanpa perantara tengkulak!
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
          
          {/* Section 1: Informasi Toko / Usaha Tani */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
              <Store className="w-4 h-4 text-emerald-600" />
              <span>1. Profil Toko / Usaha Tani Anda</span>
            </h4>

            <div>
              <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Nama Toko / Kebun / Kandang
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Sentra Pisang Kirana Tempursari"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Kategori Hasil Bumi Utama
                </label>
                <select
                  value={storeCategory}
                  onChange={(e) => setStoreCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 cursor-pointer font-medium"
                >
                  <option value="buah">Buah-Buahan (Pisang, Durian, Salak)</option>
                  <option value="susu_telur">Susu Sapi & Telur Segar</option>
                  <option value="sayur">Sayur-Sayuran Dingin Semeru</option>
                  <option value="peternakan">Daging Sapi & Ayam Kampung</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Kecamatan Lokasi Kebun (Lumajang)
                </label>
                <select
                  value={storeDistrict}
                  onChange={(e) => setStoreDistrict(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 cursor-pointer font-medium"
                >
                  {LUMAJANG_DISTRICTS.map((dist) => (
                    <option key={dist.id} value={dist.name}>
                      Kec. {dist.name} ({dist.specialty.split('(')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Alamat Lengkap Kebun / Titik Penjemputan Kurir
              </label>
              <textarea
                rows={2}
                required
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                placeholder="Jl. Raya Senduro No. 12, RT 01/RW 03..."
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
              />
            </div>

            {/* Photo preset selector */}
            <div>
              <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Foto Profil Toko / Komoditas Unggulan HD
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {photoOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPhoto(opt.url)}
                    className={`p-1.5 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-2 ${
                      selectedPhoto === opt.url
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500'
                        : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <img src={opt.url} alt={opt.label} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                    <span className="text-[10px] font-bold truncate">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Legalitas Petani & Kelompok Tani */}
          <div className="space-y-3 pt-2">
            <h4 className="font-extrabold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>2. Legalitas Petani & Kelompok Tani (Poktan)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Nama Kelompok Tani / Gapoktan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Cth: Poktan Sumber Makmur"
                  value={poktanName}
                  onChange={(e) => setPoktanName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Nomor Induk Kependudukan (NIK)
                </label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  placeholder="3508xxxxxxxxxxxx"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Rekening Penarikan Dana & Ketentuan Admin 5% */}
          <div className="space-y-3 pt-2">
            <h4 className="font-extrabold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>3. Rekening Penarikan Saldo Hasil Jualan</span>
            </h4>

            <div>
              <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Bank atau E-Wallet Tujuan
              </label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 cursor-pointer font-bold"
              >
                <option value="Bank Jatim Cabang Lumajang">Bank Jatim Cabang Lumajang (Rekomendasi Petani Jatim)</option>
                <option value="BRI Unit Senduro Lumajang">BRI Unit Senduro Lumajang</option>
                <option value="BCA KCP Lumajang">BCA KCP Lumajang</option>
                <option value="Bank Mandiri Lumajang">Bank Mandiri Lumajang</option>
                <option value="DANA E-Wallet">DANA (Nomor HP Terdaftar)</option>
                <option value="GoPay E-Wallet">GoPay (Nomor HP Terdaftar)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Nomor Rekening / E-Wallet
                </label>
                <input
                  type="text"
                  required
                  placeholder="0281-9921-88"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Nama Pemilik Rekening
                </label>
                <input
                  type="text"
                  required
                  placeholder="Sesuai buku tabungan"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                />
              </div>
            </div>

            {/* Clear 5% admin fee disclosure */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-1.5 text-amber-950 dark:text-amber-200">
              <div className="flex items-center gap-2 font-black text-xs text-amber-900 dark:text-amber-100">
                <Info className="w-4 h-4 text-amber-600" />
                <span>Keterangan Biaya Admin Platform 5%:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-900/90 dark:text-amber-200">
                Setiap penarikan dana hasil penjualan dipotong <strong>5%</strong> sebagai biaya operasional server inspeksi <em>live video call</em> tanpa lag, pemeliharaan boks pendingin (*cold chain 3.8°C*), dan jaminan asuransi ganti rugi barang rusak.
              </p>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="store-terms-check"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="store-terms-check" className="text-[11px] text-stone-600 dark:text-stone-400 cursor-pointer">
              Saya menyatakan hasil panen yang dijual adalah hasil bumi segar asli Kabupaten Lumajang, Jawa Timur, dan siap melayani inspeksi video call dari calon pembeli.
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Mengaktifkan Toko...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Aktivasi & Buka Toko Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
