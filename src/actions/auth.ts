'use server';

import {
  createServerSupabaseClient,
  createAdminSupabaseClient,
} from '@/lib/supabase/server';
import { contractorSignupSchema } from '@/lib/validations';
import { redirect } from 'next/navigation';

export type AuthActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: Record<string, unknown>;
};

/**
 * Signup a new contractor
 * Creates both auth user and contractor record atomically
 */
export async function signupContractor(
  prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  // Honeypot spam check
  const honeypot = formData.get('website');
  if (honeypot) {
    return { success: false, message: 'Invalid submission' };
  }

  // Parse form data
  const rawData = {
    company_name: formData.get('company_name'),
    contact_name: formData.get('contact_name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    city: formData.get('city'),
    state: formData.get('state') || 'GA',
    zip: formData.get('zip'),
    services: formData.getAll('services'),
    service_zips: formData.getAll('service_zips').filter(z => z !== ''),
    license_number: formData.get('license_number') || undefined,
    password: formData.get('password'),
  };

  // Validate
  const result = contractorSignupSchema.safeParse(rawData);
  if (!result.success) {
    const errors: Record<string, string[]> = {};
    result.error.issues.forEach(issue => {
      const path = issue.path.join('.');
      if (!errors[path]) errors[path] = [];
      errors[path].push(issue.message);
    });
    return { success: false, message: 'Please fix the errors', errors };
  }

  const { data } = result;

  try {
    const supabase = createServerSupabaseClient();
    const adminSupabase = createAdminSupabaseClient();

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/contractor/verify-email`,
        data: {
          company_name: data.company_name,
          contact_name: data.contact_name,
        },
      },
    });

    if (authError || !authData.user) {
      console.error('[AUTH] Signup error:', authError);

      if (authError?.message.includes('already registered')) {
        return {
          success: false,
          message: 'This email is already registered',
          errors: { email: ['Email already in use'] },
        };
      }

      return { success: false, message: 'Account creation failed' };
    }

    // Create contractor record
    const { error: dbError } = await adminSupabase.from('contractors').insert({
      user_id: authData.user.id,
      company_name: data.company_name,
      contact_name: data.contact_name,
      email: data.email,
      phone: data.phone.replace(/\D/g, ''),
      city: data.city,
      state: data.state,
      zip: data.zip,
      services: data.services,
      service_zips: data.service_zips,
      license_number: data.license_number || null,
      status: 'active', // Start as active per requirements
      billing_type: 'per_lead',
      max_leads_per_day: 10,
    });

    if (dbError) {
      // Rollback: Delete auth user
      await adminSupabase.auth.admin.deleteUser(authData.user.id);
      console.error('[AUTH] Contractor creation failed:', dbError);
      return { success: false, message: 'Account setup failed' };
    }

    return {
      success: true,
      message:
        'Account created! Please check your email to verify your account.',
    };
  } catch (error) {
    console.error('[AUTH] Unexpected signup error:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}

/**
 * Login a contractor
 * Verifies email confirmation and contractor record exists
 */
export async function loginContractor(
  prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { success: false, message: 'Email and password required' };
  }

  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      console.error('[AUTH] Login error:', error);
      return { success: false, message: 'Invalid email or password' };
    }

    // Check email verification
    if (!data.user.email_confirmed_at) {
      return {
        success: false,
        message: 'Please verify your email before logging in',
        data: { needsVerification: true },
      };
    }

    // Verify contractor exists
    const { data: contractor, error: contractorError } = await supabase
      .from('contractors')
      .select('status')
      .eq('user_id', data.user.id)
      .single();

    if (contractorError || !contractor) {
      console.error('[AUTH] Contractor lookup failed:', contractorError);
      return { success: false, message: 'Account setup incomplete' };
    }

    // Check status
    if (contractor.status === 'churned') {
      return {
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      };
    }

    // Success - redirect
    const redirectTo =
      formData.get('redirect')?.toString() || '/contractor/dashboard';
    redirect(redirectTo);
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error; // Allow redirect to work
    }
    console.error('[AUTH] Unexpected login error:', error);
    return { success: false, message: 'Login failed' };
  }
}

/**
 * Request a password reset email
 * Always returns success for security (don't reveal if email exists)
 */
export async function requestPasswordReset(
  prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  const email = formData.get('email')?.toString();

  if (!email) {
    return { success: false, message: 'Email is required' };
  }

  try {
    const supabase = createServerSupabaseClient();

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/contractor/update-password`,
    });

    // Always return success (security - don't reveal if email exists)
    return {
      success: true,
      message: 'If an account exists, you will receive a password reset email.',
    };
  } catch (error) {
    console.error('[AUTH] Password reset error:', error);
    return {
      success: true,
      message: 'If an account exists, you will receive a password reset email.',
    };
  }
}

/**
 * Update password after reset
 */
export async function updatePassword(
  prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  const password = formData.get('password')?.toString();

  if (!password || password.length < 8) {
    return {
      success: false,
      message: 'Password must be at least 8 characters',
      errors: { password: ['Password too short'] },
    };
  }

  try {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error('[AUTH] Password update error:', error);
      return { success: false, message: 'Password update failed' };
    }

    redirect('/contractor/dashboard');
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    console.error('[AUTH] Unexpected password update error:', error);
    return { success: false, message: 'Password update failed' };
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect('/contractor/login');
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(): Promise<AuthActionState> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Not authenticated' };
  }

  if (user.email_confirmed_at) {
    return { success: true, message: 'Email already verified' };
  }

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: user.email!,
  });

  if (error) {
    console.error('[AUTH] Resend verification error:', error);
    return { success: false, message: 'Failed to send verification email' };
  }

  return { success: true, message: 'Verification email sent!' };
}
