import React from 'react';
import { X, Copy, Check, QrCode, ShieldCheck } from 'lucide-react';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  title?: string;
  subtitle?: string;
}

export const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  code,
  title = "Tracking QR Pass",
  subtitle = "Show this QR code at any drop-off station or courier scan point.",
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm rounded-[2rem] bg-white p-6 shadow-2xl border border-slate-100 transform transition-all animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <div className="text-center pt-2">
          <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-orange-50 text-[#FF6B00] mb-3">
            <QrCode className="size-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">{title}</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-[240px] mx-auto">{subtitle}</p>
        </div>

        {/* QR Code Canvas Representation */}
        <div className="my-6 mx-auto w-56 h-56 p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
          <div className="grid grid-cols-8 gap-1.5 w-44 h-44 bg-white p-3 rounded-xl shadow-sm">
            {Array.from({ length: 64 }, (_, i) => {
              const isCorner =
                (i < 3 && (i % 8 < 3)) ||
                (i > 40 && (i % 8 < 3)) ||
                (i < 3 && (i % 8 > 4)) ||
                ((i * 11 + 3) % 4 === 0) ||
                i === 27 || i === 28 || i === 35 || i === 36;
              return (
                <div
                  key={i}
                  className={`rounded-[2px] transition-all ${
                    isCorner ? 'bg-[#0F172A]' : 'bg-transparent'
                  }`}
                />
              );
            })}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <ShieldCheck className="size-3 text-emerald-500" /> Verified Pass
          </div>
        </div>

        {/* Code Bar & Copy Button */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200/80">
          <span className="font-mono text-sm font-bold text-slate-800 tracking-wider pl-2">{code}</span>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              copied
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200/60 shadow-sm'
            }`}
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Footer Note */}
        <p className="mt-4 text-center text-[11px] text-slate-400">
          Outstagram Encrypted ID • Anti-tracking verified
        </p>
      </div>
    </div>
  );
};
