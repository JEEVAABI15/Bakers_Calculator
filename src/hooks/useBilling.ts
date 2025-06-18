import { useLocalStorage } from './useLocalStorage';
import { Bill } from '../types';

export function useBilling() {
  const [bills, setBills] = useLocalStorage<Bill[]>('bakingBills', []);

  const addBill = (bill: Omit<Bill, 'id' | 'billNumber' | 'createdAt'>) => {
    const billNumber = `BILL-${Date.now()}`;
    const newBill: Bill = {
      ...bill,
      id: Date.now().toString(),
      billNumber,
      createdAt: new Date().toISOString(),
    };
    setBills([...bills, newBill]);
    return newBill;
  };

  const getBill = (id: string) => {
    return bills.find(bill => bill.id === id);
  };

  const deleteBill = (id: string) => {
    setBills(bills.filter(bill => bill.id !== id));
  };

  return {
    bills,
    addBill,
    getBill,
    deleteBill,
  };
}