'use server';

import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { leadFormSchema, LeadFormData } from '@/lib/validations';

export type ActionState = {
  success: boolean;
  message: string;
  data?: { lead_id: string };
  errors?: Record<string, string[]>;
};

export async function submitLead(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  // Honeypot spam check
  const honeypot = formData.get('website');
  if (honeypot) {
    // Silently reject spam submissions
    return {
      success: false,
      message: 'Submission failed. Please try again.',
    };
  }

  // Parse form data
  const rawData = {
    service_type: formData.get('service_type'),
    urgency: formData.get('urgency'),
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    phone: formData.get('phone'),
    email: formData.get('email') || undefined,
    address: formData.get('address'),
    city: formData.get('city'),
    state: formData.get('state') || 'GA',
    zip: formData.get('zip'),
    property_type: formData.get('property_type') || 'residential',
    description: formData.get('description') || undefined,
    source: formData.get('source') || 'seo',
    source_url: formData.get('source_url') || undefined,
    utm_source: formData.get('utm_source') || undefined,
    utm_medium: formData.get('utm_medium') || undefined,
    utm_campaign: formData.get('utm_campaign') || undefined,
  };

  // Validate
  const result = leadFormSchema.safeParse(rawData);

  if (!result.success) {
    const errors: Record<string, string[]> = {};
    result.error.issues.forEach(issue => {
      const path = issue.path.join('.');
      if (!errors[path]) errors[path] = [];
      errors[path].push(issue.message);
    });

    return {
      success: false,
      message: 'Please fix the errors below',
      errors,
    };
  }

  const { data } = result;

  // Clean phone number
  const cleanPhone = data.phone.replace(/\D/g, '');

  try {
    const supabase = createAdminSupabaseClient();

    // Insert lead
    const insertResult = await (supabase.from('leads') as any)
      .insert({
        service_type: data.service_type,
        urgency: data.urgency,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: cleanPhone,
        email: data.email || null,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        property_type: data.property_type,
        description: data.description || null,
        source: data.source,
        source_url: data.source_url || null,
        utm_source: data.utm_source || null,
        utm_medium: data.utm_medium || null,
        utm_campaign: data.utm_campaign || null,
        status: 'new',
        phone_verified: false,
      })
      .select('id')
      .single();

    if (insertResult.error) {
      console.error('Lead insert error:', insertResult.error);
      return {
        success: false,
        message: 'Something went wrong. Please try again.',
      };
    }

    const lead = insertResult.data as { id: string };

    // TODO: Trigger lead matching and notification
    // This would call a function to find matching contractors
    // and send them SMS/email notifications

    return {
      success: true,
      message: 'Thank you! A local professional will contact you shortly.',
      data: { lead_id: lead.id },
    };
  } catch (error) {
    console.error('Lead submission error:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}

// Quick lead form (minimal fields for high conversion)
export async function submitQuickLead(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  // Honeypot spam check
  const honeypot = formData.get('website');
  if (honeypot) {
    // Silently reject spam submissions
    return {
      success: false,
      message: 'Submission failed. Please try again.',
    };
  }

  const rawData = {
    service_type: formData.get('service_type'),
    urgency: 'this_week', // Default urgency for quick form
    first_name: formData.get('name')?.toString().split(' ')[0] || '',
    last_name:
      formData.get('name')?.toString().split(' ').slice(1).join(' ') || '',
    phone: formData.get('phone'),
    email: formData.get('email') || undefined,
    address: '', // Will need to collect later
    city: formData.get('city') || '',
    state: 'GA',
    zip: formData.get('zip') || '',
    property_type: 'residential',
    source: formData.get('source') || 'seo',
    source_url: formData.get('source_url') || undefined,
  };

  // Minimal validation for quick form
  if (
    !rawData.phone ||
    rawData.phone.toString().replace(/\D/g, '').length < 10
  ) {
    return {
      success: false,
      message: 'Please enter a valid phone number',
      errors: { phone: ['Please enter a valid phone number'] },
    };
  }

  if (!rawData.service_type) {
    return {
      success: false,
      message: 'Please select a service',
      errors: { service_type: ['Please select a service'] },
    };
  }

  try {
    const supabase = createAdminSupabaseClient();

    const insertResult = await (supabase.from('leads') as any)
      .insert({
        service_type: rawData.service_type as LeadFormData['service_type'],
        urgency: 'this_week',
        first_name: rawData.first_name,
        last_name: rawData.last_name,
        phone: rawData.phone.toString().replace(/\D/g, ''),
        email: rawData.email?.toString() || null,
        address: rawData.address,
        city: rawData.city,
        state: rawData.state,
        zip: rawData.zip,
        property_type: 'residential',
        source: rawData.source as LeadFormData['source'],
        source_url: rawData.source_url?.toString() || null,
        status: 'new',
        phone_verified: false,
      })
      .select('id')
      .single();

    if (insertResult.error) {
      console.error('Quick lead insert error:', insertResult.error);
      return {
        success: false,
        message: 'Something went wrong. Please try again.',
      };
    }

    const lead = insertResult.data as { id: string };

    return {
      success: true,
      message: "We'll call you shortly!",
      data: { lead_id: lead.id },
    };
  } catch (error) {
    console.error('Quick lead submission error:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}
