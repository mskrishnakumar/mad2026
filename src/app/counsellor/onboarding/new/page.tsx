'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Check, User, GraduationCap, Wrench, Target, ClipboardCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FormData {
  // Basic Info
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  // Education
  school: string;
  grade: string;
  educationLevel: string;
  academicPerformance: string;
  // Skills
  skills: string[];
  // Aspirations
  careerInterests: string[];
  goals: string;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  age: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  school: '',
  grade: '',
  educationLevel: '',
  academicPerformance: '',
  skills: [],
  careerInterests: [],
  goals: '',
};

const skillOptions = [
  'Communication', 'Computer Basics', 'English', 'Mathematics', 'Problem Solving',
  'IT', 'Programming', 'Healthcare', 'First Aid', 'Biology',
  'Mechanics', 'Electrical', 'Drawing', 'Art', 'Design',
  'Retail', 'Customer Service', 'Hospitality', 'Cooking', 'Tailoring',
  'Accounting', 'Excel', 'Research', 'Leadership', 'Teamwork'
];

const careerOptions = [
  'Software Developer', 'Data Analyst', 'IT Professional', 'Teacher', 'Nurse',
  'Healthcare Worker', 'Doctor', 'Accountant', 'Business Owner', 'Engineer',
  'Mechanic', 'Electrician', 'Chef', 'Hotel Manager', 'Fashion Designer',
  'Graphic Designer', 'Sales Manager', 'Financial Analyst', 'Entrepreneur'
];

const steps = [
  { id: 1, title: 'Basic Info', description: 'Name, age, contact details', icon: User },
  { id: 2, title: 'Education', description: 'School, grade, academic history', icon: GraduationCap },
  { id: 3, title: 'Skills', description: 'Skills assessment', icon: Wrench },
  { id: 4, title: 'Aspirations', description: 'Career interests and goals', icon: Target },
  { id: 5, title: 'Review', description: 'Review and submit', icon: ClipboardCheck },
];

