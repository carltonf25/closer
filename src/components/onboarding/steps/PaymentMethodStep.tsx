'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Shield, CheckCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  setupPaymentMethod,
  confirmPaymentMethod,
} from '@/actions/stripe-actions';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type Props = {
  tier: 'pro' | 'elite';
  billingType: 'per_lead' | 'monthly' | 'hybrid';
  onNext: () => void;
  onBack: () => void;
};

function PaymentForm({
  tier,
  billingType,
  onSuccess,
  onBack,
}: {
  tier: 'pro' | 'elite';
  billingType: 'per_lead' | 'monthly' | 'hybrid';
  onSuccess: () => void;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'An error occurred');
        setIsProcessing(false);
        return;
      }

      if (setupIntent?.status === 'succeeded') {
        const result = await confirmPaymentMethod({
          setupIntentId: setupIntent.id,
          billingType,
          pricingTier: tier,
        });

        if (result.success) {
          onSuccess();
        } else {
          setErrorMessage(result.message || 'Failed to confirm payment method');
          setIsProcessing(false);
        }
      }
    } catch {
      setErrorMessage('An unexpected error occurred');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border border-gray-300 rounded-lg p-4">
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Continue'}
        </button>
      </div>
    </form>
  );
}

export const PaymentMethodStep = ({
  tier,
  billingType,
  onNext,
  onBack,
}: Props) => {
  const [setupIntent, setSetupIntent] = useState<{
    clientSecret: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const monthlyPrice = tier === 'pro' ? 149 : 399;
  const discount = tier === 'pro' ? 25 : 0;

  useEffect(() => {
    const initializeSetup = async () => {
      setIsLoading(true);
      const result = await setupPaymentMethod({
        pricingTier: tier,
        billingType,
      });

      if (result.success && result.setupIntentClientSecret) {
        setSetupIntent({ clientSecret: result.setupIntentClientSecret });
      } else {
        setError(result.message || 'Failed to initialize payment setup');
      }
      setIsLoading(false);
    };

    initializeSetup();
  }, [tier, billingType]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Setting up payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-red-900 mb-1">Setup Error</h4>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Information
        </h2>
        <p className="text-gray-600">
          Secure payment setup for your {tier === 'pro' ? 'Pro' : 'Elite'}{' '}
          subscription.
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
              {billingType !== 'per_lead' && (
                <li>• ${monthlyPrice}/month subscription</li>
              )}
              {discount > 0 && <li>• {discount}% discount on all leads</li>}
              <li>
                • {tier === 'elite' ? 'Exclusive leads' : 'Priority routing'}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {setupIntent && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: setupIntent.clientSecret }}
        >
          <PaymentForm
            tier={tier}
            billingType={billingType}
            onSuccess={onNext}
            onBack={onBack}
          />
        </Elements>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center text-sm text-gray-600">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <span>Secured by Stripe • PCI compliant • 256-bit encryption</span>
        </div>
      </div>
    </div>
  );
};
