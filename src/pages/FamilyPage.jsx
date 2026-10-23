import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import MemberCard from '../components/family/MemberCard';
import MemberFormModal from '../components/family/MemberFormModal';
import ActivityTimeline from '../components/family/ActivityTimeline';
import { useAuth } from '../context/AuthContext';
import { useHousehold } from '../context/HouseholdContext';
import { Users, Plus, Building2, ShieldCheck, History } from 'lucide-react';

export default function FamilyPage() {
  const { currentUser, isHead } = useAuth();
  const { household, members, activityLogs } = useHousehold();

  const [activeTab, setActiveTab] = useState('members'); // 'members' | 'activity'
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Family Members & Household"
        subtitle="Manage household members who share apartment Flat 1204 access, visitor approvals, and service requests."
        badge={
          <Badge variant="neutral" size="md">
            {members.length} Members
          </Badge>
        }
        action={
          isHead ? (
            <Button
              variant="gold"
              size="md"
              icon={Plus}
              onClick={() => {
                setMemberToEdit(null);
                setIsFormOpen(true);
              }}
            >
              Add Member
            </Button>
          ) : null
        }
      />

      {/* Household Flat Metadata Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-navy-900 to-navy-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-bee-500 text-navy-950 flex items-center justify-center font-black text-xl shrink-0">
            1204
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white">
                {household.tower} • Flat {household.flatNumber}
              </h3>
              <Badge variant="gold" size="sm">
                Owner Registered
              </Badge>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{household.apartmentName}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{household.societyAddress}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs bg-navy-800/80 px-3.5 py-2 rounded-xl border border-navy-700">
          <ShieldCheck className="w-4 h-4 text-bee-400 shrink-0" />
          <span>
            Household Head: <strong className="text-white">{household.ownerName}</strong>
          </span>
        </div>
      </div>

      {/* Toggle View Tabs: Members vs Household Audit Log */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'members'
              ? 'bg-navy-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Family Members ({members.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'activity'
              ? 'bg-navy-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Household Activity Audit Log ({activityLogs.length})</span>
        </button>
      </div>

      {/* Content based on tab */}
      {activeTab === 'members' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onEdit={(m) => {
                setMemberToEdit(m);
                setIsFormOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <ActivityTimeline logs={activityLogs} />
      )}

      {/* Member Form Modal */}
      <MemberFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setMemberToEdit(null);
        }}
        memberToEdit={memberToEdit}
      />
    </div>
  );
}
