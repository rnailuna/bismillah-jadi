import React, { useState } from 'react';
import {
  X,
  User,
  Store,
  ShieldCheck,
  CheckCircle2,
  Crown,
  Phone,
  Mail,
  Lock,
  MapPin,
  FileText,
  CreditCard,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { LUMAJANG_DISTRICTS, DEMO_USERS } from '../../data/mockData';
import { Logo } from '../common/Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLoginSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'register';
  initialRole?: 'buyer' | 'farmer';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  initialMode = 'login',
  initialRole = 'buyer',
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<'buyer' | 'farmer'>(initialRole);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState(LUMAJANG_DISTRICTS[6].name); // Lumajang Kota default
  const [address, setAddress] = useState('');
  
  // Farmer Specific Fields
  const [farmName, setFarmName] = useState('');
  const [poktanName, setPoktanName] = useState('');
  const [nik, setNik] = useState('');
  const [bankName, setBankName] = useState('Bank Jatim Cabang Lumajang');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert('Harap menyetujui syarat & ketentuan e-commerce AgroGo Lumajang.');
      return;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: fullName || (role === 'farmer' ? 'Mitra Petani Lumajang' : 'Warga Lumajang'),
      email: email || `${Date.now()}@agrogo.id`,
      phone: phone || '0812-3456-7890',
      role,
      district,
      address: address || `Kecamatan ${district}, Kabupaten Lumajang, Jawa Timur`,
      isPremium: false,
      points: 1000, // Bonus pengguna baru
      avatar: role === 'farmer' 
        ? 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      referralCode: `AGRO${district.toUpperCase().slice(0, 4)}`,
      farmerDetails: role === 'farmer' ? {
        farmName: farmName || 'Kebun Tani Mandiri',
        poktanName: poktanName || 'Kelompok Tani Lumajang',
        nik: nik || '3508000000000000',
        bankName,
        accountNumber: accountNumber || '0281-0000-00',
        accountHolder: accountHolder || fullName || 'Petani Lumajang',
        balance: 2500000,
      } : undefined,
    };

    onLoginSuccess(newUser);
    onClose();
  };

  const handleQuickDemo = (demoKey: keyof typeof DEMO_USERS) => {
    onLoginSuccess(DEMO_USERS[demoKey]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with authentic AgroGo Logo */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-emerald-800 via-[#244F1F] to-emerald-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <Logo size="md" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {authMode === 'login' ? 'Masuk ke AgroGo Lumajang' : 'Pendaftaran Akun Baru'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/90 mt-1">
            Ekosistem jual beli hasil panen & peternakan segar langsung dari petani Kabupaten Lumajang.
          </p>

          {/* Role Tabs: Pembeli vs Penjual/Petani */}
          <div className="grid grid-cols-2 gap-2 mt-4 p-1 rounded-2xl bg-black/25 backdrop-blur-xs">
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                role === 'buyer'
                  ? 'bg-white text-emerald-900 shadow-md'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <User className="w-4 h-4 text-emerald-700" />
              <span>Akun Pembeli</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('farmer')}
              className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                role === 'farmer'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <Store className="w-4 h-4 text-stone-900" />
              <span>Akun Petani / Penjual</span>
            </button>
          </div>
        </div>

        {/* 1-Click Fast Demo Profil Switcher */}
        <div className="px-5 sm:px-6 pt-4 pb-2 bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800">
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pilih Cepat Akun Demo (Langsung Coba Semua Fitur):</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('premiumBuyer')}
              className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-left hover:border-amber-500 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 font-black text-amber-900 dark:text-amber-200">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span className="truncate">Salsa Tahara</span>
              </div>
              <p className="text-[10px] text-amber-700 dark:text-amber-300">👑 Pembeli Sultan (Bebas Iklan)</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('regularBuyer')}
              className="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-left hover:border-emerald-500 transition-all cursor-pointer"
            >
              <div className="font-bold text-stone-900 dark:text-stone-100 truncate">
                Rian Prasetyo
              </div>
              <p className="text-[10px] text-stone-500">🛒 Pembeli Reguler Tempeh</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('farmerUser')}
              className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 text-left hover:border-emerald-500 transition-all cursor-pointer"
            >
              <div className="font-black text-emerald-900 dark:text-emerald-200 truncate">
                Pak Slamet H.
              </div>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-300">🌾 Petani Senduro (Tarik Saldo)</p>
            </button>
          </div>
        </div>

        {/* Main Auth Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
          {/* Mode Switch (Masuk vs Daftar) */}
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <span className="font-bold text-stone-700 dark:text-stone-300">
              {authMode === 'login' ? 'Sudah punya akun? Masuk langsung' : 'Daftar akun baru sesuai regulasi e-commerce'}
            </span>
            <button
              type="button"
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              {authMode === 'login' ? 'Belum punya akun? Buat Akun' : 'Sudah punya akun? Masuk'}
            </button>
          </div>

          {/* Input Fields */}
          <div className="space-y-3">
            {authMode === 'register' && (
              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Nama Lengkap Sesuai KTP
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Salsa Tahara"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Nomor HP / WhatsApp Aktif
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Kata Sandi (Minimal 6 Karakter)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Pemilihan Daerah Spesifik Kecamatan di Lumajang */}
            <div>
              <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Kecamatan Domisili di Kabupaten Lumajang
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                >
                  {LUMAJANG_DISTRICTS.map((dist) => (
                    <option key={dist.id} value={dist.name}>
                      Kecamatan {dist.name} — {dist.specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Farmer Specific Verification Requirements */}
            {role === 'farmer' && (
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verifikasi Petani & Rekening Penarikan Hasil Penjualan</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                      Nama Kebun / Peternakan
                    </label>
                    <input
                      type="text"
                      placeholder="Cth: Kebun Susu Senduro Semeru"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                      Kelompok Tani (Poktan/Gapoktan)
                    </label>
                    <input
                      type="text"
                      placeholder="Cth: Poktan Sumber Makmur"
                      value={poktanName}
                      onChange={(e) => setPoktanName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                      Nomor KTP / NIK Petani
                    </label>
                    <input
                      type="text"
                      placeholder="3508xxxxxxxxxxxx"
                      value={nik}
                      onChange={(e) => setNik(e.target.value)}
                      className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                      Bank Pencairan Saldo
                    </label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 cursor-pointer"
                    >
                      <option value="Bank Jatim Cabang Lumajang">Bank Jatim Cabang Lumajang</option>
                      <option value="BRI Unit Senduro Lumajang">BRI Unit Senduro Lumajang</option>
                      <option value="BCA KCP Lumajang">BCA KCP Lumajang</option>
                      <option value="Bank Mandiri Lumajang">Bank Mandiri Lumajang</option>
                      <option value="DANA E-Wallet">DANA (Nomor HP Terdaftar)</option>
                      <option value="GoPay E-Wallet">GoPay (Nomor HP Terdaftar)</option>
                    </select>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-[11px] text-amber-900 dark:text-amber-200">
                  <p className="font-bold">Ketentuan Biaya Admin Penarikan 5%:</p>
                  <p className="text-amber-800 dark:text-amber-300 mt-0.5">
                    Penjual/Petani dikenakan biaya platform sebesar 5% dari setiap penarikan dana untuk pemeliharaan sistem rantai dingin (cold chain), server live video call inspeksi, dan asuransi pesanan.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Standard E-Commerce Terms Checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="auth-terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="auth-terms" className="text-[11px] text-stone-600 dark:text-stone-400 cursor-pointer">
              Saya menyetujui Ketentuan Layanan, Kebijakan Privasi AgroGo Lumajang, serta jaminan mutu panen asli petani Jawa Timur.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#244F1F] via-[#2F6527] to-emerald-700 hover:from-emerald-800 hover:to-emerald-900 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{authMode === 'login' ? 'Masuk ke Akun Saya' : 'Selesaikan Pendaftaran'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
