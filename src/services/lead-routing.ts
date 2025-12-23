'use server';

import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { Database } from '@/lib/database.types';
import { BASE_LEAD_PRICES, URGENCY_OPTIONS } from '@/config/services';
import { LeadRoutingResult } from '@/types/routing';

type ServiceType = Database['public']['Enums']['service_type'];
type LeadUrgency = Database['public']['Enums']['lead_urgency'];

/**
 * Gets the price for a lead based on service type, urgency, and exclusivity.
 * Queries lead_prices table first, falls back to config if not found.
 *
 * @param serviceType - The type of service
 * @param urgency - The urgency level
 * @param isExclusive - Whether the lead is exclusive
 * @returns The calculated price as a number
 */
async function getLeadPrice(
  serviceType: ServiceType,
  urgency: LeadUrgency,
  isExclusive: boolean
): Promise<number> {
  const supabase = createAdminSupabaseClient();

  // Query lead_prices table
  const { data, error } = await supabase
    .from('lead_prices')
    .select('base_price')
    .eq('service_type', serviceType)
    .eq('urgency', urgency)
    .eq('is_exclusive', isExclusive)
    .is('state', null) // Default pricing (no state-specific)
    .is('metro_area', null) // Default pricing (no metro-specific)
    .maybeSingle();

  if (error) {
    console.warn('Failed to get price from DB, using fallback:', error);
  }

  if (data && data.base_price) {
    return Number(data.base_price);
  }

  // Fallback to config if DB lookup fails or no data
  console.warn(
    `Using fallback pricing for ${serviceType} / ${urgency} / ${isExclusive ? 'exclusive' : 'shared'}`
  );

  const configPrice = BASE_LEAD_PRICES[serviceType];
  const basePrice = isExclusive ? configPrice.exclusive : configPrice.shared;
  const urgencyMultiplier = URGENCY_OPTIONS[urgency].leadMultiplier;

  return basePrice * urgencyMultiplier;
}

/**
 * Routes a lead to all matching contractors.
 * Creates lead_deliveries records and updates lead status to 'sent'.
 *
 * @param leadId - The UUID of the lead to route
 * @returns LeadRoutingResult with success status, matched count, and delivery IDs
 */
export async function routeLeadToContractors(
  leadId: string
): Promise<LeadRoutingResult> {
  const supabase = createAdminSupabaseClient();

  try {
    // Step 1: Call existing DB function to get matching contractors
    const { data: contractors, error: matchError } = await supabase.rpc(
      'match_contractors_for_lead',
      { p_lead_id: leadId }
    );

    if (matchError) {
      console.error('Error matching contractors:', matchError);
      return {
        success: false,
        matchedContractors: 0,
        deliveryIds: [],
        error: matchError.message,
      };
    }

    // Step 2: Handle no matches
    if (!contractors || contractors.length === 0) {
      console.log(`No matching contractors found for lead ${leadId}`);
      return {
        success: true,
        matchedContractors: 0,
        deliveryIds: [],
        error: 'No matching contractors found',
      };
    }

    // Step 3: Get lead details to determine pricing
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('service_type, urgency')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      console.error('Error fetching lead:', leadError);
      return {
        success: false,
        matchedContractors: 0,
        deliveryIds: [],
        error: 'Lead not found',
      };
    }

    // Step 4: Get pricing (shared lead, not exclusive)
    const price = await getLeadPrice(
      lead.service_type,
      lead.urgency,
      false // is_exclusive = false for broadcast
    );

    // Step 5: Create lead_deliveries records for ALL matched contractors
    const deliveries = contractors.map(contractor => ({
      lead_id: leadId,
      contractor_id: contractor.id,
      outcome: 'pending' as const,
      price,
      is_exclusive: false,
      sent_at: new Date().toISOString(),
    }));

    const { data: createdDeliveries, error: deliveryError } = await supabase
      .from('lead_deliveries')
      .insert(deliveries)
      .select('id');

    if (deliveryError) {
      console.error('Error creating lead deliveries:', deliveryError);
      return {
        success: false,
        matchedContractors: contractors.length,
        deliveryIds: [],
        error: deliveryError.message,
      };
    }

    // Step 6: Update lead status to 'sent'
    const { error: updateError } = await supabase
      .from('leads')
      .update({ status: 'sent' })
      .eq('id', leadId);

    if (updateError) {
      console.error('Error updating lead status:', updateError);
      // Don't fail the routing if status update fails, deliveries are created
    }

    console.log(
      `Lead ${leadId} routed to ${contractors.length} contractors successfully`
    );

    return {
      success: true,
      matchedContractors: contractors.length,
      deliveryIds: createdDeliveries?.map(d => d.id) || [],
    };
  } catch (error) {
    console.error('Unexpected error in lead routing:', error);
    return {
      success: false,
      matchedContractors: 0,
      deliveryIds: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
