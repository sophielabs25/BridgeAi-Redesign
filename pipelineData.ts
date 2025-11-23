import { PipelineStage, PipelineCard, ProgressionData, ChatCategory, InboxConversation, Property } from './types';
import { MOCK_CHATS_GENERATED } from './chatData';
import { MASTER_PROPERTIES } from './propertiesData';

// Map Chat Status to Pipeline Stages
const STATUS_TO_STAGE_LETTINGS: Record<string, string> = {
  'New': 'stage-l1',
  'Qualifying': 'stage-l2',
  'Warm': 'stage-l3', // Viewing
  'Hot': 'stage-l4', // Offer
  'Closed': 'stage-l7', // Tenanted
  'Nurture': 'stage-l2'
};

const STATUS_TO_STAGE_SALES: Record<string, string> = {
  'New': 'stage-s1',
  'Qualifying': 'stage-s2',
  'Warm': 'stage-s3', // Viewing
  'Hot': 'stage-s4', // Offer / Under Offer
  'Closed': 'stage-s7', // Completion
  'Nurture': 'stage-s2'
};

const LETTINGS_STAGES = [
    { id: 'stage-l1', title: 'Lead Captured', cards: [] },
    { id: 'stage-l2', title: 'Qualifying', cards: [] },
    { id: 'stage-l3', title: 'Viewing Booked', cards: [] },
    { id: 'stage-l4', title: 'Under Offer', cards: [] },
    { id: 'stage-l5', title: 'Referencing', cards: [] },
    { id: 'stage-l6', title: 'Onboarding', cards: [] },
    { id: 'stage-l7', title: 'Tenanted', cards: [] }
];

const SALES_STAGES = [
    { id: 'stage-s1', title: 'Lead Captured', cards: [] },
    { id: 'stage-s2', title: 'Qualifying', cards: [] },
    { id: 'stage-s3', title: 'Viewing Booked', cards: [] },
    { id: 'stage-s4', title: 'Under Offer', cards: [] },
    { id: 'stage-s5', title: 'Conveyancing', cards: [] },
    { id: 'stage-s6', title: 'Exchange', cards: [] },
    { id: 'stage-s7', title: 'Completion', cards: [] }
];

// GENERATE DYNAMIC PIPELINE AND PROGRESSION DATA
export const GENERATED_LETTINGS_PIPELINE: PipelineStage[] = JSON.parse(JSON.stringify(LETTINGS_STAGES));
export const GENERATED_SALES_PIPELINE: PipelineStage[] = JSON.parse(JSON.stringify(SALES_STAGES));
export const GENERATED_PROGRESSION_DATA: Record<string, ProgressionData> = {};

MOCK_CHATS_GENERATED.forEach((chat) => {
    // Only process chats with linked properties for the pipeline
    if (chat.lead.properties.length === 0) return;

    const property = MASTER_PROPERTIES.find(p => p.id === chat.lead.properties[0].id);
    if (!property) return;

    const isLettings = property.type === 'Lettings';
    const targetStageId = isLettings 
        ? STATUS_TO_STAGE_LETTINGS[chat.lead.status] || 'stage-l1'
        : STATUS_TO_STAGE_SALES[chat.lead.status] || 'stage-s1';

    // Create Pipeline Card
    const cardId = `pipe-${chat.id}`;
    const card: PipelineCard = {
        id: cardId,
        title: property.address.split(',')[0],
        subtitle: property.price,
        leadName: chat.lead.name,
        source: chat.source,
        value: property.price,
        date: chat.lastActivity,
        triggerFlow: 'Auto-Response',
        tags: [chat.lead.status],
        assignedTo: property.agent
    };

    // Add to appropriate pipeline
    if (isLettings) {
        const stage = GENERATED_LETTINGS_PIPELINE.find(s => s.id === targetStageId);
        if (stage) stage.cards.push(card);
    } else {
        const stage = GENERATED_SALES_PIPELINE.find(s => s.id === targetStageId);
        if (stage) stage.cards.push(card);
    }

    // Generate Mock Progression Data for this card
    GENERATED_PROGRESSION_DATA[cardId] = {
        id: cardId,
        address: property.address,
        price: property.price,
        targetExchangeDate: 'TBD',
        progress: chat.lead.status === 'Hot' ? 70 : chat.lead.status === 'Warm' ? 40 : 10,
        aiSummary: `Deal for ${property.address} is currently in ${isLettings ? 'Lettings' : 'Sales'} progression. Lead ${chat.lead.name} is status: ${chat.lead.status}. Latest activity from ${chat.source}.`,
        suggestedActions: [
            { id: 'sa1', title: 'Follow Up', description: 'Check status update', type: 'Call' },
            { id: 'sa2', title: 'Send Docs', description: 'Forward compliance documents', type: 'Task' }
        ],
        nextSteps: [
            { label: 'Review', date: 'Tomorrow' }
        ],
        parties: [
            { role: 'Buyer', name: chat.lead.name, email: chat.lead.email, phone: chat.lead.phone, status: 'Active', avatar: chat.lead.name[0] },
            { role: 'Seller', name: 'Vendor', email: 'vendor@example.com', phone: '07000 000000', status: 'Active', avatar: 'V' }
        ],
        milestones: [
            { id: 'm1', title: 'Inquiry', status: 'Completed', completedDate: chat.lastActivity },
            { id: 'm2', title: 'Viewing', status: chat.lead.status === 'Warm' ? 'In Progress' : 'Pending' }
        ],
        recentActivity: [
            { id: 'ra1', text: `Message: "${chat.messages[0].text}"`, user: chat.lead.name, date: chat.lastActivity, type: 'Email' }
        ]
    };
});
