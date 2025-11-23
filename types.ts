
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  FLOW_BUILDER = 'FLOW_BUILDER',
  CHATS = 'CHATS',
  SETTINGS = 'SETTINGS',
  TEMPLATE_GALLERY = 'TEMPLATE_GALLERY',
  TEMPLATE_PREVIEW = 'TEMPLATE_PREVIEW',
  PIPELINE = 'PIPELINE',
  PROPERTIES = 'PROPERTIES',
  TASKS = 'TASKS'
}

export enum WorkflowCategory {
  LETTINGS_RESIDENTIAL = 'Lettings Residential',
  SALES_RESIDENTIAL = 'Sales Residential',
  VALUATION = 'Valuation',
  LETTINGS_COMMERCIAL = 'Lettings Commercials',
  SALES_COMMERCIAL = 'Sales Commercials',
  COMPLIANCE = 'Compliance',
  MAINTENANCE = 'Maintenance',
  INSPECTION = 'Inspection',
  MARKETING = 'Marketing',
  CREATE_NEW = 'Create New Flow'
}

export enum ChatCategory {
  LETTINGS = 'Lettings',
  SALES = 'Sales',
  VALUATIONS = 'Valuations',
  COMPLIANCE = 'Compliance',
  MAINTENANCE = 'Maintenance',
  INSPECTIONS = 'Inspections',
  MARKETING = 'Marketing',
  GENERAL = 'General'
}

export enum ToneType {
  FORMAL = 'Formal',
  FRIENDLY = 'Friendly',
  PROFESSIONAL = 'Professional',
  PLAYFUL = 'Playful'
}

export interface PreviewStep {
  type: 'trigger' | 'action' | 'condition' | 'ai';
  label: string;
  subLabel?: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  appType: 'OTM' | 'Zoopla' | 'Alto' | 'Rightmove' | 'Reapit' | 'Fixflo' | 'General' | 'All';
  tags: string[];
  thumbnail?: string;
  features?: string[];
  channels?: string[]; // e.g. ['chat', 'email', 'whatsapp', 'slack', 'ticket']
  previewSteps?: PreviewStep[];
}

export interface WorkflowInstance {
  id: string;
  name: string;
  category: string;
  status: 'Active' | 'Draft' | 'Paused';
  createdOn: string;
  createdBy: string;
  runs: number;
}

// Node system for Flow Builder
export interface Position {
  x: number;
  y: number;
}

export interface FlowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'ai_process' | 'integration';
  label: string;
  position: Position;
  data?: Record<string, any>;
  config?: {
    tone?: ToneType;
  }
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
}

export interface FlowData {
  id: string;
  name: string;
  category: WorkflowCategory;
  nodes: FlowNode[];
  edges: FlowEdge[];
  tone: ToneType;
}

// Inbox System
export type LeadSource = 'Rightmove' | 'Zoopla' | 'Website' | 'Email' | 'Phone' | 'Whatsapp' | 'System';

export interface Message {
  id: string;
  sender: 'user' | 'agent' | 'ai' | 'system';
  text: string;
  timestamp: string;
}

export interface PropertyInterest {
  id: string;
  address: string;
  price: string;
  bedrooms: number;
  image: string;
  status: 'Enquired' | 'Viewing Booked' | 'Offer Made' | 'Let Agreed';
  portalUrl?: string;
}

export interface LeadProfile {
  name: string;
  email: string;
  phone: string;
  budget?: string;
  moveDate?: string;
  status: 'New' | 'Qualifying' | 'Hot' | 'Warm' | 'Nurture' | 'Closed';
  properties: PropertyInterest[]; 
}

export interface InboxConversation {
  id: string;
  source: LeadSource;
  crm: 'Alto' | 'Reapit' | 'Apex27' | 'Salesforce';
  category: ChatCategory;
  lead: LeadProfile;
  messages: Message[];
  unreadCount: number;
  lastActivity: string;
  tags: string[];
}

