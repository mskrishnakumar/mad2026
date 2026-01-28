'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, User, MapPin, Languages, GraduationCap, Briefcase } from 'lucide-react';

interface FormData {
  name: string;
  age: string;
  gender: string;
  address: string;
  city: string;
  languagesKnown: string;
  educationalQualification: string;
  employmentDetails: string;
}

export default function VolunteerOnboardingPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    gender: '',
    address: '',
    city: '',
    languagesKnown: '',
    educationalQualification: '',
    employmentDetails: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  // Success screen after submission
  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">
              Onboarding Complete!
            </h2>
            <p className="text-green-700 mb-6">
              Thank you for joining as a volunteer. Your information has been successfully submitted.
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              className="bg-green-600 hover:bg-green-700"
            >
              Update Information
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Volunteer Onboarding</h1>
        <p className="text-muted-foreground">
          Please complete your profile to start volunteering with Mission Possible
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Personal Information</CardTitle>
            </div>
            <CardDescription>Basic information about you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            {/* Age and Gender Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="Enter your age"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle>Address Information</CardTitle>
            </div>
            <CardDescription>Where are you located?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Enter your full address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Enter your city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              <CardTitle>Languages Known</CardTitle>
            </div>
            <CardDescription>What languages can you speak?</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Languages <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g., English, Hindi, Tamil"
                value={formData.languagesKnown}
                onChange={(e) => handleInputChange('languagesKnown', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter languages separated by commas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <CardTitle>Educational Qualification</CardTitle>
            </div>
            <CardDescription>Your educational background</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Highest Qualification <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.educationalQualification}
                onChange={(e) => handleInputChange('educationalQualification', e.target.value)}
                required
              >
                <option value="">Select qualification</option>
                <option value="high-school">High School (10th)</option>
                <option value="intermediate">Intermediate (12th)</option>
                <option value="diploma">Diploma</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="phd">PhD</option>
                <option value="other">Other</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Employment */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <CardTitle>Employment Details</CardTitle>
            </div>
            <CardDescription>Your current employment status and details</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employment Information <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px]"
                placeholder="Please describe your current employment status, job role, company name, or mention if you are a student/unemployed"
                value={formData.employmentDetails}
                onChange={(e) => handleInputChange('employmentDetails', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                e.g., "Working as Software Engineer at ABC Company" or "Student pursuing MBA" or "Currently unemployed"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="px-8"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Onboarding Form'}
          </Button>
        </div>
      </form>
    </div>
  );
}
