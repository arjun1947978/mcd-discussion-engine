// Common avatar constants with reliable high-res fallbacks
const AVATAR_NEHA = 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80';
const AVATAR_VIKRAM = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80';
const AVATAR_ANANYA = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80';
const AVATAR_AMIT = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80';
const AVATAR_POOJA = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';
const AVATAR_HARPREET = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80';
const AVATAR_KAILASH = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80';
const AVATAR_KABIR = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80';

export const ROOM_MEMBERS_DATA = {
  // 1. Tools & Machinery
  'dept-tools': [
    {
      id: 'u-tool-1',
      name: 'Vikram Sharma',
      role: 'Tooling Head & Lead Engineer',
      avatar: AVATAR_VIKRAM,
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 'u-tool-2',
      name: 'Ramesh Patel',
      role: 'CNC Spindle Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 'u-tool-3',
      name: 'Manoj Kumar',
      role: 'Hydraulic Maintenance',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
      status: 'offline',
      lastSeen: '12m ago'
    },
    {
      id: 'u-tool-4',
      name: 'Karan Dave',
      role: 'Cutter Insert Technician',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
      status: 'offline',
      lastSeen: '45m ago'
    }
  ],

  // 2. R&D (Research & Dev)
  'dept-rnd': [
    {
      id: 'u-rnd-1',
      name: 'Dr. Ananya Roy',
      role: 'Chief Scientist & Lab Head',
      avatar: AVATAR_ANANYA,
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 'u-rnd-2',
      name: 'Dr. Kabir Sen',
      role: 'Polymer Formulation Chemist',
      avatar: AVATAR_KABIR,
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 'u-rnd-3',
      name: 'Anand Joshi',
      role: 'Materials Testing Specialist',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
      status: 'offline',
      lastSeen: '18m ago'
    }
  ],

  // 3. Accounts & Finance (Neha Sharma is primary here)
  'dept-accounts': [
    {
      id: 'u-acc-1',
      name: 'Rajesh Agarwal',
      role: 'Chief Financial Officer (CFO)',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 'u-acc-2',
      name: 'Neha Sharma',
      role: 'Taxation & GST Billing Officer',
      avatar: AVATAR_NEHA,
      status: 'online',
      lastSeen: 'Active now'
    }
  ],

  // 4. Administration & HR (Neha Sharma is cross-department member #2)
  'dept-admin': [
    {
      id: 'u-adm-1',
      name: 'Sunita Mehra',
      role: 'Head of Administration & HR',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 'u-adm-2',
      name: 'Neha Sharma',
      role: 'Statutory Payroll & Compliance Associate',
      avatar: AVATAR_NEHA,
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 'u-adm-3',
      name: 'Sanjay Rawat',
      role: 'Plant Facility Manager',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      status: 'offline',
      lastSeen: '1h ago'
    }
  ],

  // 5. Sales & Marketing (Neha Sharma is cross-department member #3)
  'dept-sales': [
    {
      id: 'u-sal-1',
      name: 'Amit Khanna',
      role: 'VP Sales & Client Accounts',
      avatar: AVATAR_AMIT,
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 'u-sal-2',
      name: 'Pooja Varma',
      role: 'Key Accounts Lead',
      avatar: AVATAR_POOJA,
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 'u-sal-3',
      name: 'Neha Sharma',
      role: 'Commercial Invoicing & Client Billing Controller',
      avatar: AVATAR_NEHA,
      status: 'online',
      lastSeen: 'Active now'
    }
  ],

  // 6. Plant Operations
  'dept-operations': [
    {
      id: 'u-ops-1',
      name: 'Harpreet Singh',
      role: 'Operations & Plant General Manager',
      avatar: AVATAR_HARPREET,
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 'u-ops-2',
      name: 'Gaurav Tiwari',
      role: 'Quality Dispatch Lead',
      avatar: AVATAR_KAILASH,
      status: 'offline',
      lastSeen: '25m ago'
    }
  ],

  // 7. Quality Assurance (Neha Sharma is cross-department member #4)
  'dept-qa': [
    {
      id: 'u-qa-1',
      name: 'Kailash Mehta',
      role: 'Head of Quality Assurance & CMM',
      avatar: AVATAR_KAILASH,
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 'u-qa-2',
      name: 'Neha Sharma',
      role: 'Quality Compliance Billing Auditor',
      avatar: AVATAR_NEHA,
      status: 'online',
      lastSeen: 'Active now'
    }
  ],

  // 8. Supply Chain & Logistics
  'dept-scm': [
    {
      id: 'u-scm-1',
      name: 'Tariq Anwar',
      role: 'Logistics & Fleet Director',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      status: 'online',
      lastSeen: 'Active now'
    }
  ],

  // 9. Procurement & Sourcing (Neha Sharma is cross-department member #5)
  'dept-procurement': [
    {
      id: 'u-proc-1',
      name: 'Suresh Singhania',
      role: 'Chief Procurement Officer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 'u-proc-2',
      name: 'Neha Sharma',
      role: 'Vendor GST & Audit Incharge',
      avatar: AVATAR_NEHA,
      status: 'online',
      lastSeen: 'Active now'
    }
  ],

  // 10. Electrical & Automation
  'dept-maintenance': [
    {
      id: 'u-maint-1',
      name: 'Arun Bhatia',
      role: 'Electrical & Automation Head',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
      status: 'online',
      lastSeen: 'Active now'
    }
  ],

  // 11. Health, Safety & Environment (EHS)
  'dept-ehs': [
    {
      id: 'u-ehs-1',
      name: 'Deepak Joshi',
      role: 'EHS & Industrial Safety Officer',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
      status: 'online',
      lastSeen: 'Active now'
    }
  ],

  // 12. Product Design & CAD/CAM
  'dept-design': [
    {
      id: 'u-cad-1',
      name: 'Nikhil Rane',
      role: 'Chief Design Architect',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
      status: 'online',
      lastSeen: 'Active now'
    }
  ],

  // 13. Warehouse & Inventory (Neha Sharma is cross-department member #6)
  'dept-warehouse': [
    {
      id: 'u-wh-1',
      name: 'Gopal Verma',
      role: 'Central Warehouse Head',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 'u-wh-2',
      name: 'Neha Sharma',
      role: 'Stock Valuation & E-Way Bill Controller',
      avatar: AVATAR_NEHA,
      status: 'online',
      lastSeen: 'Active now'
    }
  ],

  // 14. Packaging Engineering
  'dept-packaging': [
    {
      id: 'u-pack-1',
      name: 'Meena Kulkarni',
      role: 'Packaging Standards Lead',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
      status: 'online',
      lastSeen: 'Active now'
    }
  ],

  // 15. Enterprise IT & ERP (Neha Sharma is cross-department member #7)
  'dept-it': [
    {
      id: 'u-it-1',
      name: 'Kunal Deshmukh',
      role: 'IT Infrastructure & Security Lead',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 'u-it-2',
      name: 'Neha Sharma',
      role: 'SAP ERP Financials Key User',
      avatar: AVATAR_NEHA,
      status: 'online',
      lastSeen: 'Active now'
    }
  ],

  // 16. Legal & Regulatory (Neha Sharma is cross-department member #8)
  'dept-legal': [
    {
      id: 'u-leg-1',
      name: 'Adv. Preeti Nambiar',
      role: 'General Legal Counsel',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80',
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 'u-leg-2',
      name: 'Neha Sharma',
      role: 'Taxation Regulatory & Compliance Liaison',
      avatar: AVATAR_NEHA,
      status: 'online',
      lastSeen: 'Active now'
    }
  ],

  // 17. Plant Security
  'dept-security': [
    {
      id: 'u-sec-1',
      name: 'Subedar R.S. Rathore',
      role: 'Security Commander',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      status: 'online',
      lastSeen: 'Active now'
    }
  ],

  // 18. Client Care & RMA
  'dept-customercare': [
    {
      id: 'u-care-1',
      name: 'Shweta Rao',
      role: 'Client Experience Manager',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      status: 'online',
      lastSeen: 'Active now'
    }
  ],

  // 19. Export & International Trade (Neha Sharma is cross-department member #9)
  'dept-export': [
    {
      id: 'u-exp-1',
      name: 'Farhan Merchant',
      role: 'Export Director',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 'u-exp-2',
      name: 'Neha Sharma',
      role: 'Customs Duty Drawback & GST Refund Specialist',
      avatar: AVATAR_NEHA,
      status: 'online',
      lastSeen: 'Active now'
    }
  ],

  // 20. Production Planning (PPIC) (Neha Sharma is cross-department member #10)
  'dept-ppic': [
    {
      id: 'u-ppic-1',
      name: 'Vinod Nair',
      role: 'PPIC Operations Lead',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 'u-ppic-2',
      name: 'Neha Sharma',
      role: 'Production Budget & Cost Accounting Auditor',
      avatar: AVATAR_NEHA,
      status: 'online',
      lastSeen: 'Active now'
    }
  ],

  // 21. Molds & Tooling Die Shop
  'dept-moldshop': [
    {
      id: 'u-mold-1',
      name: 'Govind Swamy',
      role: 'Master Toolmaker',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      status: 'online',
      lastSeen: 'Active now'
    }
  ],

  // 22. ESG Sustainability
  'dept-sustainability': [
    {
      id: 'u-esg-1',
      name: 'Dr. Pallavi Gore',
      role: 'ESG & Clean Energy Lead',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
      status: 'online',
      lastSeen: 'Active now'
    }
  ]
};

