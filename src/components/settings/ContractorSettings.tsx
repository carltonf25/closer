'use client';

import { useState } from 'react';
import { Database } from '@/lib/database.types';
import { ProfileSettings } from './ProfileSettings';
import { ServiceAreaSettings } from './ServiceAreaSettings';
import { ServicesOfferedSettings } from './ServicesOfferedSettings';
import { LeadPreferencesSettings } from './LeadPreferencesSettings';
import { NotificationSettings } from './NotificationSettings';

type Contractor = Database['public']['Tables']['contractors']['Row'];

type Props = {
  contractor: Contractor;
};

type Tab =
  | 'profile'
  | 'service-areas'
  | 'services'
  | 'lead-preferences'
  | 'notifications';

const tabs: { id: Tab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'service-areas', label: 'Service Areas' },
  { id: 'services', label: 'Services' },
  { id: 'lead-preferences', label: 'Lead Preferences' },
  { id: 'notifications', label: 'Notifications' },
];

export const ContractorSettings = ({ contractor }: Props) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [contractorData, setContractorData] = useState(contractor);

  const handleUpdate = (updatedData: Partial<Contractor>) => {
    setContractorData(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'profile' && (
          <ProfileSettings
            contractor={contractorData}
            onUpdate={handleUpdate}
          />
        )}
        {activeTab === 'service-areas' && (
          <ServiceAreaSettings
            contractor={contractorData}
            onUpdate={handleUpdate}
          />
        )}
        {activeTab === 'services' && (
          <ServicesOfferedSettings
            contractor={contractorData}
            onUpdate={handleUpdate}
          />
        )}
        {activeTab === 'lead-preferences' && (
          <LeadPreferencesSettings
            contractor={contractorData}
            onUpdate={handleUpdate}
          />
        )}
        {activeTab === 'notifications' && (
          <NotificationSettings
            contractor={contractorData}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  );
};
