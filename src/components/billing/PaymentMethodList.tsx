'use client';

import { useState } from 'react';
import { CreditCard, Check, Trash2, Loader2 } from 'lucide-react';
import {
  removePaymentMethod,
  setDefaultPaymentMethod,
} from '@/actions/payment-actions';

type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
};

type Props = {
  paymentMethods: PaymentMethod[];
  onUpdate: () => void;
};

const getBrandIcon = (brand: string) => {
  const brandLower = brand.toLowerCase();
  return brandLower.charAt(0).toUpperCase() + brandLower.slice(1);
};

export const PaymentMethodList = ({ paymentMethods, onUpdate }: Props) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [action, setAction] = useState<'remove' | 'default' | null>(null);

  const handleSetDefault = async (paymentMethodId: string) => {
    setLoadingId(paymentMethodId);
    setAction('default');

    const result = await setDefaultPaymentMethod(paymentMethodId);

    if (result.success) {
      onUpdate();
    } else {
      alert(result.message || 'Failed to set default payment method');
    }

    setLoadingId(null);
    setAction(null);
  };

  const handleRemove = async (paymentMethodId: string) => {
    if (
      !confirm(
        'Are you sure you want to remove this payment method? This cannot be undone.'
      )
    ) {
      return;
    }

    setLoadingId(paymentMethodId);
    setAction('remove');

    const result = await removePaymentMethod(paymentMethodId);

    if (result.success) {
      onUpdate();
    } else {
      alert(result.message || 'Failed to remove payment method');
    }

    setLoadingId(null);
    setAction(null);
  };

  if (paymentMethods.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No payment methods added yet</p>
        <p className="text-sm text-gray-500 mt-1">
          Add a payment method to start receiving leads
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {paymentMethods.map(pm => (
        <div
          key={pm.id}
          className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-blue-300 transition"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 rounded-lg p-3">
              <CreditCard className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {getBrandIcon(pm.brand)} •••• {pm.last4}
                </span>
                {pm.is_default && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Default
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                Expires {pm.exp_month}/{pm.exp_year}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!pm.is_default && (
              <button
                type="button"
                onClick={() => handleSetDefault(pm.id)}
                disabled={loadingId === pm.id && action === 'default'}
                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50 flex items-center gap-1"
              >
                {loadingId === pm.id && action === 'default' ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  'Set as Default'
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => handleRemove(pm.id)}
              disabled={loadingId === pm.id && action === 'remove'}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
              title="Remove payment method"
            >
              {loadingId === pm.id && action === 'remove' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
