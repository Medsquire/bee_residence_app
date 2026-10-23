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
        <div className="rounded-3xl bg-gradient-to-br from-navy-900 via-navy-950 to-slate-950 text-white p-6 shadow-2xl border border-bee-500/30 relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-bee-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Ticket Header */}
          <div className="flex items-center justify-between pb-4 border-b border-navy-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-bee-500 text-navy-950 font-black flex items-center justify-center text-sm">
                BEE
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white tracking-wide">BEE Residence</h4>
                <p className="text-[10px] text-bee-400 font-semibold tracking-wider uppercase">
                  Digital Visitor Pass
                </p>
              </div>
            </div>
            <Badge
              variant={
                pass.status === 'Active'
                  ? 'gold'
                  : pass.status === 'Used'
                  ? 'neutral'
                  : 'danger'
              }
              size="sm"
            >
              {pass.status}
            </Badge>
          </div>

          {/* Guest Info */}
          <div className="mt-4">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Authorized Guest
            </p>
            <h3 className="text-xl font-black text-white mt-0.5 tracking-tight">
              {pass.guestName}
            </h3>
            <p className="text-xs text-bee-400 font-medium">{pass.category} • {pass.purpose}</p>
          </div>

          {/* QR Code & OTP Centerpiece */}
          <div className="mt-5 p-4 rounded-2xl bg-white/95 text-navy-950 flex flex-col items-center justify-center shadow-inner">
            <div className="p-2 bg-white rounded-xl shadow-xs">
              <QRCodeSVG
                value={pass.qrPayload || pass.id}
                size={140}
                level="M"
                includeMargin={false}
              />
            </div>

            {/* OTP Banner */}
            <div className="mt-3.5 w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-50 border border-amber-200">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Gate Entry OTP
                </p>
                <p className="font-mono text-xl font-black text-navy-950 tracking-widest">
                  {pass.otp}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyOtp}
                className="no-print p-2 rounded-lg bg-white border border-amber-200 text-slate-700 hover:text-bee-600 hover:border-bee-400 transition-colors shadow-xs"
                title="Copy OTP"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Pass Meta Grid */}
          <div className="mt-4 pt-3 border-t border-navy-800/80 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Destination</span>
              <span className="font-bold text-white">Tower A, Flat 1204</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Pass Number</span>
              <span className="font-mono font-bold text-bee-400">{pass.id}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Expected Arrival</span>
              <span className="font-medium text-slate-200">
                {pass.expectedDate} • {pass.expectedTime}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Vehicle Plate</span>
              <span className="font-mono font-medium text-slate-200">
                {pass.vehicleNumber || 'Walk-in / Cab'}
              </span>
            </div>
          </div>

          {pass.instructions && (
            <p className="mt-3 text-[11px] text-slate-300 italic bg-navy-900/60 p-2 rounded-lg border border-navy-800">
              "{pass.instructions}"
            </p>
          )}
        </div>

        {/* Action Buttons for User Interaction */}
        <div className="no-print space-y-2 pt-2">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              icon={Share2}
              onClick={handleShare}
            >
              Share Pass
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              icon={Printer}
              onClick={handlePrint}
            >
              Print Pass
            </Button>
          </div>

          {isActive && (
            <div className="flex gap-2 pt-1">
              <Button
                variant="success"
                className="flex-1"
                icon={CheckCircle2}
                onClick={handleSimulateGateEntry}
              >
                Simulate Gate Scan (Use Pass)
              </Button>
              <Button
                variant="danger"
                size="md"
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
