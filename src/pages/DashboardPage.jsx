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

  // Recent 3 visitors
  const recentVisitors = visitors.slice(0, 3);
  // Active / recent 2 service requests
  const recentServices = serviceRequests.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-950 p-3.5 sm:p-5 md:p-6 text-white relative overflow-hidden shadow-card border border-navy-700/60">
        <div className="absolute top-0 right-0 w-80 h-80 bg-bee-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-bee-400 bg-bee-500/15 px-2.5 py-0.5 rounded-full border border-bee-500/30">
                {household.tower} • Flat {household.flatNumber}
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                {household.apartmentName}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2.5 shrink-0 w-full sm:w-auto">
            <Button
              variant="gold"
              size="md"
              icon={QrCode}
              onClick={() => setIsPassModalOpen(true)}
              className="w-full sm:w-auto justify-center text-xs sm:text-sm px-2.5 sm:px-4 py-2"
            >
              New Guest Pass
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={Wrench}
              onClick={() => setIsServiceModalOpen(true)}
              className="w-full sm:w-auto justify-center text-xs sm:text-sm px-2.5 sm:px-4 py-2"
            >
              Book Service
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Pending Visitors */}
        <div
          onClick={() => navigate('/visitors')}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-amber-300 hover:shadow-card cursor-pointer transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-amber-50 text-bee-600 group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            {pendingVisitorsCount > 0 && (
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
            )}
          </div>
          <p className="text-2xl font-black text-navy-900">{pendingVisitorsCount}</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Pending Visitors</p>
        </div>

        {/* Active Services */}
        <div
          onClick={() => navigate('/services')}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-amber-300 hover:shadow-card cursor-pointer transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600 group-hover:scale-110 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-navy-900">{activeServicesCount}</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Active Services</p>
        </div>

        {/* Upcoming Passes */}
        <div
          onClick={() => navigate('/pre-approved')}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-amber-300 hover:shadow-card cursor-pointer transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-navy-900">{activePassesCount}</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Upcoming Passes</p>
        </div>

        {/* Registered Vehicles */}
        <div
          onClick={() => navigate('/vehicles')}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-amber-300 hover:shadow-card cursor-pointer transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-navy-900">{vehiclesCount}</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Vehicles</p>
        </div>

        {/* Unread Notifications */}
        <div
          onClick={() => navigate('/notifications')}
          className="col-span-2 sm:col-span-1 bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-amber-300 hover:shadow-card cursor-pointer transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 group-hover:scale-110 transition-transform">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-navy-900">{unreadNotificationsCount}</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Unread Alerts</p>
        </div>
      </div>

      {/* Main Grid: Left column (Visitors & Services), Right column (Announcements & Quick Shortcuts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Visitor Activity */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-navy-900">Recent Visitor Activity</h3>
                <p className="text-xs text-slate-500">Live gate arrivals & check-ins</p>
              </div>
              <Link
                to="/visitors"
                className="text-xs font-bold text-bee-700 hover:text-bee-800 inline-flex items-center gap-1"
              >
                <span>View all visitors</span>
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
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-navy-900">Active Service Requests</h3>
                <p className="text-xs text-slate-500">Current home maintenance and repair tickets</p>
              </div>
              <Link
                to="/services"
                className="text-xs font-bold text-bee-700 hover:text-bee-800 inline-flex items-center gap-1"
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
                  className="p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs cursor-pointer transition-all bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {ticket.id}
                      </span>
                      <span className="text-xs font-bold text-navy-900">
                        {ticket.category}
                      </span>
                      <Badge
                        variant={
                          ticket.status === 'Completed'
                            ? 'success'
                            : ticket.status === 'Cancelled'
                            ? 'danger'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-xs font-bold text-navy-900 truncate">{ticket.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Preferred: {ticket.preferredDate} ({ticket.preferredTimeSlot.split(' ')[0]})
                    </p>
                  </div>

                  <button
                    type="button"
                    className="text-xs font-bold text-navy-800 hover:text-bee-600 inline-flex items-center gap-1 shrink-0"
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

        {/* Right Column (1 Col): Community Announcements & Shortcuts */}
        <div className="space-y-6">
          {/* Community Announcements */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 text-bee-600">
                  <Megaphone className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
                  Community Notices
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  onClick={() => setActiveAnnouncement(ann)}
                  className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold text-bee-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {ann.badge}
                    </span>
                    <span className="text-[10px] text-slate-400">{ann.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-navy-900 line-clamp-1">{ann.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {ann.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
              Apartment Management Actions
            </h3>

            <button
              onClick={() => setIsPassModalOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-bold text-navy-900 text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <QrCode className="w-4 h-4" />
                </div>
                <span>Create Guest Pass</span>
              </div>
              <Plus className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setIsServiceModalOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-bold text-navy-900 text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-100 text-sky-800">
                  <Wrench className="w-4 h-4" />
                </div>
                <span>Book Home Service</span>
              </div>
              <Plus className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setIsVehicleModalOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-bold text-navy-900 text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <Car className="w-4 h-4" />
                </div>
                <span>Register Vehicle</span>
              </div>
              <Plus className="w-4 h-4 text-slate-400" />
            </button>

            {isHead && (
              <button
                onClick={() => setIsMemberModalOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-bold text-navy-900 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
                    <Users className="w-4 h-4" />
                  </div>
                  <span>Invite Family Member</span>
                </div>
                <Plus className="w-4 h-4 text-slate-400" />
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
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold leading-relaxed">
              {activeAnnouncement.summary}
            </div>
            <p className="text-slate-700 leading-relaxed text-sm">
              {activeAnnouncement.details}
            </p>
            <div className="flex justify-end pt-3 border-t border-slate-100">
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
