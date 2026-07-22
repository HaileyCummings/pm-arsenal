'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CalculatorInputs {
  targetIncome: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  vacationWeeks: number;
  nonBillablePercent: number;
  businessExpenses: number;
}

interface Results {
  totalHoursPerYear: number;
  billableHoursPerYear: number;
  baseHourlyRate: number;
  rateWithMargin: number;
  dailyRate: number;
  weeklyRate: number;
}

const calculateRates = (inputs: CalculatorInputs): Results => {
  const { targetIncome, hoursPerWeek, weeksPerYear, vacationWeeks, nonBillablePercent, businessExpenses } = inputs;

  // Calculate working weeks
  const workingWeeks = weeksPerYear - vacationWeeks;
  const totalHours = hoursPerWeek * workingWeeks;
  
  // Account for non-billable time
  const billableHours = totalHours * ((100 - nonBillablePercent) / 100);
  
  // Calculate required income to cover business expenses
  const requiredGrossIncome = targetIncome + businessExpenses;
  
  // Base hourly rate
  const baseRate = billableHours > 0 ? requiredGrossIncome / billableHours : 0;
  
  // Add 20% margin for taxes and buffer
  const rateWithMargin = baseRate * 1.2;
  
  // Calculate daily and weekly rates (8 hours/day, 40 hours/week)
  const dailyRate = rateWithMargin * 8;
  const weeklyRate = rateWithMargin * 40;

  return {
    totalHoursPerYear: totalHours,
    billableHoursPerYear: billableHours,
    baseHourlyRate: Math.round(baseRate * 100) / 100,
    rateWithMargin: Math.round(rateWithMargin * 100) / 100,
    dailyRate: Math.round(dailyRate * 100) / 100,
    weeklyRate: Math.round(weeklyRate * 100) / 100,
  };
};

