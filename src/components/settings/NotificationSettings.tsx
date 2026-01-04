'use client';

import { useState } from 'react';
import { Database } from '@/lib/database.types';
import { updateNotificationSettings } from '@/actions/settings-actions';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

type Contractor = Database['public']['Tables']['contractors']['Row'];

type Props = {
  contractor: Contractor;
  onUpdate: (data: Partial<Contractor>) => void;
};

export const NotificationSettings = ({ contractor, onUpdate }: Props) => {
  const [formData, setFormData] = useState({
    email_notifications: contractor.email_notifications ?? true,
    sms_notifications: contractor.sms_notifications ?? true,
    notify_new_lead: contractor.notify_new_lead ?? true,
    notify_lead_updates: contractor.notify_lead_updates ?? true,
    notify_messages: contractor.notify_messages ?? true,
    notify_billing: contractor.notify_billing ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = (field: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const result = await updateNotificationSettings(formData);

    if (result.success) {
      setSuccess(true);
      onUpdate(formData);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.message || 'Failed to update notification settings');
    }

    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Notification Preferences
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Manage how and when you receive notifications about leads and account
          activity
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Notification Channels */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Notification Channels
          </h3>
          <div className="space-y-3">
            <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.email_notifications}
                onChange={() => handleToggle('email_notifications')}
                className="w-5 h-5 text-blue-600 rounded mt-0.5"
              />
              <div className="ml-3">
                <div className="font-medium text-gray-900">
                  Email Notifications
                </div>
                <div className="text-sm text-gray-600">
                  Receive notifications via email at {contractor.email}
                </div>
              </div>
            </label>

            <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.sms_notifications}
                onChange={() => handleToggle('sms_notifications')}
                className="w-5 h-5 text-blue-600 rounded mt-0.5"
              />
              <div className="ml-3">
                <div className="font-medium text-gray-900">
                  SMS Notifications
                </div>
                <div className="text-sm text-gray-600">
                  Receive text messages at {contractor.phone}
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Notification Types */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            What to Notify About
          </h3>
          <div className="space-y-3">
            <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.notify_new_lead}
                onChange={() => handleToggle('notify_new_lead')}
                className="w-5 h-5 text-blue-600 rounded mt-0.5"
              />
              <div className="ml-3">
                <div className="font-medium text-gray-900">New Leads</div>
                <div className="text-sm text-gray-600">
                  Get notified immediately when a new lead is available
                </div>
              </div>
            </label>

            <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.notify_lead_updates}
                onChange={() => handleToggle('notify_lead_updates')}
                className="w-5 h-5 text-blue-600 rounded mt-0.5"
              />
              <div className="ml-3">
                <div className="font-medium text-gray-900">Lead Updates</div>
                <div className="text-sm text-gray-600">
                  Updates about leads you&apos;ve accepted or are working on
                </div>
              </div>
            </label>

            <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.notify_messages}
                onChange={() => handleToggle('notify_messages')}
                className="w-5 h-5 text-blue-600 rounded mt-0.5"
              />
              <div className="ml-3">
                <div className="font-medium text-gray-900">Messages</div>
                <div className="text-sm text-gray-600">
                  Messages from homeowners or Closer support
                </div>
              </div>
            </label>

            <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.notify_billing}
                onChange={() => handleToggle('notify_billing')}
                className="w-5 h-5 text-blue-600 rounded mt-0.5"
              />
              <div className="ml-3">
                <div className="font-medium text-gray-900">
                  Billing & Payments
                </div>
                <div className="text-sm text-gray-600">
                  Invoices, payment confirmations, and billing updates
                </div>
              </div>
            </label>
          </div>
        </div>

        {!formData.email_notifications && !formData.sms_notifications && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">
                  No notification channels enabled
                </p>
                <p>
                  You won&apos;t receive any notifications. We recommend
                  enabling at least one channel to stay updated on new leads.
                </p>
              </div>
            </div>
          </div>
        )}

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
              Notification settings updated successfully!
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
    </div>
  );
};
