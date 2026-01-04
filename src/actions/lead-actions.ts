'use server';

import {
  createServerSupabaseClient,
  createAdminSupabaseClient,
} from '@/lib/supabase/server';
import { z } from 'zod';
import type { Database } from '@/lib/database.types';
import { chargeForLead } from '@/services/billing';

type ActionResult = {
  success: boolean;
  message?: string;
};

/**
 * Accept a lead
 * Updates delivery status to 'accepted' and marks viewed/responded timestamps
 */
export async function acceptLead(deliveryId: string): Promise<ActionResult> {
  try {
    const supabase = createServerSupabaseClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: 'Not authenticated' };
    }

    // Get contractor
    const { data: contractor } = (await supabase
      .from('contractors')
      .select('id')
      .eq('user_id', user.id)
      .single()) as {
      data: { id: string } | null;
      error: any;
    };

    if (!contractor) {
      return { success: false, message: 'Contractor not found' };
    }

    // Verify this delivery belongs to this contractor
    const { data: delivery, error: deliveryError } = (await supabase
      .from('lead_deliveries')
      .select('id, contractor_id, outcome')
      .eq('id', deliveryId)
      .single()) as {
      data: { id: string; contractor_id: string; outcome: string } | null;
      error: any;
    };

    if (deliveryError || !delivery) {
      return { success: false, message: 'Lead not found' };
    }

    if (delivery.contractor_id !== contractor.id) {
      return { success: false, message: 'Lead not found' };
    }

    if (delivery.outcome !== 'pending' && delivery.outcome !== 'viewed') {
      return {
        success: false,
        message: 'Lead has already been accepted or rejected',
      };
    }

    // Update delivery status
    const adminSupabase = createAdminSupabaseClient();
    const now = new Date().toISOString();

    const { error } = await adminSupabase
      .from('lead_deliveries')
      .update({
        outcome: 'accepted',
        viewed_at: delivery.outcome === 'pending' ? now : undefined,
        responded_at: now,
      })
      .eq('id', deliveryId);

    if (error) {
      console.error('[LEAD_ACTIONS] Accept lead error:', error);
      return { success: false, message: 'Failed to accept lead' };
    }

    // Trigger billing for accepted lead
    const billingResult = await chargeForLead(deliveryId);
    if (!billingResult.success) {
      console.error('[LEAD_ACTIONS] Billing failed:', billingResult.message);

      // Revert acceptance if billing fails
      await adminSupabase
        .from('lead_deliveries')
        .update({
          outcome: 'pending',
          responded_at: null,
        })
        .eq('id', deliveryId);

      return {
        success: false,
        message: `Payment failed: ${billingResult.message}. Please update your payment method.`,
      };
    }

    console.log('[LEAD_ACTIONS] Lead accepted and billed:', deliveryId);

    // TODO: Send confirmation email to homeowner (Phase 2.1 enhancement)

    return { success: true };
  } catch (error) {
    console.error('[LEAD_ACTIONS] Accept lead unexpected error:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}

/**
 * Reject a lead
 * Updates delivery status to 'rejected' with optional reason
 */
export async function rejectLead(
  deliveryId: string,
  reason?: string
): Promise<ActionResult> {
  try {
    const supabase = createServerSupabaseClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: 'Not authenticated' };
    }

    // Get contractor
    const { data: contractor } = (await supabase
      .from('contractors')
      .select('id')
      .eq('user_id', user.id)
      .single()) as {
      data: { id: string } | null;
      error: any;
    };

    if (!contractor) {
      return { success: false, message: 'Contractor not found' };
    }

    // Verify this delivery belongs to this contractor
    const { data: delivery, error: deliveryError } = (await supabase
      .from('lead_deliveries')
      .select('id, contractor_id, outcome')
      .eq('id', deliveryId)
      .single()) as {
      data: { id: string; contractor_id: string; outcome: string } | null;
      error: any;
    };

    if (deliveryError || !delivery) {
      return { success: false, message: 'Lead not found' };
    }

    if (delivery.contractor_id !== contractor.id) {
      return { success: false, message: 'Lead not found' };
    }

    if (delivery.outcome !== 'pending' && delivery.outcome !== 'viewed') {
      return {
        success: false,
        message: 'Lead has already been accepted or rejected',
      };
    }

    // Update delivery status
    const adminSupabase = createAdminSupabaseClient();
    const now = new Date().toISOString();

    const { error } = await adminSupabase
      .from('lead_deliveries')
      .update({
        outcome: 'rejected',
        viewed_at: delivery.outcome === 'pending' ? now : undefined,
        responded_at: now,
        feedback: reason || null,
      })
      .eq('id', deliveryId);

    if (error) {
      console.error('[LEAD_ACTIONS] Reject lead error:', error);
      return { success: false, message: 'Failed to reject lead' };
    }

    // TODO: Re-route to another contractor if shared lead

    return { success: true };
  } catch (error) {
    console.error('[LEAD_ACTIONS] Reject lead unexpected error:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}

/**
 * Mark a lead as contacted
 * Updates the responded_at timestamp
 */
export async function markAsContacted(
  deliveryId: string
): Promise<ActionResult> {
  try {
    const supabase = createServerSupabaseClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: 'Not authenticated' };
    }

    // Get contractor
    const { data: contractor } = (await supabase
      .from('contractors')
      .select('id')
      .eq('user_id', user.id)
      .single()) as {
      data: { id: string } | null;
      error: any;
    };

    if (!contractor) {
      return { success: false, message: 'Contractor not found' };
    }

    // Verify this delivery belongs to this contractor
    const { data: delivery } = await supabase
      .from('lead_deliveries')
      .select('id, contractor_id, outcome')
      .eq('id', deliveryId)
      .single();

    if (!delivery) {
      return { success: false, message: 'Lead not found' };
    }

    if (delivery.contractor_id !== contractor.id) {
      return { success: false, message: 'Lead not found' };
    }

    if (delivery.outcome !== 'accepted') {
      return {
        success: false,
        message: 'Can only mark accepted leads as contacted',
      };
    }

    // Update responded_at timestamp
    const adminSupabase = createAdminSupabaseClient();
    const now = new Date().toISOString();

    const { error } = await adminSupabase
      .from('lead_deliveries')
      .update({
        responded_at: now,
      })
      .eq('id', deliveryId);

    if (error) {
      console.error('[LEAD_ACTIONS] Mark contacted error:', error);
      return { success: false, message: 'Failed to update lead' };
    }

    return { success: true };
  } catch (error) {
    console.error('[LEAD_ACTIONS] Mark contacted unexpected error:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}

const reportBadLeadSchema = z.object({
  deliveryId: z.string().uuid(),
  reason: z.enum([
    'invalid_contact',
    'wrong_service',
    'wrong_area',
    'duplicate',
    'spam',
    'other',
  ]),
  details: z.string().optional(),
});

/**
 * Report a bad lead
 * Flags the lead for review and potential credit
 */
export async function reportBadLead(
  data: z.infer<typeof reportBadLeadSchema>
): Promise<ActionResult> {
  try {
    const result = reportBadLeadSchema.safeParse(data);
    if (!result.success) {
      return { success: false, message: 'Invalid report data' };
    }

    const supabase = createServerSupabaseClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: 'Not authenticated' };
    }

    // Get contractor
    const { data: contractor } = (await supabase
      .from('contractors')
      .select('id')
      .eq('user_id', user.id)
      .single()) as {
      data: { id: string } | null;
      error: any;
    };

    if (!contractor) {
      return { success: false, message: 'Contractor not found' };
    }

    // Verify this delivery belongs to this contractor
    const { data: delivery, error: deliveryError } = (await supabase
      .from('lead_deliveries')
      .select('id, contractor_id')
      .eq('id', result.data.deliveryId)
      .single()) as {
      data: { id: string; contractor_id: string } | null;
      error: any;
    };

    if (deliveryError || !delivery) {
      return { success: false, message: 'Lead not found' };
    }

    if (delivery.contractor_id !== contractor.id) {
      return { success: false, message: 'Lead not found' };
    }

    // Update delivery with feedback
    const adminSupabase = createAdminSupabaseClient();
    const feedbackText = `Bad lead report: ${result.data.reason}${result.data.details ? ` - ${result.data.details}` : ''}`;

    const { error } = await adminSupabase
      .from('lead_deliveries')
      .update({
        feedback: feedbackText,
      })
      .eq('id', result.data.deliveryId);

    if (error) {
      console.error('[LEAD_ACTIONS] Report bad lead error:', error);
      return { success: false, message: 'Failed to report lead' };
    }

    // TODO: Flag for admin review
    // TODO: Auto-approve refund based on reason

    return {
      success: true,
      message:
        'Lead reported. Our team will review and issue a credit if applicable.',
    };
  } catch (error) {
    console.error('[LEAD_ACTIONS] Report bad lead unexpected error:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}

const rateLeadSchema = z.object({
  deliveryId: z.string().uuid(),
  rating: z.number().min(1).max(5),
});

/**
 * Rate a lead quality
 * Adds a 1-5 star rating to the lead delivery
 */
export async function rateLead(
  data: z.infer<typeof rateLeadSchema>
): Promise<ActionResult> {
  try {
    const result = rateLeadSchema.safeParse(data);
    if (!result.success) {
      return { success: false, message: 'Invalid rating data' };
    }

    const supabase = createServerSupabaseClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: 'Not authenticated' };
    }

    // Get contractor
    const { data: contractor } = (await supabase
      .from('contractors')
      .select('id')
      .eq('user_id', user.id)
      .single()) as {
      data: { id: string } | null;
      error: any;
    };

    if (!contractor) {
      return { success: false, message: 'Contractor not found' };
    }

    // Verify this delivery belongs to this contractor
    const { data: delivery, error: deliveryError } = (await supabase
      .from('lead_deliveries')
      .select('id, contractor_id')
      .eq('id', result.data.deliveryId)
      .single()) as {
      data: { id: string; contractor_id: string } | null;
      error: any;
    };

    if (deliveryError || !delivery) {
      return { success: false, message: 'Lead not found' };
    }

    if (delivery.contractor_id !== contractor.id) {
      return { success: false, message: 'Lead not found' };
    }

    // Update rating
    const adminSupabase = createAdminSupabaseClient();

    const { error } = await adminSupabase
      .from('lead_deliveries')
      .update({
        quality_rating: result.data.rating,
      })
      .eq('id', result.data.deliveryId);

    if (error) {
      console.error('[LEAD_ACTIONS] Rate lead error:', error);
      return { success: false, message: 'Failed to rate lead' };
    }

    return { success: true, message: 'Rating saved' };
  } catch (error) {
    console.error('[LEAD_ACTIONS] Rate lead unexpected error:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}
