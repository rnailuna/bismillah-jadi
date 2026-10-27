import React from 'react';
import {
  X,
  Crown,
  CheckCircle2,
  Sparkles,
  Zap,
  Truck,
  Tag,
  Bell,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onTogglePremium: (active: boolean) => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onTogglePremium,
}) => {
  if (!isOpen) return null;

  const isUserPremium = currentUser.isPremium;

  const benefits = [
    {
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      title: '100% Bebas Iklan (Ad-Free Experience)',
      desc: 'Semua banner iklan sponsor, iklan mitra tani, dan rekomendasi komersial otomatis dinonaktifkan untuk pengalaman berbelanja yang bersih dan mulus.',
    },
    {
      icon: <Truck className="w-5 h-5 text-emerald-600" />,
      title: 'Gratis Ongkir Tanpa Syarat & Minimum',
      desc: 'Bebas ongkir pengiriman kilat cold chain ke seluruh 21 kecamatan se-Kabupaten Lumajang dan subsidi ongkir antarkota Jawa Timur.',
    },
    {
      icon: <Tag className="w-5 h-5 text-blue-500" />,
      title: 'Voucer Diskon Eksklusif Sultan 20%',
      desc: 'Kupon diskon 20% otomatis tiap awal bulan + perolehan 2x lipat AgroPoints di setiap transaksi belanja hasil bumi.',
    },
    {
      icon: <Bell className="w-5 h-5 text-purple-500" />,
      title: 'Notifikasi Dini 24 Jam Sebelum Panen Raya',
      desc: 'Dapatkan kuota pre-order eksklusif 24 jam sebelum buah langka (Durian Klakah, Pisang Kirana Grade A) dipublikasikan ke publik.',
    },
    {
      icon: <Crown className="w-5 h-5 text-amber-500" />,
      title: 'Lencana VIP "👑 Sultan Lumajang"',
      desc: 'Tampil terhormat dengan badge member sultan, prioritas antrean kurir, dan layanan pelanggan prioritas VIP 24/7.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Premium Sultan */}
        <div className="p-6 bg-gradient-to-br from-amber-600 via-amber-700 to-stone-950 text-white relative overflow-hidden">
          {/* Subtle decorative circles */}
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-black/30 border border-amber-300/40 text-amber-300 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              AgroGo Sultan Lumajang
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Langganan Pembeli Premium
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-md">
            Nikmati panen terbaik Lumajang dengan kenyamanan maksimal tanpa iklan dan gratis ongkos kirim.
          </p>

          {/* Current User Status Banner */}
          <div className="mt-4 p-3.5 rounded-2xl bg-black/30 backdrop-blur-sm border border-amber-300/30 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-amber-200 uppercase font-bold">Status Akun Anda:</p>
              <p className="font-extrabold text-sm text-white flex items-center gap-1.5 mt-0.5">
                {isUserPremium ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Member Sultan Aktif ({currentUser.name})</span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
                    <span>Pembeli Reguler ({currentUser.name})</span>
                  </>
                )}
              </p>
            </div>
            
            <button
              onClick={() => onTogglePremium(!isUserPremium)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black shadow-xs cursor-pointer transition-all ${
                isUserPremium
                  ? 'bg-stone-200 text-stone-800 hover:bg-white'
                  : 'bg-amber-400 text-stone-950 hover:bg-amber-300 shadow-md'
              }`}
            >
              {isUserPremium ? 'Beralih ke Akun Reguler' : 'Aktifkan Demo Sultan'}
            </button>
          </div>
        </div>

        {/* Benefits List */}
        <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
            5 Keuntungan Utama Pelanggan Sultan Lumajang:
          </p>

          <div className="space-y-3">
            {benefits.map((b, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex items-start gap-3.5"
              >
                <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-xs shrink-0">
                  {b.icon}
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                    {b.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Plans Box */}
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-800 dark:to-stone-800/80 border border-amber-200 dark:border-amber-800/50">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400">Paling Hemat</span>
                <p className="font-black text-sm text-stone-900 dark:text-stone-100">Paket Sultan Bulanan</p>
                <p className="text-[11px] text-stone-500">Bisa dibatalkan kapan saja tanpa komitmen</p>
              </div>
              <div className="text-right">
                <span className="text-xs line-through text-stone-400">Rp 49.000</span>
                <p className="text-lg font-black text-amber-600 dark:text-amber-400">Rp 29.000<span className="text-xs font-normal text-stone-500">/bln</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 sm:p-6 bg-stone-100 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
          <div className="text-xs text-stone-500">
            <p className="font-bold text-stone-700 dark:text-stone-300">Garansi Kepuasan 100%</p>
            <p className="text-[10px]">Langsung aktif instan dalam hitungan detik</p>
          </div>

          <button
            onClick={() => {
              onTogglePremium(true);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer flex items-center gap-2 active:scale-95 transition-all"
          >
            <span>{isUserPremium ? 'Tutup & Simpan' : 'Mulai Langganan Sultan'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
