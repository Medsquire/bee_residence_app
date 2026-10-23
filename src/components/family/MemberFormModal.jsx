import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useHousehold } from '../../context/HouseholdContext';
import { useToast } from '../../context/ToastContext';
import { User, Phone, Mail, Shield, Heart } from 'lucide-react';

const RELATIONSHIPS = ['Spouse', 'Parent', 'Child', 'Sibling', 'Tenant', 'Other'];

export default function MemberFormModal({ isOpen, onClose, memberToEdit = null }) {
  const { currentUser } = useAuth();
  const { addFamilyMember, updateFamilyMember } = useHousehold();
  const { addToast } = useToast();

  const isEditing = !!memberToEdit;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: 'Spouse',
    role: 'MEMBER'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (memberToEdit) {
      setFormData({
        name: memberToEdit.name,
        phone: memberToEdit.phone,
        email: memberToEdit.email || '',
        relationship: memberToEdit.relationship || 'Spouse',
        role: memberToEdit.role || 'MEMBER'
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        relationship: 'Spouse',
        role: 'MEMBER'
      });
    }
    setErrors({});
  }, [memberToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile phone number is required.';
    } else {
      const digits = formData.phone.replace(/\D/g, '');
      if (digits.length < 10) {
        newErrors.phone = 'Please provide a valid 10-digit mobile number.';
      }
    }
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

    if (isEditing) {
      updateFamilyMember(memberToEdit.id, formData);
      addToast({
        title: 'Member Updated',
        message: `${formData.name}'s details have been saved.`,
        type: 'success'
      });
      onClose();
      setSubmitting(false);
    } else {
      const res = addFamilyMember(formData, currentUser);
      if (!res.success) {
        setErrors({ phone: res.error });
        addToast({
          title: 'Duplicate Phone Error',
          message: res.error,
          type: 'error'
        });
        setSubmitting(false);
        return;
      }

      addToast({
        title: 'Member Added!',
        message: `${formData.name} invited to Flat 1204.`,
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
      title={isEditing ? 'Edit Household Member' : 'Add Household Member'}
      subtitle="Household members can view visitor requests, create passes, and track services."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sunita Kumar"
              className={`w-full pl-9 pr-3.5 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500 ${
                errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
        </div>

        {/* Mobile Phone */}
        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1.5">
            Mobile Phone Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              className={`w-full pl-9 pr-3.5 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500 ${
                errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
        </div>

        {/* Relationship & Role */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Relationship <span className="text-rose-500">*</span>
            </label>
            <select
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-bee-500"
            >
              {RELATIONSHIPS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Household Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={memberToEdit?.isHead}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-bee-500 disabled:bg-slate-100"
            >
              <option value="MEMBER">Household Member</option>
              <option value="HEAD">Household Head</option>
            </select>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1.5">
            Email Address (Optional)
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. member@example.com"
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" size="md" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="gold" size="md" type="submit" loading={submitting}>
            {isEditing ? 'Save Changes' : 'Add Member'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
