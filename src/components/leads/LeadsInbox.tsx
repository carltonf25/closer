'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LeadCard } from './LeadCard';
import { LeadFilters } from './LeadFilters';
import { Loader2 } from 'lucide-react';

type Lead = {
  id: string;
  created_at: string;
  service_type: string;
  urgency: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  state: string;
  zip: string;
  property_type: string;
  description: string | null;
};

type LeadDelivery = {
  id: string;
  created_at: string;
  sent_at: string;
  viewed_at: string | null;
  responded_at: string | null;
  outcome: string;
  is_exclusive: boolean;
  price: number;
  quality_rating: number | null;
  lead: Lead | null;
};

type Filters = {
  status: string;
  service_type: string;
  date_range: string;
};

type Props = {
  contractorId: string;
};

export const LeadsInbox = ({ contractorId }: Props) => {
  const [leads, setLeads] = useState<LeadDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    service_type: 'all',
    date_range: 'all',
  });

  const supabase = createClient();

  const fetchLeads = async () => {
    setLoading(true);

    let query = supabase
      .from('lead_deliveries')
      .select(
        `
        id,
        created_at,
        sent_at,
        viewed_at,
        responded_at,
        outcome,
        is_exclusive,
        price,
        quality_rating,
        lead:leads (
          id,
          created_at,
          service_type,
          urgency,
          first_name,
          last_name,
          phone,
          email,
          address,
          city,
          state,
          zip,
          property_type,
          description
        )
      `
      )
      .eq('contractor_id', contractorId)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.status !== 'all') {
      query = query.eq('outcome', filters.status);
    }

    const { data, error } = (await query) as {
      data: LeadDelivery[] | null;
      error: any;
    };

    if (error) {
      console.error('Error fetching leads:', error);
      setLoading(false);
      return;
    }

    // Filter by service type (needs to be done client-side due to nested relation)
    let filteredData = data || [];
    if (filters.service_type !== 'all') {
      filteredData = filteredData.filter(
        ld => ld.lead?.service_type === filters.service_type
      );
    }

    // Filter by date range
    if (filters.date_range !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();

      switch (filters.date_range) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }

      filteredData = filteredData.filter(
        ld => new Date(ld.created_at) >= cutoffDate
      );
    }

    setLeads(filteredData as LeadDelivery[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractorId, filters]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('lead-deliveries')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lead_deliveries',
          filter: `contractor_id=eq.${contractorId}`,
        },
        () => {
          // Refetch leads when changes occur
          fetchLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractorId]);

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.outcome === 'pending').length,
    viewed: leads.filter(l => l.outcome === 'viewed').length,
    accepted: leads.filter(l => l.outcome === 'accepted').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Total Leads</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">New</div>
          <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Viewed</div>
          <div className="text-2xl font-bold text-yellow-600">
            {stats.viewed}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Accepted</div>
          <div className="text-2xl font-bold text-green-600">
            {stats.accepted}
          </div>
        </div>
      </div>

      {/* Filters */}
      <LeadFilters filters={filters} onFilterChange={setFilters} />

      {/* Lead List */}
      <div className="space-y-4">
        {leads.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No leads found</p>
            <p className="text-sm text-gray-500 mt-2">
              {filters.status !== 'all' ||
              filters.service_type !== 'all' ||
              filters.date_range !== 'all'
                ? 'Try adjusting your filters'
                : 'New leads will appear here'}
            </p>
          </div>
        ) : (
          leads.map(delivery => (
            <LeadCard
              key={delivery.id}
              delivery={delivery}
              onUpdate={fetchLeads}
            />
          ))
        )}
      </div>
    </div>
  );
};