export default function NewOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateField(field: keyof FormData, value: string | string[]) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function toggleSkill(skill: string) {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  }

  function toggleCareer(career: string) {
    setFormData(prev => ({
      ...prev,
      careerInterests: prev.careerInterests.includes(career)
        ? prev.careerInterests.filter(c => c !== career)
        : [...prev.careerInterests, career]
    }));
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const studentData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        age: formData.age,
        gender: formData.gender,
        school: formData.school,
        grade: formData.grade,
        contact_phone: formData.phone,
        contact_email: formData.email,
        education_level: formData.educationLevel,
        status: 'Onboarding',
        skills: formData.skills,
        aspirations: formData.careerInterests,
      };

      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create student');
      }

      const newStudent = await response.json();
      alert(`Student ${newStudent.name} (${newStudent.id}) registered successfully!`);
      router.push('/counsellor/students');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to save student');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/counsellor/onboarding">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Student Onboarding</h1>
          <p className="text-muted-foreground">Complete all steps to register a new student</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : currentStep === step.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span className="text-xs mt-2 text-center hidden sm:block font-medium">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-16 lg:w-24 h-1 mx-1 sm:mx-2 transition-colors ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Form Card */}
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {(() => { const Icon = steps[currentStep - 1].icon; return <Icon className="h-5 w-5" />; })()}
            {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">First Name *</label>
                <Input
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Last Name *</label>
                <Input
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Age *</label>
                <Input
                  type="number"
                  placeholder="Enter age"
                  value={formData.age}
                  onChange={(e) => updateField('age', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Gender</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={formData.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Phone Number *</label>
                <Input
                  placeholder="+91-XXXXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input
                  type="email"
                  placeholder="student@email.com"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1 block">Address</label>
                <Input
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 2: Education */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1 block">School Name *</label>
                <Input
                  placeholder="Enter school name"
                  value={formData.school}
                  onChange={(e) => updateField('school', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Current Grade *</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={formData.grade}
                  onChange={(e) => updateField('grade', e.target.value)}
                >
                  <option value="">Select grade</option>
                  <option value="8th">8th Standard</option>
                  <option value="9th">9th Standard</option>
                  <option value="10th">10th Standard</option>
                  <option value="11th">11th Standard</option>
                  <option value="12th">12th Standard</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Education Level *</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={formData.educationLevel}
                  onChange={(e) => updateField('educationLevel', e.target.value)}
                >
                  <option value="">Select level</option>
                  <option value="Secondary">Secondary (8th-10th)</option>
                  <option value="Higher Secondary">Higher Secondary (11th-12th)</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1 block">Academic Performance</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={formData.academicPerformance}
                  onChange={(e) => updateField('academicPerformance', e.target.value)}
                >
                  <option value="">Select performance level</option>
                  <option value="Excellent">Excellent (90%+)</option>
                  <option value="Good">Good (70-89%)</option>
                  <option value="Average">Average (50-69%)</option>
                  <option value="Below Average">Below Average (&lt;50%)</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Skills */}
          {currentStep === 3 && (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Select all skills that the student possesses or shows aptitude for:
              </p>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map((skill) => (
                  <Badge
                    key={skill}
                    variant={formData.skills.includes(skill) ? "default" : "outline"}
                    className={`cursor-pointer text-sm py-2 px-3 ${
                      formData.skills.includes(skill)
                        ? 'bg-teal-500 hover:bg-teal-600'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => toggleSkill(skill)}
                  >
                    {formData.skills.includes(skill) && <Check className="h-3 w-3 mr-1" />}
                    {skill}
                  </Badge>
                ))}
              </div>
              {formData.skills.length > 0 && (
                <p className="text-sm text-muted-foreground mt-4">
                  Selected: {formData.skills.length} skills
                </p>
              )}
            </div>
          )}

          {/* Step 4: Aspirations */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Select career paths the student is interested in:
                </p>
                <div className="flex flex-wrap gap-2">
                  {careerOptions.map((career) => (
                    <Badge
                      key={career}
                      variant={formData.careerInterests.includes(career) ? "default" : "outline"}
                      className={`cursor-pointer text-sm py-2 px-3 ${
                        formData.careerInterests.includes(career)
                          ? 'bg-blue-500 hover:bg-blue-600'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => toggleCareer(career)}
                    >
                      {formData.careerInterests.includes(career) && <Check className="h-3 w-3 mr-1" />}
                      {career}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Additional Goals & Notes</label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background resize-none"
                  placeholder="Any additional career goals, dreams, or notes about the student..."
                  value={formData.goals}
                  onChange={(e) => updateField('goals', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="text-muted-foreground">Name:</span> {formData.firstName} {formData.lastName}</p>
                  <p><span className="text-muted-foreground">Age:</span> {formData.age || '-'}</p>
                  <p><span className="text-muted-foreground">Gender:</span> {formData.gender || '-'}</p>
                  <p><span className="text-muted-foreground">Phone:</span> {formData.phone || '-'}</p>
                  <p><span className="text-muted-foreground">Email:</span> {formData.email || '-'}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Education</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="text-muted-foreground">School:</span> {formData.school || '-'}</p>
                  <p><span className="text-muted-foreground">Grade:</span> {formData.grade || '-'}</p>
                  <p><span className="text-muted-foreground">Level:</span> {formData.educationLevel || '-'}</p>
                  <p><span className="text-muted-foreground">Performance:</span> {formData.academicPerformance || '-'}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Skills ({formData.skills.length})</h4>
                <div className="flex flex-wrap gap-1">
                  {formData.skills.length > 0 ? formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  )) : <p className="text-sm text-muted-foreground">No skills selected</p>}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Career Interests ({formData.careerInterests.length})</h4>
                <div className="flex flex-wrap gap-1">
                  {formData.careerInterests.length > 0 ? formData.careerInterests.map((career) => (
                    <Badge key={career} variant="secondary">{career}</Badge>
                  )) : <p className="text-sm text-muted-foreground">No interests selected</p>}
                </div>
                {formData.goals && (
                  <p className="text-sm mt-2"><span className="text-muted-foreground">Goals:</span> {formData.goals}</p>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              {submitError}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            {currentStep < 5 ? (
              <Button onClick={() => setCurrentStep((s) => Math.min(5, s + 1))}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Submit & Register Student
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
