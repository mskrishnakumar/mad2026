import { MagicBusCentre } from '@/lib/types/data';

export const MAGIC_BUS_CENTRES: MagicBusCentre[] = [
  {
    id: 'CTR001',
    name: 'Magic Bus Porur Centre',
    address: '123 Mount Poonamallee Road, Porur, Chennai 600116',
    latitude: 13.0382,
    longitude: 80.1565,
    pinCodes: ['600116', '600095', '600089'],
    capacity: 100,
    currentEnrollment: 75
  },
  {
    id: 'CTR002',
    name: 'Magic Bus Ramapuram Centre',
    address: '45 Arcot Road, Ramapuram, Chennai 600089',
    latitude: 13.0310,
    longitude: 80.1810,
    pinCodes: ['600089', '600026', '600095'],
    capacity: 80,
    currentEnrollment: 45
  },
  {
    id: 'CTR003',
    name: 'Magic Bus Valasaravakkam Centre',
    address: '78 100 Feet Road, Valasaravakkam, Chennai 600087',
    latitude: 13.0470,
    longitude: 80.1720,
    pinCodes: ['600087', '600095', '600116'],
    capacity: 60,
    currentEnrollment: 40
  },
  {
    id: 'CTR004',
    name: 'Magic Bus Maduravoyal Centre',
    address: '200 Poonamallee High Road, Maduravoyal, Chennai 600095',
    latitude: 13.0570,
    longitude: 80.1650,
    pinCodes: ['600095', '600116', '600077'],
    capacity: 90,
    currentEnrollment: 60
  },
  {
    id: 'CTR005',
    name: 'Magic Bus Mangadu Centre',
    address: '55 Trunk Road, Mangadu, Chennai 600122',
    latitude: 13.0260,
    longitude: 80.1200,
    pinCodes: ['600122', '600069', '600123'],
    capacity: 50,
    currentEnrollment: 30
  }
];

export const INCOME_BRACKETS = [
  { value: 'less_1_lakh', label: '< \u20B91 Lakh', eligible: true },
  { value: '1_2_lakhs', label: '\u20B91 - 2 Lakhs', eligible: true },
  { value: '2_3_lakhs', label: '\u20B92 - 3 Lakhs', eligible: true },
  { value: '3_3.5_lakhs', label: '\u20B93 - 3.5 Lakhs', eligible: true },
  { value: 'above_3.5_lakhs', label: '> \u20B93.5 Lakhs', eligible: false },
];

export const EDUCATION_LEVELS = [
  'Below 10th',
  '10th Pass',
  '12th Pass',
  'ITI/Diploma',
  'Graduate',
  'Post Graduate'
];

export const GENDER_OPTIONS = [
  'Male',
  'Female',
  'Other',
  'Prefer not to say'
];

// Helper function to find nearest centre based on PIN code
export function findNearestCentre(pinCode: string): MagicBusCentre | null {
  // First try exact PIN match
  const exactMatch = MAGIC_BUS_CENTRES.find(c => c.pinCodes.includes(pinCode));
  if (exactMatch) return exactMatch;

  // Fallback: return Porur centre as default
  return MAGIC_BUS_CENTRES[0];
}

// Chennai area bounds for map
export const CHENNAI_BOUNDS = {
  center: { lat: 13.0382, lng: 80.1565 } as const,
  zoom: 12,
  minZoom: 10,
  maxZoom: 18
};
