import React, { useState } from 'react';
import Badge from '../common/Badge';
import ConfirmDialog from '../common/ConfirmDialog';
import ImagePreviewModal from '../common/ImagePreviewModal';
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
  const [isImageOpen, setIsImageOpen] = useState(false);
  const avatarUrl =
    member.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(member.name)}`;

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
        className={`rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between transition-all ${
          isCurrentActive ? 'glass-stat-blue border-blue-400/80' : 'glass-stat-white'
        }`}
      >
        <div>
          {/* Header with Avatar & Role */}
          <div className="flex items-start justify-between gap-2.5 mb-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setIsImageOpen(true)}
                title="View Full Photo"
                aria-label={`View full photo of ${member.name}`}
                className="rounded-full overflow-hidden ring-1 ring-white dark:ring-slate-700 shrink-0 cursor-zoom-in hover:opacity-90 active:scale-95 transition-all"
              >
                <img
                  src={avatarUrl}
                  alt={member.name}
                  className="w-10 h-10 sm:w-11 sm:h-11 object-cover block"
                />
              </button>
              <div className="min-w-0">
                <h4 className="font-medium text-black dark:text-white text-sm truncate">
                  {member.name}
                </h4>
                <p className="text-xs font-normal text-black/75 dark:text-slate-300">
                  {member.relationship}
                </p>
              </div>
            </div>

            <Badge variant={member.isHead ? 'primary' : 'neutral'} size="sm">
              {member.isHead ? (
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" strokeWidth={1.5} />
              ) : (
                <User className="w-3.5 h-3.5 text-black dark:text-white" strokeWidth={1.5} />
              )}
              <span>{member.isHead ? 'Household Head' : 'Member'}</span>
            </Badge>
          </div>

          {/* Contact Details */}
          <div className="mt-3 pt-2.5 border-t border-blue-100/70 dark:border-slate-700/70 space-y-1.5 text-xs text-black dark:text-slate-200">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" strokeWidth={1.5} />
              <span className="font-medium text-black dark:text-white">{formatPhone(member.phone)}</span>
            </div>
            {member.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" strokeWidth={1.5} />
                <span className="text-black/80 dark:text-slate-200 truncate">{member.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-3 pt-2.5 border-t border-blue-100/70 dark:border-slate-700/70 flex items-center justify-between">
          {/* Persona quick switch */}
          {isCurrentActive ? (
            <span className="text-[11px] font-medium text-blue-700 dark:text-sky-300 bg-blue-50/90 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-blue-200/80 dark:border-slate-700 flex items-center gap-1">
              <Check className="w-3 h-3 text-blue-600 dark:text-sky-400" strokeWidth={1.6} />
              Active User
            </span>
          ) : (
            <button
              type="button"
              onClick={handleSwitchToThisMember}
              className="text-[11px] font-medium text-blue-700 dark:text-sky-300 hover:text-blue-900 bg-white/85 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
              title="Test application as this family member"
            >
              <Sparkles className="w-3 h-3 text-blue-600 dark:text-sky-400" strokeWidth={1.5} />
              <span>Switch User</span>
            </button>
          )}

          {/* Edit / Remove controls */}
          <div className="flex items-center gap-1 ml-auto">
            {isHead && (
              <button
                type="button"
                onClick={() => onEdit(member)}
                className="p-1.5 rounded-lg text-black/70 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50/80 dark:hover:bg-slate-800 transition-colors"
                title="Edit Member"
              >
                <Edit2 className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            )}

            {isHead && !member.isHead && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="p-1.5 rounded-lg text-black/70 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50/80 dark:hover:bg-rose-950/50 transition-colors"
                title="Remove Member"
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
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

      <ImagePreviewModal
        isOpen={isImageOpen}
        onClose={() => setIsImageOpen(false)}
        src={avatarUrl}
        alt={member.name}
        subtitle={member.relationship}
      />
    </>
  );
}
