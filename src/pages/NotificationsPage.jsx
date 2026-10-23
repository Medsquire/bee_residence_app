import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { useHousehold } from '../context/HouseholdContext';
import { useToast } from '../context/ToastContext';
import { getTimeAgo } from '../utils/formatters';
import {
  Bell,
  CheckCheck,
  Trash2,
  UserCheck,
  Wrench,
  Megaphone,
  QrCode,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

const TABS = [
  { id: 'all', label: 'All Alerts' },
  { id: 'unread', label: 'Unread' },
  { id: 'Visitors', label: 'Visitors' },
  { id: 'Services', label: 'Services' },
  { id: 'Community', label: 'Community Notices' }
];

const CATEGORY_ICONS = {
  Visitors: UserCheck,
  Services: Wrench,
  Community: Megaphone,
  System: ShieldAlert
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification
  } = useHousehold();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('all');

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (activeTab === 'unread') return !n.isRead;
      if (activeTab !== 'all' && n.category !== activeTab) return false;
      return true;
    });
  }, [notifications, activeTab]);

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    addToast({
      title: 'All Alerts Read',
      message: 'All notifications have been marked as read.',
      type: 'info'
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications & Community Alerts"
        subtitle="Real-time updates regarding visitor gate arrivals, technician assignments, and society notices."
        badge={
          unreadNotificationsCount > 0 ? (
            <Badge variant="danger" size="md">
              {unreadNotificationsCount} Unread
            </Badge>
          ) : null
        }
        action={
          unreadNotificationsCount > 0 ? (
            <Button
              variant="secondary"
              size="md"
              icon={CheckCheck}
              onClick={handleMarkAllRead}
            >
              Mark all as read
            </Button>
          ) : null
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count =
            tab.id === 'all'
              ? notifications.length
              : tab.id === 'unread'
              ? unreadNotificationsCount
              : notifications.filter((n) => n.category === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-navy-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-bee-500 text-navy-950'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const Icon = CATEGORY_ICONS[item.category] || Bell;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-3 ${
                !item.isRead
                  ? 'bg-amber-50/50 border-amber-300/80 shadow-xs ring-1 ring-amber-100'
                  : 'bg-white border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    item.category === 'Visitors'
                      ? 'bg-amber-100 text-amber-800'
                      : item.category === 'Services'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4
                      className={`text-xs sm:text-sm ${
                        !item.isRead ? 'font-black text-navy-900' : 'font-bold text-slate-800'
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-400">
                      • {getTimeAgo(item.timestamp)}
                    </span>
                    {!item.isRead && (
                      <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.message}
                  </p>

                  {item.link && (
                    <button
                      type="button"
                      onClick={() => {
                        markNotificationRead(item.id);
                        navigate(item.link);
                      }}
                      className="mt-2 text-xs font-bold text-bee-700 hover:text-bee-800 inline-flex items-center gap-1"
                    >
                      <span>Take Action / View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                {!item.isRead && (
                  <button
                    type="button"
                    onClick={() => markNotificationRead(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-bee-600 hover:bg-slate-100 transition-colors"
                    title="Mark as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => deleteNotification(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <EmptyState
            icon={Bell}
            title={activeTab === 'unread' ? 'No Unread Alerts' : 'No Notifications'}
            description="You are completely caught up! New visitor requests and maintenance updates will appear here."
          />
        )}
      </div>
    </div>
  );
}
