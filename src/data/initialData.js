/**
 * Initial Seed Data for BEE Residence
 * Represents Flat 1204, Tower A, Bee Hive Residency
 */

export const INITIAL_HOUSEHOLD = {
  id: 'HH-BLR-1204',
  apartmentName: 'Bee Hive Residency',
  tower: 'Tower A',
  flatNumber: '1204',
  floor: 12,
  block: 'Wing 1',
  intercom: '1204',
  ownerName: 'Rajesh Kumar',
  headId: 'USR-001',
  societyAddress: 'Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103',
  parkingSlots: ['B2-P45', 'B2-P46 (EV)']
};

export const INITIAL_USERS = [
  {
    id: 'USR-001',
    name: 'Rajesh Kumar',
    phone: '9876543210',
    fullPhone: '+91 98765 43210',
    email: 'rajesh.kumar@example.com',
    role: 'HEAD', // Household Head
    relationship: 'Self',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    isHead: true,
    moveInDate: '2023-04-15'
  },
  {
    id: 'USR-002',
    name: 'Priya Kumar',
    phone: '9876543211',
    fullPhone: '+91 98765 43211',
    email: 'priya.kumar@example.com',
    role: 'MEMBER', // Household Member
    relationship: 'Spouse',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    isHead: false,
    moveInDate: '2023-04-15'
  },
  {
    id: 'USR-003',
    name: 'Sunita Kumar',
    phone: '9876543212',
    fullPhone: '+91 98765 43212',
    email: 'sunita.k@example.com',
    role: 'MEMBER',
    relationship: 'Mother',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=250',
    isHead: false,
    moveInDate: '2023-06-01'
  },
  {
    id: 'USR-004',
    name: 'Rohan Kumar',
    phone: '9876543213',
    fullPhone: '+91 98765 43213',
    email: 'rohan.k@example.com',
    role: 'MEMBER',
    relationship: 'Son',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
    isHead: false,
    moveInDate: '2023-04-15'
  }
];

export const INITIAL_VISITORS = [
  {
    id: 'VIS-901',
    name: 'Amazon Delivery (Delivery Agent)',
    visitorType: 'Courier',
    category: 'Courier',
    company: 'Amazon India',
    phone: '+91 91234 56789',
    vehicleNumber: 'KA 03 HK 2819',
    purpose: 'Package delivery for Flat 1204',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250',
    status: 'Pending', // Pending, Approved, Rejected, Completed
    arrivedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(), // 8 minutes ago
    gateNumber: 'Main Gate (Gate 1)',
    guardName: 'Ramesh Singh (Guard ID #42)',
    decisionBy: null,
    decidedAt: null,
    decisionNote: null,
    itemsToLeave: '2 Parcels'
  },
  {
    id: 'VIS-902',
    name: 'Swiggy Food Delivery',
    visitorType: 'Food Delivery',
    category: 'Food Delivery',
    company: 'Swiggy',
    phone: '+91 98112 34567',
    vehicleNumber: 'KA 05 ER 9012',
    purpose: 'Lunch order delivery',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    status: 'Pending',
    arrivedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 minutes ago
    gateNumber: 'Tower A Entrance',
    guardName: 'Sunil Nair (Guard ID #18)',
    decisionBy: null,
    decidedAt: null,
    decisionNote: null,
    itemsToLeave: 'Food container bag'
  },
  {
    id: 'VIS-903',
    name: 'Amit Sharma & Family',
    visitorType: 'Friends',
    category: 'Friends',
    company: '',
    phone: '+91 97654 32109',
    vehicleNumber: 'KA 51 MB 1024',
    purpose: 'Weekend tea and social visit',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    status: 'Approved',
    arrivedAt: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    gateNumber: 'Main Gate (Gate 1)',
    guardName: 'Ramesh Singh (Guard ID #42)',
    decisionBy: 'Rajesh Kumar',
    decidedAt: new Date(Date.now() - 1000 * 60 * 64).toISOString(),
    decisionNote: 'Authorized for Flat 1204 entry'
  },
  {
    id: 'VIS-904',
    name: 'Urban Company Electrician',
    visitorType: 'Service Technician',
    category: 'Service Technician',
    company: 'Urban Company',
    phone: '+91 99001 12233',
    vehicleNumber: 'KA 01 AB 7788',
    purpose: 'Balcony light wiring inspection',
    photo: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=250',
    status: 'Completed',
    arrivedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    gateNumber: 'Service Gate (Gate 3)',
    guardName: 'Gopal Verma (Guard ID #09)',
    decisionBy: 'Priya Kumar',
    decidedAt: new Date(Date.now() - 1000 * 60 * 179).toISOString(),
    decisionNote: 'Allowed with tool bag'
  },
  {
    id: 'VIS-905',
    name: 'Unverified Sales Rep',
    visitorType: 'Other',
    category: 'Other',
    company: 'Direct Marketing',
    phone: '+91 98888 77777',
    vehicleNumber: 'None (Walk-in)',
    purpose: 'Credit card promotions',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    status: 'Rejected',
    arrivedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    gateNumber: 'Main Gate (Gate 1)',
    guardName: 'Ramesh Singh (Guard ID #42)',
    decisionBy: 'Rajesh Kumar',
    decidedAt: new Date(Date.now() - 1000 * 60 * 358).toISOString(),
    decisionNote: 'Resident denied unsolicited sales entry'
  }
];

