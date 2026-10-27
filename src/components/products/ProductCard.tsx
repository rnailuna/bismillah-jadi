import React from 'react';
import { Video, Star, ShoppingBag, Clock, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onStartVideoCall: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  onAddToCart,
  onStartVideoCall,
}) => {
  const savingsAmount = product.supermarketPrice - product.pricePerUnit;
  const savingsPercent = Math.round((savingsAmount / product.supermarketPrice) * 100);

  return (
    <div
      className="group relative bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 hover:border-emerald-500/80 dark:hover:border-emerald-500/80 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col overflow-hidden"
      id={`product-card-${product.id}`}
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100 dark:bg-stone-800 cursor-pointer" onClick={() => onOpenDetail(product)}>
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Harvest Freshness & Category Tags */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-700/90 backdrop-blur-md text-white shadow-xs">
            <Clock className="w-3 h-3 text-amber-300" />
            {product.harvestTimeAgo}
          </span>

          {/* Vibrant Category Indicator Badge */}
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white shadow-xs ${
            product.category === 'buah'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500'
              : product.category === 'sayur'
              ? 'bg-gradient-to-r from-emerald-600 to-lime-600'
              : product.category === 'peternakan'
              ? 'bg-gradient-to-r from-rose-600 to-red-600'
              : 'bg-gradient-to-r from-sky-600 to-blue-600'
          }`}>
            {product.subCategory}
          </span>

          {product.isPreOrder && (
            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-950 shadow-xs border border-amber-300">
              <Sparkles className="w-3 h-3 text-stone-900" />
              Pre-Order Panen
            </span>
          )}
        </div>

        {/* Live Video Call Quick Button Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStartVideoCall(product);
          }}
          className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-stone-950/85 hover:bg-emerald-600 backdrop-blur-md text-white text-[11px] font-bold transition-all shadow-md cursor-pointer border border-white/20"
          title="Video Call petani untuk cek kondisi hasil panen secara live"
          id={`btn-videocall-${product.id}`}
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <Video className="w-3.5 h-3.5 text-amber-300" />
          <span>Lihat Live</span>
        </button>

        {/* Savings Ribbon */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 text-white text-[10px] font-black tracking-tight shadow-md border border-rose-400/30">
            Hemat {savingsPercent}%
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Farmer & Location Origin */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1.5">
            <div className="flex items-center gap-1 font-medium truncate max-w-[160px]">
              <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span className="truncate">{product.originLocation}</span>
            </div>
            <span className="font-semibold text-stone-700 dark:text-stone-300 truncate max-w-[110px]">
              {product.farmer.name}
            </span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onOpenDetail(product)}
            className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          {/* Pre-Order Slot Info if PO */}
          {product.isPreOrder && product.preOrderQuota && (
            <div className="mt-2 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px]">
              <div className="flex justify-between font-semibold text-amber-900 dark:text-amber-200 mb-1">
                <span>Estimasi Panen: {product.preOrderEstimatedHarvest}</span>
                <span>{product.preOrderBooked}/{product.preOrderQuota} Slot</span>
              </div>
              <div className="w-full h-1.5 bg-amber-200 dark:bg-amber-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${((product.preOrderBooked || 0) / product.preOrderQuota) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Comparison Section */}
        <div className="space-y-2 pt-1 border-t border-stone-100 dark:border-stone-800/80">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-emerald-700 dark:text-emerald-400">
                Rp {product.pricePerUnit.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-stone-500 font-medium">/{product.unit}</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-stone-400">
              <span>Supermarket:</span>
              <span className="line-through text-stone-500">
                Rp {product.supermarketPrice.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Rating & Sold count */}
          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-stone-400 font-normal">({product.reviewCount})</span>
            </div>
            <span>Terjual {product.soldCount} {product.unit}</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => onOpenDetail(product)}
              className="w-full py-2 px-2 rounded-xl text-xs font-bold border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 transition-colors text-center cursor-pointer"
              id={`btn-detail-${product.id}`}
            >
              Detail
            </button>
            <button
              onClick={() => onAddToCart(product)}
              className="w-full py-2 px-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 hover:from-emerald-500 hover:to-teal-600 text-white flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-800/20 active:scale-95 cursor-pointer"
              id={`btn-add-cart-${product.id}`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span>+ Keranjang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
