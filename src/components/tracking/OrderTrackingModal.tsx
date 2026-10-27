import React, { useState } from 'react';
import {
  X,
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  Thermometer,
  ShieldCheck,
  Navigation,
  Compass,
  Star,
  Send,
  Sparkles,
} from 'lucide-react';
import { Order } from '../../types';

interface OrderTrackingModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onContactDriver: (driverName: string) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  isOpen,
  onClose,
  onContactDriver,
}) => {
  const [activeTab, setActiveTab] = useState<'tracking' | 'items'>('tracking');
  const [showCourierChat, setShowCourierChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'courier'; text: string; time: string }>>([
    {
      sender: 'courier',
      text: 'Halo Kak! Saya Wahyu Prasetyo, kurir AgroGo Lumajang. Pesanan hasil panen Kakak sudah di dalam box termal bersuhu 3.8°C dan saat ini melintasi jalur Jl. Lintas Timur menuju alamat Anda. Mohon ditunggu ya Kak!',
      time: 'Baru saja',
    },
  ]);
  const [inputChat, setInputChat] = useState('');

  if (!isOpen || !order) return null;

  const handleSendToCourier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChat.trim()) return;

    const userText = inputChat.trim();
    const newMsg = { sender: 'user' as const, text: userText, time: 'Baru saja' };
    setChatMessages((prev) => [...prev, newMsg]);
    setInputChat('');

    setTimeout(() => {
      let reply = 'Siap Kak! Pesanan aman terjaga dingin. Segera saya kabari begitu tiba di depan pagar rumah Kakak.';
      if (userText.toLowerCase().includes('pos') || userText.toLowerCase().includes('satpam')) {
        reply = 'Siap Kak, nanti saya titipkan ke pos satpam lengkap dengan foto serah terima!';
      } else if (userText.toLowerCase().includes('uang') || userText.toLowerCase().includes('kembalian')) {
        reply = 'Tenang Kak, saya sudah siapkan uang kembalian pas di dompet!';
      }
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'courier',
          text: reply,
          time: 'Baru saja',
        },
      ]);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-stone-900 dark:text-stone-100">
                  Lacak Pengiriman Kurir Lumajang Real-Time
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-700 text-white">
                  Cold-Chain Aktif
                </span>
              </div>
              <p className="text-xs text-stone-500">
                No. Resi Panen: <span className="font-mono font-bold text-stone-700 dark:text-stone-300">{order.orderNumber}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 cursor-pointer"
            id="close-tracking-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Status highlight & Cold-Chain Temperature */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Status Terkini
                </span>
                <h4 className="font-extrabold text-sm text-stone-900 dark:text-stone-100">
                  {order.shippingStatus}
                </h4>
                <p className="text-xs text-stone-500">
                  Estimasi Tiba: <strong className="text-emerald-700 dark:text-emerald-400">{order.estimatedArrival}</strong>
                </p>
              </div>
            </div>

            {/* Live Temperature Monitor for Fresh Produce */}
            <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center flex-shrink-0">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                  Suhu Box Pendingin
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-stone-900 dark:text-stone-100">
                    {order.temperatureCelsius || 3.8}°C
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Cold-Chain Dingin</span>
                </div>
              </div>
            </div>
          </div>

          {/* DETAIL LENGKAP KURIR PENGANTAR (SIAPA YANG MEMBAWA) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-stone-900 dark:to-emerald-950/30 border-2 border-emerald-400 dark:border-emerald-700 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200 dark:border-emerald-800">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Kurir Resmi AgroGo yang Membawa Pesanan Anda</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                ✓ Sedang Berjalan Mengantar
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Foto Kurir & Biodata */}
              <div className="flex items-center gap-3.5">
                <div className="relative flex-shrink-0">
                  <img
                    src={order.courierPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={order.courierName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-stone-900 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  </span>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h5 className="font-black text-sm sm:text-base text-stone-900 dark:text-stone-100">
                      {order.courierName}
                    </h5>
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-black">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{order.courierRating || 4.98}</span>
                    </span>
                  </div>
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Kurir Kilat Box Cold-Chain AgroGo Lumajang ({order.courierTripsCount || 1842}+ Pengiriman)
                  </p>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 font-mono">
                    WhatsApp: <strong>{order.courierPhone}</strong>
                  </p>
                </div>
              </div>

              {/* Action Buttons Hubungi Kurir */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowCourierChat(!showCourierChat)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-transform active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{showCourierChat ? 'Tutup Chat' : 'Chat Kurir (WhatsApp)'}</span>
                </button>
                <a
                  href={`tel:${order.courierPhone.replace(/[^0-9]/g, '')}`}
                  className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Telepon Langsung"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Telepon</span>
                </a>
              </div>
            </div>

            {/* Interactive WhatsApp-style Driver Chat Simulation */}
            {showCourierChat && (
              <div className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-700 shadow-inner space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-1.5 border-b border-stone-100 dark:border-stone-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                  <span>Percakapan dengan {order.courierName.split(' ')[0]} (Kurir)</span>
                  <span className="text-emerald-600 font-normal">● Online</span>
                </div>

                <div className="space-y-2 max-h-44 overflow-y-auto p-1 text-xs">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-2.5 rounded-2xl ${
                          msg.sender === 'user'
                            ? 'bg-emerald-700 text-white rounded-br-none'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-bl-none'
                        }`}
                      >
                        <p className="text-xs leading-relaxed">{msg.text}</p>
                        <span className={`text-[9px] block text-right mt-0.5 ${msg.sender === 'user' ? 'text-emerald-200' : 'text-stone-400'}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendToCourier} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={inputChat}
                    onChange={(e) => setInputChat(e.target.value)}
                    placeholder="Ketik pesan untuk kurir (misal: titip satpam)..."
                    className="flex-1 p-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim</span>
                  </button>
                </form>
              </div>
            )}

            {/* Grid Detail Kendaraan, Plat Nomor & Posisi GPS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-emerald-200 dark:border-emerald-800 text-xs">
              {/* Jenis Kendaraan */}
              <div className="p-2.5 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-emerald-200/80 dark:border-stone-700">
                <span className="text-[10px] text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider block">
                  🛵 Armada Kendaraan
                </span>
                <p className="font-extrabold text-stone-800 dark:text-stone-200 mt-0.5 text-xs">
                  {order.vehicleType || 'Motor Box Termal Cold-Chain'}
                </p>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block mt-0.5">
                  Kapasitas Chiller 2-4°C
                </span>
              </div>

              {/* Plat Nomor Kendaraan */}
              <div className="p-2.5 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-emerald-200/80 dark:border-stone-700">
                <span className="text-[10px] text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider block">
                  🏷️ Plat Nomor Kendaraan
                </span>
                <p className="font-black text-stone-900 dark:text-stone-100 font-mono text-sm mt-0.5 tracking-wide">
                  {order.vehiclePlate || 'N 1945 AG (Lumajang)'}
                </p>
                <span className="text-[10px] text-stone-500 block mt-0.5">
                  Terdaftar Samsat Lumajang
                </span>
              </div>

              {/* Posisi GPS & Estimasi */}
              <div className="p-2.5 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-emerald-200/80 dark:border-stone-700">
                <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider block">
                  📍 Posisi Terkini (Live GPS)
                </span>
                <p className="font-bold text-stone-900 dark:text-stone-100 mt-0.5 text-xs truncate">
                  {order.liveGpsLocation || 'Jl. Lintas Timur Lumajang'}
                </p>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium block mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Tiba dalam 15-25 Menit</span>
                </span>
              </div>
            </div>
          </div>

          {/* Chronological Step Timeline */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs text-stone-900 dark:text-stone-100 uppercase tracking-wider">
              Rincian Perjalanan Hasil Panen
            </h4>

            <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200 dark:before:bg-stone-800">
              {order.trackingSteps.map((step, idx) => (
                <div key={idx} className="relative pl-8 flex items-start gap-3">
                  <div
                    className={`absolute left-1.5 top-1 w-4 h-4 rounded-full flex items-center justify-center -translate-x-1/2 ${
                      step.completed
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                        : step.current
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100 dark:ring-amber-950 animate-bounce'
                        : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                  >
                    {step.completed && <CheckCircle2 className="w-3 h-3" />}
                  </div>

                  <div className="flex-1 bg-stone-50 dark:bg-stone-800/60 p-3 rounded-2xl border border-stone-200/80 dark:border-stone-800">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <h5 className="font-extrabold text-stone-900 dark:text-stone-100">
                        {step.title}
                      </h5>
                      <span className="text-[11px] font-mono text-stone-500">{step.timestamp}</span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300">{step.description}</p>
                    <span className="inline-block mt-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                      📍 {step.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Garansi 100% Segar Sampai di Rumah</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold hover:opacity-90 cursor-pointer shadow-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
