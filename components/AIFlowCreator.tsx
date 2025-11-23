import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, ArrowLeft, Loader2 } from 'lucide-react';
import { WorkflowCategory, FlowNode, FlowEdge } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIFlowCreatorProps {
  category: WorkflowCategory;
  onBack: () => void;
  onFlowGenerated: (nodes: FlowNode[], edges: FlowEdge[]) => void;
}

const AIFlowCreator: React.FC<AIFlowCreatorProps> = ({ category, onBack, onFlowGenerated }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm your AI automation assistant. Tell me what kind of workflow you'd like to create for ${category}, and I'll design it for you.

For example, you could say:
• "Create a flow to capture leads from Zoopla and qualify them via WhatsApp"
• "Build an automation to send viewing reminders 2 hours before appointments"
• "Design a maintenance request triage system"

What would you like to automate?`
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const newUserMessage: Message = { role: 'user', content: userInput.trim() };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/generate-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requirement: newUserMessage.content,
          category: category
        })
      });

      const data = await response.json();

      if (data.nodes && data.edges) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: `Perfect! I've created your workflow: "${data.flowName}"\n\n${data.description}\n\nThe flow includes:\n${data.summary}\n\nClick "View Flow" below to see and customize it!`
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        setTimeout(() => {
          onFlowGenerated(data.nodes, data.edges);
        }, 1500);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Automations
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Flow Creator</h1>
            <p className="text-sm text-slate-500">Describe your automation, and I'll build it for you</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}
          >
            <div
              className={`max-w-2xl rounded-2xl px-6 py-4 ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-cyan-500 animate-spin" />
              <span className="text-sm text-slate-600">Creating your automation flow...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-slate-200 bg-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe the automation you need..."
                disabled={isLoading}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm resize-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                rows={3}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!userInput.trim() || isLoading}
              className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-4 rounded-2xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIFlowCreator;
