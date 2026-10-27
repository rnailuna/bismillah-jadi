import React from 'react';
import { MapPin, Compass, Sparkles, ArrowRight, Mountain, Droplets, Sun, Trees } from 'lucide-react';

interface NatureSpot {
  id: string;
  name: string;
  district: string;
  altitude: string;
  image: string;
  tagline: string;
  description: string;
  produceTag: string;
  produceCategory: string;
  accentColor: string;
  badgeGradient: string;
}

interface LumajangNatureShowcaseProps {
  onSelectDistrict: (districtName: string) => void;
  onFilterCategory?: (category: string) => void;
}

export const LumajangNatureShowcase: React.FC<LumajangNatureShowcaseProps> = ({
  onSelectDistrict,
  onFilterCategory,
}) => {
  const natureSpots: NatureSpot[] = [
    {
      id: 'spot-1',
      name: 'Air Terjun Tumpak Sewu',
      district: 'Pronojiwo',
      altitude: '850 mdpl',
      image: '/src/assets/images/lumajang_nature_tumpak_sewu_1792597521623.jpg',
      tagline: 'Tirai Air Suci Lereng Barat Semeru',
      description: 'Dikelilingi tebing curam berlumut hijau alami. Sumber mata air mineral murni yang mengairi perkebunan Salak Pondoh dan Kopi Semeru.',
      produceTag: 'Salak Pondoh Renyah & Sayur Dingin',
      produceCategory: 'buah',
      accentColor: 'from-emerald-500 to-teal-700',
      badgeGradient: 'bg-gradient-to-r from-emerald-600 to-teal-600',
    },
    {
      id: 'spot-2',
      name: 'Kebun Teh Kertowono',
      district: 'Gucialit',
      altitude: '1.200 mdpl',
      image: '/src/assets/images/lumajang_nature_kebun_teh_1792598459036.jpg',
      tagline: 'Hamparan Karpet Hijau Semeru Abadi',
      description: 'Perkebunan teh bersejarah sejak 1910 di dataran tinggi Gucialit. Suhu sejuk 16-20°C menghasilkan sayuran hijau berdaun renyah dan teh aromatik.',
      produceTag: 'Sayuran Brokoli Semeru & Teh Alami',
      produceCategory: 'sayur',
      accentColor: 'from-lime-500 to-emerald-700',
      badgeGradient: 'bg-gradient-to-r from-lime-600 to-emerald-600',
    },
    {
      id: 'spot-3',
      name: 'Danau Ranu Klakah & Ranu Bedali',
      district: 'Klakah',
      altitude: '350 mdpl',
      image: '/src/assets/images/lumajang_nature_ranu_klakah_1792598474146.jpg',
      tagline: 'Danau Vulkanik & Sentra Buah Eksotis',
      description: 'Danau alami yang tenang di kaki Gunung Lemongan. Tanah vulkanik subur menjadi rumah bagi pohon durian mentega tua ratusan tahun yang legit bermentega.',
      produceTag: 'Durian Mentega Klakah & Buah Tropis',
      produceCategory: 'buah',
      accentColor: 'from-amber-500 to-orange-600',
      badgeGradient: 'bg-gradient-to-r from-amber-500 to-orange-500',
    },
    {
      id: 'spot-4',
      name: 'Padang Rumput Lereng Senduro',
      district: 'Senduro',
      altitude: '900 mdpl',
      image: '/src/assets/images/lumajang_3d_hero_semeru_1792595228260.jpg',
      tagline: 'Sentra Peternakan Sapi Perah & Potong Senduro',
      description: 'Kawasan lembah hijau sejuk berkabut di bawah naungan Mahameru. Peternak lokal merawat sapi perah dan sapi potong dengan pakan rumput gajah segar bernutrisi tinggi.',
      produceTag: 'Susu Murni Segar & Daging Sapi Merah',
      produceCategory: 'peternakan',
      accentColor: 'from-rose-500 to-red-700',
      badgeGradient: 'bg-gradient-to-r from-rose-500 to-red-600',
    },
  ];

  const handleSpotClick = (spot: NatureSpot) => {
    onSelectDistrict(spot.district);
    if (onFilterCategory) {
      onFilterCategory(spot.produceCategory);
    }
    const target = document.getElementById('catalog-products-section');
    target?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-4 pt-2">
      
      {/* Header section with Lumajang terroir pride */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200/80 dark:border-stone-800 pb-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ekosistem Alam & Geografis Lumajang</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Pesona Alam & Asal Muasal Panen Segar AgroGo
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-2xl">
            Beda dari aplikasi e-commerce biasa, setiap hasil panen di AgroGo dapat ditelusuri langsung ke keindahan alam dan ketinggian tanah vulkanik Kabupaten Lumajang.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Klik lokasi untuk melihat panen daerah terkait</span>
        </div>
      </div>

      {/* 4 Majestic Nature Landscape Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {natureSpots.map((spot) => (
          <div
            key={spot.id}
            onClick={() => handleSpotClick(spot)}
            className="group relative h-80 sm:h-96 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 border border-stone-200/80 dark:border-stone-800 flex flex-col justify-between p-4"
          >
            {/* Background Image: Vivid, High-contrast, Bright Scenery */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={spot.image}
                alt={spot.name}
                className="w-full h-full object-cover filter brightness-105 saturate-135 transition-transform duration-700 group-hover:scale-110"
              />
              {/* Colorful gradient overlay that preserves bright landscape while keeping text readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-black/20 group-hover:via-stone-950/30 transition-colors" />
            </div>

            {/* Top Badges */}
            <div className="relative z-10 flex items-center justify-between gap-1.5">
              <span className={`px-2.5 py-1 rounded-full ${spot.badgeGradient} text-white font-black text-[10px] shadow-md flex items-center gap-1`}>
                <MapPin className="w-3 h-3 text-white" />
                <span>Kec. {spot.district}</span>
              </span>

              <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-black border border-white/20">
                {spot.altitude}
              </span>
            </div>

            {/* Bottom Content Area */}
            <div className="relative z-10 space-y-2 text-white">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                  {spot.tagline}
                </span>
                <h3 className="font-black text-base sm:text-lg leading-tight group-hover:text-amber-300 transition-colors">
                  {spot.name}
                </h3>
              </div>

              <p className="text-[11px] text-stone-200 line-clamp-3 font-normal leading-relaxed">
                {spot.description}
              </p>

              {/* Produce Association Badge & Explore Link */}
              <div className="pt-2 border-t border-white/20 flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-emerald-300 truncate max-w-[170px]">
                  🌱 {spot.produceTag}
                </span>

                <div className="w-7 h-7 rounded-full bg-white/20 group-hover:bg-amber-400 group-hover:text-stone-950 text-white flex items-center justify-center transition-all shadow-xs shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
