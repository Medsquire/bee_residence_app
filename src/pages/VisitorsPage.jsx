import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import AddIconButton from '../components/common/AddIconButton';
import SearchInput from '../components/common/SearchInput';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import VisitorCard from '../components/visitors/VisitorCard';
import VisitorDetailsModal from '../components/visitors/VisitorDetailsModal';
import PassCard from '../components/passes/PassCard';
import { submitVisitorDecision } from '../utils/visitorActions';
import CreatePassModal from '../components/passes/CreatePassModal';
import PassTicketModal from '../components/passes/PassTicketModal';
import { useAuth } from '../context/AuthContext';
import { useHousehold } from '../context/HouseholdContext';
import { useToast } from '../context/ToastContext';
import { UserCheck, Filter, QrCode, Plus } from 'lucide-react';

const TABS = [
  { id: 'all', label: 'All Visitors' },
  { id: 'Pending', label: 'Pending Approval' },
  { id: 'Approved', label: 'Approved' },
  { id: 'pre-approved', label: 'Pre-Approved Visitors' },
  { id: 'Rejected', label: 'Rejected' },
  { id: 'Completed', label: 'Completed' }
];

const PASS_STATUS_TABS = [
  { id: 'all', label: 'All Passes' },
  { id: 'Active', label: 'Active & Upcoming' },
  { id: 'Used', label: 'Used' },
  { id: 'Cancelled', label: 'Cancelled' }
];

const CATEGORIES = [
  'All Categories',
  'Courier',
  'Food Delivery',
  'Friends',
  'Service Technician',
  'Other'
];

export default function VisitorsPage() {
  const { currentUser } = useAuth();
  const {
    visitors,
    pendingVisitorsCount,
    decideVisitor,
    preApprovedPasses,
    activePassesCount
  } = useHousehold();
  const { addToast } = useToast();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'pre-approved' ? 'pre-approved' : 'Pending';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [passStatusFilter, setPassStatusFilter] = useState('Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const [activeVisitorDetails, setActiveVisitorDetails] = useState(null);

  // Pre-approved pass modals
  const [isCreatePassOpen, setIsCreatePassOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'pre-approved') {
      setActiveTab('pre-approved');
    }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'pre-approved') {
      setSearchParams({ tab: 'pre-approved' }, { replace: true });
    } else {
      searchParams.delete('tab');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const handleDecisionClick = (visitor, decision) => {
    submitVisitorDecision({
      visitor,
      decision,
      currentUser,
      decideVisitor,
      addToast
    });
  };

  // Filtered visitor list
  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => {
      // Tab filter
      if (activeTab !== 'all' && v.status !== activeTab) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All Categories' && v.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = v.name.toLowerCase().includes(query);
        const matchCompany = (v.company || '').toLowerCase().includes(query);
        const matchPlate = (v.vehicleNumber || '').toLowerCase().includes(query);
        const matchPurpose = (v.purpose || '').toLowerCase().includes(query);
        if (!matchName && !matchCompany && !matchPlate && !matchPurpose) {
          return false;
        }
      }

      return true;
    });
  }, [visitors, activeTab, selectedCategory, searchQuery]);

  // Filtered pre-approved passes list
  const filteredPasses = useMemo(() => {
    return preApprovedPasses.filter((p) => {
      if (passStatusFilter !== 'all' && p.status !== passStatusFilter) {
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
  }, [preApprovedPasses, passStatusFilter, searchQuery]);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Page Header */}
      <PageHeader
        title="My Visitors"
        badge={
          activeTab === 'pre-approved' ? (
            activePassesCount > 0 ? (
              <Badge variant="primary" size="sm">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-sky-400 animate-pulse" />
                {activePassesCount} Active
              </Badge>
            ) : null
          ) : pendingVisitorsCount > 0 ? (
            <Badge variant="primary" size="sm">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-sky-400 animate-pulse" />
              {pendingVisitorsCount} Pending
            </Badge>
          ) : null
        }
        inlineAction={
          <AddIconButton
            onClick={() => setIsCreatePassOpen(true)}
            label="Create Pre-Visitor Pass"
          />
        }
      />

      {/* Tabs bar - Horizontal sliding on mobile */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-blue-100/80 dark:border-slate-800">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count =
            tab.id === 'all'
              ? visitors.length
              : tab.id === 'pre-approved'
              ? preApprovedPasses.length
              : visitors.filter((v) => v.status === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white font-medium shadow-sm shadow-blue-500/25'
                  : 'glass-stat-white font-normal text-black dark:text-white hover:text-blue-600 dark:hover:text-sky-400'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                  isActive
                    ? 'bg-white text-blue-700'
                    : 'bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-sky-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sub-tabs for Pre-Approved Passes */}
      {activeTab === 'pre-approved' && (
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
          {PASS_STATUS_TABS.map((tab) => {
            const isActive = passStatusFilter === tab.id;
            const count =
              tab.id === 'all'
                ? preApprovedPasses.length
                : preApprovedPasses.filter((p) => p.status === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setPassStatusFilter(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-medium shadow-xs'
                    : 'glass-stat-white font-normal text-black dark:text-white hover:text-blue-600'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                    isActive
                      ? 'bg-white text-blue-700'
                      : 'bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-sky-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Filters & Search row */}
      {activeTab === 'pre-approved' ? (
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by guest name, pass number, OTP, or vehicle plate..."
          className="max-w-md w-full"
        />
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by visitor name, company, vehicle plate..."
            className="w-full sm:max-w-md"
          />

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" strokeWidth={1.5} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-3 py-2.5 glass-input rounded-xl text-xs font-medium text-black dark:text-white focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {activeTab === 'pre-approved' ? (
        <>
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
                passStatusFilter === 'Active'
                  ? 'No Active Pre-Approved Passes'
                  : 'No Visitor Passes Found'
              }
              description="Create advance visitor passes so your guests can enter effortlessly through gate QR verification or OTP entry."
              actionLabel="Generate Guest Pass"
              actionIcon={Plus}
              onAction={() => setIsCreatePassOpen(true)}
            />
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredVisitors.map((visitor) => (
            <VisitorCard
              key={visitor.id}
              visitor={visitor}
              onInspect={(v) => setActiveVisitorDetails(v)}
              onDecision={handleDecisionClick}
            />
          ))}

          {filteredVisitors.length === 0 && (
            <EmptyState
              icon={UserCheck}
              title={
                activeTab === 'Pending'
                  ? 'No Pending Visitor Requests'
                  : 'No Visitors Found'
              }
              description={
                activeTab === 'Pending'
                  ? 'All visitors have been processed. Tap the + icon above to create a pre-approved visitor pass.'
                  : 'Try adjusting your search query or category filters to find records.'
              }
              actionLabel="Create Pre-Visitor Pass"
              actionIcon={Plus}
              onAction={() => setIsCreatePassOpen(true)}
            />
          )}
        </div>
      )}

      {/* Visitor Modals */}
      <VisitorDetailsModal
        isOpen={!!activeVisitorDetails}
        visitor={activeVisitorDetails}
        onClose={() => setActiveVisitorDetails(null)}
        onActionClick={(dec) => {
          const v = activeVisitorDetails;
          setActiveVisitorDetails(null);
          handleDecisionClick(v, dec);
        }}
      />

      {/* Pre-Approved Pass Modals */}
      <CreatePassModal
        isOpen={isCreatePassOpen}
        onClose={() => setIsCreatePassOpen(false)}
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
