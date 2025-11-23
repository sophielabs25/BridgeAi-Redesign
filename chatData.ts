
import { InboxConversation, ChatCategory, LeadSource, Message } from './types';
import { MASTER_PROPERTIES } from './propertiesData';

// Helper to get a property image/details
const getProp = (index: number) => {
    const p = MASTER_PROPERTIES[index % MASTER_PROPERTIES.length];
    return {
        id: p.id,
        address: p.address,
        price: p.price,
        bedrooms: p.bedrooms,
        image: p.image,
        status: 'Enquired' as const
    };
};

// --- REALISTIC CONVERSATION GENERATOR ---

const createChat = (
    id: string,
    category: ChatCategory,
    name: string,
    status: 'New' | 'Qualifying' | 'Hot' | 'Warm' | 'Nurture' | 'Closed',
    source: LeadSource,
    subject: string, // Used for pipeline title
    messages: { sender: 'user' | 'agent' | 'ai' | 'system', text: string, time: string }[],
    propertyIndex?: number
): InboxConversation => {
    
    const leadProps = propertyIndex !== undefined ? [getProp(propertyIndex)] : [];

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
            budget: leadProps[0]?.price || 'N/A',
            properties: leadProps
        },
        messages: messages.map((m, i) => ({ id: `m-${id}-${i}`, ...m, timestamp: m.time })),
        unreadCount: messages[messages.length - 1].sender === 'user' ? 1 : 0,
        lastActivity: messages[messages.length - 1].time,
        tags: [category, status]
    };
};

