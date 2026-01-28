import type {
  StudentExtended,
  PipelineStage,
  RiskFactors,
  StudentAlert,
  EngagementChannel,
  EngagementRecord,
  EngagementChannelStats,
  ReferralSource,
  ReferralSourceStats,
} from '@/lib/types/data';
import { calculateRiskScore } from '@/lib/utils/riskCalculator';

// Pipeline stages with realistic distribution weights
const PIPELINE_STAGES: { stage: PipelineStage; weight: number }[] = [
  { stage: 'Student Onboarding', weight: 15 },
  { stage: 'Counselling', weight: 20 },
  { stage: 'Enrollment', weight: 20 },
  { stage: 'Training', weight: 25 },
  { stage: 'Pre-placement', weight: 12 },
  { stage: 'Post Placement', weight: 8 },
];

// Indian names for realistic mock data
const FIRST_NAMES_MALE = [
  'Rahul', 'Amit', 'Vikram', 'Sanjay', 'Arjun', 'Kiran', 'Rajesh', 'Suresh',
  'Anil', 'Vijay', 'Ravi', 'Deepak', 'Manoj', 'Pramod', 'Ashok', 'Dinesh',
  'Ramesh', 'Ganesh', 'Sunil', 'Vinod', 'Ajay', 'Nikhil', 'Rohit', 'Sachin',
];

const FIRST_NAMES_FEMALE = [
  'Priya', 'Anita', 'Meera', 'Deepa', 'Sunita', 'Kavitha', 'Lakshmi', 'Divya',
  'Pooja', 'Sneha', 'Neha', 'Swati', 'Anjali', 'Rashmi', 'Padma', 'Geeta',
  'Shanti', 'Radha', 'Shalini', 'Rekha', 'Asha', 'Nandini', 'Savita', 'Jyoti',
];

const LAST_NAMES = [
  'Sharma', 'Kumar', 'Patel', 'Singh', 'Reddy', 'Nair', 'Iyer', 'Gupta',
  'Verma', 'Yadav', 'Joshi', 'Pillai', 'Menon', 'Rao', 'Das', 'Mukherjee',
  'Chatterjee', 'Banerjee', 'Dey', 'Bose', 'Ghosh', 'Sen', 'Chandra', 'Mishra',
];

// Education levels matching the registration form
const EDUCATION_LEVELS = [
  'Below 10th',
  '10th Pass',
  '12th Pass',
  'ITI/Diploma',
  'Graduate',
  'Post Graduate',
];

const SKILLS_POOL = [
  'Communication', 'Computer Basics', 'English Speaking', 'Mathematics',
  'Problem Solving', 'Team Work', 'Time Management', 'Customer Service',
  'Data Entry', 'MS Office', 'Retail Skills', 'Hospitality',
  'Healthcare Basics', 'Mechanical Skills', 'Electrical Basics',
];

const ASPIRATIONS_POOL = [
  'IT Professional', 'Healthcare Worker', 'Retail Manager', 'Teacher',
  'Business Owner', 'Banking Professional', 'Hospitality Expert',
  'Government Job', 'Technical Expert', 'Sales Professional',
];

const CENTRES = [
  { id: 'CTR001', name: 'Magic Bus Centre - Andheri' },
  { id: 'CTR002', name: 'Magic Bus Centre - Thane' },
  { id: 'CTR003', name: 'Magic Bus Centre - Navi Mumbai' },
  { id: 'CTR004', name: 'Magic Bus Centre - Pune' },
  { id: 'CTR005', name: 'Magic Bus Centre - Bangalore' },
];

// Engagement channels with realistic weights (WhatsApp most common in India)
const ENGAGEMENT_CHANNELS: { channel: EngagementChannel; weight: number; responseRate: number }[] = [
  { channel: 'whatsapp', weight: 40, responseRate: 0.78 },  // Highest engagement
  { channel: 'phone', weight: 25, responseRate: 0.65 },
  { channel: 'sms', weight: 15, responseRate: 0.45 },
  { channel: 'in_person', weight: 12, responseRate: 0.92 }, // Best but less frequent
  { channel: 'email', weight: 8, responseRate: 0.32 },      // Lowest for this demographic
];

