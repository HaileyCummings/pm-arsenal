import Link from 'next/link';

export default function PortfolioGuidePage() {
  const sections = [
    {
      number: 1,
      title: 'Define Your PM Niche',
      description: 'Identify your specialization (SaaS, healthcare, agency, etc.) and target client profile.',
      details: [
        'Choose 2-3 PM specializations',
        'Define your ideal client size and industry',
        'Articulate your unique value proposition',
      ],
    },
    {
      number: 2,
      title: 'Document Your Experience',
      description: 'Compile your most relevant case studies and project results.',
      details: [
        'Select 3-5 standout projects',
        'Quantify results (timelines met, budget saved, features shipped)',
        'Highlight cross-functional leadership',
      ],
    },
    {
      number: 3,
      title: 'Create Case Studies',
      description: 'Transform projects into compelling case study narratives.',
      details: [
        'Challenge → Solution → Results format',
        'Include metrics and impact',
        'Show your PM approach and methodology',
      ],
    },
    {
      number: 4,
      title: 'Build Your Portfolio Site',
      description: 'Create a professional online presence for potential clients.',
      details: [
        'Simple, clean design focused on readability',
        'Case studies as main content',
        'Clear call-to-action and contact method',
      ],
    },
    {
      number: 5,
      title: 'Optimize for Discovery',
      description: 'Make sure potential clients can find you.',
      details: [
        'SEO optimization for PM-related keywords',
        'LinkedIn profile with portfolio link',
        'GitHub or Medium for thought leadership',
      ],
    },
    {
      number: 6,
      title: 'Gather Testimonials',
      description: 'Collect and showcase client feedback.',
      details: [
        'Request testimonials from past clients',
        'Focus on results and collaboration',
        'Feature prominently on portfolio site',
      ],
    },
  ];

  return (
    <>
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Portfolio Getting Started Guide</h1>
          <p className="text-xl">Build a compelling portfolio that attracts fractional PM clients</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Why You Need a Strong Portfolio</h2>
            <p className="text-lg text-gray-700 mb-4">
              As a fractional PM, your portfolio is your primary sales tool. It demonstrates your capabilities, approach, and results to potential clients. A strong portfolio:
            </p>
            <ul className="space-y-3 text-lg text-gray-700">
              <li>✓ Builds trust with unfamiliar clients</li>
              <li>✓ Showcases your PM philosophy and methodology</li>
              <li>✓ Highlights measurable results and impact</li>
              <li>✓ Differentiates you from other freelancers</li>
              <li>✓ Enables charging premium rates</li>
            </ul>
          </div>

          <div className="space-y-12">
            {sections.map((section) => (
              <div key={section.number} className="border-l-4 border-green-600 pl-6">
                <div className="flex items-center mb-3">
                  <div className="text-3xl font-bold text-green-600 mr-4 bg-green-100 rounded-full w-12 h-12 flex items-center justify-center">
                    {section.number}
                  </div>
                  <h3 className="text-2xl font-bold">{section.title}</h3>
                </div>
                <p className="text-gray-700 mb-4 text-lg">{section.description}</p>
                <ul className="space-y-2 text-gray-700">
                  {section.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-600 mr-3 font-bold">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-green-50 py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Portfolio Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-xl font-bold mb-3">Case Study Template</h3>
              <p className="text-gray-700 mb-4">Ready-made template to structure your case studies consistently.</p>
              <button className="text-green-600 font-semibold hover:underline">Download →</button>
            </div>
            <div className="card">
              <h3 className="text-xl font-bold mb-3">Portfolio Site Examples</h3>
              <p className="text-gray-700 mb-4">Curated collection of PM portfolio sites for inspiration.</p>
              <button className="text-green-600 font-semibold hover:underline">View Examples →</button>
            </div>
            <div className="card">
              <h3 className="text-xl font-bold mb-3">Messaging Guide</h3>
              <p className="text-gray-700 mb-4">How to articulate your PM value and unique positioning.</p>
              <button className="text-green-600 font-semibold hover:underline">Read Guide →</button>
            </div>
            <div className="card">
              <h3 className="text-xl font-bold mb-3">Portfolio Checklist</h3>
              <p className="text-gray-700 mb-4">Complete checklist to ensure your portfolio covers all bases.</p>
              <button className="text-green-600 font-semibold hover:underline">Get Checklist →</button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to build your portfolio?</h2>
          <p className="text-lg text-gray-700 mb-8">Start with our case study template and portfolio checklist.</p>
          <Link href="/resources" className="btn-primary inline-block">
            View Templates
          </Link>
        </div>
      </section>
    </>
  );
}
