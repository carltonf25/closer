import { Metadata } from 'next';
import Link from 'next/link';
import {
  Thermometer,
  Wind,
  Wrench,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { SERVICES, SERVICE_TO_SLUG, GEORGIA_CITIES } from '@/config/services';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'HVAC Services in Georgia - AC Repair, Installation & Maintenance',
  description:
    'Find trusted HVAC professionals across Georgia for air conditioning repair, heating installation, system maintenance, and emergency service. Licensed and insured contractors.',
  openGraph: {
    title: 'HVAC Services in Georgia',
    description:
      'Connect with licensed HVAC contractors for all your heating and cooling needs.',
    type: 'website',
  },
  alternates: {
    canonical: '/services/hvac',
  },
};

export default function HVACServicesPage() {
  const hvacServices = Object.entries(SERVICES)
    .filter(([, service]) => service.category === 'hvac')
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
          <Breadcrumbs items={[{ label: 'Services' }, { label: 'HVAC' }]} />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            HVAC Services Across Georgia
          </h1>
          <p className="text-xl text-brand-100 max-w-3xl">
            Connect with licensed HVAC professionals for air conditioning
            repair, heating installation, system maintenance, and emergency
            services.
          </p>
        </div>
      </section>

      {/* Service Types */}
      <section className="py-16">
        <div className="container-marketing">
          <h2 className="text-3xl font-bold text-center mb-12">
            HVAC Services We Offer
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {hvacServices.map(service => (
              <div
                key={service.key}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="bg-brand-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  {service.key.includes('repair') && (
                    <Wrench className="h-6 w-6 text-brand-600" />
                  )}
                  {service.key.includes('install') && (
                    <Wind className="h-6 w-6 text-brand-600" />
                  )}
                  {service.key.includes('maintenance') && (
                    <Calendar className="h-6 w-6 text-brand-600" />
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.label}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>

                <Link
                  href={`/atlanta/${service.slug}`}
                  className="inline-flex items-center text-brand-600 font-medium hover:underline"
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
              Common HVAC Services
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                'AC Repair & Diagnostics',
                'Furnace Installation',
                'Heat Pump Service',
                'Ductwork Repair',
                'Thermostat Installation',
                'Air Quality Solutions',
                'System Replacement',
                'Emergency 24/7 Service',
                'Preventive Maintenance',
                'Energy Efficiency Upgrades',
                'Refrigerant Recharge',
                'Commercial HVAC',
              ].map(item => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <Thermometer className="h-5 w-5 text-brand-600 flex-shrink-0" />
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
            HVAC Services in Georgia Cities
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularCities.map(city => (
              <Link
                key={city.slug}
                href={`/${city.slug}/hvac-repair`}
                className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:border-brand-500 hover:shadow-md transition-all"
              >
                <div className="font-semibold text-gray-900 hover:text-brand-600 transition-colors">
                  {city.city} HVAC Repair
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
