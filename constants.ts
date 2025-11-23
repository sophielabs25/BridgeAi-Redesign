
import { WorkflowCategory, Template, FlowNode, FlowEdge, ToneType, InboxConversation, WorkflowInstance, PipelineStage, Property, PropertyFeedback, PropertyOffer, ProgressionData, Task, LeadProfile, ChatCategory } from './types';
import { Zap, MessageSquare, GitBranch, Bot, Database } from 'lucide-react';
import { MOCK_CHATS_GENERATED } from './chatData';
import { MASTER_PROPERTIES } from './propertiesData';
import { ALL_PIPELINES, GENERATED_PROGRESSION_DATA } from './pipelineData';

export const NAVIGATION_ITEMS = [
  { name: 'Automations', icon: 'Workflow' },
  { name: 'Pipeline', icon: 'Kanban' },
  { name: 'Tasks', icon: 'CheckSquare' },
  { name: 'Properties', icon: 'Building' },
  { name: 'Chats', icon: 'MessageSquare' },
  { name: 'Contacts', icon: 'Users' },
  { name: 'Analytics', icon: 'BarChart' },
  { name: 'Settings', icon: 'Settings' },
];

export const CHAT_CATEGORIES = [
  { id: ChatCategory.LETTINGS, label: 'Lettings', icon: 'Home' },
  { id: ChatCategory.SALES, label: 'Sales', icon: 'TrendingUp' },
  { id: ChatCategory.VALUATIONS, label: 'Valuations', icon: 'Award' },
  { id: ChatCategory.COMPLIANCE, label: 'Compliance', icon: 'ShieldCheck' },
  { id: ChatCategory.MAINTENANCE, label: 'Maintenance', icon: 'Tool' },
  { id: ChatCategory.INSPECTIONS, label: 'Inspections', icon: 'ClipboardCheck' },
  { id: ChatCategory.MARKETING, label: 'Marketing', icon: 'Megaphone' },
  { id: ChatCategory.GENERAL, label: 'General', icon: 'Inbox' }
];

export const WORKFLOW_MENU = [
  WorkflowCategory.LETTINGS_RESIDENTIAL,
  WorkflowCategory.SALES_RESIDENTIAL,
  WorkflowCategory.VALUATION,
  WorkflowCategory.LETTINGS_COMMERCIAL,
  WorkflowCategory.SALES_COMMERCIAL,
  WorkflowCategory.COMPLIANCE,
  WorkflowCategory.MAINTENANCE,
  WorkflowCategory.INSPECTION,
  WorkflowCategory.MARKETING,
  WorkflowCategory.CREATE_NEW,
];

export const PIPELINE_MENU = [
  'Lettings Progression',
  'Sales Progression',
  'Valuations',
  'Compliance',
  'Maintenance',
  'Inspections',
  'Marketing'
];

// =============================================================================
// TASKS MOCK DATA
// =============================================================================
export const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Confirm buyer viewing', assignee: 'David Rose', dueDate: 'Today, 2:00 PM', status: 'Pending', type: 'Call', priority: 'High', relatedTo: { id: 'prop-3', label: '5 Garden Row', type: 'Property' } },
  { id: 't2', title: 'Chase solicitor for searches', assignee: 'Sarah Miller', dueDate: 'Tomorrow', status: 'In Progress', type: 'Email', priority: 'High', relatedTo: { id: 'prop-1', label: 'The Shard Apt 402', type: 'Deal' } },
  { id: 't3', title: 'Upload Gas Certificate', assignee: 'John Doe', dueDate: 'Oct 12', status: 'Overdue', type: 'To-Do', priority: 'Medium', relatedTo: { id: 'prop-5', label: '88 The Avenue', type: 'Property' } },
  { id: 't4', title: 'Follow up on valuation', assignee: 'David Rose', dueDate: 'Oct 14', status: 'Pending', type: 'Follow-up', priority: 'Low', relatedTo: { id: 'cont-1', label: 'Mr. Smith', type: 'Contact' } },
  { id: 't5', title: 'Send Welcome Pack', assignee: 'Admin', dueDate: 'Oct 10', status: 'Completed', type: 'Email', priority: 'Medium', relatedTo: { id: 'prop-4', label: 'Penthouse A', type: 'Deal' } },
];

