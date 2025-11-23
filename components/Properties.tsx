

import React, { useState, useEffect } from 'react';
import { Property, PropertyFeedback, PropertyOffer, InboxConversation } from '../types';
import { MOCK_PROPERTIES, MOCK_INBOX_CONVERSATIONS, MOCK_PROPERTY_FEEDBACK, MOCK_PROPERTY_OFFERS } from '../constants';
import { Search, Filter, BedDouble, Bath, Maximize, Plus, MoreHorizontal, Zap, Globe, CheckCircle, AlertCircle, ArrowLeft, MessageSquare, Share2, Edit, Users, TrendingUp, Star, Clock, Calendar, Mail, Phone, MapPin, Video, FileText, Layers, Sun, Map as MapIcon, Key, X, Bot, Send, Lightbulb, Loader, AlertTriangle } from 'lucide-react';
import { analyzePropertyData } from '../services/apiService';

// Helper Components for Icons
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

const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Under Offer': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Let Agreed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Sold': return 'bg-slate-200 text-slate-600 border-slate-300';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
};

const PropertyEditView: React.FC<{ property: Property; onBack: () => void; onSave: (updatedProperty: Property) => void }> = ({ property, onBack, onSave }) => {
    const [editedProperty, setEditedProperty] = useState<Property>(property);
    const [aiSuggestions, setAiSuggestions] = useState<any>(null);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadAISuggestions();
    }, []);

    const loadAISuggestions = async () => {
        setLoadingSuggestions(true);
        const result = await analyzePropertyData({
            address: property.address,
            price: property.price,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            sqft: property.sqft,
            description: property.description,
            features: property.features,
            portalStatus: property.portalStatus,
            epcRating: property.epcRating,
            media: property.media,
            type: property.type
        });
        setAiSuggestions(result);
        setLoadingSuggestions(false);
    };

    const applyAISuggestion = (suggestionKey: string) => {
        if (suggestionKey === 'description' && aiSuggestions?.sellingSummary) {
            setEditedProperty({ ...editedProperty, description: aiSuggestions.sellingSummary });
            setAppliedSuggestions(new Set([...appliedSuggestions, suggestionKey]));
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setEditedProperty({ ...editedProperty, [field]: value });
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...editedProperty.features];
        newFeatures[index] = value;
        setEditedProperty({ ...editedProperty, features: newFeatures });
    };

    const addFeature = () => {
        setEditedProperty({ ...editedProperty, features: [...editedProperty.features, ''] });
    };

    const removeFeature = (index: number) => {
        setEditedProperty({ ...editedProperty, features: editedProperty.features.filter((_, i) => i !== index) });
    };

    const handleSave = () => {
        onSave(editedProperty);
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-20">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4 transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Details
                </button>
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-900">Edit Property</h2>
                    <div className="flex gap-2">
                        <button onClick={onBack} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all">
                            <CheckCircle className="w-4 h-4" /> Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto p-8 space-y-6">
                    {/* AI Auto-Fill Box */}
                    {loadingSuggestions ? (
                        <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-200 flex items-center gap-3">
                            <Loader className="w-5 h-5 text-cyan-600 animate-spin" />
                            <p className="text-sm font-medium text-cyan-700">Loading AI suggestions...</p>
                        </div>
                    ) : aiSuggestions ? (
                        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl border border-cyan-200 flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <Lightbulb className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-slate-900">AI Suggestions Available</p>
                                    <p className="text-xs text-slate-600 mt-1">Click "Apply" next to fields to auto-fill with AI recommendations</p>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {/* Basic Info */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                        <h3 className="font-bold text-slate-900 text-lg">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                                <input type="text" value={editedProperty.address} onChange={(e) => handleInputChange('address', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Postcode</label>
                                <input type="text" value={editedProperty.postcode} onChange={(e) => handleInputChange('postcode', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Price</label>
                                <input type="text" value={editedProperty.price} onChange={(e) => handleInputChange('price', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                                <select value={editedProperty.status} onChange={(e) => handleInputChange('status', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                                    <option>Available</option>
                                    <option>Under Offer</option>
                                    <option>Let Agreed</option>
                                    <option>Sold</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Bedrooms</label>
                                <input type="number" value={editedProperty.bedrooms} onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Bathrooms</label>
                                <input type="number" value={editedProperty.bathrooms} onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Sqft</label>
                                <input type="number" value={editedProperty.sqft} onChange={(e) => handleInputChange('sqft', parseInt(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                            </div>
                        </div>
                    </div>

                    {/* Description with AI */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 text-lg">Description</h3>
                            {aiSuggestions?.sellingSummary && !appliedSuggestions.has('description') && (
                                <button onClick={() => applyAISuggestion('description')} className="flex items-center gap-1 px-3 py-1.5 bg-cyan-100 text-cyan-700 text-xs font-bold rounded hover:bg-cyan-200 transition-colors">
                                    <Lightbulb className="w-3 h-3" /> Apply AI
                                </button>
                            )}
                            {appliedSuggestions.has('description') && (
                                <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
                                    <CheckCircle className="w-3 h-3" /> Applied
                                </span>
                            )}
                        </div>
                        <textarea value={editedProperty.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={4} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Enter property description..." />
                    </div>

                    {/* Features */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 text-lg">Features</h3>
                            <button onClick={addFeature} className="flex items-center gap-1 px-3 py-1.5 bg-cyan-600 text-white text-xs font-bold rounded hover:bg-cyan-700 transition-colors">
                                <Plus className="w-3 h-3" /> Add Feature
                            </button>
                        </div>
                        <div className="space-y-2">
                            {editedProperty.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input type="text" value={feature} onChange={(e) => handleFeatureChange(idx, e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Feature name..." />
                                    <button onClick={() => removeFeature(idx)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                        <h3 className="font-bold text-slate-900 text-lg">Additional Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Council Tax</label>
                                <input type="text" value={editedProperty.additionalDetails.councilTax} onChange={(e) => handleInputChange('additionalDetails', { ...editedProperty.additionalDetails, councilTax: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">EPC Rating</label>
                                <select value={editedProperty.epcRating} onChange={(e) => handleInputChange('epcRating', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                                    <option>A</option><option>B</option><option>C</option><option>D</option><option>E</option><option>F</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Tenure</label>
                                <input type="text" value={editedProperty.additionalDetails.tenure} onChange={(e) => handleInputChange('additionalDetails', { ...editedProperty.additionalDetails, tenure: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Availability</label>
                                <input type="text" value={editedProperty.additionalDetails.availability} onChange={(e) => handleInputChange('additionalDetails', { ...editedProperty.additionalDetails, availability: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                            </div>
                        </div>
                    </div>

                    {/* Portal Status */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                        <h3 className="font-bold text-slate-900 text-lg">Portal Status</h3>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={editedProperty.portalStatus.rightmove} onChange={(e) => handleInputChange('portalStatus', { ...editedProperty.portalStatus, rightmove: e.target.checked })} className="w-4 h-4 rounded" />
                                <span className="text-sm font-medium text-slate-700">Rightmove</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={editedProperty.portalStatus.zoopla} onChange={(e) => handleInputChange('portalStatus', { ...editedProperty.portalStatus, zoopla: e.target.checked })} className="w-4 h-4 rounded" />
                                <span className="text-sm font-medium text-slate-700">Zoopla</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={editedProperty.portalStatus.website} onChange={(e) => handleInputChange('portalStatus', { ...editedProperty.portalStatus, website: e.target.checked })} className="w-4 h-4 rounded" />
                                <span className="text-sm font-medium text-slate-700">Website</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PropertyDetailsView: React.FC<{ property: Property; onBack: () => void; onEdit: () => void }> = ({ property, onBack, onEdit }) => {
    const [activeTab, setActiveTab] = useState<'Overview' | 'Enquiries' | 'Offers' | 'Feedback' | 'AI Suggestions'>('Overview');
    
    // Sub-tabs for the "Overview" section (Content Management)
    const [subTab, setSubTab] = useState<'Overview' | 'Description' | 'Additional Details' | 'Features' | 'Attachments' | 'Floor Plans' | 'Video' | 'Virtual Tour' | 'Map' | 'Energy Performance' | 'Schedule A Tour'>('Overview');
    
    // State for Conversation Modal
    const [activeConversation, setActiveConversation] = useState<InboxConversation | null>(null);

    // AI Suggestions State
    const [aiSuggestions, setAiSuggestions] = useState<any>(null);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [suggestionsLoaded, setSuggestionsLoaded] = useState(false);

    useEffect(() => {
      if (activeTab === 'AI Suggestions' && !suggestionsLoaded) {
        loadAISuggestions();
      }
    }, [activeTab, suggestionsLoaded]);

    const loadAISuggestions = async () => {
      setLoadingSuggestions(true);
      const result = await analyzePropertyData({
        address: property.address,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        sqft: property.sqft,
        description: property.description,
        features: property.features,
        portalStatus: property.portalStatus,
        epcRating: property.epcRating,
        media: property.media,
        type: property.type
      });
      setAiSuggestions(result);
      setLoadingSuggestions(false);
      setSuggestionsLoaded(true);
    };

    const linkedEnquiries = MOCK_INBOX_CONVERSATIONS.filter(c => 
        c.lead.properties.some(p => p.id === property.id)
    );

    const linkedFeedback = MOCK_PROPERTY_FEEDBACK.filter(f => f.propertyId === property.id);
    const linkedOffers = MOCK_PROPERTY_OFFERS.filter(o => o.propertyId === property.id);

    const CONTENT_TABS = [
        'Overview', 'Description', 'Additional Details', 'Features', 'Attachments', 
        'Floor Plans', 'Video', 'Virtual Tour', 'Map', 'Energy Performance', 'Schedule A Tour'
    ];

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] animate-in fade-in slide-in-from-right-4 duration-300 relative">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-20">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4 transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Inventory
                </button>
                
                <div className="flex justify-between items-start">
                    <div className="flex gap-6">
                         <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm shrink-0">
                             <img src={property.image} alt={property.address} className="w-full h-full object-cover" />
                         </div>
                         <div>
                             <div className="flex items-center gap-3 mb-2">
                                 <h1 className="text-2xl font-bold text-slate-900 leading-none">{property.address}</h1>
                                 <span className={`text-xs font-bold px-2 py-1 rounded-md border uppercase tracking-wide ${getStatusColor(property.status)}`}>
                                    {property.status}
                                 </span>
                             </div>
                             <p className="text-xl font-medium text-slate-500 mb-4">{property.price}</p>
                             
                             <div className="flex items-center gap-4 text-slate-400 text-sm">
                                <div className="flex items-center gap-1.5">
                                    <BedDouble className="w-4 h-4" /> <span className="font-semibold text-slate-600">{property.bedrooms}</span> Beds
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Bath className="w-4 h-4" /> <span className="font-semibold text-slate-600">{property.bathrooms}</span> Baths
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Maximize className="w-4 h-4" /> <span className="font-semibold text-slate-600">{property.sqft}</span> sqft
                                </div>
                             </div>
                         </div>
                    </div>

                    <div className="flex gap-2">
                         <button className="p-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"><Share2 className="w-4 h-4" /></button>
                         <button onClick={onEdit} className="p-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"><Edit className="w-4 h-4" /></button>
                         <button className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-700 shadow-lg shadow-cyan-500/20 transition-all">
                             <Zap className="w-4 h-4" /> Actions
                         </button>
                    </div>
                </div>

                {/* Main Activity Tabs */}
                <div className="flex items-center gap-6 mt-8 border-b border-slate-100">
                    {['Overview', 'Enquiries', 'Offers', 'Feedback', 'AI Suggestions'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-4 text-sm font-bold transition-all border-b-2 px-1 flex items-center gap-2
                                ${activeTab === tab 
                                    ? 'text-cyan-700 border-cyan-500' 
                                    : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300'}
                            `}
                        >
                            {tab === 'AI Suggestions' && <Lightbulb className="w-4 h-4" />}
                            {tab}
                            {tab === 'Enquiries' && linkedEnquiries.length > 0 && <span className="ml-2 bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full text-[10px]">{linkedEnquiries.length}</span>}
                            {tab === 'Offers' && linkedOffers.length > 0 && <span className="ml-2 bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full text-[10px]">{linkedOffers.length}</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                {activeTab === 'Overview' && (
                    <div className="space-y-6">
                        {/* SUB-NAVIGATION TABS */}
                        <div className="flex flex-wrap gap-2 mb-6 pb-2 border-b border-slate-100">
                            {CONTENT_TABS.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setSubTab(tab as any)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors
                                        ${subTab === tab
                                            ? 'bg-cyan-600 text-white shadow-sm'
                                            : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-700'}
                                    `}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* SUB-TAB CONTENT */}
                        <div className="animate-in fade-in duration-300">
                            {subTab === 'Overview' && (
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="col-span-2 space-y-6">
                                        {/* Key Metrics Widget */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-slate-400 font-bold text-xs uppercase">Total Views</span>
                                                    <Globe className="w-4 h-4 text-cyan-500" />
                                                </div>
                                                <div className="text-2xl font-bold text-slate-900">{property.stats.views}</div>
                                                <div className="text-xs text-emerald-500 font-medium flex items-center gap-1 mt-1"><TrendingUp className="w-3 h-3" /> +12% this week</div>
                                            </div>
                                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-slate-400 font-bold text-xs uppercase">Enquiries</span>
                                                    <MessageSquare className="w-4 h-4 text-purple-500" />
                                                </div>
                                                <div className="text-2xl font-bold text-slate-900">{property.stats.enquiries}</div>
                                                <div className="text-xs text-slate-500 font-medium mt-1">Last 30 days</div>
                                            </div>
                                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-slate-400 font-bold text-xs uppercase">Portals</span>
                                                    <Share2 className="w-4 h-4 text-orange-500" />
                                                </div>
                                                <div className="flex gap-2 mt-2">
                                                    {property.portalStatus.rightmove && <RightmoveLogo className="w-6 h-6" />}
                                                    {property.portalStatus.zoopla && <ZooplaLogo className="w-6 h-6" />}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                            <h3 className="font-bold text-slate-900 text-sm mb-4">Quick Summary</h3>
                                            <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">{property.description}</p>
                                            <button onClick={() => setSubTab('Description')} className="mt-2 text-cyan-600 text-xs font-bold hover:underline">Read more</button>
                                        </div>
                                    </div>
                                    
                                    {/* Right Sidebar */}
                                    <div className="space-y-6">
                                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                            <h3 className="font-bold text-slate-800 text-sm mb-4">Assigned Agent</h3>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600">
                                                    {property.agent}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900">John Doe</div>
                                                    <div className="text-xs text-slate-500">Senior Negotiator</div>
                                                </div>
                                            </div>
                                            <button className="w-full py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Reassign</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {subTab === 'Description' && (
                                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                                    <h3 className="text-lg font-bold text-slate-900 mb-6">Property Description</h3>
                                    <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-7">
                                        <p>{property.description}</p>
                                        <p className="mt-4">
                                            Viewing is highly recommended to appreciate the quality of finish and location. 
                                            Contact our team today to arrange a viewing.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {subTab === 'Additional Details' && (
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <tbody className="divide-y divide-slate-100">
                                            <tr className="hover:bg-slate-50">
                                                <td className="px-6 py-4 font-medium text-slate-900 w-1/3">Council Tax</td>
                                                <td className="px-6 py-4 text-slate-600">{property.additionalDetails?.councilTax}</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50">
                                                <td className="px-6 py-4 font-medium text-slate-900">Deposit</td>
                                                <td className="px-6 py-4 text-slate-600">{property.additionalDetails?.deposit}</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50">
                                                <td className="px-6 py-4 font-medium text-slate-900">Tenure</td>
                                                <td className="px-6 py-4 text-slate-600">{property.additionalDetails?.tenure}</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50">
                                                <td className="px-6 py-4 font-medium text-slate-900">Availability</td>
                                                <td className="px-6 py-4 text-slate-600">{property.additionalDetails?.availability}</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50">
                                                <td className="px-6 py-4 font-medium text-slate-900">EPC Rating</td>
                                                <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded font-bold text-xs text-white
                                                        ${property.epcRating === 'A' ? 'bg-emerald-600' : 
                                                          property.epcRating === 'B' ? 'bg-emerald-500' : 
                                                          property.epcRating === 'C' ? 'bg-emerald-400' : 
                                                          property.epcRating === 'D' ? 'bg-yellow-500' : 'bg-orange-500'}
                                                    `}>
                                                        {property.epcRating}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {subTab === 'Features' && (
                                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                                    <h3 className="text-lg font-bold text-slate-900 mb-6">Key Features</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {property.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                <CheckCircle className="w-5 h-5 text-cyan-500" />
                                                <span className="text-sm font-medium text-slate-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {subTab === 'Attachments' && (
                                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-cyan-400 hover:text-cyan-600 hover:bg-cyan-50/30 transition-all cursor-pointer group">
                                            <FileText className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                                            <span className="text-sm font-bold">Upload Document</span>
                                            <span className="text-xs mt-1">PDF, DOCX, JPG</span>
                                        </div>
                                        {property.media?.brochureUrl && (
                                             <div className="p-4 border border-slate-200 rounded-xl flex items-center gap-4 relative group hover:shadow-md transition-all">
                                                 <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                                                     <FileText className="w-6 h-6" />
                                                 </div>
                                                 <div>
                                                     <div className="font-bold text-sm text-slate-900">Property_Brochure.pdf</div>
                                                     <div className="text-xs text-slate-500">2.4 MB • Added yesterday</div>
                                                 </div>
                                                 <button className="absolute right-4 p-2 hover:bg-slate-100 rounded-lg"><MoreHorizontal className="w-4 h-4 text-slate-400" /></button>
                                             </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {subTab === 'Floor Plans' && (
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    {property.media?.floorPlanUrl ? (
                                        <div className="aspect-[16/9] bg-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden group">
                                             <Layers className="w-16 h-16 text-slate-300" />
                                             <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                 <button className="px-6 py-2 bg-white rounded-full shadow-lg font-bold text-sm text-slate-900 hover:scale-105 transition-transform">View Fullscreen</button>
                                             </div>
                                             <span className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-xs font-bold backdrop-blur-sm">Main Floor</span>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-slate-400">
                                            <Layers className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                            <p>No floor plans uploaded.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {subTab === 'Video' && (
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    {property.media?.videoUrl ? (
                                        <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden group cursor-pointer">
                                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all">
                                                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                                            </div>
                                            <span className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-xs font-bold">02:45</span>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-slate-400">
                                            <Video className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                            <p>No video tour available.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {subTab === 'Virtual Tour' && (
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                     {property.media?.virtualTourUrl ? (
                                        <div className="aspect-video bg-slate-800 rounded-lg flex flex-col items-center justify-center relative overflow-hidden text-white">
                                            <Globe className="w-12 h-12 mb-4 animate-pulse" />
                                            <p className="font-bold">Loading 3D Matterport Tour...</p>
                                        </div>
                                     ) : (
                                        <div className="text-center py-12 text-slate-400">
                                            <Globe className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                            <p>No virtual tour link found.</p>
                                        </div>
                                     )}
                                </div>
                            )}

                            {subTab === 'Map' && (
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-[400px] relative overflow-hidden group">
                                    {/* Mock Map Background */}
                                    <div className="absolute inset-0 bg-slate-100" style={{backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative">
                                            <div className="w-4 h-4 bg-cyan-500 rounded-full animate-ping absolute inset-0"></div>
                                            <div className="w-4 h-4 bg-cyan-600 rounded-full border-2 border-white relative z-10 shadow-lg"></div>
                                            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-lg shadow-md whitespace-nowrap text-xs font-bold text-slate-800">
                                                {property.address}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md text-xs font-bold text-slate-700 hover:bg-slate-50">Open in Google Maps</button>
                                </div>
                            )}

                            {subTab === 'Energy Performance' && (
                                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                                    <Sun className="w-16 h-16 text-yellow-500 mb-6" />
                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">EPC Rating: {property.epcRating}</h3>
                                        <p className="text-slate-500 text-sm">Certificate valid until November 2030</p>
                                    </div>
                                    
                                    {/* Visual Chart Mock */}
                                    <div className="w-full max-w-md space-y-2">
                                        {['A','B','C','D','E','F','G'].map((grade) => (
                                            <div key={grade} className="flex items-center gap-4">
                                                <div className={`flex-1 h-8 rounded-r-md flex items-center px-3 relative
                                                    ${grade === 'A' ? 'bg-emerald-600 w-[30%]' : 
                                                      grade === 'B' ? 'bg-emerald-500 w-[40%]' :
                                                      grade === 'C' ? 'bg-emerald-400 w-[50%]' :
                                                      grade === 'D' ? 'bg-yellow-500 w-[60%]' :
                                                      grade === 'E' ? 'bg-orange-400 w-[70%]' :
                                                      grade === 'F' ? 'bg-orange-500 w-[80%]' : 'bg-red-500 w-[90%]'}
                                                    ${property.epcRating === grade ? 'opacity-100 shadow-md' : 'opacity-30'}
                                                `}>
                                                    <span className="font-bold text-white text-xs">{grade}</span>
                                                    {property.epcRating === grade && (
                                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xs font-bold">Current</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {subTab === 'Schedule A Tour' && (
                                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
                                     <Key className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
                                     <h3 className="text-lg font-bold text-slate-900 mb-2">Book a Viewing</h3>
                                     <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">Select a slot to book a viewing for a potential applicant or for an inspection.</p>
                                     <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                                         <button className="p-4 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50 transition-all">
                                             <div className="font-bold text-slate-900 mb-1">Tomorrow</div>
                                             <div className="text-xs text-slate-500">10:00 AM</div>
                                         </button>
                                         <button className="p-4 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50 transition-all">
                                             <div className="font-bold text-slate-900 mb-1">Tomorrow</div>
                                             <div className="text-xs text-slate-500">2:00 PM</div>
                                         </button>
                                         <button className="p-4 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50 transition-all">
                                             <div className="font-bold text-slate-900 mb-1">Friday</div>
                                             <div className="text-xs text-slate-500">11:00 AM</div>
                                         </button>
                                     </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'Enquiries' && (
                    <div className="space-y-4">
                        {linkedEnquiries.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-slate-500 font-medium">No enquiries yet.</p>
                            </div>
                        ) : (
                            linkedEnquiries.map(lead => (
                                <div key={lead.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-cyan-200 transition-colors flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600">
                                            {lead.lead.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">{lead.lead.name}</h4>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.lead.email}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.lead.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border
                                                ${lead.lead.status === 'Hot' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                                                  lead.lead.status === 'Qualifying' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                  'bg-slate-50 text-slate-500 border-slate-200'}
                                            `}>
                                                {lead.lead.status}
                                            </span>
                                            <div className="text-[10px] text-slate-400 mt-1">Last active: {lead.lastActivity}</div>
                                        </div>
                                        <button 
                                            onClick={() => setActiveConversation(lead)}
                                            className="p-2 bg-slate-50 hover:bg-cyan-50 text-slate-400 hover:text-cyan-600 rounded-lg transition-colors"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'Offers' && (
                    <div className="space-y-4">
                         {linkedOffers.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-slate-500 font-medium">No offers recorded.</p>
                            </div>
                        ) : (
                            linkedOffers.map(offer => (
                                <div key={offer.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group">
                                     <div>
                                         <div className="flex items-center gap-3 mb-1">
                                             <h4 className="font-bold text-slate-900">{offer.applicantName}</h4>
                                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide border
                                                 ${offer.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                   offer.status === 'Negotiating' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                   offer.status === 'Declined' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                   'bg-slate-50 text-slate-500 border-slate-200'}
                                             `}>
                                                 {offer.status}
                                             </span>
                                         </div>
                                         <div className="text-sm text-slate-500">Offered: <span className="font-bold text-slate-900">{offer.amount}</span> <span className="text-slate-300">•</span> {offer.conditions || 'No conditions'}</div>
                                     </div>
                                     <div className="flex items-center gap-4">
                                         <div className="text-right text-xs text-slate-400">
                                             <div>Submitted</div>
                                             <div className="font-medium text-slate-600">{offer.date}</div>
                                         </div>
                                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                             <button className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700">Accept</button>
                                             <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-slate-50">Counter</button>
                                         </div>
                                     </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'Feedback' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {linkedFeedback.length === 0 ? (
                             <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                                 <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                 <p className="text-slate-500 font-medium">No viewing feedback yet.</p>
                             </div>
                         ) : (
                             linkedFeedback.map(fb => (
                                 <div key={fb.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                     <div className="flex justify-between items-start mb-3">
                                         <div className="flex items-center gap-2">
                                             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">{fb.viewerName.charAt(0)}</div>
                                             <div>
                                                 <div className="text-sm font-bold text-slate-900">{fb.viewerName}</div>
                                                 <div className="text-[10px] text-slate-400">{fb.date}</div>
                                             </div>
                                         </div>
                                         <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1
                                             ${fb.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-600' : 
                                               fb.sentiment === 'Negative' ? 'bg-rose-50 text-rose-600' : 
                                               'bg-slate-50 text-slate-600'}
                                         `}>
                                             {fb.sentiment === 'Positive' ? <TrendingUp className="w-3 h-3" /> : <MoreHorizontal className="w-3 h-3" />}
                                             {fb.sentiment}
                                         </div>
                                     </div>
                                     <p className="text-slate-600 text-sm italic mb-4">"{fb.comment}"</p>
                                     
                                     <div className="flex gap-2 mt-auto pt-3 border-t border-slate-50">
                                         <div className="bg-slate-50 px-2 py-1 rounded text-[10px] font-medium text-slate-500">Interest: <span className="text-slate-800 font-bold">{fb.interestLevel}</span></div>
                                         <div className="bg-slate-50 px-2 py-1 rounded text-[10px] font-medium text-slate-500">Price: <span className="text-slate-800 font-bold">{fb.priceOpinion}</span></div>
                                     </div>
                                 </div>
                             ))
                         )}
                     </div>
                )}

                {activeTab === 'AI Suggestions' && (
                    <div className="space-y-6">
                        {loadingSuggestions ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 flex flex-col items-center gap-3">
                                <Loader className="w-8 h-8 text-cyan-500 animate-spin" />
                                <p className="text-slate-600 font-medium">Analyzing property for improvements...</p>
                            </div>
                        ) : aiSuggestions ? (
                            <>
                                {/* Marketing Hook */}
                                {aiSuggestions.sellingSummary && (
                                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-200">
                                        <div className="flex items-start gap-3">
                                            <Lightbulb className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                                            <div>
                                                <h3 className="font-bold text-slate-900 mb-2">AI Marketing Hook</h3>
                                                <p className="text-slate-700 text-sm leading-relaxed">{aiSuggestions.sellingSummary}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Missing Fields */}
                                {aiSuggestions.missingFields && aiSuggestions.missingFields.length > 0 && (
                                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-2 mb-4">
                                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                                            <h3 className="font-bold text-slate-900 text-lg">Missing Information</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {aiSuggestions.missingFields.map((field: any, idx: number) => (
                                                <div key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                                    <div className={`text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap
                                                        ${field.importance === 'high' ? 'bg-rose-100 text-rose-700' :
                                                          field.importance === 'medium' ? 'bg-amber-100 text-amber-700' :
                                                          'bg-blue-100 text-blue-700'}
                                                    `}>
                                                        {field.importance?.toUpperCase() || 'INFO'}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-slate-900 text-sm">{field.field}</div>
                                                        <p className="text-slate-600 text-xs mt-1">{field.reason}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Improvement Suggestions */}
                                {aiSuggestions.improvements && aiSuggestions.improvements.length > 0 && (
                                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Zap className="w-5 h-5 text-cyan-600" />
                                            <h3 className="font-bold text-slate-900 text-lg">Recommended Improvements</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {aiSuggestions.improvements.map((improvement: any, idx: number) => (
                                                <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-colors cursor-pointer group">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-cyan-700">{improvement.title}</h4>
                                                        <span className={`text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap
                                                            ${improvement.impact === 'high' ? 'bg-emerald-100 text-emerald-700' :
                                                              improvement.impact === 'medium' ? 'bg-blue-100 text-blue-700' :
                                                              'bg-slate-100 text-slate-700'}
                                                        `}>
                                                            {improvement.impact?.toUpperCase() || 'MEDIUM'} IMPACT
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-600 text-sm">{improvement.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-slate-500 font-medium">Could not generate suggestions. Please try again.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {/* Conversation Modal */}
            {activeConversation && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-2xl h-[600px] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="h-16 px-6 bg-white border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-50 to-blue-100 flex items-center justify-center text-cyan-700 font-bold">
                                    {activeConversation.lead.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm">{activeConversation.lead.name}</h3>
                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                        <span>{activeConversation.source}</span>
                                        <span>•</span>
                                        <span>{activeConversation.lead.status}</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setActiveConversation(null)}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 custom-scrollbar">
                             {activeConversation.messages.map((msg) => {
                                 const isMe = msg.sender === 'agent';
                                 const isAi = msg.sender === 'ai';
                                 const isUser = msg.sender === 'user';
                                 const isSystem = msg.sender === 'system';

                                 if (isSystem) {
                                   return (
                                     <div key={msg.id} className="flex justify-center my-4">
                                       <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-500 shadow-sm">
                                         <Bot className="w-3 h-3" />
                                         {msg.text}
                                       </div>
                                     </div>
                                   );
                                 }

                                 return (
                                   <div key={msg.id} className={`flex gap-3 ${isUser ? 'justify-start' : 'justify-end'}`}>
                                      {isUser && (
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500 text-xs font-bold">
                                           {activeConversation.lead.name[0]}
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
                        </div>

                        {/* Modal Input */}
                        <div className="p-4 bg-white border-t border-slate-200">
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
                                <input 
                                    type="text" 
                                    placeholder="Type a reply..." 
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2" 
                                />
                                <button className="p-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [filterType, setFilterType] = useState<'All' | 'Sales' | 'Lettings'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const filteredProperties = properties.filter(p => {
    const matchType = filterType === 'All' || p.type === filterType;
    const matchSearch = p.address.toLowerCase().includes(searchQuery.toLowerCase()) || p.postcode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  const handleSaveProperty = (updatedProperty: Property) => {
    setProperties(properties.map(p => p.id === updatedProperty.id ? updatedProperty : p));
    setSelectedProperty(updatedProperty);
    setIsEditMode(false);
  };

  const handleEditProperty = () => {
    setIsEditMode(true);
  };

  const handleBackToDetails = () => {
    setIsEditMode(false);
  };

  if (selectedProperty && isEditMode) {
      return <PropertyEditView property={selectedProperty} onBack={handleBackToDetails} onSave={handleSaveProperty} />;
  }

  if (selectedProperty) {
      return <PropertyDetailsView property={selectedProperty} onBack={() => setSelectedProperty(null)} onEdit={handleEditProperty} />;
  }

  return (
    <div className="h-full bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <div className="h-18 px-8 flex items-center justify-between bg-white border-b border-slate-200 shrink-0">
        <h2 className="text-lg font-bold text-slate-900">Property Inventory</h2>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-600" />
            <input 
              type="text" 
              placeholder="Search address or postcode..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-cyan-500/20 w-64 transition-all" 
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/10">
            <Plus className="w-4 h-4" /> Add Property
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-8 py-4 flex items-center gap-4">
         <div className="flex p-1 bg-slate-200/50 rounded-lg">
            {['All', 'Sales', 'Lettings'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all
                  ${filterType === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}
                `}
              >
                {type}
              </button>
            ))}
         </div>
         <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Showing {filteredProperties.length} properties</span>
         </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-0">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map(property => (
              <div 
                key={property.id} 
                onClick={() => setSelectedProperty(property)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-cyan-200 transition-all group flex flex-col h-[340px] cursor-pointer"
              >
                 {/* Image Section */}
                 <div className="h-48 relative bg-slate-100 overflow-hidden">
                    <img src={property.image} alt={property.address} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    
                    <div className="absolute top-3 left-3 flex gap-2">
                       <span className={`text-[10px] font-bold px-2 py-1 rounded-md border backdrop-blur-md shadow-sm uppercase tracking-wide ${getStatusColor(property.status)}`}>
                          {property.status}
                       </span>
                    </div>

                    <div className="absolute top-3 right-3">
                       <button className="p-1.5 bg-white/80 hover:bg-white backdrop-blur-md rounded-full text-slate-600 hover:text-cyan-600 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                       </button>
                    </div>

                    {/* Quick Stats Overlay on Hover */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                       <div className="flex justify-between items-center text-white text-xs font-medium">
                          <div className="flex gap-3">
                             <span>{property.stats.views} Views</span>
                             <span>{property.stats.enquiries} Enquiries</span>
                          </div>
                          <div className="flex gap-2">
                             {property.portalStatus.rightmove && <RightmoveLogo className="w-4 h-4" />}
                             {property.portalStatus.zoopla && <ZooplaLogo className="w-4 h-4" />}
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Content Section */}
                 <div className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-1">
                       <h3 className="text-lg font-bold text-slate-900">{property.price}</h3>
                       <span className="text-[10px] font-bold text-slate-400 uppercase border border-slate-200 px-1.5 py-0.5 rounded">{property.type}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-600 truncate mb-3" title={property.address}>{property.address}</p>
                    
                    {/* Features */}
                    <div className="flex items-center gap-4 text-slate-400 mb-4">
                       <div className="flex items-center gap-1.5">
                          <BedDouble className="w-4 h-4" />
                          <span className="text-xs font-bold">{property.bedrooms}</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <Bath className="w-4 h-4" />
                          <span className="text-xs font-bold">{property.bathrooms}</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <Maximize className="w-4 h-4" />
                          <span className="text-xs font-bold">{property.sqft} <span className="text-[9px] font-normal">sqft</span></span>
                       </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
                             {property.agent}
                          </div>
                          <span className="text-[10px] text-slate-400">Agent</span>
                       </div>
                       
                       <button className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 hover:bg-cyan-50 px-2 py-1 rounded transition-colors">
                          <Zap className="w-3 h-3" /> Automate
                       </button>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Properties;
