'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  downloadUrl?: string;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Fractional PM Contract Template',
    description: 'Comprehensive contract template covering scope, rates, payment terms, and IP rights for fractional engagements.',
    category: 'Contracts',
    type: 'PDF Template',
  },
  {
    id: '2',
    title: 'Rate Setting Guide',
    description: 'Guide to determining your hourly and project rates based on experience, market research, and value delivered.',
    category: 'Pricing',
    type: 'Guide',
  },
  {
    id: '3',
    title: 'Freelance PM Proposal Template',
    description: 'Professional proposal template for pitching your services to potential clients.',
    category: 'Sales',
    type: 'Word Template',
  },
  {
    id: '4',
    title: 'Project Pricing Worksheet',
    description: 'Interactive worksheet to calculate project costs, break-even points, and profit margins.',
    category: 'Pricing',
    type: 'Excel/Spreadsheet',
  },
  {
    id: '5',
    title: 'Client Onboarding Checklist',
    description: 'Comprehensive checklist for smoothly onboarding new clients and setting expectations.',
    category: 'Operations',
    type: 'Checklist',
  },
  {
    id: '6',
    title: 'Work Agreement & Scope Template',
    description: 'Document to clearly define scope, deliverables, timeline, and communication protocols.',
    category: 'Contracts',
    type: 'PDF Template',
  },
  {
    id: '7',
    title: 'Time Tracking Best Practices',
    description: 'Guide on implementing effective time tracking and billing practices.',
    category: 'Operations',
    type: 'Guide',
  },
  {
    id: '8',
    title: 'Capacity Planning Tool',
    description: 'Spreadsheet to manage multiple clients, track utilization, and forecast availability.',
    category: 'Operations',
    type: 'Excel/Spreadsheet',
  },
  {
    id: '9',
    title: 'Invoice Template',
    description: 'Professional invoice template customized for freelance/fractional PM services.',
    category: 'Finance',
    type: 'PDF Template',
  },
  {
    id: '10',
    title: 'Tax Planning Checklist for Freelancers',
    description: 'Checklist for managing taxes, deductions, and quarterly payments as a freelancer.',
    category: 'Finance',
    type: 'Checklist',
  },
];

const categories = ['All', ...Array.from(new Set(resources.map(r => r.category)))];

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredResources = selectedCategory === 'All'
    ? resources
    : resources.filter(r => r.category === selectedCategory);

  return (
    <>
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Resource Library</h1>
          <p className="text-xl">Templates, guides, and checklists to support your transition to fractional work</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Filter by Category</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <div key={resource.id} className="card">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                  {resource.type}
                </span>
                <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                <p className="text-gray-700 mb-4">{resource.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{resource.category}</span>
                  <button className="text-blue-600 font-semibold hover:underline">
                    Download →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-50 py-16">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Need a custom template?</h2>
          <p className="text-lg text-gray-700 mb-8">Can't find what you're looking for? Let us know and we'll add it to our library.</p>
          <button className="btn-primary">
            Request a Template
          </button>
        </div>
      </section>
    </>
  );
}
