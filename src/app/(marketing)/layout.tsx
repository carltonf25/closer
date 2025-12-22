import Link from 'next/link';
import { Phone } from 'lucide-react';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container-marketing">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GH</span>
              </div>
              <span className="font-semibold text-gray-900 hidden sm:block">
                Georgia Home Services
              </span>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/atlanta/hvac-repair"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                HVAC Services
              </Link>
              <Link
                href="/atlanta/emergency-plumber"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Plumbing Services
              </Link>
              <Link
                href="/locations"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Service Areas
              </Link>
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <a
                href="tel:+14045551234"
                className="hidden sm:flex items-center gap-2 text-brand-600 font-semibold"
              >
                <Phone className="h-4 w-4" />
                (404) 555-1234
              </a>
              <Link href="/contractor/login" className="btn-outline btn-sm">
                For Contractors
              </Link>
            </div>
          </div>
        </div>
      </header>

      {children}
    </>
  );
}
