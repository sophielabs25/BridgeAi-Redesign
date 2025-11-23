
import React, { useState } from 'react';
import { 
  ViewState, 
  WorkflowCategory, 
  ToneType, 
  Template, 
  FlowNode,
  FlowEdge
} from './types';
import { 
  NAVIGATION_ITEMS, 
  INITIAL_NODES, 
  INITIAL_EDGES,
  LEAD_CAPTURE_NODES,
  LEAD_CAPTURE_EDGES,
  LEAD_QUALIFICATION_NODES,
  LEAD_QUALIFICATION_EDGES,
  FEEDBACK_NODES,
  FEEDBACK_EDGES,
  BOOKING_NODES,
  BOOKING_EDGES,
  SUGGESTIONS_NODES,
  SUGGESTIONS_EDGES,
  OFFERS_NODES,
  OFFERS_EDGES,
  REFERENCES_NODES,
  REFERENCES_EDGES,
  NOTIFICATIONS_NODES,
  NOTIFICATIONS_EDGES,
  ONBOARDING_NODES,
  ONBOARDING_EDGES
} from './constants';
import { 
  Layout, 
  MessageSquare, 
  Settings as SettingsIcon, 
  ChevronRight, 
  Bell,
  Search,
  User,
  MoreHorizontal,
  Kanban,
  Building,
  CheckSquare,
  PanelLeftClose,
  Menu
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import FlowBuilder from './components/FlowBuilder';
import TemplateGallery from './components/TemplateGallery';
import TemplatePreview from './components/TemplatePreview';
import Inbox from './components/Inbox';
import Pipeline from './components/Pipeline';
import Properties from './components/Properties';
import Tasks from './components/Tasks';
import AIFlowCreator from './components/AIFlowCreator';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.DASHBOARD);
  const [activeCategory, setActiveCategory] = useState<WorkflowCategory>(WorkflowCategory.LETTINGS_RESIDENTIAL);
  const [aiTone, setAiTone] = useState<ToneType>(ToneType.PROFESSIONAL);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [generatedNodes, setGeneratedNodes] = useState<FlowNode[]>([]);
  const [generatedEdges, setGeneratedEdges] = useState<FlowEdge[]>([]);

  const handleNavClick = (name: string) => {
    if (name === 'Chats') {
      setViewState(ViewState.CHATS);
    } else if (name === 'Automations') {
      setViewState(ViewState.DASHBOARD);
    } else if (name === 'Pipeline') {
      setViewState(ViewState.PIPELINE);
    } else if (name === 'Properties') {
      setViewState(ViewState.PROPERTIES);
    } else if (name === 'Tasks') {
      setViewState(ViewState.TASKS);
    } else if (name === 'Settings') {
       setViewState(ViewState.SETTINGS);
    } else {
      setViewState(ViewState.DASHBOARD);
    }
  };

  const handleWorkflowCategorySelect = (category: WorkflowCategory) => {
    if (category === WorkflowCategory.CREATE_NEW) {
       setViewState(ViewState.AI_FLOW_CREATOR);
       setActiveCategory(WorkflowCategory.CREATE_NEW);
    } else {
       setActiveCategory(category);
       setViewState(ViewState.DASHBOARD);
    }
  };

  const handleFlowGenerated = (nodes: FlowNode[], edges: FlowEdge[]) => {
    setGeneratedNodes(nodes);
    setGeneratedEdges(edges);
    setViewState(ViewState.FLOW_BUILDER);
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setViewState(ViewState.TEMPLATE_PREVIEW);
  };

  const handleTemplateConfirm = () => {
    setViewState(ViewState.FLOW_BUILDER);
  };

  const renderContent = () => {
    switch (viewState) {
      case ViewState.CHATS:
        return <Inbox />;
      
      case ViewState.PIPELINE:
        return <Pipeline />;

      case ViewState.PROPERTIES:
        return <Properties />;

      case ViewState.TASKS:
        return <Tasks />;

      case ViewState.SETTINGS:
        return (
          <div className="p-8 md:p-12 max-w-5xl mx-auto h-full overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h2>
              <p className="text-slate-500 mt-2">Manage your preferences and AI configurations.</p>
            </div>
            
            <div className="glass-panel rounded-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                     <SettingsIcon className="w-5 h-5"/>
                   </div>
                   <div>
                    <h3 className="font-semibold text-xl text-slate-800">AI Personality Engine</h3>
                    <p className="text-sm text-slate-500">Control the tone of voice for your autonomous agents.</p>
                   </div>
                </div>
              </div>
              
              <div className="p-8 bg-slate-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.values(ToneType).map(tone => (
                    <button
                      key={tone}
                      onClick={() => setAiTone(tone)}
                      className={`group relative p-6 rounded-xl border text-left transition-all duration-300
                        ${aiTone === tone 
                          ? 'border-cyan-500 bg-white shadow-lg shadow-cyan-100 ring-1 ring-cyan-500/20' 
                          : 'border-slate-200 bg-white hover:border-cyan-200 hover:shadow-md'
                        }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className={`font-bold text-lg ${aiTone === tone ? 'text-cyan-700' : 'text-slate-700'}`}>{tone}</span>
                        {aiTone === tone && <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500"></div>}
                      </div>
                      <p className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors leading-relaxed">
                        {tone === 'Formal' && 'Strictly professional, precise, and respectful. Ideal for legal and compliance.'}
                        {tone === 'Friendly' && 'Warm, approachable, and conversational. Best for lead nurturing.'}
                        {tone === 'Professional' && 'Balanced, efficient, and polite. The gold standard for support.'}
                        {tone === 'Playful' && 'Casual, enthusiastic, and emoji-friendly. Great for marketing.'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case ViewState.TEMPLATE_GALLERY:
        return (
          <TemplateGallery 
            categoryName={activeCategory}
            onClose={() => setViewState(ViewState.DASHBOARD)}
            onSelect={handleTemplateSelect}
          />
        );

      case ViewState.TEMPLATE_PREVIEW:
        if (!selectedTemplate) return <Dashboard category={activeCategory} onCreateNew={() => setViewState(ViewState.TEMPLATE_GALLERY)} onCategoryChange={handleWorkflowCategorySelect} />;
        return (
          <TemplatePreview
             template={selectedTemplate}
             onCancel={() => setViewState(ViewState.TEMPLATE_GALLERY)}
             onConfirm={handleTemplateConfirm}
          />
        );

      case ViewState.AI_FLOW_CREATOR:
        return (
          <AIFlowCreator
            category={activeCategory}
            onBack={() => setViewState(ViewState.DASHBOARD)}
            onFlowGenerated={handleFlowGenerated}
          />
        );

      case ViewState.FLOW_BUILDER:
        let nodes = INITIAL_NODES;
        let edges = INITIAL_EDGES;

        if (generatedNodes.length > 0) {
          nodes = generatedNodes;
          edges = generatedEdges;
        } else {
          switch (selectedTemplate?.id) {
            case 'lr-1': nodes = LEAD_CAPTURE_NODES; edges = LEAD_CAPTURE_EDGES; break;
            case 'lr-2': nodes = LEAD_QUALIFICATION_NODES; edges = LEAD_QUALIFICATION_EDGES; break;
            case 'lr-3': nodes = FEEDBACK_NODES; edges = FEEDBACK_EDGES; break;
            case 'lr-4': nodes = BOOKING_NODES; edges = BOOKING_EDGES; break;
            case 'lr-5': nodes = SUGGESTIONS_NODES; edges = SUGGESTIONS_EDGES; break;
            case 'lr-6': nodes = OFFERS_NODES; edges = OFFERS_EDGES; break;
            case 'lr-7': nodes = REFERENCES_NODES; edges = REFERENCES_EDGES; break;
            case 'lr-8': nodes = NOTIFICATIONS_NODES; edges = NOTIFICATIONS_EDGES; break;
            case 'lr-9': nodes = ONBOARDING_NODES; edges = ONBOARDING_EDGES; break;
          }
        }

        return (
          <FlowBuilder 
            category={activeCategory}
            tone={aiTone}
            initialNodes={nodes}
            initialEdges={edges}
            onSave={() => setViewState(ViewState.DASHBOARD)}
          />
        );

      case ViewState.DASHBOARD:
      default:
        return (
          <Dashboard 
            category={activeCategory} 
            onCreateNew={() => setViewState(ViewState.AI_FLOW_CREATOR)}
            onBrowseTemplates={() => setViewState(ViewState.TEMPLATE_GALLERY)}
            onSelectTemplate={handleTemplateSelect}
            onCategoryChange={handleWorkflowCategorySelect}
          />
        );
    }
  };

  return (
    <div className="flex h-full w-full font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={`
        bg-white/80 backdrop-blur-xl border-r border-slate-200/60 transition-all duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'w-[260px]' : 'w-0'}
      `}>
        {/* Brand */}
        <div className={`h-18 flex items-center justify-between px-6 pt-6 pb-2 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex items-center gap-3 group cursor-pointer whitespace-nowrap">
             <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 shrink-0 transform group-hover:scale-105 transition-transform">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                 <path d="M7 5h8a4 4 0 0 1 0 8H7V5z" />
                 <path d="M7 13h10a4 4 0 0 1 0 8H7v-8z" />
                 <path d="M11 9h1" />
                 <path d="M11 17h1" />
               </svg>
             </div>
             <div className="flex flex-col">
               <h1 className="text-slate-900 font-bold text-lg tracking-tight leading-none">BridgeAI</h1>
               <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider mt-1">Platform</span>
             </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
            aria-label="Close sidebar"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        {/* Main Nav */}
        <nav className={`flex-1 overflow-y-auto px-4 py-6 space-y-1 custom-scrollbar transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {NAVIGATION_ITEMS.map((item) => {
             const isActive = (item.name === 'Chats' && viewState === ViewState.CHATS) || 
                              (item.name === 'Automations' && (viewState === ViewState.DASHBOARD || viewState === ViewState.FLOW_BUILDER || viewState === ViewState.TEMPLATE_GALLERY || viewState === ViewState.TEMPLATE_PREVIEW)) ||
                              (item.name === 'Pipeline' && viewState === ViewState.PIPELINE) ||
                              (item.name === 'Properties' && viewState === ViewState.PROPERTIES) ||
                              (item.name === 'Tasks' && viewState === ViewState.TASKS);
             
             return (
              <div key={item.name}>
                <button
                  onClick={() => handleNavClick(item.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group mb-1
                    ${isActive 
                      ? 'bg-cyan-50/80 text-cyan-700' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                >
                  <span className={`flex items-center justify-center w-5 h-5 ${isActive ? 'text-cyan-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    {item.icon === 'Workflow' && <Layout className="w-5 h-5" />}
                    {item.icon === 'MessageSquare' && <MessageSquare className="w-5 h-5" />}
                    {item.icon === 'Settings' && <SettingsIcon className="w-5 h-5" />}
                    {item.icon === 'Users' && <User className="w-5 h-5" />}
                    {item.icon === 'Kanban' && <Kanban className="w-5 h-5" />}
                    {item.icon === 'Building' && <Building className="w-5 h-5" />}
                    {item.icon === 'CheckSquare' && <CheckSquare className="w-5 h-5" />}
                    {item.icon === 'BarChart' && <div className="w-5 h-5 border-2 border-current rounded-md" />} 
                  </span>
                  {item.name}
                </button>
              </div>
             );
          })}
        </nav>
        
        {/* User Profile */}
        <div className={`p-4 border-t border-slate-100 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
           <div className="glass-panel rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-white/80 transition-colors whitespace-nowrap">
             <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">
               JD
             </div>
             <div className="flex-1 min-w-0">
               <div className="text-slate-800 font-semibold text-xs">John Doe</div>
               <div className="text-slate-400 text-[10px] truncate">Admin • BridgeAI</div>
             </div>
             <MoreHorizontal className="w-4 h-4 text-slate-400" />
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Command Bar */}
        <header className="h-18 px-8 py-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            {/* Menu Toggle */}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 mr-2"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
             {/* Breadcrumbs */}
             <div className="flex items-center text-sm">
               <span className="text-slate-400 font-medium">BridgeAI</span>
               <ChevronRight className="w-4 h-4 text-slate-300 mx-2" />
               {viewState === ViewState.FLOW_BUILDER || viewState === ViewState.TEMPLATE_PREVIEW ? (
                 <>
                   <span className="text-slate-400 font-medium cursor-pointer hover:text-slate-700" onClick={() => setViewState(ViewState.DASHBOARD)}>Automations</span>
                   <ChevronRight className="w-4 h-4 text-slate-300 mx-2" />
                   <span className="text-slate-900 font-semibold bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">
                     {selectedTemplate?.title || 'New Flow'}
                   </span>
                 </>
               ) : (
                  <span className="text-slate-900 font-semibold">
                    {viewState === ViewState.CHATS ? 'Unified Inbox' : 
                     viewState === ViewState.PIPELINE ? 'Deals Pipeline' : 
                     viewState === ViewState.PROPERTIES ? 'Properties' :
                     viewState === ViewState.TASKS ? 'Tasks' :
                     activeCategory}
                  </span>
               )}
             </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative hidden md:block group">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-600 transition-colors" />
               <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-mono">⌘</span>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-mono">K</span>
               </div>
               <input 
                 type="text" 
                 placeholder="Search..." 
                 className="pl-10 pr-12 py-2 bg-white/50 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 w-64 transition-all shadow-sm backdrop-blur-sm hover:bg-white/80" 
               />
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-sm"></span>
            </button>
          </div>
        </header>

        {/* Canvas */}
        <div className="flex-1 overflow-hidden relative mx-4 mb-4 rounded-3xl border border-slate-200/60 bg-white/50 shadow-xl shadow-slate-200/20 backdrop-blur-sm flex flex-col">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
