'use client';

import { useState } from 'react';
import { Database } from '@/lib/database.types';
import { updateServicesOffered } from '@/actions/settings-actions';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

type Contractor = Database['public']['Tables']['contractors']['Row'];

type Props = {
  contractor: Contractor;
  onUpdate: (data: Partial<Contractor>) => void;
};

const AVAILABLE_SERVICES = [
  {
    value: 'plumbing',
    label: 'Plumbing',
    description: 'Repairs, installations, pipe work',
  },
  {
    value: 'electrical',
    label: 'Electrical',
    description: 'Wiring, fixtures, panels',
  },
  {
    value: 'hvac',
    label: 'HVAC',
    description: 'Heating, cooling, ventilation',
  },
  {
    value: 'roofing',
    label: 'Roofing',
    description: 'Repairs, replacement, inspection',
  },
  {
    value: 'painting',
    label: 'Painting',
    description: 'Interior and exterior painting',
  },
  {
    value: 'flooring',
    label: 'Flooring',
    description: 'Installation, refinishing, repair',
  },
  {
    value: 'carpentry',
    label: 'Carpentry',
    description: 'Custom work, repairs, installation',
  },
  {
    value: 'landscaping',
    label: 'Landscaping',
    description: 'Lawn care, design, maintenance',
  },
  {
    value: 'general_handyman',
    label: 'General Handyman',
    description: 'Minor repairs and maintenance',
  },
  {
    value: 'remodeling',
    label: 'Remodeling',
    description: 'Kitchen, bathroom, whole home',
  },
];

export const ServicesOfferedSettings = ({ contractor, onUpdate }: Props) => {
  const initialServices = (contractor.services_offered as string[]) || [];
  const [selectedServices, setSelectedServices] =
    useState<string[]>(initialServices);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleService = (serviceValue: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceValue)) {
        return prev.filter(s => s !== serviceValue);
      }
      return [...prev, serviceValue];
    });
    setSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedServices.length === 0) {
      setError('Please select at least one service');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    const result = await updateServicesOffered(selectedServices);

    if (result.success) {
      setSuccess(true);
      onUpdate({ services_offered: selectedServices as any });
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.message || 'Failed to update services');
    }

    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Services Offered
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Select the services you provide. You will only receive leads for these
          services.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          {AVAILABLE_SERVICES.map(service => {
            const isSelected = selectedServices.includes(service.value);
            return (
              <label
                key={service.value}
                className={`flex items-start p-4 border rounded-lg cursor-pointer transition ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggleService(service.value)}
                  className="w-5 h-5 text-blue-600 rounded mt-0.5"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">
                    {service.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {service.description}
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {selectedServices.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">No services selected</p>
                <p>
                  You must select at least one service to receive leads. Choose
                  all services you can provide.
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
              Services updated successfully!
            </p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {selectedServices.length} service
            {selectedServices.length !== 1 ? 's' : ''} selected
          </p>
          <button
            type="submit"
            disabled={saving || selectedServices.length === 0}
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
