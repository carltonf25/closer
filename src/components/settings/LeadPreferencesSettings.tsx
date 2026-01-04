'use client';

import { useState } from 'react';
import { Database } from '@/lib/database.types';
import { updateLeadPreferences } from '@/actions/settings-actions';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

type Contractor = Database['public']['Tables']['contractors']['Row'];

type Props = {
  contractor: Contractor;
  onUpdate: (data: Partial<Contractor>) => void;
};

const URGENCY_OPTIONS = [
  { value: 'emergency', label: 'Emergency', description: '24-48 hours' },
  { value: 'today', label: 'Today', description: 'Within 24 hours' },
  { value: 'this_week', label: 'This Week', description: 'Within 7 days' },
  { value: 'flexible', label: 'Flexible', description: 'No rush' },
];

const PROPERTY_TYPES = [
  { value: 'single_family', label: 'Single Family Home' },
  { value: 'multi_family', label: 'Multi-Family' },
  { value: 'condo', label: 'Condo/Townhouse' },
  { value: 'commercial', label: 'Commercial' },
];

export const LeadPreferencesSettings = ({ contractor, onUpdate }: Props) => {
  const [formData, setFormData] = useState({
    max_lead_budget: contractor.max_lead_budget || 1000,
    preferred_urgencies: (contractor.preferred_urgencies as string[]) || [],
    preferred_property_types:
      (contractor.preferred_property_types as string[]) || [],
    exclusive_only: contractor.exclusive_only || false,
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleUrgency = (urgency: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_urgencies: prev.preferred_urgencies.includes(urgency)
        ? prev.preferred_urgencies.filter(u => u !== urgency)
        : [...prev.preferred_urgencies, urgency],
    }));
    setSuccess(false);
  };

  const handleTogglePropertyType = (propertyType: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_property_types: prev.preferred_property_types.includes(
        propertyType
      )
        ? prev.preferred_property_types.filter(p => p !== propertyType)
        : [...prev.preferred_property_types, propertyType],
    }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const result = await updateLeadPreferences(formData);

    if (result.success) {
      setSuccess(true);
      onUpdate(formData);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.message || 'Failed to update preferences');
    }

    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Lead Preferences
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Configure your lead preferences to receive the most relevant
          opportunities
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Monthly Budget */}
        <div>
          <label
            htmlFor="max_lead_budget"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Monthly Lead Budget
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">$</span>
            <input
              type="number"
              id="max_lead_budget"
              value={formData.max_lead_budget}
              onChange={e => {
                setFormData(prev => ({
                  ...prev,
                  max_lead_budget: parseInt(e.target.value, 10) || 0,
                }));
                setSuccess(false);
              }}
              min="0"
              step="100"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Maximum amount you want to spend on leads per month. We&apos;ll stop
            sending leads when you reach this limit.
          </p>
        </div>

        {/* Urgency Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Job Urgency
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Select all urgency levels you&apos;re comfortable with
          </p>
          <div className="space-y-2">
            {URGENCY_OPTIONS.map(option => {
              const isSelected = formData.preferred_urgencies.includes(
                option.value
              );
              return (
                <label
                  key={option.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleUrgency(option.value)}
                    className="w-4 h-4 text-blue-600 rounded"
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
              );
            })}
          </div>
        </div>

        {/* Property Type Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Property Types
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Select all property types you service
          </p>
          <div className="grid grid-cols-2 gap-2">
            {PROPERTY_TYPES.map(option => {
              const isSelected = formData.preferred_property_types.includes(
                option.value
              );
              return (
                <label
                  key={option.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleTogglePropertyType(option.value)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Exclusive Leads Only */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={formData.exclusive_only}
              onChange={e => {
                setFormData(prev => ({
                  ...prev,
                  exclusive_only: e.target.checked,
                }));
                setSuccess(false);
              }}
              className="w-5 h-5 text-blue-600 rounded mt-0.5"
            />
            <div className="ml-3">
              <div className="font-medium text-gray-900">
                Exclusive Leads Only
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Only receive leads that are exclusive to you (not shared with
                other contractors). Note: Exclusive leads may be priced higher.
              </div>
            </div>
          </label>
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
              Preferences updated successfully!
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
