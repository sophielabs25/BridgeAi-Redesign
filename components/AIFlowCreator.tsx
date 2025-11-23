import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, ArrowLeft, Loader2, Zap, MessageCircle, Mail, Phone, Database, Globe, CheckCircle2 } from 'lucide-react';
import { WorkflowCategory, FlowNode, FlowEdge } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  integrations?: string[];
}

interface AIFlowCreatorProps {
  category: WorkflowCategory;
  onBack: () => void;
  onFlowGenerated: (nodes: FlowNode[], edges: FlowEdge[]) => void;
}

const EXAMPLE_PROMPTS = [
  {
    icon: Zap,
    title: "Lead Capture & Qualification",
    description: "Capture leads from Zoopla and qualify them via WhatsApp",
    prompt: "Create a flow to capture leads from Zoopla and automatically qualify them via WhatsApp messages"
  },
  {
    icon: MessageCircle,
    title: "Viewing Reminders",
    description: "Send automated reminders before property viewings",
    prompt: "Build an automation to send viewing reminders 2 hours before appointments via WhatsApp and email"
  },
  {
    icon: Database,
    title: "CRM Sync",
    description: "Sync new leads from portals to Alto CRM",
    prompt: "Design a flow to automatically sync new leads from Rightmove and OnTheMarket to Alto CRM"
  }
];

const INTEGRATIONS = {
  crms: [
    { name: 'Alto', color: 'from-purple-500 to-purple-600', icon: '🏢' },
    { name: 'Apex27', color: 'from-orange-500 to-orange-600', icon: '📊' },
    { name: 'Reapit', color: 'from-blue-500 to-blue-600', icon: '🏠' }
  ],
  portals: [
    { name: 'Zoopla', color: 'from-purple-600 to-purple-700', icon: '🏘️' },
    { name: 'Rightmove', color: 'from-green-600 to-green-700', icon: '🏡' },
    { name: 'OnTheMarket', color: 'from-blue-600 to-blue-700', icon: '🏢' }
  ],
  channels: [
    { name: 'WhatsApp', color: 'from-green-500 to-green-600', icon: '💬' },
    { name: 'Email', color: 'from-blue-500 to-blue-600', icon: '📧' },
    { name: 'SMS', color: 'from-cyan-500 to-cyan-600', icon: '📱' },
    { name: 'Slack', color: 'from-purple-500 to-purple-600', icon: '💼' }
  ]
};

