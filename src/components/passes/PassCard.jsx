import React, { useState } from 'react';
import Badge from '../common/Badge';
import { QrCode, Copy, Check, Calendar, Clock, Car, ChevronRight, User } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function PassCard({ pass, onViewPass }) {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const statusVariants = {
    Active: 'gold',
    Used: 'neutral',
    Expired: 'neutral',
    Cancelled: 'danger'
  };

  const handleCopyOtp = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(pass.otp);
    setCopied(true);
    addToast({
      title: 'OTP Copied!',
      message: `Pass OTP ${pass.otp} copied.`,
      type: 'success'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={() => onViewPass(pass)}
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-bee-400 hover:shadow-card cursor-pointer transition-all duration-200 p-5 flex flex-col justify-between group"
    >
      <div>
        {/* Pass Top Bar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-mono text-xs font-bold text-bee-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            {pass.id}
          </span>
          <Badge variant={statusVariants[pass.status] || 'neutral'}>
            {pass.status}
          </Badge>
        </div>

        {/* Guest name & category */}
        <h4 className="font-bold text-navy-900 text-base leading-snug group-hover:text-bee-600 transition-colors">
          {pass.guestName}
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">{pass.category} • {pass.purpose}</p>

        {/* Date & Time info */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-bee-600" />
            <span className="font-medium text-slate-800">{pass.expectedDate}</span>
            <span className="text-slate-400">•</span>
            <Clock className="w-3.5 h-3.5 text-bee-600" />
            <span className="font-medium text-slate-800">{pass.expectedTime}</span>
          </div>

          {pass.vehicleNumber && pass.vehicleNumber !== 'None (Cab/Walk-in)' && (
            <div className="flex items-center gap-2 text-slate-600">
              <Car className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono text-[11px] font-bold">{pass.vehicleNumber}</span>
            </div>
          )}
        </div>

        {/* OTP quick block */}
        <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Gate Entry OTP
            </span>
            <span className="font-mono text-sm font-black text-navy-900 tracking-wider">
              {pass.otp}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyOtp}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-bee-600 hover:border-bee-300 transition-colors shadow-xs"
            title="Copy OTP"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
          <QrCode className="w-3.5 h-3.5 text-slate-400" />
          <span>Digital QR Pass</span>
        </span>
        <span className="text-xs font-bold text-navy-900 group-hover:text-bee-600 inline-flex items-center gap-1">
          <span>View Ticket</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );
}
