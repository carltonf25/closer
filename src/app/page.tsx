'use client';

import Link from 'next/link';
import { Phone, Shield, Clock, Star, ChevronRight } from 'lucide-react';
import { QuickLeadForm } from '@/components/forms/QuickLeadForm';
import { GEORGIA_CITIES } from '@/config/services';

export default function HomePage() {
  const popularServices = [
    { slug: 'hvac-repair', label: 'AC Repair', icon: '❄️' },
    { slug: 'emergency-plumber', label: 'Emergency Plumber', icon: '🚿' },
    { slug: 'hvac-installation', label: 'HVAC Installation', icon: '🌡️' },
    { slug: 'water-heater', label: 'Water Heater', icon: '🔥' },
  ];

  const popularCities = GEORGIA_CITIES.slice(0, 8);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container-marketing relative">
          <div className="grid lg:grid-cols-2 gap-12 py-16 lg:py-24">
            {/* Left: Headlines */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium">
                  Pros available now in Georgia
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Georgia's Most Trusted
                <span className="text-accent-400 block">HVAC & Plumbing</span>
                Professionals
              </h1>

              <p className="text-xl text-brand-100 mb-8 max-w-lg">
                Connect with licensed, background-checked contractors in
                minutes. Free quotes, no obligation.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2 text-brand-100">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span>Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2 text-brand-100">
                  <Clock className="h-5 w-5 text-green-400" />
                  <span>Same-Day Service</span>
                </div>
                <div className="flex items-center gap-2 text-brand-100">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span>4.8★ Average Rating</span>
                </div>
              </div>

              {/* Phone CTA for mobile */}
              <a
                href="tel:+14045551234"
                className="lg:hidden btn-primary btn-lg w-full mb-6"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Now: (404) 555-1234
              </a>
            </div>

            {/* Right: Lead Form */}
            <div className="lg:pl-8">
              <div className="card p-6 sm:p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Get Free Quotes
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Tell us what you need. It takes 30 seconds.
                  </p>
                </div>

                <QuickLeadForm />

                <p className="text-xs text-gray-500 text-center mt-4">
                  By submitting, you agree to receive calls/texts. Message &
                  data rates may apply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16 bg-gray-50">
        <div className="container-marketing">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Do You Need Help With?
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularServices.map(service => (
              <Link
                key={service.slug}
                href={`/atlanta/${service.slug}`}
                className="card p-6 hover:shadow-xl transition-shadow group"
              >
                <span className="text-4xl mb-4 block">{service.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                  {service.label}
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Find trusted pros in your area
                </p>
                <span className="inline-flex items-center text-brand-600 font-medium text-sm mt-4 group-hover:translate-x-1 transition-transform">
                  Get quotes <ChevronRight className="h-4 w-4 ml-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container-marketing">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Getting help for your home has never been easier
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Tell Us What You Need',
                description:
                  'Fill out our quick form with details about your project or repair.',
              },
              {
                step: '2',
                title: 'Get Matched Instantly',
                description:
                  'We connect you with licensed, vetted pros in your area.',
              },
              {
                step: '3',
                title: 'Compare & Choose',
                description:
                  'Review quotes, read reviews, and pick the best fit for you.',
              },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities We Serve */}
      <section className="py-16 bg-gray-50">
        <div className="container-marketing">
          <h2 className="text-3xl font-bold text-center mb-4">
            Serving All of Georgia
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Find HVAC and plumbing pros in your city
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {popularCities.map(city => (
              <Link
                key={city.slug}
                href={`/${city.slug}/hvac-repair`}
                className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100"
              >
                <span className="font-medium text-gray-900">{city.city}</span>
                <span className="text-gray-500 text-sm ml-1">
                  , {city.state}
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/locations"
              className="text-brand-600 font-medium hover:underline"
            >
              View all Georgia locations →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-brand-900 text-white">
        <div className="container-marketing text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-brand-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Georgia homeowners who've found trusted
            professionals through our service.
          </p>
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="btn-primary btn-lg"
          >
            Get Free Quotes Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container-marketing">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">
                Georgia Home Services
              </h3>
              <p className="text-sm">
                Connecting Georgia homeowners with trusted HVAC and plumbing
                professionals.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/atlanta/hvac-repair"
                    className="hover:text-white"
                  >
                    HVAC Repair
                  </Link>
                </li>
                <li>
                  <Link
                    href="/atlanta/emergency-plumber"
                    className="hover:text-white"
                  >
                    Emergency Plumber
                  </Link>
                </li>
                <li>
                  <Link
                    href="/atlanta/hvac-installation"
                    className="hover:text-white"
                  >
                    AC Installation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/atlanta/water-heater"
                    className="hover:text-white"
                  >
                    Water Heater
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Top Cities</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/atlanta/hvac-repair"
                    className="hover:text-white"
                  >
                    Atlanta
                  </Link>
                </li>
                <li>
                  <Link
                    href="/marietta/hvac-repair"
                    className="hover:text-white"
                  >
                    Marietta
                  </Link>
                </li>
                <li>
                  <Link
                    href="/savannah/hvac-repair"
                    className="hover:text-white"
                  >
                    Savannah
                  </Link>
                </li>
                <li>
                  <Link
                    href="/alpharetta/hvac-repair"
                    className="hover:text-white"
                  >
                    Alpharetta
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Contractors</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/contractor/signup" className="hover:text-white">
                    Join Our Network
                  </Link>
                </li>
                <li>
                  <Link href="/contractor/login" className="hover:text-white">
                    Contractor Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            © {new Date().getFullYear()} Georgia Home Services. All rights
            reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
