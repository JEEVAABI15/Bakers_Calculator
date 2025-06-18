import React from 'react';
import { Home, Package, ChefHat, Receipt, Calculator } from 'lucide-react';
import { ActivePage } from '../types';

interface NavigationProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
}

export function Navigation({ activePage, onPageChange }: NavigationProps) {
  const navItems = [
    { id: 'dashboard' as ActivePage, label: 'Dashboard', icon: Home },
    { id: 'inventory' as ActivePage, label: 'Inventory', icon: Package },
    { id: 'products' as ActivePage, label: 'Products', icon: ChefHat },
    { id: 'billing' as ActivePage, label: 'Billing', icon: Receipt },
  ];

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
              const isActive = activePage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
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
          </div>
        </div>
      </div>
    </nav>
  );
}