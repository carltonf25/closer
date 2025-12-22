import { ServiceType, LeadUrgency } from '@/lib/database.types';

export const SERVICES: Record<ServiceType, {
  label: string;
  shortLabel: string;
  category: 'hvac' | 'plumbing';
  description: string;
  seoTitle: string;
  icon: string;
}> = {
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

export const URGENCY_OPTIONS: Record<LeadUrgency, {
  label: string;
  description: string;
  leadMultiplier: number;
}> = {
  emergency: {
    label: 'Emergency - Right Now',
    description: 'I need help immediately',
    leadMultiplier: 1.5,
  },
  today: {
    label: 'Today',
    description: 'I need help today',
    leadMultiplier: 1.25,
  },
  this_week: {
    label: 'This Week',
    description: 'Sometime in the next few days',
    leadMultiplier: 1.0,
  },
  flexible: {
    label: 'Flexible',
    description: "I'm planning ahead",
    leadMultiplier: 0.8,
  },
};

// Georgia cities - start with metro Atlanta and expand
export const GEORGIA_CITIES = [
  // Metro Atlanta
  { city: 'Atlanta', state: 'GA', slug: 'atlanta', metro: 'Atlanta', population: 498715 },
  { city: 'Marietta', state: 'GA', slug: 'marietta', metro: 'Atlanta', population: 60972 },
  { city: 'Alpharetta', state: 'GA', slug: 'alpharetta', metro: 'Atlanta', population: 65818 },
  { city: 'Roswell', state: 'GA', slug: 'roswell', metro: 'Atlanta', population: 92833 },
  { city: 'Sandy Springs', state: 'GA', slug: 'sandy-springs', metro: 'Atlanta', population: 108080 },
  { city: 'Johns Creek', state: 'GA', slug: 'johns-creek', metro: 'Atlanta', population: 82453 },
  { city: 'Dunwoody', state: 'GA', slug: 'dunwoody', metro: 'Atlanta', population: 49356 },
  { city: 'Brookhaven', state: 'GA', slug: 'brookhaven', metro: 'Atlanta', population: 55554 },
  { city: 'Decatur', state: 'GA', slug: 'decatur', metro: 'Atlanta', population: 24814 },
  { city: 'Smyrna', state: 'GA', slug: 'smyrna', metro: 'Atlanta', population: 56666 },
  { city: 'Kennesaw', state: 'GA', slug: 'kennesaw', metro: 'Atlanta', population: 34077 },
  { city: 'Lawrenceville', state: 'GA', slug: 'lawrenceville', metro: 'Atlanta', population: 30512 },
  { city: 'Duluth', state: 'GA', slug: 'duluth', metro: 'Atlanta', population: 29538 },
  { city: 'Peachtree City', state: 'GA', slug: 'peachtree-city', metro: 'Atlanta', population: 35364 },
  { city: 'Woodstock', state: 'GA', slug: 'woodstock', metro: 'Atlanta', population: 32310 },
  
  // Other major Georgia cities
  { city: 'Savannah', state: 'GA', slug: 'savannah', metro: 'Savannah', population: 147780 },
  { city: 'Augusta', state: 'GA', slug: 'augusta', metro: 'Augusta', population: 202081 },
  { city: 'Columbus', state: 'GA', slug: 'columbus', metro: 'Columbus', population: 206922 },
  { city: 'Macon', state: 'GA', slug: 'macon', metro: 'Macon', population: 157346 },
  { city: 'Athens', state: 'GA', slug: 'athens', metro: 'Athens', population: 127315 },
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
  'plumber': 'plumbing_repair',
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

// Base lead prices (in dollars)
export const BASE_LEAD_PRICES: Record<ServiceType, { shared: number; exclusive: number }> = {
  hvac_repair: { shared: 25, exclusive: 60 },
  hvac_install: { shared: 45, exclusive: 120 },
  hvac_maintenance: { shared: 15, exclusive: 35 },
  plumbing_emergency: { shared: 30, exclusive: 75 },
  plumbing_repair: { shared: 20, exclusive: 50 },
  plumbing_install: { shared: 35, exclusive: 85 },
  water_heater: { shared: 40, exclusive: 100 },
};
