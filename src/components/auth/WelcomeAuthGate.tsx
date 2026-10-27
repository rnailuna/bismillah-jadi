import React, { useState, useEffect } from 'react';
import {
  User,
  Store,
  ShieldCheck,
  CheckCircle2,
  Crown,
  Phone,
  Mail,
  Lock,
  MapPin,
  Sparkles,
  ArrowRight,
  Gift,
  KeyRound,
  Check,
  Compass,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, LumajangDistrict } from '../../types';
import { LUMAJANG_DISTRICTS, DEMO_USERS } from '../../data/mockData';
import { Logo } from '../common/Logo';

interface WelcomeAuthGateProps {
  onAuthenticate: (user: UserProfile) => void;
}

export const WelcomeAuthGate: React.FC<WelcomeAuthGateProps> = ({ onAuthenticate }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [identifierType, setIdentifierType] = useState<'phone' | 'email'>('phone');

  // Input states
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState(LUMAJANG_DISTRICTS[6].name); // Lumajang Kota default
  const [role, setRole] = useState<'buyer' | 'farmer'>('buyer');
  
  // Verification / OTP simulation step
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Splash Screen Intro: Tampilan logo HD sekejap 5 detik sebelum masuk ke menu buat akun
  const [splashCountdown, setSplashCountdown] = useState(5);

  useEffect(() => {
    if (!showSplash) return;
    const interval = setInterval(() => {
      setSplashCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowSplash(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showSplash]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) {
      alert(identifierType === 'phone' ? 'Harap masukkan nomor HP / WhatsApp aktif' : 'Harap masukkan email aktif');
      return;
    }
    // Advance to OTP verification
    setStep('otp');
    setOtpCode('');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);

      // Celebration confetti
      try {
        confetti({
          particleCount: 110,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2D5A27', '#F59E0B', '#10B981', '#FBBF24'],
        });
      } catch (err) {}

      const isPhone = identifierType === 'phone';
      const createdUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: fullName || (role === 'farmer' ? 'Mitra Petani Lumajang' : 'Warga Lumajang'),
        email: isPhone ? `${phoneOrEmail.replace(/[^0-9]/g, '')}@agrogo.id` : phoneOrEmail,
        phone: isPhone ? phoneOrEmail : '0812-3456-7890',
        role,
        district,
        address: `Kecamatan ${district}, Kabupaten Lumajang, Jawa Timur`,
        isPremium: false,
        points: 1000, // +1.000 AgroPoints welcome bonus
        avatar: role === 'farmer'
          ? 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        referralCode: `AGRO${district.toUpperCase().slice(0, 4)}`,
        hasStore: role === 'farmer',
        storeName: role === 'farmer' ? `Kebun Tani ${fullName || 'Lumajang'}` : undefined,
        farmerDetails: role === 'farmer' ? {
          farmName: `Kebun Tani ${fullName || 'Lumajang'}`,
          poktanName: 'Kelompok Tani Makmur Senduro',
          nik: '3508110908750002',
          bankName: 'Bank Jatim Cabang Lumajang',
          accountNumber: '0281-9921-88',
          accountHolder: fullName || 'Petani Lumajang',
          balance: 3500000,
        } : undefined,
      };

      onAuthenticate(createdUser);
    }, 900);
  };

  const handleQuickDemo = (demoKey: keyof typeof DEMO_USERS) => {
    onAuthenticate(DEMO_USERS[demoKey]);
  };

  // STEP 0: TAMPILAN LOGO SAJA SEKEJAP (5 DETIK) DENGAN LATAR HAMPARAN PEGUNUNGAN LUMAJANG HD
  if (showSplash) {
    return (
      <div
        onClick={() => setShowSplash(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950 text-white p-6 relative overflow-hidden select-none cursor-pointer"
        title="Ketuk untuk langsung lanjut"
      >
        {/* Hamparan Pemandangan Pegunungan di Lumajang (Gunung Semeru & Sawah Terasering Zamrud HD) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/lumajang_mountain_panorama_1792680677943.jpg"
            alt="Hamparan Pemandangan Pegunungan di Lumajang - Gunung Semeru & Lembah Pertanian"
            className="w-full h-full object-cover filter brightness-115 saturate-125 scale-100 transition-transform duration-5000 ease-out"
          />
          {/* Subtle natural sunlight gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-black/15 to-stone-950/30 backdrop-blur-[0.5px]" />
        </div>

        {/* Tampilan Logo Bulat HD Super Jelas */}
        <div className="relative z-10 flex flex-col items-center justify-center animate-fade-in space-y-6">
          {/* Zoomed HD Circular Logo with Radiant Glow */}
          <div className="relative group">
            <div className="absolute -inset-6 bg-gradient-to-r from-emerald-400 via-amber-400 to-lime-400 rounded-full blur-2xl opacity-90 animate-pulse" />
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full aspect-square overflow-hidden shadow-2xl border-4 border-white bg-white flex items-center justify-center p-1.5 ring-4 ring-emerald-400/60 transform transition-all duration-700 hover:scale-105">
              <img
                src="/src/assets/images/agrogo_hd_circle_logo_1792680702144.jpg"
                alt="AgroGo Logo Bulat HD"
                className="w-full h-full object-contain filter drop-shadow-md select-none"
              />
            </div>
          </div>

          {/* 5-Detik Countdown Timer Badge & Skip Option */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/25 text-white shadow-xl text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-300">Menyiapkan Pasar Panen</span>
            <span className="text-stone-400">•</span>
            <span className="text-amber-300 font-mono font-black">{splashCountdown}s</span>
            <span className="text-stone-400">|</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSplash(false);
              }}
              className="text-white hover:text-amber-300 transition-colors underline cursor-pointer"
            >
              Lewati
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center items-center p-3 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Cerah & Asri Natural Beauty Background of Lumajang (Hamparan Pegunungan Semeru) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/src/assets/images/lumajang_mountain_panorama_1792680677943.jpg"
          alt="Keindahan Alam Asri Lumajang - Hamparan Pegunungan Semeru"
          className="w-full h-full object-cover opacity-85 dark:opacity-80 filter brightness-105 saturate-125 scale-105 transition-transform duration-1000"
        />
        {/* Latar Belakang Transparan Cerah agar pemandangan alam terlihat jelas */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-emerald-950/40 to-stone-950/80 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto my-auto space-y-4">
        
        {/* Brand Header: Logo Bulat Sempurna HD & Highlight Tulisan AgroGo yang Cerah & Jelas */}
        <div className="text-center space-y-3">
          
          {/* Logo Bulat Sempurna, Lebih Terlihat & Tampilan HD Jelas */}
          <div className="inline-flex flex-col items-center justify-center">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 via-amber-400 to-lime-400 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />
              <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full aspect-square bg-white shadow-2xl border-3 border-emerald-400 ring-4 ring-white/30 overflow-hidden flex items-center justify-center p-1 transition-transform hover:scale-105">
                <img
                  src="/src/assets/images/agrogo_hd_circle_logo_1792680702144.jpg"
                  alt="AgroGo Logo Bulat HD"
                  className="w-full h-full object-contain filter drop-shadow-xs select-none"
                />
              </div>
            </div>

            {/* Micro Badge Wilayah Lumajang */}
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-amber-300 text-[10px] font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>E-COMMERCE HASIL PERTANIAN</span>
            </div>
          </div>

          {/* Tulisan Selamat Datang di AGROGO dengan highlight tipis putih mengikuti lekukan font (tanpa kotak) */}
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Selamat Datang di{' '}
            <span className="inline-block font-black tracking-tight drop-shadow-[0_0_1.5px_#ffffff] drop-shadow-[0_0_5px_rgba(255,255,255,0.75)]">
              <span className="text-emerald-400">AGRO</span>
              <span className="text-amber-400">GO</span>
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/95 max-w-md mx-auto drop-shadow-md font-medium leading-relaxed">
            Sebelum masuk ke aplikasi, silakan buat akun atau masuk menggunakan <strong>Email</strong> atau <strong>Nomor WhatsApp</strong> Anda.
          </p>
        </div>

        {/* 1-Click Fast Trial Profile Shortcuts */}
        <div className="p-3.5 rounded-2xl bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/15 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-300 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Opsi Masuk Cepat (Akun Uji Coba Demo):</span>
            </span>
            <span className="text-[10px] text-stone-400">1 Klik Langsung Masuk</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('premiumBuyer')}
              className="p-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-400/40 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 font-black text-amber-200">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate">Salsa Tahara</span>
              </div>
              <p className="text-[10px] text-amber-300/80">👑 Pembeli Sultan (Bebas Iklan)</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('farmerUser')}
              className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-left transition-all cursor-pointer"
            >
              <div className="flex items-center gap-1.5 font-black text-emerald-200">
                <Store className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate">Pak Slamet H.</span>
              </div>
              <p className="text-[10px] text-emerald-300/80">🌾 Petani Susu Senduro</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('regularBuyer')}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-left transition-all cursor-pointer"
            >
              <div className="font-bold text-stone-200 truncate">
                Rian Prasetyo
              </div>
              <p className="text-[10px] text-stone-400">🛒 Pembeli Reguler Tempeh</p>
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
          
          {/* Top Switcher: Daftar Akun Baru vs Masuk */}
          <div className="grid grid-cols-2 border-b border-stone-200 dark:border-stone-800 text-xs sm:text-sm font-black">
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setStep('input');
              }}
              className={`py-3.5 px-4 text-center transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              Daftar Akun Baru (Pengguna Baru)
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setStep('input');
              }}
              className={`py-3.5 px-4 text-center transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              Masuk ke Akun Terdaftar
            </button>
          </div>

          {/* STEP 1: INPUT DATA AKUN */}
          {step === 'input' && (
            <form onSubmit={handleSendOtp} className="p-5 sm:p-6 space-y-4 text-xs">
              
              {/* Role Toggle: Pembeli vs Petani/Penjual */}
              <div className="p-1 rounded-2xl bg-stone-100 dark:bg-stone-800 grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    role === 'buyer'
                      ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-400 shadow-sm'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>Akun Pembeli</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    role === 'farmer'
                      ? 'bg-amber-400 text-stone-950 shadow-sm'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <Store className="w-4 h-4 text-stone-900" />
                  <span>Akun Petani / Penjual</span>
                </button>
              </div>

              {/* Identifier Type Selector: Nomor HP/WhatsApp vs Email */}
              <div className="flex items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-2">
                <span className="font-bold text-stone-600 dark:text-stone-400">Pilih Metode:</span>
                <button
                  type="button"
                  onClick={() => {
                    setIdentifierType('phone');
                    setPhoneOrEmail('');
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    identifierType === 'phone'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Nomor HP / WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIdentifierType('email');
                    setPhoneOrEmail('');
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    identifierType === 'email'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Alamat Email</span>
                </button>
              </div>

              {/* Full Name (if registering) */}
              {authMode === 'register' && (
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Nama Lengkap Anda
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Salsa Tahara"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Identifier Input */}
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {identifierType === 'phone' ? 'Nomor HP / WhatsApp Aktif' : 'Alamat Email Aktif'}
                </label>
                <div className="relative">
                  {identifierType === 'phone' ? (
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  ) : (
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  )}
                  <input
                    type={identifierType === 'phone' ? 'tel' : 'email'}
                    required
                    placeholder={identifierType === 'phone' ? '0812-8899-2341' : 'salsa@email.com'}
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* District Selector (Lumajang focus) */}
              {authMode === 'register' && (
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Kecamatan Domisili di Kabupaten Lumajang
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                    >
                      {LUMAJANG_DISTRICTS.map((dist) => (
                        <option key={dist.id} value={dist.name}>
                          Kecamatan {dist.name} — {dist.specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Kata Sandi Akun
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* New User Perks Highlight */}
              {authMode === 'register' && (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-center gap-2.5 text-amber-900 dark:text-amber-200">
                  <Gift className="w-5 h-5 text-amber-500 shrink-0" />
                  <div className="text-[11px] leading-tight">
                    <span className="font-bold">Bonus Pendaftaran Pengguna Baru:</span>
                    <p className="text-amber-800 dark:text-amber-300 mt-0.5">
                      Dapatkan langsung <strong>+1.000 AgroPoints</strong> dan voucher potongan <strong>Rp 25.000</strong> saat pertama kali berbelanja.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit to OTP Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#244F1F] via-[#2F6527] to-emerald-700 hover:from-emerald-800 hover:to-emerald-900 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
                id="btn-submit-initial-auth"
              >
                <span>{authMode === 'register' ? 'Lanjut ke Verifikasi Akun' : 'Masuk ke Aplikasi'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: VERIFIKASI KODE OTP (EMAIL / WHATSAPP) */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="p-5 sm:p-6 space-y-4 text-xs">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                  <KeyRound className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="font-black text-base text-stone-900 dark:text-stone-100">
                  Verifikasi Kode OTP
                </h3>
                <p className="text-stone-500">
                  Kode 6-digit telah dikirimkan ke {identifierType === 'phone' ? 'WhatsApp' : 'Email'}:{' '}
                  <strong className="text-stone-900 dark:text-stone-100">{phoneOrEmail}</strong>
                </p>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1 text-center">
                  Masukkan 6-Digit Kode Verifikasi:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="882910"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full p-3 text-center rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xl tracking-widest font-black focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Fast autofill test button */}
              <button
                type="button"
                onClick={() => setOtpCode('882910')}
                className="w-full py-1.5 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 font-bold text-[11px] hover:bg-emerald-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Klik untuk Isi Kode Otomatis: 882910</span>
              </button>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="w-1/3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-2/3 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow-md cursor-pointer transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
                  id="btn-verify-otp-submit"
                >
                  {isVerifying ? (
                    <span>Memverifikasi...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-amber-300" />
                      <span>Verifikasi & Buka Aplikasi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
