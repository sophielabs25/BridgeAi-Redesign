import React, { useState } from 'react';
import { WorkflowStage, LeadWorkflow, StageProgress, PropertySuggestion, Notification } from '../types';
import { 
  CheckCircle, Circle, Clock, AlertTriangle, Home, UserCheck, Calendar, 
  Bell, MessageSquare, FileCheck, UserPlus, ChevronRight, Plus, X,
  ThumbsUp, ThumbsDown, TrendingUp, TrendingDown, Minus
} from 'lucide-react';

interface WorkflowTrackerProps {
  workflow: LeadWorkflow | undefined;
  onUpdateWorkflow: (workflow: LeadWorkflow) => void;
  leadName: string;
}

const WORKFLOW_STAGES_CONFIG = [
  {
    stage: WorkflowStage.LEAD_CAPTURE,
    label: 'Lead Capture',
    icon: UserPlus,
    color: 'cyan',
    description: 'Collect lead details and initial contact information',
    requiredActions: ['Capture name, email, phone', 'Identify property interest', 'Record source/channel']
  },
  {
    stage: WorkflowStage.QUALIFICATION,
    label: 'Qualification',
    icon: UserCheck,
    color: 'blue',
    description: 'Qualify lead budget, move date, and requirements',
    requiredActions: ['Confirm budget range', 'Verify move-in date', 'Understand property requirements', 'Check decision maker']
  },
  {
    stage: WorkflowStage.BOOKING_FOLLOWUPS,
    label: 'Booking & Follow-ups',
    icon: Calendar,
    color: 'purple',
    description: 'Schedule viewings and manage follow-up communications',
    requiredActions: ['Book viewing date/time', 'Send confirmation', 'Set follow-up reminders']
  },
  {
    stage: WorkflowStage.PROPERTY_SUGGESTIONS,
    label: 'Property Suggestions',
    icon: Home,
    color: 'emerald',
    description: 'Suggest up to 5 suitable properties based on requirements',
    requiredActions: ['Research matching properties', 'Send property details', 'Track interest level']
  },
  {
    stage: WorkflowStage.REFERENCING,
    label: 'Referencing',
    icon: FileCheck,
    color: 'amber',
    description: 'Complete reference checks and documentation',
    requiredActions: ['Request references', 'Verify employment', 'Credit check', 'Right to rent check']
  },
  {
    stage: WorkflowStage.NOTIFICATIONS,
    label: 'Notifications',
    icon: Bell,
    color: 'orange',
    description: 'Notify all parties about progress and next steps',
    requiredActions: ['Notify landlord/vendor', 'Update tenant/buyer', 'Alert team members']
  },
  {
    stage: WorkflowStage.FEEDBACK_SENTIMENT,
    label: 'Feedback & Sentiment',
    icon: MessageSquare,
    color: 'pink',
    description: 'Collect feedback and analyze sentiment',
    requiredActions: ['Request viewing feedback', 'Analyze sentiment', 'Record concerns/objections']
  },
  {
    stage: WorkflowStage.ONBOARDING,
    label: 'Onboarding',
    icon: CheckCircle,
    color: 'green',
    description: 'Complete onboarding process and finalize documentation',
    requiredActions: ['Sign contracts', 'Collect deposit', 'Schedule move-in', 'Provide welcome pack']
  }
];

