import Link from 'next/link';

export default function ToolsPage() {
  const tools = [
    {
      title: 'Hourly Rate Calculator',
      description: 'Calculate your ideal hourly rate based on target annual income, working hours, and expenses.',
      icon: '💰',
      href: '/tools/rate-calculator',
    },
    {
      title: 'Project Pricing Calculator',
      description: 'Estimate project costs, break down deliverables, and determine competitive pricing.',
      icon: '📊',
      href: '/tools/project-pricing',
    },
    {
      title: 'Time Tracking & Rate Helper',
      description: 'Track project time and get real-time insights on your effective hourly rate.',
      icon: '⏱️',
      href: '/tools/time-tracking',
    },
    {
      title: 'Capacity Planner',
      description: 'Manage multiple clients, track availability, and forecast capacity across engagements.',
      icon: '📅',
      href: '/tools/capacity-planner',
    },
    {
      title: 'Income Projector',
      description: 'Model different pricing scenarios and project annual income based on client mix.',
      icon: '📈',
      href: '/tools/income-projector',
    },
    {
      title: 'Expense Tracker',
      description: 'Track business expenses and understand your true profitability per client.',
      icon: '💾',
      href: '/tools/expense-tracker',
    },
  ];

  return (
    <>
      <section className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Productivity Tools</h1>
          <p className="text-xl">Calculators, worksheets, and tracking tools to support your fractional PM business</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="card group hover:shadow-xl transition transform hover:scale-105"
              >
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">{tool.title}</h3>
                <p className="text-gray-700 mb-4">{tool.description}</p>
                <span className="text-blue-600 font-semibold group-hover:underline">Launch Tool →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-orange-50 py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use These Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-orange-500 mb-3">1</div>
              <h3 className="text-xl font-bold mb-2">Choose Your Tool</h3>
              <p className="text-gray-700">Select the calculator or worksheet that matches your current need.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-orange-500 mb-3">2</div>
              <h3 className="text-xl font-bold mb-2">Enter Your Data</h3>
              <p className="text-gray-700">Input your information—all calculations happen in real-time in your browser.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-orange-500 mb-3">3</div>
              <h3 className="text-xl font-bold mb-2">Get Insights</h3>
              <p className="text-gray-700">Review results and export or save your calculations for future reference.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