// Referral sources with weights and expected outcomes
// Alumni referrals have the BEST outcomes - they know what the program offers
const REFERRAL_SOURCES: {
  source: ReferralSource;
  weight: number;
  placementBonus: number;    // Higher = better placement rate
  retentionBonus: number;    // Higher = better retention
  riskReduction: number;     // Higher = lower risk scores
}[] = [
  { source: 'alumni', weight: 15, placementBonus: 0.35, retentionBonus: 0.30, riskReduction: 20 },        // BEST - trusted recommendation
  { source: 'community', weight: 18, placementBonus: 0.20, retentionBonus: 0.20, riskReduction: 12 },    // Strong local connection
  { source: 'school', weight: 12, placementBonus: 0.18, retentionBonus: 0.18, riskReduction: 10 },       // Institutional support
  { source: 'ngo_partner', weight: 14, placementBonus: 0.15, retentionBonus: 0.22, riskReduction: 15 },  // Pre-screened candidates
  { source: 'government', weight: 10, placementBonus: 0.12, retentionBonus: 0.15, riskReduction: 8 },    // Scheme referrals
  { source: 'word_of_mouth', weight: 16, placementBonus: 0.10, retentionBonus: 0.12, riskReduction: 5 }, // Friends/family
  { source: 'social_media', weight: 10, placementBonus: 0.05, retentionBonus: 0.08, riskReduction: 0 },  // Lower commitment
  { source: 'self_discovery', weight: 5, placementBonus: 0.08, retentionBonus: 0.10, riskReduction: 3 }, // Walk-ins
];

// Seeded random number generator for deterministic data
// This ensures the same index always generates the same student
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Simple mulberry32 PRNG
  next(): number {
    let t = (this.seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextElement<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)];
  }

  nextElements<T>(array: T[], count: number): T[] {
    const copy = [...array];
    const result: T[] = [];
    for (let i = 0; i < Math.min(count, copy.length); i++) {
      const idx = Math.floor(this.next() * copy.length);
      result.push(copy.splice(idx, 1)[0]);
    }
    return result;
  }

  nextBoolean(probability: number = 0.5): boolean {
    return this.next() < probability;
  }
}

// Utility functions using Math.random for non-critical randomness
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRandomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysAgo));
  return date.toISOString();
}

function getWeightedPipelineStage(): PipelineStage {
  const totalWeight = PIPELINE_STAGES.reduce((sum, s) => sum + s.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of PIPELINE_STAGES) {
    random -= item.weight;
    if (random <= 0) return item.stage;
  }

  return 'Training';
}

/**
 * Generate realistic risk factors with some variance
 * About 20% will be high-risk for testing purposes
 */
function generateRiskFactors(isHighRisk: boolean = false): RiskFactors {
  if (isHighRisk) {
    // High-risk profile: poor attendance, far distance (max 9km), limited connectivity
    return {
      firstWeekAttendance: randomInt(0, 40),
      distanceFromCentreKm: randomInt(5, 9),  // Max 9km for far from centre
      isFirstGenGraduate: Math.random() > 0.3,
      hasInternet: Math.random() > 0.7,
      hasMobile: Math.random() > 0.3,
      mobileType: Math.random() > 0.6 ? 'basic' : 'smartphone',
      loginAttempts: randomInt(0, 3),
      counsellorContactAttempts: randomInt(3, 8),
      quizScore: randomInt(10, 35),
    };
  }

  // Normal profile with variance - most students within 5km
  return {
    firstWeekAttendance: randomInt(60, 100),
    distanceFromCentreKm: randomInt(1, 4),  // Within acceptable range (under 5km)
    isFirstGenGraduate: Math.random() > 0.5,
    hasInternet: Math.random() > 0.4,
    hasMobile: true,
    mobileType: Math.random() > 0.3 ? 'smartphone' : 'basic',
    loginAttempts: randomInt(5, 20),
    counsellorContactAttempts: randomInt(0, 3),
    quizScore: randomInt(45, 95),
  };
}

/**
 * Get a weighted random engagement channel
 */
function getWeightedChannel(): EngagementChannel {
  const totalWeight = ENGAGEMENT_CHANNELS.reduce((sum, c) => sum + c.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of ENGAGEMENT_CHANNELS) {
    random -= item.weight;
    if (random <= 0) return item.channel;
  }

  return 'whatsapp';
}

/**
 * Get a weighted random referral source
 */
function getWeightedReferralSource(): ReferralSource {
  const totalWeight = REFERRAL_SOURCES.reduce((sum, r) => sum + r.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of REFERRAL_SOURCES) {
    random -= item.weight;
    if (random <= 0) return item.source;
  }

  return 'community';
}

