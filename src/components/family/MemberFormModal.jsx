import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import FormActionFooter from '../common/FormActionFooter';
import { useAuth } from '../../context/AuthContext';
import { useHousehold } from '../../context/HouseholdContext';
import { useToast } from '../../context/ToastContext';
import { User, Phone, Mail } from 'lucide-react';

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
        title: 'Family Member Invited!',
        message: `${formData.name} added to Flat 1204. Shared gate access granted.`,
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
      title={isEditing ? 'Edit Family Member' : 'Invite Family Member'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-black dark:text-white mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-blue-600 dark:text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" strokeWidth={1.5} />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ananya Kumar"
              className={`w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm glass-input rounded-xl focus:outline-none ${
                errors.name ? 'border-rose-400 bg-rose-50/20' : ''
              }`}
            />
          </div>
          {errors.name && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.name}</p>}
        </div>

        {/* Phone & Relationship */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-black dark:text-white mb-1">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-blue-600 dark:text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" strokeWidth={1.5} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit number"
                className={`w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm glass-input rounded-xl focus:outline-none ${
                  errors.phone ? 'border-rose-400 bg-rose-50/20' : ''
                }`}
              />
            </div>
            {errors.phone && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-black dark:text-white mb-1">
              Relationship <span className="text-rose-500">*</span>
            </label>
            <select
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-xs sm:text-sm glass-input rounded-xl font-medium text-black dark:text-white focus:outline-none"
            >
              {RELATIONSHIPS.map((rel) => (
                <option key={rel} value={rel}>
                  {rel}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-black dark:text-white mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-blue-600 dark:text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" strokeWidth={1.5} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. ananya@example.com"
              className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm glass-input rounded-xl focus:outline-none"
            />
          </div>
        </div>

        {/* Footer: Frosted Glass Icon-Only Action Cards */}
        <FormActionFooter
          onCancel={onClose}
          submitting={submitting}
          submitLabel={isEditing ? 'Save Changes' : 'Invite to Household'}
        />
      </form>
    </Modal>
  );
}
