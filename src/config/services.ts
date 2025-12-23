import { ServiceType, LeadUrgency } from '@/lib/database.types';

export const SERVICES: Record<
  ServiceType,
  {
    label: string;
    shortLabel: string;
    category: 'hvac' | 'plumbing';
    description: string;
    seoTitle: string;
    icon: string;
  }
> = {
  hvac_repair: {
    label: 'HVAC Repair',
    shortLabel: 'AC/Heating Repair',
    category: 'hvac',
    description: 'Air conditioning and heating system repairs',
    seoTitle: 'HVAC Repair Services',
    icon: 'Thermometer',
  },
  hvac_install: {
    label: 'HVAC Installation',
    shortLabel: 'AC/Heating Install',
    category: 'hvac',
    description: 'New air conditioning and heating system installation',
    seoTitle: 'HVAC Installation Services',
    icon: 'AirVent',
  },
  hvac_maintenance: {
    label: 'HVAC Maintenance',
    shortLabel: 'AC/Heating Tune-Up',
    category: 'hvac',
    description: 'Preventive maintenance and tune-ups',
    seoTitle: 'HVAC Maintenance & Tune-Up',
    icon: 'Wrench',
  },
  plumbing_emergency: {
    label: 'Emergency Plumbing',
    shortLabel: 'Emergency Plumber',
    category: 'plumbing',
    description: '24/7 emergency plumbing services',
    seoTitle: '24 Hour Emergency Plumber',
    icon: 'AlertTriangle',
  },
  plumbing_repair: {
    label: 'Plumbing Repair',
    shortLabel: 'Plumbing Repair',
    category: 'plumbing',
    description: 'General plumbing repairs and fixes',
    seoTitle: 'Plumbing Repair Services',
    icon: 'Droplet',
  },
  plumbing_install: {
    label: 'Plumbing Installation',
    shortLabel: 'Plumbing Install',
    category: 'plumbing',
    description: 'New plumbing fixture and pipe installation',
    seoTitle: 'Plumbing Installation Services',
    icon: 'PipetteIcon',
  },
  water_heater: {
    label: 'Water Heater Services',
    shortLabel: 'Water Heater',
    category: 'plumbing',
    description: 'Water heater repair and replacement',
    seoTitle: 'Water Heater Repair & Replacement',
    icon: 'Flame',
  },
};

// Urgency multipliers for dynamic lead pricing
// See PRICING_TIERS.md for full pricing strategy
// Recommended range: same-day 1.3-1.6×, baseline 1.0×, flexible 0.8×
export const URGENCY_OPTIONS: Record<
  LeadUrgency,
  {
    label: string;
    description: string;
    leadMultiplier: number;
  }
> = {
  emergency: {
    label: 'Emergency - Right Now',
    description: 'I need help immediately',
    leadMultiplier: 1.5, // 1.5× premium for emergency service
  },
  today: {
    label: 'Today',
    description: 'I need help today',
    leadMultiplier: 1.25, // 1.25× premium for same-day service
  },
  this_week: {
    label: 'This Week',
    description: 'Sometime in the next few days',
    leadMultiplier: 1.0, // Baseline pricing
  },
  flexible: {
    label: 'Flexible',
    description: "I'm planning ahead",
    leadMultiplier: 0.8, // 20% discount for flexible scheduling
  },
};

// Georgia cities - start with metro Atlanta and expand
export const GEORGIA_CITIES = [
  // Metro Atlanta
  {
    city: 'Atlanta',
    state: 'GA',
    slug: 'atlanta',
    metro: 'Atlanta',
    population: 498715,
  },
  {
    city: 'Marietta',
    state: 'GA',
    slug: 'marietta',
    metro: 'Atlanta',
    population: 60972,
  },
  {
    city: 'Alpharetta',
    state: 'GA',
    slug: 'alpharetta',
    metro: 'Atlanta',
    population: 65818,
  },
  {
    city: 'Roswell',
    state: 'GA',
    slug: 'roswell',
    metro: 'Atlanta',
    population: 92833,
  },
  {
    city: 'Sandy Springs',
    state: 'GA',
    slug: 'sandy-springs',
    metro: 'Atlanta',
    population: 108080,
  },
  {
    city: 'Johns Creek',
    state: 'GA',
    slug: 'johns-creek',
    metro: 'Atlanta',
    population: 82453,
  },
  {
    city: 'Dunwoody',
    state: 'GA',
    slug: 'dunwoody',
    metro: 'Atlanta',
    population: 49356,
  },
  {
    city: 'Brookhaven',
    state: 'GA',
    slug: 'brookhaven',
    metro: 'Atlanta',
    population: 55554,
  },
  {
    city: 'Decatur',
    state: 'GA',
    slug: 'decatur',
    metro: 'Atlanta',
    population: 24814,
  },
  {
    city: 'Smyrna',
    state: 'GA',
    slug: 'smyrna',
    metro: 'Atlanta',
    population: 56666,
  },
  {
    city: 'Kennesaw',
    state: 'GA',
    slug: 'kennesaw',
    metro: 'Atlanta',
    population: 34077,
  },
  {
    city: 'Lawrenceville',
    state: 'GA',
    slug: 'lawrenceville',
    metro: 'Atlanta',
    population: 30512,
  },
  {
    city: 'Duluth',
    state: 'GA',
    slug: 'duluth',
    metro: 'Atlanta',
    population: 29538,
  },
  {
    city: 'Peachtree City',
    state: 'GA',
    slug: 'peachtree-city',
    metro: 'Atlanta',
    population: 35364,
  },
  {
    city: 'Woodstock',
    state: 'GA',
    slug: 'woodstock',
    metro: 'Atlanta',
    population: 32310,
  },

  // Other major Georgia cities
  {
    city: 'Savannah',
    state: 'GA',
    slug: 'savannah',
    metro: 'Savannah',
    population: 147780,
  },
  {
    city: 'Augusta',
    state: 'GA',
    slug: 'augusta',
    metro: 'Augusta',
    population: 202081,
  },
  {
    city: 'Columbus',
    state: 'GA',
    slug: 'columbus',
    metro: 'Columbus',
    population: 206922,
  },
  {
    city: 'Macon',
    state: 'GA',
    slug: 'macon',
    metro: 'Macon',
    population: 157346,
  },
  {
    city: 'Athens',
    state: 'GA',
    slug: 'athens',
    metro: 'Athens',
    population: 127315,
  },
];

