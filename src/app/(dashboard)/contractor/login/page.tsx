import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contractor Login',
  description:
    'Log in to your contractor account to manage leads and settings.',
};

export default async function LoginPage() {
  // Check if already authenticated
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/contractor/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contractor Login</h1>
          <p className="mt-2 text-gray-600">
            Sign in to manage your leads and account
          </p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/contractor/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
