import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Phone,
  Pencil,
  RotateCw,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import beeLogo from '../assets/bee-property-logo.jpg';

const EMPTY_OTP = ['', '', '', '', '', ''];

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginWithOtp } = useAuth();

  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(EMPTY_OTP);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const otpRefs = useRef([]);

  const formattedPhone = phone.length === 10
    ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
    : `+91 ${phone}`;

  const handlePhoneChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(cleaned);
    if (error) setError('');
  };

  const focusOtpIndex = (index) => {
    setTimeout(() => {
      otpRefs.current[index]?.focus();
    }, 20);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');

    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setOtpDigits(EMPTY_OTP);
    setOtpSent(true);
    setResent(false);
    focusOtpIndex(0);
  };

  const handleEditPhone = () => {
    setOtpSent(false);
    setOtpDigits(EMPTY_OTP);
    setResent(false);
    setError('');
  };

  const handleResendOtp = () => {
    setOtpDigits(EMPTY_OTP);
    setError('');
    setResent(true);
    setTimeout(() => setResent(false), 2000);
    focusOtpIndex(0);
  };

  const applyPastedDigits = (rawDigits, startIndex = 0) => {
    const digits = rawDigits.replace(/\D/g, '').slice(0, 6 - startIndex);
    if (!digits) return;

    const next = [...otpDigits];
    for (let i = 0; i < digits.length; i += 1) {
      if (startIndex + i < 6) {
        next[startIndex + i] = digits[i];
      }
    }
    setOtpDigits(next);
    if (error) setError('');

    const targetIndex = Math.min(startIndex + digits.length, 5);
    otpRefs.current[targetIndex]?.focus();
  };

  const handleOtpChange = (index, rawValue) => {
    const digits = rawValue.replace(/\D/g, '');
    if (digits.length > 1) {
      applyPastedDigits(digits, index);
      return;
    }

    const next = [...otpDigits];
    next[index] = digits;
    setOtpDigits(next);
    if (error) setError('');

    if (digits && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (otpDigits[index]) {
        const next = [...otpDigits];
        next[index] = '';
        setOtpDigits(next);
      } else if (index > 0) {
        const next = [...otpDigits];
        next[index - 1] = '';
        setOtpDigits(next);
        otpRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (index, e) => {
    e.preventDefault();
    const pasted = e.clipboardData?.getData('text') || '';
    applyPastedDigits(pasted, index);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const otpCode = otpDigits.join('');
    if (otpCode.length < 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = loginWithOtp(phone, otpCode);
      setLoading(false);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.error);
      }
    }, 250);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-gradient-to-br from-[#e8f2ff] via-[#dbeafe] to-[#e0e7ff] dark:from-[#070d1a] dark:via-[#0b1730] dark:to-[#0f172a]">
      {/* Ambient liquid-glass refraction orbs visible behind frosted containers */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-20 -left-16 w-80 h-80 rounded-full bg-blue-400/45 dark:bg-blue-500/25 blur-3xl" />
        <div className="absolute top-1/3 -right-16 w-80 h-80 rounded-full bg-sky-300/45 dark:bg-sky-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 w-80 h-80 rounded-full bg-indigo-400/35 dark:bg-indigo-500/25 blur-3xl" />
        {/* Floating glass rim accents framing the central card */}
        <div className="hidden sm:block absolute top-1/4 left-1/2 -translate-x-64 w-28 h-28 rounded-full bg-white/30 dark:bg-sky-400/10 border border-white/65 dark:border-white/15 backdrop-blur-md" />
        <div className="hidden sm:block absolute bottom-1/4 right-1/2 translate-x-64 w-24 h-24 rounded-full bg-white/25 dark:bg-indigo-400/10 border border-white/60 dark:border-white/15 backdrop-blur-md" />
      </div>

      <div className="w-full max-w-sm sm:max-w-md relative z-10">
        {/* Compact Brand Mark */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white/85 dark:border-white/20 shadow-[0_14px_30px_-8px_rgba(37,99,235,0.28),inset_0_1px_0_rgba(255,255,255,0.9)] mb-3.5 p-2 overflow-hidden">
            <img
              src={beeLogo}
              alt="Bee Property Logo"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-black dark:text-white tracking-tight">
            Bee Property
          </h1>
          <p className="text-[11px] font-medium tracking-[0.16em] uppercase text-blue-600 dark:text-sky-400 mt-1">
            Resident Portal
          </p>
        </div>

        {/* Frosted Liquid-Glass Login Card */}
        <div className="glass-login-card rounded-[30px] p-6 sm:p-7 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full bg-sky-300/25 dark:bg-sky-400/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-blue-400/20 dark:bg-indigo-500/15 blur-2xl" />

          {/* Card Header */}
          <div className="relative flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-black dark:text-white tracking-tight">
                Sign In
              </h2>
            </div>
            <div className="w-9 h-9 rounded-xl bg-white/55 dark:bg-slate-800/60 border border-white/80 dark:border-white/15 backdrop-blur-md flex items-center justify-center text-blue-600 dark:text-sky-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
              <ShieldCheck className="w-[18px] h-[18px]" strokeWidth={1.75} />
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="relative mb-4 px-3.5 py-2.5 rounded-2xl bg-rose-500/15 dark:bg-rose-500/20 backdrop-blur-md border border-rose-300/70 dark:border-rose-400/35 text-rose-700 dark:text-rose-200 text-xs font-medium flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={otpSent ? handleLogin : handleSendOtp} className="relative space-y-5">
            {!otpSent ? (
              <div>
                <label
                  htmlFor="mobile-number"
                  className="block text-xs font-medium text-slate-800 dark:text-slate-200 mb-2"
                >
                  Mobile Number
                </label>
                <div className="flex items-center rounded-2xl bg-white/55 dark:bg-slate-900/55 backdrop-blur-md border border-white/85 dark:border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] focus-within:border-blue-500 focus-within:bg-white/80 dark:focus-within:bg-slate-900/80 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all overflow-hidden">
                  <div className="pl-3.5 pr-3 py-3 flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-sky-300 border-r border-blue-200/70 dark:border-white/15 shrink-0">
                    <Phone className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>+91</span>
                  </div>
                  <input
                    id="mobile-number"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="Enter 10-digit number"
                    autoComplete="tel-national"
                    className="w-full px-3.5 py-3 bg-transparent text-sm font-medium tracking-wide text-black dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Confirmed Phone Glass Pill */}
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white/45 dark:bg-slate-800/45 backdrop-blur-md border border-white/75 dark:border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                  <div className="flex items-center gap-2 text-xs font-medium text-black dark:text-white">
                    <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" strokeWidth={1.75} />
                    <span>{formattedPhone}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleEditPhone}
                    aria-label="Edit mobile number"
                    title="Change Mobile Number"
                    className="p-1.5 rounded-xl bg-white/65 dark:bg-slate-900/60 border border-white/80 dark:border-white/15 text-blue-600 dark:text-sky-400 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                </div>

                {/* 6 Frosted Glass OTP Input Fields */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      Enter OTP
                    </span>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 transition-colors"
                    >
                      <RotateCw className="w-3 h-3" strokeWidth={1.75} />
                      <span>{resent ? 'Sent' : 'Resend'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpRefs.current[idx] = el;
                        }}
                        type="tel"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={(e) => handleOtpPaste(idx, e)}
                        aria-label={`OTP digit ${idx + 1}`}
                        autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                        className={`h-12 sm:h-[52px] w-full text-center text-base sm:text-lg font-semibold font-mono rounded-2xl backdrop-blur-md border text-black dark:text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all ${
                          digit
                            ? 'bg-white/75 dark:bg-slate-800/75 border-blue-500/70 dark:border-sky-400/60'
                            : 'bg-white/50 dark:bg-slate-900/50 border-white/80 dark:border-white/20 focus:border-blue-500 focus:bg-white/80 dark:focus:bg-slate-900/80'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Primary Luminous Glass Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-blue-600/90 to-sky-500/85 hover:from-blue-600 hover:to-sky-500 border border-white/55 text-white text-sm font-semibold shadow-[0_12px_28px_-6px_rgba(37,99,235,0.45),inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{otpSent ? 'Login' : 'Send OTP'}</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
