'use client';

import { useState, useEffect } from 'react';
import {
  CreditCard,
  Download,
  DollarSign,
  TrendingUp,
  Calendar,
  Loader2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { getBillingData } from '@/actions/billing-actions';

type Invoice = {
  id: string;
  amount_paid: number;
  created: number;
  status: string;
  invoice_pdf: string | null;
  hosted_invoice_url: string | null;
  description: string;
};

type BillingStats = {
  total_spent: number;
  this_month_spent: number;
  leads_purchased: number;
  leads_this_month: number;
};

type PaymentFailure = {
  id: string;
  invoice_id: string;
  amount: number;
  attempt_count: number;
  error_message: string | null;
  created_at: string;
};

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<BillingStats | null>(null);
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
  const [paymentFailures, setPaymentFailures] = useState<PaymentFailure[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getBillingData();

      if (result.success) {
        setInvoices(result.invoices || []);
        setStats(result.stats || null);
        setHasPaymentMethod(result.hasPaymentMethod || false);
        setPaymentFailures(result.paymentFailures || []);
        setIsPaused(result.isPaused || false);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
      open: { label: 'Open', color: 'bg-yellow-100 text-yellow-800' },
      void: { label: 'Void', color: 'bg-gray-100 text-gray-800' },
      uncollectible: {
        label: 'Uncollectible',
        color: 'bg-red-100 text-red-800',
      },
    };
    return (
      statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
          <p className="mt-2 text-gray-600">
            Manage your payment methods and view billing history
          </p>
        </div>

        {isPaused && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-1">
                Account Paused Due to Payment Failures
              </h3>
              <p className="text-sm text-red-800 mb-3">
                Your account has been paused after multiple failed payment attempts. Update your payment method to reactivate your account and start receiving leads again.
              </p>
              <Link
                href="/contractor/billing/payment-methods"
                className="inline-flex items-center text-sm font-semibold text-red-900 hover:text-red-700"
              >
                Update Payment Method
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>
        )}

        {!hasPaymentMethod && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 mb-1">
                No Payment Method Added
              </h3>
              <p className="text-sm text-yellow-800 mb-3">
                Add a payment method to start receiving and accepting leads.
              </p>
              <Link
                href="/contractor/billing/payment-methods"
                className="inline-flex items-center text-sm font-semibold text-yellow-900 hover:text-yellow-700"
              >
                Add Payment Method
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>
        )}

        {paymentFailures.length > 0 && !isPaused && (
          <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 mb-1">
                Recent Payment Failures
              </h3>
              <p className="text-sm text-orange-800 mb-3">
                We encountered issues charging your payment method. Please update your payment method to avoid service interruption. After 3 failed attempts, your account will be paused.
              </p>
              <div className="space-y-2 mb-3">
                {paymentFailures.map((failure) => (
                  <div key={failure.id} className="text-sm text-orange-900">
                    <span className="font-semibold">
                      ${failure.amount.toFixed(2)}
                    </span>
                    {' - '}
                    <span>{failure.error_message || 'Payment failed'}</span>
                    {' '}
                    <span className="text-orange-700">
                      (Attempt {failure.attempt_count}/3)
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href="/contractor/billing/payment-methods"
                className="inline-flex items-center text-sm font-semibold text-orange-900 hover:text-orange-700"
              >
                Update Payment Method
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">Total Spent</div>
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${stats.total_spent.toFixed(2)}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">This Month</div>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${stats.this_month_spent.toFixed(2)}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">Leads Purchased</div>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.leads_purchased}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">Leads This Month</div>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.leads_this_month}
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Methods
            </h2>
            <Link
              href="/contractor/billing/payment-methods"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Manage
            </Link>
          </div>
          <p className="text-sm text-gray-600">
            {hasPaymentMethod
              ? 'You have payment methods configured'
              : 'No payment methods added yet'}
          </p>
        </div>

        {/* Invoices */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Invoices
          </h2>

          {invoices.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>No invoices yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Invoices will appear here when you accept leads
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(invoice => {
                    const statusBadge = getStatusBadge(invoice.status);
                    return (
                      <tr key={invoice.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {formatDate(invoice.created)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {invoice.description}
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                          ${invoice.amount_paid.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}
                          >
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {invoice.invoice_pdf && (
                            <a
                              href={invoice.invoice_pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              PDF
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
