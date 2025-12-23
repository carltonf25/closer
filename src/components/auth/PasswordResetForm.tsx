'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { requestPasswordReset, AuthActionState } from '@/actions/auth';
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
          Sending...
        </>
      ) : (
        'Send Reset Link'
      )}
    </button>
  );
};

export function PasswordResetForm() {
  const [state, formAction] = useFormState<AuthActionState | null>(
    requestPasswordReset,
    null
  );

  if (state?.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-center mb-2 text-gray-900">
          Check Your Email
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
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="john@abcplumbing.com"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter the email address associated with your account
        </p>
      </div>

      {state?.message && !state.success && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{state.message}</p>
        </div>
      )}

      <SubmitButton />
    </form>
  );
}
