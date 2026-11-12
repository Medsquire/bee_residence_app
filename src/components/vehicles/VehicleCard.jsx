import React, { useState } from 'react';
import Badge from '../common/Badge';
import ConfirmDialog from '../common/ConfirmDialog';
import { useAuth } from '../../context/AuthContext';
import { useHousehold } from '../../context/HouseholdContext';
import { useToast } from '../../context/ToastContext';
import { Car, Bike, Zap, User, MapPin, Edit2, Trash2, Radio } from 'lucide-react';

export default function VehicleCard({ vehicle, onEdit }) {
  const { currentUser, isHead } = useAuth();
  const { deleteVehicle } = useHousehold();
  const { addToast } = useToast();

  const [confirmDelete, setConfirmDelete] = useState(false);

  const isEV = vehicle.type === 'Electric Vehicle';

  const handleDelete = () => {
    deleteVehicle(vehicle.id, currentUser);
    addToast({
      title: 'Vehicle Removed',
      message: `${vehicle.registrationNumber} removed from household.`,
      type: 'info'
    });
    setConfirmDelete(false);
  };

  return (
    <>
      <div className="glass-stat-white rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between">
        <div>
          {/* Header & Plate */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            {/* Indian Number Plate styling */}
            <div
              className={`inline-flex items-center rounded-md border font-mono font-medium text-xs tracking-wider shadow-xs overflow-hidden ${
                isEV
                  ? 'border-emerald-700 bg-emerald-700 text-white'
                  : 'border-blue-900 bg-white text-black'
              }`}
            >
              <div
                className={`px-1.5 py-0.5 text-[9px] flex flex-col items-center justify-center font-medium ${
                  isEV ? 'bg-emerald-800 text-white' : 'bg-blue-900 text-white'
                }`}
              >
                <span>IND</span>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-medium tracking-widest">
                {vehicle.registrationNumber}
              </span>
            </div>

            <Badge variant={isEV ? 'success' : 'primary'} size="sm">
              {isEV && <Zap className="w-3 h-3 fill-current text-emerald-600" strokeWidth={1.5} />}
              {vehicle.type}
            </Badge>
          </div>

          {/* Make, Model & Color */}
          <h4 className="font-medium text-black dark:text-white text-sm sm:text-base leading-snug mt-1.5">
            {vehicle.makeModel}
          </h4>
          <p className="text-xs font-normal text-black/80 dark:text-slate-200 mt-0.5 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-300 border border-blue-400 shrink-0" />
            <span>Color: {vehicle.color}</span>
          </p>

          {/* Owner & Slot metadata */}
          <div className="mt-3 pt-2.5 border-t border-blue-100/70 dark:border-slate-700/70 space-y-1.5 text-xs text-black dark:text-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-black/75 dark:text-slate-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" strokeWidth={1.5} />
                <span>Owner:</span>
              </span>
              <span className="font-medium text-black dark:text-white">{vehicle.ownerName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-black/75 dark:text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" strokeWidth={1.5} />
                <span>Parking Slot:</span>
              </span>
              <span className="font-mono font-medium text-blue-800 dark:text-sky-300 bg-blue-50/90 dark:bg-slate-800 px-2 py-0.5 rounded border border-blue-200/80 dark:border-slate-700">
                {vehicle.parkingSlot || 'Unassigned'}
              </span>
            </div>

            {vehicle.rfidTag && (
              <div className="flex items-center justify-between">
                <span className="text-black/75 dark:text-slate-300 flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" strokeWidth={1.5} />
                  <span>RFID Tag:</span>
                </span>
                <span className="font-mono text-[11px] text-black dark:text-white">{vehicle.rfidTag}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 pt-2.5 border-t border-blue-100/70 dark:border-slate-700/70 flex items-center justify-between">
          <span className="text-[11px] text-blue-700 dark:text-sky-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Verified Active
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(vehicle)}
              className="p-1.5 rounded-lg text-black/70 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50/80 dark:hover:bg-slate-800 transition-colors"
              title="Edit Vehicle"
            >
              <Edit2 className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg text-black/70 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50/80 dark:hover:bg-rose-950/50 transition-colors"
              title="Delete Vehicle"
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Remove Vehicle?"
        message={`Are you sure you want to remove ${vehicle.registrationNumber} (${vehicle.makeModel}) from Flat 1204? Society gate RFID access will be revoked.`}
        confirmText="Remove Vehicle"
        variant="danger"
      />
    </>
  );
}
