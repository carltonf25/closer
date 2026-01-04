import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ContractorSettings } from '@/components/settings/ContractorSettings';
import type { Contractor } from '@/lib/database.types';

export default async function SettingsPage() {
  const supabase = createServerSupabaseClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/contractor/login');
  }

  // Get contractor data
  const { data: contractor } = (await supabase
    .from('contractors')
    .select('*')
    .eq('user_id', user.id)
    .single()) as {
    data: Contractor | null;
    error: any;
  };

  if (!contractor) {
    redirect('/contractor/login');
  }

  // Check if onboarding is complete
  if (!contractor.onboarding_completed) {
    redirect('/contractor/onboarding');
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your profile, preferences, and account settings
        </p>
      </div>

      <ContractorSettings contractor={contractor} />
    </div>
  );
}
