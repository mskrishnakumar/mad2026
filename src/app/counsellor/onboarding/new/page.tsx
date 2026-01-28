'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const steps = [
  { id: 1, title: 'Basic Info', description: 'Name, age, contact details' },
  { id: 2, title: 'Education', description: 'School, grade, academic history' },
  { id: 3, title: 'Skills', description: 'Skills assessment' },
  { id: 4, title: 'Aspirations', description: 'Career interests and goals' },
  { id: 5, title: 'Review', description: 'Review and submit' },
];

export default function NewOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);

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
      <div className="flex items-center justify-between max-w-3xl">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.id}
              </div>
              <span className="text-xs mt-2 text-center hidden sm:block">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 sm:w-24 h-1 mx-2 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Placeholder form content */}
          <div className="min-h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">
              Step {currentStep} form fields will be implemented here
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
              disabled={currentStep === 1}
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
              <Button className="bg-green-600 hover:bg-green-700">
                Submit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
