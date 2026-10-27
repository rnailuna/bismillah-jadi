import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  Tag,
  ArrowRight,
  ShieldCheck,
  Truck,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { CartItem, JavaCity, LumajangDistrict } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  currentCity: JavaCity;
  userPoints: number;
  onOpenCheckout: (summary: {
    items: CartItem[];
    subtotal: number;
    shippingCost: number;
    discountAmount: number;
    pointsRedeemed: number;
    finalTotal: number;
    voucherApplied: string;
  }) => void;
  selectedDistrict?: LumajangDistrict;
  isPremium?: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps & { selectedDistrict?: LumajangDistrict; isPremium?: boolean }> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currentCity,
  selectedDistrict,
  isPremium = false,
  userPoints = 0,
  onOpenCheckout,
  appliedPromoCode,
  onSetAppliedPromoCode,
}) => {
  const [promoInput, setPromoInput] = useState(appliedPromoCode || '');
  const [promoError, setPromoError] = useState('');
  const [usePoints, setUsePoints] = useState(false);
  const [coldChainPackaging, setColdChainPackaging] = useState(true); // thermal packaging + ice gel

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.pricePerUnit * item.quantity, 0);
  const packagingFee = coldChainPackaging ? 5000 : 0;
  const baseShipping = selectedDistrict ? selectedDistrict.shippingBaseCost : currentCity.shippingBaseCost;
  const shippingCost = isPremium ? 0 : (items.length > 0 ? baseShipping + packagingFee : 0);

  // Calculate voucher discount
  let discountAmount = 0;
  if (appliedPromoCode === 'PETANIKITA' || appliedPromoCode === 'AGROBARU' || appliedPromoCode === 'PANENRAYA') {
    discountAmount = Math.min(25000, subtotal);
  } else if (appliedPromoCode === 'LUMAJANGSEGAR' || appliedPromoCode === 'KIRANALUMAJANG' || appliedPromoCode === 'SULTAN20') {
    discountAmount = Math.round(subtotal * 0.2); // 20% off
  } else if (appliedPromoCode === 'JATIMJUARA') {
    discountAmount = Math.min(15000, subtotal);
  }

  // Calculate points redemption
  const pointsAvailable = userPoints ?? 0;
  const maxPointsRedeemable = Math.min(pointsAvailable, Math.max(0, subtotal - discountAmount));
  const pointsRedeemed = usePoints ? maxPointsRedeemable : 0;

  const finalTotal = Math.max(0, subtotal + shippingCost - discountAmount - pointsRedeemed);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();

    const validCodes = ['PETANIKITA', 'AGROBARU', 'PANENRAYA', 'JAWABARAT20', 'JATENGSEGAR', 'JATIMJUARA', 'JOGJAPANEN', 'BANTENSEGAR', 'JAKARTAPANEN', 'LEMBANGSEGAR'];
    if (validCodes.includes(code)) {
      onSetAppliedPromoCode(code);
      setPromoInput(code);
    } else {
      setPromoError('Kode promo tidak valid atau kadaluarsa');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 dark:border-stone-800 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900/60">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
              Keranjang Panen ({items.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 cursor-pointer"
            id="close-cart-drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Shipping region note */}
          <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/80 text-xs flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Tujuan Pengiriman:</span>
              <strong className="text-stone-900 dark:text-stone-100">{currentCity.name}</strong>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
              {currentCity.deliveryTimeDays}
            </span>
          </div>

          {items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-bold text-stone-700 dark:text-stone-300 text-sm">
                Keranjang belanjamu masih kosong
              </p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Yuk pilih sayur, buah segar, atau susu peternak lokal Jawa langsung dari kebun!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="p-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/50 flex gap-3 items-center shadow-xs"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-stone-200 dark:border-stone-700 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-stone-500">{product.farmer.farmName}</p>
                    <p className="text-xs font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
                      Rp {product.pricePerUnit.toLocaleString('id-ID')}{' '}
                      <span className="text-[10px] text-stone-400 font-normal">/{product.unit}</span>
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-xs">
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                          className="px-2 py-1 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-l cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 font-bold">{quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="px-2 py-1 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-r cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="text-stone-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                        title="Hapus dari keranjang"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div className="space-y-3 pt-2">
              {/* Cold-chain packaging option */}
              <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                <div className="flex items-start gap-2">
                  <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <div>
                    <p className="font-bold text-stone-900 dark:text-stone-100">
                      Packing Suhu Dingin (Cold-Chain)
                    </p>
                    <p className="text-[11px] text-stone-500">Box kardus tebal + ice gel pendingin khusus pangan</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={coldChainPackaging}
                  onChange={(e) => setColdChainPackaging(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Kode Promo / Referral (cth: PETANIKITA)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs uppercase bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-xs rounded-xl hover:opacity-90 cursor-pointer"
                  >
                    Pakai
                  </button>
                </div>
                {promoError && <p className="text-[11px] text-red-500 font-medium">{promoError}</p>}
                {appliedPromoCode && !promoError && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Kode {appliedPromoCode} aktif! Hemat Rp {discountAmount.toLocaleString('id-ID')}
                  </p>
                )}
              </form>

              {/* AgroPoints Redemption */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <div>
                    <p className="font-bold text-amber-950 dark:text-amber-200">
                      Tukarkan AgroPoints ({(userPoints ?? 0).toLocaleString('id-ID')} Poin)
                    </p>
                    <p className="text-[11px] text-amber-800/80 dark:text-amber-300">
                      Potongan langsung Rp {maxPointsRedeemable.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={usePoints}
                  onChange={(e) => setUsePoints(e.target.checked)}
                  disabled={userPoints === 0}
                  className="w-4 h-4 text-amber-500 rounded cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Drawer Bottom Checkout Calculation */}
        {items.length > 0 && (
          <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/80 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Total Belanja</span>
                <span className="font-semibold">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Ongkos Kirim Jawa ({currentCity.name})</span>
                <span className="font-semibold">Rp {shippingCost.toLocaleString('id-ID')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Diskon Voucher ({appliedPromoCode})</span>
                  <span>-Rp {discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              {pointsRedeemed > 0 && (
                <div className="flex justify-between text-amber-600 dark:text-amber-400 font-bold">
                  <span>Potongan AgroPoints</span>
                  <span>-Rp {pointsRedeemed.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between text-stone-900 dark:text-stone-100 font-extrabold text-sm sm:text-base">
                <span>Total Tagihan:</span>
                <span className="text-emerald-700 dark:text-emerald-400">
                  Rp {finalTotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenCheckout({
                  items,
                  subtotal,
                  shippingCost,
                  discountAmount,
                  pointsRedeemed,
                  finalTotal,
                  voucherApplied: appliedPromoCode,
                });
              }}
              className="w-full py-3 rounded-xl bg-[#244F1F] hover:bg-[#1B3F17] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
              id="proceed-to-checkout-btn"
            >
              <span>Lanjut ke Pembayaran Digital / COD</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