export const INITIAL_SERVICE_REQUESTS = [
  {
    id: 'TKT-2026-819',
    category: 'Plumbing',
    title: 'Kitchen sink pipe dripping water',
    description: 'The drainage pipe beneath the kitchen sink has a slow leak at the U-joint. Water accumulates on the cabinet floor.',
    urgency: 'High', // Urgent, High, Normal, Can Wait
    status: 'Scheduled', // Pending, Approved, Scheduled, In Progress, Completed, Cancelled
    preferredDate: '2026-10-24',
    preferredTimeSlot: 'Morning (09:00 AM - 12:00 PM)',
    confirmedDate: '2026-10-24',
    confirmedTimeSlot: '10:30 AM',
    technician: {
      name: 'Mohammad Farooq',
      phone: '+91 98450 12345',
      agency: 'Society Maintenance Facility',
      rating: 4.8
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    createdBy: 'Priya Kumar',
    photos: [],
    history: [
      { status: 'Pending', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), note: 'Request submitted by Priya Kumar' },
      { status: 'Approved', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), note: 'Approved by Facility Manager Arvind Rao' },
      { status: 'Scheduled', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), note: 'Technician Mohammad Farooq assigned for 24 Oct, 10:30 AM' }
    ]
  },
  {
    id: 'TKT-2026-745',
    category: 'Air Conditioning',
    title: 'Master Bedroom AC cooling low & filter cleaning',
    description: 'Daikin 1.5 ton split AC in master bedroom not cooling effectively. Might need gas pressure check and general seasonal servicing.',
    urgency: 'Normal',
    status: 'Pending',
    preferredDate: '2026-10-26',
    preferredTimeSlot: 'Afternoon (12:00 PM - 03:00 PM)',
    confirmedDate: null,
    confirmedTimeSlot: null,
    technician: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    createdBy: 'Rajesh Kumar',
    photos: [],
    history: [
      { status: 'Pending', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), note: 'Request logged by Rajesh Kumar' }
    ]
  },
  {
    id: 'TKT-2026-612',
    category: 'Electrical Repairs',
    title: 'Living room chandelier switch sparking',
    description: 'Switch box on North living room wall makes buzzing/sparking noise when turned on. Repaired immediately for safety.',
    urgency: 'Urgent',
    status: 'Completed',
    preferredDate: '2026-10-20',
    preferredTimeSlot: 'Morning (09:00 AM - 12:00 PM)',
    confirmedDate: '2026-10-20',
    confirmedTimeSlot: '11:00 AM',
    technician: {
      name: 'Ravi Teja',
      phone: '+91 98800 55443',
      agency: 'Bee Hive Resident Services',
      rating: 4.9
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    createdBy: 'Rajesh Kumar',
    photos: [],
    history: [
      { status: 'Pending', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), note: 'Request logged' },
      { status: 'Approved', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 94).toISOString(), note: 'Prioritized as urgent electrical' },
      { status: 'Scheduled', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 90).toISOString(), note: 'Ravi Teja assigned' },
      { status: 'In Progress', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 74).toISOString(), note: 'Technician on premise' },
      { status: 'Completed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), note: 'Replaced rocker switch and tightened MCB terminal' }
    ]
  }
];