/**
 * Generate engagement records for a student
 * Correlates with risk level - high risk students have lower engagement
 */
function generateEngagementData(riskLevel: string): EngagementRecord[] {
  const preferredChannel = getWeightedChannel();
  const channelConfig = ENGAGEMENT_CHANNELS.find(c => c.channel === preferredChannel)!;

  // Adjust response rate based on risk level
  const riskMultiplier = {
    low: 1.1,
    medium: 0.9,
    high: 0.6,
    critical: 0.3,
  }[riskLevel] || 1;

  const adjustedResponseRate = Math.min(channelConfig.responseRate * riskMultiplier, 1);
  const totalAttempts = randomInt(3, 12);
  const successfulContacts = Math.round(totalAttempts * adjustedResponseRate);

  const records: EngagementRecord[] = [
    {
      channel: preferredChannel,
      totalAttempts,
      successfulContacts,
      lastContactDate: generateRandomDate(7),
      outcome: successfulContacts / totalAttempts > 0.5 ? 'positive' :
               successfulContacts > 0 ? 'neutral' : 'no_response',
    },
  ];

  // Some students have secondary channels
  if (Math.random() > 0.4) {
    const secondaryChannels = ENGAGEMENT_CHANNELS.filter(c => c.channel !== preferredChannel);
    const secondaryChannel = randomElement(secondaryChannels);
    const secAttempts = randomInt(1, 5);
    const secSuccess = Math.round(secAttempts * secondaryChannel.responseRate * riskMultiplier);

    records.push({
      channel: secondaryChannel.channel,
      totalAttempts: secAttempts,
      successfulContacts: secSuccess,
      lastContactDate: generateRandomDate(14),
      outcome: secSuccess / secAttempts > 0.5 ? 'positive' :
               secSuccess > 0 ? 'neutral' : 'no_response',
    });
  }

  return records;
}

/**
 * Generate risk factors using seeded RNG for consistency
 */
function generateSeededRiskFactors(rng: SeededRandom, isHighRisk: boolean): RiskFactors {
  if (isHighRisk) {
    return {
      firstWeekAttendance: rng.nextInt(0, 40),
      distanceFromCentreKm: rng.nextInt(5, 9),
      isFirstGenGraduate: rng.nextBoolean(0.7),
      hasInternet: rng.nextBoolean(0.3),
      hasMobile: rng.nextBoolean(0.7),
      mobileType: rng.nextBoolean(0.4) ? 'basic' : 'smartphone',
      loginAttempts: rng.nextInt(0, 3),
      counsellorContactAttempts: rng.nextInt(3, 8),
      quizScore: rng.nextInt(10, 35),
    };
  }

  return {
    firstWeekAttendance: rng.nextInt(60, 100),
    distanceFromCentreKm: rng.nextInt(1, 4),
    isFirstGenGraduate: rng.nextBoolean(0.5),
    hasInternet: rng.nextBoolean(0.6),
    hasMobile: true,
    mobileType: rng.nextBoolean(0.7) ? 'smartphone' : 'basic',
    loginAttempts: rng.nextInt(5, 20),
    counsellorContactAttempts: rng.nextInt(0, 3),
    quizScore: rng.nextInt(45, 95),
  };
}

/**
 * Generate engagement data using seeded RNG
 */
function generateSeededEngagementData(rng: SeededRandom, riskLevel: string): EngagementRecord[] {
  const channelIndex = rng.nextInt(0, ENGAGEMENT_CHANNELS.length - 1);
  const channelConfig = ENGAGEMENT_CHANNELS[channelIndex];
  const preferredChannel = channelConfig.channel;

  const riskMultiplier = {
    low: 1.1,
    medium: 0.9,
    high: 0.6,
    critical: 0.3,
  }[riskLevel] || 1;

  const adjustedResponseRate = Math.min(channelConfig.responseRate * riskMultiplier, 1);
  const totalAttempts = rng.nextInt(3, 12);
  const successfulContacts = Math.round(totalAttempts * adjustedResponseRate);

  const records: EngagementRecord[] = [
    {
      channel: preferredChannel,
      totalAttempts,
      successfulContacts,
      lastContactDate: new Date(Date.now() - rng.nextInt(1, 7) * 24 * 60 * 60 * 1000).toISOString(),
      outcome: successfulContacts / totalAttempts > 0.5 ? 'positive' :
               successfulContacts > 0 ? 'neutral' : 'no_response',
    },
  ];

  if (rng.nextBoolean(0.6)) {
    const secondaryChannels = ENGAGEMENT_CHANNELS.filter(c => c.channel !== preferredChannel);
    const secondaryChannel = secondaryChannels[rng.nextInt(0, secondaryChannels.length - 1)];
    const secAttempts = rng.nextInt(1, 5);
    const secSuccess = Math.round(secAttempts * secondaryChannel.responseRate * riskMultiplier);

    records.push({
      channel: secondaryChannel.channel,
      totalAttempts: secAttempts,
      successfulContacts: secSuccess,
      lastContactDate: new Date(Date.now() - rng.nextInt(8, 14) * 24 * 60 * 60 * 1000).toISOString(),
      outcome: secSuccess / secAttempts > 0.5 ? 'positive' :
               secSuccess > 0 ? 'neutral' : 'no_response',
    });
  }

  return records;
}

