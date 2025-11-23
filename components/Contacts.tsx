import React, { useState } from 'react';
import { Contact, ContactType } from '../types';
import { MASTER_CONTACTS } from '../contactsData';
import { 
  Search, Plus, Phone, Mail, MessageCircle, Star, Building2, 
  User, Users, Wrench, Package, UserPlus, MapPin, Calendar,
  ExternalLink, X
} from 'lucide-react';

type ContactTab = 'All' | ContactType;

const CONTACT_TABS: { id: ContactTab; label: string; icon: React.ReactNode }[] = [
  { id: 'All', label: 'All Contacts', icon: <Users className="w-4 h-4" /> },
  { id: 'Landlord', label: 'Landlords', icon: <Building2 className="w-4 h-4" /> },
  { id: 'Tenant', label: 'Tenants', icon: <User className="w-4 h-4" /> },
  { id: 'Buyer', label: 'Buyers', icon: <UserPlus className="w-4 h-4" /> },
  { id: 'Vendor', label: 'Vendors', icon: <User className="w-4 h-4" /> },
  { id: 'Applicant', label: 'Applicants', icon: <UserPlus className="w-4 h-4" /> },
  { id: 'Contractor', label: 'Contractors', icon: <Wrench className="w-4 h-4" /> },
  { id: 'Supplier', label: 'Suppliers', icon: <Package className="w-4 h-4" /> },
  { id: 'Lead', label: 'Leads', icon: <Star className="w-4 h-4" /> }
];

