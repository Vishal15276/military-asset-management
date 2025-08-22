// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Repeat,
  Users,
  FileText,
  Package,Building2
} from 'lucide-react';

function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const menuItemsByRole = {
    admin: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Purchases', path: '/purchases', icon: ShoppingCart },
      { name: 'Bases', path: '/bases', icon: Building2 }, 

      { name: 'Transfers', path: '/transfers', icon: Repeat },
      { name: 'Assignments', path: '/assignments', icon: Users },
      { name: 'Equipment', path: '/equipment', icon: Package },
      { name: 'Reports', path: '/reports', icon: FileText }
    ],
    logistics: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Purchases', path: '/purchases', icon: ShoppingCart },
      { name: 'Assignments', path: '/assignments', icon: Users },
      { name: 'Reports', path: '/reports', icon: FileText }
    ],
    commander: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Equipment', path: '/equipment', icon: Package },
      { name: 'Reports', path: '/reports', icon: FileText }
    ]
  };

  const menuItems = menuItemsByRole[user.role] || [];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold">Military AMS</h2>
        <p className="text-sm text-gray-400">Asset Management</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.length > 0 ? (
          menuItems.map(({ name, path, icon: Icon }) => (
            <Link
              key={name}
              to={path}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                location.pathname === path
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {name}
            </Link>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No sections available</p>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 mb-2">Logged in as: {user.role}</p>
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
