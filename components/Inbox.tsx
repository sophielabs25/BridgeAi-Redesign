
import React, { useState, useEffect } from 'react';
import { InboxConversation, LeadSource, ChatCategory } from '../types';
import { MOCK_INBOX_CONVERSATIONS, CHAT_CATEGORIES } from '../constants';
import { Search, Filter, Phone, Mail, MessageCircle, Home, Globe, Send, Bot, MoreHorizontal, CheckCircle, BedDouble, X, Smartphone, MessageSquare, UserPlus, Flag, AlertCircle, Check, TrendingUp, Award, ShieldCheck, Wrench, ClipboardCheck, Megaphone, Inbox as InboxIcon } from 'lucide-react';

// --- Brand Icons (Simulated Logos) ---

const RightmoveLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#26D07C"/>
    <path d="M12 4L4 10V20H9V14H15V20H20V10L12 4Z" fill="white"/>
    <path d="M17 10L12 6.5L7 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ZooplaLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#44135F"/>
    <text x="50%" y="50%" dy=".35em" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="sans-serif">Z</text>
    <path d="M16 6L18 8L16 10" stroke="#FDC840" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WhatsAppLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#25D366"/>
    <path d="M17.5 14.85C17.25 14.75 16.1 14.2 15.9 14.1C15.7 14.05 15.55 14 15.4 14.25C15.25 14.5 14.8 15 14.65 15.15C14.5 15.3 14.35 15.35 14.1 15.2C13.85 15.1 13.05 14.85 12.1 14C11.35 13.35 10.85 12.55 10.7 12.3C10.55 12.05 10.7 11.9 10.8 11.8C10.9 11.7 11.05 11.55 11.15 11.4C11.25 11.25 11.3 11.15 11.4 10.95C11.5 10.75 11.45 10.6 11.4 10.45C11.35 10.3 10.9 9.2 10.7 8.75C10.5 8.3 10.3 8.35 10.15 8.35H9.7C9.55 8.35 9.3 8.4 9.1 8.65C8.9 8.9 8.3 9.45 8.3 10.55C8.3 11.65 9.1 12.75 9.2 12.9C9.3 13.05 10.8 15.35 13.1 16.35C14.65 17 15.45 16.85 16.1 16.75C16.85 16.65 18 16 18.25 15.35C18.5 14.7 18.5 14.15 18.4 14C18.35 13.9 18.15 13.8 17.9 13.7L17.5 14.85Z" fill="white"/>
  </svg>
);

const AltoLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#0F172A"/>
    <path d="M12 6L6 18H10L12 14L14 18H18L12 6Z" fill="white"/>
    <path d="M9.5 15H14.5" stroke="white" strokeWidth="1.5"/>
  </svg>
);

const ReapitLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#EA580C"/>
    <path d="M7 7H14C16.2 7 18 8.8 18 11C18 13.2 16.2 15 14 15H9V18H7V7Z" fill="white"/>
    <circle cx="14" cy="11" r="2" fill="#EA580C"/>
  </svg>
);

const ApexLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="apexGrad" x1="0" y1="0" x2="24" y2="24">
        <stop offset="0%" stopColor="#06b6d4"/>
        <stop offset="100%" stopColor="#3b82f6"/>
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="4" fill="url(#apexGrad)"/>
    <path d="M12 6L4 18H20L12 6Z" fill="white" opacity="0.9"/>
    <path d="M12 10L8 16H16L12 10Z" fill="#06b6d4"/>
  </svg>
);

interface FilterState {
  source: string[];
  channel: string[];
  crm: string[];
}

