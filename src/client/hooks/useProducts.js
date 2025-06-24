import { useState, useEffect } from 'react';
import { productsAPI } from '../services/api.js';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products on mount
  useEffect(() => {
    setLoading(true);
    productsAPI.getAll()
      .then((data) => {
        const normalizedProducts = data.map(p => ({
          ...p,
          id: p._id?.$oid || p._id || p.id
        }));
        setProducts(normalizedProducts);
      })
      .catch((err) => setError(err.message || 'Failed to fetch products'))
      .finally(() => setLoading(false));
  }, []);

  const addProduct = async (product) => {
    setLoading(true);
    setError(null);
    try {
      const newProduct = await productsAPI.create(product);
      setProducts((prev) => [...prev, newProduct]);
    } catch (err) {
      setError(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, updates) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await productsAPI.update(id, updates);
      setProducts((prev) => prev.map((p) => (p._id === id ? updated : p)));
    } catch (err) {
      setError(err.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await productsAPI.delete(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const getProduct = (id) => {
    return products.find((p) => p._id === id);
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
  };
}
