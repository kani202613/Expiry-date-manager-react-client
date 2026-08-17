import { ShieldCheck } from 'lucide-react';

export default function Logo({ size = 'medium', className = '' }) {
  const iconSizes = {
    small: 18,
    medium: 24,
    large: 36
  };

  const textSizes = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center p-2.5 rounded-xl bg-gradient-to-tr from-[#3498db] via-[#2980b9] to-[#e67e22] shadow-lg shadow-[#3498db]/30 transition-transform hover:scale-105">
        <ShieldCheck size={iconSizes[size] || 24} className="text-white" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e67e22] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#e67e22]"></span>
        </span>
      </div>
      <div className="flex flex-col">
        <span className={`font-extrabold tracking-tight text-white ${textSizes[size] || 'text-xl'}`}>
          Expiry<span className="text-[#e67e22]">Guard</span>
        </span>
        {size === 'large' && (
          <span className="text-xs text-slate-400 font-medium tracking-wider uppercase">
            Pantry & Medicine Tracker
          </span>
        )}
      </div>
    </div>
  );
}
