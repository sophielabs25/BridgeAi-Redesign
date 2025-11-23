import { InboxConversation, ChatCategory, LeadSource } from './types';
import { MASTER_PROPERTIES } from './propertiesData';

// Helper to pick random properties from the master list based on type
const getRandomProperties = (count: number, type: 'Sales' | 'Lettings' | 'Any' = 'Any') => {
    let pool = MASTER_PROPERTIES;
    if (type !== 'Any') {
        pool = MASTER_PROPERTIES.filter(p => p.type === type);
    }
    
    // Shuffle and slice
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Helper to generate a random conversation
const generateConversation = (
  id: string, 
  category: ChatCategory, 
  name: string, 
  status: 'New' | 'Qualifying' | 'Hot' | 'Warm' | 'Nurture' | 'Closed',
  source: LeadSource,
  propertyCount: number,
  propType: 'Sales' | 'Lettings' | 'Any',
  lastMsg: string,
  time: string
): InboxConversation => {
  
  const linkedProperties = getRandomProperties(propertyCount, propType);
  
  return {
    id,
    source,
    crm: 'Reapit',
    category,
    lead: {
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      phone: '07700 900' + Math.floor(100 + Math.random() * 900),
      status,
      budget: linkedProperties[0]?.price || 'TBD',
      properties: linkedProperties.map((p, idx) => ({
        id: p.id,
        address: p.address,
        price: p.price,
        bedrooms: p.bedrooms,
        image: p.image,
        status: idx === 0 ? 'Enquired' : 'Viewing Booked'
      }))
    },
    messages: [
      { id: 'm1', sender: 'user', text: lastMsg, timestamp: time }
    ],
    unreadCount: Math.random() > 0.7 ? 1 : 0,
    lastActivity: time,
    tags: [category]
  };
};

export const MOCK_CHATS_GENERATED: InboxConversation[] = [
  // LETTINGS (10) - Linked to Lettings Properties
  generateConversation('l1', ChatCategory.LETTINGS, 'Alice Chen', 'Hot', 'Rightmove', 1, 'Lettings', 'Is this still available?', '10:00 AM'),
  generateConversation('l2', ChatCategory.LETTINGS, 'Tom Hardy', 'Qualifying', 'Zoopla', 1, 'Lettings', 'Do you accept pets?', '10:15 AM'),
  generateConversation('l3', ChatCategory.LETTINGS, 'Emma Stone', 'New', 'Website', 2, 'Lettings', 'Can I book a viewing for both?', '10:30 AM'),
  generateConversation('l4', ChatCategory.LETTINGS, 'James Bond', 'Warm', 'Email', 1, 'Lettings', 'What is the deposit amount?', '11:00 AM'),
  generateConversation('l5', ChatCategory.LETTINGS, 'Sarah Connor', 'Nurture', 'Whatsapp', 1, 'Lettings', 'Ill let you know by Friday.', 'Yesterday'),
  generateConversation('l6', ChatCategory.LETTINGS, 'Bruce Wayne', 'Hot', 'Phone', 2, 'Lettings', 'I want to secure the penthouse.', 'Yesterday'),
  generateConversation('l7', ChatCategory.LETTINGS, 'Diana Prince', 'New', 'Rightmove', 1, 'Lettings', 'Is there parking?', '2 days ago'),
  generateConversation('l8', ChatCategory.LETTINGS, 'Clark Kent', 'Qualifying', 'Zoopla', 1, 'Lettings', 'How close is the station?', '2 days ago'),
  generateConversation('l9', ChatCategory.LETTINGS, 'Barry Allen', 'Hot', 'Website', 1, 'Lettings', 'I can move in immediately.', '3 days ago'),
  generateConversation('l10', ChatCategory.LETTINGS, 'Hal Jordan', 'Closed', 'Email', 1, 'Lettings', 'Agreement signed.', '1 week ago'),

  // SALES (10) - Linked to Sales Properties
  generateConversation('s1', ChatCategory.SALES, 'Tony Stark', 'Hot', 'Rightmove', 1, 'Sales', 'Cash buyer, ready to proceed.', '09:00 AM'),
  generateConversation('s2', ChatCategory.SALES, 'Steve Rogers', 'Qualifying', 'Zoopla', 1, 'Sales', 'Are there local schools?', '09:30 AM'),
  generateConversation('s3', ChatCategory.SALES, 'Natasha Romanoff', 'Warm', 'Website', 2, 'Sales', 'Would like to view these two.', '10:45 AM'),
  generateConversation('s4', ChatCategory.SALES, 'Bruce Banner', 'New', 'Phone', 1, 'Sales', 'Is the price negotiable?', '11:20 AM'),
  generateConversation('s5', ChatCategory.SALES, 'Clint Barton', 'Nurture', 'Email', 1, 'Sales', 'Waiting for my mortgage AIP.', 'Yesterday'),
  generateConversation('s6', ChatCategory.SALES, 'Thor Odinson', 'Hot', 'Whatsapp', 1, 'Sales', 'Making an offer today.', 'Yesterday'),
  generateConversation('s7', ChatCategory.SALES, 'Wanda Maximoff', 'Qualifying', 'Rightmove', 1, 'Sales', 'Is it freehold?', '2 days ago'),
  generateConversation('s8', ChatCategory.SALES, 'Vision', 'New', 'Zoopla', 1, 'Sales', 'Requesting floorplan.', '2 days ago'),
  generateConversation('s9', ChatCategory.SALES, 'Sam Wilson', 'Warm', 'Website', 1, 'Sales', 'Second viewing possible?', '3 days ago'),
  generateConversation('s10', ChatCategory.SALES, 'Bucky Barnes', 'Closed', 'Phone', 1, 'Sales', 'Keys collected.', '1 week ago'),

  // VALUATIONS (10) - Linked to Sales (Potential Vendors)
  generateConversation('v1', ChatCategory.VALUATIONS, 'Peter Parker', 'Hot', 'Website', 1, 'Sales', 'Book valuation for Friday.', '08:00 AM'),
  generateConversation('v2', ChatCategory.VALUATIONS, 'May Parker', 'Warm', 'Phone', 1, 'Sales', 'Just checking if you cover Queens.', '08:30 AM'),
  generateConversation('v3', ChatCategory.VALUATIONS, 'Harry Osborn', 'Qualifying', 'Email', 1, 'Sales', 'Thinking of selling.', '09:00 AM'),
  generateConversation('v4', ChatCategory.VALUATIONS, 'Norman Osborn', 'New', 'Website', 1, 'Sales', 'What are your fees?', '10:00 AM'),
  generateConversation('v5', ChatCategory.VALUATIONS, 'Mary Jane', 'Nurture', 'Whatsapp', 1, 'Sales', 'Call me next month.', 'Yesterday'),
  generateConversation('v6', ChatCategory.VALUATIONS, 'Gwen Stacy', 'Hot', 'Rightmove', 1, 'Sales', 'Ready to put it on market.', 'Yesterday'),
  generateConversation('v7', ChatCategory.VALUATIONS, 'Miles Morales', 'Qualifying', 'Zoopla', 1, 'Sales', 'Do you do virtual valuations?', '2 days ago'),
  generateConversation('v8', ChatCategory.VALUATIONS, 'Aaron Davis', 'New', 'Phone', 1, 'Sales', 'Market appraisal needed.', '2 days ago'),
  generateConversation('v9', ChatCategory.VALUATIONS, 'Rio Morales', 'Warm', 'Email', 1, 'Sales', 'Sending photos shortly.', '3 days ago'),
  generateConversation('v10', ChatCategory.VALUATIONS, 'Jefferson Davis', 'Closed', 'Website', 1, 'Sales', 'Thanks for the report.', '1 week ago'),

  // COMPLIANCE (10) - Linked to Lettings
  generateConversation('c1', ChatCategory.COMPLIANCE, 'Landlord John', 'Hot', 'Email', 1, 'Lettings', 'Gas cert is expiring.', '12:00 PM'),
  generateConversation('c2', ChatCategory.COMPLIANCE, 'Landlord Sarah', 'Qualifying', 'Phone', 1, 'Lettings', 'Do I need EICR?', '12:30 PM'),
  generateConversation('c3', ChatCategory.COMPLIANCE, 'Tenant Mike', 'New', 'Website', 1, 'Lettings', 'Where is my deposit protection cert?', '01:00 PM'),
  generateConversation('c4', ChatCategory.COMPLIANCE, 'Landlord Bill', 'Warm', 'Whatsapp', 1, 'Lettings', 'License renewal due.', '02:00 PM'),
  generateConversation('c5', ChatCategory.COMPLIANCE, 'Contractor Dave', 'Nurture', 'Email', 1, 'Lettings', 'Sent the updated EPC.', 'Yesterday'),
  generateConversation('c6', ChatCategory.COMPLIANCE, 'Council Rep', 'Hot', 'Phone', 1, 'Lettings', 'HMO Inspection required.', 'Yesterday'),
  generateConversation('c7', ChatCategory.COMPLIANCE, 'Landlord Jen', 'Qualifying', 'Rightmove', 1, 'Lettings', 'Is the smoke alarm compliant?', '2 days ago'),
  generateConversation('c8', ChatCategory.COMPLIANCE, 'Tenant Tom', 'New', 'Zoopla', 1, 'Lettings', 'Right to rent check.', '2 days ago'),
  generateConversation('c9', ChatCategory.COMPLIANCE, 'Compliance Officer', 'Warm', 'Website', 1, 'Lettings', 'Audit passed.', '3 days ago'),
  generateConversation('c10', ChatCategory.COMPLIANCE, 'Landlord Bob', 'Closed', 'Email', 1, 'Lettings', 'All docs uploaded.', '1 week ago'),

  // MAINTENANCE (10) - Linked to Lettings
  generateConversation('m1', ChatCategory.MAINTENANCE, 'Tenant Alice', 'Hot', 'Website', 1, 'Lettings', 'Boiler is not working.', '08:15 AM'),
  generateConversation('m2', ChatCategory.MAINTENANCE, 'Tenant Bob', 'Qualifying', 'Phone', 1, 'Lettings', 'Leak under the sink.', '09:45 AM'),
  generateConversation('m3', ChatCategory.MAINTENANCE, 'Landlord Charlie', 'New', 'Email', 1, 'Lettings', 'Quote for roof repair?', '11:00 AM'),
  generateConversation('m4', ChatCategory.MAINTENANCE, 'Contractor Steve', 'Warm', 'Whatsapp', 1, 'Lettings', 'Can attend tomorrow.', '12:00 PM'),
  generateConversation('m5', ChatCategory.MAINTENANCE, 'Tenant Eve', 'Nurture', 'Rightmove', 1, 'Lettings', 'Window handle loose.', 'Yesterday'),
  generateConversation('m6', ChatCategory.MAINTENANCE, 'Tenant Frank', 'Hot', 'Zoopla', 1, 'Lettings', 'No hot water.', 'Yesterday'),
  generateConversation('m7', ChatCategory.MAINTENANCE, 'Landlord Grace', 'Qualifying', 'Website', 1, 'Lettings', 'Approved the plumbing quote.', '2 days ago'),
  generateConversation('m8', ChatCategory.MAINTENANCE, 'Tenant Heidi', 'New', 'Phone', 1, 'Lettings', 'Lock is jamming.', '2 days ago'),
  generateConversation('m9', ChatCategory.MAINTENANCE, 'Contractor Ivan', 'Warm', 'Email', 1, 'Lettings', 'Job completed.', '3 days ago'),
  generateConversation('m10', ChatCategory.MAINTENANCE, 'Tenant Judy', 'Closed', 'Whatsapp', 1, 'Lettings', 'Thanks for fixing it.', '1 week ago'),

  // INSPECTIONS (10) - Linked to Lettings
  generateConversation('i1', ChatCategory.INSPECTIONS, 'Clerk Anna', 'Hot', 'Email', 1, 'Lettings', 'Inventory check-in report attached.', '09:00 AM'),
  generateConversation('i2', ChatCategory.INSPECTIONS, 'Tenant Paul', 'Qualifying', 'Phone', 1, 'Lettings', 'Disputing the carpet stain.', '10:30 AM'),
  generateConversation('i3', ChatCategory.INSPECTIONS, 'Landlord Mark', 'New', 'Website', 1, 'Lettings', 'When is the mid-term inspection?', '11:45 AM'),
  generateConversation('i4', ChatCategory.INSPECTIONS, 'Clerk Dave', 'Warm', 'Whatsapp', 1, 'Lettings', 'Keys collected for check-out.', '01:00 PM'),
  generateConversation('i5', ChatCategory.INSPECTIONS, 'Tenant Lucy', 'Nurture', 'Rightmove', 1, 'Lettings', 'Can we reschedule inspection?', 'Yesterday'),
  generateConversation('i6', ChatCategory.INSPECTIONS, 'Landlord Pete', 'Hot', 'Zoopla', 1, 'Lettings', 'Send me the photos.', 'Yesterday'),
  generateConversation('i7', ChatCategory.INSPECTIONS, 'Clerk Sarah', 'Qualifying', 'Website', 1, 'Lettings', 'Report generated.', '2 days ago'),
  generateConversation('i8', ChatCategory.INSPECTIONS, 'Tenant John', 'New', 'Phone', 1, 'Lettings', 'Do I need to be present?', '2 days ago'),
  generateConversation('i9', ChatCategory.INSPECTIONS, 'Landlord Kate', 'Warm', 'Email', 1, 'Lettings', 'Looks good.', '3 days ago'),
  generateConversation('i10', ChatCategory.INSPECTIONS, 'Tenant Mary', 'Closed', 'Whatsapp', 1, 'Lettings', 'Deposit return confirmed.', '1 week ago'),

  // MARKETING (10) - Linked to Sales/Lettings
  generateConversation('mk1', ChatCategory.MARKETING, 'Vendor Sam', 'Hot', 'Email', 1, 'Sales', 'Approve the brochure.', '09:15 AM'),
  generateConversation('mk2', ChatCategory.MARKETING, 'Vendor Lisa', 'Qualifying', 'Phone', 1, 'Sales', 'Change the main photo.', '10:00 AM'),
  generateConversation('mk3', ChatCategory.MARKETING, 'Photographer', 'New', 'Website', 1, 'Sales', 'Photos ready for download.', '11:00 AM'),
  generateConversation('mk4', ChatCategory.MARKETING, 'Vendor Tom', 'Warm', 'Whatsapp', 1, 'Sales', 'When does it go live?', '12:00 PM'),
  generateConversation('mk5', ChatCategory.MARKETING, 'Portal Support', 'Nurture', 'Rightmove', 1, 'Sales', 'Listing updated.', 'Yesterday'),
  generateConversation('mk6', ChatCategory.MARKETING, 'Vendor Jane', 'Hot', 'Zoopla', 1, 'Sales', 'Reduce price on Rightmove.', 'Yesterday'),
  generateConversation('mk7', ChatCategory.MARKETING, 'Sign Guy', 'Qualifying', 'Website', 1, 'Sales', 'Board erected.', '2 days ago'),
  generateConversation('mk8', ChatCategory.MARKETING, 'Vendor Mike', 'New', 'Phone', 1, 'Sales', 'Is the virtual tour working?', '2 days ago'),
  generateConversation('mk9', ChatCategory.MARKETING, 'Social Media', 'Warm', 'Email', 1, 'Sales', 'Instagram post scheduled.', '3 days ago'),
  generateConversation('mk10', ChatCategory.MARKETING, 'Vendor Sue', 'Closed', 'Whatsapp', 1, 'Sales', 'Looks great thanks.', '1 week ago'),

  // GENERAL (10) - No Properties
  generateConversation('g1', ChatCategory.GENERAL, 'Candidate Joe', 'Hot', 'Email', 0, 'Any', 'Job application for negotiator.', '09:00 AM'),
  generateConversation('g2', ChatCategory.GENERAL, 'Supplier Cleaning', 'Qualifying', 'Phone', 0, 'Any', 'Invoice #1234 overdue.', '10:00 AM'),
  generateConversation('g3', ChatCategory.GENERAL, 'Partner Agency', 'New', 'Website', 0, 'Any', 'Referral agreement.', '11:00 AM'),
  generateConversation('g4', ChatCategory.GENERAL, 'IT Support', 'Warm', 'Whatsapp', 0, 'Any', 'Server maintenance scheduled.', '12:00 PM'),
  generateConversation('g5', ChatCategory.GENERAL, 'Office Manager', 'Nurture', 'Rightmove', 0, 'Any', 'Stationery order.', 'Yesterday'),
  generateConversation('g6', ChatCategory.GENERAL, 'Candidate Sarah', 'Hot', 'Zoopla', 0, 'Any', 'Interview confirmation.', 'Yesterday'),
  generateConversation('g7', ChatCategory.GENERAL, 'Local Council', 'Qualifying', 'Website', 0, 'Any', 'Parking permit query.', '2 days ago'),
  generateConversation('g8', ChatCategory.GENERAL, 'Utility Co', 'New', 'Phone', 0, 'Any', 'Account setup.', '2 days ago'),
  generateConversation('g9', ChatCategory.GENERAL, 'Recruiter', 'Warm', 'Email', 0, 'Any', 'New CVs attached.', '3 days ago'),
  generateConversation('g10', ChatCategory.GENERAL, 'Cleaner', 'Closed', 'Whatsapp', 0, 'Any', 'Office cleaned.', '1 week ago'),
];