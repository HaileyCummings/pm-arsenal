'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ClientScenario {
  id: string;
  name: string;
  hoursPerWeek: number;
  hourlyRate: number;
  type: 'hourly' | 'retainer';
}

const IncomeProjector = () => {
  const [weeksPerYear, setWeeksPerYear] = useState(48);
  const [nonBillablePercent, setNonBillablePercent] = useState(20);
  const [clients, setClients] = useState<ClientScenario[]>([
    { id: '1', name: 'Client A (Retainer)', hoursPerWeek: 20, hourlyRate: 150, type: 'retainer' },
    { id: '2', name: 'Client B (Project)', hoursPerWeek: 15, hourlyRate: 180, type: 'hourly' },
    { id: '3', name: 'Client C (Part-time)', hoursPerWeek: 10, hourlyRate: 120, type: 'hourly' },
  ]);

  const addClient = () => {
    const newId = String(Math.max(...clients.map(c => parseInt(c.id)), 0) + 1);
    setClients([...clients, {
      id: newId,
      name: 'New Client',
      hoursPerWeek: 10,
      hourlyRate: 150,
      type: 'hourly',
    }]);
  };

  const updateClient = (id: string, field: keyof ClientScenario, value: any) => {
    setClients(clients.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
  };

  // Calculate income
  const totalHoursPerWeek = clients.reduce((sum, c) => sum + c.hoursPerWeek, 0);
  const billableHoursPerWeek = totalHoursPerWeek * ((100 - nonBillablePercent) / 100);
  
  const clientRevenue = clients.map(client => ({
    ...client,
    weeklyRevenue: client.hoursPerWeek * client.hourlyRate,
    annualRevenue: client.hoursPerWeek * client.hourlyRate * weeksPerYear,
  }));

  const totalWeeklyRevenue = clientRevenue.reduce((sum, c) => sum + c.weeklyRevenue, 0);
  const totalAnnualRevenue = clientRevenue.reduce((sum, c) => sum + c.annualRevenue, 0);
  const monthlyAverage = totalAnnualRevenue / 12;
  const weeklyAverage = totalAnnualRevenue / weeksPerYear;

  // Scenarios
  const scenarios = [
    {
      name: 'Conservative (80% utilization)',
      utilization: 0.8,
      description: 'Account for gaps between clients',
    },
    {
      name: 'Moderate (100% utilization)',
      utilization: 1.0,
      description: 'All proposed hours booked',
    },
    {
      name: 'Optimistic (120% utilization)',
      utilization: 1.2,
      description: 'New clients or increased rates',
    },
  ];

  const exportProjection = () => {
    const csv = [
      ['Income Projection Report'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Client Scenarios'],
      ['Client', 'Type', 'Hours/Week', 'Hourly Rate', 'Weekly Revenue', 'Annual Revenue'],
      ...clients.map(c => {
        const rev = clientRevenue.find(cr => cr.id === c.id);
        return [c.name, c.type, c.hoursPerWeek, `$${c.hourlyRate}`, `$${rev?.weeklyRevenue.toFixed(2)}`, `$${rev?.annualRevenue.toFixed(2)}`];
      }),
      [],
      ['Totals'],
      ['Weekly Revenue', `$${totalWeeklyRevenue.toFixed(2)}`],
      ['Annual Revenue (All Scenarios)', `$${totalAnnualRevenue.toFixed(2)}`],
      ['Monthly Average', `$${monthlyAverage.toFixed(2)}`],
      [],
      ['Scenario Analysis'],
      ...scenarios.map(s => {
        const revenue = totalAnnualRevenue * s.utilization;
        return [s.name, `$${revenue.toFixed(2)}`, `Monthly: $${(revenue / 12).toFixed(2)}`];
      }),
    ];

    const csvContent = csv.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `income_projection_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <>
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <Link href="/tools" className="text-green-100 hover:text-white mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-4xl font-bold mb-4">Income Projector</h1>
          <p className="text-xl">Model different client scenarios and project annual income</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Client Input */}
            <div className="lg:col-span-2 space-y-8">
              {/* Global Settings */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Assumptions</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-semibold text-gray-700">Billable Weeks Per Year</label>
                      <span className="text-2xl font-bold text-green-600">{weeksPerYear}</span>
                    </div>
                    <input
                      type="range"
                      value={weeksPerYear}
                      onChange={(e) => setWeeksPerYear(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                      min="40"
                      max="52"
                      step="1"
                    />
                    <p className="text-sm text-gray-500 mt-2">Accounts for vacation and holidays</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-semibold text-gray-700">Non-Billable Time (%)</label>
                      <span className="text-2xl font-bold text-green-600">{nonBillablePercent}%</span>
                    </div>
                    <input
                      type="range"
                      value={nonBillablePercent}
                      onChange={(e) => setNonBillablePercent(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                      min="0"
                      max="50"
                      step="5"
                    />
                    <p className="text-sm text-gray-500 mt-2">Admin, marketing, sales time</p>
                  </div>
                </div>
              </div>

              {/* Client Scenarios */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Client Scenarios</h2>
                  <button
                    onClick={addClient}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    + Add Client
                  </button>
                </div>

                <div className="space-y-4">
                  {clients.map(client => {
                    const revenue = clientRevenue.find(cr => cr.id === client.id);
                    return (
                      <div key={client.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Client Name</label>
                          <input
                            type="text"
                            value={client.name}
                            onChange={(e) => updateClient(client.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Type</label>
                          <select
                            value={client.type}
                            onChange={(e) => updateClient(client.id, 'type', e.target.value as 'hourly' | 'retainer')}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-green-500"
                          >
                            <option value="hourly">Hourly</option>
                            <option value="retainer">Retainer</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Hrs/Week</label>
                          <input
                            type="number"
                            value={client.hoursPerWeek}
                            onChange={(e) => updateClient(client.id, 'hoursPerWeek', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-green-500"
                            step="1"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Rate/Hr</label>
                          <input
                            type="number"
                            value={client.hourlyRate}
                            onChange={(e) => updateClient(client.id, 'hourlyRate', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-green-500"
                            step="5"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Annual</label>
                          <div className="px-3 py-2 bg-white border border-gray-300 rounded text-sm font-semibold text-green-600">
                            ${revenue?.annualRevenue.toFixed(0)}
                          </div>
                        </div>
                        <button
                          onClick={() => removeClient(client.id)}
                          className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition text-sm font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Summary & Scenarios */}
            <div className="space-y-6">
              <div className="bg-green-600 text-white rounded-lg shadow-lg p-6 sticky top-20">
                <h2 className="text-2xl font-bold mb-6">Income Summary</h2>
                
                <div className="space-y-4 pb-6 border-b border-green-400">
                  <div>
                    <p className="text-green-100 text-sm font-semibold mb-1">WEEKLY</p>
                    <div className="text-3xl font-bold">${totalWeeklyRevenue.toFixed(2)}</div>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm font-semibold mb-1">MONTHLY AVG</p>
                    <div className="text-3xl font-bold">${monthlyAverage.toFixed(2)}</div>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm font-semibold mb-1">ANNUAL</p>
                    <div className="text-4xl font-bold">${totalAnnualRevenue.toFixed(2)}</div>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-green-100 text-sm font-semibold mb-3">Hours/Week: {totalHoursPerWeek}h</p>
                  <p className="text-green-100 text-sm font-semibold mb-3">Billable: {billableHoursPerWeek.toFixed(1)}h</p>
                </div>
              </div>

              <button
                onClick={exportProjection}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                📊 Export Projection
              </button>

              {/* Scenarios */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Utilization Scenarios</h3>
                {scenarios.map(scenario => {
                  const projectedRevenue = totalAnnualRevenue * scenario.utilization;
                  const monthlyRevenue = projectedRevenue / 12;
                  return (
                    <div key={scenario.name} className="card">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-gray-900">{scenario.name}</h4>
                          <p className="text-xs text-gray-500">{scenario.description}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Annual</span>
                          <span className="font-bold text-lg text-green-600">${projectedRevenue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-gray-700 text-sm">Monthly</span>
                          <span className="font-bold text-green-600">${monthlyRevenue.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="card bg-green-50">
                <h3 className="font-bold text-green-900 mb-3">💡 Projection Tips</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Be realistic about utilization rates</li>
                  <li>• Plan for client onboarding gaps</li>
                  <li>• Account for project cycles</li>
                  <li>• Adjust scenarios quarterly</li>
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
            <Link href="/tools/project-pricing" className="card hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-3">Project Pricing</h3>
              <p className="text-gray-700 mb-4">Price projects with deliverables.</p>
              <span className="text-blue-600 font-semibold">Open → </span>
            </Link>
            <Link href="/tools/time-tracking" className="card hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-3">Time Tracking</h3>
              <p className="text-gray-700 mb-4">Track time and profitability.</p>
              <span className="text-blue-600 font-semibold">Open → </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default IncomeProjector;
