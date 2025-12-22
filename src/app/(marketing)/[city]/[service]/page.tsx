import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Phone, Shield, Clock, Star, MapPin, CheckCircle } from 'lucide-react';
import { LeadForm } from '@/components/forms/LeadForm';
import {
  SERVICES,
  SERVICE_SLUGS,
  GEORGIA_CITIES,
  SERVICE_TO_SLUG,
} from '@/config/services';
import { ServiceType } from '@/lib/database.types';

interface PageProps {
  params: { city: string; service: string };
}

// Generate static params for all city/service combinations
export async function generateStaticParams() {
  const params: { city: string; service: string }[] = [];

  for (const city of GEORGIA_CITIES) {
    for (const serviceSlug of Object.keys(SERVICE_SLUGS)) {
      params.push({
        city: city.slug,
        service: serviceSlug,
      });
    }
  }

  return params;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const city = GEORGIA_CITIES.find(c => c.slug === params.city);
  const serviceType = SERVICE_SLUGS[params.service];
  const service = serviceType ? SERVICES[serviceType] : null;

  if (!city || !service) {
    return { title: 'Page Not Found' };
  }

  const title = `${service.seoTitle} in ${city.city}, ${city.state} | Free Quotes`;
  const description = `Find trusted ${service.label.toLowerCase()} professionals in ${city.city}, Georgia. Licensed, insured contractors ready to help. Get free quotes today!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    alternates: {
      canonical: `/${params.city}/${params.service}`,
    },
  };
}

export default function CityServicePage({ params }: PageProps) {
  const city = GEORGIA_CITIES.find(c => c.slug === params.city);
  const serviceType = SERVICE_SLUGS[params.service] as ServiceType;
  const service = serviceType ? SERVICES[serviceType] : null;

  if (!city || !service) {
    notFound();
  }

  // Related services in same category
  const relatedServices = Object.entries(SERVICES)
    .filter(
      ([key, s]) => s.category === service.category && key !== serviceType
    )
    .slice(0, 3);

  // Nearby cities
  const nearbyCities = GEORGIA_CITIES.filter(
    c => c.metro === city.metro && c.slug !== city.slug
  ).slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${service.label} in ${city.city}`,
    description: service.description,
    areaServed: {
      '@type': 'City',
      name: city.city,
      addressRegion: city.state,
    },
    provider: {
      '@type': 'LocalBusiness',
      name: 'Georgia Home Services',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 text-white">
          <div className="container-marketing py-12 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Content */}
              <div>
                <div className="flex items-center gap-2 text-brand-200 mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {city.city}, {city.state}
                  </span>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                  {service.seoTitle} in{' '}
                  <span className="text-accent-400">{city.city}</span>
                </h1>

                <p className="text-xl text-brand-100 mb-8">
                  Connect with licensed {service.label.toLowerCase()}{' '}
                  professionals in {city.city}. Get free quotes from vetted
                  contractors ready to help today.
                </p>

                {/* Trust signals */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/20 p-2 rounded-lg">
                      <Shield className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold">Licensed & Insured</div>
                      <div className="text-sm text-brand-200">
                        All contractors verified
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/20 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold">Fast Response</div>
                      <div className="text-sm text-brand-200">
                        Same-day available
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-500/20 p-2 rounded-lg">
                      <Star className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <div className="font-semibold">Top Rated</div>
                      <div className="text-sm text-brand-200">
                        4.8+ star average
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold">Free Quotes</div>
                      <div className="text-sm text-brand-200">
                        No obligation
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone CTA */}
                <a
                  href="tel:+14045551234"
                  className="inline-flex items-center gap-2 text-lg font-semibold text-accent-400 hover:text-accent-300"
                >
                  <Phone className="h-5 w-5" />
                  Need help now? Call (404) 555-1234
                </a>
              </div>

              {/* Lead Form */}
              <div>
                <div className="card p-6 lg:p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Get Free {service.shortLabel} Quotes
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Compare prices from {city.city} pros
                    </p>
                  </div>

                  <LeadForm
                    defaultService={serviceType}
                    defaultCity={city.city}
                    defaultState={city.state}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Info Content */}
        <section className="py-16">
          <div className="container-marketing">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold mb-6">
                {service.label} Services in {city.city}, Georgia
              </h2>

              <div className="prose prose-lg text-gray-600">
                <p>
                  Looking for reliable {service.label.toLowerCase()} services in{' '}
                  {city.city}? You've come to the right place. We connect
                  homeowners across {city.metro || city.city} with trusted,
                  licensed professionals who are ready to help with all your{' '}
                  {service.category === 'hvac'
                    ? 'heating and cooling'
                    : 'plumbing'}{' '}
                  needs.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                  Why Choose Our {city.city} {service.shortLabel} Pros?
                </h3>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>
                      <strong>Licensed & Insured:</strong> Every contractor in
                      our network is fully licensed in Georgia and carries
                      proper insurance.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>
                      <strong>Background Checked:</strong> We verify credentials
                      and check backgrounds so you can hire with confidence.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>
                      <strong>Local Expertise:</strong> Our pros know{' '}
                      {city.city} and understand the specific needs of homes in
                      this area.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>
                      <strong>Upfront Pricing:</strong> Get clear quotes before
                      work begins. No surprise charges.
                    </span>
                  </li>
                </ul>

                {service.category === 'hvac' && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                      Common {service.shortLabel} Services We Cover
                    </h3>
                    <ul className="grid grid-cols-2 gap-2">
                      <li>AC repair & diagnostics</li>
                      <li>Furnace repair</li>
                      <li>Heat pump service</li>
                      <li>Ductwork repair</li>
                      <li>Thermostat installation</li>
                      <li>Refrigerant recharge</li>
                      <li>Air quality solutions</li>
                      <li>Emergency 24/7 service</li>
                    </ul>
                  </>
                )}

                {service.category === 'plumbing' && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                      Common {service.shortLabel} Services We Cover
                    </h3>
                    <ul className="grid grid-cols-2 gap-2">
                      <li>Leak detection & repair</li>
                      <li>Drain cleaning</li>
                      <li>Pipe repair & replacement</li>
                      <li>Fixture installation</li>
                      <li>Water heater service</li>
                      <li>Sewer line repair</li>
                      <li>Toilet repair</li>
                      <li>Emergency 24/7 service</li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container-marketing">
              <h2 className="text-2xl font-bold mb-8">
                Other {service.category === 'hvac' ? 'HVAC' : 'Plumbing'}{' '}
                Services in {city.city}
              </h2>

              <div className="grid sm:grid-cols-3 gap-6">
                {relatedServices.map(([key, s]) => (
                  <Link
                    key={key}
                    href={`/${city.slug}/${SERVICE_TO_SLUG[key as ServiceType]}`}
                    className="card p-6 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {s.label}
                    </h3>
                    <p className="text-gray-600 text-sm">{s.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Nearby Cities */}
        {nearbyCities.length > 0 && (
          <section className="py-16">
            <div className="container-marketing">
              <h2 className="text-2xl font-bold mb-8">
                {service.shortLabel} in Nearby Cities
              </h2>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {nearbyCities.map(nearbyCity => (
                  <Link
                    key={nearbyCity.slug}
                    href={`/${nearbyCity.slug}/${params.service}`}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:border-brand-500 hover:shadow-md transition-all"
                  >
                    <div className="font-medium text-gray-900">
                      {nearbyCity.city}
                    </div>
                    <div className="text-sm text-gray-500">
                      {service.shortLabel}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="py-16 bg-brand-900 text-white">
          <div className="container-marketing text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-brand-100 mb-8 max-w-2xl mx-auto">
              Get free quotes from licensed {service.label.toLowerCase()}{' '}
              professionals in {city.city} today.
            </p>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-primary btn-lg"
            >
              Get Free Quotes Now
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
