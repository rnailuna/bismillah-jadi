import React, { useState } from 'react';
import {
  X,
  Send,
  Video,
  MapPin,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Image as ImageIcon,
} from 'lucide-react';
import { Product, Farmer, ChatMessage } from '../../types';

interface LiveChatModalProps {
  product: Product | null;
  farmer: Farmer | null;
  isOpen: boolean;
  onClose: () => void;
  onStartVideoCall: (product: Product) => void;
}

export const LiveChatModal: React.FC<LiveChatModalProps> = ({
  product,
  farmer,
  isOpen,
  onClose,
  onStartVideoCall,
}) => {
  const currentFarmer = farmer || product?.farmer;
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'farmer',
      text: `Halo Kak! Selamat datang di ${currentFarmer?.farmName || 'Kebun Tani'}. Ada yang bisa kami bantu seputar hasil panen segar kami?`,
      timestamp: '10:14 WIB',
      productAttachment: product || undefined,
    },
    {
      id: 'm2',
      sender: 'farmer',
      text: 'Semua sayur dan buah kami dipetik langsung saat ada pesanan agar kesegaran dan gizinya tetap 100% prima!',
      timestamp: '10:15 WIB',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  if (!isOpen || !currentFarmer) return null;

  const quickReplies = [
    'Bisa dipetik subuh besok?',
    'Bagaimana tingkat kematangan buahnya?',
    'Bisa tolong video call untuk cek kondisi?',
    'Ada promo paket bundling?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'buyer',
      text: text.trim(),
      timestamp: 'Baru saja',
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputMsg('');

    // Farmer realistic auto-response
    setTimeout(() => {
      let reply = 'Baik Kak, terima kasih sudah bertanya. Kami jamin kualitas terbaik langsung dari kebun kami!';
      if (text.toLowerCase().includes('video call')) {
        reply = 'Tentu Kak! Silakan klik tombol "Mulai Video Call" di atas, saya sudah siap di kebun memperlihatkan langsung produknya.';
      } else if (text.toLowerCase().includes('subuh') || text.toLowerCase().includes('petik')) {
        reply = 'Bisa sekali Kak! Jadwal petik kami mulai pukul 05:00 WIB saat embun pagi masih menempel.';
      } else if (text.toLowerCase().includes('kematangan')) {
        reply = 'Kami seleksi hanya yang matang pohon alami tanpa karbit sama sekali, manis brix dan aromanya dijamin optimal.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `m-rep-${Date.now()}`,
          sender: 'farmer',
          text: reply,
          timestamp: 'Baru saja',
        },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-lg h-[86vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        
        {/* Chat Header */}
        <div className="p-3.5 sm:p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900/60">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentFarmer.avatar}
                alt={currentFarmer.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-stone-900" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                  {currentFarmer.name}
                </h4>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-[11px] text-stone-500">
                {currentFarmer.farmName} • <span className="text-emerald-600 font-semibold">Online</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {product && (
              <button
                onClick={() => {
                  onClose();
                  onStartVideoCall(product);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Mulai Video Call Langsung"
                id="btn-call-from-chat-header"
              >
                <Video className="w-3.5 h-3.5 text-amber-300" />
                <span>Video Call</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/50 dark:bg-stone-950/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'buyer' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                  msg.sender === 'buyer'
                    ? 'bg-emerald-700 text-white rounded-br-none shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-bl-none border border-stone-200 dark:border-stone-700 shadow-xs'
                }`}
              >
                {msg.text}

                {/* Product attachment snippet */}
                {msg.productAttachment && (
                  <div className="mt-2 p-2 rounded-xl bg-black/10 dark:bg-white/10 flex items-center gap-2">
                    <img
                      src={msg.productAttachment.images[0]}
                      alt={msg.productAttachment.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-bold truncate text-[11px]">{msg.productAttachment.name}</p>
                      <p className="font-extrabold text-[10px] text-amber-300">
                        Rp {msg.productAttachment.pricePerUnit.toLocaleString('id-ID')}/{msg.productAttachment.unit}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-stone-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 flex gap-1.5 overflow-x-auto no-scrollbar">
          {quickReplies.map((qr, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qr)}
              className="flex-shrink-0 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 text-stone-700 dark:text-stone-300 text-[11px] font-medium border border-stone-200 dark:border-stone-700 cursor-pointer"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="p-3 border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ketik pesan ke petani..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            className="flex-1 px-3.5 py-2 text-xs rounded-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-stone-900 dark:text-stone-100"
            id="chat-input-field"
          />

          <button
            onClick={() => handleSend()}
            className="p-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer transition-transform active:scale-95 shadow-xs"
            id="btn-send-chat"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
