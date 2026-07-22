'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Deliverable {
  id: string;
  name: string;
  estimatedHours: number;
  hourlyRate: number;
}

const ProjectPricingCalculator = () => {
  const [projectName, setProjectName] = useState('Website Redesign');
  const [hourlyRate, setHourlyRate] = useState(150);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    { id: '1', name: 'Discovery & Strategy', estimatedHours: 20, hourlyRate: 150 },
    { id: '2', name: 'Design & Wireframes', estimatedHours: 40, hourlyRate: 150 },
    { id: '3', name: 'Development Oversight', estimatedHours: 60, hourlyRate: 150 },
    { id: '4', name: 'Testing & Launch', estimatedHours: 15, hourlyRate: 150 },
  ]);
  const [profitMargin, setProfitMargin] = useState(25);
  const [contingency, setContingency] = useState(10);

  const addDeliverable = () => {
    const newId = String(Math.max(...deliverables.map(d => parseInt(d.id)), 0) + 1);
    setDeliverables([...deliverables, { id: newId, name: 'New Deliverable', estimatedHours: 0, hourlyRate }]);
  };

  const updateDeliverable = (id: string, field: keyof Deliverable, value: any) => {
    setDeliverables(deliverables.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const removeDeliverable = (id: string) => {
    setDeliverables(deliverables.filter(d => d.id !== id));
  };

  const totalHours = deliverables.reduce((sum, d) => sum + d.estimatedHours, 0);
  const laborCost = deliverables.reduce((sum, d) => sum + (d.estimatedHours * d.hourlyRate), 0);
  const contingencyAmount = laborCost * (contingency / 100);
  const subtotalWithContingency = laborCost + contingencyAmount;
  const profitAmount = subtotalWithContingency * (profitMargin / 100);
  const projectPrice = subtotalWithContingency + profitAmount;
  const effectiveHourlyRate = projectPrice / totalHours;

  const exportToCSV = () => {
    const csv = [
      ['Project Pricing Quote'],
      ['Project Name', projectName],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['Deliverable', 'Hours', 'Rate/Hour', 'Total'],
      ...deliverables.map(d => [d.name, d.estimatedHours, `$${d.hourlyRate}`, `$${(d.estimatedHours * d.hourlyRate).toFixed(2)}`]),
      [],
      ['Total Hours', totalHours],
      ['Labor Cost', `$${laborCost.toFixed(2)}`],
      [`Contingency (${contingency}%)`, `$${contingencyAmount.toFixed(2)}`],
      ['Subtotal with Contingency', `$${subtotalWithContingency.toFixed(2)}`],
      [`Profit Margin (${profitMargin}%)`, `$${profitAmount.toFixed(2)}`],
      ['PROJECT PRICE', `$${projectPrice.toFixed(2)}`],
      ['Effective Hourly Rate', `$${effectiveHourlyRate.toFixed(2)}`],
    ];
    
    const csvContent = csv.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}_pricing.csv`;
    a.click();
  };

  return (
    <>
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <Link href="/tools" className="text-blue-100 hover:text-white mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-4xl font-bold mb-4">Project Pricing Calculator</h1>
          <p className="text-xl">Break down deliverables and calculate project-based pricing</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Info */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Project Details</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Hourly Rate</label>
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-gray-700 mr-3">$</span>
                      <input
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => {
                          const newRate = parseFloat(e.target.value) || 0;
                          setHourlyRate(newRate);
                          setDeliverables(deliverables.map(d => ({ ...d, hourlyRate: newRate })));
                        }}
                        className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        step="5"
                      />
                      <span className="ml-3 text-gray-600">/hour</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deliverables */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Deliverables</h2>
                <div className="space-y-4">
                  {deliverables.map(deliverable => (
                    <div key={deliverable.id} className="flex gap-4 items-end p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={deliverable.name}
                          onChange={(e) => updateDeliverable(deliverable.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="w-28">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Hours</label>
                        <input
                          type="number"
                          value={deliverable.estimatedHours}
                          onChange={(e) => updateDeliverable(deliverable.id, 'estimatedHours', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                          step="1"
                          min="0"
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Total</label>
                        <div className="px-3 py-2 bg-white border border-gray-300 rounded text-sm font-semibold text-blue-600">
                          ${(deliverable.estimatedHours * deliverable.hourlyRate).toFixed(2)}
                        </div>
                      </div>
                      <button
                        onClick={() => removeDeliverable(deliverable.id)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addDeliverable}
                  className="mt-6 w-full px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-semibold hover:bg-blue-200 transition"
                >
                  + Add Deliverable
                </button>
              </div>

              {/* Margins */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Pricing Adjustments</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-semibold text-gray-700">Contingency Buffer ({contingency}%)</label>
                      <span className="text-sm text-gray-600">For unexpected work</span>
                    </div>
                    <input
                      type="range"
                      value={contingency}
                      onChange={(e) => setContingency(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                      min="0"
                      max="30"
                      step="5"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-semibold text-gray-700">Profit Margin ({profitMargin}%)</label>
                      <span className="text-sm text-gray-600">For business overhead & profit</span>
                    </div>
                    <input
                      type="range"
                      value={profitMargin}
                      onChange={(e) => setProfitMargin(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                      min="0"
                      max="50"
                      step="5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div>
              <div className="bg-blue-600 text-white rounded-lg shadow-lg p-8 mb-6 sticky top-20">
                <h2 className="text-2xl font-bold mb-8">Project Price Quote</h2>
                
                <div className="space-y-6 mb-8 pb-8 border-b border-blue-400">
                  <div>
                    <p className="text-blue-100 text-sm font-semibold mb-1">TOTAL HOURS</p>
                    <div className="text-3xl font-bold">{totalHours} hours</div>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm font-semibold mb-1">LABOR COST</p>
                    <div className="text-3xl font-bold">${laborCost.toFixed(2)}</div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Contingency ({contingency}%)</span>
                    <span className="font-semibold">${contingencyAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Profit Margin ({profitMargin}%)</span>
                    <span className="font-semibold">${profitAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-blue-700 rounded-lg p-6 mb-6">
                  <p className="text-blue-100 text-sm font-semibold mb-2">TOTAL PROJECT PRICE</p>
                  <div className="text-4xl font-bold">${projectPrice.toFixed(2)}</div>
                </div>

                <div className="bg-blue-500 rounded-lg p-4">
                  <p className="text-blue-100 text-xs font-semibold mb-1">EFFECTIVE HOURLY RATE</p>
                  <div className="text-2xl font-bold">${effectiveHourlyRate.toFixed(2)}/hr</div>
                </div>
              </div>

              <button
                onClick={exportToCSV}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition mb-4"
              >
                📥 Download Quote
              </button>

              <div className="card bg-blue-50">
                <h3 className="font-bold text-blue-900 mb-3">💡 Pricing Tips</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Set contingency to 10-20% for new clients</li>
                  <li>• Increase profit margin for specialized work</li>
                  <li>• Consider value-based pricing vs. time-based</li>
                  <li>• Build retainer pricing into project estimates</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="bg-gray-50 py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/tools/rate-calculator" className="card hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-3">Rate Calculator</h3>
              <p className="text-gray-700 mb-4">Determine your ideal hourly rate.</p>
              <span className="text-blue-600 font-semibold">Open → </span>
            </Link>
            <Link href="/tools/income-projector" className="card hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-3">Income Projector</h3>
              <p className="text-gray-700 mb-4">Model different pricing scenarios.</p>
              <span className="text-blue-600 font-semibold">Open → </span>
            </Link>
            <Link href="/tools/time-tracking" className="card hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-3">Time Tracking Helper</h3>
              <p className="text-gray-700 mb-4">Track project time and profitability.</p>
              <span className="text-blue-600 font-semibold">Open → </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectPricingCalculator;
