'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updatePassword, AuthActionState } from '@/actions/auth';
import { Loader2 } from 'lucide-react';

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
          Updating...
        </>
      ) : (
        'Update Password'
      )}
    </button>
  );
};

export default function UpdatePasswordPage() {
  const [state, formAction] = useFormState<AuthActionState | null>(
    updatePassword,
    null
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Set New Password</h1>
          <p className="mt-2 text-gray-600">
            Choose a new password for your account
          </p>
        </div>

        <form
          action={formAction}
          className="space-y-6 bg-white p-8 rounded-lg shadow-md"
        >
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
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

          {state?.message && !state.success && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{state.message}</p>
            </div>
          )}

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
