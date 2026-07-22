import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">Make Your Transition to Fractional Work</h1>
          <p className="text-xl mb-8 max-w-2xl">Everything project managers need to succeed in freelancing and fractional roles. Templates, calculators, guides, and best practices.</p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/tools" className="btn-primary">
              Explore Tools
            </Link>
            <Link href="/resources" className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              View Resources
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Everything You Need to Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-2xl font-bold mb-3">Resource Library</h3>
              <p className="text-gray-700 mb-4">Access templates, guides, contracts, and checklists built specifically for PMs transitioning to fractional work.</p>
              <Link href="/resources" className="text-blue-600 font-semibold hover:underline">
                Browse Library →
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="card">
              <div className="text-4xl mb-4">🧮</div>
              <h3 className="text-2xl font-bold mb-3">Productivity Tools</h3>
              <p className="text-gray-700 mb-4">Calculate project pricing, estimate rates, track time, and manage capacity with built-in tools.</p>
              <Link href="/tools" className="text-blue-600 font-semibold hover:underline">
                Start Calculating →
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="card">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3">Portfolio Guide</h3>
              <p className="text-gray-700 mb-4">Step-by-step guide to building a compelling portfolio that showcases your PM expertise to clients.</p>
              <Link href="/portfolio-guide" className="text-blue-600 font-semibold hover:underline">
                Start Building →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-16">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transition to fractional work?</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">Use our tools and resources to confidently move into freelancing and fractional PM roles.</p>
          <Link href="/tools" className="btn-primary inline-block">
            Explore All Tools
          </Link>
        </div>
      </section>
    </>
  );
}
