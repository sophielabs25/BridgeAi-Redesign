import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FlowNode, FlowEdge, Position, ToneType, WorkflowCategory } from '../types';
import { X, GripVertical, Zap, MessageSquare, GitBranch, Bot, Save, Settings, ZoomIn, ZoomOut, MousePointer2, LayoutGrid, Move, Play, Undo, Redo, MoreHorizontal, Database, CheckCircle, Mail, Phone } from 'lucide-react';
import { generateNodeDescription } from '../services/apiService';

// Integration Icons Map
const INTEGRATION_ICONS = {
  // CRMs
  'alto': { emoji: '🏢', color: 'from-purple-500 to-purple-600', name: 'Alto' },
  'apex27': { emoji: '📊', color: 'from-orange-500 to-orange-600', name: 'Apex27' },
  'reapit': { emoji: '🏠', color: 'from-blue-500 to-blue-600', name: 'Reapit' },
  // Portals
  'zoopla': { emoji: '🏘️', color: 'from-purple-600 to-purple-700', name: 'Zoopla' },
  'rightmove': { emoji: '🏡', color: 'from-green-600 to-green-700', name: 'Rightmove' },
  'onthemarket': { emoji: '🏢', color: 'from-blue-600 to-blue-700', name: 'OnTheMarket' },
  // Channels
  'whatsapp': { emoji: '💬', color: 'from-green-500 to-green-600', name: 'WhatsApp' },
  'email': { emoji: '📧', color: 'from-blue-500 to-blue-600', name: 'Email' },
  'sms': { emoji: '📱', color: 'from-cyan-500 to-cyan-600', name: 'SMS' },
  'slack': { emoji: '💼', color: 'from-purple-500 to-purple-600', name: 'Slack' },
  'gmail': { emoji: '📧', color: 'from-red-500 to-red-600', name: 'Gmail' },
};

const detectIntegration = (node: FlowNode): { emoji: string; color: string; name: string } | null => {
  const text = `${node.label} ${JSON.stringify(node.data || {})}`.toLowerCase();
  
  for (const [key, value] of Object.entries(INTEGRATION_ICONS)) {
    if (text.includes(key)) {
      return value;
    }
  }
  
  return null;
};

// --- ALTO API DEFINITION ---
// Based on: https://developers.zoopla.co.uk/reference/get_appraisal-leads
const ALTO_API_STRUCTURE: Record<string, string[]> = {
  'Leads': ['Get Leads', 'Create Lead', 'Update Lead', 'Assign Lead'],
  'Clients': ['Get Client', 'Create Client', 'Update Client', 'Archive Client'],
  'Contacts': ['Search Contacts', 'Get Contact', 'Create Contact', 'Update Contact'],
  'PropertyManagement': ['Get Landlords', 'Get Tenancies', 'Create Charge', 'Create WorkOrder', 'Get Suppliers'],
  'SalesProgression': ['Get Sales Chain', 'Update Milestone', 'Complete Sale'],
  'LettingsProgression': ['Get Progression', 'Update Status', 'Reference Check Update', 'Generate Tenancy Agreement'],
  'Offers': ['Get Offers', 'Submit Offer', 'Accept Offer', 'Reject Offer', 'Withdraw Offer'],
  'Appraisals': ['Book Appraisal', 'Get Appraisals', 'Update Appraisal', 'Cancel Appraisal'],
  'Appointments': ['Book Viewing', 'Get Diary', 'Cancel Appointment', 'Reschedule'],
  'FileNotes': ['Create File Note', 'Get Notes', 'Upload Document'],
  'Inventory': ['Get Inventory', 'Update Inventory Item'],
  'Listing': ['Get Listing', 'Update Listing Status', 'Price Change'],
  'Media': ['Upload Photo', 'Get Floorplan', 'Delete Media']
};

interface FlowBuilderProps {
  category: WorkflowCategory;
  tone: ToneType;
  initialNodes?: FlowNode[];
  initialEdges?: FlowEdge[];
  onSave: () => void;
}

