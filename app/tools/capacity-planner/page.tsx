'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CapacityEntry {
  id: string;
  clientName: string;
  hoursPerWeek: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed';
  color: string;
}

const CapacityPlanner = () => {
  const [totalCapacity, setTotalCapacity] = useState(40);
  const [entries, setEntries] = useState<CapacityEntry[]>([
    {
      id: '1',
      clientName: 'Client A (Retainer)',
      hoursPerWeek: 20,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      color: 'bg-blue-500',
    },
    {
      id: '2',
      clientName: 'Client B (Project)',
      hoursPerWeek: 15,
      startDate: '2024-02-01',
      endDate: '2024-05-31',
      status: 'active',
      color: 'bg-purple-500',
    },
    {
      id: '3',
      clientName: 'Client C (Upcoming)',
      hoursPerWeek: 10,
      startDate: '2024-06-01',
      endDate: '2024-12-31',
      status: 'upcoming',
      color: 'bg-green-500',
    },
  ]);

  const addEntry = () => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
    const newId = String(Math.max(...entries.map(e => parseInt(e.id)), 0) + 1);
    setEntries([...entries, {
      id: newId,
      clientName: 'New Client',
      hoursPerWeek: 10,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      color: colors[entries.length % colors.length],
    }]);
  };

  const updateEntry = (id: string, field: keyof CapacityEntry, value: any) => {
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  // Calculate current capacity
  const activeEntries = entries.filter(e => e.status === 'active');
  const usedCapacity = activeEntries.reduce((sum, e) => sum + e.hoursPerWeek, 0);
  const availableCapacity = totalCapacity - usedCapacity;
  const utilizationPercent = Math.round((usedCapacity / totalCapacity) * 100);

  // Summary by status
  const upcomingEntries = entries.filter(e => e.status === 'upcoming');
  const completedEntries = entries.filter(e => e.status === 'completed');

  // Forecast next 3 months
  const today = new Date();
  const months = [];
  for (let i = 0; i < 3; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    const monthHours = entries
      .filter(e => {
        const startDate = new Date(e.startDate);
        const endDate = new Date(e.endDate);
        return startDate <= date && endDate >= date;
      })
      .reduce((sum, e) => sum + e.hoursPerWeek, 0);
    
    months.push({
      month: monthStr,
      hours: monthHours,
      utilization: Math.round((monthHours / totalCapacity) * 100),
    });
  }

  const exportPlan = () => {
    const csv = [
      ['Capacity Plan'],
      ['Generated', new Date().toLocaleDateString()],
      ['Total Weekly Capacity', `${totalCapacity} hours`],
      [],
      ['Current Engagements'],
      ['Client', 'Hours/Week', 'Start Date', 'End Date', 'Status'],
      ...entries.map(e => [e.clientName, e.hoursPerWeek, e.startDate, e.endDate, e.status]),
      [],
      ['Capacity Summary'],
      ['Used Capacity', `${usedCapacity} hours`],
      ['Available Capacity', `${availableCapacity} hours`],
      ['Utilization', `${utilizationPercent}%`],
      [],
      ['3-Month Forecast'],
      ['Month', 'Allocated Hours', 'Utilization %'],
      ...months.map(m => [m.month, m.hours, `${m.utilization}%`]),
    ];

    const csvContent = csv.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `capacity_plan_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <>
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <Link href="/tools" className="text-indigo-100 hover:text-white mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-4xl font-bold mb-4">Capacity Planner</h1>
          <p className="text-xl">Manage multiple clients and forecast your availability</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Total Capacity */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Your Capacity</h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Total Available Hours Per Week
                  </label>
                  <input
                    type="number"
                    value={totalCapacity}
                    onChange={(e) => setTotalCapacity(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-lg"
                    step="5"
                    min="1"
                  />
                  <p className="text-sm text-gray-500 mt-2">Typically 40 for full-time equivalent</p>
                </div>
              </div>

              {/* Client Engagements */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Client Engagements</h2>
                  <button
                    onClick={addEntry}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                  >
                    + Add Engagement
                  </button>
                </div>

                <div className="space-y-4">
                  {entries.map((entry) => (
                    <div key={entry.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Client</label>
                        <input
                          type="text"
                          value={entry.clientName}
                          onChange={(e) => updateEntry(entry.id, 'clientName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Hours/Week</label>
                        <input
                          type="number"
                          value={entry.hoursPerWeek}
                          onChange={(e) => updateEntry(entry.id, 'hoursPerWeek', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500"
                          step="1"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Start</label>
                        <input
                          type="date"
                          value={entry.startDate}
                          onChange={(e) => updateEntry(entry.id, 'startDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">End</label>
                        <input
                          type="date"
                          value={entry.endDate}
                          onChange={(e) => updateEntry(entry.id, 'endDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                        <select
                          value={entry.status}
                          onChange={(e) => updateEntry(entry.id, 'status', e.target.value as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500"
                        >
                          <option value="active">Active</option>
                          <option value="upcoming">Upcoming</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <button
                        onClick={() => removeEntry(entry.id)}
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
              {/* Current Utilization */}
              <div className="bg-indigo-600 text-white rounded-lg shadow-lg p-6 sticky top-20">
                <h2 className="text-2xl font-bold mb-6">Current Status</h2>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-indigo-100 text-sm font-semibold mb-2">CAPACITY USED</p>
                    <div className="text-4xl font-bold mb-2">{usedCapacity}h</div>
                    <div className="bg-indigo-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-green-400 h-full transition-all"
                        style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                      />
                    </div>
                    <p className="text-indigo-100 text-sm mt-2">{utilizationPercent}% utilized</p>
                  </div>
                  
                  <div className="pt-4 border-t border-indigo-400">
                    <p className="text-indigo-100 text-sm font-semibold mb-1">AVAILABLE</p>
                    <div className="text-2xl font-bold text-green-300">{availableCapacity}h / week</div>
                  </div>

                  <div className="pt-4 border-t border-indigo-400">
                    <p className="text-indigo-100 text-sm font-semibold mb-1">TOTAL CAPACITY</p>
                    <div className="text-2xl font-bold">{totalCapacity}h / week</div>
                  </div>
                </div>
              </div>

              {/* Engagement Summary */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Engagement Summary</h3>
                
                {activeEntries.length > 0 && (
                  <div className="card bg-blue-50">
                    <h4 className="font-bold text-blue-900 mb-2">✓ Active ({activeEntries.length})</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {activeEntries.map(e => (
                        <li key={e.id}>{e.clientName}: {e.hoursPerWeek}h</li>
                      ))}
                    </ul>
                  </div>
                )}

                {upcomingEntries.length > 0 && (
                  <div className="card bg-green-50">
                    <h4 className="font-bold text-green-900 mb-2">⏳ Upcoming ({upcomingEntries.length})</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {upcomingEntries.map(e => (
                        <li key={e.id}>{e.clientName}: {e.hoursPerWeek}h</li>
                      ))}
                    </ul>
                  </div>
                )}

                {completedEntries.length > 0 && (
                  <div className="card bg-gray-50">
                    <h4 className="font-bold text-gray-900 mb-2">✔ Completed ({completedEntries.length})</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {completedEntries.map(e => (
                        <li key={e.id}>{e.clientName}: {e.hoursPerWeek}h</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Forecast */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-4">3-Month Forecast</h3>
                <div className="space-y-3">
                  {months.map((m) => (
                    <div key={m.month}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-gray-700">{m.month}</span>
                        <span className="text-sm font-bold text-indigo-600">{m.utilization}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            m.utilization > 100 ? 'bg-red-500' : m.utilization > 80 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(m.utilization, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{m.hours}h allocated</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={exportPlan}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                📋 Export Plan
              </button>

              <div className="card bg-indigo-50">
                <h3 className="font-bold text-indigo-900 mb-3">💡 Planning Tips</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Aim for 70-80% utilization to avoid burnout</li>
                  <li>• Keep 20-30% buffer for new opportunities</li>
                  <li>• Plan 2-3 months ahead</li>
                  <li>• Review quarterly</li>
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
            <Link href="/tools/income-projector" className="card hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-3">Income Projector</h3>
              <p className="text-gray-700 mb-4">Model income scenarios.</p>
              <span className="text-blue-600 font-semibold">Open → </span>
            </Link>
            <Link href="/tools/expense-tracker" className="card hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-3">Expense Tracker</h3>
              <p className="text-gray-700 mb-4">Track business expenses.</p>
              <span className="text-blue-600 font-semibold">Open → </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default CapacityPlanner;
