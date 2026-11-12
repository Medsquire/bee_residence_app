import React, { useState, useMemo } from 'react';
import PageHeader from '../components/common/PageHeader';
import AddIconButton from '../components/common/AddIconButton';
import SearchInput from '../components/common/SearchInput';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import VehicleCard from '../components/vehicles/VehicleCard';
import VehicleFormModal from '../components/vehicles/VehicleFormModal';
import { useHousehold } from '../context/HouseholdContext';
import { Car, Plus, MapPin } from 'lucide-react';

export default function VehiclesPage() {
  const { vehicles, household, vehiclesCount } = useHousehold();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVehicles = useMemo(() => {
    if (!searchQuery.trim()) return vehicles;
    const query = searchQuery.toLowerCase();
    return vehicles.filter(
      (v) =>
        v.registrationNumber.toLowerCase().includes(query) ||
        v.makeModel.toLowerCase().includes(query) ||
        v.ownerName.toLowerCase().includes(query) ||
        v.parkingSlot.toLowerCase().includes(query)
    );
  }, [vehicles, searchQuery]);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <PageHeader
        title="My Vehicles & Parking"
        badge={
          <Badge variant="primary" size="md">
            {vehiclesCount} Registered
          </Badge>
        }
        inlineAction={
          <AddIconButton
            onClick={() => {
              setVehicleToEdit(null);
              setIsFormOpen(true);
            }}
            label="Register Vehicle"
          />
        }
      />

      {/* Household Parking Slots Overview Pill */}
      <div className="p-3.5 sm:p-4 rounded-2xl glass-card flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider block">
            Designated Apartment Parking Slots
          </span>
          <p className="text-xs text-slate-500 mt-0.5">
            Allocated exclusively to Flat 1204 under Bee Hive Residency By-laws.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {household?.parkingSlots?.map((slot) => (
            <div
              key={slot}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-950 border border-blue-200 text-xs font-mono font-bold shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{slot}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by license plate, make, model, or owner..."
        className="max-w-md w-full"
      />

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onEdit={(v) => {
              setVehicleToEdit(v);
              setIsFormOpen(true);
            }}
          />
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <EmptyState
          icon={Car}
          title="No Vehicles Registered"
          description={
            vehicles.length === 0
              ? 'No vehicles registered for Flat 1204 yet. Add your car, two-wheeler, or EV for automatic security barrier clearance.'
              : 'No vehicles match your current search query.'
          }
          actionLabel="Register Vehicle"
          actionIcon={Plus}
          onAction={() => {
            setVehicleToEdit(null);
            setIsFormOpen(true);
          }}
        />
      )}

      {/* Vehicle Form Modal */}
      <VehicleFormModal
        isOpen={isFormOpen}
        vehicleToEdit={vehicleToEdit}
        onClose={() => {
          setIsFormOpen(false);
          setVehicleToEdit(null);
        }}
      />
    </div>
  );
}
