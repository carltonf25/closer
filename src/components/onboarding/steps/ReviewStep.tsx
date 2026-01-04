'use client';

import { Loader2, CheckCircle, Mail, Phone, CreditCard } from 'lucide-react';

type OnboardingData = {
  pricing_tier: 'starter' | 'pro' | 'elite';
  notification_email: string;
  notification_phone: string;
  payment_method_id?: string;
};

type Props = {
  data: OnboardingData;
  companyName: string;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
};

export const ReviewStep = ({
  data,
  companyName,
  onBack,
  onSubmit,
  submitting,
}: Props) => {
  const tierNames = {
    starter: 'Starter',
    pro: 'Pro',
    elite: 'Elite',
  };

  const tierPrices = {
    starter: 0,
    pro: 149,
    elite: 399,
  };

  const tierDiscounts = {
    starter: 0,
    pro: 20,
    elite: 30,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review & Confirm
        </h2>
        <p className="text-gray-600">
          Please review your selections before completing your profile.
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <CheckCircle className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-900">{companyName}</h3>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-start">
              <CreditCard className="h-5 w-5 text-gray-600 mr-3 mt-0.5" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">Pricing Tier</p>
                    <p className="text-lg font-bold text-gray-900">
                      {tierNames[data.pricing_tier]}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ${tierPrices[data.pricing_tier]}
                      <span className="text-sm font-normal text-gray-600">
                        /month
                      </span>
                    </p>
                    {data.pricing_tier !== 'starter' && (
                      <p className="text-sm text-green-600 font-semibold">
                        {tierDiscounts[data.pricing_tier]}% off leads
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-gray-600 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Notification Email</p>
                <p className="text-base font-semibold text-gray-900">
                  {data.notification_email}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-gray-600 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Notification Phone</p>
                <p className="text-base font-semibold text-gray-900">
                  {data.notification_phone.replace(
                    /(\d{3})(\d{3})(\d{4})/,
                    '($1) $2-$3'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Next Steps</h4>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">1.</span>
            <span>Your profile will be activated immediately</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">2.</span>
            <span>
              You&apos;ll start receiving leads matching your service area
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">3.</span>
            <span>Respond quickly to leads for the best conversion rate</span>
          </li>
          {data.pricing_tier !== 'starter' && (
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">4.</span>
              <span>
                We&apos;ll contact you to finalize payment setup for your{' '}
                {tierNames[data.pricing_tier]} subscription
              </span>
            </li>
          )}
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          By completing onboarding, you agree to our Terms of Service and
          confirm that your business is properly licensed to provide the
          selected services. You can update your preferences anytime from your
          dashboard.
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          disabled={submitting}
          className="px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Completing Setup...
            </>
          ) : (
            'Complete Setup'
          )}
        </button>
      </div>
    </div>
  );
};
