
import React, { useState } from 'react';
import { WorkflowCategory, Template, WorkflowInstance } from '../types';
import { CATEGORY_TEMPLATES, RECOMMENDED_TEMPLATES, MOCK_WORKFLOW_INSTANCES, WORKFLOW_MENU } from '../constants';
import { Plus, MessageSquare, Zap, MoreHorizontal, Search, ArrowRight, Layout, Filter, ChevronDown, MessageCircle, PlusCircle } from 'lucide-react';

interface DashboardProps {
  category: WorkflowCategory;
  onCreateNew: () => void;
  onBrowseTemplates: () => void;
  onSelectTemplate?: (template: Template) => void;
  onCategoryChange: (category: WorkflowCategory) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ category, onCreateNew, onBrowseTemplates, onSelectTemplate, onCategoryChange }) => {
  // Filter templates: Use specific category templates, fallback to recommended, take only first 4 for display
  const allTemplates = CATEGORY_TEMPLATES[category] || RECOMMENDED_TEMPLATES;
  const displayTemplates = allTemplates.slice(0, 4);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter workflow instances based on search (and optionally category if we wanted strictly filtered lists)
  // For this mock UI, we'll just show the mock list filtered by search.
  const filteredWorkflows = MOCK_WORKFLOW_INSTANCES.filter(wf => 
    wf.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (statusFilter === 'All' || wf.status === statusFilter)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-purple-600 text-white';
      case 'Draft': return 'bg-slate-200 text-slate-600';
      default: return 'bg-slate-200 text-slate-600';
    }
  };

  return (
    <div className="flex h-full w-full bg-white overflow-hidden">
      {/* 1. Sidebar for Submenus (Categories + New Flow) */}
      <div className="w-64 bg-slate-50/50 border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-6">Automations</h2>
          
          {/* New Flow Button in Sidebar */}
          <button 
            onClick={onCreateNew} 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-slate-900/10 transition-all hover:scale-[1.02] mb-6"
          >
             <PlusCircle className="w-4 h-4" />
             <span>New Flow</span>
          </button>

          <div className="space-y-1">
             <div className="px-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categories</div>
             {WORKFLOW_MENU.filter(wf => wf !== WorkflowCategory.CREATE_NEW).map(wf => (
              <button
                key={wf}
                onClick={() => onCategoryChange(wf)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between
                  ${category === wf 
                    ? 'bg-white text-cyan-700 shadow-sm ring-1 ring-slate-200' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }
                `}
              >
                <span className="truncate">{wf}</span>
                {category === wf && <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0"></div>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8fafc]">
        {/* Header Bar with Search & Filter */}
        <div className="h-18 px-8 flex items-center justify-between bg-white border-b border-slate-200 shrink-0">
           <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-slate-900">{category} Workflows</h3>
           </div>

           <div className="flex items-center gap-3">
              <div className="relative group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-600" />
                 <input 
                   type="text" 
                   placeholder="Search workflows..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-cyan-500/20 w-64" 
                 />
              </div>
              
              <div className="relative">
                  <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                     Status: {statusFilter}
                     <ChevronDown className="w-3.5 h-3.5" />
                  </button>
               </div>
           </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            
            {/* Workflows Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-10">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                   <h4 className="font-bold text-slate-700 text-sm">Created workflows</h4>
                </div>
                <table className="w-full">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                        <th className="text-left py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="text-center py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        <th className="text-left py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Created on</th>
                        <th className="text-left py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Runs</th>
                        <th className="text-center py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="w-10"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredWorkflows.map((wf) => (
                        <tr key={wf.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="py-3 px-6">
                                <span className="text-sm font-medium text-slate-700">{wf.name}</span>
                            </td>
                            <td className="py-3 px-6 text-center">
                                <div className="flex justify-center">
                                    <button className="text-orange-400 hover:text-orange-500"><MessageSquare className="w-4 h-4" /></button>
                                </div>
                            </td>
                            <td className="py-3 px-6 text-sm text-slate-500">{wf.createdOn}</td>
                            <td className="py-3 px-6 text-sm text-slate-500 font-mono text-xs">
                                {wf.runs}
                            </td>
                            <td className="py-3 px-6 text-center">
                                <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(wf.status)}`}>
                                    {wf.status}
                                </span>
                            </td>
                            <td className="py-3 px-6 text-center">
                                <button className="text-slate-300 hover:text-slate-600">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
                {filteredWorkflows.length === 0 && (
                    <div className="p-8 text-center text-slate-500 text-sm">
                        No workflows found matching your criteria.
                    </div>
                )}
            </div>

            {/* Recommended Templates Grid */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900">Recommended templates for {category}</h2>
                    <button 
                    onClick={onBrowseTemplates} 
                    className="text-sm font-bold text-[#a855f7] hover:text-[#9333ea] transition-colors"
                    >
                    Browse all templates
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayTemplates.map((template) => (
                    <div 
                        key={template.id}
                        onClick={() => onSelectTemplate && onSelectTemplate(template)}
                        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="flex items-center gap-2 mb-3 text-slate-400">
                            <div className="p-1 bg-slate-100 rounded text-slate-500">
                                <Layout className="w-3 h-3" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wide">{template.category}</span>
                        </div>
                        
                        <h3 className="font-bold text-slate-900 text-sm mb-4 line-clamp-2 h-10 leading-tight group-hover:text-[#a855f7] transition-colors">
                            {template.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-slate-400">
                            <MessageSquare className="w-4 h-4" />
                            {(template.channels || []).length > 0 && (
                                <span className="text-xs">+{(template.channels || []).length}</span>
                            )}
                        </div>
                    </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
