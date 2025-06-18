import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { InventoryItem } from '../types';

export function useInventory() {
  const [inventory, setInventory] = useLocalStorage<InventoryItem[]>('bakingInventory', []);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const addItem = (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setInventory([...inventory, newItem]);
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory(inventory.map(item => 
      item.id === id 
        ? { ...item, ...updates, updatedAt: new Date().toISOString() }
        : item
    ));
  };

  const deleteItem = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const getItem = (id: string) => {
    return inventory.find(item => item.id === id);
  };

  return {
    inventory,
    addItem,
    updateItem,
    deleteItem,
    getItem,
    editingItem,
    setEditingItem,
  };
}