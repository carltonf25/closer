import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ChevronRight } from 'lucide-react';
import { GEORGIA_CITIES } from '@/config/services';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Service Areas - HVAC & Plumbing Professionals Across Georgia',
  description:
    'Find licensed HVAC and plumbing contractors in cities across Georgia. We connect homeowners with trusted local professionals for heating, cooling, and plumbing services.',
  openGraph: {
    title: 'Service Areas - Georgia HVAC & Plumbing Pros',
    description:
      'Licensed contractors available in cities across Georgia for all your home service needs.',
    type: 'website',
  },
  alternates: {
    canonical: '/locations',
  },
};

export default function LocationsPage() {
  // Group cities by metro area
  const metroAreas = GEORGIA_CITIES.reduce(
    (acc, city) => {
      const metro = city.metro || 'Other';
      if (!acc[metro]) {
        acc[metro] = [];
      }
      acc[metro].push(city);
      return acc;
    },
    {} as Record<string, typeof GEORGIA_CITIES>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 text-white py-16">
        <div className="container-marketing">
          <Breadcrumbs items={[{ label: 'Locations' }]} />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Service Areas Across Georgia
          </h1>
          <p className="text-xl text-brand-100 max-w-3xl">
            Find licensed HVAC and plumbing professionals in your city. We
            connect homeowners across Georgia with trusted local contractors.
          </p>
        </div>
      </section>

      {/* Cities by Metro */}
      <section className="py-16">
        <div className="container-marketing">
          {Object.entries(metroAreas).map(([metro, cities]) => (
            <div key={metro} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-brand-600" />
                {metro} Metro Area
              </h2>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cities
                  .sort((a, b) => a.city.localeCompare(b.city))
                  .map(city => (
                    <Link
                      key={city.slug}
                      href={`/${city.slug}/hvac-repair`}
                      id={city.slug}
                      className="group bg-white rounded-lg border border-gray-200 p-4 hover:border-brand-500 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                            {city.city}
                          </h3>
                          <p className="text-sm text-gray-500">{city.state}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16 bg-white">
        <div className="container-marketing">
          <h2 className="text-3xl font-bold text-center mb-12">
            Services We Connect You With
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link
              href="/services/hvac"
              className="card p-8 hover:shadow-xl transition-shadow group"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors">
                HVAC Services
              </h3>
              <p className="text-gray-600 mb-4">
                Air conditioning repair, heating system installation, HVAC
                maintenance, and more.
              </p>
              <span className="inline-flex items-center text-brand-600 font-medium">
                View all HVAC services <ChevronRight className="h-5 w-5 ml-1" />
              </span>
            </Link>

            <Link
              href="/services/plumbing"
              className="card p-8 hover:shadow-xl transition-shadow group"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors">
                Plumbing Services
              </h3>
              <p className="text-gray-600 mb-4">
                Emergency plumbing, pipe repair, water heater installation,
                drain cleaning, and more.
              </p>
              <span className="inline-flex items-center text-brand-600 font-medium">
                View all plumbing services{' '}
                <ChevronRight className="h-5 w-5 ml-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
