// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  AlertTriangle,
  Calendar,
  X
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const { user, hasPermission } = useAuth();
  const [showNetMovementModal, setShowNetMovementModal] = useState(false);
  const [dateRange, setDateRange] = useState('30');

  // Mock data
  const assetData = {
    openingBalance: 15420,
    closingBalance: 16850,
    netMovement: 1430,
    assignedAssets: 12340,
    expendedAssets: 890,
    purchases: 2100,
    transfersIn: 650,
    transfersOut: 1320
  };

  const trendData = [
    { name: 'Jan', assets: 14200, movements: 320 },
    { name: 'Feb', assets: 14850, movements: 650 },
    { name: 'Mar', assets: 15420, movements: 570 },
    { name: 'Apr', assets: 16100, movements: 680 },
    { name: 'May', assets: 16850, movements: 750 },
  ];

  const equipmentData = [
    { name: 'Weapons', value: 4500, color: '#1e40af' },
    { name: 'Vehicles', value: 2800, color: '#15803d' },
    { name: 'Communications', value: 3200, color: '#ea580c' },
    { name: 'Medical', value: 1950, color: '#7c3aed' },
    { name: 'Other', value: 4400, color: '#0891b2' }
  ];

  const recentActivity = [
    { id: 1, type: 'purchase', description: 'M4 Rifles purchased for Base Alpha', quantity: 25, timestamp: '2 hours ago' },
    { id: 2, type: 'transfer', description: 'Medical supplies transferred from Base Beta to Base Gamma', quantity: 50, timestamp: '4 hours ago' },
    { id: 3, type: 'assignment', description: 'Night vision goggles assigned to Delta Squad', quantity: 12, timestamp: '6 hours ago' },
    { id: 4, type: 'expenditure', description: 'Training ammunition expended during exercise', quantity: 500, timestamp: '8 hours ago' }
  ];

  const StatCard = ({ title, value, change, icon: Icon, color, onClick }) => (
    <div
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
          {change && (
            <div className={`flex items-center mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span className="text-sm font-medium">{Math.abs(change)}% from last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Asset overview and key metrics</p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>

          {/* Example of action restricted by role */}
          {hasPermission('manage_all') && (
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
              Add Asset
            </button>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Opening Balance" value={assetData.openingBalance} change={5.2} icon={Package} color="bg-gradient-to-br from-blue-500 to-blue-600" />
        <StatCard title="Closing Balance" value={assetData.closingBalance} change={8.1} icon={Package} color="bg-gradient-to-br from-green-500 to-green-600" />
        <StatCard title="Net Movement" value={assetData.netMovement} change={12.5} icon={TrendingUp} color="bg-gradient-to-br from-orange-500 to-orange-600" onClick={() => setShowNetMovementModal(true)} />
        <StatCard title="Assigned Assets" value={assetData.assignedAssets} change={3.7} icon={Users} color="bg-gradient-to-br from-purple-500 to-purple-600" />
        <StatCard title="Expended Assets" value={assetData.expendedAssets} change={-2.1} icon={AlertTriangle} color="bg-gradient-to-br from-red-500 to-red-600" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Movement Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="assets" stroke="#1e40af" strokeWidth={3} />
              <Line type="monotone" dataKey="movements" stroke="#ea580c" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={equipmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={5} dataKey="value">
                {equipmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
            <Calendar className="w-4 h-4 mr-1" />
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${
                activity.type === 'purchase' ? 'bg-green-500' :
                activity.type === 'transfer' ? 'bg-blue-500' :
                activity.type === 'assignment' ? 'bg-purple-500' :
                'bg-red-500'
              }`} />
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{activity.description}</p>
                <p className="text-sm text-gray-600">Quantity: {activity.quantity} • {activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showNetMovementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Net Movement Breakdown</h3>
              <button onClick={() => setShowNetMovementModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-green-800 font-medium">Purchases</span>
                <span className="text-green-900 font-bold">+{assetData.purchases.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-800 font-medium">Transfers In</span>
                <span className="text-blue-900 font-bold">+{assetData.transfersIn.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-red-800 font-medium">Transfers Out</span>
                <span className="text-red-900 font-bold">-{assetData.transfersOut.toLocaleString()}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-800 font-bold">Net Movement</span>
                  <span className="text-gray-900 font-bold text-lg">+{assetData.netMovement.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
