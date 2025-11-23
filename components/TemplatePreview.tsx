import React from 'react';
import { Template } from '../types';
import { Bell, ArrowRight, Check, CheckCircle, Zap, Bot, GitBranch, MessageSquare } from 'lucide-react';

interface TemplatePreviewProps {
  template: Template;
  onCancel: () => void;
  onConfirm: () => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, onCancel, onConfirm }) => {
  const steps = template.previewSteps || [
    { type: 'trigger', label: 'Trigger Event', subLabel: 'Start Flow' },
    { type: 'action', label: 'Process', subLabel: 'System Action' },
    { type: 'action', label: 'End', subLabel: 'Complete' }
  ];

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'trigger': return <Zap className="w-4 h-4" />;
      case 'ai': return <Bot className="w-4 h-4" />;
      case 'condition': return <GitBranch className="w-4 h-4" />;
      default: return <Check className="w-4 h-4" />;
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'ai': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'condition': return 'bg-cyan-50 text-cyan-600 border-cyan-200';
      default: return 'bg-slate-50 text-blue-600 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/90 backdrop-blur-md p-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header Section */}
        <div className="flex flex-col items-center pt-12 pb-8 px-8 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-6 shadow-lg shadow-amber-100/50 ring-4 ring-white">
            <Bell className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">{template.title}</h2>
          <p className="text-slate-500 text-lg max-w-lg leading-relaxed">{template.description}</p>
        </div>

        {/* Preview Area */}
        <div className="px-8 pb-8">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 relative overflow-hidden">
             {/* Label */}
             <div className="flex items-center gap-2 mb-10">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                <h3 className="text-sm font-bold text-slate-900">Logic Flow Preview</h3>
                <div className="ml-auto flex gap-2">
                   {template.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-500 uppercase">
                        {tag}
                      </span>
                   ))}
                </div>
             </div>

             {/* Visualization */}
             <div className="relative flex items-center justify-center gap-4 py-4 overflow-x-auto custom-scrollbar">
                {/* Connecting Line Background */}
                <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>

                {steps.map((step, index) => (
                   <div key={index} className="relative z-10 flex flex-col items-center group">
                      {/* Step Badge Number */}
                      <div className="absolute -top-3 -right-3 w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-slate-50 shadow-md z-20">
                         {index + 1}
                      </div>

                      {/* Card */}
                      <div className="w-48 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-md">
                         <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${getStepColor(step.type)}`}>
                            {getStepIcon(step.type)}
                         </div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{step.type}</div>
                         <div className="text-sm font-bold text-slate-800">{step.label}</div>
                         {step.subLabel && <div className="text-xs text-slate-500 mt-1">{step.subLabel}</div>}
                      </div>
                   </div>
                ))}
             </div>
             
             {/* Scroll Indicators (Visual) */}
             <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300"><ArrowRight className="w-4 h-4 rotate-180" /></div>
             <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300"><ArrowRight className="w-4 h-4" /></div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 pb-8 pt-4 flex items-center justify-center gap-4">
           <button 
             onClick={onCancel}
             className="px-6 py-3 rounded-xl text-slate-500 font-semibold hover:bg-slate-50 transition-colors"
           >
             Cancel
           </button>
           <button 
             onClick={onConfirm}
             className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2"
           >
             <CheckCircle className="w-4 h-4" />
             Use Template
           </button>
        </div>

      </div>
    </div>
  );
};

export default TemplatePreview;