// =============================================================================
// TEMPLATES
// =============================================================================
export const RECOMMENDED_TEMPLATES: Template[] = [
  {
    id: 'lr-1',
    title: 'Lead Capture & Qualification',
    description: 'Automatically engage new leads from portals, qualify budget and timeline, and sync to CRM.',
    category: WorkflowCategory.LETTINGS_RESIDENTIAL,
    appType: 'All',
    tags: ['Lead Gen', 'High Impact'],
    channels: ['email', 'sms', 'whatsapp']
  },
  {
    id: 'lr-2',
    title: 'Viewing Confirmation & Reminder',
    description: 'Send instant confirmation upon booking and a reminder 2 hours before.',
    category: WorkflowCategory.LETTINGS_RESIDENTIAL,
    appType: 'Alto',
    tags: ['Admin Saver'],
    channels: ['sms', 'email']
  },
  {
    id: 'lr-3',
    title: 'Feedback Chase Sequence',
    description: 'Follow up 24h after viewing to gather feedback or offers.',
    category: WorkflowCategory.LETTINGS_RESIDENTIAL,
    appType: 'All',
    tags: ['Sales'],
    channels: ['whatsapp', 'email']
  },
  {
    id: 'lr-4',
    title: 'Offer Negotiation Assistant',
    description: 'AI-assisted offer submission and counter-offer handling.',
    category: WorkflowCategory.SALES_RESIDENTIAL,
    appType: 'All',
    tags: ['Advanced', 'AI'],
    channels: ['chat']
  },
  {
    id: 'lr-5',
    title: 'Tenancy Renewal Reminder',
    description: 'Automated checks 90 days before end of tenancy to start renewal process.',
    category: WorkflowCategory.LETTINGS_RESIDENTIAL,
    appType: 'Reapit',
    tags: ['Retention'],
    channels: ['email']
  },
  {
    id: 'lr-6',
    title: 'Maintenance Request Triaging',
    description: 'AI analyzes incoming maintenance requests and assigns priority.',
    category: WorkflowCategory.MAINTENANCE,
    appType: 'Fixflo',
    tags: ['Ops'],
    channels: ['chat', 'email']
  }
];

export const CATEGORY_TEMPLATES: Record<string, Template[]> = {
  [WorkflowCategory.LETTINGS_RESIDENTIAL]: RECOMMENDED_TEMPLATES,
  [WorkflowCategory.SALES_RESIDENTIAL]: [
    {
        id: 'sr-1',
        title: 'Sales Chain Progression',
        description: 'Monitor milestones and chase solicitors automatically.',
        category: WorkflowCategory.SALES_RESIDENTIAL,
        appType: 'Reapit',
        tags: ['Progression'],
        channels: ['email']
    },
    {
        id: 'sr-2',
        title: 'Valuation Nurture Flow',
        description: 'Keep warm leads engaged with market updates after a valuation.',
        category: WorkflowCategory.SALES_RESIDENTIAL,
        appType: 'Alto',
        tags: ['Sales'],
        channels: ['email', 'sms']
    },
    {
        id: 'sr-3',
        title: 'New Instruction Launch',
        description: 'Checklist and auto-posting when a new property goes live.',
        category: WorkflowCategory.SALES_RESIDENTIAL,
        appType: 'All',
        tags: ['Marketing'],
        channels: ['email']
    }
  ],
  [WorkflowCategory.VALUATION]: [
      {
          id: 'val-1',
          title: 'Pre-Valuation Warm Up',
          description: 'Send guide to selling and agent bio before the appointment.',
          category: WorkflowCategory.VALUATION,
          appType: 'All',
          tags: ['Nurture'],
          channels: ['email']
      }
  ],
  [WorkflowCategory.MAINTENANCE]: [
      {
          id: 'maint-1',
          title: 'Emergency Issue Escalation',
          description: 'Detects keywords like "leak" or "fire" and alerts humans immediately.',
          category: WorkflowCategory.MAINTENANCE,
          appType: 'All',
          tags: ['Critical'],
          channels: ['sms', 'voice']
      }
  ],
  [WorkflowCategory.CREATE_NEW]: [],
  [WorkflowCategory.LETTINGS_COMMERCIAL]: [],
  [WorkflowCategory.SALES_COMMERCIAL]: [],
  [WorkflowCategory.COMPLIANCE]: [],
  [WorkflowCategory.INSPECTION]: [],
  [WorkflowCategory.MARKETING]: [],
};

// =============================================================================
// WORKFLOW INSTANCES
// =============================================================================
export const MOCK_WORKFLOW_INSTANCES: WorkflowInstance[] = [
    { id: 'wf-1', name: 'Lettings Lead Response', category: WorkflowCategory.LETTINGS_RESIDENTIAL, status: 'Active', createdOn: '2 days ago', createdBy: 'JD', runs: 145 },
    { id: 'wf-2', name: 'Weekend Viewing Reminders', category: WorkflowCategory.LETTINGS_RESIDENTIAL, status: 'Active', createdOn: '1 week ago', createdBy: 'SM', runs: 89 },
    { id: 'wf-3', name: 'Valuation Follow-up', category: WorkflowCategory.VALUATION, status: 'Paused', createdOn: '3 weeks ago', createdBy: 'JD', runs: 12 },
    { id: 'wf-4', name: 'Sales Progression Monitor', category: WorkflowCategory.SALES_RESIDENTIAL, status: 'Active', createdOn: '1 month ago', createdBy: 'DR', runs: 45 },
    { id: 'wf-5', name: 'Tenant Onboarding', category: WorkflowCategory.LETTINGS_RESIDENTIAL, status: 'Draft', createdOn: 'Yesterday', createdBy: 'SM', runs: 0 },
    { id: 'wf-6', name: 'Feedback Collection', category: WorkflowCategory.LETTINGS_RESIDENTIAL, status: 'Active', createdOn: '2 months ago', createdBy: 'Admin', runs: 320 },
    { id: 'wf-7', name: 'Maintenance Auto-Reply', category: WorkflowCategory.MAINTENANCE, status: 'Active', createdOn: '4 months ago', createdBy: 'Admin', runs: 56 },
];

