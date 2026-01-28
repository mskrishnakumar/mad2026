'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, CheckCircle, Loader2, Home, Users, PhoneCall } from 'lucide-react';
import Link from 'next/link';

interface FormData {
  name: string;
  phone: string;
  email: string;
  organization: string;
  supportTypes: string[];
}

const initialFormData: FormData = {
  name: '',
  phone: '',
  email: '',
  organization: '',
  supportTypes: [],
};

const SUPPORT_OPTIONS = [
  {
    id: 'mentor_post_placement',
    label: 'Mentor students post-placement',
    description: 'Guide and support students who have been placed in jobs, helping them succeed in their new careers.',
    icon: Users,
  },
  {
    id: 'support_followups',
    label: 'Support with follow-ups',
    description: 'Help track student progress through regular check-ins and follow-up calls.',
    icon: PhoneCall,
  },
];

export default function VolunteerSignupPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [volunteerId, setVolunteerId] = useState<string | null>(null);

  function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function toggleSupportType(typeId: string) {
    setFormData(prev => ({
      ...prev,
      supportTypes: prev.supportTypes.includes(typeId)
        ? prev.supportTypes.filter(t => t !== typeId)
        : [...prev.supportTypes, typeId]
    }));
  }

  function canSubmit(): boolean {
    return !!(
      formData.name &&
      formData.phone &&
      formData.email &&
      formData.organization &&
      formData.supportTypes.length > 0
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit registration');
      }

      const result = await response.json();
      setVolunteerId(result.id);
      setIsComplete(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit registration');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Success Page
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-purple-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You for Volunteering!</h1>
              <p className="text-muted-foreground">
                Your application has been submitted successfully
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center justify-center gap-2 text-purple-700 font-medium mb-2">
                <Heart className="h-5 w-5" />
                Pending Approval
              </div>
              <p className="text-sm text-purple-600">
                Our team will review your application and contact you within 2-3 business days.
              </p>
            </div>

            {volunteerId && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-muted-foreground">Your Volunteer ID</p>
                <p className="text-lg font-mono font-bold text-gray-900">{volunteerId}</p>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <p className="text-sm text-muted-foreground">Selected support areas:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {formData.supportTypes.map(type => {
                  const option = SUPPORT_OPTIONS.find(o => o.id === type);
                  return option ? (
                    <span key={type} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                      {option.label}
                    </span>
                  ) : null;
                })}
              </div>
            </div>

            <Button asChild className="mt-4">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-4">
      <div className="max-w-xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-purple-600 to-violet-500 rounded-xl shadow-lg flex items-center justify-center">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Volunteer Sign Up</h1>
          <p className="text-muted-foreground">Join us in transforming lives through mentorship</p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Details</CardTitle>
            <CardDescription>Tell us about yourself and how you'd like to help</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Full Name *</label>
                  <Input
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Phone Number *</label>
                    <Input
                      placeholder="+91-XXXXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email *</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Organization *</label>
                  <Input
                    placeholder="Company or organization name"
                    value={formData.organization}
                    onChange={(e) => updateField('organization', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Support Type Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium block">How would you like to support? *</label>
                <p className="text-sm text-muted-foreground">Select one or both options</p>

                <div className="space-y-3">
                  {SUPPORT_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isSelected = formData.supportTypes.includes(option.id);

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => toggleSupportType(option.id)}
                        className={`
                          w-full p-4 rounded-xl border-2 text-left transition-all duration-200
                          ${isSelected
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                          }
                        `}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                            ${isSelected ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-500'}
                          `}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">{option.label}</h4>
                              {isSelected && (
                                <CheckCircle className="h-4 w-4 text-purple-500" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                  {submitError}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/">
                    Back to Home
                  </Link>
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  disabled={!canSubmit() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 h-4 w-4" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>A Magic Bus Initiative | Built for Hack-a-Difference 2026</p>
        </div>
      </div>
    </div>
  );
}