// Reusable Checkbox Item Component - Defined outside to maintain stability
interface FilterCheckboxItemProps {
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

const FilterCheckboxItem: React.FC<FilterCheckboxItemProps> = ({ 
  label, 
  icon, 
  isSelected, 
  onClick 
}) => (
  <div 
    onClick={onClick}
    className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group"
  >
    <div className={`
      w-4 h-4 rounded border flex items-center justify-center transition-all
      ${isSelected ? 'bg-cyan-600 border-cyan-600' : 'bg-white border-slate-300 group-hover:border-cyan-400'}
    `}>
      {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
    </div>
    <div className="flex items-center gap-2 opacity-90 group-hover:opacity-100">
      {icon}
      <span className={`text-xs font-medium ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>{label}</span>
    </div>
  </div>
);

const Inbox: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ChatCategory>(ChatCategory.LETTINGS);
  const [conversations, setConversations] = useState<InboxConversation[]>(() => {
    // Load conversations from localStorage on initial mount
    try {
      const saved = localStorage.getItem('inbox_conversations');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load conversations from localStorage:', e);
    }
    return MOCK_INBOX_CONVERSATIONS;
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  // Multi-selection filter state
  const [filters, setFilters] = useState<FilterState>({
    source: [],
    channel: [],
    crm: []
  });

  const activeFilterCount = filters.source.length + filters.channel.length + filters.crm.length;

  // Send message and get AI response
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedId) return;

    const messageText = messageInput.trim();
    const currentSelectedId = selectedId;
    setMessageInput('');

    // Add agent message to conversation
    const agentMessage = {
      id: `msg-${Date.now()}`,
      sender: 'agent' as const,
      text: messageText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    // Update conversations with agent message
    setConversations(prevConversations => {
      const updated = prevConversations.map(conv =>
        conv.id === currentSelectedId
          ? { ...conv, messages: [...conv.messages, agentMessage] }
          : conv
      );
      
      // Store in localStorage for persistence
      try {
        localStorage.setItem('inbox_conversations', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save conversations to localStorage:', e);
      }
      
      return updated;
    });

    // Get AI response
    setIsAiTyping(true);
    try {
      const selectedConv = conversations.find(c => c.id === currentSelectedId);
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...(selectedConv?.messages || []), agentMessage],
          leadContext: selectedConv?.lead
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add AI response to conversation
      const aiMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai' as const,
        text: data.response,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      setConversations(prevConversations => {
        const updated = prevConversations.map(conv =>
          conv.id === currentSelectedId
            ? { ...conv, messages: [...conv.messages, aiMessage] }
            : conv
        );
        
        // Store in localStorage for persistence
        try {
          localStorage.setItem('inbox_conversations', JSON.stringify(updated));
        } catch (e) {
          console.error('Failed to save conversations to localStorage:', e);
        }
        
        return updated;
      });
    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      // Add error message
      const errorMessage = {
        id: `msg-${Date.now()}-error`,
        sender: 'system' as const,
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === currentSelectedId
            ? { ...conv, messages: [...conv.messages, errorMessage] }
            : conv
        )
      );
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Filter Logic: Category first, then Filters
  const categoryConversations = conversations.filter(c => c.category === activeCategory);
  
  const filteredConversations = categoryConversations.filter(conv => {
    const channel = conv.source === 'Whatsapp' ? 'Whatsapp' : conv.source === 'Phone' ? 'Phone' : conv.source === 'Email' ? 'Email' : 'Portal';
    
    const matchSource = filters.source.length === 0 || filters.source.includes(conv.source);
    const matchChannel = filters.channel.length === 0 || filters.channel.includes(channel);
    const matchCrm = filters.crm.length === 0 || filters.crm.includes(conv.crm);

    return matchSource && matchChannel && matchCrm;
  });

  // Select first conversation if none selected, or if current selection is not in filtered list
  const selectedConversation = selectedId 
      ? conversations.find(c => c.id === selectedId)
      : filteredConversations.length > 0 ? filteredConversations[0] : null;

  // --- Helper Functions for Icons ---

  const getSourceLogo = (source: string, className: string = "w-4 h-4") => {
    switch (source) {
      case 'Rightmove': return <RightmoveLogo className={className} />;
      case 'Zoopla': return <ZooplaLogo className={className} />;
      case 'Website': return <div className={`${className} bg-blue-600 rounded flex items-center justify-center text-white`}><Globe className="w-3 h-3" /></div>;
      case 'Email': return <div className={`${className} bg-amber-500 rounded flex items-center justify-center text-white`}><Mail className="w-3 h-3" /></div>;
      case 'Whatsapp': return <WhatsAppLogo className={className} />;
      case 'Phone': return <div className={`${className} bg-slate-700 rounded flex items-center justify-center text-white`}><Phone className="w-3 h-3" /></div>;
      default: return <div className={`${className} bg-slate-400 rounded flex items-center justify-center text-white`}><MessageCircle className="w-3 h-3" /></div>;
    }
  };

  const getCrmLogo = (crm: string, className: string = "w-4 h-4") => {
    switch (crm) {
      case 'Alto': return <AltoLogo className={className} />;
      case 'Reapit': return <ReapitLogo className={className} />;
      case 'Apex27': return <ApexLogo className={className} />;
      default: return <div className={`${className} bg-slate-200 rounded flex items-center justify-center text-xs font-bold text-slate-600`}>?</div>;
    }
  };

  const getChannelIcon = (source: string, className: string = "w-4 h-4") => {
    const iconSize = className.includes('w-6') ? "w-3.5 h-3.5" : "w-2.5 h-2.5";

    if (source === 'Whatsapp') return <WhatsAppLogo className={className} />;
    if (source === 'Email') return <div className={`${className} bg-amber-100 text-amber-600 rounded-full flex items-center justify-center`}><Mail className={iconSize} /></div>;
    if (source === 'Phone') return <div className={`${className} bg-slate-100 text-slate-600 rounded-full flex items-center justify-center`}><Smartphone className={iconSize} /></div>;
    
    return <div className={`${className} bg-blue-50 text-blue-600 rounded-full flex items-center justify-center`}><MessageCircle className={iconSize} /></div>;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hot': return 'bg-gradient-to-r from-rose-50 to-rose-100 text-rose-700 border-rose-200 shadow-sm shadow-rose-100/50';
      case 'Qualifying': return 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-200 shadow-sm shadow-amber-100/50';
      case 'New': return 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 border-cyan-200 shadow-sm shadow-cyan-100/50';
      case 'Closed': return 'bg-slate-50 text-slate-500 border-slate-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getPriority = (status: string) => {
    if (status === 'Hot') return 'High';
    if (status === 'Qualifying') return 'Medium';
    return 'Low';
  };

  const getEnquiryStage = (tags: string[]) => {
    if (tags.includes('Valuation')) return 'Valuation';
    if (tags.includes('Sales')) return 'Sales';
    if (tags.includes('Maintenance')) return 'Maintenance';
    return 'Lettings'; // Default
  };

  const toggleFilter = (category: keyof FilterState, value: string) => {
     setFilters(prev => {
       const current = prev[category];
       const updated = current.includes(value) 
         ? current.filter(item => item !== value) 
         : [...current, value];
       return { ...prev, [category]: updated };
     });
  };

  const clearFilters = () => {
      setFilters({ source: [], channel: [], crm: [] });
      setShowFilters(false);
  };

  const getCategoryIcon = (iconName: string) => {
      switch(iconName) {
          case 'Home': return <Home className="w-4 h-4" />;
          case 'TrendingUp': return <TrendingUp className="w-4 h-4" />;
          case 'Award': return <Award className="w-4 h-4" />;
          case 'ShieldCheck': return <ShieldCheck className="w-4 h-4" />;
          case 'Tool': return <Wrench className="w-4 h-4" />;
          case 'ClipboardCheck': return <ClipboardCheck className="w-4 h-4" />;
          case 'Megaphone': return <Megaphone className="w-4 h-4" />;
          default: return <InboxIcon className="w-4 h-4" />;
      }
  };

  return (
    <div className="flex h-full bg-white w-full overflow-hidden">
      
      {/* PANE 0: Sidebar Categories */}
      <div className="w-60 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Inbox Categories</h2>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {CHAT_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
                        ${activeCategory === cat.id 
                            ? 'bg-white text-cyan-700 shadow-sm ring-1 ring-slate-200' 
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}
                    `}
                  >
                      <div className={`p-1.5 rounded-md ${activeCategory === cat.id ? 'bg-cyan-50 text-cyan-600' : 'bg-transparent text-slate-400 group-hover:bg-slate-200'}`}>
                          {getCategoryIcon(cat.icon)}
                      </div>
                      <span>{cat.label}</span>
                      {activeCategory === cat.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-500"></div>}
                  </button>
              ))}
          </div>
      </div>