/**
 * Generate a single mock extended student using SEEDED random for consistency
 * The same index will ALWAYS produce the same student data
 */
export function generateMockStudent(index: number): StudentExtended {
  // Use index as seed - same index = same student every time
  const rng = new SeededRandom(index * 12345 + 67890);

  const isFemale = rng.nextBoolean(0.55);
  const gender = isFemale ? 'Female' : 'Male';
  const firstName = rng.nextElement(isFemale ? FIRST_NAMES_FEMALE : FIRST_NAMES_MALE);
  const lastName = rng.nextElement(LAST_NAMES);
  const name = `${firstName} ${lastName}`;

  const isHighRisk = rng.nextBoolean(0.2); // 20% high-risk
  const riskFactors = generateSeededRiskFactors(rng, isHighRisk);
  const riskScore = calculateRiskScore(riskFactors);
  const centre = rng.nextElement(CENTRES);

  const skills = rng.nextElements(SKILLS_POOL, rng.nextInt(2, 5));
  const aspirations = rng.nextElements(ASPIRATIONS_POOL, rng.nextInt(1, 3));

  const engagementData = generateSeededEngagementData(rng, riskScore.riskLevel);
  const preferredChannel = engagementData[0]?.channel || 'whatsapp';

  // Seeded referral source selection
  const referralIndex = rng.nextInt(0, REFERRAL_SOURCES.length - 1);
  const referralSource = REFERRAL_SOURCES[referralIndex].source;

  // Seeded pipeline stage selection
  const stageIndex = rng.nextInt(0, PIPELINE_STAGES.length - 1);
  const pipelineStage = PIPELINE_STAGES[stageIndex].stage;

  const age = rng.nextInt(18, 28);
  const phonePrefix = rng.nextInt(70000, 99999);
  const phoneSuffix = rng.nextInt(10000, 99999);

  return {
    id: `STU${String(index + 1).padStart(4, '0')}`,
    name,
    age: String(age),
    gender,
    contact_phone: `+91 ${phonePrefix}${phoneSuffix}`,
    contact_email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    education_level: rng.nextElement(EDUCATION_LEVELS),
    status: rng.nextElement(['Active', 'Matched', 'Placed', 'Onboarding'] as const),
    skills: skills.join(', '),
    aspirations: aspirations.join(', '),
    enrolled_date: new Date(Date.now() - rng.nextInt(1, 180) * 24 * 60 * 60 * 1000).toISOString(),
    counsellor_id: `CNSL${String(rng.nextInt(1, 5)).padStart(3, '0')}`,
    pipelineStage,
    riskFactors,
    riskScore,
    lastLoginDate: new Date(Date.now() - rng.nextInt(1, 14) * 24 * 60 * 60 * 1000).toISOString(),
    lastCounsellorContact: new Date(Date.now() - rng.nextInt(1, 7) * 24 * 60 * 60 * 1000).toISOString(),
    centreId: centre.id,
    centreName: centre.name,
    engagementData,
    preferredChannel,
    referralSource,
  };
}

/**
 * Generate multiple mock students
 */
export function generateMockStudents(count: number = 50): StudentExtended[] {
  return Array.from({ length: count }, (_, i) => generateMockStudent(i));
}

/**
 * Generate alerts for at-risk students
 */