const FlowBuilder: React.FC<FlowBuilderProps> = ({ category, tone, initialNodes = [], initialEdges = [], onSave }) => {
  // State
  const [nodes, setNodes] = useState<FlowNode[]>(initialNodes);
  const [edges, setEdges] = useState<FlowEdge[]>(initialEdges);
  
  // Viewport State (Pan & Zoom)
  const [pan, setPan] = useState<Position>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  
  // Interaction State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  
  // AI Helper State
  const [aiDescription, setAiDescription] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef<Position>({ x: 0, y: 0 });

  // Sync state
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges]);

  // --- Logic Helpers ---

  const updateNodeData = (key: string, value: any) => {
    if (!selectedNode) return;

    setNodes(prevNodes => prevNodes.map(n => {
      if (n.id === selectedNode.id) {
        const updatedNode = {
          ...n,
          data: { ...n.data, [key]: value }
        };
        // If category changes, reset action to first available
        if (key === 'category' && ALTO_API_STRUCTURE[value]) {
           updatedNode.data = { ...updatedNode.data, action: ALTO_API_STRUCTURE[value][0] };
        }
        setSelectedNode(updatedNode); // Update local selection state
        return updatedNode;
      }
      return n;
    }));
  };

  // --- Handlers ---

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 && e.button !== 1) return;
    setIsPanning(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.button !== 0) return;

    setDraggingNodeId(id);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    
    const node = nodes.find(n => n.id === id);
    if (node) {
      setSelectedNode(node);
      setAiDescription(''); 
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    if (draggingNodeId) {
      // Update node position taking zoom into account for 1:1 movement
      setNodes(prev => prev.map(n => 
        n.id === draggingNodeId 
          ? { ...n, position: { x: n.position.x + (deltaX / zoom), y: n.position.y + (deltaY / zoom) } } 
          : n
      ));
    } else if (isPanning) {
      setPan(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
    }
  }, [draggingNodeId, isPanning, zoom]);

  const handleMouseUp = useCallback(() => {
    setDraggingNodeId(null);
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) { 
      e.preventDefault();
      const zoomSensitivity = 0.001;
      const newZoom = Math.min(Math.max(0.4, zoom - e.deltaY * zoomSensitivity), 2);
      setZoom(newZoom);
    }
  }, [zoom]);

  // Drag and Drop New Nodes from Toolbar
  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const typeLabel = e.dataTransfer.getData('application/reactflow');
    if (!typeLabel) return;

    const containerBounds = containerRef.current?.getBoundingClientRect();
    if (!containerBounds) return;

    const mouseX = e.clientX - containerBounds.left;
    const mouseY = e.clientY - containerBounds.top;

    const x = (mouseX - pan.x) / zoom;
    const y = (mouseY - pan.y) / zoom;

    const typeMap: Record<string, FlowNode['type']> = {
      'Trigger': 'trigger',
      'Action': 'action',
      'Condition': 'condition',
      'AI Agent': 'ai_process',
      'CRM Sync': 'integration'
    };

    const nodeType = typeMap[typeLabel] || 'action';
    
    // Initialize data based on type
    let initialData = {};
    if (nodeType === 'integration') {
      initialData = { provider: 'Alto', category: 'Listing', action: 'Get Listing' };
    }

    const newNode: FlowNode = {
      id: `node-${Date.now()}`,
      type: nodeType,
      label: nodeType === 'integration' ? 'Sync to Alto' : `New ${typeLabel}`,
      position: { x: x - 140, y: y - 40 }, 
      data: initialData,
      config: { tone }
    };

    setNodes((nds) => [...nds, newNode]);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    const container = containerRef.current;
    if (container) container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (container) container.removeEventListener('wheel', handleWheel);
    };
  }, [handleMouseMove, handleMouseUp, handleWheel]);

  // --- Render Helpers ---

  const getNodeStyle = (type: string) => {
     switch (type) {
       case 'trigger': return { 
         border: 'border-t-4 border-amber-400', 
         badge: 'bg-amber-50 text-amber-600', 
         icon: Zap, 
         glow: 'shadow-amber-500/20' 
       };
       case 'action': return { 
         border: 'border-t-4 border-cyan-500', 
         badge: 'bg-cyan-50 text-cyan-600', 
         icon: MessageSquare, 
         glow: 'shadow-cyan-500/20' 
       };
       case 'condition': return { 
         border: 'border-t-4 border-purple-500', 
         badge: 'bg-purple-50 text-purple-600', 
         icon: GitBranch, 
         glow: 'shadow-purple-500/20' 
       };
       case 'ai_process': return { 
         border: 'border-t-4 border-emerald-500', 
         badge: 'bg-emerald-50 text-emerald-600', 
         icon: Bot, 
         glow: 'shadow-emerald-500/20' 
       };
       case 'integration': return { 
         border: 'border-t-4 border-indigo-500', 
         badge: 'bg-indigo-50 text-indigo-600', 
         icon: Database, 
         glow: 'shadow-indigo-500/20' 
       };
       default: return { 
         border: 'border-t-4 border-slate-400', 
         badge: 'bg-slate-100 text-slate-600', 
         icon: LayoutGrid, 
         glow: 'shadow-slate-500/20' 
       };
     }
  };

  const generateAiHelp = async () => {
    if (!selectedNode) return;
    setIsAnalyzing(true);
    const desc = await generateNodeDescription(selectedNode.label, category, tone);
    setAiDescription(desc || "No description generated.");
    setIsAnalyzing(false);
  };

  const getConnectorPoint = (node: FlowNode) => ({ x: node.position.x + 280, y: node.position.y + 80 });
  const getTopConnectorPoint = (node: FlowNode) => ({ x: node.position.x, y: node.position.y + 80 });

  return (
    <div className="flex h-full bg-white relative overflow-hidden rounded-b-3xl">
      
      {/* Top Controls */}
      <div className="absolute top-6 right-6 z-30 flex gap-3">
          <div className="glass-dock rounded-xl p-1.5 flex gap-1 shadow-xl">
             <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.4))} className="p-2 text-slate-500 hover:bg-slate-100 hover:text-cyan-600 rounded-lg transition"><ZoomOut className="w-4 h-4" /></button>
             <button onClick={() => {setPan({x:0,y:0}); setZoom(1)}} className="p-2 text-slate-500 hover:bg-slate-100 hover:text-cyan-600 rounded-lg transition"><Move className="w-4 h-4" /></button>
             <button onClick={() => setZoom(z => Math.min(z + 0.1, 2))} className="p-2 text-slate-500 hover:bg-slate-100 hover:text-cyan-600 rounded-lg transition"><ZoomIn className="w-4 h-4" /></button>
          </div>
          <button onClick={onSave} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-xl shadow-lg shadow-slate-900/20 hover:bg-cyan-600 hover:shadow-cyan-500/20 transition-all font-medium text-sm">
            <Save className="w-4 h-4" /> Publish
          </button>
      </div>

      {/* Bottom Dock */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="glass-dock px-2 py-2 rounded-2xl shadow-2xl flex items-center gap-2 transition-all hover:scale-105">
           {['Trigger', 'Action', 'Condition', 'AI Agent', 'CRM Sync'].map((item, i) => (
             <div 
               key={item} 
               draggable
               onDragStart={(e) => handleDragStart(e, item)}
               className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-white hover:shadow-sm cursor-grab active:cursor-grabbing transition-all group"
             >
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center 
                 ${i === 0 ? 'bg-amber-100 text-amber-600' : 
                   i === 1 ? 'bg-cyan-100 text-cyan-600' : 
                   i === 2 ? 'bg-purple-100 text-purple-600' : 
                   i === 3 ? 'bg-emerald-100 text-emerald-600' : 
                   'bg-indigo-100 text-indigo-600'}
               `}>
                 {i === 0 && <Zap className="w-5 h-5" />}
                 {i === 1 && <MessageSquare className="w-5 h-5" />}
                 {i === 2 && <GitBranch className="w-5 h-5" />}
                 {i === 3 && <Bot className="w-5 h-5" />}
                 {i === 4 && <Database className="w-5 h-5" />}
               </div>
               <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800 whitespace-nowrap">{item}</span>
             </div>
           ))}
           <div className="w-px h-8 bg-slate-200 mx-2"></div>
           <div className="flex flex-col items-center gap-1 px-3 py-2">
             <div className="text-[10px] font-bold text-slate-400 uppercase">Tone</div>
             <div className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">{tone}</div>
           </div>
        </div>
      </div>

      {/* Infinite Canvas */}
      <div 
        className={`flex-1 relative bg-dot-pattern overflow-hidden ${isPanning ? 'cursor-grabbing' : 'cursor-grab'} active:cursor-grabbing bg-slate-50/30`}
        style={{
            backgroundPosition: `${pan.x}px ${pan.y}px`,
            backgroundSize: `${24 * zoom}px ${24 * zoom}px`
        }}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div 
            className="absolute top-0 left-0 w-full h-full origin-top-left pointer-events-none"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
            {/* Connections */}
            <svg className="absolute overflow-visible top-0 left-0 w-full h-full pointer-events-none z-0">
            <defs>
                <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>
            </defs>
            {edges.map(edge => {
                const source = nodes.find(n => n.id === edge.source);
                const target = nodes.find(n => n.id === edge.target);
                if (!source || !target) return null;
                const start = getConnectorPoint(source);
                const end = getTopConnectorPoint(target);
                const deltaX = Math.abs(end.x - start.x);
                const controlPointX = Math.max(deltaX * 0.5, 60);

                return (
                <g key={edge.id}>
                    <path
                    d={`M ${start.x} ${start.y} C ${start.x + controlPointX} ${start.y}, ${end.x - controlPointX} ${end.y}, ${end.x} ${end.y}`}
                    stroke="#e2e8f0"
                    strokeWidth="4"
                    fill="none"
                    />
                    <path
                    d={`M ${start.x} ${start.y} C ${start.x + controlPointX} ${start.y}, ${end.x - controlPointX} ${end.y}, ${end.x} ${end.y}`}
                    stroke="#94a3b8"
                    strokeWidth="2"
                    fill="none"
                    />
                </g>
                );
            })}
            </svg>

            {/* Nodes */}
            <div className="z-10">
                {nodes.map(node => {
                const style = getNodeStyle(node.type);
                const Icon = style.icon;
                const isSelected = selectedNode?.id === node.id;
                const isDragging = draggingNodeId === node.id;

                // Display custom info for integration nodes
                const subLabel = node.type === 'integration' 
                    ? (node.data?.category && node.data?.action ? `${node.data.category} • ${node.data.action}` : 'Configure Sync')
                    : (node.type === 'ai_process' ? `Processing with ${tone} tone.` : 'Awaiting configuration.');

                const integration = detectIntegration(node);

                return (
                    <div
                    key={node.id}
                    className={`absolute w-[280px] bg-white rounded-xl shadow-sm transition-all duration-200 group pointer-events-auto
                        ${isSelected ? `ring-2 ring-offset-2 ring-cyan-500 ${style.glow}` : 'hover:shadow-md'}
                        ${isDragging ? 'cursor-grabbing z-50 shadow-2xl scale-105' : 'cursor-grab z-10'}
                    `}
                    style={{ left: node.position.x, top: node.position.y }}
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                    >
                    {/* Input Port - Left Side */}
                    <div className="absolute -left-2.5 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full border-2 border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:border-cyan-400">
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                    </div>

                    {/* Node Body */}
                    <div className={`relative overflow-hidden rounded-xl bg-white ${style.border}`}>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div className={`p-2 rounded-lg ${style.badge}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <MoreHorizontal className="w-4 h-4 text-slate-300 cursor-pointer hover:text-slate-500" />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm mb-1">{node.label}</h4>
                            <p className="text-[11px] text-slate-400 line-clamp-2">
                                {subLabel}
                            </p>
                            
                            {/* Integration Badge */}
                            {integration && (
                              <div className="mt-3 pt-3 border-t border-slate-100">
                                <div className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${integration.color} text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-sm`}>
                                  <span className="text-sm">{integration.emoji}</span>
                                  {integration.name}
                                </div>
                              </div>
                            )}
                        </div>
                    </div>

                    {/* Output Port - Right Side */}
                    <div className="absolute -right-2.5 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full border-2 border-slate-200 flex items-center justify-center z-20 hover:border-cyan-400 hover:scale-110 transition-transform cursor-crosshair">
                         <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                    </div>
                    </div>
                );
                })}
            </div>
        </div>
      </div>

      {/* Inspector Panel */}
      {selectedNode && (
        <div className="absolute right-6 top-20 w-80 glass-panel rounded-2xl animate-in slide-in-from-right-10 z-30 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/50 flex justify-between items-center bg-white/40">
             <h3 className="font-bold text-slate-800">Properties</h3>
             <button onClick={() => setSelectedNode(null)}><X className="w-4 h-4 text-slate-500" /></button>
          </div>
          <div className="p-5 space-y-5">
             <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Label</label>
                <input 
                    type="text" 
                    value={selectedNode.label} 
                    onChange={(e) => updateNodeData('label', e.target.value)}
                    className="w-full bg-white/50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-cyan-500/20 outline-none" 
                />
             </div>
             
             {/* Specific Config for Integration Nodes */}
             {selectedNode.type === 'integration' && (
                <div className="space-y-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-bold text-slate-600">Connected: Alto</span>
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Category</label>
                        <select 
                            value={selectedNode.data?.category || 'Leads'}
                            onChange={(e) => updateNodeData('category', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                        >
                            {Object.keys(ALTO_API_STRUCTURE).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Action</label>
                        <select 
                            value={selectedNode.data?.action || ''}
                            onChange={(e) => updateNodeData('action', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                        >
                            {(ALTO_API_STRUCTURE[selectedNode.data?.category || 'Leads'] || []).map(act => (
                                <option key={act} value={act}>{act}</option>
                            ))}
                        </select>
                    </div>
                </div>
             )}

             {/* AI Assistant */}
             <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100">
                <div className="flex items-center gap-2 mb-2 text-cyan-700 font-bold text-xs uppercase">
                   <Bot className="w-3.5 h-3.5" /> AI Insight
                </div>
                <div className="min-h-[60px] text-xs text-slate-600 leading-relaxed">
                   {isAnalyzing ? (
                      <span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div> Generating...</span>
                   ) : aiDescription ? aiDescription : (
                      <span className="opacity-70 italic">Click to generate a description for this step based on the context.</span>
                   )}
                </div>
                {!isAnalyzing && !aiDescription && (
                   <button onClick={generateAiHelp} className="mt-3 w-full py-1.5 bg-white border border-cyan-200 text-cyan-600 text-xs font-bold rounded-lg hover:bg-cyan-50 transition-colors">Generate</button>
                )}
             </div>

             <div className="pt-4 border-t border-slate-100">
                <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                   Edit Logic
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowBuilder;