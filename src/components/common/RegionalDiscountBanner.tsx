import React from 'react';
import { Tag, Sparkles, Gift, MapPin, ArrowRight, Zap, Crown } from 'lucide-react';
import { JavaCity, LumajangDistrict } from '../../types';

interface RegionalDiscountBannerProps {
  currentCity: JavaCity;
  selectedDistrict: LumajangDistrict;
  onOpenReferral: () => void;
  onApplyRegionalDiscount: (discountCode: string) => void;
}

export const RegionalDiscountBanner: React.FC<RegionalDiscountBannerProps> = ({
  currentCity,
  selectedDistrict,
  onOpenReferral,
  onApplyRegionalDiscount,
}) => {
  // Compute contextual flash discount based on selected Lumajang district
  const getDistrictPromo = () => {
    switch (selectedDistrict.id) {
      case 'lum-senduro':
        return {
          title: 'Panen Raya Susu & Kambing Senduro Semeru!',
          desc: `Warga Kec. Senduro & sekitarnya: Diskon 20% Susu Sapi Murni Pasteurisasi & Daging RPH langsung dari lereng Semeru.`,
          code: 'SENDURO20',
          badge: 'Hemat 20%',
        };
      case 'lum-tempursari':
        return {
          title: 'Pesta Pisang Mas Kirana Bersertifikat IG!',
          desc: `Area Kec. Tempursari: Diskon 22% Pisang Kirana Emas Matang Pohon langsung dari kebun rakyat Tempursari.`,
          code: 'KIRANALUMAJANG',
          badge: 'Hemat 22%',
        };
      case 'lum-sukodono':
        return {
          title: 'Sentra Telur Herbal Omega-3 Sukodono!',
          desc: `Pengantaran Kec. Sukodono: Potongan Rp 10.000 untuk Telur Herbal Bebas Antibiotik & Daging Ayam Kampung.`,
          code: 'SUKODONOSEGAR',
          badge: 'Potongan Rp 10rb',
        };
      case 'lum-klakah':
        return {
          title: 'Festival Durian Manis Ranu Klakah!',
          desc: `Kec. Klakah: Kuota Pre-Order Durian Mentega Pohon Tua diskon 20% + jaminan manis legit beralkohol tipis.`,
          code: 'KLAKAHMANIS',
          badge: 'Hemat 20%',
        };
      case 'lum-pronojiwo':
        return {
          title: 'Panen Salak Pondoh Manis Pronojiwo!',
          desc: `Kaki Semeru Pronojiwo: Diskon Kilat 15% Salak Renyah Matang Pohon dan Sayur Dingin Lereng Semeru.`,
          code: 'PRONOJIWOSEGAR',
          badge: 'Hemat 15%',
        };
      case 'lum-pasirian':
        return {
          title: 'Sentra Hortikultura & Cabai Pasirian!',
          desc: `Kawasan Pasirian: Diskon 20% Cabai Rawit Merah, Bawang Merah & Pisang Pasir Lumajang.`,
          code: 'PASIRIAN20',
          badge: 'Hemat 20%',
        };
      default:
        return {
          title: `Panen Segar Petani Kabupaten Lumajang!`,
          desc: `Kecamatan ${selectedDistrict.name}: Diskon Kilat 20% hasil bumi segar dari petani & peternak se-Lumajang.`,
          code: 'LUMAJANGSEGAR',
          badge: 'Diskon 20%',
        };
    }
  };

  const promo = getDistrictPromo();

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 pb-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Banner 1: Real-time Location-Based Flash Discount for Lumajang Districts */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 dark:from-emerald-950 dark:to-stone-900 text-white p-4 shadow-sm border border-emerald-700/50">
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-stone-950">
                  <Zap className="w-3 h-3 fill-stone-950" />
                  Real-Time Lokasi Lumajang
                </span>
                <span className="text-xs text-emerald-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-300" />
                  Kec. {selectedDistrict.name}
                </span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">{promo.title}</h3>
              <p className="text-xs text-emerald-100/90 line-clamp-2">{promo.desc}</p>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onApplyRegionalDiscount(promo.code)}
                  className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  id={`apply-promo-${promo.code}`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  Klaim Kode: <span className="underline">{promo.code}</span>
                </button>
                <span className="text-[11px] text-emerald-300/80">Langsung potong di keranjang</span>
              </div>
            </div>

            <div className="hidden sm:block text-right">
              <span className="inline-block px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-amber-300">
                {promo.badge}
              </span>
            </div>
          </div>
        </div>

        {/* Banner 2: First User Referral Program & Voucher Rp 25.000 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-950 dark:to-stone-900 text-white p-4 shadow-sm border border-amber-500/50">
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-stone-900 text-amber-300">
                  <Gift className="w-3 h-3 text-amber-300" />
                  Khusus Pengguna Baru Lumajang
                </span>
                <span className="text-xs text-amber-100 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-200" />
                  Kode Undangan
                </span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                Voucher Diskon Rp 25.000 via Tautan Referral
              </h3>
              <p className="text-xs text-amber-100/90">
                Daftar dengan kode teman (misal: <span className="font-mono font-bold text-amber-200">SALSALUMAJANG</span>). Dapatkan diskon belanja pertama langsung!
              </p>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={onOpenReferral}
                  className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  id="open-referral-banner-btn"
                >
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  <span>Klaim / Bagikan Kode</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <span className="text-[11px] text-amber-200/80">Bonus +500 AgroPoints</span>
              </div>
            </div>

            <div className="hidden sm:block text-right">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Gift className="w-6 h-6 text-amber-100 animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
