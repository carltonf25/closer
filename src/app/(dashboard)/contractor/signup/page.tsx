import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { SignupForm } from '@/components/auth/SignupForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contractor Signup - Join Our Network',
  description:
    'Join our network of HVAC and plumbing contractors and start receiving qualified leads in your area.',
};

export default async function SignupPage() {
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
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Join Our Contractor Network
          </h1>
          <p className="mt-2 text-gray-600">
            Start receiving qualified HVAC and plumbing leads in your area
          </p>
        </div>

        <SignupForm />

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
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
