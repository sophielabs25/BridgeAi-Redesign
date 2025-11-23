
import React, { useState } from 'react';
import { PIPELINE_MENU, GENERATED_PIPELINES_MAP, MOCK_PROGRESSION_DATA } from '../constants';
import { ProgressionData, SuggestedAction } from '../types';
import { Search, Filter, Plus, MoreHorizontal, Globe, Phone, Mail, Calendar, Zap, UserCircle, ArrowLeft, CheckCircle, Clock, FileText, Briefcase, Bot, MessageSquare, Sparkles, ChevronDown, Send, AlignLeft, CheckSquare, Smartphone, Link, Home, X } from 'lucide-react';

// --- Brand Icons for Source ---
const RightmoveLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#26D07C"/>
    <path d="M12 4L4 10V20H9V14H15V20H20V10L12 4Z" fill="white"/>
  </svg>
);
const ZooplaLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#44135F"/>
    <text x="50%" y="50%" dy=".35em" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="sans-serif">Z</text>
  </svg>
);

// --- Helper Components ---
const ActionButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
  <button onClick={onClick} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-cyan-600 transition-colors shadow-sm">
    <Icon className="w-3.5 h-3.5" />
    {label}
  </button>
);

const ProgressionDetailView: React.FC<{ data: ProgressionData; onBack: () => void }> = ({ data, onBack }) => {
  const [activeTab, setActiveTab] = useState('Activity');
  const [inputMode, setInputMode] = useState<'Note' | 'Email' | 'SMS'>('Note');
  
  // Task Drawer State
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [taskDraft, setTaskDraft] = useState<{ title: string; type: string } | null>(null);

  const openCreateTask = (action?: SuggestedAction) => {
      setTaskDraft(action ? { title: action.title, type: 'Task' } : { title: '', type: 'Task' });
      setIsTaskDrawerOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] animate-in fade-in slide-in-from-right-4 duration-300 relative">
      
      {/* Task Creation Drawer Overlay */}
      {isTaskDrawerOpen && (
         <div className="absolute inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex justify-end">
             <div className="w-[400px] bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                 {/* Drawer Header */}
                 <div className="h-24 bg-gradient-to-br from-indigo-600 to-purple-700 p-6 flex flex-col justify-center relative">
                     <button onClick={() => setIsTaskDrawerOpen(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
                         <X className="w-5 h-5" />
                     </button>
                     <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
                        <Sparkles className="w-3 h-3" /> Creating your task
                     </div>
                     <h2 className="text-xl font-bold text-white truncate">{taskDraft?.title || 'New Task'}</h2>
                 </div>

                 {/* Drawer Body */}
                 <div className="flex-1 overflow-y-auto p-6 space-y-6">
                     {/* Assignee */}
                     <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-medium text-slate-500 flex items-center gap-2"><UserCircle className="w-4 h-4" /> Assignee</label>
                        <div className="col-span-2 flex items-center gap-2 p-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                            <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">DR</div>
                            <span className="text-sm font-bold text-slate-900">David Rose</span>
                        </div>
                     </div>

                     {/* Task Type */}
                     <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-medium text-slate-500 flex items-center gap-2"><CheckSquare className="w-4 h-4" /> Task type</label>
                        <div className="col-span-2">
                           <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-md border border-purple-100">Follow up</span>
                        </div>
                     </div>

                     {/* Due Date */}
                     <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-medium text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Due date</label>
                        <div className="col-span-2 font-medium text-slate-900 text-sm">25 March, 9:30</div>
                     </div>

                     {/* Defer */}
                     <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-medium text-slate-500 flex items-center gap-2"><Clock className="w-4 h-4" /> Defer until</label>
                        <div className="col-span-2 text-slate-400 text-sm italic">No due date</div>
                     </div>

                     <div className="border-t border-slate-100 my-2"></div>

                     {/* Property Link */}
                     <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-medium text-slate-500 flex items-center gap-2"><Home className="w-4 h-4" /> Property</label>
                        <div className="col-span-2">
                            <a href="#" className="text-sm font-bold text-slate-900 underline decoration-slate-300 underline-offset-4">{data.address.split(',')[0]}</a>
                        </div>
                     </div>

                     {/* Related To */}
                     <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-medium text-slate-500 flex items-center gap-2"><Link className="w-4 h-4" /> Related to</label>
                        <div className="col-span-2">
                            <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">Sale</span>
                        </div>
                     </div>

                     {/* Branch Task */}
                     <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-medium text-slate-500 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Branch task</label>
                        <div className="col-span-2">
                             <div className="w-4 h-4 border border-slate-300 rounded bg-white"></div>
                        </div>
                     </div>
                 </div>

                 {/* Footer */}
                 <div className="p-6 border-t border-slate-100 bg-slate-50">
                     <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                         <UserCircle className="w-4 h-4" />
                         Created by <span className="font-bold text-slate-700">David Rose</span>
                     </div>
                     <button 
                        onClick={() => setIsTaskDrawerOpen(false)}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
                     >
                         Create Task
                     </button>
                 </div>
             </div>
         </div>
      )}

      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft className="w-4 h-4" /></button>
             <div>
                 <h1 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                     Dashboard <span className="text-slate-300">›</span> Properties <span className="text-slate-300">›</span> <span className="text-cyan-700">{data.address}</span>
                 </h1>
             </div>
          </div>
      </div>

      {/* Title Area */}
      <div className="bg-white px-8 pt-6 pb-2">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Sales Progression</h2>
          
          {/* Input Area */}
          <div className="mb-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500/20 focus-within:border-cyan-500 transition-all">
              <div className="flex border-b border-slate-100">
                  <button onClick={() => setInputMode('Note')} className={`px-4 py-2 text-xs font-bold flex items-center gap-2 ${inputMode === 'Note' ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:bg-slate-50'}`}><FileText className="w-3.5 h-3.5"/> Note</button>
                  <button onClick={() => setInputMode('Email')} className={`px-4 py-2 text-xs font-bold flex items-center gap-2 ${inputMode === 'Email' ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:bg-slate-50'}`}><Mail className="w-3.5 h-3.5"/> Email</button>
                  <button onClick={() => setInputMode('SMS')} className={`px-4 py-2 text-xs font-bold flex items-center gap-2 ${inputMode === 'SMS' ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:bg-slate-50'}`}><Smartphone className="w-3.5 h-3.5"/> SMS</button>
                  <div className="ml-auto px-4 py-2">
                      <button className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-slate-800"><Zap className="w-3 h-3" /> Canvas</button>
                  </div>
              </div>
              <div className="p-3">
                  <textarea placeholder={`Click here to add a ${inputMode.toLowerCase()}...`} className="w-full text-sm resize-none outline-none h-12 placeholder:text-slate-400" />
              </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-slate-200">
               {['Activity', 'Notes', 'Messages', 'Calls', 'Emails', 'Events'].map(tab => (
                   <button 
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`pb-3 text-sm font-medium transition-all border-b-2 px-1 ${activeTab === tab ? 'text-slate-900 border-slate-900 font-bold' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
                   >
                       {tab}
                   </button>
               ))}
          </div>
      </div>

      {/* Content Split View */}
      <div className="flex-1 flex overflow-hidden px-6 py-6 gap-6">
          
          {/* Main Column */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar pr-2">
             
             {/* Filter Row */}
             <div className="flex items-center justify-between mb-4">
                 <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 shadow-sm">
                     <AlignLeft className="w-4 h-4" /> Everyone <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-50" />
                 </button>
                 <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                     <input type="checkbox" className="rounded border-slate-300 text-cyan-600" />
                     Hide Automated
                 </label>
             </div>

             {/* Sale Summary Card */}
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                 <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white flex items-center gap-2">
                     <Sparkles className="w-4 h-4 text-purple-600" />
                     <h3 className="font-bold text-slate-900 text-sm">Sale Summary</h3>
                 </div>
                 <div className="p-6">
                     <p className="text-sm text-slate-700 leading-relaxed mb-6">
                         {data.aiSummary}
                     </p>
                     
                     <div className="space-y-3">
                         <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suggested Actions</h4>
                         {data.suggestedActions.map(action => (
                             <div key={action.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-purple-200 transition-colors group">
                                 <div>
                                     <div className="font-bold text-slate-800 text-sm mb-0.5">{action.title}</div>
                                     <div className="text-xs text-slate-500">{action.description}</div>
                                 </div>
                                 <button 
                                    onClick={() => openCreateTask(action)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-200 text-purple-700 rounded-lg text-xs font-bold shadow-sm hover:bg-purple-50 transition-colors opacity-0 group-hover:opacity-100"
                                 >
                                     <Sparkles className="w-3 h-3" /> Create Task
                                 </button>
                             </div>
                         ))}
                         {data.suggestedActions.length === 0 && (
                             <div className="text-center py-4 text-slate-400 text-xs italic">No immediate actions suggested by AI.</div>
                         )}
                     </div>
                 </div>
             </div>

             {/* Timeline / Activity */}
             <div className="space-y-6 pl-4 relative">
                 <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200"></div>
                 
                 {data.recentActivity.map(act => (
                     <div key={act.id} className="relative flex gap-4">
                         <div className={`w-10 h-10 rounded-full border-4 border-[#f8fafc] flex items-center justify-center shadow-sm z-10 shrink-0
                             ${act.type === 'System' ? 'bg-slate-200 text-slate-500' : 
                               act.type === 'Email' ? 'bg-blue-100 text-blue-600' : 
                               'bg-amber-100 text-amber-600'}
                         `}>
                             {act.type === 'System' ? <Bot className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                         </div>
                         <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                             <div className="flex justify-between items-start mb-2">
                                 <span className="font-bold text-slate-900 text-sm">{act.user || 'System'}</span>
                                 <span className="text-xs text-slate-400">{act.date}</span>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">{act.text}</p>
                         </div>
                     </div>
                 ))}
             </div>

          </div>

          {/* Right Sidebar */}
          <div className="w-80 shrink-0 space-y-6">
              {/* Outstanding Tasks Widget */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <button className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-4 w-full">
                      <ChevronDown className="w-4 h-4" /> Outstanding Tasks
                  </button>
                  
                  <div className="flex flex-col items-center justify-center py-4">
                      <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-3 relative">
                          <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
                          <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent rotate-45"></div>
                          <CheckSquare className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="text-center">
                          <div className="font-bold text-slate-900 text-sm">You're all caught up!</div>
                          <div className="text-xs text-slate-500 mt-1">There are no outstanding tasks</div>
                      </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                      <button onClick={() => openCreateTask()} className="flex-1 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1">
                          <Plus className="w-3 h-3" /> Task
                      </button>
                      <button className="flex-1 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1">
                          <Plus className="w-3 h-3" /> Follow Up
                      </button>
                  </div>
              </div>

              {/* Client App Engagement */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <button className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-4 w-full">
                      <ChevronDown className="w-4 h-4" /> Client App Engagement
                  </button>

                  <div className="space-y-4">
                      {data.parties.filter(p => p.role === 'Buyer' || p.role === 'Seller').map(p => (
                          <div key={p.role} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <div className="flex justify-between items-center mb-2">
                                  <div className="text-xs font-bold text-slate-900">{p.role === 'Buyer' ? 'Applicant' : 'Vendor'}</div>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                  <div className="font-medium text-slate-700 text-xs">{p.name}</div>
                                  <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">NOT LOGGED IN</span>
                              </div>
                              <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                      <Smartphone className="w-3 h-3" /> Not logged in
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                      <Globe className="w-3 h-3" /> Not logged in
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-50">
                      <button className="w-full py-2 text-xs font-bold text-slate-500 flex items-center justify-between hover:text-slate-800">
                          Send... <ChevronDown className="w-3 h-3" />
                      </button>
                  </div>
              </div>

              {/* Purchaser Next Steps */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-800 mb-4">Purchaser Next Steps</h4>
                  <div className="space-y-3">
                      {data.nextSteps.map((step, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                              <span className="text-slate-700 font-medium">{step.label}</span>
                              <span className="text-slate-400">{step.date}</span>
                          </div>
                      ))}
                      {data.nextSteps.length === 0 && <div className="text-xs text-slate-400 italic">None pending</div>}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

const Pipeline: React.FC = () => {
  const [activeSubMenu, setActiveSubMenu] = useState('Lettings Progression');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Dynamic pipeline switching based on the map
  const stages = GENERATED_PIPELINES_MAP[activeSubMenu] || [];

  // Mock selection of progression data if available
  const selectedProgression = selectedCardId ? MOCK_PROGRESSION_DATA[selectedCardId] : null;

  const getSourceIcon = (source: string, className: string = "w-4 h-4") => {
    switch (source) {
      case 'Rightmove': return <RightmoveLogo className={className} />;
      case 'Zoopla': return <ZooplaLogo className={className} />;
      case 'Website': return <div className={`${className} bg-blue-600 rounded text-white flex items-center justify-center`}><Globe className="w-2.5 h-2.5" /></div>;
      case 'Phone': return <div className={`${className} bg-slate-700 rounded text-white flex items-center justify-center`}><Phone className="w-2.5 h-2.5" /></div>;
      default: return <div className={`${className} bg-slate-400 rounded text-white flex items-center justify-center`}><Mail className="w-2.5 h-2.5" /></div>;
    }
  };

  // If a specific progression card is selected and we have data for it, show the detail view
  if (selectedProgression) {
      return <ProgressionDetailView data={selectedProgression} onBack={() => setSelectedCardId(null)} />;
  }

  return (
    <div className="flex h-full bg-white w-full overflow-hidden">
      {/* 1. Sidebar for Submenus */}
      <div className="w-64 bg-slate-50/50 border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-6">Pipelines</h2>
          <div className="space-y-1">
            {PIPELINE_MENU.map(item => (
              <button
                key={item}
                onClick={() => setActiveSubMenu(item)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between
                  ${activeSubMenu === item 
                    ? 'bg-white text-cyan-700 shadow-sm ring-1 ring-slate-200' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }
                `}
              >
                {item}
                {activeSubMenu === item && <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Kanban Board Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8fafc]">
        {/* Header / Toolbar */}
        <div className="h-18 px-8 flex items-center justify-between bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold text-slate-900">{activeSubMenu}</h3>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                  {['JD','SM','TS'][i-1]}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-white border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-cyan-400 cursor-pointer">
                <Plus className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-600" />
               <input type="text" placeholder="Search pipeline..." className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-cyan-500/20 w-64" />
             </div>
             <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
               <Filter className="w-4 h-4" /> Filter
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/10">
               <Plus className="w-4 h-4" /> Add Deal
             </button>
          </div>
        </div>

        {/* Kanban Canvas */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 custom-scrollbar">
          <div className="flex h-full gap-6">
            {stages.map((stage) => (
              <div key={stage.id} className="w-[300px] flex flex-col shrink-0 h-full max-h-full">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wide">{stage.title}</h4>
                    <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold">{stage.cards.length}</span>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1 pb-2">
                  {stage.cards.map((card) => (
                    <div 
                      key={card.id} 
                      onClick={() => MOCK_PROGRESSION_DATA[card.id] && setSelectedCardId(card.id)}
                      className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-cyan-200 transition-all cursor-pointer group relative
                          ${MOCK_PROGRESSION_DATA[card.id] ? 'ring-1 ring-transparent hover:ring-cyan-200' : ''}
                      `}
                    >
                      {/* Automation Trigger Badge */}
                      {card.triggerFlow && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                           <Zap className="w-2.5 h-2.5 fill-white" />
                           <span>Auto: {card.triggerFlow}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-slate-400">{card.date}</span>
                        {card.assignedTo ? (
                           <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600" title={`Assigned to ${card.assignedTo}`}>
                              {card.assignedTo}
                           </div>
                        ) : (
                           <div className="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center hover:border-cyan-400 cursor-pointer">
                              <UserCircle className="w-3.5 h-3.5 text-slate-300" />
                           </div>
                        )}
                      </div>

                      <h5 className="font-bold text-slate-900 text-sm mb-0.5">{card.title}</h5>
                      <p className="text-xs text-slate-500 mb-3">{card.subtitle}</p>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                           <UserCircle className="w-3 h-3 text-slate-400" />
                           <span className="text-xs font-medium text-slate-700">{card.leadName}</span>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {card.tags.map(tag => (
                           <span key={tag} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border 
                              ${tag === 'Hot' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                                tag === 'New' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                tag === 'Warm' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                'bg-slate-50 text-slate-500 border-slate-100'}
                           `}>
                              {tag}
                           </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                         <div className="flex items-center gap-1.5">
                            {getSourceIcon(card.source)}
                            <span className="text-[10px] font-medium text-slate-500">{card.source}</span>
                         </div>
                         <span className="text-xs font-bold text-slate-900">{card.value}</span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Drop Zone / Empty State */}
                  {stage.cards.length === 0 && (
                      <div className="h-20 border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center text-slate-300 text-xs font-medium">
                         Empty Stage
                      </div>
                  )}

                  <div className="h-10 border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center text-slate-300 text-xs font-medium hover:bg-slate-50 hover:border-slate-200 transition-colors cursor-pointer opacity-50 hover:opacity-100">
                     <Plus className="w-4 h-4 mr-1" /> Add
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pipeline;
