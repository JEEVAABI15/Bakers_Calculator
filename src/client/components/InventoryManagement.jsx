import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import { useInventory } from '../hooks/useInventory.js';

const UNIT_OPTIONS = [
  { value: 'grams', label: 'Grams (g)' },
  { value: 'pieces', label: 'Pieces (pcs)' },
  { value: 'ml', label: 'Milliliters (ml)' },
  { value: 'cups', label: 'Cups' },
  { value: 'tablespoons', label: 'Tablespoons (tbsp)' },
  { value: 'teaspoons', label: 'Teaspoons (tsp)' },
];

export function InventoryManagement() {
  const { inventory, addItem, updateItem, deleteItem, editingItem, setEditingItem } = useInventory();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    totalQuantity: '',
    unit: 'grams',
    totalCost: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalQuantity = parseFloat(formData.totalQuantity);
    const totalCost = parseFloat(formData.totalCost);
    if (!formData.name || totalQuantity <= 0 || totalCost <= 0) {
      alert('Please fill all fields with valid values');
      return;
    }
    const costPerUnit = totalCost / totalQuantity;
    if (editingItem) {
      updateItem(editingItem.id, {
        name: formData.name,
        totalQuantity,
        unit: formData.unit,
        totalCost,
        costPerUnit,
      });
      setEditingItem(null);
    } else {
      addItem({
        name: formData.name,
        totalQuantity,
        unit: formData.unit,
        totalCost,
        costPerUnit,
      });
    }
    setFormData({ name: '', totalQuantity: '', unit: 'grams', totalCost: '' });
    setShowAddForm(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      totalQuantity: item.totalQuantity.toString(),
      unit: item.unit,
      totalCost: item.totalCost.toString(),
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setFormData({ name: '', totalQuantity: '', unit: 'grams', totalCost: '' });
    setShowAddForm(false);
    setEditingItem(null);
  };

  const getUnitLabel = (unit) => {
    const unitOption = UNIT_OPTIONS.find(option => option.value === unit);
    return unitOption ? unitOption.label : unit;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage your raw materials and ingredients</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Add Item</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., All Purpose Flour, Eggs"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Quantity
              </label>
              <input
                type="number"
                value={formData.totalQuantity}
                onChange={(e) => setFormData({ ...formData, totalQuantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1000"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {UNIT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Cost (₹)
              </label>
              <input
                type="number"
                value={formData.totalCost}
                onChange={(e) => setFormData({ ...formData, totalCost: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="150"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="md:col-span-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Save className="h-4 w-4" />
                <span>{editingItem ? 'Update' : 'Save'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {inventory.length > 0 ? (
          inventory.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Quantity</p>
                      <p className="font-medium text-gray-900">{item.totalQuantity} {getUnitLabel(item.unit).split(' ')[1]?.replace(/[()]/g, '') || item.unit}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Cost</p>
                      <p className="font-medium text-gray-900">₹{item.totalCost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Cost per {item.unit === 'pieces' ? 'Piece' : (item.unit === 'ml' ? 'Milliliter' : item.unit.charAt(0).toUpperCase() + item.unit.slice(1, -1))}</p>
                      <p className="font-medium text-gray-900">₹{item.costPerUnit.toFixed(3)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <p className={`font-medium ${item.totalQuantity < (item.unit === 'pieces' ? 5 : 100) ? 'text-orange-600' : 'text-green-600'}`}>
                        {item.totalQuantity < (item.unit === 'pieces' ? 5 : 100) ? 'Low Stock' : 'In Stock'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <Edit3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this item?')) {
                        deleteItem(item.id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Plus className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No inventory items yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first raw material or ingredient</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add First Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 