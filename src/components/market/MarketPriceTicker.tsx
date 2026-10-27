import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Info, X, ShieldCheck, ArrowUpRight, Store } from 'lucide-react';
import { MarketPriceData } from '../../types';
import { MARKET_PRICES } from '../../data/mockData';

interface MarketPriceTickerProps {
  onSelectCommodity?: (commodityName: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  marketPrices?: MarketPriceData[];
}

export const MarketPriceTicker: React.FC<MarketPriceTickerProps> = ({
  onSelectCommodity,
  isOpen,
  onClose,
  onOpen,
  marketPrices = MARKET_PRICES,
}) => {
  const [activeCategory, setActiveCategory] = useState<'semua' | 'sayur' | 'buah' | 'peternakan'>('semua');
  const [selectedItem, setSelectedItem] = useState<MarketPriceData | null>(marketPrices[0] || null);

  const filteredPrices = activeCategory === 'semua'
    ? marketPrices
    : marketPrices.filter(p => p.category === activeCategory);

  return (
    <>
      {/* Marquee / Interactive Strip on homepage */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2">
        <div className="bg-stone-100 dark:bg-stone-800/80 rounded-xl p-2.5 border border-stone-200 dark:border-stone-700 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Info Harga Pasar Jawa Real-Time:
            </span>
            <span className="hidden md:inline text-stone-500 text-[11px]">
              Data Pusat Pasar Induk Jawa & Ritel Supermarket
            </span>
          </div>

          {/* Quick price chips */}
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 no-scrollbar flex-1 max-w-2xl">
            {MARKET_PRICES.map((item) => {
              const diffPct = Math.round(((item.supermarketPrice - item.agrogoPrice) / item.supermarketPrice) * 100);
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    onOpen?.();
                  }}
                  className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 hover:border-emerald-500 transition-all text-[11px] cursor-pointer"
                >
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{item.commodityName}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    Rp {item.agrogoPrice.toLocaleString('id-ID')}/{item.unit}
                  </span>
                  <span className="px-1 py-0.2 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                    Hemat {diffPct}%
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onOpen?.()}
            className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-0.5 text-xs flex-shrink-0 cursor-pointer"
            id="view-all-market-prices-link"
          >
            Lihat Analisis Pasar <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Detail Modal: Market Price Comparison & Farmer Advice */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900/50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                    Radar Harga Pasar Real-Time Jawa
                  </h3>
                  <p className="text-xs text-stone-500">
                    Perbandingan Harga AgroGo vs Pasar Induk vs Supermarket Ritel
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
                id="close-market-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
              {/* Value Proposition Box */}
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 flex items-start gap-3 text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-emerald-900 dark:text-emerald-200">
                    Mengapa AgroGo Lebih Murah bagi Pembeli & Menguntungkan Petani?
                  </p>
                  <p className="text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed">
                    Sistem <strong>Direct Farm-to-Consumer (F2C)</strong> memotong hingga 4 lapis tengkulak & tengkulak pasar induk. Petani mendapatkan harga jual 15-25% di atas tengkulak desa, sementara pembeli berhemat 20-45% dibanding supermarket mall.
                  </p>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {(['semua', 'sayur', 'buah', 'peternakan'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    {cat === 'semua' ? 'Semua Komoditas' : cat}
                  </button>
                ))}
              </div>

              {/* Commodities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredPrices.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  const discountVsSupermarket = Math.round(
                    ((item.supermarketPrice - item.agrogoPrice) / item.supermarketPrice) * 100
                  );

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/60 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-extrabold text-sm text-stone-900 dark:text-stone-100">
                            {item.commodityName}
                          </h4>
                          <span className="text-[11px] text-stone-400">{item.updatedAt}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {item.trend === 'naik' ? (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400">
                              <TrendingUp className="w-3 h-3" /> +{item.priceChangePercent}%
                            </span>
                          ) : item.trend === 'turun' ? (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                              <TrendingDown className="w-3 h-3" /> {item.priceChangePercent}%
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                              <Minus className="w-3 h-3" /> Stabil
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Three-Way Comparison Bar */}
                      <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-stone-100/80 dark:bg-stone-900/80 text-center text-xs mb-2">
                        <div>
                          <p className="text-[10px] text-stone-500">Harga AgroGo</p>
                          <p className="font-extrabold text-emerald-600 dark:text-emerald-400">
                            Rp {item.agrogoPrice.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-stone-500">Pasar Induk</p>
                          <p className="font-bold text-stone-700 dark:text-stone-300">
                            Rp {item.traditionalMarketPrice.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-stone-500">Supermarket</p>
                          <p className="font-bold text-red-600 dark:text-red-400 line-through">
                            Rp {item.supermarketPrice.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-emerald-700 dark:text-emerald-300">
                          Konsumen hemat {discountVsSupermarket}%
                        </span>
                        <span className="text-stone-500">per {item.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Strategy Advice Box for Local Farmers */}
              {selectedItem && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-extrabold text-xs mb-1.5">
                    <Store className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    Panduan Strategi Jual Petani: {selectedItem.commodityName}
                  </div>
                  <p className="text-xs text-amber-950/90 dark:text-amber-300/90 leading-relaxed">
                    {selectedItem.farmerRecommendation}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 flex items-center justify-between text-xs">
              <span className="text-stone-500 text-[11px]">
                Diperbarui otomatis dari bursa pangan DKI Jakarta, Jawa Barat, Jawa Tengah & Jawa Timur.
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
              >
                Tutup Info
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
