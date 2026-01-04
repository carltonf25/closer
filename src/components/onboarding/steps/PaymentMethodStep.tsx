'use client';

import { CreditCard, AlertCircle, Shield } from 'lucide-react';

type Props = {
  tier: 'pro' | 'elite';
  onPaymentMethodAdded: (paymentMethodId: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export const PaymentMethodStep = ({
  tier,
  onPaymentMethodAdded: _onPaymentMethodAdded,
  onNext,
  onBack,
}: Props) => {
  const monthlyPrice = tier === 'pro' ? 149 : 399;
  const discount = tier === 'pro' ? 20 : 30;

  const handleSkip = () => {
    // Skip payment setup for now (Phase 4 will implement Stripe)
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Information
        </h2>
        <p className="text-gray-600">
          Set up your payment method for the {tier === 'pro' ? 'Pro' : 'Elite'}{' '}
          tier subscription.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              Your {tier === 'pro' ? 'Pro' : 'Elite'} Tier Benefits
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• ${monthlyPrice}/month subscription fee</li>
              <li>• {discount}% discount on all leads</li>
              <li>
                •{' '}
                {tier === 'elite' ? 'Exclusive leads only' : 'Priority routing'}
              </li>
              <li>• Email + SMS notifications</li>
              {tier === 'elite' && (
                <>
                  <li>• Dedicated account manager</li>
                  <li>• Advanced analytics</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Placeholder for Stripe integration (Phase 4) */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
        <div className="text-center">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Payment Setup Coming Soon
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Secure payment processing with Stripe will be available soon. For
            now, you can complete your profile and we&apos;ll contact you to set
            up billing.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 inline-block">
            <div className="flex items-start text-left">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Note for Beta Users</p>
                <p>
                  You&apos;ll be able to receive leads while we finalize payment
                  integration. We&apos;ll reach out before charging begins.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Billing Details</h4>
        <div className="text-sm text-gray-700 space-y-2">
          <div className="flex justify-between">
            <span>Monthly subscription:</span>
            <span className="font-semibold">${monthlyPrice}/month</span>
          </div>
          <div className="flex justify-between">
            <span>Lead discount:</span>
            <span className="font-semibold text-green-600">
              {discount}% off
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="font-semibold">Billing cycle:</span>
            <span>Monthly (cancel anytime)</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition"
        >
          Back
        </button>
        <button
          onClick={handleSkip}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
