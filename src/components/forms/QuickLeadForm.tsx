'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitQuickLead, ActionState } from '@/actions/leads';
import { SERVICES } from '@/config/services';
import { cn } from '@/lib/utils';
import { usePhoneFormat } from '@/lib/hooks/usePhoneFormat';
import { Loader2, CheckCircle } from 'lucide-react';

const SubmitButton = () => {
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
          Connecting you...
        </>
      ) : (
        'Get Free Quotes →'
      )}
    </button>
  );
};

export const QuickLeadForm = () => {
  const [state, setState] = useState<ActionState | null>(null);
  const [selectedService, setSelectedService] = useState<string>('');
  const phoneFormat = usePhoneFormat();

  async function handleSubmit(formData: FormData) {
    // Honeypot check - if filled, it's spam
    const honeypot = formData.get('website');
    if (honeypot) {
      // Silently fail - don't show error to spammer
      return;
    }

    // Set cleaned phone number
    formData.set('phone', phoneFormat.value);

    const result = await submitQuickLead(null, formData);
    setState(result);
  }

  if (state?.success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Request Received!
        </h3>
        <p className="text-gray-600">{state.message}</p>
        <p className="text-sm text-gray-500 mt-4">
          A licensed professional will contact you shortly.
        </p>
      </div>
    );
  }

  const serviceOptions = Object.entries(SERVICES).map(([key, value]) => ({
    value: key,
    label: value.shortLabel,
    category: value.category,
  }));

  return (
    <form action={handleSubmit} className="space-y-4">
      {/* Service Selection */}
      <div className="form-group">
        <label htmlFor="service_type" className="label">
          What do you need? <span className="text-red-500">*</span>
        </label>
        <select
          id="service_type"
          name="service_type"
          required
          value={selectedService}
          onChange={e => setSelectedService(e.target.value)}
          className={cn('input', state?.errors?.service_type && 'input-error')}
        >
          <option value="">Select a service...</option>
          <optgroup label="HVAC / Air Conditioning">
            {serviceOptions
              .filter(s => s.category === 'hvac')
              .map(service => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
          </optgroup>
          <optgroup label="Plumbing">
            {serviceOptions
              .filter(s => s.category === 'plumbing')
              .map(service => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
          </optgroup>
        </select>
        {state?.errors?.service_type && (
          <p className="error-message">{state.errors.service_type[0]}</p>
        )}
      </div>

      {/* Name */}
      <div className="form-group">
        <label htmlFor="name" className="label">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="John Smith"
          className="input"
        />
      </div>

      {/* Phone */}
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
          value={phoneFormat.displayValue}
          onChange={phoneFormat.handleChange}
          onBlur={phoneFormat.handleBlur}
          className={cn('input', state?.errors?.phone && 'input-error')}
        />
        {state?.errors?.phone && (
          <p className="error-message">{state.errors.phone[0]}</p>
        )}
      </div>

      {/* Honeypot field - hidden from users, visible to bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">
          Don't fill this out if you're human:
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      {/* ZIP Code */}
      <div className="form-group">
        <label htmlFor="zip" className="label">
          ZIP Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="zip"
          name="zip"
          required
          placeholder="30301"
          maxLength={5}
          pattern="[0-9]{5}"
          className="input"
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
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
          {state.message}
        </div>
      )}

      {/* Submit */}
      <SubmitButton />
    </form>
  );
};
