import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useHousehold } from '../../context/HouseholdContext';
import { useToast } from '../../context/ToastContext';
import { Car, Bike, Zap, User, Hash, Palette, MapPin } from 'lucide-react';

const VEHICLE_TYPES = ['Car', 'Two-Wheeler', 'Electric Vehicle', 'Other'];

export default function VehicleFormModal({ isOpen, onClose, vehicleToEdit = null }) {
  const { currentUser } = useAuth();
  const { household, members, addVehicle, updateVehicle } = useHousehold();
  const { addToast } = useToast();

  const isEditing = !!vehicleToEdit;

  const [formData, setFormData] = useState({
    type: 'Car',
    registrationNumber: '',
    makeModel: '',
    color: '',
    ownerId: currentUser?.id || '',
    parkingSlot: household?.parkingSlots?.[0] || 'B2-P45',
    photo: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (vehicleToEdit) {
      setFormData({
        type: vehicleToEdit.type,
        registrationNumber: vehicleToEdit.registrationNumber,
        makeModel: vehicleToEdit.makeModel,
        color: vehicleToEdit.color,
        ownerId: vehicleToEdit.ownerId,
        parkingSlot: vehicleToEdit.parkingSlot,
        photo: vehicleToEdit.photo || ''
      });
    } else {
      setFormData({
        type: 'Car',
        registrationNumber: '',
        makeModel: '',
        color: '',
        ownerId: currentUser?.id || '',
        parkingSlot: household?.parkingSlots?.[0] || 'B2-P45',
        photo: ''
      });
    }
    setErrors({});
  }, [vehicleToEdit, currentUser, household, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required.';
    } else {
      // Basic validation for license plate
      const cleaned = formData.registrationNumber.replace(/\s+/g, '');
      if (cleaned.length < 6) {
        newErrors.registrationNumber = 'Please enter a valid registration number (e.g. KA 01 MJ 4521).';
      }
    }
    if (!formData.makeModel.trim()) newErrors.makeModel = 'Vehicle make and model is required.';
    if (!formData.color.trim()) newErrors.color = 'Vehicle color is required.';
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
    const owner = members.find((m) => m.id === formData.ownerId) || currentUser;

    if (isEditing) {
      updateVehicle(vehicleToEdit.id, {
        ...formData,
        ownerName: owner?.name,
        registrationNumber: formData.registrationNumber.toUpperCase()
      });
      addToast({
        title: 'Vehicle Updated',
        message: `${formData.registrationNumber.toUpperCase()} updated successfully.`,
        type: 'success'
      });
      onClose();
      setSubmitting(false);
    } else {
      const res = addVehicle(
        {
          ...formData,
          ownerName: owner?.name,
          registrationNumber: formData.registrationNumber.toUpperCase()
        },
        currentUser
      );

      if (!res.success) {
        setErrors({ registrationNumber: res.error });
        addToast({
          title: 'Duplicate Vehicle Error',
          message: res.error,
          type: 'error'
        });
        setSubmitting(false);
        return;
      }

      addToast({
        title: 'Vehicle Registered!',
        message: `${formData.registrationNumber.toUpperCase()} added to Flat 1204.`,
        type: 'success'
      });
      onClose();
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Vehicle Details' : 'Register New Vehicle'}
      subtitle="Registered vehicles receive automatic gate RFID tag clearance and designated parking."
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vehicle Type selection */}
        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1.5">
            Vehicle Type <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {VEHICLE_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, type: t }))}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  formData.type === t
                    ? 'border-bee-500 bg-amber-50 text-navy-950 ring-2 ring-bee-400/40'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t === 'Car' && <Car className="w-4 h-4 text-navy-900" />}
                {t === 'Two-Wheeler' && <Bike className="w-4 h-4 text-navy-900" />}
                {t === 'Electric Vehicle' && <Zap className="w-4 h-4 text-emerald-600" />}
                {t === 'Other' && <Car className="w-4 h-4 text-slate-500" />}
                <span className="truncate">{t}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Plate Number & Make/Model */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Registration Plate <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="e.g. KA 01 MJ 4521"
                className={`w-full px-3.5 py-2 text-xs font-mono font-bold uppercase bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500 ${
                  errors.registrationNumber ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.registrationNumber && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.registrationNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Make & Model <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="makeModel"
              value={formData.makeModel}
              onChange={handleChange}
              placeholder="e.g. Tata Nexon EV Max"
              className={`w-full px-3.5 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500 ${
                errors.makeModel ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
            {errors.makeModel && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.makeModel}</p>
            )}
          </div>
        </div>

        {/* Color & Owner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Vehicle Color <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="e.g. Intense Teal / Pearl White"
              className={`w-full px-3.5 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500 ${
                errors.color ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
            {errors.color && <p className="text-[11px] text-rose-500 mt-1">{errors.color}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Household Owner <span className="text-rose-500">*</span>
            </label>
            <select
              name="ownerId"
              value={formData.ownerId}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-bee-500"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.relationship})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Parking slot */}
        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1.5">
            Assigned Parking Slot
          </label>
          <input
            type="text"
            name="parkingSlot"
            value={formData.parkingSlot}
            onChange={handleChange}
            placeholder="e.g. B2-P45 or B2-P46 (EV)"
            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" size="md" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="gold" size="md" type="submit" loading={submitting}>
            {isEditing ? 'Save Changes' : 'Register Vehicle'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
