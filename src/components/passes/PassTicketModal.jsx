import React, { useState } from 'react';
import Modal from '../common/Modal';
import { QRCodeSVG } from 'qrcode.react';
import { useHousehold } from '../../context/HouseholdContext';
import { useToast } from '../../context/ToastContext';
import beeLogo from '../../assets/bee-property-logo.jpg';
import {
  Copy,
  Check,
  Printer,
  Share2,
  CheckCircle2,
  X
} from 'lucide-react';

export default function PassTicketModal({ pass, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const { markPassUsed, cancelPass } = useHousehold();
  const { addToast } = useToast();

  if (!pass) return null;

  const isActive = pass.status === 'Active';

  const handleCopyOtp = () => {
    navigator.clipboard?.writeText(pass.otp);
    setCopied(true);
    addToast({
      title: 'OTP Copied!',
      message: `Pass OTP ${pass.otp} copied to clipboard.`,
      type: 'success'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `BEE Residence Gate Pass for ${pass.guestName}!\nPass ID: ${pass.id}\nGate Entry OTP: ${pass.otp}\nLocation: Bee Hive Residency, Tower A, Flat 1204\nValid on: ${pass.expectedDate}${pass.expectedTime ? ` at ${pass.expectedTime}` : ''}`;
    if (navigator.share) {
      navigator.share({
        title: 'BEE Residence Guest Pass',
        text
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      addToast({
        title: 'Pass Link & Details Copied',
        message: 'Share this with your guest via WhatsApp or SMS.',
        type: 'info'
      });
    }
  };

  const handleSimulateGateEntry = () => {
    markPassUsed(pass.id);
    addToast({
      title: 'Gate Pass Verified & Used',
      message: `${pass.guestName} entered the gate using pass ${pass.id}.`,
      type: 'success'
    });
  };

  const handleCancelPass = () => {
    cancelPass(pass.id);
    addToast({
      title: 'Pass Cancelled',
      message: `Pass ${pass.id} has been deactivated.`,
      type: 'info'
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Visitor Gate Pass" maxWidth="max-w-md">
      <div className="space-y-3 print-pass-area">
        {/* Frosted Glass Digital Pass Card */}
        <div className="rounded-3xl bg-gradient-to-br from-white/75 via-sky-50/60 to-blue-100/65 dark:from-slate-900/70 dark:via-slate-800/60 dark:to-blue-950/65 backdrop-blur-xl p-4 sm:p-5 border border-white/85 dark:border-slate-700/80 shadow-[0_14px_32px_-8px_rgba(37,99,235,0.18),inset_0_1px_0_rgba(255,255,255,0.95)] relative overflow-hidden">
          {/* Ambient glass highlight */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-sky-400/20 dark:bg-sky-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Ticket Brand & Status */}
          <div className="flex items-center justify-between pb-3 border-b border-blue-200/60 dark:border-slate-700/70 relative">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white shadow-xs border border-blue-100/80 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                <img src={beeLogo} alt="Bee Property" className="w-full h-full object-contain" />
              </div>
              <div className="leading-tight">
                <h4 className="font-medium text-sm text-black dark:text-white tracking-tight">Bee Property</h4>
                <p className="text-[10px] text-blue-600 dark:text-sky-400 font-medium tracking-[0.12em] uppercase">
                  Digital Pass
                </p>
              </div>
            </div>
            <span
              className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border backdrop-blur-sm ${
                pass.status === 'Active'
                  ? 'bg-blue-600/10 dark:bg-sky-400/15 text-blue-700 dark:text-sky-300 border-blue-300/60 dark:border-sky-400/30'
                  : pass.status === 'Used'
                  ? 'bg-slate-500/10 text-black/75 dark:text-slate-300 border-slate-300/60 dark:border-slate-600'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-300/60 dark:border-rose-700/50'
              }`}
            >
              {pass.status}
            </span>
          </div>

          {/* Guest Info */}
          <div className="mt-3 relative">
            <p className="text-[10px] uppercase font-medium text-blue-600 dark:text-sky-400 tracking-[0.12em]">
              Authorized Guest
            </p>
            <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white mt-0.5 tracking-tight">
              {pass.guestName}
            </h3>
            <p className="text-xs font-normal text-black/75 dark:text-slate-300">
              {pass.category}{pass.purpose ? ` • ${pass.purpose}` : ''}
            </p>
          </div>

          {/* QR Code & OTP Glass Pedestal */}
          <div className="mt-3 p-3 rounded-2xl bg-white/75 dark:bg-slate-900/70 backdrop-blur-md border border-white/90 dark:border-slate-700/80 flex flex-col items-center justify-center shadow-xs relative">
            <div className="p-2 bg-white rounded-xl border border-blue-100/70 shadow-xs">
              <QRCodeSVG
                value={pass.qrPayload || pass.id}
                size={112}
                level="M"
                includeMargin={false}
              />
            </div>

            {/* OTP Banner */}
            <div className="mt-2.5 w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-blue-50/75 dark:bg-slate-800/85 border border-blue-100 dark:border-slate-700">
              <div>
                <p className="text-[10px] font-medium text-blue-700 dark:text-sky-400 uppercase tracking-wider">
                  Gate Entry OTP
                </p>
                <p className="font-mono text-lg sm:text-xl font-semibold text-black dark:text-white tracking-widest">
                  {pass.otp}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyOtp}
                className="no-print p-2 rounded-xl bg-white/90 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 text-black dark:text-white hover:text-blue-600 dark:hover:text-sky-400 transition-colors shadow-xs"
                title="Copy OTP"
                aria-label="Copy OTP"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Slim Pass Meta Grid */}
          <div className="mt-3 pt-2.5 border-t border-blue-200/55 dark:border-slate-700/70 grid grid-cols-2 gap-2 text-xs relative">
            <div className="px-2.5 py-1.5 rounded-xl bg-white/50 dark:bg-slate-900/40 border border-white/75 dark:border-slate-700/60">
              <span className="text-[10px] text-black/60 dark:text-slate-400 block font-medium uppercase tracking-wide">
                Destination
              </span>
              <span className="font-medium text-black dark:text-white">Tower A, Flat 1204</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-xl bg-white/50 dark:bg-slate-900/40 border border-white/75 dark:border-slate-700/60">
              <span className="text-[10px] text-black/60 dark:text-slate-400 block font-medium uppercase tracking-wide">
                Pass ID
              </span>
              <span className="font-mono font-medium text-black dark:text-white">{pass.id}</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-xl bg-white/50 dark:bg-slate-900/40 border border-white/75 dark:border-slate-700/60">
              <span className="text-[10px] text-black/60 dark:text-slate-400 block font-medium uppercase tracking-wide">
                Expected Arrival
              </span>
              <span className="font-medium text-black dark:text-white">
                {pass.expectedDate}{pass.expectedTime ? ` • ${pass.expectedTime}` : ''}
              </span>
            </div>
            <div className="px-2.5 py-1.5 rounded-xl bg-white/50 dark:bg-slate-900/40 border border-white/75 dark:border-slate-700/60">
              <span className="text-[10px] text-black/60 dark:text-slate-400 block font-medium uppercase tracking-wide">
                Vehicle
              </span>
              <span className="font-mono font-medium text-black dark:text-white truncate block">
                {pass.vehicleNumber && pass.vehicleNumber !== 'None (Cab/Walk-in)' ? pass.vehicleNumber : 'Walk-in / Cab'}
              </span>
            </div>
          </div>
        </div>

        {/* Frosted Glass Icon-Only Action Bar */}
        <div className="no-print pt-1">
          <div
            className={`grid ${
              isActive ? 'grid-cols-4' : 'grid-cols-2'
            } gap-2 p-1.5 rounded-2xl bg-blue-50/45 dark:bg-slate-800/55 backdrop-blur-md border border-white/85 dark:border-slate-700/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]`}
          >
            <button
              type="button"
              onClick={handleShare}
              title="Share Pass"
              aria-label="Share Pass"
              className="h-10 rounded-xl bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-blue-100/85 dark:border-slate-700 text-black dark:text-white hover:text-blue-600 dark:hover:text-sky-400 hover:bg-white shadow-[0_6px_14px_-4px_rgba(37,99,235,0.10),inset_0_1px_0_rgba(255,255,255,0.95)] inline-flex items-center justify-center active:scale-[0.97] transition-all"
            >
              <Share2 className="w-4 h-4" strokeWidth={1.7} />
            </button>

            <button
              type="button"
              onClick={handlePrint}
              title="Print Pass"
              aria-label="Print Pass"
              className="h-10 rounded-xl bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-blue-100/85 dark:border-slate-700 text-black dark:text-white hover:text-blue-600 dark:hover:text-sky-400 hover:bg-white shadow-[0_6px_14px_-4px_rgba(37,99,235,0.10),inset_0_1px_0_rgba(255,255,255,0.95)] inline-flex items-center justify-center active:scale-[0.97] transition-all"
            >
              <Printer className="w-4 h-4" strokeWidth={1.7} />
            </button>

            {isActive && (
              <>
                <button
                  type="button"
                  onClick={handleSimulateGateEntry}
                  title="Simulate Gate Scan (Use)"
                  aria-label="Simulate Gate Scan (Use)"
                  className="h-10 rounded-xl bg-gradient-to-br from-blue-600/85 via-blue-500/80 to-sky-500/85 dark:from-blue-600/85 dark:to-sky-500/80 backdrop-blur-md border border-white/75 dark:border-sky-300/45 text-white shadow-[0_8px_18px_-4px_rgba(37,99,235,0.35),inset_0_1px_0_rgba(255,255,255,0.65)] hover:from-blue-600 hover:to-sky-500 inline-flex items-center justify-center active:scale-[0.97] transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" strokeWidth={1.9} />
                </button>

                <button
                  type="button"
                  onClick={handleCancelPass}
                  title="Cancel Pass"
                  aria-label="Cancel Pass"
                  className="h-10 rounded-xl bg-white/65 dark:bg-slate-900/55 backdrop-blur-md border border-rose-200/80 dark:border-rose-700/60 text-rose-600 dark:text-rose-300 shadow-[0_6px_14px_-4px_rgba(244,63,94,0.16),inset_0_1px_0_rgba(255,255,255,0.95)] hover:bg-rose-50/90 dark:hover:bg-rose-950/60 hover:border-rose-300 inline-flex items-center justify-center active:scale-[0.97] transition-all"
                >
                  <X className="w-4 h-4" strokeWidth={1.9} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