const Contacts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ContactTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter contacts based on active tab and search
  const filteredContacts = MASTER_CONTACTS.filter(contact => {
    const matchesTab = activeTab === 'All' || contact.type === activeTab;
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'Active': 'bg-green-100 text-green-700',
      'Inactive': 'bg-gray-100 text-gray-700',
      'Prospect': 'bg-blue-100 text-blue-700'
    };
    return colors[status] || colors['Prospect'];
  };

  const getAvailabilityBadge = (availability?: string) => {
    const colors: Record<string, string> = {
      'Available': 'bg-green-100 text-green-700',
      'Busy': 'bg-yellow-100 text-yellow-700',
      'Unavailable': 'bg-red-100 text-red-700'
    };
    return colors[availability || ''] || 'bg-gray-100 text-gray-700';
  };

  const renderContactDetails = (contact: Contact) => {
    return (
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{contact.name}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    {contact.type}
                  </span>
                  <span className={`${getStatusBadge(contact.status)} px-3 py-1 rounded-full text-sm font-medium`}>
                    {contact.status}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedContact(null)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              <Phone className="w-4 h-4" />
              Call
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 350px)' }}>
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600">Email</label>
                <p className="text-slate-900 font-medium">{contact.email}</p>
              </div>
              <div>
                <label className="text-sm text-slate-600">Phone</label>
                <p className="text-slate-900 font-medium">{contact.phone}</p>
              </div>
              {contact.address && (
                <>
                  <div>
                    <label className="text-sm text-slate-600">Address</label>
                    <p className="text-slate-900 font-medium">{contact.address}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">City</label>
                    <p className="text-slate-900 font-medium">{contact.city}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">Postcode</label>
                    <p className="text-slate-900 font-medium">{contact.postcode}</p>
                  </div>
                </>
              )}
              <div>
                <label className="text-sm text-slate-600">Assigned Agent</label>
                <p className="text-slate-900 font-medium">{contact.assignedAgent || 'Unassigned'}</p>
              </div>
            </div>
          </div>

          {/* Type-Specific Information */}
          {contact.type === 'Landlord' && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Landlord Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600">Portfolio Value</label>
                  <p className="text-slate-900 font-medium">{contact.portfolioValue || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Number of Properties</label>
                  <p className="text-slate-900 font-medium">{contact.propertyCount || 0}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Payment Method</label>
                  <p className="text-slate-900 font-medium">{contact.paymentMethod || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {contact.type === 'Tenant' && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Tenancy Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600">Lease Start</label>
                  <p className="text-slate-900 font-medium">{contact.leaseStart || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Lease End</label>
                  <p className="text-slate-900 font-medium">{contact.leaseEnd || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Rent Amount</label>
                  <p className="text-slate-900 font-medium">{contact.rentAmount || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Deposit Paid</label>
                  <p className="text-slate-900 font-medium">{contact.depositPaid || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {(contact.type === 'Buyer' || contact.type === 'Vendor') && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">{contact.type} Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600">Budget/Value</label>
                  <p className="text-slate-900 font-medium">{contact.budget || 'N/A'}</p>
                </div>
                {contact.preApproved !== undefined && (
                  <div>
                    <label className="text-sm text-slate-600">Pre-Approved</label>
                    <p className="text-slate-900 font-medium">{contact.preApproved ? 'Yes' : 'No'}</p>
                  </div>
                )}
                {contact.solicitor && (
                  <div>
                    <label className="text-sm text-slate-600">Solicitor</label>
                    <p className="text-slate-900 font-medium">{contact.solicitor}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {contact.type === 'Contractor' && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Contractor Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600">Trade</label>
                  <p className="text-slate-900 font-medium">{contact.trade || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Hourly Rate</label>
                  <p className="text-slate-900 font-medium">{contact.hourlyRate || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Availability</label>
                  <span className={`${getAvailabilityBadge(contact.availability)} px-3 py-1 rounded-full text-sm font-medium inline-block`}>
                    {contact.availability || 'Unknown'}
                  </span>
                </div>
                {contact.rating && (
                  <div>
                    <label className="text-sm text-slate-600">Rating</label>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-slate-900 font-medium">{contact.rating}/5</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {contact.type === 'Applicant' && contact.budget && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Applicant Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600">Budget</label>
                  <p className="text-slate-900 font-medium">{contact.budget}</p>
                </div>
                {contact.source && (
                  <div>
                    <label className="text-sm text-slate-600">Source</label>
                    <p className="text-slate-900 font-medium">{contact.source}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {contact.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {contact.notes && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Notes</h3>
              <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">{contact.notes}</p>
            </div>
          )}

          {/* Linked Properties */}
          {contact.linkedProperties && contact.linkedProperties.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Linked Properties</h3>
              <div className="space-y-2">
                {contact.linkedProperties.map((propId) => (
                  <div key={propId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-700">{propId}</span>
                    <button className="text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
                      <ExternalLink className="w-4 h-4" />
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Activity</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                <span>Created: {contact.createdDate}</span>
              </div>
              {contact.lastContact && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>Last Contact: {contact.lastContact}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
            <p className="text-slate-600 text-sm mt-1">Manage your landlords, tenants, buyers, and more</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex items-center gap-1 overflow-x-auto">
          {CONTACT_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap
                ${activeTab === tab.id
                  ? 'border-cyan-500 text-cyan-600 font-medium'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
                }
              `}
            >
              {tab.icon}
              {tab.label}
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-medium
                ${activeTab === tab.id ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-600'}
              `}>
                {tab.id === 'All' 
                  ? MASTER_CONTACTS.length 
                  : MASTER_CONTACTS.filter(c => c.type === tab.id).length
                }
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search contacts by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {selectedContact ? (
          <div className="h-full p-6">
            {renderContactDetails(selectedContact)}
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tags</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredContacts.map((contact) => (
                    <tr 
                      key={contact.id} 
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedContact(contact)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{contact.name}</div>
                            <div className="text-sm text-slate-500">{contact.assignedAgent || 'Unassigned'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                          {contact.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-slate-900">{contact.email}</div>
                          <div className="text-slate-500">{contact.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`${getStatusBadge(contact.status)} px-3 py-1 rounded-full text-sm font-medium`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                          {contact.tags.length > 2 && (
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                              +{contact.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Call"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Email"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); }}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredContacts.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">No contacts found</p>
                  <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Add New Contact</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-600">Add contact form coming soon...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
