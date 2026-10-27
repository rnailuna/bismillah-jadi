import React, { useState } from 'react';
import { Sparkles, Crown, ExternalLink, X } from 'lucide-react';
import { SponsoredAd } from '../../types';
import { SPONSORED_ADS } from '../../data/mockData';

interface SponsoredAdBannerProps {
  isPremium: boolean;
  onOpenPremium: () => void;
}

export const SponsoredAdBanner: React.FC<SponsoredAdBannerProps> = ({
  isPremium,
  onOpenPremium,
}) => {
  const [adIndex, setAdIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  // If user is premium subscriber, ads are 100% eliminated!
  if (isPremium) {
    return null;
  }

  if (isDismissed) {
    return null;
  }

  const currentAd: SponsoredAd = SPONSORED_ADS[adIndex % SPONSORED_ADS.length];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 my-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 border border-emerald-800/40 text-white p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Ad Left Section with Sponsor Tag & Description */}
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-emerald-500/30">
            <img
              src={currentAd.imageUrl}
              alt={currentAd.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/src/assets/images/lumajang_fresh_eggs_1792595225732.jpg';
              }}
            />
          </div>

          <div className="space-y-0.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-sm bg-stone-800 text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-stone-700">
                {currentAd.badge}
              </span>
              <span className="text-[11px] text-stone-400 truncate">
                {currentAd.sponsor}
              </span>
            </div>
            
            <h4 className="text-xs sm:text-sm font-bold text-stone-100 truncate">
              {currentAd.title}
            </h4>
            
            <p className="text-[11px] text-stone-300 hidden sm:block line-clamp-1">
              {currentAd.tagline}
            </p>
          </div>
        </div>

        {/* Ad Right Action & Premium Upgrade Hook */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0 border-t sm:border-t-0 border-stone-800 pt-2 sm:pt-0">
          <button
            onClick={onOpenPremium}
            className="text-[11px] font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer transition-colors"
            title="Hilangkan iklan dengan menjadi Member Sultan"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="underline">Bebas Iklan dengan Sultan</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => alert(`Membuka info sponsor: ${currentAd.title}`)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <span>{currentAd.ctaText}</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Tutup Iklan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
