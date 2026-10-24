import React, { useState, useMemo } from 'react';
import PageHeader from '../components/common/PageHeader';
import SearchInput from '../components/common/SearchInput';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import PassCard from '../components/passes/PassCard';
import CreatePassModal from '../components/passes/CreatePassModal';
import PassTicketModal from '../components/passes/PassTicketModal';
import { useHousehold } from '../context/HouseholdContext';
import { QrCode, Plus, ShieldCheck, Ticket } from 'lucide-react';

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
    <div className="space-y-5">
      {/* Header */}
      <PageHeader
        title="Pre-Approved Visitor Passes"
        badge={
          activePassesCount > 0 ? (
            <Badge variant="primary" size="md">
              {activePassesCount} Active
            </Badge>
          ) : null
        }
        action={
          <Button
            variant="gold"
            size="md"
            icon={Plus}
            onClick={() => setIsCreateOpen(true)}
          >
            Create Visitor Pass
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
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
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-navy-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-bee-500 text-navy-950'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by guest name, pass number, OTP, or vehicle plate..."
        className="max-w-md"
      />

      {/* Passes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          description="Create advance visitor passes so your guests can enter effortlessly through gate QR verification or OTP entry."
          actionLabel="Generate Guest Pass"
          actionIcon={Plus}
          onAction={() => setIsCreateOpen(true)}
        />
      )}

      {/* Create Modal */}
      <CreatePassModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPassCreated={(newPass) => setSelectedPass(newPass)}
      />

      {/* Digital Pass Ticket Modal */}
      <PassTicketModal
        isOpen={!!selectedPass}
        pass={selectedPass}
        onClose={() => setSelectedPass(null)}
      />
    </div>
  );
}
