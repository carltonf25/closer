'use server';

import {
  createServerSupabaseClient,
  createAdminSupabaseClient,
} from '@/lib/supabase/server';
import { z } from 'zod';

const onboardingSchema = z.object({
  pricing_tier: z.enum(['starter', 'pro', 'elite']),
  notification_email: z.string().email(),
  notification_phone: z.string().regex(/^\d{10}$/, 'Must be 10 digits'),
  payment_method_id: z.string().optional(),
});

type OnboardingResult = {
  success: boolean;
  message?: string;
};

export async function completeOnboarding(
  data: z.infer<typeof onboardingSchema>
): Promise<OnboardingResult> {
  try {
    // Validate input
    const result = onboardingSchema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        message: 'Invalid onboarding data',
      };
    }

    const supabase = createServerSupabaseClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: 'Not authenticated',
      };
    }

    // Get contractor record
    const { data: contractor, error: fetchError } = await supabase
      .from('contractors')
      .select('id, onboarding_completed')
      .eq('user_id', user.id)
      .single<{ id: string; onboarding_completed: boolean }>();

    if (fetchError || !contractor) {
      return {
        success: false,
        message: 'Contractor profile not found',
      };
    }

    // Don't allow re-onboarding
    if (contractor.onboarding_completed) {
      return {
        success: false,
        message: 'Onboarding already completed',
      };
    }

    // Update contractor with onboarding data using admin client
    const adminSupabase = createAdminSupabaseClient();
    const { error: updateError } = await adminSupabase
      .from('contractors')
      .update({
        pricing_tier: result.data.pricing_tier,
        notification_email: result.data.notification_email,
        notification_phone: result.data.notification_phone,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq('id', contractor.id);

    if (updateError) {
      console.error('[ONBOARDING] Update failed:', updateError);
      return {
        success: false,
        message: 'Failed to save onboarding data',
      };
    }

    // TODO: If payment_method_id is provided and tier is pro/elite,
    // create Stripe subscription (Phase 4)

    return {
      success: true,
    };
  } catch (error) {
    console.error('[ONBOARDING] Unexpected error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}