export const INITIAL_PRE_APPROVED_PASSES = [
  {
    id: 'BEE-PASS-84920',
    guestName: 'Vikram & Ananya Malhotra',
    guestPhone: '+91 99112 23344',
    category: 'Guest / Family',
    purpose: 'Sunday dinner gathering at Flat 1204',
    expectedDate: '2026-10-25',
    expectedTime: '07:30 PM',
    validUntil: '2026-10-25T23:59:00.000Z',
    validityLabel: 'Valid for 6 hours on 25 Oct 2026',
    vehicleNumber: 'KA 04 MM 5566',
    otp: '482910',
    qrPayload: 'BEE-PASS-84920|FLAT1204|482910|MALHOTRA',
    instructions: 'Please park in visitor slot V-12 near Clubhouse.',
    status: 'Active', // Active, Used, Expired, Cancelled
    createdBy: 'Rajesh Kumar',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    id: 'BEE-PASS-73201',
    guestName: 'Deepak Verma (Interior Stylist)',
    guestPhone: '+91 98223 34455',
    category: 'Contractor',
    purpose: 'Measurements for study room bookshelf',
    expectedDate: '2026-10-24',
    expectedTime: '03:00 PM',
    validUntil: '2026-10-24T18:00:00.000Z',
    validityLabel: 'Valid 3:00 PM - 6:00 PM on 24 Oct 2026',
    vehicleNumber: 'KA 03 JL 1122',
    otp: '719304',
    qrPayload: 'BEE-PASS-73201|FLAT1204|719304|VERMA',
    instructions: 'Service entry allowed with tape & catalog.',
    status: 'Active',
    createdBy: 'Priya Kumar',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString()
  },
  {
    id: 'BEE-PASS-61049',
    guestName: 'Kavita Menon (Doctor visit)',
    guestPhone: '+91 97334 45566',
    category: 'Guest / Family',
    purpose: 'Home wellness checkup for mother',
    expectedDate: '2026-10-22',
    expectedTime: '11:00 AM',
    validUntil: '2026-10-22T14:00:00.000Z',
    validityLabel: 'Used at Gate 1 on 22 Oct 2026',
    vehicleNumber: 'KA 01 EK 9900',
    otp: '839214',
    qrPayload: 'BEE-PASS-61049|FLAT1204|839214|MENON',
    instructions: 'Direct elevator access to 12th floor.',
    status: 'Used',
    usedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    createdBy: 'Rajesh Kumar',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  }
];

