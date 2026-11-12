import React, { useState, useMemo } from 'react';
import PageHeader from '../components/common/PageHeader';
import AddIconButton from '../components/common/AddIconButton';
import SearchInput from '../components/common/SearchInput';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import ServiceCard from '../components/services/ServiceCard';
import ServiceRequestModal from '../components/services/ServiceRequestModal';
import ServiceDetailsModal from '../components/services/ServiceDetailsModal';
import { useHousehold } from '../context/HouseholdContext';
import {
  LayoutGrid,
  Wrench,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Calendar,
  CheckCheck
} from 'lucide-react';

const SUMMARY_CARDS = [
  {
    id: 'all',
    label: 'Total Requests',
    shortLabel: 'Total',
    icon: LayoutGrid,
    chipClass: 'bg-blue-500/12 dark:bg-sky-400/15 text-blue-600 dark:text-sky-400'
  },
  {
    id: 'Pending',
    label: 'Pending',
    icon: Clock,
    chipClass: 'bg-amber-500/12 dark:bg-amber-400/15 text-amber-600 dark:text-amber-400'
  },
  {
    id: 'Approved',
    label: 'Approved',
    icon: CheckCircle2,
    chipClass: 'bg-sky-500/12 dark:bg-sky-400/15 text-sky-600 dark:text-sky-400'
  },
  {
    id: 'Scheduled',
    label: 'Scheduled',
    icon: Calendar,
    chipClass: 'bg-indigo-500/12 dark:bg-indigo-400/15 text-indigo-600 dark:text-indigo-400'
  },
  {
    id: 'In Progress',
    label: 'In Progress',
    shortLabel: 'Progress',
    icon: Wrench,
    chipClass: 'bg-blue-500/12 dark:bg-cyan-400/15 text-blue-700 dark:text-cyan-400'
  },
  {
    id: 'Completed',
    label: 'Completed',
    icon: CheckCheck,
    chipClass: 'bg-emerald-500/12 dark:bg-emerald-400/15 text-emerald-600 dark:text-emerald-400'
  }
];

const CATEGORIES = [
  'All Categories',
  'Apartment Issues',
  'Plumbing',
  'Electrical Repairs',
  'Water Pump and Motor',
  'Cleaning',
  'Sanitation',
  'Air Conditioning',
  'Washing Machine',
  'Television',
  'Wi-Fi and Internet',
  'Carpentry',
  'Painting',
  'Pest Control',
  'Refrigerator',
  'Other Maintenance'
];

export default function ServicesPage() {
  const { serviceRequests, activeServicesCount } = useHousehold();

  // Mandatory PRD Requirement: Service request form MUST BE HIDDEN BY DEFAULT!
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [inspectTicket, setInspectTicket] = useState(null);

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Summary counts in one pass
  const statusCounts = useMemo(() => {
    const counts = { all: serviceRequests.length };
    for (const req of serviceRequests) {
      counts[req.status] = (counts[req.status] || 0) + 1;
    }
    return counts;
  }, [serviceRequests]);

  const filteredServices = useMemo(() => {
    return serviceRequests.filter((s) => {
      // Tab status filter
      if (activeTab !== 'all' && s.status !== activeTab) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All Categories' && s.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = s.title.toLowerCase().includes(query);
        const matchDesc = s.description.toLowerCase().includes(query);
        const matchId = s.id.toLowerCase().includes(query);
        const matchCat = s.category.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchId && !matchCat) {
          return false;
        }
      }

      return true;
    });
  }, [serviceRequests, activeTab, selectedCategory, searchQuery]);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Page Header */}
      <PageHeader
        title="Services"
        badge={
          activeServicesCount > 0 ? (
            <Badge variant="primary" size="md">
              {activeServicesCount} Active Tickets
            </Badge>
          ) : null
        }
        inlineAction={
          <AddIconButton
            onClick={() => setIsFormOpen(true)}
            label="Add Service Request"
          />
        }
      />

      {/* Summary Cards Row - All 6 compact glass cards in one row */}
      <div className="grid grid-cols-6 gap-1 sm:gap-2.5">
        {SUMMARY_CARDS.map((card) => {
          const Icon = card.icon;
          const count = statusCounts[card.id] || 0;
          const isActive = activeTab === card.id;

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => setActiveTab(card.id)}
              title={`${card.label}: ${count}`}
              aria-label={`${card.label}: ${count}`}
              aria-pressed={isActive}
              className={`rounded-xl sm:rounded-2xl py-2 px-0.5 sm:py-2.5 sm:px-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-br from-blue-600/90 via-blue-500/85 to-sky-500/90 dark:from-blue-600/85 dark:to-sky-500/80 backdrop-blur-md border border-white/75 dark:border-sky-300/45 text-white shadow-[0_8px_18px_-4px_rgba(37,99,235,0.32),inset_0_1px_0_rgba(255,255,255,0.55)]'
                  : 'glass-stat-white text-black dark:text-white hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                <span
                  className={`w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white border border-white/35'
                      : card.chipClass
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={1.6} />
                </span>
                <span className="text-xs sm:text-base font-medium leading-none tabular-nums">
                  {count}
                </span>
              </div>
              <span
                className={`text-[8.5px] sm:text-[11px] font-normal leading-none tracking-tight whitespace-nowrap ${
                  isActive
                    ? 'text-white/90'
                    : 'text-black/55 dark:text-slate-300/85'
                }`}
              >
                {card.shortLabel || card.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by ticket ID, title, problem description..."
          className="w-full sm:max-w-md"
        />

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-500 dark:text-sky-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2.5 glass-input rounded-xl text-xs font-medium text-black dark:text-white focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredServices.map((ticket) => (
          <ServiceCard
            key={ticket.id}
            ticket={ticket}
            onInspect={(t) => setInspectTicket(t)}
          />
        ))}
      </div>

      {filteredServices.length === 0 && (
        <EmptyState
          icon={Wrench}
          title="No Service Requests Found"
          description={
            serviceRequests.length === 0
              ? 'You have not submitted any service requests yet. Click the button below to book an electrician, plumber, or appliance technician.'
              : 'No service requests match your selected status tab or category filters.'
          }
          actionLabel="Add Service Request"
          actionIcon={Plus}
          onAction={() => setIsFormOpen(true)}
        />
      )}

      {/* The Request Form Modal — Opened strictly on user click */}
      <ServiceRequestModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />

      {/* Inspection Modal — Allows reviewing slot bookings without opening request form */}
      <ServiceDetailsModal
        isOpen={!!inspectTicket}
        ticket={inspectTicket}
        onClose={() => setInspectTicket(null)}
      />
    </div>
  );
}