const AIFlowCreator: React.FC<AIFlowCreatorProps> = ({ category, onBack, onFlowGenerated }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showExamples, setShowExamples] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (promptText?: string) => {
    const messageText = promptText || userInput.trim();
    if (!messageText || isLoading) return;

    setShowExamples(false);
    const newUserMessage: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/generate-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requirement: messageText,
          category: category
        })
      });

      const data = await response.json();

      if (data.nodes && data.edges) {
        const detectedIntegrations: string[] = [];
        const contentLower = messageText.toLowerCase();
        
        Object.values(INTEGRATIONS).flat().forEach(integration => {
          if (contentLower.includes(integration.name.toLowerCase())) {
            detectedIntegrations.push(integration.name);
          }
        });

        const assistantMessage: Message = {
          role: 'assistant',
          content: `Perfect! I've created your workflow: "${data.flowName}"\n\n${data.description}\n\nThe flow includes:\n${data.summary}\n\nYour automation is ready to customize!`,
          integrations: detectedIntegrations.length > 0 ? detectedIntegrations : undefined
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        setTimeout(() => {
          onFlowGenerated(data.nodes, data.edges);
        }, 2000);
      } else {
        const errorMessage: Message = {
          role: 'assistant',
          content: 'I encountered an issue generating your flow. Could you please describe your automation requirement again with more details?'
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error generating flow:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, there was an error creating your flow. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 px-6 md:px-8 py-5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-3 transition-colors text-sm font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to Automations
        </button>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 animate-pulse-slow">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">AI Flow Creator</h1>
            <p className="text-sm text-slate-500 mt-0.5">Describe your automation, and I'll build it for you</p>
          </div>
        </div>

        {/* Available Integrations Badge Bar */}
        <div className="mt-6 pt-5 border-t border-slate-200/60">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Available Integrations</p>
          <div className="flex flex-wrap gap-2">
            {/* CRMs */}
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-purple-100/50 px-3 py-1.5 rounded-lg border border-purple-200/60">
              <span className="text-xs font-medium text-purple-700">CRMs:</span>
              {INTEGRATIONS.crms.map(crm => (
                <span key={crm.name} className="text-xs bg-white px-2 py-0.5 rounded border border-purple-200/60 text-purple-900 font-medium">
                  {crm.icon} {crm.name}
                </span>
              ))}
            </div>
            
            {/* Portals */}
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-blue-100/50 px-3 py-1.5 rounded-lg border border-blue-200/60">
              <span className="text-xs font-medium text-blue-700">Portals:</span>
              {INTEGRATIONS.portals.map(portal => (
                <span key={portal.name} className="text-xs bg-white px-2 py-0.5 rounded border border-blue-200/60 text-blue-900 font-medium">
                  {portal.icon} {portal.name}
                </span>
              ))}
            </div>
            
            {/* Channels */}
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-green-50 to-green-100/50 px-3 py-1.5 rounded-lg border border-green-200/60">
              <span className="text-xs font-medium text-green-700">Channels:</span>
              {INTEGRATIONS.channels.map(channel => (
                <span key={channel.name} className="text-xs bg-white px-2 py-0.5 rounded border border-green-200/60 text-green-900 font-medium">
                  {channel.icon} {channel.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-8 shadow-lg border border-slate-200/60 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Hi! I'm your AI automation assistant for {category} 👋
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Tell me what workflow you'd like to create, and I'll design a complete automation flow with all the nodes, connections, and integrations you need. I can work with your CRMs, property portals, and communication channels.
                  </p>
                </div>
              </div>
            </div>

            {/* Example Prompts */}
            {showExamples && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Quick Start Examples</h4>
                <div className="grid gap-3">
                  {EXAMPLE_PROMPTS.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example.prompt)}
                      className="group bg-white hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50 rounded-2xl p-5 border border-slate-200 hover:border-cyan-300 transition-all duration-300 text-left hover:shadow-lg hover:shadow-cyan-500/10"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-cyan-500 group-hover:to-blue-600 flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-sm">
                          <example.icon className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-slate-900 mb-1 group-hover:text-cyan-900 transition-colors">
                            {example.title}
                          </h5>
                          <p className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
                            {example.description}
                          </p>
                        </div>
                        <Send className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 mt-1" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat Messages */}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}
          >
            <div className={`max-w-2xl ${message.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2 ml-1">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">AI Assistant</span>
                </div>
              )}
              
              <div
                className={`rounded-2xl px-6 py-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                
                {message.integrations && message.integrations.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-semibold text-slate-600">Connected Integrations:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {message.integrations.map(integration => {
                        const integrationData = Object.values(INTEGRATIONS)
                          .flat()
                          .find(i => i.name === integration);
                        return integrationData ? (
                          <span
                            key={integration}
                            className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${integrationData.color} text-white px-3 py-1 rounded-lg text-xs font-medium shadow-sm`}
                          >
                            <span>{integrationData.icon}</span>
                            {integration}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <div className="flex items-center gap-2 justify-end mt-2 mr-1">
                  <span className="text-xs text-slate-500">You</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4">
            <div className="max-w-2xl mr-auto">
              <div className="flex items-center gap-2 mb-2 ml-1">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-semibold text-slate-600">AI Assistant</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-cyan-500 animate-spin" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Creating your automation flow...</div>
                    <div className="text-xs text-slate-500 mt-0.5">Analyzing requirements and generating nodes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200/60 bg-white/80 backdrop-blur-lg p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe the automation you need... (e.g., capture leads from Zoopla and sync to Alto CRM)"
                disabled={isLoading}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm resize-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                rows={3}
              />
            </div>
            <button
              onClick={() => handleSendMessage()}
              disabled={!userInput.trim() || isLoading}
              className="bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600 text-white p-4 rounded-2xl hover:shadow-xl hover:shadow-cyan-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">Enter</kbd> to send • 
            <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono ml-1">Shift + Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIFlowCreator;
