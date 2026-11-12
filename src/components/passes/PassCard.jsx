import React, { useState } from 'react';
import Badge from '../common/Badge';
import { QrCode, Copy, Check, Calendar, Clock, Car, ChevronRight, User } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function PassCard({ pass, onViewPass }) {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const statusVariants = {
    Active: 'primary',
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
      className="glass-stat-white rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between cursor-pointer group"
    >
      <div>
        {/* Pass Top Bar */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="font-mono text-[11px] font-medium text-blue-700 dark:text-sky-300 bg-blue-50/90 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-blue-200/80 dark:border-slate-700">
            {pass.id}
          </span>
          <Badge variant={statusVariants[pass.status] || 'neutral'} size="sm">
            {pass.status}
          </Badge>
        </div>

        {/* Guest name & category */}
        <h4 className="font-medium text-black dark:text-white text-sm sm:text-base leading-snug group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
          {pass.guestName}
        </h4>
        <p className="text-xs font-normal text-black/80 dark:text-slate-200 mt-0.5">
          {pass.category}{pass.purpose ? ` • ${pass.purpose}` : ''}
        </p>

        {/* Date & Time info */}
        <div className="mt-3 pt-2.5 border-t border-blue-100/70 dark:border-slate-700/70 space-y-1.5 text-xs text-black dark:text-slate-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" strokeWidth={1.5} />
            <span className="font-medium text-black dark:text-white">{pass.expectedDate}</span>
            {pass.expectedTime && (
              <>
                <span className="text-blue-400">•</span>
                <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" strokeWidth={1.5} />
                <span className="font-medium text-black dark:text-white">{pass.expectedTime}</span>
              </>
            )}
          </div>

          {pass.vehicleNumber && pass.vehicleNumber !== 'None (Cab/Walk-in)' && (
            <div className="flex items-center gap-2">
              <Car className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" strokeWidth={1.5} />
              <span className="font-mono text-[11px] font-medium text-black dark:text-white bg-blue-50/80 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-blue-100 dark:border-slate-700">{pass.vehicleNumber}</span>
            </div>
          )}
        </div>

        {/* OTP quick block */}
        <div className="mt-3 p-2.5 rounded-xl bg-blue-50/65 dark:bg-slate-800/75 border border-blue-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-medium text-blue-600 dark:text-sky-400 block tracking-wider">
              Gate Entry OTP
            </span>
            <span className="font-mono text-sm sm:text-base font-medium text-black dark:text-white tracking-wider">
              {pass.otp}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyOtp}
            className="p-1.5 rounded-lg bg-white/90 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 text-black dark:text-white hover:text-blue-600 hover:border-blue-300 transition-colors shadow-xs"
            title="Copy OTP"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={1.5} /> : <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t border-blue-100/70 dark:border-slate-700/70 flex items-center justify-between">
        <span className="text-xs font-normal text-black/75 dark:text-slate-300 flex items-center gap-1">
          <QrCode className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" strokeWidth={1.5} />
          <span>Digital QR Pass</span>
        </span>
        <span className="text-xs font-medium text-blue-600 dark:text-sky-400 inline-flex items-center gap-1">
          <span>View Ticket</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
        </span>
      </div>
    </div>
  );
}
