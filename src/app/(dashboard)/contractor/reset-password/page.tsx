import { Metadata } from 'next';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your contractor account password.',
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="mt-2 text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>

        <PasswordResetForm />

        <p className="mt-6 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link
            href="/contractor/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