// Pipeline System
export interface PipelineCard {
  id: string;
  title: string; // Usually address or lead name
  subtitle: string; // Price or Detail
  leadName: string;
  value?: string;
  source: LeadSource;
  date: string;
  triggerFlow?: string; // The automation workflow that moved it here
  tags: string[];
  assignedTo?: string; // Initials
}

export interface PipelineStage {
  id: string;
  title: string;
  cards: PipelineCard[];
}

// Tasks System
export interface Task {
  id: string;
  title: string;
  assignee: string; // Initials or Name
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  type: 'To-Do' | 'Call' | 'Email' | 'Meeting' | 'Follow-up';
  priority: 'High' | 'Medium' | 'Low';
  relatedTo?: {
    id: string;
    label: string;
    type: 'Property' | 'Contact' | 'Deal';
  };
}

// Sales Progression Types
export interface ProgressionParty {
  role: 'Buyer' | 'Seller' | 'Buyer Solicitor' | 'Seller Solicitor' | 'Mortgage Broker';
  name: string;
  company?: string;
  email: string;
  phone: string;
  status: 'Active' | 'Awaiting Action' | 'Completed' | 'Not Logged In';
  avatar?: string;
  lastLogin?: string;
}

export interface ProgressionMilestone {
  id: string;
  title: string;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Overdue';
  completedDate?: string;
  dueDate?: string;
  assignedTo?: string;
  notes?: string;
  subTasks?: { id: string; label: string; isDone: boolean }[];
}

export interface SuggestedAction {
  id: string;
  title: string;
  description: string;
  type: 'Follow-up' | 'Document' | 'Call' | 'Task';
}

export interface ProgressionData {
  id: string; // Matches PipelineCard.id
  address: string;
  price: string;
  targetExchangeDate: string;
  completionDate?: string;
  progress: number; // Percentage 0-100
  aiSummary: string; // The text block from the screenshot
  parties: ProgressionParty[];
  milestones: ProgressionMilestone[];
  suggestedActions: SuggestedAction[];
  nextSteps: { label: string; date: string }[];
  recentActivity: {
    id: string;
    text: string;
    user: string;
    date: string;
    type: 'System' | 'Email' | 'Call' | 'Document' | 'Note';
  }[];
}

// Property Inventory
export interface Property {
  id: string;
  address: string;
  postcode: string;
  price: string;
  type: 'Sales' | 'Lettings';
  status: 'Available' | 'Under Offer' | 'Let Agreed' | 'Sold' | 'Withdrawn';
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image: string;
  agent: string; // Initials or Name
  portalStatus: {
    rightmove: boolean;
    zoopla: boolean;
    website: boolean;
  };
  stats: {
    views: number;
    enquiries: number;
  };
  // Extended Details for Tabs
  description: string;
  features: string[];
  additionalDetails: {
    councilTax: string;
    deposit: string;
    tenure: string;
    availability: string;
    furnishing?: string; // Furnished, Part-furnished, Unfurnished
    availableFrom?: string; // Move-in date
  };
  epcRating: string; // e.g. "B"
  media: {
    videoUrl?: string;
    virtualTourUrl?: string;
    virtual3DTourUrl?: string;
    floorPlanUrl?: string;
    brochureUrl?: string;
    photos?: string[];
  };
  location: {
    lat: number;
    lng: number;
  };
  commute?: {
    station?: string;
    duration?: string;
    modes?: string[];
  };
}

export interface PropertyFeedback {
  id: string;
  propertyId: string;
  viewerName: string;
  date: string;
  interestLevel: 'High' | 'Medium' | 'Low' | 'None';
  comment: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  priceOpinion: 'Too High' | 'Fair' | 'Good Value';
}

export interface PropertyOffer {
  id: string;
  propertyId: string;
  applicantName: string;
  amount: string;
  date: string;
  status: 'Pending' | 'Accepted' | 'Declined' | 'Negotiating';
  conditions?: string;
}
