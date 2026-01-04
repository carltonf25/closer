'use client';

import { useState } from 'react';
import { Database } from '@/lib/database.types';
import { updateServiceAreas } from '@/actions/settings-actions';
import { Loader2, CheckCircle, AlertCircle, X, Plus } from 'lucide-react';

type Contractor = Database['public']['Tables']['contractors']['Row'];

type Props = {
  contractor: Contractor;
  onUpdate: (data: Partial<Contractor>) => void;
};

export const ServiceAreaSettings = ({ contractor, onUpdate }: Props) => {
  const initialAreas = (contractor.service_areas as string[]) || [];
  const [serviceAreas, setServiceAreas] = useState<string[]>(initialAreas);
  const [newArea, setNewArea] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddArea = () => {
    const trimmed = newArea.trim();
    if (!trimmed) return;

    if (serviceAreas.includes(trimmed)) {
      setError('This area is already in your list');
      return;
    }

    setServiceAreas([...serviceAreas, trimmed]);
    setNewArea('');
    setError(null);
    setSuccess(false);
  };

  const handleRemoveArea = (area: string) => {
    setServiceAreas(serviceAreas.filter(a => a !== area));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (serviceAreas.length === 0) {
      setError('Please add at least one service area');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    const result = await updateServiceAreas(serviceAreas);

    if (result.success) {
      setSuccess(true);
      onUpdate({ service_areas: serviceAreas as any });
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.message || 'Failed to update service areas');
    }

    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Service Areas
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Add ZIP codes or city names where you provide services. You will only
          receive leads from these areas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Add New Area */}
        <div>
          <label
            htmlFor="new_area"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Add Service Area
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="new_area"
              value={newArea}
              onChange={e => setNewArea(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddArea();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter ZIP code or city name (e.g., 94102 or San Francisco, CA)"
            />
            <button
              type="button"
              onClick={handleAddArea}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>
        </div>

        {/* Service Areas List */}
        {serviceAreas.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Service Areas ({serviceAreas.length})
            </label>
            <div className="border border-gray-200 rounded-lg p-3 max-h-64 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {serviceAreas.map(area => (
                  <div
                    key={area}
                    className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{area}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveArea(area)}
                      className="ml-2 hover:text-blue-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {serviceAreas.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">No service areas defined</p>
                <p>
                  You must add at least one service area to receive leads. Add
                  ZIP codes or cities where you provide services.
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
              Service areas updated successfully!
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || serviceAreas.length === 0}
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
