'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginContractor, AuthActionState } from '@/actions/auth';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

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
          Logging in...
        </>
      ) : (
        'Log In'
      )}
    </button>
  );
};

export function LoginForm() {
  const [state, formAction] = useFormState<AuthActionState | null>(
    loginContractor,
    null
  );

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
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="john@abcplumbing.com"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Link
            href="/contractor/reset-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <input
          type="password"
          name="password"
          id="password"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {state?.message && !state.success && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{state.message}</p>
          {state.data?.needsVerification && (
            <Link
              href="/contractor/verify-email"
              className="text-sm text-blue-600 hover:underline mt-2 inline-block"
            >
              Resend verification email
            </Link>
          )}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}
