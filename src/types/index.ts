export interface InventoryItem {
  id: string;
  name: string;
  totalQuantity: number;
  unit: 'grams' | 'pieces' | 'liters' | 'cups' | 'tablespoons' | 'teaspoons';
  costPerUnit: number;
  totalCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductIngredient {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  cost: number;
}

export interface Product {
  id: string;
  name: string;
  weight: number;
  ingredients: ProductIngredient[];
  totalCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface BillItem {
  productId: string;
  productName: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  totalAmount: number;
}

export interface AdditionalCost {
  id: string;
  description: string;
  amount: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  items: BillItem[];
  additionalCosts: AdditionalCost[];
  subtotal: number;
  additionalCostsTotal: number;
  discountPercentage: number;
  discountAmount: number;
  totalAmount: number;
  profitAmount: number;
  profitPercentage: number;
  createdAt: string;
}

export type ActivePage = 'dashboard' | 'inventory' | 'products' | 'billing';