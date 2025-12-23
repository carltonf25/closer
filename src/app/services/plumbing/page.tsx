import { Metadata } from 'next';
import Link from 'next/link';
import {
  Droplet,
  Wrench,
  Flame,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { SERVICES, SERVICE_TO_SLUG, GEORGIA_CITIES } from '@/config/services';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title:
    'Plumbing Services in Georgia - Emergency Plumber, Repair & Installation',
  description:
    'Find trusted plumbing professionals across Georgia for emergency service, pipe repair, water heater installation, drain cleaning, and more. Licensed and insured plumbers.',
  openGraph: {
    title: 'Plumbing Services in Georgia',
    description:
      'Connect with licensed plumbers for all your residential and commercial plumbing needs.',
    type: 'website',
  },
  alternates: {
    canonical: '/services/plumbing',
  },
};

export default function PlumbingServicesPage() {
  const plumbingServices = Object.entries(SERVICES)
    .filter(([, service]) => service.category === 'plumbing')
    .map(([key, service]) => ({
      key,
      ...service,
      slug: SERVICE_TO_SLUG[key as keyof typeof SERVICE_TO_SLUG],
    }));

  const popularCities = GEORGIA_CITIES.slice(0, 12);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 text-white py-16">
        <div className="container-marketing">
          <Breadcrumbs items={[{ label: 'Services' }, { label: 'Plumbing' }]} />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Plumbing Services Across Georgia
          </h1>
          <p className="text-xl text-brand-100 max-w-3xl">
            Connect with licensed plumbing professionals for emergency repairs,
            installations, drain cleaning, water heater service, and more.
          </p>
        </div>
      </section>

      {/* Service Types */}
      <section className="py-16">
        <div className="container-marketing">
          <h2 className="text-3xl font-bold text-center mb-12">
            Plumbing Services We Offer
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {plumbingServices.map(service => (
              <div
                key={service.key}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div
                  className={`${
                    service.key.includes('emergency')
                      ? 'bg-red-100'
                      : 'bg-brand-100'
                  } w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                >
                  {service.key.includes('emergency') && (
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  )}
                  {service.key.includes('water_heater') && (
                    <Flame className="h-6 w-6 text-brand-600" />
                  )}
                  {service.key.includes('repair') && (
                    <Wrench className="h-6 w-6 text-brand-600" />
                  )}
                  {service.key.includes('install') && (
                    <Droplet className="h-6 w-6 text-brand-600" />
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.label}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {service.description}
                </p>

                <Link
                  href={`/atlanta/${service.slug}`}
                  className="inline-flex items-center text-brand-600 font-medium hover:underline text-sm"
                >
                  Get quotes in Atlanta{' '}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>

          {/* What We Cover */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Common Plumbing Services
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                'Leak Detection & Repair',
                'Drain Cleaning & Unclogging',
                'Pipe Repair & Replacement',
                'Fixture Installation',
                'Water Heater Service',
                'Sewer Line Repair',
                'Toilet Repair & Installation',
                'Emergency 24/7 Service',
                'Garbage Disposal Repair',
                'Sump Pump Service',
                'Gas Line Work',
                'Commercial Plumbing',
              ].map(item => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <Droplet className="h-5 w-5 text-brand-600 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cities We Serve */}
      <section className="py-16 bg-white">
        <div className="container-marketing">
          <h2 className="text-3xl font-bold text-center mb-12">
            Plumbing Services in Georgia Cities
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularCities.map(city => (
              <Link
                key={city.slug}
                href={`/${city.slug}/emergency-plumber`}
                className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:border-brand-500 hover:shadow-md transition-all"
              >
                <div className="font-semibold text-gray-900 hover:text-brand-600 transition-colors">
                  {city.city} Plumbing
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/locations"
              className="text-brand-600 font-medium hover:underline"
            >
              View all service areas →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
