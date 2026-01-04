'use server';

import {
  createServerSupabaseClient,
  createAdminSupabaseClient,
} from '@/lib/supabase/server';
import { processLeadRefund } from '@/services/billing';
import { z } from 'zod';

type ActionResult = {
  success: boolean;
  message?: string;
};

export async function getBadLeadReports() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const adminSupabase = createAdminSupabaseClient();
  const { data: reports, error } = await adminSupabase
    .from('lead_deliveries')
    .select(
      `
      id,
      created_at,
      billed,
      billed_at,
      price,
      feedback,
      outcome,
      contractors (
        id,
        company_name,
        email
      ),
      leads (
        id,
        service_type,
        urgency,
        city,
        state
      )
    `
    )
    .not('feedback', 'is', null)
    .eq('billed', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[ADMIN_ACTIONS] Failed to fetch reports:', error);
    throw error;
  }

  return reports;
}

const approveRefundSchema = z.object({
  deliveryId: z.string().uuid(),
  reason: z.string().min(1),
  adminNotes: z.string().optional(),
});

export async function approveRefund(
  data: z.infer<typeof approveRefundSchema>
): Promise<ActionResult> {
  try {
    const result = approveRefundSchema.safeParse(data);
    if (!result.success) {
      return { success: false, message: 'Invalid refund data' };
    }

    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: 'Not authenticated' };
    }

    const refundResult = await processLeadRefund(
      result.data.deliveryId,
      result.data.reason
    );

    if (!refundResult.success) {
      return { success: false, message: refundResult.message || 'Refund failed' };
    }

    if (result.data.adminNotes) {
      const adminSupabase = createAdminSupabaseClient();
      const { data: delivery } = await adminSupabase
        .from('lead_deliveries')
        .select('feedback')
        .eq('id', result.data.deliveryId)
        .single();

      await adminSupabase
        .from('lead_deliveries')
        .update({
          feedback: `${delivery?.feedback || ''}\n[ADMIN: ${result.data.adminNotes}]`,
        })
        .eq('id', result.data.deliveryId);
    }

    console.log('[ADMIN_ACTIONS] Refund approved:', result.data.deliveryId);
    return { success: true, message: 'Refund processed successfully' };
  } catch (error) {
    console.error('[ADMIN_ACTIONS] Approve refund error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to process refund',
    };
  }
}

const rejectRefundSchema = z.object({
  deliveryId: z.string().uuid(),
  reason: z.string().min(1),
});

export async function rejectRefund(
  data: z.infer<typeof rejectRefundSchema>
): Promise<ActionResult> {
  try {
    const result = rejectRefundSchema.safeParse(data);
    if (!result.success) {
      return { success: false, message: 'Invalid data' };
    }

    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: 'Not authenticated' };
    }

    const adminSupabase = createAdminSupabaseClient();
    const { data: delivery } = await adminSupabase
      .from('lead_deliveries')
      .select('feedback')
      .eq('id', result.data.deliveryId)
      .single();

    await adminSupabase
      .from('lead_deliveries')
      .update({
        feedback: `${delivery?.feedback || ''}\n[REJECTED: ${result.data.reason}]`,
      })
      .eq('id', result.data.deliveryId);

    console.log('[ADMIN_ACTIONS] Refund rejected:', result.data.deliveryId);
    return { success: true, message: 'Refund request rejected' };
  } catch (error) {
    console.error('[ADMIN_ACTIONS] Reject refund error:', error);
    return { success: false, message: 'Failed to reject refund' };
  }
}
