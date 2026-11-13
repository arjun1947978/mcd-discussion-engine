/**
 * Sales System Specific Configuration
 * "sales wale me department ka jikar nahi rahe ga"
 */
export const SALES_SYSTEM_CONFIG = {
  systemId: 'SALES_PORTAL',
  systemName: 'Marca Coroma Sales CRM & Orders',
  themeAccent: '#db2777', // Pink/Rose for Sales
  hasDepartments: false, // NO departments shown in Sales!
  mode: 'per-card-query', // Only query cards discussion
  defaultSender: {
    name: 'Pooja Varma',
    role: 'Sales Key Accounts Manager',
    system: 'SALES'
  },
  sampleSalesCards: [
    {
      queryId: 'SALES-Q201',
      orderId: 'ORD-2026-8841',
      clientName: 'Zenith Corp Pvt Ltd',
      dealValue: '₹42,50,000',
      title: 'Bulk Export Order Discount Authorization',
      priority: 'Critical',
      status: 'In Discussion',
      date: 'Today, 10:30 AM',
      description: 'Client requesting 8.5% volume discount for 50,000 units quarterly contract. Margin analysis requested from Accounts.'
    },
    {
      queryId: 'SALES-Q202',
      orderId: 'ORD-2026-7910',
      clientName: 'Apex Automotive Systems',
      dealValue: '₹18,20,000',
      title: 'Dispatch Timeline Expedited for 1200 Poly Plugs',
      priority: 'High',
      status: 'Open',
      date: 'Today, 11:15 AM',
      description: 'Customer plant shut scheduled next week, requires dispatch by Thursday instead of standard 14 days SLA.'
    },
    {
      queryId: 'SALES-Q203',
      orderId: 'ORD-2026-6650',
      clientName: 'Mahindra Diecasting Division',
      dealValue: '₹9,80,000',
      title: 'Custom Packaging & Barcode Labeling Verification',
      priority: 'Medium',
      status: 'Open',
      date: 'Yesterday',
      description: 'Customer requires thermal transfer QR code labels on each carton as per new VDA 4902 standards.'
    }
  ]
};

