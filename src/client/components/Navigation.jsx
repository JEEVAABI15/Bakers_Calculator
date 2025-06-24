import React from 'react';
import { Home, Package, ChefHat, Receipt, Calculator, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Navigation() {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'inventory', label: 'Inventory', icon: Package, path: '/inventory' },
    { id: 'products', label: 'Products', icon: ChefHat, path: '/products' },
    { id: 'billing', label: 'Billing', icon: Receipt, path: '/billing' },
  ];
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active page by path
  const getActiveId = () => {
    if (location.pathname.startsWith('/dashboard')) return 'dashboard';
    if (location.pathname.startsWith('/inventory')) return 'inventory';
    if (location.pathname.startsWith('/products')) return 'products';
    if (location.pathname.startsWith('/billing')) return 'billing';
    if (location.pathname.startsWith('/profile')) return 'profile';
    return '';
  };
  const activeId = getActiveId();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Baker's Calculator</h1>
          </div>
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => navigate('/profile')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeId === 'profile'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <User className="h-5 w-5" />
              <span className="font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 