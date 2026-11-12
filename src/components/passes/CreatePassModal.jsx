import React, { useState } from 'react';
import Modal from '../common/Modal';
import FormActionFooter from '../common/FormActionFooter';
import { useAuth } from '../../context/AuthContext';
import { useHousehold } from '../../context/HouseholdContext';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';
import { User, Phone, Car } from 'lucide-react';

const PASS_CATEGORIES = [
  'Guest / Family',
  'Courier / Delivery',
  'Cab (Uber/Ola/Rapido)',
  'Contractor / Interior',
  'Doctor / Home Care',
  'Other'
];

const createInitialFormData = (defaultDate) => ({
  guestName: '',
  guestPhone: '',
  category: 'Guest / Family',
  expectedDate: defaultDate,
  vehicleNumber: ''
});

export default function CreatePassModal({ isOpen, onClose, onPassCreated }) {
  const { currentUser } = useAuth();
  const { createPreApprovedPass } = useHousehold();
  const { addToast } = useToast();

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState(() => createInitialFormData(today));

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
      setFormData(createInitialFormData(today));
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
      title="Pre Visitor Pass"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Guest Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div>
            <label className="block text-xs font-medium text-black dark:text-white mb-1">
              Guest Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-blue-600 dark:text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" strokeWidth={1.5} />
              <input
                type="text"
                name="guestName"
                value={formData.guestName}
                onChange={handleChange}
                placeholder="e.g. Vikram Sharma"
                className={`w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm glass-input rounded-xl focus:outline-none ${
                  errors.guestName ? 'border-rose-400 bg-rose-50/20' : ''
                }`}
              />
            </div>
            {errors.guestName && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.guestName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-black dark:text-white mb-1">
              Visitor Category <span className="text-rose-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-xs sm:text-sm glass-input rounded-xl font-medium text-black dark:text-white focus:outline-none"
            >
              {PASS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Guest Phone & Expected Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div>
            <label className="block text-xs font-medium text-black dark:text-white mb-1">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-blue-600 dark:text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" strokeWidth={1.5} />
              <input
                type="tel"
                name="guestPhone"
                value={formData.guestPhone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className={`w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm glass-input rounded-xl focus:outline-none ${
                  errors.guestPhone ? 'border-rose-400 bg-rose-50/20' : ''
                }`}
              />
            </div>
            {errors.guestPhone && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.guestPhone}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-black dark:text-white mb-1">
              Expected Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="expectedDate"
              min={today}
              value={formData.expectedDate}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-xs sm:text-sm glass-input rounded-xl focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
            />
            {errors.expectedDate && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.expectedDate}</p>
            )}
          </div>
        </div>

        {/* Vehicle plate */}
        <div>
          <label className="block text-xs font-medium text-black dark:text-white mb-1">
            Vehicle License Number
          </label>
          <div className="relative">
            <Car className="w-4 h-4 text-blue-600 dark:text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" strokeWidth={1.5} />
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              placeholder="e.g. MH 02 AB 1234 or Walk-in"
              className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm glass-input rounded-xl focus:outline-none uppercase"
            />
          </div>
        </div>

        {/* Footer: Frosted Glass Icon-Only Action Cards */}
        <FormActionFooter
          onCancel={onClose}
          submitting={submitting}
          submitLabel="Approve & Generate Pass"
        />
      </form>
    </Modal>
  );
}
