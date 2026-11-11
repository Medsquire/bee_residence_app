import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { QRCodeSVG } from 'qrcode.react';
import { useHousehold } from '../../context/HouseholdContext';
import { useToast } from '../../context/ToastContext';
import {
  Copy,
  Check,
  Printer,
  Share2,
  Calendar,
  Clock,
  Car,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Building2
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
    const text = `BEE Residence Gate Pass for ${pass.guestName}!\nPass ID: ${pass.id}\nGate Entry OTP: ${pass.otp}\nLocation: Bee Hive Residency, Tower A, Flat 1204\nValid on: ${pass.expectedDate} at ${pass.expectedTime}`;
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
    if (window.confirm('Cancel this digital visitor pass?')) {
      cancelPass(pass.id);
      addToast({
        title: 'Pass Cancelled',
        message: `Pass ${pass.id} has been deactivated.`,
        type: 'info'
      });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="space-y-4 print-pass-area">
        {/* Pass Digital Ticket Container */}
        <div className="rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-sky-600 text-white p-5 sm:p-6 shadow-glass-lg border border-white/40 relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-sky-300/30 rounded-full blur-2xl pointer-events-none" />

          {/* Ticket Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-white/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white text-blue-700 font-black flex items-center justify-center text-sm shadow-xs">
                B
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white tracking-wide">BEE Residence</h4>
                <p className="text-[10px] text-blue-100 font-bold tracking-wider uppercase">
                  Digital Visitor Pass
                </p>
              </div>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border backdrop-blur-xs ${
                pass.status === 'Active'
                  ? 'bg-white/20 text-white border-white/40'
                  : pass.status === 'Used'
                  ? 'bg-blue-900/40 text-blue-100 border-white/20'
                  : 'bg-rose-500/30 text-rose-100 border-rose-300/40'
              }`}
            >
              {pass.status}
            </span>
          </div>

          {/* Guest Info */}
          <div className="mt-3.5">
            <p className="text-[10px] uppercase font-bold text-blue-100 tracking-wider">
              Authorized Guest
            </p>
            <h3 className="text-xl font-black text-white mt-0.5 tracking-tight">
              {pass.guestName}
            </h3>
            <p className="text-xs text-blue-100 font-semibold">{pass.category} • {pass.purpose}</p>
          </div>

          {/* QR Code & OTP Centerpiece */}
          <div className="mt-4 p-4 rounded-2xl bg-white text-blue-950 flex flex-col items-center justify-center shadow-lg">
            <div className="p-2 bg-white rounded-xl shadow-xs">
              <QRCodeSVG
                value={pass.qrPayload || pass.id}
                size={140}
                level="M"
                includeMargin={false}
              />
            </div>

            {/* OTP Banner */}
            <div className="mt-3.5 w-full flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50 border border-blue-200">
              <div>
                <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                  Gate Entry OTP
                </p>
                <p className="font-mono text-xl font-black text-blue-950 tracking-widest">
                  {pass.otp}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyOtp}
                className="no-print p-2 rounded-xl bg-white border border-blue-200 text-slate-700 hover:text-blue-600 transition-colors shadow-xs"
                title="Copy OTP"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Pass Meta Grid */}
          <div className="mt-4 pt-3 border-t border-white/20 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-blue-100 block font-semibold uppercase">Destination</span>
              <span className="font-bold text-white">Tower A, Flat 1204</span>
            </div>
            <div>
              <span className="text-[10px] text-blue-100 block font-semibold uppercase">Pass Number</span>
              <span className="font-mono font-bold text-white">{pass.id}</span>
            </div>
            <div>
              <span className="text-[10px] text-blue-100 block font-semibold uppercase">Expected Arrival</span>
              <span className="font-medium text-blue-50">
                {pass.expectedDate} • {pass.expectedTime}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-blue-100 block font-semibold uppercase">Vehicle Plate</span>
              <span className="font-mono font-medium text-blue-50">
                {pass.vehicleNumber || 'Walk-in / Cab'}
              </span>
            </div>
          </div>

          {pass.instructions && (
            <p className="mt-3 text-[11px] text-blue-100 italic bg-white/10 p-2 rounded-xl border border-white/20">
              "{pass.instructions}"
            </p>
          )}
        </div>

        {/* Action Buttons for User Interaction */}
        <div className="no-print space-y-2 pt-1">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1 text-xs sm:text-sm py-2"
              icon={Share2}
              onClick={handleShare}
            >
              Share Pass
            </Button>
            <Button
              variant="secondary"
              className="flex-1 text-xs sm:text-sm py-2"
              icon={Printer}
              onClick={handlePrint}
            >
              Print Pass
            </Button>
          </div>

          {isActive && (
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <Button
                variant="primary"
                className="flex-1 text-xs sm:text-sm py-2"
                icon={CheckCircle2}
                onClick={handleSimulateGateEntry}
              >
                Simulate Gate Scan (Use)
              </Button>
              <Button
                variant="danger"
                size="md"
                className="text-xs sm:text-sm py-2"
                onClick={handleCancelPass}
              >
                Cancel Pass
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
