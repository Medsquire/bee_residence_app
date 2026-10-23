import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useHousehold } from '../../context/HouseholdContext';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';
import { QrCode, Calendar, Clock, User, Phone, Car, FileText } from 'lucide-react';

const PASS_CATEGORIES = [
  'Guest / Family',
  'Courier / Delivery',
  'Cab (Uber/Ola/Rapido)',
  'Contractor / Interior',
  'Doctor / Home Care',
  'Other'
];

export default function CreatePassModal({ isOpen, onClose, onPassCreated }) {
  const { currentUser } = useAuth();
  const { createPreApprovedPass } = useHousehold();
  const { addToast } = useToast();

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    guestName: '',
    guestPhone: '',
    category: 'Guest / Family',
    purpose: '',
    expectedDate: today,
    expectedTime: '06:00 PM',
    vehicleNumber: '',
    instructions: 'Gate entry allowed with OTP or QR scan.'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required.';
    if (!formData.guestPhone.trim()) {
      newErrors.guestPhone = 'Contact phone number is required.';
    } else {
      const digits = formData.guestPhone.replace(/\D/g, '');
      if (digits.length < 10) {
        newErrors.guestPhone = 'Please enter a valid 10-digit phone number.';
      }
    }
    if (!formData.expectedDate) newErrors.expectedDate = 'Please select expected date.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const newPass = createPreApprovedPass(formData, currentUser);

      try {
        confetti({
          particleCount: 50,
          spread: 55,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      addToast({
        title: 'Visitor Pass Created!',
        message: `Pass generated for ${newPass.guestName} with OTP: ${newPass.otp}`,
        type: 'success'
      });

      // Reset
      setFormData({
        guestName: '',
        guestPhone: '',
        category: 'Guest / Family',
        purpose: '',
        expectedDate: today,
        expectedTime: '06:00 PM',
        vehicleNumber: '',
        instructions: 'Gate entry allowed with OTP or QR scan.'
      });
      setErrors({});
      onClose();

      if (onPassCreated) {
        onPassCreated(newPass);
      }
    } catch (err) {
      addToast({
        title: 'Error Generating Pass',
        message: 'Could not create pass. Please try again.',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Pre-Approved Visitor Pass"
      subtitle="Generates an instant QR code and OTP for seamless entry at the security gate."
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Guest Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Guest Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                name="guestName"
                value={formData.guestName}
                onChange={handleChange}
                placeholder="e.g. Vikram Sharma"
                className={`w-full pl-9 pr-3.5 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500 ${
                  errors.guestName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.guestName && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.guestName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Visitor Category <span className="text-rose-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-bee-500"
            >
              {PASS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Guest Phone & Purpose */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="tel"
                name="guestPhone"
                value={formData.guestPhone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className={`w-full pl-9 pr-3.5 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500 ${
                  errors.guestPhone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.guestPhone && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.guestPhone}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Visit Purpose (Optional)
            </label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="e.g. Dinner gathering / Birthday"
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500"
            />
          </div>
        </div>

        {/* Expected Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Visit Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                name="expectedDate"
                min={today}
                value={formData.expectedDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500"
              />
            </div>
            {errors.expectedDate && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.expectedDate}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Expected Arrival Time
            </label>
            <input
              type="text"
              name="expectedTime"
              value={formData.expectedTime}
              onChange={handleChange}
              placeholder="e.g. 07:00 PM"
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500"
            />
          </div>
        </div>

        {/* Vehicle plate (optional) & gate instructions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Vehicle Plate (Optional)
            </label>
            <div className="relative">
              <Car className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                placeholder="e.g. KA 01 MJ 1234"
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl uppercase font-mono focus:outline-none focus:ring-2 focus:ring-bee-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Instructions for Gate Security
            </label>
            <input
              type="text"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="e.g. Visitor parking in slot V-12"
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" size="md" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="gold" size="md" type="submit" loading={submitting}>
            Generate Visitor Pass
          </Button>
        </div>
      </form>
    </Modal>
  );
}
