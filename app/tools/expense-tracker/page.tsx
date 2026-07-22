'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ExpenseEntry {
  id: string;
  category: string;
  description: string;
  amount: number;
  clientName: string;
  date: string;
  recurring: boolean;
}

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([
    { id: '1', category: 'Software', description: 'Project Management Tool', amount: 29, clientName: 'General', date: '2024-01-01', recurring: true },
    { id: '2', category: 'Software', description: 'Communication Tool', amount: 12, clientName: 'General', date: '2024-01-01', recurring: true },
    { id: '3', category: 'Equipment', description: 'Laptop Upgrade', amount: 1500, clientName: 'General', date: '2024-01-15', recurring: false },
    { id: '4', category: 'Professional Development', description: 'Course: PM Mastery', amount: 299, clientName: 'General', date: '2024-01-20', recurring: false },
    { id: '5', category: 'Office', description: 'Home Office Setup', amount: 200, clientName: 'General', date: '2024-02-01', recurring: false },
    { id: '6', category: 'Client-Specific', description: 'Design Tool for Client A', amount: 50, clientName: 'Client A', date: '2024-02-05', recurring: true },
  ]);

  const categories = ['Software', 'Equipment', 'Professional Development', 'Office', 'Client-Specific', 'Other'];

  const addExpense = () => {
    const newId = String(Math.max(...expenses.map(e => parseInt(e.id)), 0) + 1);
    setExpenses([...expenses, {
      id: newId,
      category: 'Software',
      description: 'New Expense',
      amount: 0,
      clientName: 'General',
      date: new Date().toISOString().split('T')[0],
      recurring: false,
    }]);
  };

  const updateExpense = (id: string, field: keyof ExpenseEntry, value: any) => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const recurringExpenses = expenses.filter(e => e.recurring).reduce((sum, e) => sum + e.amount, 0);
  const oneTimeExpenses = expenses.filter(e => !e.recurring).reduce((sum, e) => sum + e.amount, 0);
  const monthlyRecurring = recurringExpenses; // Assuming monthly
  const annualRecurring = recurringExpenses * 12;

  // By category
  const expensesByCategory = categories.map(cat => ({
    category: cat,
    total: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0),
    count: expenses.filter(e => e.category === cat).length,
  })).filter(e => e.count > 0);

  // By client
  const clients = Array.from(new Set(expenses.map(e => e.clientName)));
  const expensesByClient = clients.map(client => ({
    client,
    total: expenses.filter(e => e.clientName === client).reduce((sum, e) => sum + e.amount, 0),
    count: expenses.filter(e => e.clientName === client).length,
  }));

  const exportExpenses = () => {
    const csv = [
      ['Expense Report'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Expense Tracker'],
      ['Date', 'Category', 'Description', 'Client', 'Amount', 'Recurring'],
      ...expenses.map(e => [e.date, e.category, e.description, e.clientName, `$${e.amount.toFixed(2)}`, e.recurring ? 'Yes' : 'No']),
      [],
      ['Summary'],
      ['Total Expenses', `$${totalExpenses.toFixed(2)}`],
      ['Monthly Recurring', `$${monthlyRecurring.toFixed(2)}`],
      ['Annual Recurring', `$${annualRecurring.toFixed(2)}`],
      ['One-Time Expenses', `$${oneTimeExpenses.toFixed(2)}`],
      [],
      ['By Category'],
      ['Category', 'Total', 'Count'],
      ...expensesByCategory.map(e => [e.category, `$${e.total.toFixed(2)}`, e.count]),
      [],
      ['By Client'],
      ['Client', 'Total', 'Count'],
      ...expensesByClient.map(e => [e.client, `$${e.total.toFixed(2)}`, e.count]),
    ];

    const csvContent = csv.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <>
      <section className="bg-gradient-to-r from-rose-600 to-rose-800 text-white py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <Link href="/tools" className="text-rose-100 hover:text-white mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-4xl font-bold mb-4">Expense Tracker</h1>
          <p className="text-xl">Track business expenses and understand true profitability</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Expense Input */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Expense Entries</h2>
                  <button
                    onClick={addExpense}
                    className="px-4 py-2 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition"
                  >
                    + Add Expense
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="grid grid-cols-1 md:grid-cols-7 gap-3 items-end p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          value={expense.date}
                          onChange={(e) => updateExpense(expense.id, 'date', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                        <select
                          value={expense.category}
                          onChange={(e) => updateExpense(expense.id, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-rose-500"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                        <input
                          type="text"
                          value={expense.description}
                          onChange={(e) => updateExpense(expense.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Client</label>
                        <input
                          type="text"
                          value={expense.clientName}
                          onChange={(e) => updateExpense(expense.id, 'clientName', e.target.value)}
                          placeholder="General"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Amount</label>
                        <div className="flex items-center">
                          <span className="text-gray-700 mr-1">$</span>
                          <input
                            type="number"
                            value={expense.amount}
                            onChange={(e) => updateExpense(expense.id, 'amount', parseFloat(e.target.value) || 0)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-rose-500"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={expense.recurring}
                            onChange={(e) => updateExpense(expense.id, 'recurring', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                          <span className="text-sm font-semibold text-gray-700">Recurring</span>
                        </label>
                      </div>
                      <button
                        onClick={() => removeExpense(expense.id)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="space-y-6">
              {/* Main Summary */}
              <div className="bg-rose-600 text-white rounded-lg shadow-lg p-6 sticky top-20">
                <h2 className="text-2xl font-bold mb-6">Expense Summary</h2>
                
                <div className="space-y-4 mb-6 pb-6 border-b border-rose-400">
                  <div>
                    <p className="text-rose-100 text-sm font-semibold mb-1">TOTAL EXPENSES</p>
                    <div className="text-4xl font-bold">${totalExpenses.toFixed(2)}</div>
                  </div>
                  <div>
                    <p className="text-rose-100 text-sm font-semibold mb-1">MONTHLY RECURRING</p>
                    <div className="text-2xl font-bold">${monthlyRecurring.toFixed(2)}</div>
                  </div>
                  <div>
                    <p className="text-rose-100 text-sm font-semibold mb-1">ANNUAL RECURRING</p>
                    <div className="text-2xl font-bold">${annualRecurring.toFixed(2)}</div>
                  </div>
                  <div>
                    <p className="text-rose-100 text-sm font-semibold mb-1">ONE-TIME</p>
                    <div className="text-2xl font-bold">${oneTimeExpenses.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* By Category */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-4">By Category</h3>
                <div className="space-y-3">
                  {expensesByCategory.map(cat => {
                    const percent = (cat.total / totalExpenses) * 100;
                    return (
                      <div key={cat.category}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-semibold text-gray-700">{cat.category}</span>
                          <span className="text-sm font-bold text-rose-600">${cat.total.toFixed(2)}</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-rose-500 h-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{cat.count} item{cat.count !== 1 ? 's' : ''}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* By Client */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-4">By Client</h3>
                <div className="space-y-2">
                  {expensesByClient.map(client => (
                    <div key={client.client} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700 font-semibold">{client.client}</span>
                      <span className="text-sm font-bold text-rose-600">${client.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={exportExpenses}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                📊 Export Report
              </button>

              <div className="card bg-rose-50">
                <h3 className="font-bold text-rose-900 mb-3">💡 Deduction Tips</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Software & tools (monthly subscriptions)</li>
                  <li>• Equipment (computer, monitors)</li>
                  <li>• Professional development (courses)</li>
                  <li>• Home office equipment</li>
                  <li>• Client-specific tools</li>
                  <li>• Health insurance premiums</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="bg-gray-50 py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/tools/rate-calculator" className="card hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-3">Rate Calculator</h3>
              <p className="text-gray-700 mb-4">Calculate your ideal hourly rate.</p>
              <span className="text-blue-600 font-semibold">Open → </span>
            </Link>
            <Link href="/tools/capacity-planner" className="card hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-3">Capacity Planner</h3>
              <p className="text-gray-700 mb-4">Manage multiple clients.</p>
              <span className="text-blue-600 font-semibold">Open → </span>
            </Link>
            <Link href="/tools/time-tracking" className="card hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-3">Time Tracking</h3>
              <p className="text-gray-700 mb-4">Track profitability.</p>
              <span className="text-blue-600 font-semibold">Open → </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ExpenseTracker;
