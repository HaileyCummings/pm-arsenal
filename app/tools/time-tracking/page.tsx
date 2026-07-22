'use client';

import { useState } from 'react';
import Link from 'next/link';

interface TimeEntry {
  id: string;
  projectName: string;
  date: string;
  hoursSpent: number;
  estimatedHours: number;
  hourlyRate: number;
}

const TimeTrackingHelper = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    { id: '1', projectName: 'Project A', date: '2024-01-15', hoursSpent: 8, estimatedHours: 8, hourlyRate: 150 },
    { id: '2', projectName: 'Project A', date: '2024-01-16', hoursSpent: 6, estimatedHours: 8, hourlyRate: 150 },
    { id: '3', projectName: 'Project B', date: '2024-01-15', hoursSpent: 4, estimatedHours: 5, hourlyRate: 120 },
  ]);

  const addEntry = () => {
    const newId = String(Math.max(...timeEntries.map(e => parseInt(e.id)), 0) + 1);
    setTimeEntries([...timeEntries, {
      id: newId,
      projectName: 'New Project',
      date: new Date().toISOString().split('T')[0],
      hoursSpent: 0,
      estimatedHours: 0,
      hourlyRate: 150,
    }]);
  };

  const updateEntry = (id: string, field: keyof TimeEntry, value: any) => {
    setTimeEntries(timeEntries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeEntry = (id: string) => {
    setTimeEntries(timeEntries.filter(e => e.id !== id));
  };

  // Group by project for summary
  const projectSummary = timeEntries.reduce((acc, entry) => {
    const existing = acc.find(p => p.projectName === entry.projectName);
    if (existing) {
      existing.totalHours += entry.hoursSpent;
      existing.estimatedTotal += entry.estimatedHours;
      existing.revenue += entry.hoursSpent * entry.hourlyRate;
    } else {
      acc.push({
        projectName: entry.projectName,
        totalHours: entry.hoursSpent,
        estimatedTotal: entry.estimatedHours,
        revenue: entry.hoursSpent * entry.hourlyRate,
        hourlyRate: entry.hourlyRate,
      });
    }
    return acc;
  }, [] as any[]);

  const totalHoursSpent = timeEntries.reduce((sum, e) => sum + e.hoursSpent, 0);
  const totalEstimatedHours = timeEntries.reduce((sum, e) => sum + e.estimatedHours, 0);
  const totalRevenue = timeEntries.reduce((sum, e) => sum + (e.hoursSpent * e.hourlyRate), 0);
  const totalEstimatedRevenue = timeEntries.reduce((sum, e) => sum + (e.estimatedHours * e.hourlyRate), 0);
  const averageEffectiveRate = totalHoursSpent > 0 ? totalRevenue / totalHoursSpent : 0;

  const projectsOverBudget = projectSummary.filter(p => p.totalHours > p.estimatedTotal);
  const projectsUnderBudget = projectSummary.filter(p => p.totalHours < p.estimatedTotal);

  const exportTimesheet = () => {
    const csv = [
      ['Time Tracking Report'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Project', 'Date', 'Hours Spent', 'Estimated Hours', 'Rate', 'Revenue'],
      ...timeEntries.map(e => [e.projectName, e.date, e.hoursSpent, e.estimatedHours, `$${e.hourlyRate}`, `$${(e.hoursSpent * e.hourlyRate).toFixed(2)}`]),
      [],
      ['Summary'],
      ['Total Hours Worked', totalHoursSpent],
      ['Total Estimated Hours', totalEstimatedHours],
      ['Total Revenue', `$${totalRevenue.toFixed(2)}`],
      ['Average Effective Rate', `$${averageEffectiveRate.toFixed(2)}`],
    ];

    const csvContent = csv.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timesheet_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <>
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <Link href="/tools" className="text-purple-100 hover:text-white mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-4xl font-bold mb-4">Time Tracking & Rate Helper</h1>
          <p className="text-xl">Track project time and identify profitability gaps</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Time Entries */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Time Entries</h2>
                  <button
                    onClick={addEntry}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    + Add Entry
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {timeEntries.map((entry) => (
                    <div key={entry.id} className="grid grid-cols-1 md:grid-cols-7 gap-3 items-end p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Project</label>
                        <input
                          type="text"
                          value={entry.projectName}
                          onChange={(e) => updateEntry(entry.id, 'projectName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          value={entry.date}
                          onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Hours Spent</label>
                        <input
                          type="number"
                          value={entry.hoursSpent}
                          onChange={(e) => updateEntry(entry.id, 'hoursSpent', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-purple-500"
                          step="0.5"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Est. Hours</label>
                        <input
                          type="number"
                          value={entry.estimatedHours}
                          onChange={(e) => updateEntry(entry.id, 'estimatedHours', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-purple-500"
                          step="0.5"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Rate/hr</label>
                        <input
                          type="number"
                          value={entry.hourlyRate}
                          onChange={(e) => updateEntry(entry.id, 'hourlyRate', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-purple-500"
                          step="5"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Revenue</label>
                        <div className="px-3 py-2 bg-white border border-gray-300 rounded text-sm font-semibold text-purple-600">
                          ${(entry.hoursSpent * entry.hourlyRate).toFixed(2)}
                        </div>
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

              {/* Project Summary */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">By Project</h2>
                <div className="space-y-3">
                  {projectSummary.map((project) => {
                    const variance = project.totalHours - project.estimatedTotal;
                    const isOverBudget = variance > 0;
                    return (
                      <div key={project.projectName} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{project.projectName}</h3>
                          <p className="text-sm text-gray-600">
                            {project.totalHours.toFixed(1)} / {project.estimatedTotal.toFixed(1)} hours
                            <span className={`ml-2 font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                              {isOverBudget ? '+' : ''}{variance.toFixed(1)} hrs
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">${project.revenue.toFixed(2)}</div>
                          <div className="text-sm text-gray-600">${project.hourlyRate}/hr</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="space-y-6">
              <div className="bg-purple-600 text-white rounded-lg shadow-lg p-6 sticky top-20">
                <h2 className="text-2xl font-bold mb-6">Overall Summary</h2>
                
                <div className="space-y-4 pb-6 border-b border-purple-400">
                  <div>
                    <p className="text-purple-100 text-sm font-semibold mb-1">HOURS WORKED</p>
                    <div className="text-3xl font-bold">{totalHoursSpent.toFixed(1)}</div>
                    <p className="text-sm text-purple-200">Est: {totalEstimatedHours.toFixed(1)} hours</p>
                  </div>
                  <div>
                    <p className="text-purple-100 text-sm font-semibold mb-1">TOTAL REVENUE</p>
                    <div className="text-3xl font-bold">${totalRevenue.toFixed(2)}</div>
                    <p className="text-sm text-purple-200">Est: ${totalEstimatedRevenue.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-purple-100 text-sm font-semibold mb-1">EFFECTIVE RATE</p>
                    <div className="text-3xl font-bold">${averageEffectiveRate.toFixed(2)}/hr</div>
                  </div>
                </div>

                {projectsOverBudget.length > 0 && (
                  <div className="mt-6 p-4 bg-red-500 bg-opacity-20 rounded-lg border border-red-400">
                    <h3 className="font-bold text-red-200 mb-2">⚠️ Over Budget</h3>
                    <ul className="text-sm space-y-1 text-red-100">
                      {projectsOverBudget.map(p => (
                        <li key={p.projectName}>• {p.projectName}: +{(p.totalHours - p.estimatedTotal).toFixed(1)} hrs</li>
                      ))}
                    </ul>
                  </div>
                )}

                {projectsUnderBudget.length > 0 && (
                  <div className="mt-4 p-4 bg-green-500 bg-opacity-20 rounded-lg border border-green-400">
                    <h3 className="font-bold text-green-200 mb-2">✓ Under Budget</h3>
                    <ul className="text-sm space-y-1 text-green-100">
                      {projectsUnderBudget.map(p => (
                        <li key={p.projectName}>• {p.projectName}: {(p.totalHours - p.estimatedTotal).toFixed(1)} hrs</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                onClick={exportTimesheet}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                📥 Export Timesheet
              </button>

              <div className="card bg-purple-50">
                <h3 className="font-bold text-purple-900 mb-3">💡 Time Tracking Tips</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Track time consistently for accuracy</li>
                  <li>• Identify patterns in over/under-runs</li>
                  <li>• Use data to improve estimates</li>
                  <li>• Negotiate scope if consistently over-budget</li>
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
            <Link href="/tools/income-projector" className="card hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-3">Income Projector</h3>
              <p className="text-gray-700 mb-4">Model different scenarios.</p>
              <span className="text-blue-600 font-semibold">Open → </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default TimeTrackingHelper;
