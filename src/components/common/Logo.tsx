import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  withTagline?: boolean;
  variant?: 'emblem' | 'full' | 'icon';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = true,
  withTagline = false,
  variant = 'combined',
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }[size];

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  }[size];

  const logoSrc = '/assets/aistudio/logo_agrogo_fiks_96e4e8f2.jpeg';

  return (
    <div className={`flex items-center gap-2.5 font-bold select-none ${className}`} id="agrogo-brand-logo">
      {/* HD Logo Image with clean crisp rendering */}
      <div className={`relative ${iconDimensions} aspect-square flex-shrink-0 rounded-2xl overflow-hidden shadow-sm border border-emerald-500/30 bg-white p-0.5 flex items-center justify-center transition-transform hover:scale-105 duration-200`}>
        <img
          src={logoSrc}
          alt="Logo Resmi AGROGO"
          className="w-full h-full object-contain object-center scale-105"
          style={{ imageRendering: 'auto' }}
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className={`tracking-tight flex items-center font-black ${textSizes}`}>
            <span className="text-[#2B4E1B] dark:text-emerald-400 tracking-wide font-extrabold">AGRO</span>
            <span className="text-[#F5A623] dark:text-amber-400 tracking-normal font-black">GO</span>
            <span className="ml-1 text-[10px] sm:text-xs font-bold text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 uppercase tracking-wider">
              Lumajang
            </span>
          </div>
          {withTagline && (
            <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium tracking-normal mt-0.5">
              Pasar Hasil Panen & Peternakan Asli Lumajang
            </span>
          )}
        </div>
      )}
    </div>
  );
};
