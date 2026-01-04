'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { rejectLead } from '@/actions/lead-actions';

type Props = {
  deliveryId: string;
  onClose: () => void;
  onSuccess: () => void;
};

const REJECT_REASONS = [
  { value: 'too_far', label: 'Service area too far' },
  { value: 'not_available', label: 'Not available at this time' },
  { value: 'fully_booked', label: 'Fully booked' },
  { value: 'wrong_service', label: 'Not the right service for us' },
  { value: 'price_concern', label: 'Price/budget concerns' },
  { value: 'other', label: 'Other reason' },
];

export const RejectLeadModal = ({ deliveryId, onClose, onSuccess }: Props) => {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!reason) {
      setError('Please select a reason');
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await rejectLead(deliveryId, reason);

    if (!result.success) {
      setError(result.message || 'Failed to reject lead');
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Reject Lead</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Please select a reason for rejecting this lead. This helps us improve
          lead quality.
        </p>

        <div className="space-y-2 mb-4">
          {REJECT_REASONS.map(option => (
            <label
              key={option.value}
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="radio"
                name="reason"
                value={option.value}
                checked={reason === option.value}
                onChange={e => setReason(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-3 text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
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
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Rejecting...
              </>
            ) : (
              'Reject Lead'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
