import React, { useState, useMemo } from 'react';
import PageHeader from '../components/common/PageHeader';
import SearchInput from '../components/common/SearchInput';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import VisitorCard from '../components/visitors/VisitorCard';
import VisitorDetailsModal from '../components/visitors/VisitorDetailsModal';
import VisitorDecisionModal from '../components/visitors/VisitorDecisionModal';
import { useAuth } from '../context/AuthContext';
import { useHousehold } from '../context/HouseholdContext';
import { useToast } from '../context/ToastContext';
import { UserCheck, Sparkles, Filter, Users, ShieldAlert } from 'lucide-react';

const TABS = [
  { id: 'all', label: 'All Visitors' },
  { id: 'Pending', label: 'Pending Approval' },
  { id: 'Approved', label: 'Approved' },
  { id: 'Leave at Gate', label: 'Parcels at Gate' },
  { id: 'Rejected', label: 'Rejected' },
  { id: 'Completed', label: 'Completed' }
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
  const { visitors, pendingVisitorsCount, decideVisitor, simulateIncomingVisitor } = useHousehold();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const [activeVisitorDetails, setActiveVisitorDetails] = useState(null);
  const [decisionModalData, setDecisionModalData] = useState({ isOpen: false, visitor: null, decision: null });

  const handleSimulateVisitor = () => {
    const visitor = simulateIncomingVisitor();
    addToast({
      title: 'Gate Arrival Simulated!',
      message: `${visitor.name} arrived at ${visitor.gateNumber}. Pending approval.`,
      type: 'info'
    });
  };

  const handleDecisionClick = (visitor, decision) => {
    setDecisionModalData({ isOpen: true, visitor, decision });
  };

  const handleConfirmDecision = (visitorId, decision, note) => {
    const res = decideVisitor(visitorId, decision, note, currentUser);
    if (res.success) {
      addToast({
        title: 'Decision Recorded',
        message: res.message,
        type: 'success'
      });
    } else {
      addToast({
        title: 'Cannot Process Request',
        message: res.message,
        type: 'error'
      });
    }
  };

  // Filtered visitor list
  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => {
      // Tab filter
      if (activeTab === 'Leave at Gate') {
        if (v.status !== 'Leave at Gate' && !(v.status === 'Approved' && v.decisionNote?.includes('gate'))) {
          return false;
        }
      } else if (activeTab !== 'all' && v.status !== activeTab) {
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="My Visitors"
        subtitle="Approve or decline gate arrivals, manage delivery drop-offs, and track check-ins."
        badge={
          pendingVisitorsCount > 0 ? (
            <Badge variant="danger" size="md">
              {pendingVisitorsCount} Pending
            </Badge>
          ) : null
        }
        action={
          <Button
            variant="gold"
            size="md"
            icon={Sparkles}
            onClick={handleSimulateVisitor}
          >
            Simulate Visitor Arrival
          </Button>
        }
      />

      {/* Tabs bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count =
            tab.id === 'all'
              ? visitors.length
              : visitors.filter((v) => v.status === tab.id).length;

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

      {/* Filters & Search row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by visitor name, company, vehicle plate..."
          className="w-full sm:max-w-md"
        />

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-bee-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Shared Household Status Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
        <Users className="w-4 h-4 text-bee-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Shared Household Decision Sync</p>
          <p className="text-[11px] text-amber-800/90 mt-0.5">
            Any decision taken by you or another family member locks the request instantly. All household members see who processed the arrival.
          </p>
        </div>
      </div>

      {/* Visitors List Grid */}
      <div className="space-y-3">
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
                ? 'All visitors have been processed. Use the "Simulate Visitor Arrival" button above to test new gate requests.'
                : 'Try adjusting your search query or category filters to find records.'
            }
            actionLabel="Simulate Gate Arrival"
            actionIcon={Sparkles}
            onAction={handleSimulateVisitor}
          />
        )}
      </div>

      {/* Modals */}
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

      <VisitorDecisionModal
        isOpen={decisionModalData.isOpen}
        visitor={decisionModalData.visitor}
        decision={decisionModalData.decision}
        onClose={() => setDecisionModalData({ isOpen: false, visitor: null, decision: null })}
        onConfirm={handleConfirmDecision}
      />
    </div>
  );
}
