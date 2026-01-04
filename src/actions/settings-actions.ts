'use server';

import {
  createServerSupabaseClient,
  createAdminSupabaseClient,
} from '@/lib/supabase/server';
import { z } from 'zod';

type ActionResult = {
  success: boolean;
  message?: string;
};

/**
 * Update contractor profile information
 */
const profileSchema = z.object({
  company_name: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(10),
  business_description: z.string().optional(),
});

export async function updateProfile(
  data: z.infer<typeof profileSchema>
): Promise<ActionResult> {
  try {
    const result = profileSchema.safeParse(data);
    if (!result.success) {
      return { success: false, message: 'Invalid profile data' };
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
    const { data: contractor } = await supabase
      .from('contractors')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!contractor) {
      return { success: false, message: 'Contractor not found' };
    }

    // Update profile
    const adminSupabase = createAdminSupabaseClient();
    const { error } = await adminSupabase
      .from('contractors')
      .update({
        company_name: result.data.company_name,
        email: result.data.email,
        phone: result.data.phone,
        business_description: result.data.business_description,
      })
      .eq('id', contractor.id);

    if (error) {
      console.error('[SETTINGS] Update profile error:', error);
      return { success: false, message: 'Failed to update profile' };
    }

    return { success: true };
  } catch (error) {
    console.error('[SETTINGS] Update profile unexpected error:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}

/**
 * Update contractor service areas
 */
export async function updateServiceAreas(
  serviceAreas: string[]
): Promise<ActionResult> {
  try {
    if (!Array.isArray(serviceAreas) || serviceAreas.length === 0) {
      return {
        success: false,
        message: 'At least one service area is required',
      };
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
    const { data: contractor } = await supabase
      .from('contractors')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!contractor) {
      return { success: false, message: 'Contractor not found' };
    }

    // Update service areas
    const adminSupabase = createAdminSupabaseClient();
    const { error } = await adminSupabase
      .from('contractors')
      .update({
        service_areas: serviceAreas,
      })
      .eq('id', contractor.id);

    if (error) {
      console.error('[SETTINGS] Update service areas error:', error);
      return { success: false, message: 'Failed to update service areas' };
    }

    return { success: true };
  } catch (error) {
    console.error('[SETTINGS] Update service areas unexpected error:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}

/**
 * Update contractor services offered
 */
export async function updateServicesOffered(
  servicesOffered: string[]
): Promise<ActionResult> {
  try {
    if (!Array.isArray(servicesOffered) || servicesOffered.length === 0) {
      return { success: false, message: 'At least one service is required' };
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
    const { data: contractor } = await supabase
      .from('contractors')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!contractor) {
      return { success: false, message: 'Contractor not found' };
    }

    // Update services offered
    const adminSupabase = createAdminSupabaseClient();
    const { error } = await adminSupabase
      .from('contractors')
      .update({
        services_offered: servicesOffered,
      })
      .eq('id', contractor.id);

    if (error) {
      console.error('[SETTINGS] Update services offered error:', error);
      return { success: false, message: 'Failed to update services' };
    }

    return { success: true };
  } catch (error) {
    console.error(
      '[SETTINGS] Update services offered unexpected error:',
      error
    );
    return { success: false, message: 'An unexpected error occurred' };
  }
}

/**
 * Update contractor lead preferences
 */
const leadPreferencesSchema = z.object({
  max_lead_budget: z.number().min(0),
  preferred_urgencies: z.array(z.string()),
  preferred_property_types: z.array(z.string()),
  exclusive_only: z.boolean(),
});

export async function updateLeadPreferences(
  data: z.infer<typeof leadPreferencesSchema>
): Promise<ActionResult> {
  try {
    const result = leadPreferencesSchema.safeParse(data);
    if (!result.success) {
      return { success: false, message: 'Invalid preference data' };
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
    const { data: contractor } = await supabase
      .from('contractors')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!contractor) {
      return { success: false, message: 'Contractor not found' };
    }

    // Update preferences
    const adminSupabase = createAdminSupabaseClient();
    const { error } = await adminSupabase
      .from('contractors')
      .update({
        max_lead_budget: result.data.max_lead_budget,
        preferred_urgencies: result.data.preferred_urgencies,
        preferred_property_types: result.data.preferred_property_types,
        exclusive_only: result.data.exclusive_only,
      })
      .eq('id', contractor.id);

    if (error) {
      console.error('[SETTINGS] Update lead preferences error:', error);
      return { success: false, message: 'Failed to update preferences' };
    }

    return { success: true };
  } catch (error) {
    console.error(
      '[SETTINGS] Update lead preferences unexpected error:',
      error
    );
    return { success: false, message: 'An unexpected error occurred' };
  }
}

/**
 * Update contractor notification settings
 */
const notificationSettingsSchema = z.object({
  email_notifications: z.boolean(),
  sms_notifications: z.boolean(),
  notify_new_lead: z.boolean(),
  notify_lead_updates: z.boolean(),
  notify_messages: z.boolean(),
  notify_billing: z.boolean(),
});

export async function updateNotificationSettings(
  data: z.infer<typeof notificationSettingsSchema>
): Promise<ActionResult> {
  try {
    const result = notificationSettingsSchema.safeParse(data);
    if (!result.success) {
      return { success: false, message: 'Invalid notification settings' };
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
    const { data: contractor } = await supabase
      .from('contractors')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!contractor) {
      return { success: false, message: 'Contractor not found' };
    }

    // Update notification settings
    const adminSupabase = createAdminSupabaseClient();
    const { error } = await adminSupabase
      .from('contractors')
      .update({
        email_notifications: result.data.email_notifications,
        sms_notifications: result.data.sms_notifications,
        notify_new_lead: result.data.notify_new_lead,
        notify_lead_updates: result.data.notify_lead_updates,
        notify_messages: result.data.notify_messages,
        notify_billing: result.data.notify_billing,
      })
      .eq('id', contractor.id);

    if (error) {
      console.error('[SETTINGS] Update notification settings error:', error);
      return {
        success: false,
        message: 'Failed to update notification settings',
      };
    }

    return { success: true };
  } catch (error) {
    console.error(
      '[SETTINGS] Update notification settings unexpected error:',
      error
    );
    return { success: false, message: 'An unexpected error occurred' };
  }
}

/**
 * Pause lead delivery
 */
export async function pauseLeadDelivery(): Promise<ActionResult> {
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
    const { data: contractor } = await supabase
      .from('contractors')
      .select('id, status')
      .eq('user_id', user.id)
      .single();

    if (!contractor) {
      return { success: false, message: 'Contractor not found' };
    }

    if (contractor.status === 'paused') {
      return { success: false, message: 'Lead delivery is already paused' };
    }

    // Update status
    const adminSupabase = createAdminSupabaseClient();
    const { error } = await adminSupabase
      .from('contractors')
      .update({
        status: 'paused',
      })
      .eq('id', contractor.id);

    if (error) {
      console.error('[SETTINGS] Pause lead delivery error:', error);
      return { success: false, message: 'Failed to pause lead delivery' };
    }

    return { success: true };
  } catch (error) {
    console.error('[SETTINGS] Pause lead delivery unexpected error:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}

/**
 * Resume lead delivery
 */
export async function resumeLeadDelivery(): Promise<ActionResult> {
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
    const { data: contractor } = await supabase
      .from('contractors')
      .select('id, status')
      .eq('user_id', user.id)
      .single();

    if (!contractor) {
      return { success: false, message: 'Contractor not found' };
    }

    if (contractor.status === 'active') {
      return { success: false, message: 'Lead delivery is already active' };
    }

    // Update status
    const adminSupabase = createAdminSupabaseClient();
    const { error } = await adminSupabase
      .from('contractors')
      .update({
        status: 'active',
      })
      .eq('id', contractor.id);

    if (error) {
      console.error('[SETTINGS] Resume lead delivery error:', error);
      return { success: false, message: 'Failed to resume lead delivery' };
    }

    return { success: true };
  } catch (error) {
    console.error('[SETTINGS] Resume lead delivery unexpected error:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}
