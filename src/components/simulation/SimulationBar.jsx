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
    <div className="fixed bottom-16 lg:bottom-5 right-4 z-40 max-w-sm">
      <div className="bg-navy-950/95 text-white backdrop-blur-md rounded-2xl border border-bee-500/30 shadow-2xl overflow-hidden transition-all duration-300">
        {/* Header toggle */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between px-3.5 py-2.5 cursor-pointer bg-navy-900/80 hover:bg-navy-900 transition-colors select-none"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-bee-400 animate-ping"></span>
            <span className="text-xs font-bold text-bee-400 tracking-wide uppercase">
              Demo Simulation Toolkit
            </span>
          </div>
          <button className="text-slate-400 hover:text-white">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Collapsible content */}
        {isExpanded && (
          <div className="p-3.5 space-y-3 text-xs border-t border-navy-800">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-bee-400" />
                Active Persona (Test Shared Household)
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {availableUsers.slice(0, 2).map((user) => (
                  <button
                    key={user.id}
                    onClick={() => switchUser(user.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-left transition-all ${
                      currentUser?.id === user.id
                        ? 'bg-bee-500 text-navy-950 font-bold'
                        : 'bg-navy-800 text-slate-300 hover:bg-navy-700 font-medium'
                    }`}
                  >
                    <p className="truncate">{user.name.split(' ')[0]}</p>
                    <p className="text-[9px] opacity-80">{user.role === 'HEAD' ? 'Head' : 'Member'}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-1 border-t border-navy-800/80">
              <button
                onClick={handleSimulateVisitor}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-bee-500 text-navy-950 font-bold hover:bg-bee-400 transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                Simulate Gate Arrival
              </button>

              <button
                onClick={handleAdvanceService}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-navy-800 text-slate-200 font-semibold hover:bg-navy-700 hover:text-white transition-colors"
              >
                <Wrench className="w-3.5 h-3.5 text-bee-400" />
                Advance Service Lifecycle
              </button>

              <button
                onClick={handleResetData}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Demo Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
