import type {
  StudentExtended,
  PipelineStage,
  RiskFactors,
  StudentAlert,
  EngagementChannel,
  EngagementRecord,
  EngagementChannelStats,
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

// Utility functions
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
    // High-risk profile: poor attendance, far distance (10km+ is concerning), limited connectivity
    return {
      firstWeekAttendance: randomInt(0, 40),
      distanceFromCentreKm: randomInt(10, 25),  // 10km+ triggers risk (reduced from 20-45)
      isFirstGenGraduate: Math.random() > 0.3,
      hasInternet: Math.random() > 0.7,
      hasMobile: Math.random() > 0.3,
      mobileType: Math.random() > 0.6 ? 'basic' : 'smartphone',
      loginAttempts: randomInt(0, 3),
      counsellorContactAttempts: randomInt(3, 8),
      quizScore: randomInt(10, 35),
    };
  }

  // Normal profile with variance - most students within 10km
  return {
    firstWeekAttendance: randomInt(60, 100),
    distanceFromCentreKm: randomInt(1, 9),  // Within acceptable range (reduced from 2-20)
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
 * Generate a single mock extended student
 */
export function generateMockStudent(index: number): StudentExtended {
  const isFemale = Math.random() > 0.45;
  const gender = isFemale ? 'Female' : 'Male';
  const firstName = randomElement(isFemale ? FIRST_NAMES_FEMALE : FIRST_NAMES_MALE);
  const lastName = randomElement(LAST_NAMES);
  const name = `${firstName} ${lastName}`;

  const isHighRisk = Math.random() < 0.2; // 20% high-risk
  const riskFactors = generateRiskFactors(isHighRisk);
  const riskScore = calculateRiskScore(riskFactors);
  const centre = randomElement(CENTRES);

  const skills = randomElements(SKILLS_POOL, randomInt(2, 5));
  const aspirations = randomElements(ASPIRATIONS_POOL, randomInt(1, 3));

  const engagementData = generateEngagementData(riskScore.riskLevel);
  const preferredChannel = engagementData[0]?.channel || 'whatsapp';

  return {
    id: `STU${String(index + 1).padStart(4, '0')}`,
    name,
    age: String(randomInt(18, 28)),
    gender,
    contact_phone: `+91 ${randomInt(70000, 99999)}${randomInt(10000, 99999)}`,
    contact_email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    education_level: randomElement(EDUCATION_LEVELS),
    status: randomElement(['Active', 'Matched', 'Placed', 'Onboarding'] as const),
    skills: skills.join(', '),
    aspirations: aspirations.join(', '),
    enrolled_date: generateRandomDate(180),
    counsellor_id: `CNSL${String(randomInt(1, 5)).padStart(3, '0')}`,
    pipelineStage: getWeightedPipelineStage(),
    riskFactors,
    riskScore,
    lastLoginDate: generateRandomDate(14),
    lastCounsellorContact: generateRandomDate(7),
    centreId: centre.id,
    centreName: centre.name,
    engagementData,
    preferredChannel,
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
    // Candidate 1: DISTANCE FROM CENTRE dominant (Student Onboarding)
    // Only this candidate should show "Far from centre" indicator (10km+ is concerning)
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
      pipelineStage: 'Student Onboarding',
      ...createRiskFactors({
        firstWeekAttendance: 52,          // Just above 50% (~12 pts)
        distanceFromCentreKm: 18,         // DOMINANT: Far from centre - 10km+ (~15 pts max)
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
    },

    // Candidate 2: NO MOBILE & INTERNET dominant (Counselling)
    // Distance is low - should NOT show "Far from centre"
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
        distanceFromCentreKm: 8,          // Close - NO "far" indicator (~4 pts)
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
    },

    // Candidate 3: LOW FIRST WEEK ATTENDANCE dominant (Training)
    // Distance is moderate - should NOT show "Far from centre"
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
        firstWeekAttendance: 15,          // DOMINANT: Very low attendance (~21 pts)
        distanceFromCentreKm: 6,          // Close - NO "far" indicator (~3 pts)
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
    },

    // Candidate 4: POOR QUIZ SCORES dominant (Enrollment)
    // Distance is low - should NOT show "Far from centre" (under 10km)
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
      pipelineStage: 'Enrollment',
      ...createRiskFactors({
        firstWeekAttendance: 58,          // Above 50% (~10 pts)
        distanceFromCentreKm: 5,          // Close - NO "far" indicator (~7 pts)
        isFirstGenGraduate: true,         // +10 pts
        hasInternet: false,               // +10 pts
        hasMobile: true,
        mobileType: 'basic',              // +5 pts
        loginAttempts: 2,                 // Low (~8 pts)
        counsellorContactAttempts: 3,     // Moderate (~6 pts)
        quizScore: 12,                    // DOMINANT: Very poor quiz score (~7 pts)
      }),
      lastLoginDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      lastCounsellorContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      centreId: 'CTR004',
      centreName: 'Magic Bus Centre - Pune',
      engagementData: [
        { channel: 'sms', totalAttempts: 6, successfulContacts: 2, outcome: 'neutral', lastContactDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      ],
      preferredChannel: 'sms',
    },

    // Candidate 5: HIGH COUNSELLOR CONTACT ATTEMPTS - Student Unresponsive (Training)
    // Distance is low - should NOT show "Far from centre" (under 10km)
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
      pipelineStage: 'Training',
      ...createRiskFactors({
        firstWeekAttendance: 55,          // Above 50% (~11 pts)
        distanceFromCentreKm: 7,          // Close - NO "far" indicator (~10 pts)
        isFirstGenGraduate: true,         // +10 pts
        hasInternet: false,               // +10 pts
        hasMobile: true,
        mobileType: 'basic',              // +5 pts
        loginAttempts: 2,                 // Low (~8 pts)
        counsellorContactAttempts: 9,     // DOMINANT: Student unresponsive (~10 pts)
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