export function generateMockAlerts(students: StudentExtended[]): StudentAlert[] {
  return students
    .filter(s => s.riskScore.totalScore >= 70)
    .map((s, index) => ({
      id: `ALR${String(index + 1).padStart(4, '0')}`,
      studentId: s.id,
      studentName: s.name,
      type: s.riskScore.totalScore >= 85 ? 'dropout_warning' as const : 'high_risk' as const,
      message: s.riskScore.totalScore >= 85
        ? `${s.name} has a critical risk score of ${s.riskScore.totalScore}%. Immediate intervention required.`
        : `${s.name} has a high risk score of ${s.riskScore.totalScore}%. Consider scheduling a follow-up.`,
      severity: s.riskScore.totalScore >= 85 ? 'critical' as const : 'warning' as const,
      createdAt: generateRandomDate(3),
      isRead: Math.random() > 0.6,
    }));
}

/**
 * Get pipeline stage distribution from students
 */
export function getPipelineDistribution(students: StudentExtended[]): Record<PipelineStage, number> {
  const distribution: Record<PipelineStage, number> = {
    'Student Onboarding': 0,
    'Counselling': 0,
    'Enrollment': 0,
    'Training': 0,
    'Pre-placement': 0,
    'Post Placement': 0,
  };

  students.forEach(s => {
    distribution[s.pipelineStage]++;
  });

  return distribution;
}

/**
 * Get risk level distribution from students
 */
export function getRiskDistribution(students: StudentExtended[]): {
  low: number;
  medium: number;
  high: number;
  critical: number;
} {
  const distribution = { low: 0, medium: 0, high: 0, critical: 0 };

  students.forEach(s => {
    distribution[s.riskScore.riskLevel]++;
  });

  return distribution;
}

/**
 * Create 5 hardcoded at-risk sample candidates with distinct dominant key drivers
 * Distribution: 2 from Training, 1 each from Onboarding, Counselling, Enrollment
 *
 * Risk score weights (total 100):
 * - Attendance: 25 pts | Distance: 15 pts | First Gen: 10 pts
 * - Connectivity: 20 pts | Engagement: 10 pts | Contact: 10 pts | Quiz: 10 pts
 */