// Service slugs for URL routing
export const SERVICE_SLUGS: Record<string, ServiceType> = {
  'hvac-repair': 'hvac_repair',
  'ac-repair': 'hvac_repair',
  'heating-repair': 'hvac_repair',
  'hvac-installation': 'hvac_install',
  'ac-installation': 'hvac_install',
  'hvac-maintenance': 'hvac_maintenance',
  'ac-tune-up': 'hvac_maintenance',
  'emergency-plumber': 'plumbing_emergency',
  '24-hour-plumber': 'plumbing_emergency',
  'plumbing-repair': 'plumbing_repair',
  plumber: 'plumbing_repair',
  'plumbing-installation': 'plumbing_install',
  'water-heater': 'water_heater',
  'water-heater-repair': 'water_heater',
};

// Reverse mapping for generating URLs
export const SERVICE_TO_SLUG: Record<ServiceType, string> = {
  hvac_repair: 'hvac-repair',
  hvac_install: 'hvac-installation',
  hvac_maintenance: 'hvac-maintenance',
  plumbing_emergency: 'emergency-plumber',
  plumbing_repair: 'plumbing-repair',
  plumbing_install: 'plumbing-installation',
  water_heater: 'water-heater',
};

// Base lead prices (in dollars) - used as fallback if database pricing fails
// These are the 'this_week' urgency baseline prices
// Actual prices are calculated: base_price × urgency_multiplier
//
// PRICING STRATEGY (see PRICING_TIERS.md):
// - Shared leads: Multiple contractors receive the same lead (broadcast model)
// - Exclusive leads: Single contractor gets the lead exclusively (1.4-1.6× multiplier)
// - Urgency multipliers: emergency 1.5×, today 1.25×, this_week 1.0×, flexible 0.8×
// - Tier discounts: Pro tier gets 20-30% off per-lead prices
//
// Example: HVAC repair shared, emergency = $25 × 1.5 = $37.50
// Example: HVAC install exclusive, today = $120 × 1.25 = $150
export const BASE_LEAD_PRICES: Record<
  ServiceType,
  { shared: number; exclusive: number }
> = {
  hvac_repair: { shared: 25, exclusive: 60 }, // Repairs typically $20-35 shared
  hvac_install: { shared: 45, exclusive: 120 }, // Installs $35-55 shared (high-value leads)
  hvac_maintenance: { shared: 15, exclusive: 35 }, // Routine maintenance (lower value)
  plumbing_emergency: { shared: 30, exclusive: 75 }, // Emergency calls command premium
  plumbing_repair: { shared: 20, exclusive: 50 }, // Standard repairs
  plumbing_install: { shared: 35, exclusive: 85 }, // Installations (higher value)
  water_heater: { shared: 40, exclusive: 100 }, // Replacement jobs (high-value)
};

// Contractor pricing tiers (see PRICING_TIERS.md for full details)
export const CONTRACTOR_TIERS = {
  starter: {
    name: 'Starter',
    monthlyFee: 0,
    leadDiscount: 0, // No discount - pays full price
    features: [
      'Prepaid lead credits',
      'Shared leads',
      'Basic filters (service + radius)',
      'Charged only when accepted',
    ],
  },
  pro: {
    name: 'Pro',
    monthlyFee: 149, // $99-$199 range, using $149 as default
    leadDiscount: 0.25, // 25% off per-lead prices
    features: [
      'Priority lead routing',
      'Lead quality score visibility',
      'Advanced filters (urgency, property type, scope)',
      'Configurable acceptance rules',
      'Monthly invoicing',
    ],
  },
  elite: {
    name: 'Elite',
    monthlyFee: 399, // $299-$499 range, using $399 as default
    leadDiscount: 0, // Exclusive leads have different pricing, not discounted
    features: [
      'Exclusive or 24-hour protected leads',
      'Highest routing priority',
      'Guaranteed response SLA',
      'Optional call-transfer leads',
      'Dedicated account support',
    ],
  },
} as const;
