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
    <div className="space-y-5">
      {/* Page Header */}
      <PageHeader
        title="Home Services & Repairs"
        badge={
          activeServicesCount > 0 ? (
            <Badge variant="warning" size="md">
              {activeServicesCount} Active Tickets
            </Badge>
          ) : null
        }
        action={
          <Button
            variant="gold"
            size="md"
            icon={Plus}
            onClick={() => setIsFormOpen(true)}
          >
            Add Service Request
          </Button>
        }
      />

      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => setActiveTab('all')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'all'
              ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-semibold opacity-80 block">Total</span>
          <span className="text-xl font-black">{serviceRequests.length}</span>
        </div>

        <div
          onClick={() => setActiveTab('Pending')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'Pending'
              ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
              : 'bg-white border-slate-200 text-slate-700 hover:border-amber-300'
          }`}
        >
          <span className="text-[11px] font-semibold opacity-80 block">Pending</span>
          <span className="text-xl font-black text-amber-600">{pendingCount}</span>
        </div>

        <div
          onClick={() => setActiveTab('Approved')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'Approved'
              ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
              : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'
          }`}
        >
          <span className="text-[11px] font-semibold opacity-80 block">Approved</span>
          <span className="text-xl font-black text-sky-600">{approvedCount}</span>
        </div>

        <div
          onClick={() => setActiveTab('Scheduled')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'Scheduled'
              ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
              : 'bg-white border-slate-200 text-slate-700 hover:border-purple-300'
          }`}
        >
          <span className="text-[11px] font-semibold opacity-80 block">Scheduled</span>
          <span className="text-xl font-black text-purple-600">{scheduledCount}</span>
        </div>

        <div
          onClick={() => setActiveTab('In Progress')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'In Progress'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
          }`}
        >
          <span className="text-[11px] font-semibold opacity-80 block">In Progress</span>
          <span className="text-xl font-black text-blue-600">{inProgressCount}</span>
        </div>

        <div
          onClick={() => setActiveTab('Completed')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'Completed'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
          }`}
        >
          <span className="text-[11px] font-semibold opacity-80 block">Completed</span>
          <span className="text-xl font-black text-emerald-600">{completedCount}</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by ticket ID, title, problem description..."
          className="w-full sm:max-w-md"
        />

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-bee-500"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
