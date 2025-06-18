import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useInventory } from '../hooks/useInventory';
import { Product, ProductIngredient } from '../types';

export function ProductManagement() {
  const { products, addProduct, deleteProduct } = useProducts();
  const { inventory } = useInventory();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    weight: '',
  });
  const [ingredients, setIngredients] = useState<ProductIngredient[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.weight || ingredients.length === 0) {
      alert('Please fill all fields and add at least one ingredient');
      return;
    }

    const weight = parseFloat(formData.weight);
    if (weight <= 0) {
      alert('Weight must be greater than 0');
      return;
    }

    const totalCost = ingredients.reduce((sum, ing) => sum + ing.cost, 0);

    addProduct({
      name: formData.name,
      weight,
      ingredients,
      totalCost,
    });

    setFormData({ name: '', weight: '' });
    setIngredients([]);
    setShowAddForm(false);
  };

  const addIngredient = (ingredientId: string, quantity: number) => {
    const inventoryItem = inventory.find(item => item.id === ingredientId);
    if (!inventoryItem || quantity <= 0) return;

    const cost = inventoryItem.costPerUnit * quantity;
    const newIngredient: ProductIngredient = {
      ingredientId,
      ingredientName: inventoryItem.name,
      quantity,
      unit: inventoryItem.unit,
      cost,
    };

    setIngredients([...ingredients, newIngredient]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setFormData({ name: '', weight: '' });
    setIngredients([]);
    setShowAddForm(false);
  };

  const getUnitLabel = (unit: string) => {
    const unitLabels: { [key: string]: string } = {
      'grams': 'g',
      'pieces': 'pcs',
      'liters': 'L',
      'cups': 'cups',
      'tablespoons': 'tbsp',
      'teaspoons': 'tsp',
    };
    return unitLabels[unit] || unit;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Create and manage your baking products</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
          disabled={inventory.length === 0}
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      {inventory.length === 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <p className="text-orange-800">
            You need to add inventory items first before creating products.
          </p>
        </div>
      )}

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Chocolate Chip Cookies"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Weight (grams)
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingredients
              </label>
              <IngredientSelector 
                inventory={inventory} 
                onAddIngredient={addIngredient} 
              />
              
              {ingredients.length > 0 && (
                <div className="mt-4 space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div>
                        <span className="font-medium">{ingredient.ingredientName}</span>
                        <span className="text-gray-600 ml-2">
                          {ingredient.quantity} {getUnitLabel(ingredient.unit)} - ₹{ingredient.cost.toFixed(2)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <div className="text-right font-semibold text-lg">
                    Total Cost: ₹{ingredients.reduce((sum, ing) => sum + ing.cost, 0).toFixed(2)}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
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
                className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
              >
                <Save className="h-4 w-4" />
                <span>Save Product</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-gray-600">Weight: {product.weight}g</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Cost Price</p>
                    <p className="text-xl font-bold text-gray-900">₹{product.totalCost.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this product?')) {
                        deleteProduct(product.id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Ingredients:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                      <span>{ingredient.ingredientName}</span>
                      <span>{ingredient.quantity} {getUnitLabel(ingredient.unit)} - ₹{ingredient.cost.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Plus className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-6">Create your first baking product recipe</p>
            {inventory.length > 0 && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
              >
                Add First Product
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function IngredientSelector({ inventory, onAddIngredient }: {
  inventory: any[];
  onAddIngredient: (id: string, quantity: number) => void;
}) {
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleAdd = () => {
    if (selectedIngredient && quantity) {
      onAddIngredient(selectedIngredient, parseFloat(quantity));
      setSelectedIngredient('');
      setQuantity('');
    }
  };

  const selectedItem = inventory.find(item => item.id === selectedIngredient);

  const getUnitLabel = (unit: string) => {
    const unitLabels: { [key: string]: string } = {
      'grams': 'g',
      'pieces': 'pcs',
      'liters': 'L',
      'cups': 'cups',
      'tablespoons': 'tbsp',
      'teaspoons': 'tsp',
    };
    return unitLabels[unit] || unit;
  };

  return (
    <div className="flex gap-3">
      <select
        value={selectedIngredient}
        onChange={(e) => setSelectedIngredient(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      >
        <option value="">Select ingredient...</option>
        {inventory.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name} (₹{item.costPerUnit.toFixed(3)}/{getUnitLabel(item.unit)})
          </option>
        ))}
      </select>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder={selectedItem ? `${getUnitLabel(selectedItem.unit)}` : 'Quantity'}
        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        min="0"
        step="0.01"
      />
      <button
        type="button"
        onClick={handleAdd}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
      >
        Add
      </button>
    </div>
  );
}