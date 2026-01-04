'use client';

import { useState } from 'react';
import { Database } from '@/lib/database.types';
import {
  updateProfile,
  pauseLeadDelivery,
  resumeLeadDelivery,
} from '@/actions/settings-actions';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';

type Contractor = Database['public']['Tables']['contractors']['Row'];

type Props = {
  contractor: Contractor;
  onUpdate: (data: Partial<Contractor>) => void;
};

export const ProfileSettings = ({ contractor, onUpdate }: Props) => {
  const [formData, setFormData] = useState({
    company_name: contractor.company_name || '',
    email: contractor.email || '',
    phone: contractor.phone || '',
    business_description: contractor.business_description || '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPauseDialog, setShowPauseDialog] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const result = await updateProfile(formData);

    if (result.success) {
      setSuccess(true);
      onUpdate(formData);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.message || 'Failed to update profile');
    }

    setSaving(false);
  };

  const handlePause = async () => {
    setToggleLoading(true);
    const result = await pauseLeadDelivery();

    if (result.success) {
      onUpdate({ status: 'paused' });
    } else {
      setError(result.message || 'Failed to pause lead delivery');
    }

    setToggleLoading(false);
    setShowPauseDialog(false);
  };

  const handleResume = async () => {
    setToggleLoading(true);
    const result = await resumeLeadDelivery();

    if (result.success) {
      onUpdate({ status: 'active' });
    } else {
      setError(result.message || 'Failed to resume lead delivery');
    }

    setToggleLoading(false);
    setShowResumeDialog(false);
  };

  const isPaused = contractor.status === 'paused';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Profile Information
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Update your business information and contact details
        </p>
      </div>

      {/* Lead Delivery Status */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Lead Delivery</h3>
            <p className="text-sm text-gray-600 mt-1">
              {isPaused
                ? 'Lead delivery is currently paused. You will not receive new leads.'
                : 'Lead delivery is active. You are receiving new leads based on your preferences.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              isPaused ? setShowResumeDialog(true) : setShowPauseDialog(true)
            }
            disabled={toggleLoading}
            className={`px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 flex items-center ${
              isPaused
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            }`}
          >
            {toggleLoading && (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isPaused ? 'Resuming...' : 'Pausing...'}
              </>
            )}
            {!toggleLoading && (isPaused ? 'Resume Leads' : 'Pause Leads')}
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="company_name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Company Name
          </label>
          <input
            type="text"
            id="company_name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your Company Name"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contact Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contact Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="(555) 555-5555"
          />
        </div>

        <div>
          <label
            htmlFor="business_description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Business Description
          </label>
          <textarea
            id="business_description"
            name="business_description"
            value={formData.business_description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about your business, services, and what makes you unique..."
          />
          <p className="text-xs text-gray-500 mt-1">
            This description may be shown to homeowners when you accept their
            lead
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-600">
              Profile updated successfully!
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>

      {/* Confirmation Dialogs */}
      {showPauseDialog && (
        <ConfirmDialog
          title="Pause Lead Delivery?"
          message="You will stop receiving new leads until you resume lead delivery. Existing leads will not be affected."
          confirmLabel="Pause Leads"
          confirmVariant="warning"
          onConfirm={handlePause}
          onCancel={() => setShowPauseDialog(false)}
        />
      )}

      {showResumeDialog && (
        <ConfirmDialog
          title="Resume Lead Delivery?"
          message="You will start receiving new leads again based on your service areas and preferences."
          confirmLabel="Resume Leads"
          confirmVariant="primary"
          onConfirm={handleResume}
          onCancel={() => setShowResumeDialog(false)}
        />
      )}
    </div>
  );
};
