/**
 * QCR (Quality Control Report) System Configuration
 * Tailored for plant inspection, defect tracking, and batch clearance discussions.
 */
export const QCR_SYSTEM_CONFIG = {
  systemId: 'QCR_PORTAL',
  systemName: 'Marca Coroma QCR (Quality Control & Inspection)',
  themeAccent: '#ea580c', // Orange for QCR
  hasDepartments: false, // Focuses purely on Defect / Inspection Query Cards
  defaultInspector: {
    name: 'Kailash Mehta',
    role: 'Senior QA / QC Inspector',
    system: 'QCR'
  },
  sampleQCRCards: [
    {
      queryId: 'QCR-Q301',
      batchNo: 'BAT-2026-991',
      inspectionStage: 'Final Stage Inspection (Line 3)',
      defectCode: 'DEF-88: Surface Warpage & Sink Marks',
      severity: 'Critical Reject',
      title: 'Polymer Injection Mold Sink Marks on Bezel Batch #991',
      status: 'In Discussion',
      date: 'Today, 11:45 AM',
      description: 'Sink depth measured 0.45mm on critical cosmetic face. Mold cooling time or packing pressure needs urgent correction from Tooling team.'
    },
    {
      queryId: 'QCR-Q302',
      batchNo: 'BAT-2026-940',
      inspectionStage: 'Incoming Raw Material Testing',
      defectCode: 'DEF-12: Melt Flow Index Out of Spec',
      severity: 'Quarantine',
      title: 'Polycarbonate Resin MFI Variance Detected',
      status: 'Open',
      date: 'Today, 08:30 AM',
      description: 'Supplier Certificate of Analysis states MFI 10.5 g/10min, but lab testing shows 14.2 g/10min. Entire 10-pallet lot quarantined.'
    },
    {
      queryId: 'QCR-Q303',
      batchNo: 'BAT-2026-915',
      inspectionStage: 'Ultrasonic Weld Strength Testing',
      defectCode: 'DEF-05: Low Burst Pressure Weld',
      severity: 'Minor Deviation',
      title: 'Ultrasonic Horn Amplitude Calibration Variance',
      status: 'Open',
      date: 'Yesterday, 03:20 PM',
      description: 'Burst test achieved 18 bar vs specified 22 bar. Need confirmation from R&D before re-welding.'
    }
  ]
};

