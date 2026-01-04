'use client';

import { Check } from 'lucide-react';

type PricingTier = 'starter' | 'pro' | 'elite';

type Props = {
  selectedTier: PricingTier;
  onSelect: (tier: PricingTier) => void;
  onNext: () => void;
};

const TIERS = [
  {
    id: 'starter' as PricingTier,
    name: 'Starter',
    price: 0,
    description: 'Perfect for getting started',
    features: [
      'Pay per lead only',
      'Shared leads (up to 3 contractors)',
      'Email notifications',
      'Basic support',
      'Full lead price',
    ],
    limitations: [
      'No exclusive leads',
      'Standard pricing',
      'Limited to shared leads',
    ],
  },
  {
    id: 'pro' as PricingTier,
    name: 'Pro',
    price: 149,
    description: 'Best value for growing businesses',
    features: [
      '$149/month subscription',
      '20% discount on all leads',
      'Priority lead routing',
      'Email + SMS notifications',
      'Access to exclusive leads',
      'Priority support',
      'Lead analytics dashboard',
    ],
    popular: true,
  },
  {
    id: 'elite' as PricingTier,
    name: 'Elite',
    price: 399,
    description: 'Maximum leads, maximum value',
    features: [
      '$399/month subscription',
      '30% discount on all leads',
      'Exclusive leads only (no sharing)',
      'Highest priority routing',
      'Email + SMS + Phone notifications',
      'Dedicated account manager',
      'Advanced analytics & insights',
      'Custom service areas',
    ],
  },
];

export const PricingTierStep = ({ selectedTier, onSelect, onNext }: Props) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Choose Your Plan
      </h2>
      <p className="text-gray-600">
        Select the pricing tier that best fits your business needs. You can
        upgrade or downgrade at any time.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      {TIERS.map(tier => (
        <div
          key={tier.id}
          className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
            selectedTier === tier.id
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          } ${tier.popular ? 'ring-2 ring-blue-400' : ''}`}
          onClick={() => onSelect(tier.id)}
        >
          {tier.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Most Popular
            </div>
          )}

          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold text-gray-900">
                ${tier.price}
              </span>
              <span className="text-gray-600">/month</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{tier.description}</p>
          </div>

          <ul className="space-y-3 mb-6">
            {tier.features.map((feature, index) => (
              <li key={index} className="flex items-start text-sm">
                <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          {selectedTier === tier.id && (
            <div className="absolute top-4 right-4">
              <div className="bg-blue-600 text-white rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-semibold text-blue-900 mb-2">
        Our Satisfaction Guarantee
      </h4>
      <p className="text-sm text-blue-800">
        All leads come with our quality guarantee. If you receive a lead with
        invalid contact info, wrong service area, or incorrect service type,
        we&apos;ll automatically refund or credit your account. We&apos;re
        committed to your success.
      </p>
    </div>

    <div className="flex justify-end">
      <button
        onClick={onNext}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Continue
      </button>
    </div>
  </div>
);
