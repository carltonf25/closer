'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How does your service work?',
    answer:
      "Simply fill out our quick form with details about your HVAC or plumbing need. We'll instantly connect you with licensed, background-checked contractors in your area who will reach out with free quotes. You compare the options and choose the best fit for your needs.",
  },
  {
    question: 'Is there a cost to use this service?',
    answer:
      "No! Our service is completely free for homeowners. We're paid by the contractors in our network, so you get free quotes and connections to trusted professionals at no cost to you.",
  },
  {
    question: 'How quickly will I hear from a contractor?',
    answer:
      "Most homeowners receive their first contact within 30 minutes of submitting a request. For emergency services, you can often get same-day or next-day appointments. Response times may vary based on time of day and contractor availability.",
  },
  {
    question: 'Are the contractors licensed and insured?',
    answer:
      "Yes! All contractors in our network are required to be licensed in Georgia and carry proper insurance. We verify credentials before allowing contractors to join our platform, so you can hire with confidence.",
  },
  {
    question: 'What areas of Georgia do you serve?',
    answer:
      "We serve all major metro areas across Georgia, including Atlanta, Marietta, Savannah, Augusta, Columbus, and many more. Check our locations page to see if we serve your city.",
  },
  {
    question: 'Can I get multiple quotes?',
    answer:
      "Absolutely! In fact, we recommend it. When you submit a request, we typically connect you with 2-4 qualified contractors so you can compare quotes, read reviews, and choose the best option for your project and budget.",
  },
  {
    question: 'What if I need emergency service?',
    answer:
      'We have contractors available for emergency HVAC and plumbing services 24/7. When filling out the form, select "Emergency" or "Today" for urgency, and we\'ll prioritize connecting you with contractors who offer immediate service.',
  },
  {
    question: 'What types of services are available?',
    answer:
      'We connect homeowners with contractors for all HVAC services (AC repair, heating installation, maintenance) and plumbing services (emergency repairs, pipe work, water heater installation, drain cleaning, and more).',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Generate FAQ schema markup for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="py-16 bg-white">
        <div className="container-marketing max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Everything you need to know about finding trusted HVAC and plumbing
              professionals
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  aria-expanded={openIndex === index}
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 text-gray-500 flex-shrink-0 transition-transform',
                      openIndex === index && 'transform rotate-180'
                    )}
                  />
                </button>

                <div
                  className={cn(
                    'overflow-hidden transition-all duration-200',
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  )}
                >
                  <div className="px-6 py-4 bg-gray-50 text-gray-700 leading-relaxed border-t border-gray-200">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions CTA */}
          <div className="mt-12 text-center p-8 bg-brand-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-4">
              Our team is here to help you find the right professional for your
              needs.
            </p>
            <a
              href="tel:+14045551234"
              className="inline-flex items-center gap-2 btn-primary"
            >
              Call Us: (404) 555-1234
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
