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
      <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-card transition-all duration-200 p-5 flex flex-col justify-between">
        <div>
          {/* Header & Plate */}
          <div className="flex items-start justify-between gap-2 mb-3">
            {/* Indian Number Plate styling */}
            <div
              className={`inline-flex items-center rounded-md border-2 font-mono font-bold text-xs tracking-wider shadow-xs overflow-hidden ${
                isEV
                  ? 'border-emerald-700 bg-emerald-700 text-white'
                  : 'border-slate-900 bg-white text-slate-900'
              }`}
            >
              <div
                className={`px-1.5 py-0.5 text-[9px] flex flex-col items-center justify-center font-black ${
                  isEV ? 'bg-emerald-800 text-white' : 'bg-navy-950 text-white'
                }`}
              >
                <span>IND</span>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-black tracking-widest">
                {vehicle.registrationNumber}
              </span>
            </div>

            <Badge variant={isEV ? 'success' : 'neutral'} size="sm">
              {isEV && <Zap className="w-3 h-3 fill-current text-emerald-600" />}
              {vehicle.type}
            </Badge>
          </div>

          {/* Make, Model & Color */}
          <h4 className="font-bold text-navy-900 text-base leading-snug mt-2">
            {vehicle.makeModel}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-400 shrink-0" />
            <span>Color: {vehicle.color}</span>
          </p>

          {/* Owner & Slot metadata */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>Owner:</span>
              </span>
              <span className="font-semibold text-slate-800">{vehicle.ownerName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Parking Slot:</span>
              </span>
              <span className="font-mono font-bold text-navy-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {vehicle.parkingSlot || 'Unassigned'}
              </span>
            </div>

            {vehicle.rfidTag && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-bee-600" />
                  <span>RFID Tag:</span>
                </span>
                <span className="font-mono text-[11px] text-slate-500">{vehicle.rfidTag}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Verified Active
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(vehicle)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition-colors"
              title="Edit Vehicle"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete Vehicle"
            >
              <Trash2 className="w-3.5 h-3.5" />
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
