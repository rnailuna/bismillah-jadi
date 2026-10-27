import React, { useState } from 'react';
import {
  X,
  Gift,
  Sparkles,
  Copy,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPoints: number;
  onClaimReferralBonus: (bonusPoints: number, voucherCode: string) => void;
  hasClaimedReferral: boolean;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({
  isOpen,
  onClose,
  userPoints = 0,
  onClaimReferralBonus,
  hasClaimedReferral,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const myReferralCode = 'SALSA-AGRO';

  if (!isOpen) return null;

  const handleApplyReferral = (e: React.FormEvent) => {
    e.preventDefault();
    const code = inputCode.trim().toUpperCase();

    if (!code) return;

    if (code === myReferralCode) {
      setStatusMsg('Kamu tidak dapat menggunakan kode referral sendiri.');
      return;
    }

    const validCodes = ['PETANIKITA', 'AGROBARU', 'PANENRAYA', 'TEMANTANI'];
    if (validCodes.includes(code)) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {}

      onClaimReferralBonus(500, code);
      setStatusMsg(`Selamat! Kode ${code} berhasil diklaim. Voucher diskon Rp 25.000 & bonus +500 AgroPoints telah ditambahkan.`);
    } else {
      setStatusMsg('Kode referral tidak ditemukan. Coba gunakan: PETANIKITA atau AGROBARU');
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}?ref=${myReferralCode}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-lg shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        
        {/* Header with warm festive golden styling */}
        <div className="p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg">Program Referral & AgroPoints</h3>
              <p className="text-xs text-amber-100">Khusus Pengguna Baru & Penggemar Panen Jawa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/20 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 text-xs">
          
          {/* Current Points Balance Box */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
                Saldo AgroPoints Anda:
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-amber-950 dark:text-amber-100">
                  {(userPoints ?? 0).toLocaleString('id-ID')}
                </span>
                <span className="text-amber-700 dark:text-amber-300 font-bold">Poin</span>
              </div>
              <p className="text-[10px] text-stone-500">
                Setara potongan Rp {(userPoints ?? 0).toLocaleString('id-ID')} saat checkout belanja panen.
              </p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-extrabold text-[10px]">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                Mitra Panen
              </span>
            </div>
          </div>

          {/* New User: Redeem Referral Invitation Code */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Punya Kode Undangan Teman?
            </h4>
            <p className="text-stone-500 text-[11px]">
              Pengguna baru yang mendaftar lewat kode teman langsung memperoleh Voucher Diskon Rp 25.000 dan bonus 500 Poin.
            </p>

            {hasClaimedReferral ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Voucher pengguna baru sudah aktif di akun Anda!
              </div>
            ) : (
              <form onSubmit={handleApplyReferral} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Cth: PETANIKITA atau AGROBARU"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 uppercase font-mono font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black cursor-pointer shadow-sm transition-colors"
                  >
                    Klaim
                  </button>
                </div>
                {statusMsg && (
                  <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    {statusMsg}
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Share Your Own Code to Friends */}
          <div className="space-y-2 pt-3 border-t border-stone-100 dark:border-stone-800">
            <h4 className="font-extrabold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600" />
              Bagikan Tautan Undangan Anda
            </h4>
            <p className="text-stone-500 text-[11px]">
              Dapatkan <strong>1.000 AgroPoints (Rp 10.000)</strong> setiap kali temanmu berhasil belanja hasil panen pertamanya!
            </p>

            <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between font-mono font-bold">
              <span className="text-stone-900 dark:text-stone-100">{myReferralCode}</span>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-sans font-bold cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copySuccess ? 'Disalin!' : 'Salin Tautan'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold hover:opacity-90 cursor-pointer text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
