/**
 * Generate Seed Data Script
 *
 * This script generates all mock data and exports it to JSON files
 * for easy migration between Azure accounts.
 *
 * Usage: node scripts/generate-seed-data.js
 */

const fs = require('fs');
const path = require('path');

// Ensure seed-data directory exists
const seedDataDir = path.join(__dirname, 'seed-data');
if (!fs.existsSync(seedDataDir)) {
  fs.mkdirSync(seedDataDir, { recursive: true });
}

// ==================== CENTRES DATA ====================
const MAGIC_BUS_CENTRES = [
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

const INCOME_BRACKETS = [
  { value: 'less_1_lakh', label: '< ₹1 Lakh', eligible: true },
  { value: '1_2_lakhs', label: '₹1 - 2 Lakhs', eligible: true },
  { value: '2_3_lakhs', label: '₹2 - 3 Lakhs', eligible: true },
  { value: '3_3.5_lakhs', label: '₹3 - 3.5 Lakhs', eligible: true },
  { value: 'above_3.5_lakhs', label: '> ₹3.5 Lakhs', eligible: false },
];

const EDUCATION_LEVELS = [
  'Below 10th',
  '10th Pass',
  '12th Pass',
  'ITI/Diploma',
  'Graduate',
  'Post Graduate'
];

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];

const PIN_COORDINATES = {
  '600116': { lat: 13.0382, lng: 80.1565 },
  '600095': { lat: 13.0570, lng: 80.1650 },
  '600089': { lat: 13.0310, lng: 80.1810 },
  '600087': { lat: 13.0470, lng: 80.1720 },
  '600122': { lat: 13.0260, lng: 80.1200 },
  '600026': { lat: 13.0250, lng: 80.2000 },
  '600077': { lat: 13.0700, lng: 80.1800 },
  '600069': { lat: 13.0100, lng: 80.1100 },
  '600123': { lat: 13.0150, lng: 80.1050 },
};

// ==================== STUDENT MOCK DATA ====================
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

const SCHOOLS = [
  'Government Higher Secondary School',
  'Kendriya Vidyalaya',
  'Jawahar Navodaya Vidyalaya',
  'Municipal Corporation School',
  'State Board High School',
  'Zilla Parishad High School',
  'Model School',
  'Central School',
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

// Utility functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRandomDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysAgo));
  return date.toISOString();
}

function generateStudent(index) {
  const isFemale = Math.random() > 0.45;
  const gender = isFemale ? 'Female' : 'Male';
  const firstName = randomElement(isFemale ? FIRST_NAMES_FEMALE : FIRST_NAMES_MALE);
  const lastName = randomElement(LAST_NAMES);
  const name = `${firstName} ${lastName}`;
  const centre = randomElement(MAGIC_BUS_CENTRES);
  const skills = randomElements(SKILLS_POOL, randomInt(2, 5));
  const aspirations = randomElements(ASPIRATIONS_POOL, randomInt(1, 3));

  return {
    id: `STU${String(index + 1).padStart(4, '0')}`,
    name,
    age: String(randomInt(18, 28)),
    gender,
    school: randomElement(SCHOOLS),
    grade: `${randomInt(10, 12)}th Pass`,
    contact_phone: `+91 ${randomInt(70000, 99999)}${randomInt(10000, 99999)}`,
    contact_email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    education_level: randomElement(['10th Pass', '12th Pass', 'Graduate', 'Diploma']),
    status: randomElement(['Active', 'Matched', 'Placed', 'Onboarding']),
    skills: skills.join(', '),
    aspirations: aspirations.join(', '),
    enrolled_date: generateRandomDate(180),
    counsellor_id: `CNSL${String(randomInt(1, 5)).padStart(3, '0')}`,
    centreId: centre.id,
    centreName: centre.name,
  };
}

