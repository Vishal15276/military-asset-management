import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  User, 
  Package, 
  MapPin,
  Calendar,
  Eye,
  Edit,
  Trash2,
  X,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

function Assignments() {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('assignments');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showExpendModal, setShowExpendModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBase, setFilterBase] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock assignments data
  const [assignments, setAssignments] = useState([
    {
      id: 'AS-2024-001',
      equipmentType: 'M4A1 Rifle',
      serialNumber: 'M4-789123',
      assignedTo: 'Sgt. John Martinez',
      personnelId: 'P-12345',
      rank: 'Sergeant',
      unit: 'Delta Company',
      base: 'Base Alpha',
      assignmentDate: new Date('2024-01-15'),
      returnDate: null,
      condition: 'Good',
      status: 'Active',
      assignedBy: 'Commander Johnson',
      notes: 'Standard service rifle assignment'
    },
    {
      id: 'AS-2024-002',
      equipmentType: 'Night Vision Goggles',
      serialNumber: 'NVG-456789',
      assignedTo: 'Cpl. Sarah Wilson',
      personnelId: 'P-67890',
      rank: 'Corporal',
      unit: 'Charlie Squad',
      base: 'Base Alpha',
      assignmentDate: new Date('2024-01-18'),
      returnDate: null,
      condition: 'Excellent',
      status: 'Active',
      assignedBy: 'Lt. Thompson',
      notes: 'Night operations specialist equipment'
    }
  ]);

  // Mock expenditures data
  const [expenditures, setExpenditures] = useState([
    {
      id: 'EX-2024-001',
      equipmentType: '5.56mm Ammunition',
      quantity: 500,
      expendedBy: 'Delta Company',
      personnelId: 'UNIT-001',
      base: 'Base Alpha',
      expenditureDate: new Date('2024-01-20'),
      reason: 'Training Exercise',
      authorizedBy: 'Commander Johnson',
      unitCost: 0.45,
      totalCost: 225,
      notes: 'Live fire training exercise'
    },
    {
      id: 'EX-2024-002',
      equipmentType: 'Medical Supplies',
      quantity: 25,
      expendedBy: 'Field Medic Team',
      personnelId: 'UNIT-002',
      base: 'Base Beta',
      expenditureDate: new Date('2024-01-22'),
      reason: 'Medical Treatment',
      authorizedBy: 'Dr. Williams',
      unitCost: 12.50,
      totalCost: 312.50,
      notes: 'Emergency medical response'
    }
  ]);

  const [newAssignment, setNewAssignment] = useState({
    equipmentType: '',
    serialNumber: '',
    assignedTo: '',
    personnelId: '',
    rank: '',
    unit: '',
    base: user?.base || '',
    notes: ''
  });

  const [newExpenditure, setNewExpenditure] = useState({
    equipmentType: '',
    quantity: '',
    expendedBy: '',
    reason: '',
    unitCost: '',
    notes: ''
  });

  const handleAddAssignment = (e) => {
    e.preventDefault();
    const assignment = {
      id: `AS-2024-${String(assignments.length + 1).padStart(3, '0')}`,
      ...newAssignment,
      assignmentDate: new Date(),
      returnDate: null,
      condition: 'Good',
      status: 'Active',
      assignedBy: user?.fullName || 'System'
    };
    
    setAssignments([assignment, ...assignments]);
    setNewAssignment({
      equipmentType: '',
      serialNumber: '',
      assignedTo: '',
      personnelId: '',
      rank: '',
      unit: '',
      base: user?.base || '',
      notes: ''
    });
    setShowAssignModal(false);
  };

  const handleAddExpenditure = (e) => {
    e.preventDefault();
    const expenditure = {
      id: `EX-2024-${String(expenditures.length + 1).padStart(3, '0')}`,
      ...newExpenditure,
      quantity: parseInt(newExpenditure.quantity),
      unitCost: parseFloat(newExpenditure.unitCost),
      totalCost: parseInt(newExpenditure.quantity) * parseFloat(newExpenditure.unitCost),
      expenditureDate: new Date(),
      base: user?.base || 'Base Alpha',
      authorizedBy: user?.fullName || 'System'
    };
    
    setExpenditures([expenditure, ...expenditures]);
    setNewExpenditure({
      equipmentType: '',
      quantity: '',
      expendedBy: '',
      reason: '',
      unitCost: '',
      notes: ''
    });
    setShowExpendModal(false);
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.equipmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBase = filterBase === 'all' || assignment.base === filterBase;
    const matchesStatus = filterStatus === 'all' || assignment.status.toLowerCase() === filterStatus;

    return matchesSearch && matchesBase && matchesStatus;
  });

  const filteredExpenditures = expenditures.filter(expenditure => {
    const matchesSearch = expenditure.equipmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expenditure.expendedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expenditure.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBase = filterBase === 'all' || expenditure.base === filterBase;

    return matchesSearch && matchesBase;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Returned': return 'bg-blue-100 text-blue-800';
      case 'Lost': return 'bg-red-100 text-red-800';
      case 'Damaged': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Excellent': return 'text-green-600';
      case 'Good': return 'text-blue-600';
      case 'Fair': return 'text-yellow-600';
      case 'Poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments & Expenditures</h1>
          <p className="text-gray-600 mt-1">Manage asset assignments and track expenditures</p>
        </div>
        
        {hasPermission('manage_assignments') && (
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAssignModal(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Assignment</span>
            </button>
            <button
              onClick={() => setShowExpendModal(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Record Expenditure</span>
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'assignments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Asset Assignments
          </button>
          <button
            onClick={() => setActiveTab('expenditures')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'expenditures'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Expenditures
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
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

            {activeTab === 'assignments' && (
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="returned">Returned</option>
                <option value="lost">Lost</option>
                <option value="damaged">Damaged</option>
              </select>
            )}

            <div className="flex items-center text-sm text-gray-600">
              <Filter className="w-4 h-4 mr-1" />
              {activeTab === 'assignments' 
                ? `${filteredAssignments.length} of ${assignments.length} assignments`
                : `${filteredExpenditures.length} of ${expenditures.length} expenditures`
              }
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-x-auto">
          {activeTab === 'assignments' ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Assignment ID</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Equipment</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Assigned To</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Unit</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Base</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Condition</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{assignment.id}</div>
                      <div className="text-sm text-gray-500">{assignment.serialNumber}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{assignment.equipmentType}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{assignment.assignedTo}</div>
                      <div className="text-sm text-gray-500">{assignment.rank} • {assignment.personnelId}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-900">{assignment.unit}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{assignment.base}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-medium ${getConditionColor(assignment.condition)}`}>
                        {assignment.condition}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-sm">
                      {format(assignment.assignmentDate, 'MMM dd, yyyy')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedItem(assignment);
                            setShowDetailModal(true);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {hasPermission('manage_assignments') && (
                          <>
                            <button
                              className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                              title="Edit Assignment"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Return Asset"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Expenditure ID</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Equipment</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Quantity</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Expended By</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Reason</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Cost</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Base</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredExpenditures.map((expenditure) => (
                  <tr key={expenditure.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{expenditure.id}</div>
                      <div className="text-sm text-gray-500">{expenditure.authorizedBy}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{expenditure.equipmentType}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-900 font-medium">{expenditure.quantity}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{expenditure.expendedBy}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-900">{expenditure.reason}</td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">${expenditure.totalCost.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">${expenditure.unitCost.toFixed(2)} each</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{expenditure.base}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-sm">
                      {format(expenditure.expenditureDate, 'MMM dd, yyyy')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedItem(expenditure);
                            setShowDetailModal(true);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">New Asset Assignment</h3>
              <button 
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddAssignment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Type</label>
                  <input
                    type="text"
                    required
                    value={newAssignment.equipmentType}
                    onChange={(e) => setNewAssignment({ ...newAssignment, equipmentType: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., M4A1 Rifle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                  <input
                    type="text"
                    required
                    value={newAssignment.serialNumber}
                    onChange={(e) => setNewAssignment({ ...newAssignment, serialNumber: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Equipment serial number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <input
                    type="text"
                    required
                    value={newAssignment.assignedTo}
                    onChange={(e) => setNewAssignment({ ...newAssignment, assignedTo: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Personnel name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Personnel ID</label>
                  <input
                    type="text"
                    required
                    value={newAssignment.personnelId}
                    onChange={(e) => setNewAssignment({ ...newAssignment, personnelId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., P-12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rank</label>
                  <select
                    required
                    value={newAssignment.rank}
                    onChange={(e) => setNewAssignment({ ...newAssignment, rank: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Rank</option>
                    <option value="Private">Private</option>
                    <option value="Corporal">Corporal</option>
                    <option value="Sergeant">Sergeant</option>
                    <option value="Lieutenant">Lieutenant</option>
                    <option value="Captain">Captain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={newAssignment.unit}
                    onChange={(e) => setNewAssignment({ ...newAssignment, unit: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Delta Company"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base</label>
                <select
                  required
                  value={newAssignment.base}
                  onChange={(e) => setNewAssignment({ ...newAssignment, base: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Base</option>
                  <option value="Base Alpha">Base Alpha</option>
                  <option value="Base Beta">Base Beta</option>
                  <option value="Base Gamma">Base Gamma</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={newAssignment.notes}
                  onChange={(e) => setNewAssignment({ ...newAssignment, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes about the assignment..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expenditure Modal */}
      {showExpendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Record Asset Expenditure</h3>
              <button 
                onClick={() => setShowExpendModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddExpenditure} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Type</label>
                  <input
                    type="text"
                    required
                    value={newExpenditure.equipmentType}
                    onChange={(e) => setNewExpenditure({ ...newExpenditure, equipmentType: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 5.56mm Ammunition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newExpenditure.quantity}
                    onChange={(e) => setNewExpenditure({ ...newExpenditure, quantity: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expended By</label>
                  <input
                    type="text"
                    required
                    value={newExpenditure.expendedBy}
                    onChange={(e) => setNewExpenditure({ ...newExpenditure, expendedBy: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Unit or personnel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Cost ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newExpenditure.unitCost}
                    onChange={(e) => setNewExpenditure({ ...newExpenditure, unitCost: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Expenditure</label>
                <select
                  required
                  value={newExpenditure.reason}
                  onChange={(e) => setNewExpenditure({ ...newExpenditure, reason: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Reason</option>
                  <option value="Training Exercise">Training Exercise</option>
                  <option value="Combat Operations">Combat Operations</option>
                  <option value="Medical Treatment">Medical Treatment</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Equipment Testing">Equipment Testing</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={newExpenditure.notes}
                  onChange={(e) => setNewExpenditure({ ...newExpenditure, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional details about the expenditure..."
                />
              </div>

              {newExpenditure.quantity && newExpenditure.unitCost && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-orange-800 font-medium">Total Cost:</span>
                    <span className="text-orange-900 font-bold text-lg">
                      ${(parseInt(newExpenditure.quantity || 0) * parseFloat(newExpenditure.unitCost || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowExpendModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                >
                  Record Expenditure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {activeTab === 'assignments' ? 'Assignment Details' : 'Expenditure Details'}
              </h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {activeTab === 'assignments' ? (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Assignment Information</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-gray-500">Assignment ID:</span> <span className="font-medium">{selectedItem.id}</span></div>
                        <div><span className="text-gray-500">Equipment:</span> <span className="font-medium">{selectedItem.equipmentType}</span></div>
                        <div><span className="text-gray-500">Serial Number:</span> {selectedItem.serialNumber}</div>
                        <div><span className="text-gray-500">Assignment Date:</span> {format(selectedItem.assignmentDate, 'MMM dd, yyyy')}</div>
                        <div><span className="text-gray-500">Status:</span> <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedItem.status)}`}>{selectedItem.status}</span></div>
                        <div><span className="text-gray-500">Condition:</span> <span className={`font-medium ${getConditionColor(selectedItem.condition)}`}>{selectedItem.condition}</span></div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Personnel Details</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-gray-500">Assigned To:</span> <span className="font-medium">{selectedItem.assignedTo}</span></div>
                        <div><span className="text-gray-500">Personnel ID:</span> {selectedItem.personnelId}</div>
                        <div><span className="text-gray-500">Rank:</span> {selectedItem.rank}</div>
                        <div><span className="text-gray-500">Unit:</span> {selectedItem.unit}</div>
                        <div><span className="text-gray-500">Base:</span> {selectedItem.base}</div>
                        <div><span className="text-gray-500">Assigned By:</span> {selectedItem.assignedBy}</div>
                      </div>
                    </div>
                  </div>

                  {selectedItem.notes && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {selectedItem.notes}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Expenditure Information</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-gray-500">Expenditure ID:</span> <span className="font-medium">{selectedItem.id}</span></div>
                        <div><span className="text-gray-500">Equipment:</span> <span className="font-medium">{selectedItem.equipmentType}</span></div>
                        <div><span className="text-gray-500">Quantity:</span> {selectedItem.quantity}</div>
                        <div><span className="text-gray-500">Unit Cost:</span> ${selectedItem.unitCost.toFixed(2)}</div>
                        <div><span className="text-gray-500">Total Cost:</span> <span className="font-bold">${selectedItem.totalCost.toFixed(2)}</span></div>
                        <div><span className="text-gray-500">Date:</span> {format(selectedItem.expenditureDate, 'MMM dd, yyyy')}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Authorization Details</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-gray-500">Expended By:</span> <span className="font-medium">{selectedItem.expendedBy}</span></div>
                        <div><span className="text-gray-500">Reason:</span> {selectedItem.reason}</div>
                        <div><span className="text-gray-500">Base:</span> {selectedItem.base}</div>
                        <div><span className="text-gray-500">Authorized By:</span> {selectedItem.authorizedBy}</div>
                      </div>
                    </div>
                  </div>

                  {selectedItem.notes && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {selectedItem.notes}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assignments;