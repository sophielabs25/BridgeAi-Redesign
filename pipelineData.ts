
import { PipelineStage, PipelineCard, ProgressionData, ChatCategory } from './types';
import { MOCK_CHATS_GENERATED } from './chatData';
import { MASTER_PROPERTIES } from './propertiesData';

// --- STAGE DEFINITIONS FOR ALL PIPELINES ---

const LETTINGS_STAGES = [
    { id: 'l1', title: 'New Lead', cards: [] },
    { id: 'l2', title: 'Viewing', cards: [] },
    { id: 'l3', title: 'Offer Received', cards: [] },
    { id: 'l4', title: 'Referencing', cards: [] },
    { id: 'l5', title: 'Let Agreed', cards: [] }
];

const SALES_STAGES = [
    { id: 's1', title: 'New Buyer', cards: [] },
    { id: 's2', title: 'Viewing', cards: [] },
    { id: 's3', title: 'Offer Made', cards: [] },
    { id: 's4', title: 'Conveyancing', cards: [] },
    { id: 's5', title: 'Exchange/Complete', cards: [] }
];

const VALUATION_STAGES = [
    { id: 'v1', title: 'Valuation Req', cards: [] },
    { id: 'v2', title: 'Booked', cards: [] },
    { id: 'v3', title: 'Valued', cards: [] },
    { id: 'v4', title: 'Instructed', cards: [] }
];

const MAINTENANCE_STAGES = [
    { id: 'm1', title: 'Reported', cards: [] },
    { id: 'm2', title: 'Quote Requested', cards: [] },
    { id: 'm3', title: 'Work Order Sent', cards: [] },
    { id: 'm4', title: 'Invoiced/Closed', cards: [] }
];

const COMPLIANCE_STAGES = [
    { id: 'c1', title: 'Upcoming Exp', cards: [] },
    { id: 'c2', title: 'Actioned', cards: [] },
    { id: 'c3', title: 'Certificate Rx', cards: [] },
    { id: 'c4', title: 'Remedial Works', cards: [] }
];

const INSPECTION_STAGES = [
    { id: 'i1', title: 'Due', cards: [] },
    { id: 'i2', title: 'Booked', cards: [] },
    { id: 'i3', title: 'Report Review', cards: [] },
    { id: 'i4', title: 'Dispute/Action', cards: [] }
];

const MARKETING_STAGES = [
    { id: 'mk1', title: 'Pre-Listing', cards: [] },
    { id: 'mk2', title: 'Photo/Media', cards: [] },
    { id: 'mk3', title: 'Vendor Approval', cards: [] },
    { id: 'mk4', title: 'Live', cards: [] }
];

// --- INITIALIZE EMPTY PIPELINES ---
const pipelines: Record<string, PipelineStage[]> = {
    'Lettings Progression': JSON.parse(JSON.stringify(LETTINGS_STAGES)),
    'Sales Progression': JSON.parse(JSON.stringify(SALES_STAGES)),
    'Valuations': JSON.parse(JSON.stringify(VALUATION_STAGES)),
    'Maintenance': JSON.parse(JSON.stringify(MAINTENANCE_STAGES)),
    'Compliance': JSON.parse(JSON.stringify(COMPLIANCE_STAGES)),
    'Inspections': JSON.parse(JSON.stringify(INSPECTION_STAGES)),
    'Marketing': JSON.parse(JSON.stringify(MARKETING_STAGES)),
};

export const GENERATED_PROGRESSION_DATA: Record<string, ProgressionData> = {};

// --- INTELLIGENT MAPPING LOGIC ---
// Maps a chat to a specific pipeline stage based on category and chat context

