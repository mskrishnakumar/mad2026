'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  User, Mail, Phone, MapPin, GraduationCap, Building2, Edit, MessageSquare,
  Save, X, IndianRupee, FileText, Target, Briefcase, Wifi, Smartphone
} from 'lucide-react';
import { EDUCATION_LEVELS, GENDER_OPTIONS, INCOME_BRACKETS } from '@/data/centres';

const REFERRAL_SOURCES = [
  'Community Centre',
  'Referred by Friend',
  'Referred by Alumni',
  'Saw Newspaper Ad',
  'Social Media',
  'Other',
];

const MOBILE_TYPES = [
  { value: 'smartphone', label: 'Smart Phone' },
  { value: 'basic', label: 'Basic Phone' },
];

const COMMUNICATION_MODES = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'sms', label: 'SMS' },
  { value: 'email', label: 'Email' },
];

// Example profiles to demonstrate eligibility scenarios
// Toggle between 'eligible' and 'ineligible' to see different states
const DEMO_MODE: 'eligible' | 'ineligible' = 'eligible';

const eligibleProfile = {
  // Personal Info
  name: 'Rahul Kumar',
  dateOfBirth: '2005-03-15', // Age: ~21 (eligible: 18-25)
  gender: 'Male',
  phone: '+91-9876543210',
  email: 'rahul.kumar@student.magicbus.org',
  address: '45, Gandhi Street, Porur',
  pinCode: '600116',
  educationLevel: '12th Pass',
  // Connectivity
  hasInternet: true,
  hasMobile: true,
  mobileType: 'smartphone',
  preferredCommunication: 'whatsapp',
  // Referral
  referralSource: 'Community Centre',
  // Additional Info
  firstGenerationGraduate: true,
  careerAspirations: 'I want to become a software developer and help my family. I am interested in learning programming and web development skills.',
  // Eligibility
  annualFamilyIncome: 'below_1_lakh', // Eligible: below 3.5 lakhs
  currentlyEmployedOrTraining: false, // Eligible: not employed
  // Documents
  aadhaarVerified: true,
  bplCardUploaded: true,
  rationCardUploaded: false,
  // Centre
  centre: 'Magic Bus Porur Centre',
  centreId: 'porur',
  // Registration
  registrationId: 'REG0001',
  registrationDate: '20 Jan 2026',
  status: 'Verified',
};

const ineligibleProfile = {
  // Personal Info
  name: 'Amit Sharma',
  dateOfBirth: '1995-06-20', // Age: ~30 (NOT eligible: outside 18-25)
  gender: 'Male',
  phone: '+91-9123456789',
  email: 'amit.sharma@email.com',
  address: '12, MG Road, Velachery',
  pinCode: '600042',
  educationLevel: 'Graduate',
  // Connectivity
  hasInternet: true,
  hasMobile: true,
  mobileType: 'smartphone',
  preferredCommunication: 'whatsapp',
  // Referral
  referralSource: 'Social Media',
  // Additional Info
  firstGenerationGraduate: false,
  careerAspirations: 'I want to transition from retail to IT sector and learn new skills for better career growth.',
  // Eligibility
  annualFamilyIncome: 'above_3_5_lakh', // NOT Eligible: above 3.5 lakhs
  currentlyEmployedOrTraining: true, // NOT Eligible: currently employed
  // Documents
  aadhaarVerified: true,
  bplCardUploaded: false,
  rationCardUploaded: false,
  // Centre
  centre: 'Magic Bus Velachery Centre',
  centreId: 'velachery',
  // Registration
  registrationId: 'REG0042',
  registrationDate: '25 Jan 2026',
  status: 'Under Review',
};