      {/* PANE 1: Conversation List */}
      <div className="w-[320px] flex flex-col border-r border-slate-200 bg-white relative z-20">
        {/* Header */}
        <div className="p-4 bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-20">
           <div className="flex items-center justify-between mb-3">
             <h2 className="text-lg font-bold text-slate-900 tracking-tight">{activeCategory}</h2>
             <div className="relative">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium
                    ${showFilters || activeFilterCount > 0 ? 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}
                  `}
                >
                  <Filter className="w-3.5 h-3.5" />
                  {activeFilterCount > 0 && <span className="bg-cyan-600 text-white text-[9px] px-1.5 rounded-full font-bold">{activeFilterCount}</span>}
                </button>

                {/* Filter Dropdown */}
                {showFilters && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 p-4 z-30 animate-in slide-in-from-top-2 fade-in duration-200 ring-1 ring-slate-900/5 overflow-y-auto max-h-[80vh] custom-scrollbar origin-top-right">
                     <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-2">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Filters</h4>
                        {activeFilterCount > 0 && (
                            <button 
                                onClick={clearFilters} 
                                className="text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors"
                            >
                                RESET
                            </button>
                        )}
                     </div>
                     
                     <div className="space-y-5">
                        {/* Source Section */}
                        <div>
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block px-2">Source</label>
                           <div className="space-y-0.5">
                              {['Rightmove', 'Zoopla', 'Website'].map(src => (
                                 <FilterCheckboxItem
                                    key={src}
                                    label={src}
                                    icon={getSourceLogo(src, "w-4 h-4")}
                                    isSelected={filters.source.includes(src)}
                                    onClick={() => toggleFilter('source', src)}
                                 />
                              ))}
                           </div>
                        </div>

                        {/* Channel Section */}
                        <div>
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block px-2">Channel</label>
                           <div className="space-y-0.5">
                              {['Whatsapp', 'Email', 'Phone'].map(ch => (
                                 <FilterCheckboxItem
                                    key={ch}
                                    label={ch}
                                    icon={getChannelIcon(ch, "w-4 h-4")}
                                    isSelected={filters.channel.includes(ch)}
                                    onClick={() => toggleFilter('channel', ch)}
                                 />
                              ))}
                           </div>
                        </div>

                        {/* CRM Section */}
                        <div>
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block px-2">CRM</label>
                           <div className="space-y-0.5">
                              {['Alto', 'Reapit', 'Apex27'].map(crm => (
                                 <FilterCheckboxItem
                                    key={crm}
                                    label={crm}
                                    icon={getCrmLogo(crm, "w-4 h-4")}
                                    isSelected={filters.crm.includes(crm)}
                                    onClick={() => toggleFilter('crm', crm)}
                                 />
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
                )}
             </div>
           </div>

           <div className="relative group">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
             <input 
                type="text" 
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all shadow-sm"
             />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1.5 bg-slate-50/30">
          {filteredConversations.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-xs">
               <Filter className="w-8 h-8 mb-2 opacity-20" />
               No conversations found
             </div>
          ) : (
             filteredConversations.map(conv => {
               const isActive = selectedConversation?.id === conv.id;
               const primaryProp = conv.lead.properties[0];
               const channel = conv.source === 'Whatsapp' ? 'Whatsapp' : conv.source === 'Phone' ? 'Phone' : conv.source === 'Email' ? 'Email' : 'Portal';
               const priority = getPriority(conv.lead.status);

               return (
                  <div 
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border relative group
                      ${isActive 
                        ? 'bg-white border-cyan-500/30 shadow-md shadow-cyan-500/5 z-10 ring-1 ring-cyan-500/10' 
                        : 'bg-white border-transparent hover:border-slate-200 hover:shadow-sm'
                      }
                    `}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                       <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${conv.unreadCount > 0 ? 'bg-cyan-500' : 'bg-slate-300'}`}></div>
                         <span className={`font-bold text-xs ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>{conv.lead.name}</span>
                         <div className="opacity-60">{getChannelIcon(channel, "w-3 h-3")}</div>
                       </div>
                       <span className="text-[10px] text-slate-400 font-medium">{conv.lastActivity}</span>
                    </div>
                    
                    <div className="pl-3.5">
                      <div className="flex items-center gap-1.5 mb-1">
                         <span className="text-[11px] font-medium text-slate-600 truncate max-w-[180px]">
                            {primaryProp ? primaryProp.address.split(',')[0] : 'General Enquiry'}
                         </span>
                         {conv.lead.properties.length > 1 && (
                             <span className="text-[9px] bg-slate-100 text-slate-500 px-1 rounded-full font-bold">+{conv.lead.properties.length - 1}</span>
                         )}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 leading-relaxed mb-2.5">{conv.messages[conv.messages.length - 1].text}</p>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                         <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${getStatusColor(conv.lead.status)}`}>
                                {conv.lead.status}
                            </span>
                         </div>
                         
                         <div className="flex items-center gap-2">
                            {priority === 'High' && <Flag className="w-3 h-3 text-rose-500 fill-rose-500" />}
                            
                            <button 
                                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-cyan-600 transition-colors"
                                title="Assign User"
                                onClick={(e) => { e.stopPropagation(); alert(`Assign agent to ${conv.lead.name}`); }}
                            >
                                <UserPlus className="w-3.5 h-3.5" />
                            </button>
                         </div>
                      </div>
                    </div>
                  </div>
               );
             })
          )}
        </div>
      </div>

      {/* PANE 2: Chat Interface */}
      <div className="flex-1 flex flex-col bg-[#f8fafc] relative min-w-[400px]">
        {/* Chat Header */}
        {selectedConversation ? (
          <>
            <div className="h-18 px-6 py-4 bg-white/80 backdrop-blur border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center gap-4">
                 <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-50 to-blue-100 flex items-center justify-center text-cyan-700 font-bold shadow-inner">
                      {selectedConversation.lead.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${selectedConversation.unreadCount > 0 ? 'bg-cyan-500' : 'bg-green-500'}`}></div>
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                       {selectedConversation.lead.name}
                       {selectedConversation.lead.status === 'Hot' && <span className="text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full">HOT</span>}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                       <span>{selectedConversation.lead.email}</span>
                       <span className="text-slate-300">•</span>
                       <span className="px-2 py-0.5 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600">{selectedConversation.category}</span>
                    </div>
                 </div>
              </div>
              
              <div className="flex items-center gap-2">
                 <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-cyan-600 hover:border-cyan-200 transition-colors shadow-sm">
                    <Phone className="w-4 h-4" />
                 </button>
                 <div className="w-px h-6 bg-slate-200 mx-1"></div>
                 <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 transition-colors shadow-sm">
                    <MoreHorizontal className="w-4 h-4" />
                 </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
               <div className="flex justify-center">
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">Today</span>
               </div>
               
               {selectedConversation.messages.map((msg) => {
                 const isMe = msg.sender === 'agent';
                 const isAi = msg.sender === 'ai';
                 const isUser = msg.sender === 'user';
                 const isSystem = msg.sender === 'system';

                 if (isSystem) {
                   return (
                     <div key={msg.id} className="flex justify-center my-4">
                       <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs text-slate-500 shadow-sm">
                         <Bot className="w-3 h-3" />
                         {msg.text}
                       </div>
                     </div>
                   );
                 }

                 return (
                   <div key={msg.id} className={`flex gap-3 ${isUser ? 'justify-start' : 'justify-end'}`}>
                      {isUser && (
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-500 text-xs font-bold">
                           {selectedConversation.lead.name[0]}
                        </div>
                      )}
                      
                      <div className={`flex flex-col max-w-[70%] ${isUser ? 'items-start' : 'items-end'}`}>
                         <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm relative
                           ${isUser ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none' : 
                             isAi ? 'bg-gradient-to-br from-purple-50 to-white border border-purple-100 text-slate-800 rounded-tr-none' : 
                             'bg-cyan-600 text-white rounded-tr-none'}
                         `}>
                           {isAi && (
                             <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                               <Bot className="w-3 h-3" /> AI Assistant
                             </div>
                           )}
                           {msg.text}
                         </div>
                         <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                      </div>

                      {(isMe || isAi) && (
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs shadow-sm
                          ${isAi ? 'bg-purple-600' : 'bg-cyan-600'}
                        `}>
                           {isAi ? <Bot className="w-4 h-4" /> : <Send className="w-3.5 h-3.5" />}
                        </div>
                      )}
                   </div>
                 );
               })}
               
               {/* AI Typing Indicator */}
               {isAiTyping && (
                 <div className="flex gap-3 justify-end">
                   <div className="flex flex-col max-w-[70%] items-end">
                     <div className="px-4 py-3 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-tr-none">
                       <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                         <Bot className="w-3 h-3" /> AI Assistant
                       </div>
                       <div className="flex items-center gap-1">
                         <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                         <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                         <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                       </div>
                     </div>
                   </div>
                   <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white bg-purple-600">
                     <Bot className="w-4 h-4" />
                   </div>
                 </div>
               )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
               <div className="flex flex-col gap-2 relative">
                  <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-cyan-500/20 focus-within:border-cyan-500 transition-all">
                     <textarea 
                       placeholder="Type a message..." 
                       value={messageInput}
                       onChange={(e) => setMessageInput(e.target.value)}
                       onKeyDown={handleKeyDown}
                       className="flex-1 bg-transparent border-none focus:ring-0 text-sm resize-none max-h-32 py-2 px-2 placeholder-slate-400"
                       rows={1}
                       disabled={isAiTyping}
                     />
                     <button 
                       onClick={handleSendMessage}
                       disabled={!messageInput.trim() || isAiTyping}
                       className="p-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors shadow-md shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       <Send className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 opacity-40" />
             </div>
             <p className="font-medium">Select a conversation</p>
          </div>
        )}
      </div>

      {/* PANE 3: Context Hub (Redesigned) */}
      {selectedConversation && (
        <div className="w-[340px] border-l border-slate-200 bg-white flex flex-col overflow-y-auto custom-scrollbar">
          
          {/* Lead Profile Compact */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/30">
             <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-lg font-bold text-slate-700">
                   {selectedConversation.lead.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                   <h3 className="font-bold text-slate-900">{selectedConversation.lead.name}</h3>
                   <p className="text-xs text-slate-500">{selectedConversation.lead.phone}</p>
                   <div className="flex gap-2 mt-2">
                      <button className="p-1.5 bg-white border border-slate-200 rounded text-slate-500 hover:text-cyan-600"><Phone className="w-3 h-3"/></button>
                      <button className="p-1.5 bg-white border border-slate-200 rounded text-slate-500 hover:text-cyan-600"><Mail className="w-3 h-3"/></button>
                      <button className="p-1.5 bg-white border border-slate-200 rounded text-slate-500 hover:text-cyan-600"><MessageCircle className="w-3 h-3"/></button>
                   </div>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                   <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Status</p>
                   <p className="text-xs font-bold text-emerald-600">{selectedConversation.lead.status}</p>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                   <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Budget</p>
                   <p className="text-xs font-bold text-slate-700">{selectedConversation.lead.budget || 'N/A'}</p>
                </div>
             </div>
          </div>

          {/* Properties of Interest (Cards) */}
          <div className="p-6 border-b border-slate-100">
             <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enquired Properties</h4>
                <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold">{selectedConversation.lead.properties.length}</span>
             </div>

             <div className="space-y-3">
                {selectedConversation.lead.properties.map((prop) => {
                  const stage = getEnquiryStage(selectedConversation.tags);
                  return (
                    <div key={prop.id} className="group flex gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-cyan-200 transition-all cursor-pointer">
                       {/* Thumbnail Image */}
                       <div className="w-20 h-20 shrink-0 rounded-lg bg-slate-100 overflow-hidden relative">
                          <img src={prop.image} alt={prop.address} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          {/* Source Icon Overlay */}
                          <div className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow-sm">
                              {getSourceLogo(selectedConversation.source, "w-3 h-3")}
                          </div>
                       </div>
                       
                       {/* Content */}
                       <div className="flex flex-col justify-between flex-1 min-w-0">
                          <div>
                              <div className="flex items-center justify-between mb-1">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Ref: {prop.id.substring(0,6).toUpperCase()}</span>
                                  <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 uppercase tracking-wide scale-90 origin-right">
                                     {stage}
                                  </span>
                              </div>
                              <h5 className="text-xs font-bold text-slate-900 leading-snug mb-1 line-clamp-2" title={prop.address}>
                                  {prop.address}
                              </h5>
                              <p className="text-xs font-bold text-cyan-600">{prop.price}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                              <span className="flex items-center gap-1 text-[10px] text-slate-500">
                                  <BedDouble className="w-3 h-3" /> {prop.bedrooms}
                              </span>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border
                                 ${prop.status === 'Viewing Booked' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                   prop.status === 'Offer Made' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                   'bg-slate-50 text-slate-500 border-slate-100'}
                              `}>
                                 {prop.status}
                              </span>
                          </div>
                       </div>
                    </div>
                  );
                })}

                {selectedConversation.lead.properties.length === 0 && (
                   <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <Home className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">No specific properties linked.</p>
                   </div>
                )}
             </div>
          </div>

          {/* Integrations */}
          <div className="p-6">
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Integrations</h4>
             <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                   <div className="flex items-center gap-2">
                      {getSourceLogo(selectedConversation.source, "w-6 h-6 shadow-sm rounded-md")}
                      <div className="flex flex-col">
                         <span className="text-xs font-bold text-slate-700">{selectedConversation.source}</span>
                         <span className="text-[10px] text-slate-400">Source</span>
                      </div>
                   </div>
                   <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                   <div className="flex items-center gap-2">
                      {getCrmLogo(selectedConversation.crm, "w-6 h-6 shadow-sm rounded-md")}
                      <div className="flex flex-col">
                         <span className="text-xs font-bold text-slate-700">{selectedConversation.crm}</span>
                         <span className="text-[10px] text-slate-400">Synced</span>
                      </div>
                   </div>
                   <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                </div>
             </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Inbox;
