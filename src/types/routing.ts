import { Database } from '@/lib/database.types';

export type Contractor = Database['public']['Tables']['contractors']['Row'];
export type LeadDelivery =
  Database['public']['Tables']['lead_deliveries']['Row'];
export type Lead = Database['public']['Tables']['leads']['Row'];

export interface LeadRoutingResult {
  success: boolean;
  matchedContractors: number;
  deliveryIds: string[];
  error?: string;
}
