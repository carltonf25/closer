import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

export const metadata: Metadata = {
  title: 'Complete Your Profile - Contractor Onboarding',
  description: 'Complete your contractor profile to start receiving leads',
};

export default async function OnboardingPage() {
  const supabase = createServerSupabaseClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/contractor/login');
  }

  // Get contractor profile
  const { data: contractor } = await supabase
    .from('contractors')
    .select('*')
    .eq('user_id', user.id)
    .single<{
      id: string;
      email: string;
      phone: string;
      company_name: string;
      onboarding_completed: boolean;
      [key: string]: unknown;
    }>();

  if (!contractor) {
    redirect('/contractor/login');
  }

  // If onboarding is already completed, redirect to dashboard
  if (contractor.onboarding_completed) {
    redirect('/contractor/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to the Network!
          </h1>
          <p className="mt-2 text-gray-600">
            Let&apos;s complete your profile to start receiving leads
          </p>
        </div>

        <OnboardingFlow contractor={contractor} />
      </div>
    </div>
  );
}