export const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({ workflow, onUpdateWorkflow, leadName }) => {
  const [expandedStage, setExpandedStage] = useState<WorkflowStage | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState<'positive' | 'neutral' | 'negative' | null>(null);

  // Initialize workflow if it doesn't exist
  if (!workflow) {
    const initialWorkflow: LeadWorkflow = {
      currentStage: WorkflowStage.LEAD_CAPTURE,
      stages: WORKFLOW_STAGES_CONFIG.map(config => ({
        stage: config.stage,
        status: config.stage === WorkflowStage.LEAD_CAPTURE ? 'in_progress' : 'pending'
      })),
      propertySuggestions: [],
      notifications: [],
      startedAt: new Date().toISOString()
    };
    onUpdateWorkflow(initialWorkflow);
    return null;
  }

  const getStageStatus = (stage: WorkflowStage): StageProgress | undefined => {
    return workflow.stages.find(s => s.stage === stage);
  };

  const getStageConfig = (stage: WorkflowStage) => {
    return WORKFLOW_STAGES_CONFIG.find(s => s.stage === stage)!;
  };

  const completeStage = (stage: WorkflowStage) => {
    const stageIndex = WORKFLOW_STAGES_CONFIG.findIndex(s => s.stage === stage);
    const nextStage = WORKFLOW_STAGES_CONFIG[stageIndex + 1]?.stage;

    const updatedWorkflow: LeadWorkflow = {
      ...workflow,
      currentStage: nextStage || stage,
      stages: workflow.stages.map(s => {
        if (s.stage === stage) {
          return { ...s, status: 'completed' as const, completedAt: new Date().toISOString(), feedback: feedbackText || undefined, sentiment: selectedSentiment || undefined };
        }
        if (s.stage === nextStage) {
          return { ...s, status: 'in_progress' as const };
        }
        return s;
      })
    };

    onUpdateWorkflow(updatedWorkflow);
    setExpandedStage(null);
    setFeedbackText('');
    setSelectedSentiment(null);
  };

  const addPropertySuggestion = (property: Omit<PropertySuggestion, 'id' | 'suggestedAt'>) => {
    if (workflow.propertySuggestions.length >= 5) {
      alert('Maximum 5 properties can be suggested');
      return;
    }

    const updatedWorkflow: LeadWorkflow = {
      ...workflow,
      propertySuggestions: [
        ...workflow.propertySuggestions,
        {
          ...property,
          id: `prop-${Date.now()}`,
          suggestedAt: new Date().toISOString()
        }
      ]
    };

    onUpdateWorkflow(updatedWorkflow);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'status'>) => {
    const updatedWorkflow: LeadWorkflow = {
      ...workflow,
      notifications: [
        ...workflow.notifications,
        {
          ...notification,
          id: `notif-${Date.now()}`,
          status: 'pending'
        }
      ]
    };

    onUpdateWorkflow(updatedWorkflow);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5" />;
      case 'in_progress': return <Clock className="w-5 h-5 animate-pulse" />;
      case 'pending': return <Circle className="w-5 h-5" />;
      case 'skipped': return <AlertTriangle className="w-5 h-5" />;
      default: return <Circle className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending': return 'text-slate-400 bg-slate-50 border-slate-200';
      case 'skipped': return 'text-amber-500 bg-amber-50 border-amber-200';
      default: return 'text-slate-400 bg-slate-50 border-slate-200';
    }
  };

  const currentStageIndex = WORKFLOW_STAGES_CONFIG.findIndex(s => s.stage === workflow.currentStage);
  const progressPercent = ((currentStageIndex + 1) / WORKFLOW_STAGES_CONFIG.length) * 100;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900">Lead Workflow</h3>
          <span className="text-xs font-medium text-slate-500">{leadName}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600">Progress</span>
            <span className="font-bold text-slate-900">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stages List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
        {WORKFLOW_STAGES_CONFIG.map((config, index) => {
          const stageStatus = getStageStatus(config.stage);
          const isExpanded = expandedStage === config.stage;
          const Icon = config.icon;
          const isCurrentStage = workflow.currentStage === config.stage;

          return (
            <div key={config.stage} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              {/* Stage Header */}
              <button
                onClick={() => setExpandedStage(isExpanded ? null : config.stage)}
                className="w-full p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getStatusColor(stageStatus?.status || 'pending')}`}>
                  {getStatusIcon(stageStatus?.status || 'pending')}
                </div>
                
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-slate-900">{config.label}</h4>
                    {isCurrentStage && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase">Current</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{config.description}</p>
                </div>

                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-4 pt-0 space-y-3 border-t border-slate-100">
                  {/* Required Actions */}
                  <div>
                    <p className="text-xs font-bold text-slate-600 uppercase mb-2">Required Actions:</p>
                    <ul className="space-y-1">
                      {config.requiredActions.map((action, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sentiment for Feedback Stage */}
                  {config.stage === WorkflowStage.FEEDBACK_SENTIMENT && stageStatus?.status === 'in_progress' && (
                    <div>
                      <p className="text-xs font-bold text-slate-600 uppercase mb-2">Sentiment:</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedSentiment('positive')}
                          className={`flex-1 p-2 rounded-lg border text-xs font-medium transition-colors ${
                            selectedSentiment === 'positive' 
                              ? 'bg-green-50 border-green-300 text-green-700' 
                              : 'bg-white border-slate-200 text-slate-600 hover:border-green-300'
                          }`}
                        >
                          <TrendingUp className="w-4 h-4 mx-auto mb-1" />
                          Positive
                        </button>
                        <button
                          onClick={() => setSelectedSentiment('neutral')}
                          className={`flex-1 p-2 rounded-lg border text-xs font-medium transition-colors ${
                            selectedSentiment === 'neutral' 
                              ? 'bg-slate-50 border-slate-300 text-slate-700' 
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <Minus className="w-4 h-4 mx-auto mb-1" />
                          Neutral
                        </button>
                        <button
                          onClick={() => setSelectedSentiment('negative')}
                          className={`flex-1 p-2 rounded-lg border text-xs font-medium transition-colors ${
                            selectedSentiment === 'negative' 
                              ? 'bg-red-50 border-red-300 text-red-700' 
                              : 'bg-white border-slate-200 text-slate-600 hover:border-red-300'
                          }`}
                        >
                          <TrendingDown className="w-4 h-4 mx-auto mb-1" />
                          Negative
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Feedback Notes */}
                  {stageStatus?.status === 'in_progress' && (
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase mb-2 block">Notes:</label>
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Add notes about this stage..."
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        rows={2}
                      />
                    </div>
                  )}

                  {/* Complete Button */}
                  {stageStatus?.status === 'in_progress' && (
                    <button
                      onClick={() => completeStage(config.stage)}
                      className="w-full p-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Complete {config.label}
                    </button>
                  )}

                  {/* Completed Info */}
                  {stageStatus?.status === 'completed' && stageStatus.completedAt && (
                    <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs font-medium text-green-700">
                        ✓ Completed {new Date(stageStatus.completedAt).toLocaleDateString()}
                      </p>
                      {stageStatus.sentiment && (
                        <p className="text-xs text-green-600 mt-1">
                          Sentiment: <span className="font-bold capitalize">{stageStatus.sentiment}</span>
                        </p>
                      )}
                      {stageStatus.notes && (
                        <p className="text-xs text-slate-600 mt-1">{stageStatus.notes}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Property Suggestions Summary */}
      {workflow.propertySuggestions.length > 0 && (
        <div className="p-3 bg-white border-t border-slate-200">
          <p className="text-xs font-bold text-slate-600 uppercase mb-2">Property Suggestions ({workflow.propertySuggestions.length}/5)</p>
          <div className="space-y-1">
            {workflow.propertySuggestions.slice(0, 3).map(prop => (
              <div key={prop.id} className="text-xs text-slate-600 flex items-center gap-2">
                <Home className="w-3 h-3 text-slate-400" />
                <span className="truncate">{prop.address}</span>
                <span className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  prop.status === 'interested' ? 'bg-green-100 text-green-700' :
                  prop.status === 'viewed' ? 'bg-blue-100 text-blue-700' :
                  prop.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {prop.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
