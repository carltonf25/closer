'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { signOut } from '@/actions/auth';
import { Loader2 } from 'lucide-react';

export default function ContractorDashboard() {
  const { contractor, loading } = useAuth();

  if (loading) {
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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Coming Soon
            </h2>
            <p className="text-blue-700 text-sm">
              Your lead inbox, settings, and billing will be available here
              soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
