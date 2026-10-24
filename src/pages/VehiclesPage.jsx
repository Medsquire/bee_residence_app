import React, { useState, useMemo } from 'react';
import PageHeader from '../components/common/PageHeader';
import SearchInput from '../components/common/SearchInput';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import VehicleCard from '../components/vehicles/VehicleCard';
import VehicleFormModal from '../components/vehicles/VehicleFormModal';
import { useHousehold } from '../context/HouseholdContext';
import { Car, Plus, ShieldCheck, MapPin } from 'lucide-react';

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
    <div className="space-y-5">
      {/* Header */}
      <PageHeader
        title="My Vehicles & Parking"
        badge={
          <Badge variant="neutral" size="md">
            {vehiclesCount} Registered
          </Badge>
        }
        action={
          <Button
            variant="gold"
            size="md"
            icon={Plus}
            onClick={() => {
              setVehicleToEdit(null);
              setIsFormOpen(true);
            }}
          >
            Register Vehicle
          </Button>
        }
      />

      {/* Household Parking Slots Overview Pill */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Designated Apartment Parking Slots
          </span>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {household.parkingSlots?.map((slot, i) => (
              <span
                key={i}
                className="font-mono text-xs font-bold text-navy-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-bee-600" />
                {slot}
              </span>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 max-w-xs">
          Automatic RFID gate clearance is enabled for all registered household plates.
        </div>
      </div>

      {/* Search Bar */}
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by license plate, make & model, or owner..."
        className="max-w-md"
      />

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          description="Register your 4-wheeler, 2-wheeler, or EV to receive automated boom barrier entry clearance and parking validation."
          actionLabel="Register Vehicle"
          actionIcon={Plus}
          onAction={() => {
            setVehicleToEdit(null);
            setIsFormOpen(true);
          }}
        />
      )}

      {/* Add / Edit Form Modal */}
      <VehicleFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setVehicleToEdit(null);
        }}
        vehicleToEdit={vehicleToEdit}
      />
    </div>
  );
}
