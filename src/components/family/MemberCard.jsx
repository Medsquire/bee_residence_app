import React, { useState } from 'react';
import Badge from '../common/Badge';
import ConfirmDialog from '../common/ConfirmDialog';
import { useAuth } from '../../context/AuthContext';
import { useHousehold } from '../../context/HouseholdContext';
import { useToast } from '../../context/ToastContext';
import { formatPhone } from '../../utils/formatters';
import {
  ShieldCheck,
  User,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Sparkles,
  Check
} from 'lucide-react';

export default function MemberCard({ member, onEdit }) {
  const { currentUser, isHead, switchUser } = useAuth();
  const { removeFamilyMember } = useHousehold();
  const { addToast } = useToast();

  const [confirmDelete, setConfirmDelete] = useState(false);

  const isCurrentActive = currentUser?.id === member.id;

  const handleDelete = () => {
    const res = removeFamilyMember(member.id, currentUser);
    if (!res.success) {
      addToast({
        title: 'Cannot Remove',
        message: res.error,
        type: 'error'
      });
      return;
    }
    addToast({
      title: 'Member Removed',
      message: `${member.name} removed from household.`,
      type: 'info'
    });
    setConfirmDelete(false);
  };

  const handleSwitchToThisMember = () => {
    switchUser(member.id);
    addToast({
      title: `Logged in as ${member.name}`,
      message: `Active persona switched to ${member.role === 'HEAD' ? 'Household Head' : 'Household Member'}.`,
      type: 'info'
    });
  };

  return (
    <>
      <div
        className={`bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between ${
          isCurrentActive
            ? 'border-bee-400 ring-2 ring-bee-100 shadow-md'
            : 'border-slate-200/90 hover:border-slate-300 shadow-xs'
        }`}
      >
        <div>
          {/* Header with Avatar & Role */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(member.name)}`}
                alt={member.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-navy-900 text-sm sm:text-base truncate">
                  {member.name}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  {member.relationship}
                </p>
              </div>
            </div>

            <Badge variant={member.isHead ? 'gold' : 'neutral'} size="sm">
              {member.isHead ? (
                <ShieldCheck className="w-3.5 h-3.5 text-bee-600" />
              ) : (
                <User className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span>{member.isHead ? 'Household Head' : 'Member'}</span>
            </Badge>
          </div>

          {/* Contact Details */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-800">{formatPhone(member.phone)}</span>
            </div>
            {member.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-600 truncate">{member.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          {/* Persona quick switch */}
          {isCurrentActive ? (
            <span className="text-[11px] font-bold text-bee-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
              <Check className="w-3 h-3 text-bee-600" />
              Active User
            </span>
          ) : (
            <button
              type="button"
              onClick={handleSwitchToThisMember}
              className="text-[11px] font-bold text-navy-800 hover:text-bee-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
              title="Test application as this family member"
            >
              <Sparkles className="w-3 h-3 text-bee-500" />
              <span>Switch to this user</span>
            </button>
          )}

          {/* Edit / Remove controls */}
          <div className="flex items-center gap-1 ml-auto">
            {isHead && (
              <button
                type="button"
                onClick={() => onEdit(member)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                title="Edit Member"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}

            {isHead && !member.isHead && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Remove Member"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Remove Family Member?"
        message={`Are you sure you want to remove ${member.name} from Flat 1204? They will lose shared access to visitor approvals and service requests.`}
        confirmText="Remove Member"
        variant="danger"
      />
    </>
  );
}
