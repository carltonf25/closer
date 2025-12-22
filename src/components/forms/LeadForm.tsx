'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitLead, ActionState } from '@/actions/leads';
import { SERVICES, URGENCY_OPTIONS } from '@/config/services';
import { ServiceType, LeadUrgency } from '@/lib/database.types';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary btn-lg w-full"
    >
      {pending ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Submitting...
        </>
      ) : (
        'Get My Free Quotes →'
      )}
    </button>
  );
}

interface LeadFormProps {
  defaultService?: ServiceType;
  defaultCity?: string;
  defaultState?: string;
}

export function LeadForm({
  defaultService,
  defaultCity,
  defaultState = 'GA',
}: LeadFormProps) {
  const [state, setState] = useState<ActionState | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service_type: defaultService || '',
    urgency: '' as LeadUrgency | '',
  });

  async function handleSubmit(data: FormData) {
    // Add step 1 data to form
    data.set('service_type', formData.service_type);
    data.set('urgency', formData.urgency);
    
    const result = await submitLead(null, data);
    setState(result);
  }

  // Success state
  if (state?.success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Request Submitted!
        </h3>
        <p className="text-gray-600 mb-4">
          {state.message}
        </p>
        <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
          <strong>What happens next?</strong>
          <p className="mt-1">
            Licensed professionals in your area will contact you shortly with
            quotes. Compare options and choose the best fit for your needs.
          </p>
        </div>
      </div>
    );
  }

  const serviceOptions = Object.entries(SERVICES).map(([key, value]) => ({
    value: key,
    label: value.shortLabel,
    category: value.category,
  }));

  // Step 1: Service & Urgency
  if (step === 1) {
    return (
      <div className="space-y-6">
        {/* Service Selection */}
        <div className="form-group">
          <label className="label">
            What service do you need? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {serviceOptions.map((service) => (
              <button
                key={service.value}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, service_type: service.value })
                }
                className={cn(
                  'p-3 rounded-lg border-2 text-left transition-all',
                  formData.service_type === service.value
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <span className="font-medium text-sm">{service.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Urgency Selection */}
        <div className="form-group">
          <label className="label">
            When do you need service? <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {Object.entries(URGENCY_OPTIONS).map(([key, option]) => (
              <button
                key={key}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, urgency: key as LeadUrgency })
                }
                className={cn(
                  'w-full p-3 rounded-lg border-2 text-left transition-all flex justify-between items-center',
                  formData.urgency === key
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div>
                  <span className="font-medium">{option.label}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    {option.description}
                  </span>
                </div>
                {key === 'emergency' && (
                  <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded">
                    URGENT
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (formData.service_type && formData.urgency) {
              setStep(2);
            }
          }}
          disabled={!formData.service_type || !formData.urgency}
          className="btn-primary btn-lg w-full"
        >
          Continue →
        </button>
      </div>
    );
  }

  // Step 2: Contact Info
  return (
    <form action={handleSubmit} className="space-y-4">
      {/* Back button */}
      <button
        type="button"
        onClick={() => setStep(1)}
        className="text-sm text-gray-500 hover:text-gray-700 mb-2"
      >
        ← Back to service selection
      </button>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="first_name" className="label">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            required
            className={cn('input', state?.errors?.first_name && 'input-error')}
          />
          {state?.errors?.first_name && (
            <p className="error-message">{state.errors.first_name[0]}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="last_name" className="label">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            required
            className={cn('input', state?.errors?.last_name && 'input-error')}
          />
          {state?.errors?.last_name && (
            <p className="error-message">{state.errors.last_name[0]}</p>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="phone" className="label">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          placeholder="(404) 555-1234"
          className={cn('input', state?.errors?.phone && 'input-error')}
        />
        {state?.errors?.phone && (
          <p className="error-message">{state.errors.phone[0]}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email" className="label">
          Email <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          className={cn('input', state?.errors?.email && 'input-error')}
        />
        {state?.errors?.email && (
          <p className="error-message">{state.errors.email[0]}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="address" className="label">
          Street Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="address"
          name="address"
          required
          placeholder="123 Main Street"
          className={cn('input', state?.errors?.address && 'input-error')}
        />
        {state?.errors?.address && (
          <p className="error-message">{state.errors.address[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-3 form-group">
          <label htmlFor="city" className="label">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="city"
            name="city"
            required
            defaultValue={defaultCity}
            className={cn('input', state?.errors?.city && 'input-error')}
          />
        </div>

        <div className="col-span-1 form-group">
          <label htmlFor="state" className="label">
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            defaultValue={defaultState}
            maxLength={2}
            className="input"
            readOnly
          />
        </div>

        <div className="col-span-2 form-group">
          <label htmlFor="zip" className="label">
            ZIP <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="zip"
            name="zip"
            required
            maxLength={5}
            pattern="[0-9]{5}"
            className={cn('input', state?.errors?.zip && 'input-error')}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="property_type" className="label">
          Property Type
        </label>
        <select id="property_type" name="property_type" className="input">
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description" className="label">
          Describe the issue <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Tell us more about what you need help with..."
          className="input resize-none"
        />
      </div>

      {/* Hidden fields */}
      <input type="hidden" name="source" value="seo" />
      <input
        type="hidden"
        name="source_url"
        value={typeof window !== 'undefined' ? window.location.href : ''}
      />

      {/* Error message */}
      {state && !state.success && state.message && !state.errors && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{state.message}</span>
        </div>
      )}

      <SubmitButton />

      <p className="text-xs text-gray-500 text-center">
        By submitting, you agree to receive calls and texts. Message & data rates
        may apply. Reply STOP to opt out.
      </p>
    </form>
  );
}