export const MOCK_CHATS_GENERATED: InboxConversation[] = [
    // ========================================================================
    // 1. SALES (Offers, Viewings, Chains)
    // ========================================================================
    createChat('s1', ChatCategory.SALES, 'James Sterling', 'Hot', 'Rightmove', 'Offer on Romiley', [
        { sender: 'user', text: 'Hi, we viewed 15 Sandybrook Close yesterday with David.', time: 'Yesterday 09:00 AM' },
        { sender: 'agent', text: 'Hi James, glad you could make it. What did you think of the property?', time: 'Yesterday 09:15 AM' },
        { sender: 'user', text: 'We loved it. We would like to put in an offer of £565,000.', time: 'Yesterday 10:30 AM' },
        { sender: 'ai', text: 'Thank you James. I have logged your offer of £565,000. Are you in a chain?', time: 'Yesterday 10:31 AM' },
        { sender: 'user', text: 'No chain, we are cash buyers.', time: 'Yesterday 10:35 AM' }
    ], 7), // Linked to Prop 7 (Romiley)

    createChat('s2', ChatCategory.SALES, 'Sarah Jenkins', 'Qualifying', 'Zoopla', 'Viewing Inquiry', [
        { sender: 'user', text: 'Is the 3-bed on The Avenue still available?', time: '2 days ago' },
        { sender: 'ai', text: 'Yes Sarah, it is currently on the market. Would you like to book a viewing?', time: '2 days ago' },
        { sender: 'user', text: 'Yes please, do you have anything this Saturday?', time: 'Today 09:00 AM' }
    ], 6), // Linked to Prop 6 (Balham)

    createChat('s3', ChatCategory.SALES, 'Michael Chang', 'Warm', 'Website', 'Second Viewing', [
        { sender: 'user', text: 'Hi, can we arrange a second viewing for the Shard apartment? My wife wants to see the kitchen lighting.', time: 'Today 11:00 AM' },
        { sender: 'agent', text: 'Of course Michael. I can do tomorrow at 12?', time: 'Today 11:15 AM' }
    ], 0), // Linked to Prop 0 (Shard)

    createChat('s4', ChatCategory.SALES, 'Eleanor Rigby', 'Nurture', 'Email', 'Market Update', [
        { sender: 'user', text: 'Just checking if the price has dropped on Church Lane yet?', time: '3 days ago' },
        { sender: 'agent', text: 'Hi Eleanor, not yet, but the vendor is open to sensible offers.', time: '3 days ago' },
        { sender: 'user', text: 'Okay, let me know if it dips below £325k.', time: 'Yesterday' }
    ], 8),

    createChat('s5', ChatCategory.SALES, 'Dr. Strange', 'Closed', 'Phone', 'Completion', [
        { sender: 'user', text: 'Have the funds cleared?', time: '1 week ago' },
        { sender: 'agent', text: 'Yes, completion has taken place. You can collect keys!', time: '1 week ago' }
    ], 9),

    // ========================================================================
    // 2. LETTINGS (Deposits, Pets, Move-in)
    // ========================================================================
    createChat('l1', ChatCategory.LETTINGS, 'Alice Wonderland', 'New', 'Rightmove', 'Pet Enquiry', [
        { sender: 'user', text: 'Hi, I saw the flat in Camden. Is it pet friendly? I have a small pug.', time: '10:00 AM' },
        { sender: 'ai', text: 'Hi Alice. The landlord usually accepts pets with a slightly higher deposit. Shall I register your interest?', time: '10:01 AM' }
    ], 1), // Camden

    createChat('l2', ChatCategory.LETTINGS, 'Bob Builder', 'Qualifying', 'Phone', 'Move in Date', [
        { sender: 'user', text: 'Ideally need to move by the 1st of next month.', time: 'Yesterday' },
        { sender: 'agent', text: 'That might be tight for referencing, Bob. Can you do the 5th?', time: 'Today 09:30 AM' },
        { sender: 'user', text: 'I can make the 5th work if we sign today.', time: 'Today 09:45 AM' }
    ], 2), // Brixton

    createChat('l3', ChatCategory.LETTINGS, 'Charlie Bucket', 'Hot', 'Website', 'Holding Deposit', [
        { sender: 'user', text: 'Paid the holding deposit for the Penthouse.', time: '2 hours ago' },
        { sender: 'system', text: 'Payment of £500 received.', time: '2 hours ago' },
        { sender: 'agent', text: 'Thanks Charlie, I have taken it off the market.', time: '1 hour ago' }
    ], 3), // Penthouse

    createChat('l4', ChatCategory.LETTINGS, 'Dora Explorer', 'Closed', 'Email', 'Key Collection', [
        { sender: 'user', text: 'What time does the office close? I am coming for keys.', time: 'Yesterday' }
    ], 4),

    // ========================================================================
    // 3. VALUATIONS (Market Appraisals)
    // ========================================================================
    createChat('v1', ChatCategory.VALUATIONS, 'Rupert Giles', 'New', 'Website', 'Valuation Request', [
        { sender: 'user', text: 'Thinking of selling my 3-bed semi in Marple. Do you do free valuations?', time: '08:00 AM' },
        { sender: 'ai', text: 'Good morning Rupert. Yes, we offer free market appraisals. When would be a good time for an agent to visit?', time: '08:01 AM' },
        { sender: 'user', text: 'Thursday afternoon please.', time: '08:15 AM' }
    ], undefined),

    createChat('v2', ChatCategory.VALUATIONS, 'Tony Soprano', 'Hot', 'Phone', 'Instruction', [
        { sender: 'agent', text: 'Hi Tony, based on the comps, we suggest listing at £850k.', time: 'Yesterday' },
        { sender: 'user', text: 'Go ahead. Send over the contract.', time: 'Today 10:00 AM' }
    ], 10),

    createChat('v3', ChatCategory.VALUATIONS, 'Walter White', 'Nurture', 'Email', 'Price Update', [
        { sender: 'user', text: 'Not ready to sell yet, maybe next spring.', time: 'Last Week' },
        { sender: 'agent', text: 'Understood Walter. I will keep you updated on local sales prices in the meantime.', time: 'Last Week' }
    ], undefined),

    // ========================================================================
    // 4. MAINTENANCE (Leaks, Heating, Electrical)
    // ========================================================================
    createChat('m1', ChatCategory.MAINTENANCE, 'Tenant: John Wick', 'Hot', 'Whatsapp', 'Urgent Leak', [
        { sender: 'user', text: 'URGENT: Water pouring through the ceiling in the kitchen!', time: '10 mins ago' },
        { sender: 'ai', text: 'I have flagged this as an EMERGENCY. Are you able to turn off the stopcock?', time: '9 mins ago' },
        { sender: 'user', text: 'Yes, done. But it is a mess.', time: '8 mins ago' },
        { sender: 'agent', text: 'John, I have an emergency plumber (Pimlico Plumbers) on their way. ETA 45 mins.', time: '2 mins ago' }
    ], 1), // Shard

    createChat('m2', ChatCategory.MAINTENANCE, 'Landlord: Bruce Wayne', 'Qualifying', 'Email', 'Boiler Quote', [
        { sender: 'system', text: 'Quote received from Gotham Heating: £1,200 + VAT for new boiler.', time: 'Yesterday' },
        { sender: 'agent', text: 'Bruce, the old boiler is condemned. Do you approve the replacement quote?', time: 'Yesterday' },
        { sender: 'user', text: 'That seems expensive. Can we get a second opinion?', time: 'Today 09:00 AM' }
    ], 2),

    createChat('m3', ChatCategory.MAINTENANCE, 'Tenant: Peter Parker', 'New', 'Website', 'Window Handle', [
        { sender: 'user', text: 'The handle on the bedroom window is loose.', time: '2 hours ago' },
        { sender: 'ai', text: 'Thanks Peter. Could you upload a photo of the handle so we can send the right contractor?', time: '2 hours ago' },
        { sender: 'user', text: '[Image Uploaded]', time: '1 hour ago' }
    ], 10),

    // ========================================================================
    // 5. COMPLIANCE (GSC, EICR, EPC)
    // ========================================================================
    createChat('c1', ChatCategory.COMPLIANCE, 'Landlord: Clark Kent', 'Hot', 'System', 'GSC Expiring', [
        { sender: 'system', text: 'ALERT: Gas Safety Certificate for 5 Garden Row expires in 7 days.', time: 'Yesterday' },
        { sender: 'agent', text: 'Clark, shall I book the engineer for this week?', time: 'Yesterday' },
        { sender: 'user', text: 'Yes please, go ahead.', time: 'Today 11:00 AM' }
    ], 2),

    createChat('c2', ChatCategory.COMPLIANCE, 'Landlord: Diana Prince', 'Qualifying', 'Email', 'EICR Failure', [
        { sender: 'agent', text: 'Hi Diana, the EICR came back "Unsatisfactory". Remedial work quoted at £450.', time: '2 days ago' },
        { sender: 'user', text: 'Is this mandatory?', time: 'Yesterday' },
        { sender: 'agent', text: 'Yes, it is a legal requirement for the tenancy.', time: 'Today 08:30 AM' }
    ], 4),

    // ========================================================================
    // 6. INSPECTIONS (Check-in, Check-out, Mid-term)
    // ========================================================================
    createChat('i1', ChatCategory.INSPECTIONS, 'Clerk: Sherlock Holmes', 'Closed', 'System', 'Check-In Report', [
        { sender: 'system', text: 'Check-In Report generated for 14 High St.', time: 'Yesterday' },
        { sender: 'agent', text: 'Sherlock noted a scuff on the hallway wall. Added to report.', time: 'Yesterday' }
    ], 1),

    createChat('i2', ChatCategory.INSPECTIONS, 'Tenant: Harry Potter', 'Qualifying', 'Email', 'Dispute', [
        { sender: 'user', text: 'I do not agree with the deduction for the carpet cleaning. It was like that when I moved in.', time: 'Today 10:00 AM' },
        { sender: 'agent', text: 'Hi Harry, checking the inventory photos from 2023. Bear with me.', time: 'Today 10:15 AM' }
    ], 5),

    // ========================================================================
    // 7. MARKETING (Brochures, Photos)
    // ========================================================================
    createChat('mk1', ChatCategory.MARKETING, 'Vendor: Han Solo', 'Hot', 'Whatsapp', 'Photo Approval', [
        { sender: 'agent', text: 'Hi Han, the photos are ready. Here is the link. Happy to go live?', time: '1 hour ago' },
        { sender: 'user', text: 'They look great. But can we remove the photo of the garage? It looks cluttered.', time: '10 mins ago' }
    ], 11),

    // ========================================================================
    // 8. GENERAL (Recruitment, Invoices)
    // ========================================================================
    createChat('g1', ChatCategory.GENERAL, 'Candidate: Frodo Baggins', 'New', 'Website', 'Job Application', [
        { sender: 'user', text: 'Hi, I applied for the Junior Negotiator role. Any updates?', time: 'Yesterday' },
        { sender: 'agent', text: 'Hi Frodo, we are reviewing CVs this week. Will be in touch.', time: 'Yesterday' }
    ], undefined)
];
