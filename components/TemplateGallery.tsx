import React, { useState } from 'react';
import { Template, WorkflowCategory } from '../types';
import { RECOMMENDED_TEMPLATES, CATEGORY_TEMPLATES } from '../constants';
import { X, ChevronDown, MessageSquare, Mail, Ticket, Bot, MessageCircle, Zap, Smile, FileText, Phone, Check } from 'lucide-react';

interface TemplateGalleryProps {
  onSelect: (template: Template) => void;
  onClose: () => void;
  categoryName: string;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelect, onClose, categoryName }) => {
  // Merge generic recommended templates with category-specific ones if available
  const allTemplates = [
    ...(CATEGORY_TEMPLATES[categoryName] || []),
    ...RECOMMENDED_TEMPLATES
  ];

  // Deduplicate by ID just in case
  const templates = Array.from(new Map(allTemplates.map(item => [item.id, item])).values());

  const [appFilter, setAppFilter] = useState<string>('All');
  const [catFilter, setCatFilter] = useState<string>('All');

  // Extract unique values for lists
  const uniqueApps = ['All', ...Array.from(new Set(templates.map(t => t.appType))).filter(t => t !== 'All')];
  const uniqueCats = ['All', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = templates.filter(t => {
    if (appFilter !== 'All' && t.appType !== appFilter) return false;
    if (catFilter !== 'All' && t.category !== catFilter) return false;
    return true;
  });

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'chat': return <div className="w-6 h-6 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center"><MessageSquare className="w-3.5 h-3.5" /></div>;
      case 'email': return <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><Mail className="w-3.5 h-3.5" /></div>;
      case 'ticket': return <div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><Ticket className="w-3.5 h-3.5" /></div>;
      case 'ai': return <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><Bot className="w-3.5 h-3.5" /></div>;
      case 'whatsapp': return <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center"><MessageCircle className="w-3.5 h-3.5" /></div>;
      case 'sms': return <div className="w-6 h-6 rounded-full bg-cyan-50 text-cyan-500 flex items-center justify-center"><MessageSquare className="w-3.5 h-3.5" /></div>;
      case 'voice': return <div className="w-6 h-6 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center"><Phone className="w-3.5 h-3.5" /></div>;
      default: return <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"><Zap className="w-3.5 h-3.5" /></div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <h2 className="text-xl font-bold text-slate-900">Recommended templates</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Filters */}
            <div className="w-64 border-r border-slate-100 bg-slate-50/50 p-6 overflow-y-auto custom-scrollbar shrink-0">
                
                {/* App Integration Section */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">App Integration</h3>
                    <div className="space-y-1">
                        {uniqueApps.map(app => (
                            <button
                                key={app}
                                onClick={() => setAppFilter(app)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex justify-between items-center group
                                    ${appFilter === app 
                                        ? 'bg-white text-cyan-700 shadow-sm ring-1 ring-slate-200' 
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }
                                `}
                            >
                                {app}
                                {appFilter === app && <Check className="w-3.5 h-3.5 text-cyan-500" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category Section */}
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Category</h3>
                    <div className="space-y-1">
                        {uniqueCats.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCatFilter(cat)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex justify-between items-center group
                                    ${catFilter === cat 
                                        ? 'bg-white text-cyan-700 shadow-sm ring-1 ring-slate-200' 
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }
                                `}
                            >
                                {cat}
                                {catFilter === cat && <Check className="w-3.5 h-3.5 text-cyan-500" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map(template => (
                    <div 
                        key={template.id}
                        onClick={() => onSelect(template)}
                        className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col h-[260px] group"
                    >
                        {/* Card Header: Category */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="text-slate-400 group-hover:text-cyan-500 transition-colors">
                                {template.category.toLowerCase().includes('customer') ? <Smile className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                            </div>
                            <span className="text-xs font-medium text-slate-500">{template.category}</span>
                        </div>

                        {/* Card Body */}
                        <div className="flex-1 min-h-0 mb-4">
                            <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-cyan-600 transition-colors mb-2">{template.title}</h3>
                            <p className="text-xs text-slate-500 line-clamp-4 leading-relaxed">{template.description}</p>
                        </div>

                        {/* Card Footer: Channel Icons */}
                        <div className="mt-auto flex items-center gap-2 pt-4 border-t border-slate-50">
                        {template.channels?.map((channel, idx) => (
                            <div key={`${template.id}-${channel}-${idx}`}>
                            {getChannelIcon(channel)}
                            </div>
                        ))}
                        {(!template.channels || template.channels.length === 0) && (
                            <div className="w-6 h-6 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center"><MessageSquare className="w-3.5 h-3.5" /></div>
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

export default TemplateGallery;