export const INITIAL_VEHICLES = [
  {
    id: 'VEH-001',
    type: 'Car', // Car, Two-Wheeler, Electric Vehicle, Other
    registrationNumber: 'KA 01 MJ 4521',
    makeModel: 'Tata Nexon EV Max',
    color: 'Intense Teal',
    ownerId: 'USR-001',
    ownerName: 'Rajesh Kumar',
    parkingSlot: 'B2-P46 (EV)',
    rfidTag: 'BEE-RFID-9941',
    status: 'Active',
    verifiedAt: '2023-04-20',
    photo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'VEH-002',
    type: 'Two-Wheeler',
    registrationNumber: 'KA 03 EK 8812',
    makeModel: 'Ather 450X Gen 3',
    color: 'Space Grey',
    ownerId: 'USR-002',
    ownerName: 'Priya Kumar',
    parkingSlot: 'B2-P45',
    rfidTag: 'BEE-RFID-8120',
    status: 'Active',
    verifiedAt: '2023-05-10',
    photo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'VEH-003',
    type: 'Car',
    registrationNumber: 'KA 51 Z 1904',
    makeModel: 'Hyundai i20 Asta',
    color: 'Polar White',
    ownerId: 'USR-001',
    ownerName: 'Rajesh Kumar',
    parkingSlot: 'B2-P45',
    rfidTag: 'BEE-RFID-6321',
    status: 'Active',
    verifiedAt: '2023-04-20',
    photo: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=300'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-101',
    title: 'Visitor Request Pending Approval',
    message: 'Amazon Delivery is waiting at Main Gate (Gate 1) with 2 parcels for Flat 1204.',
    category: 'Visitors', // Visitors, Services, Community, System
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    isRead: false,
    priority: 'High',
    relatedType: 'visitor',
    relatedId: 'VIS-901',
    link: '/visitors'
  },
  {
    id: 'NOTIF-102',
    title: 'Visitor Request Pending Approval',
    message: 'Swiggy Food Delivery has arrived at Tower A Entrance for Flat 1204.',
    category: 'Visitors',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    isRead: false,
    priority: 'High',
    relatedType: 'visitor',
    relatedId: 'VIS-902',
    link: '/visitors'
  },
  {
    id: 'NOTIF-103',
    title: 'Service Request Scheduled',
    message: 'Technician Mohammad Farooq has been assigned for Plumbing ticket TKT-2026-819 on 24 Oct at 10:30 AM.',
    category: 'Services',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    isRead: false,
    priority: 'Normal',
    relatedType: 'service',
    relatedId: 'TKT-2026-819',
    link: '/services'
  },
  {
    id: 'NOTIF-104',
    title: 'Water Supply Notice (Tower A & B)',
    message: 'Overhead tank cleaning scheduled tomorrow from 10:00 AM to 02:00 PM. Please store sufficient water.',
    category: 'Community',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    isRead: true,
    priority: 'Normal',
    relatedType: 'announcement',
    relatedId: 'ANN-301',
    link: '/notifications'
  },
  {
    id: 'NOTIF-105',
    title: 'Guest Pass Created',
    message: 'Digital pass BEE-PASS-84920 generated for Vikram & Ananya Malhotra for 25 Oct.',
    category: 'Visitors',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    isRead: true,
    priority: 'Low',
    relatedType: 'pass',
    relatedId: 'BEE-PASS-84920',
    link: '/visitors?tab=pre-approved'
  }
];

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'ANN-301',
    title: 'Water Supply Maintenance & Tank Disinfection',
    date: '2026-10-24',
    badge: 'Facility Notice',
    severity: 'Warning',
    summary: 'Planned water cutoff in Tower A & B between 10:00 AM and 02:00 PM for bi-monthly sanitization.',
    details: 'The Estate Management team will conduct thorough mechanical scrubbing and UV disinfection of the overhead water reservoirs for Towers A and B. Please store domestic water for morning requirements. Sump supply will resume promptly by 2:15 PM.'
  },
  {
    id: 'ANN-302',
    title: 'Diwali Mela & Annual General Meeting (AGM) 2026',
    date: '2026-10-31',
    badge: 'Community Event',
    severity: 'Info',
    summary: 'Join us at the Central Amphitheatre for food stalls, cultural dances, and society financial review.',
    details: 'All residents and owners are cordially invited to celebrate the Festival of Lights together. Stall registration for home bakers and artisans is open at the Clubhouse front desk. The formal AGM will begin at 4:30 PM followed by light displays and music.'
  },
  {
    id: 'ANN-303',
    title: 'EV Charging Bay Expansion in Basement 2',
    date: '2026-11-05',
    badge: 'Infrastructure',
    severity: 'Success',
    summary: '8 new 7.4 kW Level-2 AC chargers installed and activated near Pillar 45-52.',
    details: 'Residents with registered electric 4-wheelers and 2-wheelers can now activate RFID card tap-and-charge at the newly commissioned stations. Sub-metered billing will reflect on your monthly maintenance invoice.'
  }
];

export const INITIAL_ACTIVITY_LOGS = [
  {
    id: 'LOG-001',
    actorName: 'Priya Kumar',
    actorRole: 'MEMBER',
    action: 'Logged service request for Kitchen plumbing leak (TKT-2026-819)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    icon: 'wrench'
  },
  {
    id: 'LOG-002',
    actorName: 'Rajesh Kumar',
    actorRole: 'HEAD',
    action: 'Approved guest entry for Amit Sharma & Family at Gate 1',
    timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    icon: 'user-check'
  },
  {
    id: 'LOG-003',
    actorName: 'Rajesh Kumar',
    actorRole: 'HEAD',
    action: 'Created advance visitor pass BEE-PASS-84920 for Vikram Malhotra',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    icon: 'ticket'
  },
  {
    id: 'LOG-004',
    actorName: 'Priya Kumar',
    actorRole: 'MEMBER',
    action: 'Verified technician Urban Company entry at Service Gate 3',
    timestamp: new Date(Date.now() - 1000 * 60 * 179).toISOString(),
    icon: 'shield-check'
  }
];

export const EMERGENCY_CONTACTS = [
  { title: 'Main Gate Security Intercom', phone: '101 / +91 80 4455 0101', role: '24x7 Security' },
  { title: 'Tower A Lobby Concierge', phone: '102 / +91 80 4455 0102', role: 'Lobby Desk' },
  { title: 'Estate Facility Manager (Arvind Rao)', phone: '+91 99887 76655', role: 'Maintenance & Repairs' },
  { title: 'Bee Hive Society Helpdesk', phone: '+91 80 4455 0000', role: 'Administrative Queries' },
  { title: 'Local Police Station (Bellandur)', phone: '112 / +91 80 2294 2568', role: 'Emergency Services' },
  { title: 'Sakra World Hospital Ambulance', phone: '108 / +91 80 4969 4969', role: 'Medical Emergency' }
];
