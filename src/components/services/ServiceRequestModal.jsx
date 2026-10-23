import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useHousehold } from '../../context/HouseholdContext';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';
import { Wrench, Calendar, Clock, AlertTriangle, Building, Phone, User } from 'lucide-react';

const SERVICE_CATEGORIES = [
  'Plumbing',
  'Electrical Repairs',
  'Water Pump and Motor',
  'Cleaning',
  'Sanitation',
  'Air Conditioning',
  'Washing Machine',
  'Television',
  'Wi-Fi and Internet',
  'Carpentry',
  'Painting',
  'Pest Control',
  'Refrigerator',
  'Other Maintenance'
];

const TIME_SLOTS = [
  'Morning (09:00 AM - 12:00 PM)',
  'Afternoon (12:00 PM - 03:00 PM)',
  'Evening (03:00 PM - 06:00 PM)',
  'Night (06:00 PM - 08:00 PM)'
];

const URGENCY_LEVELS = [
  { level: 'Urgent', desc: 'Active hazard/leak (Within 2-4 hrs)', color: 'text-rose-600 border-rose-300 bg-rose-50' },
  { level: 'High', desc: 'Disruptive issue (Within 24 hrs)', color: 'text-amber-600 border-amber-300 bg-amber-50' },
  { level: 'Normal', desc: 'Standard repair (1-2 days)', color: 'text-navy-700 border-slate-300 bg-slate-50' },
  { level: 'Can Wait', desc: 'Routine / Non-critical', color: 'text-slate-600 border-slate-200 bg-white' }
];

export default function ServiceRequestModal({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const { household, addServiceRequest } = useHousehold();
  const { addToast } = useToast();

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    category: 'Plumbing',
    title: '',
    description: '',
    urgency: 'Normal',
    preferredDate: today,
    preferredTimeSlot: TIME_SLOTS[0],
    instructions: ''
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
    if (!formData.title.trim()) newErrors.title = 'Please provide a short problem title.';
    if (!formData.description.trim()) newErrors.description = 'Please describe the problem in detail.';
    if (!formData.preferredDate) newErrors.preferredDate = 'Please select your preferred date.';
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
      const ticketId = addServiceRequest(formData, currentUser);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // Confetti fallback
      }

      addToast({
        title: 'Service Request Created!',
        message: `Ticket ${ticketId} has been submitted to the society estate desk.`,
        type: 'success'
      });

      // Reset form & close
      setFormData({
        category: 'Plumbing',
        title: '',
        description: '',
        urgency: 'Normal',
        preferredDate: today,
        preferredTimeSlot: TIME_SLOTS[0],
        instructions: ''
      });
      setErrors({});
      onClose();
    } catch (err) {
      addToast({
        title: 'Error Creating Request',
        message: 'Something went wrong. Please try again.',
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
      title="Book a Home Service Request"
      subtitle="Estate maintenance team will verify availability and assign an authorized technician."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Resident Location & Info Pill */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-bee-600" />
            <span className="font-semibold text-slate-700">Service Location:</span>
            <span className="font-bold text-navy-900">
              {household.tower}, Flat {household.flatNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-bee-600" />
            <span className="font-semibold text-slate-700">Requested by:</span>
            <span className="font-bold text-navy-900">{currentUser?.name}</span>
          </div>
        </div>

        {/* Category & Urgency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Service Category <span className="text-rose-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-bee-500"
            >
              {SERVICE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Urgency Level <span className="text-rose-500">*</span>
            </label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-bee-500"
            >
              {URGENCY_LEVELS.map((u) => (
                <option key={u.level} value={u.level}>
                  {u.level} — {u.desc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Problem Title */}
        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1.5">
            Problem Title / Short Summary <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Geyser not heating water in common bathroom"
            className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500 ${
              errors.title ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
            }`}
          />
          {errors.title && <p className="text-[11px] text-rose-500 mt-1">{errors.title}</p>}
        </div>

        {/* Detailed Problem Description */}
        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1.5">
            Detailed Problem Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue, appliance brand/model if applicable, and when it started..."
            className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500 ${
              errors.description ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
            }`}
          />
          {errors.description && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Preferred Date & Time Slot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Preferred Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                name="preferredDate"
                min={today}
                value={formData.preferredDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500"
              />
            </div>
            {errors.preferredDate && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.preferredDate}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Preferred Time Slot <span className="text-rose-500">*</span>
            </label>
            <select
              name="preferredTimeSlot"
              value={formData.preferredTimeSlot}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-bee-500"
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional instructions */}
        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1.5">
            Entry Instructions / Notes (Optional)
          </label>
          <input
            type="text"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="e.g. Please ring bell twice, dog at home"
            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500"
          />
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" size="md" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="gold" size="md" type="submit" loading={submitting}>
            Submit Service Request
          </Button>
        </div>
      </form>
    </Modal>
  );
}