// ==================== PROGRAMMES DATA ====================
const PROGRAMMES = [
  {
    id: 'PRG001',
    name: 'Retail Sales Associate',
    category: 'Retail',
    description: 'Train to become a retail sales professional with customer service excellence',
    required_skills: 'Communication, Customer Service, Basic Math',
    education_level: '10th Pass',
    duration_months: '3',
    certification: 'NSDC Certified',
    employment_rate: '85',
    avg_salary: '15000'
  },
  {
    id: 'PRG002',
    name: 'IT Support Technician',
    category: 'IT',
    description: 'Learn computer hardware, software troubleshooting and IT support skills',
    required_skills: 'Computer Basics, Problem Solving, English Speaking',
    education_level: '12th Pass',
    duration_months: '4',
    certification: 'CompTIA Certified',
    employment_rate: '78',
    avg_salary: '18000'
  },
  {
    id: 'PRG003',
    name: 'Healthcare Assistant',
    category: 'Healthcare',
    description: 'Training for basic healthcare support roles in hospitals and clinics',
    required_skills: 'Healthcare Basics, Communication, Team Work',
    education_level: '12th Pass',
    duration_months: '6',
    certification: 'State Health Board Certified',
    employment_rate: '82',
    avg_salary: '16000'
  },
  {
    id: 'PRG004',
    name: 'Hospitality Professional',
    category: 'Hospitality',
    description: 'Comprehensive training for hotel and restaurant industry roles',
    required_skills: 'Hospitality, Customer Service, Communication',
    education_level: '10th Pass',
    duration_months: '3',
    certification: 'FSSAI Certified',
    employment_rate: '80',
    avg_salary: '14000'
  },
  {
    id: 'PRG005',
    name: 'Data Entry Operator',
    category: 'IT',
    description: 'Learn typing, MS Office and data management skills',
    required_skills: 'Computer Basics, Data Entry, MS Office',
    education_level: '10th Pass',
    duration_months: '2',
    certification: 'Microsoft Office Certified',
    employment_rate: '88',
    avg_salary: '12000'
  },
  {
    id: 'PRG006',
    name: 'Banking & Financial Services',
    category: 'Banking',
    description: 'Prepare for entry-level banking and financial services roles',
    required_skills: 'Mathematics, Communication, Computer Basics',
    education_level: 'Graduate',
    duration_months: '4',
    certification: 'IIBF Certified',
    employment_rate: '75',
    avg_salary: '20000'
  },
  {
    id: 'PRG007',
    name: 'Electrical Technician',
    category: 'Technical',
    description: 'Technical training for electrical maintenance and installation',
    required_skills: 'Electrical Basics, Problem Solving, Mathematics',
    education_level: 'ITI/Diploma',
    duration_months: '6',
    certification: 'ITI Certified',
    employment_rate: '72',
    avg_salary: '17000'
  },
  {
    id: 'PRG008',
    name: 'Customer Service Executive',
    category: 'BPO',
    description: 'Training for call center and customer support roles',
    required_skills: 'Communication, English Speaking, Customer Service',
    education_level: '12th Pass',
    duration_months: '2',
    certification: 'NASSCOM Certified',
    employment_rate: '90',
    avg_salary: '16000'
  },
  {
    id: 'PRG009',
    name: 'Automotive Mechanic',
    category: 'Technical',
    description: 'Learn vehicle maintenance, repair and diagnostic skills',
    required_skills: 'Mechanical Skills, Problem Solving, Team Work',
    education_level: 'ITI/Diploma',
    duration_months: '6',
    certification: 'ASDC Certified',
    employment_rate: '76',
    avg_salary: '15000'
  },
  {
    id: 'PRG010',
    name: 'Digital Marketing Associate',
    category: 'IT',
    description: 'Learn social media, SEO and digital marketing fundamentals',
    required_skills: 'Computer Basics, Communication, English Speaking',
    education_level: 'Graduate',
    duration_months: '3',
    certification: 'Google Certified',
    employment_rate: '70',
    avg_salary: '18000'
  }
];

