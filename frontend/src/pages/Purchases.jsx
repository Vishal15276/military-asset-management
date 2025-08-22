import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Package, 
  DollarSign,
  MapPin,
  User,
  Eye,
  Edit,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

function Purchases() {
  const { user, hasPermission } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBase, setFilterBase] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');

  // Mock purchase data
  const [purchases, setPurchases] = useState([
    {
      id: 'PO-2024-001',
      equipmentType: 'M4A1 Rifle',
      quantity: 25,
      unitCost: 890,
      totalCost: 22250,
      vendor: 'Defense Solutions Inc.',
      base: 'Base Alpha',
      purchaseDate: new Date('2024-01-15'),
      deliveryDate: new Date('2024-01-25'),
      status: 'Delivered',
      approvedBy: 'Commander Johnson',
      notes: 'Standard infantry rifles for Delta Company'
    },
    {
      id: 'PO-2024-002',
      equipmentType: 'Night Vision Goggles',
      quantity: 12,
      unitCost: 2500,
      totalCost: 30000,
      vendor: 'OpTech Systems',
      base: 'Base Beta',
      purchaseDate: new Date('2024-01-18'),
      deliveryDate: new Date('2024-02-01'),
      status: 'In Transit',
      approvedBy: 'Commander Smith',
      notes: 'AN/PVS-14 for special operations unit'
    },
    {
      id: 'PO-2024-003',
      equipmentType: 'Medical Supplies',
      quantity: 100,
      unitCost: 45,
      totalCost: 4500,
      vendor: 'MedCorp International',
      base: 'Base Gamma',
      purchaseDate: new Date('2024-01-20'),
      deliveryDate: new Date('2024-01-28'),
      status: 'Delivered',
      approvedBy: 'Dr. Williams',
      notes: 'First aid kits and emergency medical supplies'
    }
  ]);

  const [newPurchase, setNewPurchase] = useState({
    equipmentType: '',
    quantity: '',
    unitCost: '',
    vendor: '',
    base: user?.base || '',
    deliveryDate: '',
    notes: ''
  });

  const handleAddPurchase = (e) => {
    e.preventDefault();
    const purchase = {
      id: `PO-2024-${String(purchases.length + 1).padStart(3, '0')}`,
      ...newPurchase,
      quantity: parseInt(newPurchase.quantity),
      unitCost: parseFloat(newPurchase.unitCost),
      totalCost: parseInt(newPurchase.quantity) * parseFloat(newPurchase.unitCost),
      purchaseDate: new Date(),
      status: 'Pending Approval',
      approvedBy: user?.fullName || 'System'
    };
    
    setPurchases([purchase, ...purchases]);
    setNewPurchase({
      equipmentType: '',
      quantity: '',
      unitCost: '',
      vendor: '',
      base: user?.base || '',
      deliveryDate: '',
      notes: ''
    });
    setShowAddModal(false);
  };

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.equipmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBase = filterBase === 'all' || purchase.base === filterBase;
    
    let matchesDate = true;
    if (filterDateRange !== 'all') {
      const days = parseInt(filterDateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      matchesDate = purchase.purchaseDate >= cutoffDate;
    }

    return matchesSearch && matchesBase && matchesDate;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Pending Approval': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchases</h1>
          <p className="text-gray-600 mt-1">Manage equipment purchases and procurement</p>
        </div>
        
        {hasPermission('manage_purchases') && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Purchase</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search purchases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {hasPermission('manage_all') && (
            <select 
              value={filterBase}
              onChange={(e) => setFilterBase(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Bases</option>
              <option value="Base Alpha">Base Alpha</option>
              <option value="Base Beta">Base Beta</option>
              <option value="Base Gamma">Base Gamma</option>
            </select>
          )}

          <select 
            value={filterDateRange}
            onChange={(e) => setFilterDateRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>

          <div className="flex items-center text-sm text-gray-600">
            <Filter className="w-4 h-4 mr-1" />
            {filteredPurchases.length} of {purchases.length} purchases
          </div>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Purchase Order</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Equipment</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Quantity</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Total Cost</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Base</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{purchase.id}</div>
                    <div className="text-sm text-gray-500">{purchase.vendor}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{purchase.equipmentType}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{purchase.quantity}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">${purchase.totalCost.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{purchase.base}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                      {purchase.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500 text-sm">
                    {format(purchase.purchaseDate, 'MMM dd, yyyy')}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedPurchase(purchase);
                          setShowDetailModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {hasPermission('manage_purchases') && (
                        <button
                          className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                          title="Edit Purchase"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Purchase Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">New Purchase Order</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddPurchase} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Type</label>
                  <input
                    type="text"
                    required
                    value={newPurchase.equipmentType}
                    onChange={(e) => setNewPurchase({ ...newPurchase, equipmentType: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., M4A1 Rifle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newPurchase.quantity}
                    onChange={(e) => setNewPurchase({ ...newPurchase, quantity: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Cost ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newPurchase.unitCost}
                    onChange={(e) => setNewPurchase({ ...newPurchase, unitCost: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                  <input
                    type="text"
                    required
                    value={newPurchase.vendor}
                    onChange={(e) => setNewPurchase({ ...newPurchase, vendor: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Vendor name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base</label>
                  <select
                    required
                    value={newPurchase.base}
                    onChange={(e) => setNewPurchase({ ...newPurchase, base: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Base</option>
                    <option value="Base Alpha">Base Alpha</option>
                    <option value="Base Beta">Base Beta</option>
                    <option value="Base Gamma">Base Gamma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery Date</label>
                  <input
                    type="date"
                    required
                    value={newPurchase.deliveryDate}
                    onChange={(e) => setNewPurchase({ ...newPurchase, deliveryDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={newPurchase.notes}
                  onChange={(e) => setNewPurchase({ ...newPurchase, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes or specifications..."
                />
              </div>

              {newPurchase.quantity && newPurchase.unitCost && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800 font-medium">Total Cost:</span>
                    <span className="text-blue-900 font-bold text-lg">
                      ${(parseInt(newPurchase.quantity || 0) * parseFloat(newPurchase.unitCost || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                >
                  Create Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Purchase Detail Modal */}
      {showDetailModal && selectedPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Purchase Order Details</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">PO Number:</span> <span className="font-medium">{selectedPurchase.id}</span></div>
                    <div><span className="text-gray-500">Status:</span> <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPurchase.status)}`}>{selectedPurchase.status}</span></div>
                    <div><span className="text-gray-500">Order Date:</span> {format(selectedPurchase.purchaseDate, 'MMM dd, yyyy')}</div>
                    <div><span className="text-gray-500">Delivery Date:</span> {format(selectedPurchase.deliveryDate, 'MMM dd, yyyy')}</div>
                    <div><span className="text-gray-500">Approved By:</span> {selectedPurchase.approvedBy}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Item Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Equipment:</span> <span className="font-medium">{selectedPurchase.equipmentType}</span></div>
                    <div><span className="text-gray-500">Quantity:</span> {selectedPurchase.quantity}</div>
                    <div><span className="text-gray-500">Unit Cost:</span> ${selectedPurchase.unitCost.toLocaleString()}</div>
                    <div><span className="text-gray-500">Total Cost:</span> <span className="font-bold text-lg">${selectedPurchase.totalCost.toLocaleString()}</span></div>
                    <div><span className="text-gray-500">Base:</span> {selectedPurchase.base}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Vendor Information</h4>
                <div className="text-sm">
                  <div><span className="text-gray-500">Vendor:</span> <span className="font-medium">{selectedPurchase.vendor}</span></div>
                </div>
              </div>

              {selectedPurchase.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedPurchase.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Purchases;