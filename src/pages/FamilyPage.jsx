import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import AddIconButton from '../components/common/AddIconButton';
import Badge from '../components/common/Badge';
import MemberCard from '../components/family/MemberCard';
import MemberFormModal from '../components/family/MemberFormModal';
import ActivityTimeline from '../components/family/ActivityTimeline';
import { useAuth } from '../context/AuthContext';
import { useHousehold } from '../context/HouseholdContext';
import { Users, History } from 'lucide-react';

export default function FamilyPage() {
  const { isHead } = useAuth();
  const { members, activityLogs } = useHousehold();

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
        inlineAction={
          isHead ? (
            <AddIconButton
              onClick={() => {
                setMemberToEdit(null);
                setIsFormOpen(true);
              }}
              label="Add Member"
            />
          ) : null
        }
      />

      {/* Toggle View Tabs: Members vs Household Audit Log - Mobile friendly */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-blue-100/70 dark:border-slate-700/70 pb-1.5 overflow-x-auto no-scrollbar">
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
