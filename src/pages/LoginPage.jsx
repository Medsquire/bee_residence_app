import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  Building2,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, availableUsers } = useAuth();
  const { addToast } = useToast();

  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('bee123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotPhone, setForgotPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!phone) {
      setError('Please enter your mobile phone number.');
      return;
    }
    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = login(phone, password, rememberMe);
      setLoading(false);
      if (res.success) {
        addToast({
          title: `Welcome, ${res.user.name}!`,
          message: `Logged in to Flat 1204 (${res.user.role === 'HEAD' ? 'Household Head' : 'Member'}).`,
          type: 'success'
        });
        navigate('/dashboard');
      } else {
        setError(res.error);
      }
    }, 400);
  };

  const handleQuickLogin = (user) => {
    setPhone(user.phone);
    setPassword('bee123');
    setError('');
    const res = login(user.phone, 'bee123', true);
    if (res.success) {
      addToast({
        title: `Logged in as ${user.name}`,
        message: `Welcome to Flat 1204 (${user.role === 'HEAD' ? 'Head of Household' : 'Household Member'}).`,
        type: 'success'
      });
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Decorative ambient glowing circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-bee-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-bee-400 to-bee-600 shadow-glow mb-4 text-navy-950 font-black text-2xl tracking-tighter ring-4 ring-bee-400/20">
            BEE
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            BEE Residence
          </h1>
          <p className="text-sm font-medium text-bee-400/90 mt-1">
            Smart Living, Simplified.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-800/80 border border-navy-700 text-slate-300 text-xs">
            <Building2 className="w-3.5 h-3.5 text-bee-400" />
            <span>Bee Hive Residency • Flat A-1204</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-navy-900">Resident Login</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your registered mobile number and password to access your apartment.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2">
              <span className="shrink-0">•</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone input with +91 country prefix */}
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1.5">
                Mobile Number
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold text-xs border-r pr-2 border-slate-200">
                  <span className="text-slate-400 mr-1.5">🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full pl-20 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-navy-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-bee-500 focus:border-bee-500 transition-all"
                />
              </div>
            </div>

            {/* Password input with show/hide toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-navy-900">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-bee-700 hover:text-bee-800 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-navy-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-bee-500 focus:border-bee-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-bee-600 border-slate-300 rounded focus:ring-bee-500 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="ml-2 text-xs font-medium text-slate-600 cursor-pointer">
                Remember me on this browser
              </label>
            </div>

            {/* Sign in button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 text-sm font-bold shadow-md hover:shadow-lg"
              loading={loading}
            >
              Sign In to BEE Residence
            </Button>
          </form>

          {/* Quick Demo Credentials Selector */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-bee-600" />
              <p className="text-xs font-bold text-slate-700">
                1-Click Demo Login Personas:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin(availableUsers[0])}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-bee-50 border border-slate-200 hover:border-bee-300 text-left transition-all group"
              >
                <p className="text-xs font-bold text-navy-900 group-hover:text-bee-900 truncate">
                  Rajesh Kumar
                </p>
                <p className="text-[10px] font-semibold text-bee-600 uppercase">
                  Household Head
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(availableUsers[1])}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-bee-50 border border-slate-200 hover:border-bee-300 text-left transition-all group"
              >
                <p className="text-xs font-bold text-navy-900 group-hover:text-bee-900 truncate">
                  Priya Kumar
                </p>
                <p className="text-[10px] font-semibold text-slate-500 uppercase">
                  Household Member
                </p>
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-400 mt-3">
              Default password: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-navy-900 font-mono">bee123</code>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 mt-6">
          © 2026 BEE Residence. Smart Living, Simplified. Demonstration build.
        </p>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => {
          setShowForgotModal(false);
          setOtpSent(false);
        }}
        title="Reset Password"
        subtitle="Verification OTP will be sent to your registered mobile number."
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          {!otpSent ? (
            <>
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Registered Mobile Number
                </label>
                <input
                  type="tel"
                  value={forgotPhone}
                  onChange={(e) => setForgotPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setShowForgotModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="gold"
                  size="md"
                  onClick={() => {
                    if (forgotPhone.length >= 10) {
                      setOtpSent(true);
                      addToast({
                        title: 'Demo OTP Sent',
                        message: 'A 6-digit OTP has been dispatched to your phone (Demo OTP: 492810).',
                        type: 'info'
                      });
                    }
                  }}
                >
                  Send OTP
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-navy-900 text-sm">Demo Reset Dispatched</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                In production, an SMS OTP is verified with the society database. For this demo, please use password <code className="font-bold text-navy-900">bee123</code>.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setShowForgotModal(false);
                  setOtpSent(false);
                }}
              >
                Back to Sign In
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
