import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Calculator, User } from 'lucide-react';
import { useProducts } from '../hooks/useProducts.js';
import { useBilling } from '../hooks/useBilling.js';
import jsPDF from 'jspdf';
import { profileAPI } from '../services/api.js';

export function BillingSystem() {
  const { products } = useProducts();
  const { addBill } = useBilling();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [billItems, setBillItems] = useState([]);
  const [additionalCosts, setAdditionalCosts] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [profitPercentage, setProfitPercentage] = useState(50); // Default 50% markup
  const [bakery, setBakery] = useState({
    bakeryName: '',
    bakeryAddress: '',
    bakeryPhone: '',
    bakeryEmail: '',
  });

  useEffect(() => {
    profileAPI.getProfile()
      .then((data) => setBakery({
        bakeryName: data.bakeryName || '',
        bakeryAddress: data.bakeryAddress || '',
        bakeryPhone: data.bakeryPhone || '',
        bakeryEmail: data.bakeryEmail || '',
      }))
      .catch(() => {});
  }, []);

  const subtotal = billItems.reduce((sum, item) => sum + item.totalAmount, 0);
  const additionalCostsTotal = additionalCosts.reduce((sum, cost) => sum + cost.amount, 0);
  const discountAmount = (subtotal * discountPercentage) / 100;
  const totalAmount = subtotal + additionalCostsTotal - discountAmount;
  const totalCostPrice = billItems.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0) + additionalCostsTotal;
  const profitAmount = totalAmount - totalCostPrice;

  React.useEffect(() => {
    setBillItems((prevItems) =>
      prevItems.map((item) => {
        const newSellingPrice = item.costPrice * (1 + profitPercentage / 100);
        return {
          ...item,
          sellingPrice: newSellingPrice,
          totalAmount: newSellingPrice * item.quantity,
        };
      })
    );
  }, [profitPercentage]);

  const addBillItem = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = billItems.find(item => item.productId === productId);
    const sellingPrice = product.totalCost * (1 + profitPercentage / 100);
    if (existingItem) {
      setBillItems(billItems.map(item =>
        item.productId === productId
          ? { 
              ...item, 
              quantity: item.quantity + 1,
              sellingPrice: sellingPrice, // update selling price if profit % changed
              totalAmount: sellingPrice * (item.quantity + 1)
            }
          : item
      ));
    } else {
      const newItem = {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        costPrice: product.totalCost,
        sellingPrice: sellingPrice,
        totalAmount: sellingPrice,
      };
      setBillItems([...billItems, newItem]);
    }
  };

  const updateItemPrice = (productId, sellingPrice) => {
    setBillItems(billItems.map(item =>
      item.productId === productId
        ? { 
            ...item, 
            sellingPrice,
            totalAmount: sellingPrice * item.quantity
          }
        : item
    ));
  };

  const updateItemQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setBillItems(billItems.filter(item => item.productId !== productId));
    } else {
      setBillItems(billItems.map(item =>
        item.productId === productId
          ? { 
              ...item, 
              quantity,
              totalAmount: item.sellingPrice * quantity
            }
          : item
      ));
    }
  };

  const removeItem = (productId) => {
    setBillItems(billItems.filter(item => item.productId !== productId));
  };

  const addAdditionalCost = () => {
    const newCost = {
      id: Date.now().toString(),
      description: '',
      amount: 0,
    };
    setAdditionalCosts([...additionalCosts, newCost]);
  };

  const updateAdditionalCost = (id, field, value) => {
    setAdditionalCosts(additionalCosts.map(cost =>
      cost.id === id ? { ...cost, [field]: value } : cost
    ));
  };

  const removeAdditionalCost = (id) => {
    setAdditionalCosts(additionalCosts.filter(cost => cost.id !== id));
  };

  const generateBill = () => {
    if (billItems.length === 0) {
      alert('Please add at least one item to the bill');
      return;
    }

    const bill = addBill({
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
      customerAddress: customerAddress || undefined,
      items: billItems,
      additionalCosts,
      subtotal,
      additionalCostsTotal,
      discountPercentage,
      discountAmount,
      totalAmount,
      profitAmount,
      profitPercentage, // Save profit percentage with bill
    });

    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setBillItems([]);
    setAdditionalCosts([]);
    setDiscountPercentage(0);
    setProfitPercentage(50);

    alert(`Bill ${bill.billNumber} generated successfully!`);
  };

  const downloadPDF = () => {
    if (billItems.length === 0) {
      alert('Please add items to generate PDF');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text("BAKER'S INVOICE", pageWidth / 2, 25, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(bakery.bakeryName || "Your Bakery Name", 20, 40);
    doc.text(bakery.bakeryAddress || 'Address Line 1, City, State - PIN', 20, 45);
    doc.text(
      `Phone: ${bakery.bakeryPhone || '+91 XXXXX XXXXX'} | Email: ${bakery.bakeryEmail || 'your@email.com'}`,
      20, 50
    );
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Bill No: BILL-${Date.now()}`, 20, 65);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 20, 72);
    if (customerName || customerPhone || customerAddress) {
      doc.text('Bill To:', 20, 85);
      doc.setFont('helvetica', 'normal');
      let yPos = 92;
      if (customerName) {
        doc.text(customerName, 20, yPos);
        yPos += 7;
      }
      if (customerPhone) {
        doc.text(`Phone: ${customerPhone}`, 20, yPos);
        yPos += 7;
      }
      if (customerAddress) {
        doc.text(customerAddress, 20, yPos);
        yPos += 7;
      }
    }
    let yPosition = customerName || customerPhone || customerAddress ? 115 : 85;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('ITEM', 20, yPosition);
    doc.text('QTY', 100, yPosition);
    doc.text('RATE', 130, yPosition);
    doc.text('AMOUNT', 160, yPosition);
    yPosition += 5;
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    billItems.forEach((item) => {
      doc.text(item.productName, 20, yPosition);
      doc.text(item.quantity.toString(), 100, yPosition);
      doc.text(`₹${item.sellingPrice.toFixed(2)}`, 130, yPosition);
      doc.text(`₹${item.totalAmount.toFixed(2)}`, 160, yPosition);
      yPosition += 8;
    });
    if (additionalCosts.length > 0) {
      additionalCosts.forEach((cost) => {
        if (cost.description && cost.amount > 0) {
          doc.text(cost.description, 20, yPosition);
          doc.text('-', 100, yPosition);
          doc.text('-', 130, yPosition);
          doc.text(`₹${cost.amount.toFixed(2)}`, 160, yPosition);
          yPosition += 8;
        }
      });
    }
    yPosition += 5;
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`Subtotal:`, 130, yPosition);
    doc.text(`₹${subtotal.toFixed(2)}`, 160, yPosition);
    yPosition += 8;
    if (additionalCostsTotal > 0) {
      doc.text(`Additional Costs:`, 130, yPosition);
      doc.text(`₹${additionalCostsTotal.toFixed(2)}`, 160, yPosition);
      yPosition += 8;
    }
    if (discountPercentage > 0) {
      doc.text(`Discount (${discountPercentage}%):`, 130, yPosition);
      doc.text(`-₹${discountAmount.toFixed(2)}`, 160, yPosition);
      yPosition += 8;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`TOTAL:`, 130, yPosition);
    doc.text(`₹${totalAmount.toFixed(2)}`, 160, yPosition);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for your business!', pageWidth / 2, 280, { align: 'center' });
    doc.save(`invoice-${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing System</h1>
        <p className="text-gray-600">Create professional bills and calculate profits</p>
      </div>

      {products.length === 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <p className="text-orange-800">
            You need to create products first before generating bills.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors duration-200"
                  onClick={() => addBillItem(product.id)}
                >
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">Weight: {product.weight}g</p>
                  <p className="text-sm text-gray-600">Cost: ₹{product.totalCost.toFixed(2)}</p>
                  <button className="mt-2 flex items-center space-x-1 text-blue-600 hover:text-blue-700">
                    <Plus className="h-4 w-4" />
                    <span>Add to Bill</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Items */}
          {billItems.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Bill Items</h2>
              <div className="space-y-4">
                {billItems.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.productName}</h3>
                      <p className="text-sm text-gray-600">Cost: ₹{item.costPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <label className="block text-xs text-gray-600">Qty</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(item.productId, parseInt(e.target.value))}
                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600">Price</label>
                        <input
                          type="number"
                          value={item.sellingPrice}
                          onChange={(e) => updateItemPrice(item.productId, parseFloat(e.target.value))}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Total</p>
                        <p className="font-semibold">₹{item.totalAmount.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Costs */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Additional Costs</h2>
              <button
                onClick={addAdditionalCost}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Add Cost</span>
              </button>
            </div>
            
            {additionalCosts.length > 0 && (
              <div className="space-y-3">
                {additionalCosts.map((cost) => (
                  <div key={cost.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      value={cost.description}
                      onChange={(e) => updateAdditionalCost(cost.id, 'description', e.target.value)}
                      placeholder="Description (e.g., Packaging, Delivery)"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded"
                    />
                    <input
                      type="number"
                      value={cost.amount}
                      onChange={(e) => updateAdditionalCost(cost.id, 'amount', parseFloat(e.target.value) || 0)}
                      placeholder="Amount"
                      className="w-24 px-3 py-2 text-sm border border-gray-300 rounded"
                      min="0"
                      step="0.01"
                    />
                    <button
                      onClick={() => removeAdditionalCost(cost.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {additionalCosts.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Add packaging, delivery, or other additional costs
              </p>
            )}
          </div>
        </div>

        {/* Bill Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Customer Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Enter customer address"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Bill Summary
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Profit %:</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={profitPercentage}
                    onChange={(e) => setProfitPercentage(parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                    min="0"
                    max="1000"
                    step="0.1"
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              
              {additionalCostsTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Additional Costs:</span>
                  <span className="font-medium">₹{additionalCostsTotal.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Discount:</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
              
              {discountPercentage > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount Amount:</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="bg-emerald-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Total Cost:</span>
                  <span>₹{totalCostPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-emerald-600">
                  <span>Profit:</span>
                  <span>₹{profitAmount.toFixed(2)} ({profitPercentage.toFixed(1)}%)</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <button
                onClick={generateBill}
                disabled={billItems.length === 0}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Generate Bill
              </button>
              
              <button
                onClick={downloadPDF}
                disabled={billItems.length === 0}
                className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 