import { useState, useEffect } from 'react';
import { billsAPI } from '../services/api';

export function useBilling() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch bills on mount
  useEffect(() => {
    setLoading(true);
    billsAPI.getAll()
      .then((data) => setBills(data))
      .catch((err) => setError(err.message || 'Failed to fetch bills'))
      .finally(() => setLoading(false));
  }, []);

  const addBill = async (bill) => {
    setLoading(true);
    setError(null);
    try {
      const newBill = await billsAPI.create(bill);
      setBills((prev) => [...prev, newBill]);
      return newBill;
    } catch (err) {
      setError(err.message || 'Failed to add bill');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getBill = (id) => {
    return bills.find((bill) => bill._id === id);
  };

  const deleteBill = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await billsAPI.delete(id);
      setBills((prev) => prev.filter((bill) => bill._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete bill');
    } finally {
      setLoading(false);
    }
  };

  return {
    bills,
    loading,
    error,
    addBill,
    getBill,
    deleteBill,
  };
} 