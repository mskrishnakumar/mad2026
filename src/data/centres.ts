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

// PIN code to approximate coordinates mapping (Chennai area)
const PIN_COORDINATES: Record<string, { lat: number; lng: number }> = {
  '600116': { lat: 13.0382, lng: 80.1565 }, // Porur
  '600095': { lat: 13.0570, lng: 80.1650 }, // Maduravoyal
  '600089': { lat: 13.0310, lng: 80.1810 }, // Ramapuram
  '600087': { lat: 13.0470, lng: 80.1720 }, // Valasaravakkam
  '600122': { lat: 13.0260, lng: 80.1200 }, // Mangadu
  '600026': { lat: 13.0250, lng: 80.2000 }, // Guindy area
  '600077': { lat: 13.0700, lng: 80.1800 }, // Padi area
  '600069': { lat: 13.0100, lng: 80.1100 }, // Kunrathur
  '600123': { lat: 13.0150, lng: 80.1050 }, // Mangadu extension
};

// Haversine formula to calculate distance between two coordinates
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get coordinates for a PIN code
export function getCoordinatesForPin(pinCode: string): { lat: number; lng: number } | null {
  return PIN_COORDINATES[pinCode] || null;
}

// Calculate distance from a PIN code to a centre
export function getDistanceToCentre(pinCode: string, centre: MagicBusCentre): number | null {
  const userCoords = getCoordinatesForPin(pinCode);
  if (!userCoords) {
    // If PIN not in our map, estimate based on first 3 digits
    const prefix = pinCode.substring(0, 3);
    const matchingPin = Object.keys(PIN_COORDINATES).find(p => p.startsWith(prefix));
    if (matchingPin) {
      const coords = PIN_COORDINATES[matchingPin];
      return calculateDistance(coords.lat, coords.lng, centre.latitude, centre.longitude);
    }
    return null;
  }
  return calculateDistance(userCoords.lat, userCoords.lng, centre.latitude, centre.longitude);
}

// Get centres grouped by distance
export function getCentresGroupedByDistance(pinCode: string): {
  nearby: Array<MagicBusCentre & { distance: number }>;
  farther: Array<MagicBusCentre & { distance: number }>;
} {
  const centresWithDistance = MAGIC_BUS_CENTRES.map(centre => {
    const distance = getDistanceToCentre(pinCode, centre) ?? 10; // Default to 10km if unknown
    return { ...centre, distance };
  }).sort((a, b) => a.distance - b.distance);

  return {
    nearby: centresWithDistance.filter(c => c.distance < 5),
    farther: centresWithDistance.filter(c => c.distance >= 5),
  };
}

// Helper function to find nearest centre based on PIN code
export function findNearestCentre(pinCode: string): MagicBusCentre | null {
  // First try exact PIN match
  const exactMatch = MAGIC_BUS_CENTRES.find(c => c.pinCodes.includes(pinCode));
  if (exactMatch) return exactMatch;

  // Try to find by distance calculation
  const userCoords = getCoordinatesForPin(pinCode);
  if (userCoords) {
    let nearest: MagicBusCentre | null = null;
    let minDistance = Infinity;
    for (const centre of MAGIC_BUS_CENTRES) {
      const dist = calculateDistance(userCoords.lat, userCoords.lng, centre.latitude, centre.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = centre;
      }
    }
    if (nearest) return nearest;
  }

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