function createAtRiskSampleCandidates(): StudentExtended[] {
  // Helper to create risk factors object
  const createRiskFactors = (factors: RiskFactors): { riskFactors: RiskFactors; riskScore: ReturnType<typeof calculateRiskScore> } => ({
    riskFactors: factors,
    riskScore: calculateRiskScore(factors),
  });

  const sampleCandidates: StudentExtended[] = [
    // Candidate 1: DISTANCE FROM CENTRE dominant (Enrollment stage - where distance matters)
    // Far from centre indicator only shows for Enrollment stage (max 9km)
    {
      id: 'STU0001',
      name: 'Priya Sharma',
      age: '19',
      gender: 'Female',
      contact_phone: '+91 98765 43210',
      contact_email: 'priya.sharma@email.com',
      education_level: '12th Pass',
      status: 'Onboarding',
      skills: 'Communication, English Speaking',
      aspirations: 'IT Professional',
      enrolled_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      counsellor_id: 'CNSL001',
      pipelineStage: 'Enrollment',  // Changed to Enrollment stage where distance matters
      ...createRiskFactors({
        firstWeekAttendance: 52,          // Just above 50% (~12 pts)
        distanceFromCentreKm: 9,          // DOMINANT: Far from centre - max 9km
        isFirstGenGraduate: true,         // +10 pts
        hasInternet: false,               // +10 pts
        hasMobile: true,
        mobileType: 'basic',              // +5 pts
        loginAttempts: 3,                 // Low (~7 pts)
        counsellorContactAttempts: 2,     // Moderate (~4 pts)
        quizScore: 45,                    // Above threshold (~0 pts)
      }),
      lastLoginDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      lastCounsellorContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      centreId: 'CTR002',
      centreName: 'Magic Bus Centre - Thane',
      engagementData: [
        { channel: 'phone', totalAttempts: 8, successfulContacts: 3, outcome: 'neutral', lastContactDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      ],
      preferredChannel: 'phone',
      referralSource: 'social_media',  // Lower commitment source
    },

    // Candidate 2: NO MOBILE & INTERNET dominant (Counselling)
    // Distance is low - should NOT show "Far from centre" (not in Enrollment stage)
    {
      id: 'STU0002',
      name: 'Rajesh Kumar',
      age: '21',
      gender: 'Male',
      contact_phone: '+91 87654 32109',
      contact_email: 'rajesh.kumar@email.com',
      education_level: '10th Pass',
      status: 'Active',
      skills: 'Mathematics, Problem Solving',
      aspirations: 'Government Job',
      enrolled_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      counsellor_id: 'CNSL002',
      pipelineStage: 'Counselling',
      ...createRiskFactors({
        firstWeekAttendance: 55,          // Above 50% (~11 pts)
        distanceFromCentreKm: 8,          // Not shown (not in Enrollment stage)
        isFirstGenGraduate: true,         // +10 pts
        hasInternet: false,               // DOMINANT: No internet (+10 pts)
        hasMobile: false,                 // DOMINANT: No mobile (+10 pts)
        mobileType: '',
        loginAttempts: 1,                 // Very low due to no connectivity (~9 pts)
        counsellorContactAttempts: 3,     // Moderate (~6 pts)
        quizScore: 42,                    // Above threshold (~0 pts)
      }),
      lastLoginDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      lastCounsellorContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      centreId: 'CTR001',
      centreName: 'Magic Bus Centre - Andheri',
      engagementData: [
        { channel: 'in_person', totalAttempts: 5, successfulContacts: 4, outcome: 'positive', lastContactDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      ],
      preferredChannel: 'in_person',
      referralSource: 'community',  // Community outreach
    },

    // Candidate 3: LOW FIRST WEEK ATTENDANCE dominant (Training stage - where attendance matters)
    // Distance not shown (not in Enrollment stage)
    {
      id: 'STU0003',
      name: 'Meera Patel',
      age: '20',
      gender: 'Female',
      contact_phone: '+91 76543 21098',
      contact_email: 'meera.patel@email.com',
      education_level: 'ITI/Diploma',
      status: 'Active',
      skills: 'Computer Basics, MS Office, Data Entry',
      aspirations: 'Banking Professional',
      enrolled_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      counsellor_id: 'CNSL001',
      pipelineStage: 'Training',
      ...createRiskFactors({
        firstWeekAttendance: 15,          // DOMINANT: Very low attendance (Training stage)
        distanceFromCentreKm: 6,          // Not shown (not in Enrollment stage)
        isFirstGenGraduate: true,         // +10 pts
        hasInternet: false,               // +10 pts
        hasMobile: true,
        mobileType: 'smartphone',         // +0 pts
        loginAttempts: 4,                 // Low (~6 pts)
        counsellorContactAttempts: 3,     // Moderate (~6 pts)
        quizScore: 48,                    // Above threshold (~0 pts)
      }),
      lastLoginDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      lastCounsellorContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      centreId: 'CTR001',
      centreName: 'Magic Bus Centre - Andheri',
      engagementData: [
        { channel: 'whatsapp', totalAttempts: 10, successfulContacts: 4, outcome: 'neutral', lastContactDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { channel: 'phone', totalAttempts: 3, successfulContacts: 1, outcome: 'no_response', lastContactDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      ],
      preferredChannel: 'whatsapp',
      referralSource: 'word_of_mouth',  // Friends/family recommendation
    },

    // Candidate 4: POOR QUIZ SCORES dominant (Training stage - where quiz scores matter)
    // Distance not shown (not in Enrollment stage)
    {
      id: 'STU0004',
      name: 'Amit Singh',
      age: '22',
      gender: 'Male',
      contact_phone: '+91 65432 10987',
      contact_email: 'amit.singh@email.com',
      education_level: 'Graduate',
      status: 'Active',
      skills: 'Team Work, Customer Service',
      aspirations: 'Retail Manager',
      enrolled_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      counsellor_id: 'CNSL003',
      pipelineStage: 'Training',  // Changed to Training stage where quiz scores matter
      ...createRiskFactors({
        firstWeekAttendance: 58,          // Above 50% (~10 pts)
        distanceFromCentreKm: 5,          // Not shown (not in Enrollment stage)
        isFirstGenGraduate: true,         // +10 pts
        hasInternet: false,               // +10 pts
        hasMobile: true,
        mobileType: 'basic',              // +5 pts
        loginAttempts: 2,                 // Low (~8 pts)
        counsellorContactAttempts: 3,     // Moderate (~6 pts)
        quizScore: 12,                    // DOMINANT: Very poor quiz score (Training stage)
      }),
      lastLoginDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      lastCounsellorContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      centreId: 'CTR004',
      centreName: 'Magic Bus Centre - Pune',
      engagementData: [
        { channel: 'sms', totalAttempts: 6, successfulContacts: 2, outcome: 'neutral', lastContactDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      ],
      preferredChannel: 'sms',
      referralSource: 'government',  // Government scheme referral
    },

    // Candidate 5: HIGH COUNSELLOR CONTACT ATTEMPTS - Student Unresponsive (Counselling)
    // Unresponsive applies to all stages
    {
      id: 'STU0005',
      name: 'Deepa Reddy',
      age: '19',
      gender: 'Female',
      contact_phone: '+91 54321 09876',
      contact_email: 'deepa.reddy@email.com',
      education_level: 'Below 10th',
      status: 'Active',
      skills: 'Communication, English Speaking, Hospitality',
      aspirations: 'Hospitality Expert',
      enrolled_date: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      counsellor_id: 'CNSL002',
      pipelineStage: 'Counselling',  // Changed - unresponsive applies to all stages
      ...createRiskFactors({
        firstWeekAttendance: 55,          // Above 50% (~11 pts)
        distanceFromCentreKm: 7,          // Not shown (not in Enrollment stage)
        isFirstGenGraduate: true,         // +10 pts
        hasInternet: false,               // +10 pts
        hasMobile: true,
        mobileType: 'basic',              // +5 pts
        loginAttempts: 2,                 // Low (~8 pts)
        counsellorContactAttempts: 9,     // DOMINANT: Student unresponsive (all stages)
        quizScore: 42,                    // Above threshold (~0 pts)
      }),
      lastLoginDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      lastCounsellorContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      centreId: 'CTR005',
      centreName: 'Magic Bus Centre - Bangalore',
      engagementData: [
        { channel: 'whatsapp', totalAttempts: 12, successfulContacts: 2, outcome: 'no_response', lastContactDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { channel: 'phone', totalAttempts: 9, successfulContacts: 1, outcome: 'no_response', lastContactDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      ],
      preferredChannel: 'whatsapp',
      referralSource: 'self_discovery',  // Walk-in
    },
  ];

  return sampleCandidates;
}

// Pre-generated mock data for consistent usage
let cachedStudents: StudentExtended[] | null = null;
let cachedAlerts: StudentAlert[] | null = null;

export function getMockStudents(): StudentExtended[] {
  if (!cachedStudents) {
    // Start with 5 hardcoded at-risk sample candidates
    const atRiskSamples = createAtRiskSampleCandidates();
    // Generate additional random students (starting from index 5 to avoid ID conflicts)
    const randomStudents = Array.from({ length: 55 }, (_, i) => generateMockStudent(i + 5));
    cachedStudents = [...atRiskSamples, ...randomStudents];
  }
  return cachedStudents;
}

export function getMockAlerts(): StudentAlert[] {
  if (!cachedAlerts) {
    cachedAlerts = generateMockAlerts(getMockStudents());
  }
  return cachedAlerts;
}

export function resetMockData(): void {
  cachedStudents = null;
  cachedAlerts = null;
}

/**
 * Calculate engagement channel statistics from students
 * Shows which channels result in better outcomes
 */
export function getEngagementChannelStats(students: StudentExtended[]): EngagementChannelStats[] {
  const channelMap = new Map<EngagementChannel, {
    students: Set<string>;
    totalAttempts: number;
    successfulContacts: number;
    positiveOutcomes: number;
    responseTimes: number[];
  }>();

  // Initialize all channels
  const allChannels: EngagementChannel[] = ['whatsapp', 'phone', 'sms', 'in_person', 'email'];
  allChannels.forEach(channel => {
    channelMap.set(channel, {
      students: new Set(),
      totalAttempts: 0,
      successfulContacts: 0,
      positiveOutcomes: 0,
      responseTimes: [],
    });
  });

  // Aggregate data from students
  students.forEach(student => {
    if (!student.engagementData) return;

    student.engagementData.forEach(record => {
      const stats = channelMap.get(record.channel)!;
      stats.students.add(student.id);
      stats.totalAttempts += record.totalAttempts;
      stats.successfulContacts += record.successfulContacts;

      if (record.outcome === 'positive') {
        stats.positiveOutcomes++;
      }

      // Simulate response time based on success rate
      if (record.successfulContacts > 0) {
        const avgResponseDays = record.channel === 'in_person' ? 0 :
                                record.channel === 'whatsapp' ? randomInt(1, 2) :
                                record.channel === 'phone' ? randomInt(1, 3) :
                                record.channel === 'sms' ? randomInt(2, 4) :
                                randomInt(3, 7);
        stats.responseTimes.push(avgResponseDays);
      }
    });
  });

  // Convert to array of stats
  return allChannels.map(channel => {
    const stats = channelMap.get(channel)!;
    const responseRate = stats.totalAttempts > 0
      ? (stats.successfulContacts / stats.totalAttempts) * 100
      : 0;
    const avgResponseTime = stats.responseTimes.length > 0
      ? stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length
      : 0;

    return {
      channel,
      totalStudents: stats.students.size,
      responseRate: Math.round(responseRate * 10) / 10,
      positiveOutcomes: stats.positiveOutcomes,
      averageResponseTime: Math.round(avgResponseTime * 10) / 10,
    };
  }).sort((a, b) => b.responseRate - a.responseRate); // Sort by response rate
}

/**
 * Calculate referral source statistics from students
 * Shows which referral sources result in better outcomes
 * Alumni referrals should show the best retention, followed by word_of_mouth (referred by friend)
 */
export function getReferralSourceStats(students: StudentExtended[]): ReferralSourceStats[] {
  const allSources: ReferralSource[] = [
    'alumni', 'community', 'school', 'social_media',
    'ngo_partner', 'government', 'word_of_mouth', 'self_discovery'
  ];

  // Retention bonuses by source - reflects real-world patterns
  // Alumni referrals have highest retention, followed by friend referrals
  const retentionBonus: Record<ReferralSource, number> = {
    alumni: 15,           // Best retention - trusted recommendation from program graduates
    word_of_mouth: 10,    // Second best - referred by friends/family
    ngo_partner: 5,       // Pre-screened candidates
    community: 3,         // Local connection
    school: 2,            // Institutional support
    government: 0,        // Scheme referrals - baseline
    social_media: -3,     // Lower commitment
    self_discovery: -5,   // Walk-ins - lowest retention
  };

  const sourceMap = new Map<ReferralSource, {
    students: StudentExtended[];
    placedCount: number;
    droppedCount: number;
    totalRiskScore: number;
  }>();

  // Initialize all sources
  allSources.forEach(source => {
    sourceMap.set(source, {
      students: [],
      placedCount: 0,
      droppedCount: 0,
      totalRiskScore: 0,
    });
  });

  // Aggregate data from students
  students.forEach(student => {
    const source = student.referralSource || 'self_discovery';
    const stats = sourceMap.get(source)!;

    stats.students.push(student);
    stats.totalRiskScore += student.riskScore.totalScore;

    // Count placements (Post Placement stage)
    if (student.pipelineStage === 'Post Placement') {
      stats.placedCount++;
    }

    // Count dropouts (high risk + no recent activity)
    if (student.riskScore.riskLevel === 'critical') {
      stats.droppedCount++;
    }
  });

  // Convert to array of stats with quality score calculation
  return allSources.map(source => {
    const stats = sourceMap.get(source)!;
    const totalStudents = stats.students.length;

    if (totalStudents === 0) {
      return {
        source,
        totalStudents: 0,
        placedCount: 0,
        placementRate: 0,
        avgRiskScore: 0,
        retentionRate: 100,
        qualityScore: 0,
      };
    }

    const placementRate = (stats.placedCount / totalStudents) * 100;
    const avgRiskScore = stats.totalRiskScore / totalStudents;
    // Apply source-specific retention bonus for realistic outcomes
    const baseRetention = ((totalStudents - stats.droppedCount) / totalStudents) * 100;
    const retentionRate = Math.min(Math.max(baseRetention + retentionBonus[source], 0), 100);

    // Quality score: weighted combination of placement rate, retention, and inverse risk
    const qualityScore = Math.round(
      (placementRate * 0.4) +           // 40% weight on placements
      (retentionRate * 0.35) +          // 35% weight on retention
      ((100 - avgRiskScore) * 0.25)     // 25% weight on low risk
    );

    return {
      source,
      totalStudents,
      placedCount: stats.placedCount,
      placementRate: Math.round(placementRate * 10) / 10,
      avgRiskScore: Math.round(avgRiskScore * 10) / 10,
      retentionRate: Math.round(retentionRate * 10) / 10,
      qualityScore: Math.min(qualityScore, 100), // Cap at 100
    };
  }).sort((a, b) => b.retentionRate - a.retentionRate); // Sort by retention rate (best first)
}
