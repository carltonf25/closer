import { Star, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  location: string;
  service: string;
  rating: number;
  text: string;
  date?: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    location: 'Atlanta, GA',
    service: 'AC Repair',
    rating: 5,
    text: "My AC went out in the middle of July and I was desperate. Within 30 minutes of submitting my request, I had three contractors reach out. The pro I chose came the same day and had my system running in no time. Highly recommend!",
    date: '2 weeks ago',
  },
  {
    name: 'Michael Chen',
    location: 'Marietta, GA',
    service: 'Emergency Plumbing',
    rating: 5,
    text: "Burst pipe at 2am - total nightmare! Used this service and had a plumber at my door within an hour. Professional, fair pricing, and fixed everything perfectly. Saved my hardwood floors from serious damage.",
    date: '1 month ago',
  },
  {
    name: 'Jennifer Williams',
    location: 'Savannah, GA',
    service: 'HVAC Installation',
    rating: 5,
    text: "Got quotes from 4 different HVAC companies for a new system. All were licensed and professional, which made me feel confident in my choice. The installation was flawless and I'm saving so much on energy bills now!",
    date: '3 weeks ago',
  },
  {
    name: 'David Rodriguez',
    location: 'Roswell, GA',
    service: 'Water Heater Replacement',
    rating: 5,
    text: "Super easy process. Filled out the form, got 3 quotes by the end of the day, and had my new water heater installed two days later. Much easier than calling around myself!",
    date: '2 months ago',
  },
];

export function Testimonials() {
  // Generate JSON-LD schema for reviews
  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Georgia Home Services - HVAC & Plumbing',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: testimonials.length.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    review: testimonials.map(t => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: t.name,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: t.rating.toString(),
        bestRating: '5',
      },
      reviewBody: t.text,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />

      <section className="py-16 bg-gray-50">
        <div className="container-marketing">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Homeowners Are Saying
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied Georgia homeowners who've found trusted
              professionals through our service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-brand-200 mb-4" />

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.location} • {testimonial.service}
                    </p>
                  </div>
                  {testimonial.date && (
                    <p className="text-xs text-gray-400">{testimonial.date}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Trust Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-600 mb-1">4.8★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-600 mb-1">5,000+</div>
              <div className="text-sm text-gray-600">Happy Homeowners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-600 mb-1">150+</div>
              <div className="text-sm text-gray-600">Verified Contractors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
