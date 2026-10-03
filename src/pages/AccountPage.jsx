import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { mockOrders, getStatusLabel, getStatusColor } from '../data/orders';
import { formatPrice } from '../data/products';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { User, MapPin, Package, Settings, LogOut, Edit, Trash2, Plus, Bell, Globe, Shield } from 'lucide-react';

export default function AccountPage() {
  const { user, logout, addresses, addAddress, deleteAddress, updateProfile } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [notifs, setNotifs] = useState({ email: true, sms: true, push: false });

  if (!user) {
    return (
      <div className="container-main py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your account</h2>
        <Button onClick={() => navigate('/login')}>Log In</Button>
      </div>
    );
  }

  const handleSaveProfile = () => {
    updateProfile(profileData);
    setIsEditingProfile(false);
    addNotification('success', 'Profile updated successfully');
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    addAddress({ id: Date.now().toString(), ...newAddress });
    setShowAddAddress(false);
    setNewAddress({ name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false });
    addNotification('success', 'Address added successfully');
  };

  const handleDeleteAddress = (id) => {
    deleteAddress(id);
    addNotification('success', 'Address removed');
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(false);
    addNotification('success', 'Account deletion request submitted');
    setTimeout(() => {
      logout();
      navigate('/');
    }, 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin size={18} /> },
    { id: 'orders', label: 'Orders', icon: <Package size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  return (
    <div className="container-main py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
            <div className="p-6 bg-brand-dark text-white text-center">
              <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3 shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-bold">{user.name}</h3>
              <p className="text-xs text-gray-300 mt-1">{user.email}</p>
            </div>
            <div className="p-2 flex flex-row overflow-x-auto md:flex-col scrollbar-hide">
              {tabs.map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-red-50 text-brand-red' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
              <div className="md:border-t border-gray-100 my-2 mx-2"></div>
              <button onClick={handleLogout} className="flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap">
                <span className="mr-3"><LogOut size={18} /></span>
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 min-h-[500px]">
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-brand-black">Personal Information</h2>
                  {!isEditingProfile && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>
                      <Edit size={16} className="mr-2" /> Edit
                    </Button>
                  )}
                </div>

                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} disabled={!isEditingProfile} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-brand-red disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} disabled={!isEditingProfile} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-brand-red disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} disabled={!isEditingProfile} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-brand-red disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>

                  {isEditingProfile && (
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleSaveProfile}>Save Changes</Button>
                      <Button variant="ghost" onClick={() => { setIsEditingProfile(false); setProfileData({ name: user.name, email: user.email, phone: user.phone }); }}>Cancel</Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-brand-black">Saved Addresses</h2>
                  <Button variant="outline" size="sm" onClick={() => setShowAddAddress(true)}>
                    <Plus size={16} className="mr-2" /> Add New
                  </Button>
                </div>

                {showAddAddress && (
                  <form onSubmit={handleAddAddress} className="border border-gray-200 rounded-xl p-5 bg-gray-50 space-y-4 mb-6">
                    <h3 className="font-bold text-sm text-brand-black">Add New Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-medium text-gray-700 mb-1">Name</label><input required type="text" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} className="w-full text-sm border border-gray-300 rounded-lg p-2.5 outline-none focus:border-brand-red bg-white" /></div>
                      <div><label className="block text-xs font-medium text-gray-700 mb-1">Phone</label><input required type="tel" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="w-full text-sm border border-gray-300 rounded-lg p-2.5 outline-none focus:border-brand-red bg-white" /></div>
                    </div>
                    <div><label className="block text-xs font-medium text-gray-700 mb-1">Address Line 1</label><input required type="text" value={newAddress.line1} onChange={e => setNewAddress({...newAddress, line1: e.target.value})} className="w-full text-sm border border-gray-300 rounded-lg p-2.5 outline-none focus:border-brand-red bg-white" /></div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div><label className="block text-xs font-medium text-gray-700 mb-1">City</label><input required type="text" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full text-sm border border-gray-300 rounded-lg p-2.5 outline-none focus:border-brand-red bg-white" /></div>
                      <div><label className="block text-xs font-medium text-gray-700 mb-1">State</label><input required type="text" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full text-sm border border-gray-300 rounded-lg p-2.5 outline-none focus:border-brand-red bg-white" /></div>
                      <div><label className="block text-xs font-medium text-gray-700 mb-1">Pincode</label><input required type="text" value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} className="w-full text-sm border border-gray-300 rounded-lg p-2.5 outline-none focus:border-brand-red bg-white" /></div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button type="submit">Save Address</Button>
                      <Button type="button" variant="ghost" onClick={() => setShowAddAddress(false)}>Cancel</Button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses?.map(addr => (
                    <div key={addr.id} className="border border-gray-200 rounded-xl p-5 relative group hover:border-brand-red transition-colors">
                      {addr.isDefault && <Badge variant="sale" className="absolute top-4 right-4">Default</Badge>}
                      <h4 className="font-bold text-brand-black mb-1">{addr.name}</h4>
                      <div className="text-sm text-gray-600 space-y-1 mb-4">
                        <p>{addr.line1}</p>
                        {addr.line2 && <p>{addr.line2}</p>}
                        <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p>Phone: {addr.phone}</p>
                      </div>
                      <div className="flex gap-3 text-sm">
                        <button className="text-gray-500 hover:text-brand-black flex items-center"><Edit size={14} className="mr-1" /> Edit</button>
                        <button onClick={() => handleDeleteAddress(addr.id)} className="text-red-500 hover:text-red-700 flex items-center"><Trash2 size={14} className="mr-1" /> Delete</button>
                      </div>
                    </div>
                  ))}
                  {addresses?.length === 0 && !showAddAddress && (
                    <div className="col-span-full py-8 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                      No saved addresses. Add one to make checkout faster.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-brand-black">Recent Orders</h2>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/account/orders')}>View All</Button>
                </div>

                <div className="space-y-4">
                  {mockOrders.slice(0, 3).map(order => (
                    <div key={order.id} className="border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-brand-black">DS-{order.id}</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">Ordered on {new Date(order.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500 mt-1">{order.items.length} items • {formatPrice(order.total)}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/order-tracking/${order.id}`)}>Track Order</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="animate-fade-in max-w-lg">
                <h2 className="text-xl font-bold text-brand-black mb-6">Account Settings</h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="font-bold text-md mb-4 flex items-center"><Bell size={18} className="mr-2 text-gray-400" /> Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                        <span className="text-sm font-medium">Email Updates</span>
                        <input type="checkbox" checked={notifs.email} onChange={e => setNotifs({...notifs, email: e.target.checked})} className="w-4 h-4 text-brand-red focus:ring-brand-red rounded" />
                      </label>
                      <label className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                        <span className="text-sm font-medium">SMS Alerts</span>
                        <input type="checkbox" checked={notifs.sms} onChange={e => setNotifs({...notifs, sms: e.target.checked})} className="w-4 h-4 text-brand-red focus:ring-brand-red rounded" />
                      </label>
                      <label className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                        <span className="text-sm font-medium">Push Notifications</span>
                        <input type="checkbox" checked={notifs.push} onChange={e => setNotifs({...notifs, push: e.target.checked})} className="w-4 h-4 text-brand-red focus:ring-brand-red rounded" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-md mb-4 flex items-center"><Globe size={18} className="mr-2 text-gray-400" /> Preferences</h3>
                    <div className="p-3 border border-gray-100 rounded-lg">
                      <label className="block text-sm font-medium mb-2">Language</label>
                      <select className="w-full border border-gray-300 rounded p-2 text-sm outline-none">
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-bold text-md text-red-600 mb-2 flex items-center"><Shield size={18} className="mr-2" /> Danger Zone</h3>
                    <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                    <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>Delete Account</Button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Account" size="sm">
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-6">Are you absolutely sure you want to delete your account? This action cannot be undone and you will lose all your order history and saved preferences.</p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" className="flex-1" onClick={handleDeleteAccount}>Yes, Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
