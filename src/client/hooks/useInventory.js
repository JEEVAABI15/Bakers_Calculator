import { useState, useEffect } from 'react';
import { inventoryAPI } from '../services/api';

export function useInventory() {
  const [inventory, setInventory] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch inventory on mount
  useEffect(() => {
    setLoading(true);
    inventoryAPI.getAll()
      .then((data) => setInventory(data))
      .catch((err) => setError(err.message || 'Failed to fetch inventory'))
      .finally(() => setLoading(false));
  }, []);

  const addItem = async (item) => {
    setLoading(true);
    setError(null);
    try {
      const newItem = await inventoryAPI.create(item);
      setInventory((prev) => [...prev, newItem]);
    } catch (err) {
      setError(err.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id, updates) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await inventoryAPI.update(id, updates);
      setInventory((prev) => prev.map((item) => (item._id === id ? updated : item)));
    } catch (err) {
      setError(err.message || 'Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await inventoryAPI.delete(id);
      setInventory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const getItem = (id) => {
    return inventory.find((item) => item._id === id);
  };

  return {
    inventory,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    getItem,
    editingItem,
    setEditingItem,
  };
} 