// Select profile based on demo mode
const initialProfile = DEMO_MODE === 'eligible' ? eligibleProfile : ineligibleProfile;

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [editedProfile, setEditedProfile] = useState(initialProfile);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setProfile(editedProfile);
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleChange = (field: keyof typeof profile, value: string | boolean) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const currentProfile = isEditing ? editedProfile : profile;

  // Get income bracket label
  const incomeBracket = INCOME_BRACKETS.find(b => b.value === currentProfile.annualFamilyIncome);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(currentProfile.dateOfBirth);

  // Eligibility checks
  const isAgeEligible = age >= 18 && age <= 25;
  const isIncomeEligible = incomeBracket?.eligible ?? true;
  const isEmploymentEligible = !currentProfile.currentlyEmployedOrTraining;
  const isFullyEligible = isAgeEligible && isIncomeEligible && isEmploymentEligible;

  // Collect eligibility issues
  const eligibilityIssues: string[] = [];
  if (!isAgeEligible) {
    eligibilityIssues.push(`Age ${age} is outside the eligible range (18-25 years)`);
  }
  if (!isIncomeEligible) {
    eligibilityIssues.push('Family income exceeds ₹3.5 Lakhs per annum');
  }
  if (!isEmploymentEligible) {
    eligibilityIssues.push('Currently employed or enrolled in another training programme');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-muted-foreground">View and manage your profile information</p>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {currentProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={editedProfile.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="font-semibold text-lg mb-1"
                  />
                ) : (
                  <h3 className="font-semibold text-lg">{currentProfile.name}</h3>
                )}
                <p className="text-sm text-muted-foreground">Registration ID: {currentProfile.registrationId}</p>
                <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  {currentProfile.status}
                </span>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                {isEditing ? (
                  <Input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="h-8"
                  />
                ) : (
                  <span>{currentProfile.email}</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                {isEditing ? (
                  <Input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="h-8"
                  />
                ) : (
                  <span>{currentProfile.phone}</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                {isEditing ? (
                  <div className="flex gap-2 flex-1">
                    <Input
                      value={editedProfile.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="Address"
                      className="h-8"
                    />
                    <Input
                      value={editedProfile.pinCode}
                      onChange={(e) => handleChange('pinCode', e.target.value)}
                      placeholder="PIN"
                      className="h-8 w-24"
                    />
                  </div>
                ) : (
                  <span>{currentProfile.address}, {currentProfile.pinCode}</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Date of Birth</p>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editedProfile.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    className="h-8 mt-1"
                  />
                ) : (
                  <p className="font-medium">{new Date(currentProfile.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Gender</p>
                {isEditing ? (
                  <select
                    className="w-full h-8 px-2 mt-1 rounded-md border border-input bg-background text-sm"
                    value={editedProfile.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                  >
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                ) : (
                  <p className="font-medium">{currentProfile.gender}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Education & Centre */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Education & Centre
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Education Level</p>
                {isEditing ? (
                  <select
                    className="w-full h-8 px-2 mt-1 rounded-md border border-input bg-background text-sm"
                    value={editedProfile.educationLevel}
                    onChange={(e) => handleChange('educationLevel', e.target.value)}
                  >
                    {EDUCATION_LEVELS.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                ) : (
                  <p className="font-medium">{currentProfile.educationLevel}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">First Gen Graduate</p>
                <p className="font-medium">{currentProfile.firstGenerationGraduate ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Registered On</p>
                <p className="font-medium">{currentProfile.registrationDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Employment Status</p>
                <p className={`font-medium ${!isEmploymentEligible ? 'text-red-600' : ''}`}>
                  {currentProfile.currentlyEmployedOrTraining ? 'Employed/Training' : 'Not Employed'}
                  {!isEmploymentEligible && ' (Not Eligible)'}
                </p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Assigned Centre</p>
                  <p className="font-medium">{currentProfile.centre}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connectivity Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Connectivity Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Internet Access</p>
                <div className="flex items-center gap-2 mt-1">
                  <Wifi className={`h-4 w-4 ${currentProfile.hasInternet ? 'text-green-500' : 'text-gray-300'}`} />
                  <p className="font-medium">{currentProfile.hasInternet ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Mobile Phone</p>
                <p className="font-medium">{currentProfile.hasMobile ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Mobile Type</p>
                <p className="font-medium">
                  {MOBILE_TYPES.find(t => t.value === currentProfile.mobileType)?.label || currentProfile.mobileType}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Preferred Communication</p>
                <p className="font-medium">
                  {COMMUNICATION_MODES.find(m => m.value === currentProfile.preferredCommunication)?.label || currentProfile.preferredCommunication}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eligibility & Income */}
        <Card className={!isFullyEligible ? 'border-red-200' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5" />
              Eligibility Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Age</p>
                  <p className={`font-medium ${!isAgeEligible ? 'text-red-600' : ''}`}>
                    {age} years {!isAgeEligible && '(Not Eligible)'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Annual Family Income</p>
                  <p className={`font-medium ${!isIncomeEligible ? 'text-red-600' : 'text-primary'}`}>
                    {incomeBracket?.label || currentProfile.annualFamilyIncome}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Eligibility Status</p>
                {isFullyEligible ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      Eligible for Upskilling Programme
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-block text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                        Not Eligible for Upskilling Programme
                      </span>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                      <p className="text-sm font-medium text-red-700 mb-1">Eligibility Issues:</p>
                      <ul className="text-sm text-red-600 space-y-1">
                        {eligibilityIssues.map((issue, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-400 mt-0.5">•</span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Career Aspirations */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Career Aspirations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <textarea
                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background resize-y"
                value={editedProfile.careerAspirations}
                onChange={(e) => handleChange('careerAspirations', e.target.value)}
                placeholder="Describe your career goals and aspirations..."
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{currentProfile.careerAspirations}</p>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Uploaded Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm">Aadhaar Card</span>
                <span className={`text-xs px-2 py-1 rounded-full ${currentProfile.aadhaarVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {currentProfile.aadhaarVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm">BPL Card</span>
                <span className={`text-xs px-2 py-1 rounded-full ${currentProfile.bplCardUploaded ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {currentProfile.bplCardUploaded ? 'Uploaded' : 'Not Uploaded'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Ration Card</span>
                <span className={`text-xs px-2 py-1 rounded-full ${currentProfile.rationCardUploaded ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {currentProfile.rationCardUploaded ? 'Uploaded' : 'Not Uploaded'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              How You Found Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">
              You learned about Magic Bus Upskilling Programme through:
            </p>
            {isEditing ? (
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={editedProfile.referralSource}
                onChange={(e) => handleChange('referralSource', e.target.value)}
              >
                {REFERRAL_SOURCES.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            ) : (
              <p className="font-medium text-primary">{currentProfile.referralSource}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