// ==================== JOBS DATA ====================
const JOBS = [
  {
    id: 'JOB001',
    title: 'Retail Sales Executive',
    company: 'Reliance Retail',
    location: 'Chennai',
    industry: 'Retail',
    job_type: 'Full-time',
    required_skills: 'Communication, Customer Service, Retail Skills',
    education_level: '10th Pass',
    salary_min: '12000',
    salary_max: '18000',
    openings: '15',
    posted_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active'
  },
  {
    id: 'JOB002',
    title: 'IT Support Associate',
    company: 'Wipro',
    location: 'Chennai',
    industry: 'IT',
    job_type: 'Full-time',
    required_skills: 'Computer Basics, Problem Solving, Communication',
    education_level: '12th Pass',
    salary_min: '15000',
    salary_max: '22000',
    openings: '10',
    posted_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active'
  },
  {
    id: 'JOB003',
    title: 'Hospital Attendant',
    company: 'Apollo Hospitals',
    location: 'Chennai',
    industry: 'Healthcare',
    job_type: 'Full-time',
    required_skills: 'Healthcare Basics, Communication, Team Work',
    education_level: '12th Pass',
    salary_min: '14000',
    salary_max: '20000',
    openings: '8',
    posted_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active'
  },
  {
    id: 'JOB004',
    title: 'Front Desk Executive',
    company: 'Taj Hotels',
    location: 'Chennai',
    industry: 'Hospitality',
    job_type: 'Full-time',
    required_skills: 'Hospitality, Communication, English Speaking',
    education_level: '12th Pass',
    salary_min: '16000',
    salary_max: '24000',
    openings: '5',
    posted_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active'
  },
  {
    id: 'JOB005',
    title: 'Data Entry Operator',
    company: 'TCS',
    location: 'Chennai',
    industry: 'IT',
    job_type: 'Full-time',
    required_skills: 'Data Entry, MS Office, Computer Basics',
    education_level: '10th Pass',
    salary_min: '10000',
    salary_max: '15000',
    openings: '20',
    posted_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active'
  },
  {
    id: 'JOB006',
    title: 'Bank Teller',
    company: 'HDFC Bank',
    location: 'Chennai',
    industry: 'Banking',
    job_type: 'Full-time',
    required_skills: 'Mathematics, Communication, Customer Service',
    education_level: 'Graduate',
    salary_min: '18000',
    salary_max: '28000',
    openings: '6',
    posted_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active'
  },
  {
    id: 'JOB007',
    title: 'Electrician',
    company: 'L&T Construction',
    location: 'Chennai',
    industry: 'Construction',
    job_type: 'Full-time',
    required_skills: 'Electrical Basics, Problem Solving, Team Work',
    education_level: 'ITI/Diploma',
    salary_min: '15000',
    salary_max: '22000',
    openings: '12',
    posted_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active'
  },
  {
    id: 'JOB008',
    title: 'Customer Care Executive',
    company: 'Amazon',
    location: 'Chennai',
    industry: 'BPO',
    job_type: 'Full-time',
    required_skills: 'Communication, English Speaking, Customer Service',
    education_level: '12th Pass',
    salary_min: '14000',
    salary_max: '20000',
    openings: '25',
    posted_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active'
  },
  {
    id: 'JOB009',
    title: 'Automobile Technician',
    company: 'Maruti Suzuki',
    location: 'Chennai',
    industry: 'Automotive',
    job_type: 'Full-time',
    required_skills: 'Mechanical Skills, Problem Solving, Team Work',
    education_level: 'ITI/Diploma',
    salary_min: '13000',
    salary_max: '19000',
    openings: '8',
    posted_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active'
  },
  {
    id: 'JOB010',
    title: 'Digital Marketing Intern',
    company: 'Zoho',
    location: 'Chennai',
    industry: 'IT',
    job_type: 'Internship',
    required_skills: 'Computer Basics, Communication, English Speaking',
    education_level: 'Graduate',
    salary_min: '12000',
    salary_max: '18000',
    openings: '4',
    posted_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active'
  }
];

