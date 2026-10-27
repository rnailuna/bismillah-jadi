import React, { useState } from 'react';
import {
  X,
  Calendar,
  Bell,
  BellRing,
  Sparkles,
  MapPin,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { FruitHarvestCalendar } from '../../types';
import { FRUIT_HARVEST_CALENDAR } from '../../data/mockData';

interface HarvestCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribeNotification: (fruitName: string) => void;
  subscribedFruits: string[];
}

export const HarvestCalendarModal: React.FC<HarvestCalendarModalProps> = ({
  isOpen,
  onClose,
  onSubscribeNotification,
  subscribedFruits,
}) => {
  const [activeProvinceFilter, setActiveProvinceFilter] = useState<string>('Semua');

  if (!isOpen) return null;

  const filtered = activeProvinceFilter === 'Semua'
    ? FRUIT_HARVEST_CALENDAR
    : FRUIT_HARVEST_CALENDAR.filter(f => f.province === activeProvinceFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                Kalender & Notifikasi Waktu Panen Buah Jawa
              </h3>
              <p className="text-xs text-stone-500">
                Dapatkan notifikasi push otomatis saat buah petik tua pohon siap kirim
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-3 border-b border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 flex gap-1.5 overflow-x-auto">
          {['Semua', 'Jawa Barat', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur'].map((prov) => (
            <button
              key={prov}
              onClick={() => setActiveProvinceFilter(prov)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeProvinceFilter === prov
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {prov}
            </button>
          ))}
        </div>

        {/* Content List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((fruit) => {
              const isSubbed = subscribedFruits.includes(fruit.fruitName);

              return (
                <div
                  key={fruit.id}
                  className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 p-3.5 space-y-3 flex flex-col justify-between shadow-xs"
                >
                  <div className="flex gap-3">
                    <img
                      src={fruit.image}
                      alt={fruit.fruitName}
                      className="w-20 h-20 rounded-xl object-cover border border-stone-200 dark:border-stone-700 flex-shrink-0"
                    />

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                          fruit.harvestStatus === 'Sedang Panen Raya'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                        }`}>
                          {fruit.harvestStatus}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {fruit.sweetnessBrix}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm text-stone-900 dark:text-stone-100">
                        {fruit.fruitName}
                      </h4>
                      <p className="text-[11px] text-stone-500 line-clamp-1">{fruit.variety}</p>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {fruit.region} ({fruit.province})
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-700/80 text-xs space-y-1">
                    <div className="flex justify-between text-stone-600 dark:text-stone-300">
                      <span>Puncak Panen:</span>
                      <strong className="text-stone-900 dark:text-stone-100">{fruit.harvestPeakMonth}</strong>
                    </div>
                    {fruit.estimatedDaysToHarvest > 0 ? (
                      <div className="flex justify-between text-amber-600 dark:text-amber-400 font-bold">
                        <span>Estimasi Mulai Panen:</span>
                        <span>{fruit.estimatedDaysToHarvest} Hari Lagi</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                        <span>Status Hari Ini:</span>
                        <span>Siap Petik Segar Langsung</span>
                      </div>
                    )}
                  </div>

                  {/* Notification toggle button */}
                  <button
                    onClick={() => onSubscribeNotification(fruit.fruitName)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSubbed
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:opacity-90'
                    }`}
                  >
                    {isSubbed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Notifikasi Aktif (Akan Diberitahu Saat Petik)</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5" />
                        <span>Ingatkan Saya Saat Panen Dimulai</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-xs hover:opacity-90 cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
