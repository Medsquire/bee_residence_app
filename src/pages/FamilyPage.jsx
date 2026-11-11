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
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <PageHeader
        title="Family Members & Household"
        badge={
          <Badge variant="primary" size="md">
            {members.length} Members
          </Badge>
        }
        action={
          isHead ? (
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => {
                setMemberToEdit(null);
                setIsFormOpen(true);
              }}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              Add Member
            </Button>
          ) : null
        }
      />

      {/* Household Flat Metadata Banner - Glass Blue Banner */}
      <div className="p-4 sm:p-5 rounded-3xl glass-blue-banner text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-glass-lg relative overflow-hidden">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white text-blue-700 flex items-center justify-center font-black text-xl shrink-0 shadow-xs">
            1204
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-base text-white">
                {household.tower} • Flat {household.flatNumber}
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold border border-white/30 backdrop-blur-xs">
                Owner Registered
              </span>
            </div>
            <p className="text-xs text-blue-100 mt-0.5">{household.apartmentName}</p>
            <p className="text-[11px] text-blue-200 mt-0.5">{household.societyAddress}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs bg-white/20 px-3.5 py-2 rounded-xl border border-white/30 backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-white shrink-0" />
          <span>
            Household Head: <strong className="text-white">{household.ownerName}</strong>
          </span>
        </div>
      </div>

      {/* Toggle View Tabs: Members vs Household Audit Log - Mobile friendly */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-blue-100 pb-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
            activeTab === 'members'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'glass-card text-slate-700 hover:text-blue-600 hover:border-blue-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Members ({members.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
            activeTab === 'activity'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'glass-card text-slate-700 hover:text-blue-600 hover:border-blue-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Activity Audit Log ({activityLogs.length})</span>
        </button>
      </div>

      {/* Content based on tab */}
      {activeTab === 'members' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
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