// Map of department IDs to clean department titles
export const DEPARTMENT_NAME_MAP = {
  'dept-tools': 'Tools & Machinery',
  'dept-rnd': 'R&D (Research & Dev)',
  'dept-accounts': 'Accounts & Finance',
  'dept-admin': 'Administration & HR',
  'dept-sales': 'Sales & Marketing',
  'dept-operations': 'Plant Operations',
  'dept-qa': 'Quality Assurance (QA/QC)',
  'dept-scm': 'Supply Chain & Logistics',
  'dept-procurement': 'Procurement & Sourcing',
  'dept-maintenance': 'Electrical & Automation',
  'dept-ehs': 'Health, Safety & Environment',
  'dept-design': 'Product Design & CAD/CAM',
  'dept-warehouse': 'Warehouse & Inventory',
  'dept-packaging': 'Packaging Engineering',
  'dept-it': 'Enterprise IT & ERP',
  'dept-legal': 'Legal & Regulatory',
  'dept-security': 'Plant Security',
  'dept-customercare': 'Client Support & RMA',
  'dept-export': 'Export & International Trade',
  'dept-ppic': 'Production Planning (PPIC)',
  'dept-moldshop': 'Molds & Tooling Die Shop',
  'dept-sustainability': 'ESG & Energy Sustainability'
};