// =============================================================================
// FLOW NODES & EDGES DEFAULT
// =============================================================================
export const INITIAL_NODES: FlowNode[] = [
    { id: '1', type: 'trigger', label: 'Start', position: { x: 250, y: 50 } }
];
export const INITIAL_EDGES: FlowEdge[] = [];

// --- PRESET FLOWS ---
export const LEAD_CAPTURE_NODES: FlowNode[] = [
    { id: '1', type: 'trigger', label: 'New Lead (Portal)', position: { x: 250, y: 0 }, data: { source: 'Rightmove' } },
    { id: '2', type: 'ai_process', label: 'Parse Intent', position: { x: 250, y: 100 } },
    { id: '3', type: 'condition', label: 'Is Qualified?', position: { x: 250, y: 200 } },
    { id: '4', type: 'action', label: 'Auto-Reply SMS', position: { x: 100, y: 300 } },
    { id: '5', type: 'action', label: 'Notify Agent', position: { x: 400, y: 300 } }
];
export const LEAD_CAPTURE_EDGES: FlowEdge[] = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
    { id: 'e3-4', source: '3', target: '4' },
    { id: 'e3-5', source: '3', target: '5' }
];

export const LEAD_QUALIFICATION_NODES = LEAD_CAPTURE_NODES;
export const LEAD_QUALIFICATION_EDGES = LEAD_CAPTURE_EDGES;
export const FEEDBACK_NODES = LEAD_CAPTURE_NODES;
export const FEEDBACK_EDGES = LEAD_CAPTURE_EDGES;
export const BOOKING_NODES = LEAD_CAPTURE_NODES;
export const BOOKING_EDGES = LEAD_CAPTURE_EDGES;
export const SUGGESTIONS_NODES = LEAD_CAPTURE_NODES;
export const SUGGESTIONS_EDGES = LEAD_CAPTURE_EDGES;
export const OFFERS_NODES = LEAD_CAPTURE_NODES;
export const OFFERS_EDGES = LEAD_CAPTURE_EDGES;
export const REFERENCES_NODES = LEAD_CAPTURE_NODES;
export const REFERENCES_EDGES = LEAD_CAPTURE_EDGES;
export const NOTIFICATIONS_NODES = LEAD_CAPTURE_NODES;
export const NOTIFICATIONS_EDGES = LEAD_CAPTURE_EDGES;
export const ONBOARDING_NODES = LEAD_CAPTURE_NODES;
export const ONBOARDING_EDGES = LEAD_CAPTURE_EDGES;


// =============================================================================
// PROPERTIES & INBOX
// =============================================================================
// EXPORTING FROM MASTER FILE
export const MOCK_PROPERTIES: Property[] = MASTER_PROPERTIES;

export const MOCK_INBOX_CONVERSATIONS: InboxConversation[] = MOCK_CHATS_GENERATED;

export const MOCK_PROPERTY_FEEDBACK: PropertyFeedback[] = [
    { id: 'fb-1', propertyId: 'prop-1', viewerName: 'Sarah Jones', date: '2 days ago', interestLevel: 'High', comment: 'Loved the view, bit pricey though.', sentiment: 'Positive', priceOpinion: 'Too High' },
    { id: 'fb-2', propertyId: 'prop-3', viewerName: 'Mike Ross', date: '3 days ago', interestLevel: 'Medium', comment: 'Garden is smaller than expected.', sentiment: 'Neutral', priceOpinion: 'Fair' }
];

export const MOCK_PROPERTY_OFFERS: PropertyOffer[] = [
    { id: 'of-1', propertyId: 'prop-2', applicantName: 'Tom Hardy', amount: '£1,850 pcm', date: 'Yesterday', status: 'Pending', conditions: 'Subject to pet clause' },
    { id: 'of-2', propertyId: 'prop-5', applicantName: 'The Millers', amount: '£740,000', date: '1 week ago', status: 'Accepted', conditions: 'Survey results' }
];

// =============================================================================
// REALISTIC PIPELINE DATA (GENERATED)
// =============================================================================

// Export the generated map
export const GENERATED_PIPELINES_MAP = ALL_PIPELINES;
export const MOCK_PROGRESSION_DATA: Record<string, ProgressionData> = GENERATED_PROGRESSION_DATA;
