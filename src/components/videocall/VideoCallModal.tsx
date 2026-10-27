import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  MapPin,
  Camera,
  MessageSquare,
  CheckCircle2,
  Volume2,
  RefreshCw,
} from 'lucide-react';
import { Product } from '../../types';

interface VideoCallModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onInstantBuy?: (product: Product, quantity: number) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  onOpenChat?: (product: Product) => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  product,
  isOpen,
  onClose,
  onInstantBuy,
  onAddToCart,
  onOpenChat,
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [farmerCaptionIndex, setFarmerCaptionIndex] = useState(0);
  const [selectedQty, setSelectedQty] = useState(1);
  const [hasBought, setHasBought] = useState(false);
  const [useLocalCamera, setUseLocalCamera] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const farmerCaptions = product ? [
    `"Halo Kak! Selamat datang di ${product.farmer?.farmName || 'Kebun Tani'}, ${product.farmer?.city || 'Jawa'}. Ini saya perlihatkan langsung ${product.name} yang baru saja dipanen!"`,
    `"Lihat tekstur dan warnanya, Kak. Masih berembun segar dan tidak ada cacat atau layu sama sekali. Alami 100%!"`,
    `"Kami petik langsung dari pohon/lahan pagi ini, jadi vitamin dan nutrisinya masih maksimal. Mau saya sisihkan berapa ${product.unit}?"`,
    `"Bisa langsung klik tombol 'Beli Langsung' di layar Kak, nanti langsung saya kemas ke box thermal berpendingin!"`,
  ] : [];

  // Call timer
  useEffect(() => {
    if (!isOpen || !product) {
      setCallDuration(0);
      setHasBought(false);
      return;
    }

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    // Caption cycle every 6 seconds
    const captionInterval = setInterval(() => {
      if (farmerCaptions.length > 0) {
        setFarmerCaptionIndex((prev) => (prev + 1) % farmerCaptions.length);
      }
    }, 6000);

    return () => {
      clearInterval(timer);
      clearInterval(captionInterval);
    };
  }, [isOpen, product, farmerCaptions.length]);

  // Request actual camera if user wants to test
  const handleToggleLocalCamera = async () => {
    if (useLocalCamera) {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        localVideoRef.current.srcObject = null;
      }
      setUseLocalCamera(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setUseLocalCamera(true);
      } catch (err) {
        console.warn('Camera permission not granted or device unavailable, using farm feed simulation.', err);
        setUseLocalCamera(false);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[92vh] sm:h-[86vh] bg-stone-950 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col">
        
        {/* Top Floating Overlay: Farmer Info & Quality Badge */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md p-2 rounded-2xl border border-white/10 pointer-events-auto">
            <img
              src={product.farmer.avatar}
              alt={product.farmer.name}
              className="w-11 h-11 rounded-xl object-cover border-2 border-emerald-500"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white">{product.farmer.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-xs text-stone-300 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {product.farmer.farmName} • {product.farmer.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-600/90 text-white text-xs font-black tracking-wider uppercase backdrop-blur-md animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white" />
              LIVE INSPEKSI
            </span>
            <span className="px-3 py-1.5 rounded-full bg-stone-900/80 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold backdrop-blur-md">
              {formatDuration(callDuration)}
            </span>
          </div>
        </div>

        {/* Main Video Stream Container */}
        <div className="relative flex-1 w-full h-full bg-stone-900 flex items-center justify-center overflow-hidden">
          {/* Simulated Farmer High-Def Harvest Video Feed */}
          <div className="absolute inset-0">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover scale-105 animate-pulse"
              style={{ animationDuration: '4s' }}
            />
            {/* Organic environmental glare & camera noise texture */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60" />
            <div className="absolute inset-0 bg-emerald-950/20 mix-blend-color" />
          </div>

          {/* Subtitle / Farmer Live Speech Simulation */}
          <div className="absolute bottom-32 sm:bottom-28 left-4 right-4 z-20 flex justify-center pointer-events-none">
            <div className="max-w-xl bg-black/75 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center shadow-lg pointer-events-auto">
              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-bold mb-0.5">
                <Volume2 className="w-3.5 h-3.5" />
                {product.farmer.name} (Sedang Berbicara)
              </div>
              <p className="text-xs sm:text-sm text-white font-medium italic">
                {farmerCaptions[farmerCaptionIndex]}
              </p>
            </div>
          </div>

          {/* User's PIP (Picture in Picture) Camera Preview */}
          <div className="absolute top-20 right-4 z-20 w-28 h-36 sm:w-36 sm:h-48 rounded-2xl overflow-hidden border-2 border-white/40 shadow-xl bg-stone-800">
            {useLocalCamera ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-stone-900 text-stone-400 text-[11px]">
                <Camera className="w-6 h-6 text-stone-500 mb-1" />
                <span>Kamera Anda (Siap)</span>
                <button
                  onClick={handleToggleLocalCamera}
                  className="mt-1 px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-bold cursor-pointer"
                >
                  Buka WebCam
                </button>
              </div>
            )}
            <div className="absolute bottom-1 left-2 text-[10px] text-white/90 font-semibold bg-black/60 px-1.5 py-0.2 rounded">
              Anda (Konsumen)
            </div>
          </div>

          {/* Floating Product Quick Buy Widget directly inside Call */}
          <div className="absolute bottom-4 left-4 z-20 max-w-xs sm:max-w-sm w-full bg-stone-900/90 backdrop-blur-md p-3 rounded-2xl border border-stone-700 shadow-xl pointer-events-auto">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-12 h-12 rounded-xl object-cover border border-emerald-500"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-xs text-white truncate">{product.name}</h4>
                <div className="flex items-baseline gap-1">
                  <span className="font-black text-sm text-amber-400">
                    Rp {product.pricePerUnit.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-stone-400">/{product.unit}</span>
                </div>
              </div>
            </div>

            {hasBought ? (
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500 text-center text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Berhasil ditambahkan ke pesanan!
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-stone-700 rounded-xl bg-stone-800 text-white text-xs font-bold">
                  <button
                    onClick={() => setSelectedQty(Math.max(product.minOrder, selectedQty - 1))}
                    className="px-2 py-1.5 hover:bg-stone-700 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-2">{selectedQty}</span>
                  <button
                    onClick={() => setSelectedQty(selectedQty + 1)}
                    className="px-2 py-1.5 hover:bg-stone-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (onInstantBuy) {
                      onInstantBuy(product, selectedQty);
                    } else if (onAddToCart) {
                      onAddToCart(product, selectedQty);
                    }
                    setHasBought(true);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors"
                  id="btn-buy-inside-call"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Beli Sekarang (Rp {(product.pricePerUnit * selectedQty).toLocaleString('id-ID')})</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Call Control Bar */}
        <div className="bg-stone-950 p-4 border-t border-stone-800 flex items-center justify-center gap-4 z-30">
          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full transition-colors cursor-pointer ${
              isMuted ? 'bg-red-600 text-white' : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
            }`}
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={onClose}
            className="px-6 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            id="btn-end-videocall"
          >
            <PhoneOff className="w-5 h-5" />
            <span>Akhiri Panggilan</span>
          </button>

          {/* Video Toggle */}
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-3.5 rounded-full transition-colors cursor-pointer ${
              isVideoOff ? 'bg-red-600 text-white' : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
            }`}
            title={isVideoOff ? 'Nyalakan Kamera' : 'Matikan Kamera'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          {/* Chat with Farmer */}
          <button
            onClick={() => {
              onClose();
              if (onOpenChat) {
                onOpenChat(product);
              }
            }}
            className="p-3.5 rounded-full bg-stone-800 text-stone-200 hover:bg-stone-700 transition-colors cursor-pointer"
            title="Buka Chat Teks dengan Petani"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
