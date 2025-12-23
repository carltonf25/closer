'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signupContractor, AuthActionState } from '@/actions/auth';
import { SERVICES } from '@/config/services';
import { usePhoneFormat } from '@/lib/hooks/usePhoneFormat';
import { useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {pending ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Creating Account...
        </>
      ) : (
        'Create Account'
      )}
    </button>
  );
};

export function SignupForm() {
  const [state, formAction] = useFormState<AuthActionState | null>(
    signupContractor,
    null
  );
  const phoneFormat = usePhoneFormat();
  const [serviceZips, setServiceZips] = useState(['']);

  if (state?.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-center mb-2 text-gray-900">
          Account Created!
        </h3>
        <p className="text-sm text-gray-600 text-center">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-6 bg-white p-8 rounded-lg shadow-md"
    >
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Company Info Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
          Company Information
        </h2>

        <div>
          <label
            htmlFor="company_name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Company Name *
          </label>
          <input
            type="text"
            name="company_name"
            id="company_name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ABC Plumbing & HVAC"
          />
          {state?.errors?.company_name && (
            <p className="text-sm text-red-600 mt-1">
              {state.errors.company_name[0]}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact_name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Name *
          </label>
          <input
            type="text"
            name="contact_name"
            id="contact_name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Smith"
          />
          {state?.errors?.contact_name && (
            <p className="text-sm text-red-600 mt-1">
              {state.errors.contact_name[0]}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email *
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john@abcplumbing.com"
          />
          {state?.errors?.email && (
            <p className="text-sm text-red-600 mt-1">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={phoneFormat.displayValue}
            onChange={phoneFormat.handleChange}
            onBlur={phoneFormat.handleBlur}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="(555) 555-5555"
          />
          {state?.errors?.phone && (
            <p className="text-sm text-red-600 mt-1">{state.errors.phone[0]}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="license_number"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            License Number (Optional)
          </label>
          <input
            type="text"
            name="license_number"
            id="license_number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="GA-12345"
          />
        </div>
      </div>

      {/* Location Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
          Business Location
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City *
            </label>
            <input
              type="text"
              name="city"
              id="city"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Atlanta"
            />
            {state?.errors?.city && (
              <p className="text-sm text-red-600 mt-1">
                {state.errors.city[0]}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              State *
            </label>
            <select
              name="state"
              id="state"
              defaultValue="GA"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="GA">GA</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="zip"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            ZIP Code *
          </label>
          <input
            type="text"
            name="zip"
            id="zip"
            required
            pattern="^\d{5}(-\d{4})?$"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="30301"
          />
          {state?.errors?.zip && (
            <p className="text-sm text-red-600 mt-1">{state.errors.zip[0]}</p>
          )}
        </div>
      </div>

      {/* Services Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
          Services Offered
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select the services you offer *
          </label>
          <div className="space-y-2">
            {Object.entries(SERVICES).map(([key, service]) => (
              <label
                key={key}
                className="flex items-center p-2 hover:bg-gray-50 rounded"
              >
                <input
                  type="checkbox"
                  name="services"
                  value={key}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-700">
                  {service.label}
                </span>
              </label>
            ))}
          </div>
          {state?.errors?.services && (
            <p className="text-sm text-red-600 mt-1">
              {state.errors.services[0]}
            </p>
          )}
        </div>
      </div>

      {/* Service Area Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
          Service Area
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ZIP Codes You Serve *
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Enter the ZIP codes where you provide services
          </p>
          <div className="space-y-2">
            {serviceZips.map((zip, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  name="service_zips"
                  value={zip}
                  onChange={e => {
                    const newZips = [...serviceZips];
                    newZips[index] = e.target.value;
                    setServiceZips(newZips);
                  }}
                  pattern="^\d{5}$"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="30301"
                />
                {serviceZips.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newZips = serviceZips.filter((_, i) => i !== index);
                      setServiceZips(newZips);
                    }}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setServiceZips([...serviceZips, ''])}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            + Add another ZIP code
          </button>
          {state?.errors?.service_zips && (
            <p className="text-sm text-red-600 mt-1">
              {state.errors.service_zips[0]}
            </p>
          )}
        </div>
      </div>

      {/* Security Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
          Account Security
        </h2>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password *
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            minLength={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 8 characters
          </p>
          {state?.errors?.password && (
            <p className="text-sm text-red-600 mt-1">
              {state.errors.password[0]}
            </p>
          )}
        </div>
      </div>

      {/* Global Error */}
      {state?.message && !state.success && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{state.message}</p>
        </div>
      )}

      <SubmitButton />
    </form>
  );
}
