'use client';

import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Plus, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import {
  createSetupIntent,
  getPaymentMethods,
} from '@/actions/payment-actions';
import { AddPaymentMethodForm } from '@/components/billing/AddPaymentMethodForm';
import { PaymentMethodList } from '@/components/billing/PaymentMethodList';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
};

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    const result = await getPaymentMethods();

    if (result.success && result.paymentMethods) {
      setPaymentMethods(result.paymentMethods);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const handleAddClick = async () => {
    setLoading(true);
    const result = await createSetupIntent();

    if (result.success && result.setupIntentClientSecret) {
      setClientSecret(result.setupIntentClientSecret);
      setShowAddForm(true);
    } else {
      alert(result.message || 'Failed to initialize payment setup');
    }

    setLoading(false);
  };

  const handleAddSuccess = async () => {
    setShowAddForm(false);
    setClientSecret(null);
    await fetchPaymentMethods();
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setClientSecret(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/contractor/billing"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Billing
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
          <p className="mt-2 text-gray-600">
            Manage your payment methods for lead charges
          </p>
        </div>

        {loading && !showAddForm ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-6">
            {!showAddForm && (
              <>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddClick}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Payment Method
                  </button>
                </div>

                <PaymentMethodList
                  paymentMethods={paymentMethods}
                  onUpdate={fetchPaymentMethods}
                />
              </>
            )}

            {showAddForm && clientSecret && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Add New Payment Method
                </h2>
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#2563eb',
                      },
                    },
                  }}
                >
                  <AddPaymentMethodForm
                    onSuccess={handleAddSuccess}
                    onCancel={handleCancel}
                  />
                </Elements>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
