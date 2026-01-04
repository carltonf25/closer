'use client';

import { useState } from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import { reportBadLead } from '@/actions/lead-actions';

type Props = {
  deliveryId: string;
  onClose: () => void;
  onSuccess: () => void;
};

const BAD_LEAD_REASONS = [
  {
    value: 'invalid_contact' as const,
    label: 'Invalid Contact Info',
    description: "Phone number or email doesn't work",
  },
  {
    value: 'wrong_service' as const,
    label: 'Wrong Service Type',
    description: "Service requested doesn't match my offerings",
  },
  {
    value: 'wrong_area' as const,
    label: 'Outside Service Area',
    description: 'Location is outside my coverage area',
  },
  {
    value: 'duplicate' as const,
    label: 'Duplicate Lead',
    description: "I've already received this lead",
  },
  {
    value: 'spam' as const,
    label: 'Spam/Fake',
    description: 'This appears to be spam or a fake inquiry',
  },
  {
    value: 'other' as const,
    label: 'Other Issue',
    description: 'Something else is wrong with this lead',
  },
];

export const ReportBadLeadModal = ({
  deliveryId,
  onClose,
  onSuccess,
}: Props) => {
  const [reason, setReason] = useState<string>('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!reason) {
      setError('Please select a reason');
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await reportBadLead({
      deliveryId,
      reason: reason as any,
      details: details || undefined,
    });

    if (!result.success) {
      setError(result.message || 'Failed to report lead');
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Report Bad Lead
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Quality Guarantee</p>
              <p>
                If this lead has invalid contact info, wrong service type, or is
                outside your area, we&apos;ll review and issue a credit to your
                account.
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Please select the reason why this lead doesn&apos;t meet quality
          standards:
        </p>

        <div className="space-y-2 mb-4">
          {BAD_LEAD_REASONS.map(option => (
            <label
              key={option.value}
              className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="radio"
                name="reason"
                value={option.value}
                checked={reason === option.value}
                onChange={e => setReason(e.target.value)}
                className="w-4 h-4 text-blue-600 mt-0.5"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">
                  {option.label}
                </div>
                <div className="text-xs text-gray-600">
                  {option.description}
                </div>
              </div>
            </label>
          ))}
        </div>

        <div className="mb-4">
          <label
            htmlFor="details"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Additional Details (Optional)
          </label>
          <textarea
            id="details"
            value={details}
            onChange={e => setDetails(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Provide any additional information that might be helpful..."
          />
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
