import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useHousehold } from '../context/HouseholdContext';
import { useToast } from '../context/ToastContext';
import { EMERGENCY_CONTACTS } from '../data/initialData';
import {
  User,
  Phone,
  Mail,
  Building,
  Lock,
  Bell,
  PhoneCall,
  ShieldAlert,
  RefreshCw,
  LogOut,
  Check,
  ShieldCheck
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, isHead, updateProfile, logout } = useAuth();
  const { household, resetAllData } = useHousehold();
  const { addToast } = useToast();

  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationsPrefs, setNotificationsPrefs] = useState({
    visitorArrivals: true,
    serviceStatus: true,
    communityBroadcasts: true,
    whatsappAlerts: true,
    smsAlerts: false
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    addToast({
      title: 'Profile Saved',
      message: 'Your personal information has been updated.',
      type: 'success'
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addToast({
        title: 'Password Mismatch',
        message: 'New password and confirmation do not match.',
        type: 'error'
      });
      return;
    }
    addToast({
      title: 'Password Updated',
      message: 'Password changed successfully for demonstration.',
      type: 'success'
    });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleTogglePref = (key) => {
    setNotificationsPrefs((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      addToast({
        title: 'Preferences Updated',
        message: 'Notification settings have been saved.',
        type: 'info'
      });
      return updated;
    });
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to default factory state?')) {
      resetAllData();
      addToast({
        title: 'Factory Data Restored',
        message: 'Visitors, service requests, passes, and vehicles reset to clean state.',
        type: 'info'
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Profile & Apartment Settings"
        subtitle="Manage resident contact details, notification preferences, security contacts, and password."
      />

      {/* Top Profile Summary Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
            alt={currentUser?.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-bee-400/40 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-navy-900">{currentUser?.name}</h2>
              <Badge variant={isHead ? 'gold' : 'neutral'} size="sm">
                {isHead ? 'Household Head' : 'Household Member'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {household.tower} • Flat {household.flatNumber} • {household.apartmentName}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Move-in Date: {currentUser?.moveInDate || '15 Apr 2023'}
            </p>
          </div>
        </div>

        <Button variant="danger" size="md" icon={LogOut} onClick={logout}>
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Details Form */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-bee-600" />
            <span>Personal Information</span>
          </h3>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500"
              />
            </div>

            <Button variant="primary" size="md" type="submit">
              Save Profile Changes
            </Button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
          <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-bee-600" />
            <span>Change Password</span>
          </h3>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Confirm password"
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bee-500"
              />
            </div>

            <Button variant="secondary" size="md" type="submit">
              Update Password
            </Button>
          </form>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-bee-600" />
          <span>Resident Notification Preferences</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-bold text-navy-900">Visitor Arrival Notifications</p>
              <p className="text-[11px] text-slate-500">Alerts when guests/couriers reach gate</p>
            </div>
            <input
              type="checkbox"
              checked={notificationsPrefs.visitorArrivals}
              onChange={() => handleTogglePref('visitorArrivals')}
              className="w-4 h-4 text-bee-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-bold text-navy-900">Service Request Updates</p>
              <p className="text-[11px] text-slate-500">Technician schedule & completion alerts</p>
            </div>
            <input
              type="checkbox"
              checked={notificationsPrefs.serviceStatus}
              onChange={() => handleTogglePref('serviceStatus')}
              className="w-4 h-4 text-bee-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-bold text-navy-900">Community & Maintenance Notices</p>
              <p className="text-[11px] text-slate-500">Water cutoff, power, and AGM announcements</p>
            </div>
            <input
              type="checkbox"
              checked={notificationsPrefs.communityBroadcasts}
              onChange={() => handleTogglePref('communityBroadcasts')}
              className="w-4 h-4 text-bee-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-bold text-navy-900">WhatsApp Instant Alerts</p>
              <p className="text-[11px] text-slate-500">Receive entry OTPs & passes via WhatsApp</p>
            </div>
            <input
              type="checkbox"
              checked={notificationsPrefs.whatsappAlerts}
              onChange={() => handleTogglePref('whatsappAlerts')}
              className="w-4 h-4 text-bee-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Emergency Directory Contacts */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Society Emergency & Helpdesk Directory</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {EMERGENCY_CONTACTS.map((contact, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
            >
              <div>
                <p className="font-bold text-navy-900">{contact.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{contact.role}</p>
              </div>
              <a
                href={`tel:${contact.phone}`}
                className="mt-3 inline-flex items-center gap-1.5 font-bold text-bee-700 hover:text-bee-800"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{contact.phone}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Data Management */}
      <div className="p-5 rounded-3xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-navy-900 text-sm">Demo Data Management</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Reset all visitors, service requests, passes, and vehicles back to the initial PRD demo scenario.
          </p>
        </div>
        <Button variant="secondary" size="md" icon={RefreshCw} onClick={handleResetData}>
          Reset Factory Demo Data
        </Button>
      </div>
    </div>
  );
}
