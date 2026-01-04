'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { PricingTierStep } from './steps/PricingTierStep';
import { NotificationPreferencesStep } from './steps/NotificationPreferencesStep';
import { PaymentMethodStep } from './steps/PaymentMethodStep';
import { ReviewStep } from './steps/ReviewStep';
import { completeOnboarding } from '@/actions/onboarding';

type PricingTier = 'starter' | 'pro' | 'elite';

export type OnboardingData = {
  pricing_tier: PricingTier;
  billing_type: 'per_lead' | 'monthly' | 'hybrid';
  notification_email: string;
  notification_phone: string;
  payment_method_id?: string;
};

type Contractor = {
  id: string;
  email: string;
  phone: string;
  company_name: string;
  [key: string]: unknown;
};

type Props = {
  contractor: Contractor;
};

export const OnboardingFlow = ({ contractor }: Props) => {
  const router = useRouter();
  const { refreshContractor } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    pricing_tier: 'starter',
    billing_type: 'per_lead',
    notification_email: contractor.email,
    notification_phone: contractor.phone,
  });

  const totalSteps = onboardingData.pricing_tier === 'starter' ? 3 : 4;

  const updateData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    setError(null);
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const result = await completeOnboarding(onboardingData);

      if (!result.success) {
        setError(result.message || 'Failed to complete onboarding');
        setSubmitting(false);
        return;
      }

      // Success - refresh contractor data and redirect to dashboard
      await refreshContractor();
      router.push('/contractor/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Onboarding error:', err);
      setError('An unexpected error occurred');
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Progress bar */}
      <div className="bg-gray-100 px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="p-6">
        {currentStep === 1 && (
          <PricingTierStep
            selectedTier={onboardingData.pricing_tier}
            onSelect={tier => updateData({ pricing_tier: tier })}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <NotificationPreferencesStep
            email={onboardingData.notification_email}
            phone={onboardingData.notification_phone}
            onUpdate={updateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && onboardingData.pricing_tier !== 'starter' && (
          <PaymentMethodStep
            tier={onboardingData.pricing_tier}
            billingType={onboardingData.billing_type}
            onPaymentMethodAdded={paymentMethodId =>
              updateData({ payment_method_id: paymentMethodId })
            }
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {((currentStep === 3 && onboardingData.pricing_tier === 'starter') ||
          (currentStep === 4 && onboardingData.pricing_tier !== 'starter')) && (
          <ReviewStep
            data={onboardingData}
            companyName={contractor.company_name}
            onBack={handleBack}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};
