import React, { useState, useMemo } from 'react';
import PageHeader from '../components/common/PageHeader';
import AddIconButton from '../components/common/AddIconButton';
import SearchInput from '../components/common/SearchInput';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import PassCard from '../components/passes/PassCard';
import CreatePassModal from '../components/passes/CreatePassModal';
import PassTicketModal from '../components/passes/PassTicketModal';
import { useHousehold } from '../context/HouseholdContext';
import { QrCode, Plus } from 'lucide-react';

const TABS = [
  { id: 'all', label: 'All Passes' },
  { id: 'Active', label: 'Active & Upcoming' },
  { id: 'Used', label: 'Used' },
  { id: 'Cancelled', label: 'Cancelled' }
];

export default function PreApprovedPage() {
  const { preApprovedPasses, activePassesCount } = useHousehold();

  const [activeTab, setActiveTab] = useState('Active');
  const [searchQuery, setSearchQuery] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);

  const filteredPasses = useMemo(() => {
    return preApprovedPasses.filter((p) => {
      if (activeTab !== 'all' && p.status !== activeTab) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = p.guestName.toLowerCase().includes(query);
        const matchId = p.id.toLowerCase().includes(query);
        const matchOtp = p.otp.includes(query);
        const matchVehicle = (p.vehicleNumber || '').toLowerCase().includes(query);
        if (!matchName && !matchId && !matchOtp && !matchVehicle) {
          return false;
        }
      }
      return true;
    });
  }, [preApprovedPasses, activeTab, searchQuery]);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <PageHeader
        title="Pre-Approved Passes"
        badge={
          activePassesCount > 0 ? (
            <Badge variant="primary" size="md">
              {activePassesCount} Active
            </Badge>
          ) : null
        }
        inlineAction={
          <AddIconButton
            onClick={() => setIsCreateOpen(true)}
            label="Create Visitor Pass"
          />
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-blue-100">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count =
            tab.id === 'all'
              ? preApprovedPasses.length
              : preApprovedPasses.filter((p) => p.status === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'glass-card text-slate-700 hover:text-blue-600 hover:border-blue-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive
                    ? 'bg-white text-blue-700'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search passes by guest name, OTP, or vehicle number..."
        className="max-w-md w-full"
      />

      {/* Passes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredPasses.map((pass) => (
          <PassCard
            key={pass.id}
            pass={pass}
            onViewPass={(p) => setSelectedPass(p)}
          />
        ))}
      </div>

      {filteredPasses.length === 0 && (
        <EmptyState
          icon={QrCode}
          title={
            activeTab === 'Active'
              ? 'No Active Pre-Approved Passes'
              : 'No Visitor Passes Found'
          }
          description="Advance passes allow fast, hassle-free gate entry for your scheduled visitors and couriers with auto-generated OTPs and QR codes."
          actionLabel="Create Pass Now"
          actionIcon={Plus}
          onAction={() => setIsCreateOpen(true)}
        />
      )}

      {/* Modals */}
      <CreatePassModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPassCreated={(newPass) => setSelectedPass(newPass)}
      />

      <PassTicketModal
        isOpen={!!selectedPass}
        pass={selectedPass}
        onClose={() => setSelectedPass(null)}
      />
    </div>
  );
}