export default function HourlyRateCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    targetIncome: 100000,
    hoursPerWeek: 40,
    weeksPerYear: 52,
    vacationWeeks: 3,
    nonBillablePercent: 25,
    businessExpenses: 5000,
  });

  const results = calculateRates(inputs);

  const handleChange = (field: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setInputs({
      targetIncome: 100000,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      vacationWeeks: 3,
      nonBillablePercent: 25,
      businessExpenses: 5000,
    });
  };

  return (
    <>
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <Link href="/tools" className="text-blue-100 hover:text-white mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-4xl font-bold mb-4">Hourly Rate Calculator</h1>
          <p className="text-xl">Determine your ideal hourly rate based on income goals and availability</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Input Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-8">Your Information</h2>
              
              <div className="space-y-8">
                {/* Target Annual Income */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Target Annual Income (Take-Home)
                  </label>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-gray-700 mr-3">$</span>
                    <input
                      type="number"
                      value={inputs.targetIncome}
                      onChange={(e) => handleChange('targetIncome', parseFloat(e.target.value) || 0)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      step="5000"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">The net income you want to earn annually</p>
                </div>

                {/* Hours Per Week */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Hours Available Per Week
                  </label>
                  <input
                    type="number"
                    value={inputs.hoursPerWeek}
                    onChange={(e) => handleChange('hoursPerWeek', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    step="5"
                    min="1"
                  />
                  <p className="text-sm text-gray-500 mt-2">Total hours you can work (e.g., 40 for full-time)</p>
                </div>

                {/* Weeks Per Year */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Weeks You Work Per Year
                  </label>
                  <input
                    type="number"
                    value={inputs.weeksPerYear}
                    onChange={(e) => handleChange('weeksPerYear', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    step="1"
                    min="1"
                    max="52"
                  />
                  <p className="text-sm text-gray-500 mt-2">Typically 52 weeks per year</p>
                </div>

                {/* Vacation Weeks */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Vacation Weeks Per Year
                  </label>
                  <input
                    type="number"
                    value={inputs.vacationWeeks}
                    onChange={(e) => handleChange('vacationWeeks', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    step="1"
                    min="0"
                    max="12"
                  />
                  <p className="text-sm text-gray-500 mt-2">Weeks you plan to take off annually</p>
                </div>

                {/* Non-Billable Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Non-Billable Time (%)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      value={inputs.nonBillablePercent}
                      onChange={(e) => handleChange('nonBillablePercent', parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                      min="0"
                      max="50"
                      step="5"
                    />
                    <span className="text-2xl font-bold text-blue-600 w-12 text-right">{inputs.nonBillablePercent}%</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Time spent on admin, marketing, sales (typical: 20-30%)</p>
                </div>

                {/* Business Expenses */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Annual Business Expenses
                  </label>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-gray-700 mr-3">$</span>
                    <input
                      type="number"
                      value={inputs.businessExpenses}
                      onChange={(e) => handleChange('businessExpenses', parseFloat(e.target.value) || 0)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      step="1000"
                      min="0"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Software, tools, health insurance, etc.</p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="mt-8 w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Reset to Defaults
              </button>
            </div>

            {/* Results Section */}
            <div>
              <div className="bg-blue-600 text-white rounded-lg shadow-lg p-8 mb-6">
                <h2 className="text-2xl font-bold mb-8">Your Recommended Rates</h2>
                
                {/* Primary Rate */}
                <div className="mb-8">
                  <p className="text-blue-100 text-sm font-semibold mb-2">HOURLY RATE</p>
                  <div className="text-5xl font-bold">${results.rateWithMargin.toFixed(2)}</div>
                  <p className="text-blue-100 text-sm mt-2">Includes 20% buffer for taxes & business needs</p>
                </div>

                {/* Alternative Rates */}
                <div className="bg-blue-700 rounded-lg p-6 space-y-6">
                  <div>
                    <p className="text-blue-100 text-sm font-semibold mb-2">DAILY RATE (8 hrs)</p>
                    <div className="text-3xl font-bold">${results.dailyRate.toFixed(2)}</div>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm font-semibold mb-2">WEEKLY RATE (40 hrs)</p>
                    <div className="text-3xl font-bold">${results.weeklyRate.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Breakdown Card */}
              <div className="card">
                <h3 className="text-xl font-bold mb-6">Calculation Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700">Total hours per year</span>
                    <span className="font-bold">{results.totalHoursPerYear.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700">Billable hours per year</span>
                    <span className="font-bold">{Math.round(results.billableHoursPerYear).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700">Base hourly rate (before buffer)</span>
                    <span className="font-bold">${results.baseHourlyRate.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-700">Recommended hourly rate</span>
                    <span className="font-bold text-blue-600 text-lg">${results.rateWithMargin.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="card mt-6 bg-blue-50">
                <h3 className="text-xl font-bold mb-4 text-blue-900">💡 Rate-Setting Tips</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex gap-3">
                    <span>•</span>
                    <span>This is your baseline. You can charge more for specialized expertise.</span>
                  </li>
                  <li className="flex gap-3">
                    <span>•</span>
                    <span>Consider market rates in your industry and geography.</span>
                  </li>
                  <li className="flex gap-3">
                    <span>•</span>
                    <span>Retainer clients may get a 10-20% discount for committed hours.</span>
                  </li>
                  <li className="flex gap-3">
                    <span>•</span>
                    <span>Project-based pricing may be higher per hour to account for fixed costs.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="bg-gray-50 py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">What's Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="text-xl font-bold mb-3">Project Pricing</h3>
              <p className="text-gray-700 mb-4">Use your hourly rate to calculate project-based pricing.</p>
              <Link href="/tools/project-pricing" className="text-blue-600 font-semibold hover:underline">
                Open Calculator →
              </Link>
            </div>
            <div className="card">
              <h3 className="text-xl font-bold mb-3">Rate Setting Guide</h3>
              <p className="text-gray-700 mb-4">Deep dive into pricing strategies and market research.</p>
              <Link href="/resources" className="text-blue-600 font-semibold hover:underline">
                View Resources →
              </Link>
            </div>
            <div className="card">
              <h3 className="text-xl font-bold mb-3">Income Projector</h3>
              <p className="text-gray-700 mb-4">Model different client scenarios and project mixes.</p>
              <Link href="/tools/income-projector" className="text-blue-600 font-semibold hover:underline">
                Open Calculator →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
