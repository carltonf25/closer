import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { LeadsInbox } from '@/components/leads/LeadsInbox';

export const metadata: Metadata = {
  title: 'Lead Inbox - Contractor Dashboard',
  description: 'View and manage your leads',
};

export default async function LeadsPage() {
  const supabase = createServerSupabaseClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/contractor/login');
  }

  // Get contractor profile
  const { data: contractor } = await supabase
    .from('contractors')
    .select('id, company_name, onboarding_completed')
    .eq('user_id', user.id)
    .single();

  if (!contractor) {
    redirect('/contractor/login');
  }

  // Redirect to onboarding if not completed
  if (!contractor.onboarding_completed) {
    redirect('/contractor/onboarding');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lead Inbox</h1>
          <p className="mt-2 text-gray-600">
            View and manage your incoming leads
          </p>
        </div>

        <LeadsInbox contractorId={contractor.id} />
      </div>
    </div>
  );
}