MOCK_CHATS_GENERATED.forEach((chat) => {
    // Determine which pipeline this chat belongs to
    let pipelineName = '';
    let stageId = '';

    switch(chat.category) {
        case ChatCategory.LETTINGS:
            pipelineName = 'Lettings Progression';
            if (chat.lead.status === 'New') stageId = 'l1';
            else if (chat.lead.status === 'Qualifying') stageId = 'l2';
            else if (chat.lead.status === 'Hot') stageId = 'l3'; // Offer
            else if (chat.lead.status === 'Warm') stageId = 'l4'; // Ref
            else stageId = 'l5';
            break;
        case ChatCategory.SALES:
            pipelineName = 'Sales Progression';
            if (chat.lead.status === 'New') stageId = 's1';
            else if (chat.lead.status === 'Qualifying') stageId = 's2';
            else if (chat.lead.status === 'Hot') stageId = 's3'; // Offer
            else if (chat.lead.status === 'Closed') stageId = 's5';
            else stageId = 's4';
            break;
        case ChatCategory.VALUATIONS:
            pipelineName = 'Valuations';
            if (chat.lead.status === 'New') stageId = 'v1';
            else if (chat.lead.status === 'Qualifying') stageId = 'v2';
            else if (chat.lead.status === 'Hot') stageId = 'v4'; // Instructed
            else stageId = 'v3';
            break;
        case ChatCategory.MAINTENANCE:
            pipelineName = 'Maintenance';
            if (chat.lead.status === 'Hot') stageId = 'm1'; // Urgent/Reported
            else if (chat.lead.status === 'Qualifying') stageId = 'm2'; // Quote
            else if (chat.lead.status === 'Warm') stageId = 'm3'; // Work order
            else stageId = 'm4';
            break;
        case ChatCategory.COMPLIANCE:
            pipelineName = 'Compliance';
            if (chat.lead.status === 'Hot') stageId = 'c1'; 
            else if (chat.lead.status === 'Qualifying') stageId = 'c4'; // Remedial
            else stageId = 'c2';
            break;
        case ChatCategory.INSPECTIONS:
            pipelineName = 'Inspections';
            if (chat.lead.status === 'Hot') stageId = 'i3'; // Review
            else if (chat.lead.status === 'Qualifying') stageId = 'i4'; // Dispute
            else stageId = 'i2';
            break;
        case ChatCategory.MARKETING:
            pipelineName = 'Marketing';
            if (chat.lead.status === 'Hot') stageId = 'mk3'; // Approval
            else if (chat.lead.status === 'Closed') stageId = 'mk4'; // Live
            else stageId = 'mk2';
            break;
        default: return; // General chats don't go to pipeline
    }

    // Property matching
    const property = chat.lead.properties.length > 0 
        ? MASTER_PROPERTIES.find(p => p.id === chat.lead.properties[0].id) 
        : { address: 'General Inquiry', price: 'N/A', agent: 'JD' };

    if (!property) return;

    // Create Card
    const card: PipelineCard = {
        id: `pipe-${chat.id}`,
        title: property.address.split(',')[0],
        subtitle: chat.lead.name,
        leadName: chat.lead.name,
        source: chat.source,
        value: property.price,
        date: chat.lastActivity,
        triggerFlow: chat.messages.some(m => m.sender === 'ai') ? 'AI Responder' : undefined,
        tags: [chat.lead.status],
        assignedTo: (property as any).agent || 'JD'
    };

    // Push to pipeline
    const stage = pipelines[pipelineName].find(s => s.id === stageId);
    if (stage) stage.cards.push(card);

    // Generate AI Detail View
    const lastMsg = chat.messages[chat.messages.length - 1].text;
    GENERATED_PROGRESSION_DATA[card.id] = {
        id: card.id,
        address: property.address,
        price: property.price,
        targetExchangeDate: 'TBD',
        progress: 50,
        aiSummary: `Deal context based on recent chat: "${lastMsg}". User is ${chat.lead.status}. Action required by agent to move to next stage.`,
        suggestedActions: [
            { id: 'a1', title: 'Reply to Message', description: 'User is waiting for response', type: 'Task' }
        ],
        nextSteps: [],
        parties: [
            { role: 'Buyer', name: chat.lead.name, email: chat.lead.email, phone: chat.lead.phone, status: 'Active' }
        ],
        milestones: [],
        recentActivity: chat.messages.map(m => ({
            id: m.id,
            text: m.text,
            user: m.sender === 'user' ? chat.lead.name : 'Agent',
            date: m.timestamp,
            type: 'System'
        }))
    };
});

// EXPORT MAP
export const ALL_PIPELINES = pipelines;

if (typeof window !== 'undefined' && !localStorage.getItem('all_pipelines')) {
  try {
    localStorage.setItem('all_pipelines', JSON.stringify(pipelines));
    console.log('✅ Initialized pipeline data in localStorage');
  } catch (e) {
    console.error('Failed to initialize pipeline data in localStorage:', e);
  }
}
