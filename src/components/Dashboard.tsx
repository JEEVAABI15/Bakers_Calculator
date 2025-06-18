import React from 'react';
import { Package, ChefHat, Receipt, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { useProducts } from '../hooks/useProducts';
import { useBilling } from '../hooks/useBilling';

export function Dashboard() {
  const { inventory } = useInventory();
  const { products } = useProducts();
  const { bills } = useBilling();

  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.totalCost, 0);
  const totalRevenue = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const totalProfit = bills.reduce((sum, bill) => sum + bill.profitAmount, 0);
  const recentBills = bills.slice(-5).reverse();

  const statsCards = [
    {
      title: 'Inventory Items',
      value: inventory.length,
      icon: Package,
      color: 'bg-blue-500',
      detail: `₹${totalInventoryValue.toFixed(2)} total value`
    },
    {
      title: 'Products',
      value: products.length,
      icon: ChefHat,
      color: 'bg-emerald-500',
      detail: 'Recipe combinations'
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-orange-500',
      detail: `From ${bills.length} bills`
    },
    {
      title: 'Total Profit',
      value: `₹${totalProfit.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-green-500',
      detail: `${totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}% margin`
    }
  ];

  const getLowStockThreshold = (unit: string) => {
    return unit === 'pieces' ? 5 : 100;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your baking business overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className="text-xs text-gray-500">{card.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Recent Bills
          </h2>
          {recentBills.length > 0 ? (
            <div className="space-y-3">
              {recentBills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{bill.billNumber}</p>
                    <p className="text-sm text-gray-600">
                      {bill.customerName || 'Walk-in Customer'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{bill.totalAmount.toFixed(2)}</p>
                    <p className="text-sm text-green-600">+₹{bill.profitAmount.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No bills generated yet</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Low Stock Alert
          </h2>
          {inventory.length > 0 ? (
            <div className="space-y-3">
              {inventory
                .filter(item => item.totalQuantity < getLowStockThreshold(item.unit))
                .slice(0, 5)
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-orange-600">
                        Only {item.totalQuantity} {item.unit === 'pieces' ? 'pcs' : item.unit} remaining
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">₹{item.costPerUnit.toFixed(2)}/{item.unit === 'pieces' ? 'pc' : item.unit.slice(0, -1)}</p>
                    </div>
                  </div>
                ))}
              {inventory.filter(item => item.totalQuantity < getLowStockThreshold(item.unit)).length === 0 && (
                <p className="text-green-600 text-center py-4">All items are well stocked! 🎉</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No inventory items yet</p>
          )}
        </div>
      </div>
    </div>
  );
}