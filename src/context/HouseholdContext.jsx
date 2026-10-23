import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_HOUSEHOLD,
  INITIAL_USERS,
  INITIAL_VISITORS,
  INITIAL_SERVICE_REQUESTS,
  INITIAL_PRE_APPROVED_PASSES,
  INITIAL_VEHICLES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ACTIVITY_LOGS
} from '../data/initialData';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { generateTicketId, generateId, generateOtp } from '../utils/formatters';

const STORAGE_KEY = 'bee_residence_household_store_v1';

const HouseholdContext = createContext(null);

export function HouseholdProvider({ children }) {
  // Load or initialize state from localStorage
  const [data, setData] = useState(() => {
    const saved = loadFromStorage(STORAGE_KEY, null);
    if (saved) return saved;
    return {
      household: INITIAL_HOUSEHOLD,
      members: INITIAL_USERS,
      visitors: INITIAL_VISITORS,
      serviceRequests: INITIAL_SERVICE_REQUESTS,
      preApprovedPasses: INITIAL_PRE_APPROVED_PASSES,
      vehicles: INITIAL_VEHICLES,
      notifications: INITIAL_NOTIFICATIONS,
      announcements: INITIAL_ANNOUNCEMENTS,
      activityLogs: INITIAL_ACTIVITY_LOGS
    };
  });

  // Save to storage on update
  useEffect(() => {
    saveToStorage(STORAGE_KEY, data);
  }, [data]);

  // Reset to initial demo data
  const resetAllData = useCallback(() => {
    const fresh = {
      household: INITIAL_HOUSEHOLD,
      members: INITIAL_USERS,
      visitors: INITIAL_VISITORS,
      serviceRequests: INITIAL_SERVICE_REQUESTS,
      preApprovedPasses: INITIAL_PRE_APPROVED_PASSES,
      vehicles: INITIAL_VEHICLES,
      notifications: INITIAL_NOTIFICATIONS,
      announcements: INITIAL_ANNOUNCEMENTS,
      activityLogs: INITIAL_ACTIVITY_LOGS
    };
    setData(fresh);
    saveToStorage(STORAGE_KEY, fresh);
  }, []);

  // Helper to add activity log
  const logActivity = useCallback((actorName, actorRole, action, icon = 'activity') => {
    const newLog = {
      id: generateId('LOG'),
      actorName,
      actorRole,
      action,
      timestamp: new Date().toISOString(),
      icon
    };
    setData((prev) => ({
      ...prev,
      activityLogs: [newLog, ...prev.activityLogs]
    }));
  }, []);

  // Helper to add notification
  const addNotification = useCallback((notif) => {
    const newNotif = {
      id: generateId('NOTIF'),
      timestamp: new Date().toISOString(),
      isRead: false,
      ...notif
    };
    setData((prev) => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications]
    }));
  }, []);

  // -------------------------------------------------------------
  // MODULE C: VISITORS & SINGLE-DECISION LOCK
  // -------------------------------------------------------------
  const decideVisitor = useCallback((visitorId, decision, note = '', user) => {
    let result = { success: false, message: '' };

    setData((prev) => {
      const visitor = prev.visitors.find((v) => v.id === visitorId);
      if (!visitor) {
        result = { success: false, message: 'Visitor record not found.' };
        return prev;
      }

      // Check single decision lock rule (PRD Section 5 Module C)
      if (visitor.status !== 'Pending') {
        result = {
          success: false,
          alreadyDecided: true,
          message: `This request was already ${visitor.status.toLowerCase()} by ${visitor.decisionBy || 'another member'} on ${new Date(visitor.decidedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
        };
        return prev;
      }

      const now = new Date().toISOString();
      const updatedVisitors = prev.visitors.map((v) => {
        if (v.id === visitorId) {
          return {
            ...v,
            status: decision, // 'Approved' | 'Rejected' | 'Leave at Gate'
            decisionBy: user?.name || 'Household Resident',
            decidedAt: now,
            decisionNote: note || (decision === 'Leave at Gate' ? 'Instructed security to leave parcels at gate' : `Entry ${decision.toLowerCase()}`)
          };
        }
        return v;
      });

      // Update related notification to read
      const updatedNotifs = prev.notifications.map((n) => {
        if (n.relatedType === 'visitor' && n.relatedId === visitorId) {
          return { ...n, isRead: true };
        }
        return n;
      });

      // Activity log
      const logText = decision === 'Leave at Gate'
        ? `Instructed security: Leave parcels at gate for ${visitor.name}`
        : `${decision} visitor entry for ${visitor.name}`;

      const newLog = {
        id: generateId('LOG'),
        actorName: user?.name || 'Resident',
        actorRole: user?.role || 'MEMBER',
        action: logText,
        timestamp: now,
        icon: decision === 'Approved' ? 'user-check' : decision === 'Rejected' ? 'user-x' : 'package'
      };

      result = {
        success: true,
        message: decision === 'Leave at Gate'
          ? `Security instructed to collect parcel at gate.`
          : `Visitor entry ${decision.toLowerCase()} successfully.`
      };

      return {
        ...prev,
        visitors: updatedVisitors,
        notifications: updatedNotifs,
        activityLogs: [newLog, ...prev.activityLogs]
      };
    });

    return result;
  }, []);

  // Simulate new incoming visitor at gate
  const simulateIncomingVisitor = useCallback(() => {
    const templates = [
      {
        name: 'Blinkit 10-Min Grocery Delivery',
        visitorType: 'Food Delivery',
        category: 'Food Delivery',
        company: 'Blinkit',
        phone: '+91 97711 22334',
        vehicleNumber: 'KA 03 EV 4567',
        purpose: 'Delivery: Groceries & Dairy for Flat 1204',
        photo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=250',
        gateNumber: 'Main Gate (Gate 1)',
        guardName: 'Ramesh Singh (Guard ID #42)',
        itemsToLeave: '1 Blue thermal bag'
      },
      {
        name: 'BlueDart Express Courier',
        visitorType: 'Courier',
        category: 'Courier',
        company: 'BlueDart',
        phone: '+91 98451 98765',
        vehicleNumber: 'KA 01 CJ 9081',
        purpose: 'Priority document envelope delivery',
        photo: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=250',
        gateNumber: 'Service Gate (Gate 3)',
        guardName: 'Gopal Verma (Guard ID #09)',
        itemsToLeave: 'Urgent envelope'
      },
      {
        name: 'Sunita Sharma (Family Friend)',
        visitorType: 'Friends',
        category: 'Friends',
        company: '',
        phone: '+91 99002 44556',
        vehicleNumber: 'KA 04 NM 2211',
        purpose: 'Visiting Sunita Kumar for evening tea',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
        gateNumber: 'Main Gate (Gate 1)',
        guardName: 'Ramesh Singh (Guard ID #42)',
        itemsToLeave: ''
      }
    ];

    const pick = templates[Math.floor(Math.random() * templates.length)];
    const newVisitorId = generateId('VIS');
    const now = new Date().toISOString();

    const newVisitor = {
      id: newVisitorId,
      ...pick,
      status: 'Pending',
      arrivedAt: now,
      decisionBy: null,
      decidedAt: null,
      decisionNote: null
    };

    const newNotif = {
      id: generateId('NOTIF'),
      title: 'New Visitor at Gate',
      message: `${pick.name} has arrived at ${pick.gateNumber} seeking entry for Flat 1204.`,
      category: 'Visitors',
      timestamp: now,
      isRead: false,
      priority: 'High',
      relatedType: 'visitor',
      relatedId: newVisitorId,
      link: '/visitors'
    };

    setData((prev) => ({
      ...prev,
      visitors: [newVisitor, ...prev.visitors],
      notifications: [newNotif, ...prev.notifications]
    }));

    return newVisitor;
  }, []);

  // -------------------------------------------------------------
  // MODULE D: HOME SERVICES
  // -------------------------------------------------------------
  const addServiceRequest = useCallback((reqData, user) => {
    const ticketId = generateTicketId();
    const now = new Date().toISOString();

    const newTicket = {
      id: ticketId,
      category: reqData.category,
      title: reqData.title,
      description: reqData.description,
      urgency: reqData.urgency || 'Normal',
      status: 'Pending',
      preferredDate: reqData.preferredDate,
      preferredTimeSlot: reqData.preferredTimeSlot,
      confirmedDate: null,
      confirmedTimeSlot: null,
      technician: null,
      createdAt: now,
      createdBy: user?.name || 'Resident',
      photos: reqData.photos || [],
      history: [
        {
          status: 'Pending',
          timestamp: now,
          note: `Request raised by ${user?.name || 'Resident'}`
        }
      ]
    };

    const newNotif = {
      id: generateId('NOTIF'),
      title: `Service Request Logged: ${ticketId}`,
      message: `${reqData.category} request "${reqData.title}" submitted. Estate team will review shortly.`,
      category: 'Services',
      timestamp: now,
      isRead: false,
      priority: reqData.urgency === 'Urgent' ? 'High' : 'Normal',
      relatedType: 'service',
      relatedId: ticketId,
      link: '/services'
    };

    const newLog = {
      id: generateId('LOG'),
      actorName: user?.name || 'Resident',
      actorRole: user?.role || 'MEMBER',
      action: `Raised service ticket ${ticketId} (${reqData.category})`,
      timestamp: now,
      icon: 'wrench'
    };

    setData((prev) => ({
      ...prev,
      serviceRequests: [newTicket, ...prev.serviceRequests],
      notifications: [newNotif, ...prev.notifications],
      activityLogs: [newLog, ...prev.activityLogs]
    }));

    return ticketId;
  }, []);

  // Advance service lifecycle for demo testing
  const advanceServiceStatus = useCallback((ticketId) => {
    const lifecycle = ['Pending', 'Approved', 'Scheduled', 'In Progress', 'Completed'];

    setData((prev) => {
      const ticket = prev.serviceRequests.find((t) => t.id === ticketId);
      if (!ticket) return prev;

      const currentIndex = lifecycle.indexOf(ticket.status);
      if (currentIndex === -1 || currentIndex >= lifecycle.length - 1) return prev;

      const nextStatus = lifecycle[currentIndex + 1];
      const now = new Date().toISOString();

      let technicianUpdate = ticket.technician;
      let confirmedDate = ticket.confirmedDate;
      let confirmedTimeSlot = ticket.confirmedTimeSlot;

      if (nextStatus === 'Scheduled' && !technicianUpdate) {
        technicianUpdate = {
          name: 'Suresh Patil',
          phone: '+91 98450 77112',
          agency: 'Bee Hive Resident Services',
          rating: 4.8
        };
        confirmedDate = ticket.preferredDate || new Date().toISOString().split('T')[0];
        confirmedTimeSlot = '11:00 AM - 12:30 PM';
      }

      const updatedTicket = {
        ...ticket,
        status: nextStatus,
        technician: technicianUpdate,
        confirmedDate,
        confirmedTimeSlot,
        ...(nextStatus === 'Completed' ? { completedAt: now } : {}),
        history: [
          ...ticket.history,
          {
            status: nextStatus,
            timestamp: now,
            note: `Status updated to ${nextStatus} by Facility Administration`
          }
        ]
      };

      const newNotif = {
        id: generateId('NOTIF'),
        title: `Service Update: ${ticket.id}`,
        message: `Your ${ticket.category} ticket is now ${nextStatus}.`,
        category: 'Services',
        timestamp: now,
        isRead: false,
        priority: 'Normal',
        relatedType: 'service',
        relatedId: ticket.id,
        link: '/services'
      };

      return {
        ...prev,
        serviceRequests: prev.serviceRequests.map((t) => (t.id === ticketId ? updatedTicket : t)),
        notifications: [newNotif, ...prev.notifications]
      };
    });
  }, []);

  const cancelServiceRequest = useCallback((ticketId, user) => {
    const now = new Date().toISOString();
    setData((prev) => {
      const ticket = prev.serviceRequests.find((t) => t.id === ticketId);
      if (!ticket) return prev;

      const updated = {
        ...ticket,
        status: 'Cancelled',
        cancelledAt: now,
        history: [
          ...ticket.history,
          {
            status: 'Cancelled',
            timestamp: now,
            note: `Cancelled by resident ${user?.name || ''}`
          }
        ]
      };

      const newLog = {
        id: generateId('LOG'),
        actorName: user?.name || 'Resident',
        actorRole: user?.role || 'MEMBER',
        action: `Cancelled service request ${ticketId}`,
        timestamp: now,
        icon: 'x-circle'
      };

      return {
        ...prev,
        serviceRequests: prev.serviceRequests.map((t) => (t.id === ticketId ? updated : t)),
        activityLogs: [newLog, ...prev.activityLogs]
      };
    });
  }, []);

  // -------------------------------------------------------------
  // MODULE E: PRE-APPROVED VISITORS
  // -------------------------------------------------------------
  const createPreApprovedPass = useCallback((passData, user) => {
    const passId = generateId('BEE-PASS');
    const otp = generateOtp();
    const now = new Date().toISOString();

    const newPass = {
      id: passId,
      guestName: passData.guestName,
      guestPhone: passData.guestPhone,
      category: passData.category || 'Guest / Family',
      purpose: passData.purpose || 'Visit',
      expectedDate: passData.expectedDate,
      expectedTime: passData.expectedTime,
      validUntil: passData.validUntil || new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      validityLabel: `Valid for visit on ${passData.expectedDate}`,
      vehicleNumber: passData.vehicleNumber || 'None (Cab/Walk-in)',
      otp,
      qrPayload: `${passId}|FLAT1204|${otp}|${passData.guestName.toUpperCase().replace(/\s+/g, '_')}`,
      instructions: passData.instructions || 'Gate entry with OTP or QR scan.',
      status: 'Active',
      createdBy: user?.name || 'Resident',
      createdAt: now
    };

    const newLog = {
      id: generateId('LOG'),
      actorName: user?.name || 'Resident',
      actorRole: user?.role || 'MEMBER',
      action: `Created digital guest pass ${passId} for ${passData.guestName}`,
      timestamp: now,
      icon: 'ticket'
    };

    setData((prev) => ({
      ...prev,
      preApprovedPasses: [newPass, ...prev.preApprovedPasses],
      activityLogs: [newLog, ...prev.activityLogs]
    }));

    return newPass;
  }, []);

  const cancelPass = useCallback((passId, user) => {
    setData((prev) => ({
      ...prev,
      preApprovedPasses: prev.preApprovedPasses.map((p) =>
        p.id === passId ? { ...p, status: 'Cancelled' } : p
      ),
      activityLogs: [
        {
          id: generateId('LOG'),
          actorName: user?.name || 'Resident',
          actorRole: user?.role || 'MEMBER',
          action: `Cancelled guest pass ${passId}`,
          timestamp: new Date().toISOString(),
          icon: 'x-circle'
        },
        ...prev.activityLogs
      ]
    }));
  }, []);

  const markPassUsed = useCallback((passId) => {
    setData((prev) => ({
      ...prev,
      preApprovedPasses: prev.preApprovedPasses.map((p) =>
        p.id === passId ? { ...p, status: 'Used', usedAt: new Date().toISOString() } : p
      )
    }));
  }, []);

  // -------------------------------------------------------------
  // MODULE F: MY VEHICLES & DUPLICATE VALIDATION
  // -------------------------------------------------------------
  const addVehicle = useCallback((vehicleData, user) => {
    const normalizedPlate = (vehicleData.registrationNumber || '').replace(/\s+/g, '').toUpperCase();
    
    // Check duplicate in household
    const exists = data.vehicles.some(
      (v) => v.registrationNumber.replace(/\s+/g, '').toUpperCase() === normalizedPlate
    );

    if (exists) {
      return { success: false, error: `Vehicle plate "${vehicleData.registrationNumber}" is already registered in this household.` };
    }

    const newVehicle = {
      id: generateId('VEH'),
      type: vehicleData.type || 'Car',
      registrationNumber: vehicleData.registrationNumber.toUpperCase(),
      makeModel: vehicleData.makeModel,
      color: vehicleData.color,
      ownerId: vehicleData.ownerId || user?.id,
      ownerName: vehicleData.ownerName || user?.name,
      parkingSlot: vehicleData.parkingSlot || 'Unassigned',
      rfidTag: generateId('BEE-RFID'),
      status: 'Active',
      verifiedAt: new Date().toISOString().split('T')[0],
      photo: vehicleData.photo || ''
    };

    const newLog = {
      id: generateId('LOG'),
      actorName: user?.name || 'Resident',
      actorRole: user?.role || 'MEMBER',
      action: `Registered vehicle ${newVehicle.registrationNumber} (${newVehicle.makeModel})`,
      timestamp: new Date().toISOString(),
      icon: 'car'
    };

    setData((prev) => ({
      ...prev,
      vehicles: [newVehicle, ...prev.vehicles],
      activityLogs: [newLog, ...prev.activityLogs]
    }));

    return { success: true, vehicle: newVehicle };
  }, [data.vehicles]);

  const updateVehicle = useCallback((vehicleId, updates) => {
    setData((prev) => ({
      ...prev,
      vehicles: prev.vehicles.map((v) => (v.id === vehicleId ? { ...v, ...updates } : v))
    }));
    return { success: true };
  }, []);

  const deleteVehicle = useCallback((vehicleId, user) => {
    setData((prev) => {
      const target = prev.vehicles.find((v) => v.id === vehicleId);
      const newLog = target ? {
        id: generateId('LOG'),
        actorName: user?.name || 'Resident',
        actorRole: user?.role || 'MEMBER',
        action: `Removed vehicle ${target.registrationNumber} from household`,
        timestamp: new Date().toISOString(),
        icon: 'trash'
      } : null;

      return {
        ...prev,
        vehicles: prev.vehicles.filter((v) => v.id !== vehicleId),
        activityLogs: newLog ? [newLog, ...prev.activityLogs] : prev.activityLogs
      };
    });
    return { success: true };
  }, []);

  // -------------------------------------------------------------
  // MODULE H: FAMILY MEMBERS & DUPLICATE PHONE VALIDATION
  // -------------------------------------------------------------
  const addFamilyMember = useCallback((memberData, user) => {
    const cleanedPhone = ('' + memberData.phone).replace(/\D/g, '').slice(-10);

    const exists = data.members.some(
      (m) => ('' + m.phone).replace(/\D/g, '').slice(-10) === cleanedPhone
    );

    if (exists) {
      return { success: false, error: 'A member with this phone number already exists in your household.' };
    }

    const newMember = {
      id: generateId('USR'),
      name: memberData.name,
      phone: cleanedPhone,
      fullPhone: `+91 ${cleanedPhone.slice(0, 5)} ${cleanedPhone.slice(5)}`,
      email: memberData.email || '',
      role: memberData.role || 'MEMBER',
      relationship: memberData.relationship || 'Family Member',
      avatar: memberData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(memberData.name)}`,
      isHead: false,
      moveInDate: new Date().toISOString().split('T')[0]
    };

    const newLog = {
      id: generateId('LOG'),
      actorName: user?.name || 'Resident',
      actorRole: user?.role || 'HEAD',
      action: `Added ${newMember.name} (${newMember.relationship}) to Flat 1204`,
      timestamp: new Date().toISOString(),
      icon: 'user-plus'
    };

    setData((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
      activityLogs: [newLog, ...prev.activityLogs]
    }));

    return { success: true, member: newMember };
  }, [data.members]);

  const updateFamilyMember = useCallback((memberId, updates) => {
    setData((prev) => ({
      ...prev,
      members: prev.members.map((m) => (m.id === memberId ? { ...m, ...updates } : m))
    }));
    return { success: true };
  }, []);

  const removeFamilyMember = useCallback((memberId, user) => {
    const target = data.members.find((m) => m.id === memberId);
    if (!target) return { success: false, error: 'Member not found.' };

    if (target.isHead) {
      return { success: false, error: 'Household Head cannot be removed from the household.' };
    }

    setData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
      activityLogs: [
        {
          id: generateId('LOG'),
          actorName: user?.name || 'Resident',
          actorRole: user?.role || 'HEAD',
          action: `Removed ${target.name} from household members`,
          timestamp: new Date().toISOString(),
          icon: 'user-minus'
        },
        ...prev.activityLogs
      ]
    }));

    return { success: true };
  }, [data.members]);

  // -------------------------------------------------------------
  // MODULE G: NOTIFICATIONS
  // -------------------------------------------------------------
  const markNotificationRead = useCallback((notifId) => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === notifId ? { ...n, isRead: true } : n
      )
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, isRead: true }))
    }));
  }, []);

  const deleteNotification = useCallback((notifId) => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.filter((n) => n.id !== notifId)
    }));
  }, []);

  // Summary counts
  const pendingVisitorsCount = data.visitors.filter((v) => v.status === 'Pending').length;
  const activeServicesCount = data.serviceRequests.filter((s) => !['Completed', 'Cancelled'].includes(s.status)).length;
  const activePassesCount = data.preApprovedPasses.filter((p) => p.status === 'Active').length;
  const vehiclesCount = data.vehicles.length;
  const unreadNotificationsCount = data.notifications.filter((n) => !n.isRead).length;

  return (
    <HouseholdContext.Provider
      value={{
        household: data.household,
        members: data.members,
        visitors: data.visitors,
        serviceRequests: data.serviceRequests,
        preApprovedPasses: data.preApprovedPasses,
        vehicles: data.vehicles,
        notifications: data.notifications,
        announcements: data.announcements,
        activityLogs: data.activityLogs,
        pendingVisitorsCount,
        activeServicesCount,
        activePassesCount,
        vehiclesCount,
        unreadNotificationsCount,
        decideVisitor,
        simulateIncomingVisitor,
        addServiceRequest,
        advanceServiceStatus,
        cancelServiceRequest,
        createPreApprovedPass,
        cancelPass,
        markPassUsed,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addFamilyMember,
        updateFamilyMember,
        removeFamilyMember,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        resetAllData,
        logActivity,
        addNotification
      }}
    >
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold() {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error('useHousehold must be used within a HouseholdProvider');
  }
  return context;
}
