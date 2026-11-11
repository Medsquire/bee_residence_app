import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHousehold } from '../context/HouseholdContext';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/common/PageHeader';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import VisitorCard from '../components/visitors/VisitorCard';
import VisitorDetailsModal from '../components/visitors/VisitorDetailsModal';
import VisitorDecisionModal from '../components/visitors/VisitorDecisionModal';
import ServiceRequestModal from '../components/services/ServiceRequestModal';
import ServiceDetailsModal from '../components/services/ServiceDetailsModal';
import CreatePassModal from '../components/passes/CreatePassModal';
import PassTicketModal from '../components/passes/PassTicketModal';
import VehicleFormModal from '../components/vehicles/VehicleFormModal';
import MemberFormModal from '../components/family/MemberFormModal';
import { formatDate } from '../utils/formatters';
import {
  UserCheck,
  Wrench,
  QrCode,
  Car,
  Bell,
  ArrowRight,
  Plus,
  Shield,
  Building2,
  Megaphone,
  AlertCircle,
  Calendar,
  Sparkles,
  Users
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser, isHead } = useAuth();
  const {
    household,
    visitors,
    serviceRequests,
    announcements,
    pendingVisitorsCount,
    activeServicesCount,
    activePassesCount,
    vehiclesCount,
    unreadNotificationsCount,
    decideVisitor
  } = useHousehold();
  const { addToast } = useToast();

  // Modals state
  const [activeVisitorDetails, setActiveVisitorDetails] = useState(null);
  const [decisionModalData, setDecisionModalData] = useState({ isOpen: false, visitor: null, decision: null });
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [activeServiceDetails, setActiveServiceDetails] = useState(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [createdPassModal, setCreatedPassModal] = useState(null);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [activeAnnouncement, setActiveAnnouncement] = useState(null);

  const handleDecisionClick = (visitor, decision) => {
    setDecisionModalData({ isOpen: true, visitor, decision });
  };

  const handleConfirmDecision = (visitorId, decision, note) => {
    const res = decideVisitor(visitorId, decision, note, currentUser);
    if (res.success) {
      addToast({
        title: 'Visitor Decision Recorded',
        message: res.message,
        type: 'success'
      });
    } else {
      addToast({
        title: 'Decision Error',
        message: res.message,
        type: 'error'
      });
    }
  };

  const recentVisitors = visitors.slice(0, 3);
  const recentServices = serviceRequests.slice(0, 2);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Banner - Sleek Glass Blue Banner */}
      <div className="glass-blue-banner rounded-3xl p-4 sm:p-6 text-white relative overflow-hidden shadow-glass-lg">
        {/* Subtle inner atmospheric glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-sky-300/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100 bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30 backdrop-blur-xs">
                {household.tower} • Flat {household.flatNumber}
              </span>
              <span className="text-xs text-blue-100/90 font-medium">
                {household.apartmentName}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Good day, {currentUser?.name?.split(' ')[0]}!
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 font-medium mt-0.5">
              Welcome back to your smart residential command center.
            </p>
          </div>

          {/* Quick Action Buttons - Mobile Responsive 2-Col or Flex */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5 shrink-0 w-full md:w-auto">
            <Button
              variant="secondary"
              size="md"
              icon={QrCode}
              onClick={() => setIsPassModalOpen(true)}
              className="w-full sm:w-auto justify-center text-xs sm:text-sm px-3 sm:px-4 py-2 bg-white/95 text-blue-900 border-white hover:bg-white shadow-md font-bold"
            >
              New Guest Pass
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={Wrench}
              onClick={() => setIsServiceModalOpen(true)}
              className="w-full sm:w-auto justify-center text-xs sm:text-sm px-3 sm:px-4 py-2 bg-white/20 hover:bg-white/30 text-white border-white/40 shadow-xs backdrop-blur-md font-bold"
            >
              Book Service
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row - 2 cols on mobile, 5 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
        {/* Pending Visitors */}
        <div
          onClick={() => navigate('/visitors')}
          className="glass-card rounded-2xl p-3.5 sm:p-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80 group-hover:scale-110 transition-transform">
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            {pendingVisitorsCount > 0 && (
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping"></span>
            )}
          </div>
          <p className="text-xl sm:text-2xl font-black text-blue-950">{pendingVisitorsCount}</p>
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5 truncate">Pending Visitors</p>
        </div>

        {/* Active Services */}
        <div
          onClick={() => navigate('/services')}
          className="glass-card rounded-2xl p-3.5 sm:p-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100/80 group-hover:scale-110 transition-transform">
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-blue-950">{activeServicesCount}</p>
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5 truncate">Active Services</p>
        </div>

        {/* Upcoming Passes */}
        <div
          onClick={() => navigate('/visitors?tab=pre-approved')}
          className="glass-card rounded-2xl p-3.5 sm:p-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/80 group-hover:scale-110 transition-transform">
              <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-blue-950">{activePassesCount}</p>
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5 truncate">Upcoming Passes</p>
        </div>

        {/* Registered Vehicles */}
        <div
          onClick={() => navigate('/vehicles')}
          className="glass-card rounded-2xl p-3.5 sm:p-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100/80 group-hover:scale-110 transition-transform">
              <Car className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-blue-950">{vehiclesCount}</p>
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5 truncate">Vehicles</p>
        </div>

        {/* Unread Alerts */}
        <div
          onClick={() => navigate('/notifications')}
          className="col-span-2 sm:col-span-1 glass-card rounded-2xl p-3.5 sm:p-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80 group-hover:scale-110 transition-transform">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-blue-950">{unreadNotificationsCount}</p>
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5 truncate">Unread Alerts</p>
        </div>
      </div>

      {/* Main Grid: Left column (Visitors & Services), Right column (Announcements & Shortcuts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          {/* Recent Visitor Activity */}
          <div className="glass-card rounded-3xl p-4 sm:p-6 shadow-glass">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-blue-950">Recent Visitor Activity</h3>
                <p className="text-xs text-slate-500 font-medium">Live gate arrivals & real-time check-ins</p>
              </div>
              <Link
                to="/visitors"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentVisitors.map((visitor) => (
                <VisitorCard
                  key={visitor.id}
                  visitor={visitor}
                  onInspect={(v) => setActiveVisitorDetails(v)}
                  onDecision={handleDecisionClick}
                />
              ))}

              {recentVisitors.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">
                  No recent visitor logs.
                </p>
              )}
            </div>
          </div>

          {/* Active Service Requests */}
          <div className="glass-card rounded-3xl p-4 sm:p-6 shadow-glass">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-blue-950">Active Service Requests</h3>
                <p className="text-xs text-slate-500 font-medium">Current apartment maintenance & repairs</p>
              </div>
              <Link
                to="/services"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition-colors"
              >
                <span>All services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentServices.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setActiveServiceDetails(ticket)}
                  className="p-3.5 sm:p-4 rounded-2xl glass-card border border-blue-100/80 hover:border-blue-300 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {ticket.id}
                      </span>
                      <span className="text-xs font-bold text-blue-950">
                        {ticket.category}
                      </span>
                      <Badge
                        variant={
                          ticket.status === 'Completed'
                            ? 'success'
                            : ticket.status === 'Cancelled'
                            ? 'danger'
                            : 'primary'
                        }
                        size="sm"
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-blue-950 truncate">{ticket.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Preferred: {ticket.preferredDate} ({ticket.preferredTimeSlot.split(' ')[0]})
                    </p>
                  </div>

                  <button
                    type="button"
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 shrink-0"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {recentServices.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-400">
                  No active service requests right now.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Community Notices & Quick Actions */}
        <div className="space-y-5 sm:space-y-6">
          {/* Community Announcements */}
          <div className="glass-card rounded-3xl p-4 sm:p-6 shadow-glass">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                  <Megaphone className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-black text-blue-950 uppercase tracking-wider">
                  Community Notices
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  onClick={() => setActiveAnnouncement(ann)}
                  className="p-3.5 rounded-2xl bg-white/70 border border-blue-100/80 hover:border-blue-300 hover:bg-blue-50/40 cursor-pointer transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {ann.badge}
                    </span>
                    <span className="text-[10px] text-slate-400">{ann.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-blue-950 line-clamp-1">{ann.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {ann.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="glass-card rounded-3xl p-4 sm:p-6 shadow-glass space-y-2.5">
            <h3 className="text-xs font-black text-blue-950 uppercase tracking-wider mb-2">
              Apartment Management Actions
            </h3>

            <button
              onClick={() => setIsPassModalOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/80 hover:bg-blue-50/80 border border-blue-100 transition-all text-xs font-bold text-blue-950 text-left shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <QrCode className="w-4 h-4" />
                </div>
                <span>Create Guest Pass</span>
              </div>
              <Plus className="w-4 h-4 text-blue-600" />
            </button>

            <button
              onClick={() => setIsServiceModalOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/80 hover:bg-blue-50/80 border border-blue-100 transition-all text-xs font-bold text-blue-950 text-left shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                  <Wrench className="w-4 h-4" />
                </div>
                <span>Book Service</span>
              </div>
              <Plus className="w-4 h-4 text-sky-600" />
            </button>

            <button
              onClick={() => setIsVehicleModalOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/80 hover:bg-blue-50/80 border border-blue-100 transition-all text-xs font-bold text-blue-950 text-left shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                  <Car className="w-4 h-4" />
                </div>
                <span>Register Vehicle</span>
              </div>
              <Plus className="w-4 h-4 text-blue-700" />
            </button>

            {isHead && (
              <button
                onClick={() => setIsMemberModalOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/80 hover:bg-blue-50/80 border border-blue-100 transition-all text-xs font-bold text-blue-950 text-left shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <Users className="w-4 h-4" />
                  </div>
                  <span>Invite Family Member</span>
                </div>
                <Plus className="w-4 h-4 text-indigo-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal Dialogs */}
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

      <ServiceRequestModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
      />

      <ServiceDetailsModal
        isOpen={!!activeServiceDetails}
        ticket={activeServiceDetails}
        onClose={() => setActiveServiceDetails(null)}
      />

      <CreatePassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        onPassCreated={(newPass) => setCreatedPassModal(newPass)}
      />

      <PassTicketModal
        isOpen={!!createdPassModal}
        pass={createdPassModal}
        onClose={() => setCreatedPassModal(null)}
      />

      <VehicleFormModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
      />

      <MemberFormModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
      />

      {/* Announcement Detail Modal */}
      <Modal
        isOpen={!!activeAnnouncement}
        onClose={() => setActiveAnnouncement(null)}
        title={activeAnnouncement?.title}
        subtitle={`Posted on ${activeAnnouncement?.date} • ${activeAnnouncement?.badge}`}
        maxWidth="max-w-lg"
      >
        {activeAnnouncement && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-950 font-semibold leading-relaxed">
              {activeAnnouncement.summary}
            </div>
            <p className="text-slate-700 leading-relaxed text-sm">
              {activeAnnouncement.details}
            </p>
            <div className="flex justify-end pt-3 border-t border-blue-100">
              <Button variant="secondary" size="md" onClick={() => setActiveAnnouncement(null)}>
                Close Notice
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