// ==================== COUNSELLORS DATA ====================
const COUNSELLORS = [
  {
    id: 'CNSL001',
    name: 'Dr. Priya Krishnan',
    email: 'priya.krishnan@magicbus.org',
    phone: '+91 9876543210',
    centreId: 'CTR001',
    centreName: 'Magic Bus Porur Centre',
    assignedStudents: 12
  },
  {
    id: 'CNSL002',
    name: 'Rajesh Venkataraman',
    email: 'rajesh.v@magicbus.org',
    phone: '+91 9876543211',
    centreId: 'CTR002',
    centreName: 'Magic Bus Ramapuram Centre',
    assignedStudents: 10
  },
  {
    id: 'CNSL003',
    name: 'Meena Sundaram',
    email: 'meena.s@magicbus.org',
    phone: '+91 9876543212',
    centreId: 'CTR003',
    centreName: 'Magic Bus Valasaravakkam Centre',
    assignedStudents: 8
  },
  {
    id: 'CNSL004',
    name: 'Arun Kumar',
    email: 'arun.k@magicbus.org',
    phone: '+91 9876543213',
    centreId: 'CTR004',
    centreName: 'Magic Bus Maduravoyal Centre',
    assignedStudents: 15
  },
  {
    id: 'CNSL005',
    name: 'Lakshmi Narayanan',
    email: 'lakshmi.n@magicbus.org',
    phone: '+91 9876543214',
    centreId: 'CTR005',
    centreName: 'Magic Bus Mangadu Centre',
    assignedStudents: 6
  }
];

// ==================== GENERATE AND SAVE ====================
console.log('Generating seed data...\n');

// Generate students
const students = Array.from({ length: 60 }, (_, i) => generateStudent(i));
console.log(`Generated ${students.length} students`);

// Save all data
const dataFiles = {
  'centres.json': {
    centres: MAGIC_BUS_CENTRES,
    incomeBrackets: INCOME_BRACKETS,
    educationLevels: EDUCATION_LEVELS,
    genderOptions: GENDER_OPTIONS,
    pinCoordinates: PIN_COORDINATES
  },
  'students.json': students,
  'programmes.json': PROGRAMMES,
  'jobs.json': JOBS,
  'counsellors.json': COUNSELLORS
};

for (const [filename, data] of Object.entries(dataFiles)) {
  const filepath = path.join(seedDataDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  console.log(`Saved ${filepath}`);
}

// Also generate CSV files for backward compatibility
console.log('\nGenerating CSV files...\n');

// Students CSV
const studentHeaders = ['id', 'name', 'age', 'gender', 'school', 'grade', 'contact_phone', 'contact_email', 'education_level', 'status', 'skills', 'aspirations', 'enrolled_date', 'counsellor_id'];
const studentsCsv = [
  studentHeaders.join(','),
  ...students.map(s => studentHeaders.map(h => `"${s[h]}"`).join(','))
].join('\n');
fs.writeFileSync(path.join(seedDataDir, 'students.csv'), studentsCsv);
console.log('Saved students.csv');

// Programmes CSV
const programmeHeaders = ['id', 'name', 'category', 'description', 'required_skills', 'education_level', 'duration_months', 'certification', 'employment_rate', 'avg_salary'];
const programmesCsv = [
  programmeHeaders.join(','),
  ...PROGRAMMES.map(p => programmeHeaders.map(h => `"${p[h]}"`).join(','))
].join('\n');
fs.writeFileSync(path.join(seedDataDir, 'career_pathways.csv'), programmesCsv);
console.log('Saved career_pathways.csv');

// Jobs CSV
const jobHeaders = ['id', 'title', 'company', 'location', 'industry', 'job_type', 'required_skills', 'education_level', 'salary_min', 'salary_max', 'openings', 'posted_date', 'status'];
const jobsCsv = [
  jobHeaders.join(','),
  ...JOBS.map(j => jobHeaders.map(h => `"${j[h]}"`).join(','))
].join('\n');
fs.writeFileSync(path.join(seedDataDir, 'jobs.csv'), jobsCsv);
console.log('Saved jobs.csv');

console.log('\n✓ Seed data generation complete!');
console.log(`\nFiles saved in: ${seedDataDir}`);
