import { z } from 'zod';

// Phone number regex - accepts various formats
const phoneRegex = /^[\d\s\-()+]{10,}$/;

export const leadFormSchema = z.object({
  service_type: z.enum(
    [
      'hvac_repair',
      'hvac_install',
      'hvac_maintenance',
      'plumbing_emergency',
      'plumbing_repair',
      'plumbing_install',
      'water_heater',
    ],
    {
      required_error: 'Please select a service',
    }
  ),

  urgency: z.enum(['emergency', 'today', 'this_week', 'flexible'], {
    required_error: 'Please select when you need service',
  }),

  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long'),

  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long'),

  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .regex(phoneRegex, 'Please enter a valid phone number'),

  email: z
    .string()
    .email('Please enter a valid email')
    .optional()
    .or(z.literal('')),

  address: z
    .string()
    .min(5, 'Please enter your street address')
    .max(200, 'Address is too long')
    .optional()
    .or(z.literal('')),

  city: z
    .string()
    .min(2, 'City is required')
    .max(100, 'City name is too long')
    .optional()
    .or(z.literal('')),

  state: z.string().length(2, 'Please use 2-letter state code').default('GA'),

  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),

  property_type: z.enum(['residential', 'commercial']).default('residential'),

  description: z.string().max(1000, 'Description is too long').optional(),

  // Hidden fields for tracking
  source: z
    .enum(['seo', 'ppc', 'facebook', 'referral', 'direct'])
    .default('seo'),
  source_url: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

// Contractor signup schema
export const contractorSignupSchema = z.object({
  company_name: z
    .string()
    .min(2, 'Company name is required')
    .max(200, 'Company name is too long'),

  contact_name: z
    .string()
    .min(2, 'Contact name is required')
    .max(100, 'Contact name is too long'),

  email: z.string().email('Please enter a valid email'),

  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .regex(phoneRegex, 'Please enter a valid phone number'),

  city: z.string().min(2, 'City is required'),
  state: z.string().length(2, 'Please use 2-letter state code').default('GA'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),

  services: z
    .array(
      z.enum([
        'hvac_repair',
        'hvac_install',
        'hvac_maintenance',
        'plumbing_emergency',
        'plumbing_repair',
        'plumbing_install',
        'water_heater',
      ])
    )
    .min(1, 'Please select at least one service'),

  service_zips: z
    .array(z.string())
    .min(1, 'Please enter at least one ZIP code you serve'),

  license_number: z.string().optional(),

  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type ContractorSignupData = z.infer<typeof contractorSignupSchema>;
