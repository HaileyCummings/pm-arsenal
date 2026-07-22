import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">PM Arsenal</h3>
            <p>Resources and tools for project managers transitioning to fractional work.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/resources" className="hover:text-white transition">Resources</Link></li>
              <li><Link href="/tools" className="hover:text-white transition">Tools</Link></li>
              <li><Link href="/portfolio-guide" className="hover:text-white transition">Portfolio Guide</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">More</h4>
            <ul className="space-y-2">
              <li><a href="https://github.com/HaileyCummings/pm-arsenal" className="hover:text-white transition">GitHub</a></li>
              <li><a href="https://github.com/HaileyCummings" className="hover:text-white transition">About</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center">
          <p>&copy; 2026 PM Arsenal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