// Helper: Finds all department affiliations for a specific member
export const getMemberDepartmentAffiliations = (memberName) => {
  const result = [];
  const nameNorm = (memberName || '').trim().toLowerCase();

  Object.entries(ROOM_MEMBERS_DATA).forEach(([deptKey, members]) => {
    const match = members.find((m) => m.name.toLowerCase() === nameNorm);
    if (match) {
      result.push({
        deptKey,
        departmentName: DEPARTMENT_NAME_MAP[deptKey] || deptKey,
        role: match.role
      });
    }
  });

  return result;
};

// Helper to get all organization members across all departments
export const getAllOrganizationMembers = () => {
  const seen = new Set();
  const all = [];

  Object.entries(ROOM_MEMBERS_DATA).forEach(([deptKey, members]) => {
    const deptName = DEPARTMENT_NAME_MAP[deptKey] || 'Enterprise';
    members.forEach((m) => {
      if (!seen.has(m.name)) {
        seen.add(m.name);
        all.push({
          ...m,
          department: deptName,
          deptKey
        });
      }
    });
  });

  return all;
};

// Helper to get members for any room (Department, Query, or All)
export const getMembersForRoom = (roomId, roomContext) => {
  if (!roomId || roomId === 'all') {
    return getAllOrganizationMembers();
  }

  if (ROOM_MEMBERS_DATA[roomId]) {
    return ROOM_MEMBERS_DATA[roomId];
  }

  // If query room, dynamically compose assigned participants
  const raisedBy = roomContext?.data?.raisedBy || 'Officer';
  const deptName = roomContext?.data?.department || 'Engineering';

  return [
    {
      id: 'qm-1',
      name: raisedBy,
      role: 'Query Initiator',
      avatar: AVATAR_POOJA,
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 'qm-2',
      name: 'Vikram Sharma',
      role: 'Tooling & Plant Support',
      avatar: AVATAR_VIKRAM,
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 'qm-3',
      name: 'Neha Sharma',
      role: 'Commercial & GST Incharge',
      avatar: AVATAR_NEHA,
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 'qm-4',
      name: 'Kailash Mehta',
      role: 'QA / QC Lead Inspector',
      avatar: AVATAR_KAILASH,
      status: 'offline',
      lastSeen: '14m ago'
    }
  ];
};
