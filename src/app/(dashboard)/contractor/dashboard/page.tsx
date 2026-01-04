'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { signOut } from '@/actions/auth';
import { Loader2, Inbox, Settings, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function ContractorDashboard() {
  const { contractor, loading } = useAuth();
  const router = useRouter();

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!loading && contractor && !contractor.onboarding_completed) {
      router.push('/contractor/onboarding');
    }
  }, [loading, contractor, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Show loading while redirecting to onboarding
  if (contractor && !contractor.onboarding_completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {contractor?.company_name || 'Contractor'}!
              </h1>
              <p className="text-gray-600 mt-2">
                Your dashboard is under construction
              </p>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                Sign Out
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Account Information
              </h2>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Email:</dt>
                  <dd className="text-gray-900">{contractor?.email}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Phone:</dt>
                  <dd className="text-gray-900">{contractor?.phone}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Location:</dt>
                  <dd className="text-gray-900">
                    {contractor?.city}, {contractor?.state} {contractor?.zip}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Status:</dt>
                  <dd className="text-gray-900 capitalize">
                    {contractor?.status}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Services Offered
              </h2>
              <ul className="space-y-1 text-sm">
                {contractor?.services.map(service => (
                  <li key={service} className="text-gray-700 capitalize">
                    • {service.replace(/_/g, ' ')}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/contractor/leads"
              className="bg-white border-2 border-blue-600 rounded-lg p-6 hover:bg-blue-50 transition group"
            >
              <div className="flex items-center mb-3">
                <Inbox className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Lead Inbox
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                View and manage your incoming leads
              </p>
            </Link>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 opacity-50 cursor-not-allowed">
              <div className="flex items-center mb-3">
                <Settings className="h-6 w-6 text-gray-400 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Settings
                </h3>
              </div>
              <p className="text-sm text-gray-600">Coming soon</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 opacity-50 cursor-not-allowed">
              <div className="flex items-center mb-3">
                <CreditCard className="h-6 w-6 text-gray-400 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Billing
                </h3>
              </div>
              <p className="text-sm text-gray-600">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
