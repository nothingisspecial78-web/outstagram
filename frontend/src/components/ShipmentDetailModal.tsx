import React from 'react';
import { X, CheckCircle2, Clock, Share2 } from 'lucide-react';

export interface ShipmentItem {
  id: string;
  from: [string, string]; // [Flag, City]
  to: [string, string];
  status: 'In Transit' | 'Delivered' | 'Pending';
  eta: string;
  sender: string;
  recipient: string;
  progress: number; // percentage
  timeline: {
    title: string;
    location: string;
    time: string;
    completed: boolean;
  }[];
}

interface ShipmentModalProps {
  shipment: ShipmentItem | null;
  onClose: () => void;
}

export const ShipmentDetailModal: React.FC<ShipmentModalProps> = ({ shipment, onClose }) => {
  if (!shipment) return null;

  const statusColors = {
    'In Transit': 'bg-orange-50 text-[#FF6B00] border-orange-200',
    'Delivered': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'Pending': 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar rounded-[2rem] bg-white p-6 shadow-2xl border border-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusColors[shipment.status]}`}>
            {shipment.status}
          </span>
          <span className="text-xs font-mono font-medium text-slate-400">#{shipment.id}</span>
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          {shipment.from[1]} ➔ {shipment.to[1]}
        </h3>

        {/* Route Card Graphic */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md">
          <div className="flex justify-between items-center text-xs opacity-90 font-medium">
            <span>{shipment.from[0]} {shipment.from[1]} (Origin)</span>
            <span>{shipment.to[0]} {shipment.to[1]} (Destination)</span>
          </div>

          {/* Progress Bar */}
          <div className="relative mt-4 mb-2 h-2 rounded-full bg-white/30">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${shipment.progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-4 rounded-full bg-white shadow-md flex items-center justify-center"
              style={{ left: `${shipment.progress}%` }}
            >
              <div className="size-2 rounded-full bg-[#FF6B00]" />
            </div>
          </div>

          <div className="flex justify-between items-center text-[11px] opacity-80 pt-1">
            <span>Dispatched</span>
            <span>Est. Arrival: {shipment.eta}</span>
          </div>
        </div>

        {/* Sender & Recipient Info */}
        <div className="mt-5 grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
          <div>
            <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Sender</p>
            <p className="font-bold text-slate-800 mt-0.5">{shipment.sender}</p>
            <p className="text-slate-500">{shipment.from[1]}</p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Recipient</p>
            <p className="font-bold text-slate-800 mt-0.5">{shipment.recipient}</p>
            <p className="text-slate-500">{shipment.to[1]}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Shipment Progress</h4>
          <div className="space-y-4 relative">
            <div className="absolute top-2.5 bottom-2.5 left-[15px] w-0.5 bg-slate-200" />
            {shipment.timeline.map((item, idx) => (
              <div key={idx} className="relative flex items-start gap-3.5">
                <div
                  className={`relative z-10 size-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm shrink-0 ${
                    item.completed
                      ? 'bg-[#FF6B00] text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <Clock className="size-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm leading-snug">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.location}</p>
                </div>
                <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Outstagram Delivery #${shipment.id}`,
                  text: `Tracking delivery from ${shipment.from[1]} to ${shipment.to[1]}`,
                  url: window.location.href,
                }).catch(() => {});
              }
            }}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <Share2 className="size-4" /> Share Tracking
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
