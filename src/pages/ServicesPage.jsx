import React, { useState, useMemo } from 'react';
import PageHeader from '../components/common/PageHeader';
import SearchInput from '../components/common/SearchInput';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import ServiceCard from '../components/services/ServiceCard';
import ServiceRequestModal from '../components/services/ServiceRequestModal';
import ServiceDetailsModal from '../components/services/ServiceDetailsModal';
import { useHousehold } from '../context/HouseholdContext';
import { Wrench, Plus, Filter, CheckCircle2, Clock, Calendar, Sparkles } from 'lucide-react';

const STATUS_TABS = [
  { id: 'all', label: 'All Requests' },
  { id: 'Pending', label: 'Pending' },
  { id: 'Approved', label: 'Approved' },
  { id: 'Scheduled', label: 'Scheduled' },
  { id: 'In Progress', label: 'In Progress' },
  { id: 'Completed', label: 'Completed' },
  { id: 'Cancelled', label: 'Cancelled' }
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

  // Summary counts
  const pendingCount = serviceRequests.filter((s) => s.status === 'Pending').length;
  const approvedCount = serviceRequests.filter((s) => s.status === 'Approved').length;
  const scheduledCount = serviceRequests.filter((s) => s.status === 'Scheduled').length;
  const inProgressCount = serviceRequests.filter((s) => s.status === 'In Progress').length;
  const completedCount = serviceRequests.filter((s) => s.status === 'Completed').length;

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
        action={
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setIsFormOpen(true)}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            Add Service Request
          </Button>
        }
      />

      {/* Summary Cards Row - 3 cols on mobile, 6 on desktop */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
        <div
          onClick={() => setActiveTab('all')}
          className={`p-2.5 sm:p-3.5 rounded-2xl cursor-pointer transition-all shadow-xs ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25'
              : 'glass-card text-slate-700 hover:border-blue-200'
          }`}
        >
          <span className="text-[10px] sm:text-[11px] font-semibold opacity-80 block truncate">Total</span>
          <span className="text-lg sm:text-xl font-black">{serviceRequests.length}</span>
        </div>

        <div
          onClick={() => setActiveTab('Pending')}
          className={`p-2.5 sm:p-3.5 rounded-2xl cursor-pointer transition-all shadow-xs ${
            activeTab === 'Pending'
              ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25'
              : 'glass-card text-slate-700 hover:border-blue-200'
          }`}
        >
          <span className="text-[10px] sm:text-[11px] font-semibold opacity-80 block truncate">Pending</span>
          <span className="text-lg sm:text-xl font-black text-blue-600">{pendingCount}</span>
        </div>

        <div
          onClick={() => setActiveTab('Approved')}
          className={`p-2.5 sm:p-3.5 rounded-2xl cursor-pointer transition-all shadow-xs ${
            activeTab === 'Approved'
              ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25'
              : 'glass-card text-slate-700 hover:border-blue-200'
          }`}
        >
          <span className="text-[10px] sm:text-[11px] font-semibold opacity-80 block truncate">Approved</span>
          <span className="text-lg sm:text-xl font-black text-sky-600">{approvedCount}</span>
        </div>

        <div
          onClick={() => setActiveTab('Scheduled')}
          className={`p-2.5 sm:p-3.5 rounded-2xl cursor-pointer transition-all shadow-xs ${
            activeTab === 'Scheduled'
              ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25'
              : 'glass-card text-slate-700 hover:border-blue-200'
          }`}
        >
          <span className="text-[10px] sm:text-[11px] font-semibold opacity-80 block truncate">Scheduled</span>
          <span className="text-lg sm:text-xl font-black text-indigo-600">{scheduledCount}</span>
        </div>

        <div
          onClick={() => setActiveTab('In Progress')}
          className={`p-2.5 sm:p-3.5 rounded-2xl cursor-pointer transition-all shadow-xs ${
            activeTab === 'In Progress'
              ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25'
              : 'glass-card text-slate-700 hover:border-blue-200'
          }`}
        >
          <span className="text-[10px] sm:text-[11px] font-semibold opacity-80 block truncate">In Progress</span>
          <span className="text-lg sm:text-xl font-black text-blue-700">{inProgressCount}</span>
        </div>

        <div
          onClick={() => setActiveTab('Completed')}
          className={`p-2.5 sm:p-3.5 rounded-2xl cursor-pointer transition-all shadow-xs ${
            activeTab === 'Completed'
              ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25'
              : 'glass-card text-slate-700 hover:border-blue-200'
          }`}
        >
          <span className="text-[10px] sm:text-[11px] font-semibold opacity-80 block truncate">Completed</span>
          <span className="text-lg sm:text-xl font-black text-blue-800">{completedCount}</span>
        </div>
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
          <Filter className="w-4 h-4 text-blue-500 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2.5 glass-input rounded-xl text-xs font-bold text-blue-950 focus:outline-none"
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
