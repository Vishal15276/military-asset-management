import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  BarChart3, 
  Calendar, 
  Filter,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  MapPin
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

function Reports() {
  const { user, hasPermission } = useAuth();
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('30');
  const [selectedBase, setSelectedBase] = useState('all');

  // Mock report data
  const overviewData = {
    totalAssets: 16850,
    totalValue: 12500000,
    activeAssignments: 1250,
    pendingTransfers: 8,
    monthlyPurchases: 2100000,
    monthlyExpenditures: 185000
  };

  const assetsByCategory = [
    { name: 'Weapons', value: 4500, color: '#1e40af' },
    { name: 'Vehicles', value: 2800, color: '#15803d' },
    { name: 'Communications', value: 3200, color: '#ea580c' },
    { name: 'Medical', value: 1950, color: '#7c3aed' },
    { name: 'Other', value: 4400, color: '#0891b2' }
  ];

  const assetsByBase = [
    { name: 'Base Alpha', assets: 6800, assignments: 520, expenditures: 85000 },
    { name: 'Base Beta', assets: 5200, assignments: 430, expenditures: 65000 },
    { name: 'Base Gamma', assets: 4850, assignments: 300, expenditures: 35000 }
  ];

  const monthlyTrends = [
    { month: 'Jan', purchases: 1800000, expenditures: 120000, transfers: 45 },
    { month: 'Feb', purchases: 2200000, expenditures: 150000, transfers: 38 },
    { month: 'Mar', purchases: 1950000, expenditures: 135000, transfers: 52 },
    { month: 'Apr', purchases: 2400000, expenditures: 170000, transfers: 41 },
    { month: 'May', purchases: 2100000, expenditures: 185000, transfers: 48 }
  ];

  const topEquipmentTypes = [
    { type: 'M4A1 Rifles', quantity: 1250, value: 1112500, assignments: 890 },
    { type: 'Night Vision Goggles', quantity: 450, value: 1125000, assignments: 320 },
    { type: 'Body Armor', quantity: 800, value: 960000, assignments: 650 },
    { type: 'Communication Radios', quantity: 600, value: 840000, assignments: 480 },
    { type: 'Medical Kits', quantity: 1200, value: 360000, assignments: 200 }
  ];

  const reports = [
    { 
      id: 'overview', 
      name: 'Asset Overview', 
      description: 'Comprehensive asset summary and key metrics',
      icon: BarChart3
    },
    { 
      id: 'inventory', 
      name: 'Inventory Report', 
      description: 'Detailed inventory by category and location',
      icon: Package
    },
    { 
      id: 'financial', 
      name: 'Financial Summary', 
      description: 'Cost analysis and budget utilization',
      icon: DollarSign
    },
    { 
      id: 'assignments', 
      name: 'Assignment Report', 
      description: 'Personnel assignments and equipment allocation',
      icon: Users
    },
    { 
      id: 'transfers', 
      name: 'Transfer Analysis', 
      description: 'Inter-base transfer patterns and efficiency',
      icon: TrendingUp
    }
  ];

  const exportReport = (format) => {
    // Mock export functionality
    const filename = `military_assets_${selectedReport}_${format.toLowerCase()}_${format(new Date(), 'yyyy-MM-dd')}`;
    console.log(`Exporting ${filename}`);
    alert(`Report exported as ${filename}.${format.toLowerCase()}`);
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Assets"
                value={overviewData.totalAssets.toLocaleString()}
                subtitle="Across all bases"
                icon={Package}
                color="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <StatCard
                title="Total Value"
                value={`$${(overviewData.totalValue / 1000000).toFixed(1)}M`}
                subtitle="Asset valuation"
                icon={DollarSign}
                color="bg-gradient-to-br from-green-500 to-green-600"
              />
              <StatCard
                title="Active Assignments"
                value={overviewData.activeAssignments.toLocaleString()}
                subtitle="Currently assigned"
                icon={Users}
                color="bg-gradient-to-br from-purple-500 to-purple-600"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assets by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={assetsByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {assetsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'transfers' ? value : `$${(value / 1000).toFixed(0)}K`,
                      name.charAt(0).toUpperCase() + name.slice(1)
                    ]} />
                    <Line type="monotone" dataKey="purchases" stroke="#1e40af" strokeWidth={3} />
                    <Line type="monotone" dataKey="expenditures" stroke="#ea580c" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Base Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Base Summary</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={assetsByBase}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="assets" fill="#1e40af" />
                  <Bar dataKey="assignments" fill="#15803d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'inventory':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Equipment Types</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-medium text-gray-900">Equipment Type</th>
                      <th className="text-right py-2 font-medium text-gray-900">Quantity</th>
                      <th className="text-right py-2 font-medium text-gray-900">Value</th>
                      <th className="text-right py-2 font-medium text-gray-900">Assigned</th>
                      <th className="text-right py-2 font-medium text-gray-900">Utilization</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topEquipmentTypes.map((item, index) => (
                      <tr key={index}>
                        <td className="py-3 font-medium text-gray-900">{item.type}</td>
                        <td className="py-3 text-right text-gray-900">{item.quantity.toLocaleString()}</td>
                        <td className="py-3 text-right text-gray-900">${item.value.toLocaleString()}</td>
                        <td className="py-3 text-right text-gray-900">{item.assignments.toLocaleString()}</td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            (item.assignments / item.quantity) > 0.8 ? 'bg-green-100 text-green-800' :
                            (item.assignments / item.quantity) > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {Math.round((item.assignments / item.quantity) * 100)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory by Base</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={assetsByBase}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="assets" fill="#1e40af" name="Total Assets" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'financial':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Monthly Purchases"
                value={`$${(overviewData.monthlyPurchases / 1000000).toFixed(1)}M`}
                subtitle="Current month"
                icon={TrendingUp}
                color="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <StatCard
                title="Monthly Expenditures"
                value={`$${(overviewData.monthlyExpenditures / 1000).toFixed(0)}K`}
                subtitle="Current month"
                icon={DollarSign}
                color="bg-gradient-to-br from-orange-500 to-orange-600"
              />
              <StatCard
                title="Budget Utilization"
                value="78%"
                subtitle="YTD performance"
                icon={BarChart3}
                color="bg-gradient-to-br from-green-500 to-green-600"
              />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${(value / 1000).toFixed(0)}K`]} />
                  <Line type="monotone" dataKey="purchases" stroke="#1e40af" strokeWidth={3} name="Purchases" />
                  <Line type="monotone" dataKey="expenditures" stroke="#ea580c" strokeWidth={2} name="Expenditures" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Report Coming Soon</h3>
            <p className="text-gray-600">This report type is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive reporting and data analysis</p>
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

          {hasPermission('manage_all') && (
            <select 
              value={selectedBase}
              onChange={(e) => setSelectedBase(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Bases</option>
              <option value="alpha">Base Alpha</option>
              <option value="beta">Base Beta</option>
              <option value="gamma">Base Gamma</option>
            </select>
          )}

          <div className="flex items-center space-x-2">
            <button
              onClick={() => exportReport('PDF')}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => exportReport('Excel')}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Excel</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report Menu */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Available Reports</h3>
            </div>
            <div className="p-2">
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedReport === report.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <report.icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{report.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {reports.find(r => r.id === selectedReport)?.name}
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Generated {format(new Date(), 'MMM dd, yyyy HH:mm')}</span>
              </div>
            </div>
            
            {renderReportContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;