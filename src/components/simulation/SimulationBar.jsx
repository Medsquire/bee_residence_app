import React, { useState } from 'react';
import { Sparkles, RefreshCw, ChevronUp, ChevronDown, Wrench, Shield, CheckCircle } from 'lucide-react';
import { useHousehold } from '../../context/HouseholdContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function SimulationBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { simulateIncomingVisitor, advanceServiceStatus, serviceRequests, resetAllData } = useHousehold();
  const { currentUser, isHead, switchUser, availableUsers } = useAuth();
  const { addToast } = useToast();

  const handleSimulateVisitor = () => {
    const visitor = simulateIncomingVisitor();
    addToast({
      title: 'Simulated Gate Arrival',
      message: `${visitor.name} arrived at ${visitor.gateNumber}. Decision pending!`,
      type: 'info'
    });
  };

  const handleAdvanceService = () => {
    const active = serviceRequests.find((s) => !['Completed', 'Cancelled'].includes(s.status));
    if (!active) {
      addToast({
        title: 'No Active Service Ticket',
        message: 'Create a new service request first to simulate lifecycle progression.',
        type: 'warning'
      });
      return;
    }
    advanceServiceStatus(active.id);
    addToast({
      title: 'Service Status Advanced',
      message: `Ticket ${active.id} updated by Facility Administration.`,
      type: 'success'
    });
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to factory defaults?')) {
      resetAllData();
      addToast({
        title: 'Demo Data Restored',
        message: 'All visitors, service tickets, and passes reset to default state.',
        type: 'info'
      });
    }
  };

  return (
    <div className="fixed bottom-20 lg:bottom-5 right-3 sm:right-5 z-40 max-w-xs sm:max-w-sm w-[calc(100%-1.5rem)] sm:w-auto">
      <div className="glass-modal rounded-2xl border border-white/95 shadow-glass-lg overflow-hidden transition-all duration-300">
        {/* Header toggle */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between px-3.5 py-2.5 cursor-pointer bg-blue-50/70 hover:bg-blue-100/60 transition-colors select-none"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
            <span className="text-xs font-bold text-blue-900 tracking-wide">
              Demo Simulation Toolkit
            </span>
          </div>
          <button className="text-blue-600 hover:text-blue-900">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Collapsible content */}
        {isExpanded && (
          <div className="p-3.5 space-y-3 text-xs border-t border-blue-100/70 bg-white/70">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                Active Persona (Test Shared Household)
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {availableUsers.slice(0, 2).map((user) => (
                  <button
                    key={user.id}
                    onClick={() => switchUser(user.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-left transition-all ${
                      currentUser?.id === user.id
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-white/80 text-slate-700 hover:bg-blue-50/70 border border-blue-100 font-medium'
                    }`}
                  >
                    <p className="truncate font-semibold">{user.name.split(' ')[0]}</p>
                    <p className={`text-[9px] ${currentUser?.id === user.id ? 'text-blue-100' : 'text-slate-400'}`}>
                      {user.role === 'HEAD' ? 'Head' : 'Member'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-1 border-t border-blue-100/60">
              <button
                onClick={handleSimulateVisitor}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate Visitor Arrival</span>
              </button>

              <button
                onClick={handleAdvanceService}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-blue-50 border border-blue-200 text-blue-800 font-semibold transition-colors"
              >
                <Wrench className="w-3.5 h-3.5 text-blue-600" />
                <span>Advance Active Service Status</span>
              </button>

              <button
                onClick={handleResetData}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] text-slate-500 hover:text-rose-600 hover:bg-rose-50/50 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Demo State</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
