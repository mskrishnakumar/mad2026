'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUpload } from '@/components/ui/FileUpload';
import { CentreMap } from '@/components/map/CentreMap';
import {
  ArrowLeft, ArrowRight, Check, User, IndianRupee, FileText, MapPin,
  CheckCircle, AlertTriangle, Loader2, Home, Mic, MicOff
} from 'lucide-react';
import Link from 'next/link';
import {
  MAGIC_BUS_CENTRES, INCOME_BRACKETS, EDUCATION_LEVELS, GENDER_OPTIONS, findNearestCentre
} from '@/data/centres';
import { MagicBusCentre } from '@/lib/types/data';

interface FormData {
  // Step 1: Personal Info
  name: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  pinCode: string;
  educationLevel: string;
  // Connectivity questions
  hasInternet: string;
  hasMobile: string;
  mobileType: string;
  preferredCommunication: string;
  // Referral source
  referralSource: string;
  // Additional questions
  firstGenerationGraduate: string;
  careerAspirations: string;
  // Step 2: Eligibility
  annualFamilyIncome: string;
  currentlyEmployedOrTraining: string;
  // Step 3: Documents
  aadhaarFile: File | null;
  bplFile: File | null;
  rationFile: File | null;
  // Step 4: Centre
  selectedCentreId: string;
  selectedCentreName: string;
}

const initialFormData: FormData = {
  name: '',
  dateOfBirth: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  pinCode: '',
  educationLevel: '',
  hasInternet: '',
  hasMobile: '',
  mobileType: '',
  preferredCommunication: '',
  referralSource: '',
  firstGenerationGraduate: '',
  careerAspirations: '',
  annualFamilyIncome: '',
  currentlyEmployedOrTraining: '',
  aadhaarFile: null,
  bplFile: null,
  rationFile: null,
  selectedCentreId: '',
  selectedCentreName: '',
};

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

type DocumentStatus = 'idle' | 'uploading' | 'validating' | 'success' | 'error';

interface DocumentValidation {
  aadhaar: { status: DocumentStatus; error?: string };
  bpl: { status: DocumentStatus; error?: string };
  ration: { status: DocumentStatus; error?: string };
}

const steps = [
  { id: 1, title: 'Personal Info', description: 'Your basic details', icon: User },
  { id: 2, title: 'Eligibility', description: 'Family income verification', icon: IndianRupee },
  { id: 3, title: 'Documents', description: 'Upload ID documents', icon: FileText },
  { id: 4, title: 'Centre Selection', description: 'Choose your nearest centre', icon: MapPin },
];

export default function StudentRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  // Document validation states
  const [docValidation, setDocValidation] = useState<DocumentValidation>({
    aadhaar: { status: 'idle' },
    bpl: { status: 'idle' },
    ration: { status: 'idle' },
  });

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);

  function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  // Calculate age from date of birth
  function calculateAge(dateOfBirth: string): number | null {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Check age eligibility (18-25 years)
  const candidateAge = calculateAge(formData.dateOfBirth);
  const isAgeEligible = candidateAge !== null ? (candidateAge >= 18 && candidateAge <= 25) : true;

  // Check employment/training eligibility
  const isEmploymentEligible = formData.currentlyEmployedOrTraining !== 'yes';

  // Voice search for career aspirations
  function startVoiceRecording() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const windowWithSpeech = window as any;

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      updateField('careerAspirations', formData.careerAspirations + (formData.careerAspirations ? ' ' : '') + transcript);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  }

  // Check eligibility based on income
  const selectedIncome = INCOME_BRACKETS.find(b => b.value === formData.annualFamilyIncome);
  const isIncomeEligible = selectedIncome ? selectedIncome.eligible : true;

  // Overall eligibility (all criteria must be met)
  const isEligible = isIncomeEligible && isAgeEligible && isEmploymentEligible;

  // Find nearest centre based on PIN code
  const nearestCentre = formData.pinCode ? findNearestCentre(formData.pinCode) : null;

  // Mock AI document validation
  async function validateDocument(type: 'aadhaar' | 'bpl' | 'ration', file: File) {
    setDocValidation(prev => ({
      ...prev,
      [type]: { status: 'validating' }
    }));

    // Simulate AI processing time (1.5-3 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));

    // 30% chance of name mismatch error for Aadhaar
    if (type === 'aadhaar' && Math.random() < 0.3) {
      setDocValidation(prev => ({
        ...prev,
        [type]: {
          status: 'error',
          error: "Name on Aadhaar doesn't match entered name. Please verify and re-upload."
        }
      }));
      return false;
    }

    setDocValidation(prev => ({
      ...prev,
      [type]: { status: 'success' }
    }));
    return true;
  }

  async function handleFileSelect(type: 'aadhaar' | 'bpl' | 'ration', file: File | null) {
    const fieldMap = {
      aadhaar: 'aadhaarFile',
      bpl: 'bplFile',
      ration: 'rationFile',
    } as const;

    updateField(fieldMap[type], file);

    if (file) {
      await validateDocument(type, file);
    } else {
      setDocValidation(prev => ({
        ...prev,
        [type]: { status: 'idle' }
      }));
    }
  }

  function handleCentreSelect(centre: MagicBusCentre) {
    updateField('selectedCentreId', centre.id);
    updateField('selectedCentreName', centre.name);
  }

  // Validation for each step
  function canProceed(): boolean {
    switch (currentStep) {
      case 1:
        const mobileValid = formData.hasMobile === 'no' || (formData.hasMobile === 'yes' && formData.mobileType);
        return !!(
          formData.name &&
          formData.dateOfBirth &&
          formData.gender &&
          formData.phone &&
          formData.pinCode &&
          formData.educationLevel &&
          formData.hasInternet &&
          formData.hasMobile &&
          mobileValid &&
          formData.referralSource &&
          formData.firstGenerationGraduate &&
          formData.careerAspirations
        );
      case 2:
        return !!(formData.annualFamilyIncome && formData.currentlyEmployedOrTraining && isEligible);
      case 3:
        return !!(formData.aadhaarFile && docValidation.aadhaar.status === 'success');
      case 4:
        return !!formData.selectedCentreId;
      default:
        return false;
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const registrationData = {
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        pinCode: formData.pinCode,
        educationLevel: formData.educationLevel,
        hasInternet: formData.hasInternet === 'yes',
        hasMobile: formData.hasMobile === 'yes',
        mobileType: formData.mobileType,
        preferredCommunication: formData.preferredCommunication,
        referralSource: formData.referralSource,
        firstGenerationGraduate: formData.firstGenerationGraduate === 'yes',
        careerAspirations: formData.careerAspirations,
        annualFamilyIncome: formData.annualFamilyIncome,
        currentlyEmployedOrTraining: formData.currentlyEmployedOrTraining === 'yes',
        selectedCentreId: formData.selectedCentreId,
        selectedCentreName: formData.selectedCentreName,
        aadhaarUploaded: !!formData.aadhaarFile,
        bplCardUploaded: !!formData.bplFile,
        rationCardUploaded: !!formData.rationFile,
      };

      const response = await fetch('/api/student-registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit registration');
      }

      const result = await response.json();
      setRegistrationId(result.id);
      setIsComplete(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit registration');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Success/Pending Verification Page
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-amber-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Submitted!</h1>
              <p className="text-muted-foreground">
                Thank you for registering with Magic Bus
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center justify-center gap-2 text-amber-700 font-medium mb-2">
                <AlertTriangle className="h-5 w-5" />
                Pending Verification
              </div>
              <p className="text-sm text-amber-600">
                Your documents are being reviewed. We will contact you within 2-3 business days.
              </p>
            </div>

            {registrationId && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-muted-foreground">Your Registration ID</p>
                <p className="text-lg font-mono font-bold text-gray-900">{registrationId}</p>
              </div>
            )}

            <div className="space-y-3 pt-4">
              <p className="text-sm text-muted-foreground">
                Selected Centre: <span className="font-medium text-gray-900">{formData.selectedCentreName}</span>
              </p>
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
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 rounded-xl shadow-lg flex items-center justify-center">
              <span className="text-2xl font-black text-white">MP</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Student Registration</h1>
          <p className="text-muted-foreground">Sign up for Magic Bus Upskilling Programme</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between max-w-2xl mx-auto">
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
                        ? 'bg-blue-600 text-white'
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
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => { const Icon = steps[currentStep - 1].icon; return <Icon className="h-5 w-5" />; })()}
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Full Name *</label>
                  <Input
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Date of Birth *</label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateField('dateOfBirth', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Gender *</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.gender}
                      onChange={(e) => updateField('gender', e.target.value)}
                    >
                      <option value="">Select gender</option>
                      {GENDER_OPTIONS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Address</label>
                  <Input
                    placeholder="Enter your full address"
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">PIN Code *</label>
                    <Input
                      placeholder="600116"
                      maxLength={6}
                      value={formData.pinCode}
                      onChange={(e) => updateField('pinCode', e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Education Level *</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.educationLevel}
                      onChange={(e) => updateField('educationLevel', e.target.value)}
                    >
                      <option value="">Select level</option>
                      {EDUCATION_LEVELS.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Connectivity Section */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Connectivity Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Do you have Internet access? *</label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={formData.hasInternet}
                        onChange={(e) => {
                          updateField('hasInternet', e.target.value);
                          // Auto-set preferred communication
                          if (e.target.value === 'no' && formData.hasMobile === 'no') {
                            updateField('preferredCommunication', '');
                          } else if (e.target.value === 'yes' && formData.hasMobile !== 'yes') {
                            updateField('preferredCommunication', 'email');
                          }
                        }}
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Do you have a Mobile? *</label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={formData.hasMobile}
                        onChange={(e) => {
                          updateField('hasMobile', e.target.value);
                          if (e.target.value === 'no') {
                            updateField('mobileType', '');
                            // If no mobile and has internet, set email
                            if (formData.hasInternet === 'yes') {
                              updateField('preferredCommunication', 'email');
                            } else {
                              updateField('preferredCommunication', '');
                            }
                          }
                        }}
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>

                  {formData.hasMobile === 'yes' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Type of Mobile *</label>
                        <select
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          value={formData.mobileType}
                          onChange={(e) => {
                            updateField('mobileType', e.target.value);
                            // Auto-set preferred communication based on mobile type
                            if (e.target.value === 'smartphone') {
                              updateField('preferredCommunication', 'whatsapp');
                            } else if (e.target.value === 'basic') {
                              updateField('preferredCommunication', 'sms');
                            }
                          }}
                        >
                          <option value="">Select type</option>
                          {MOBILE_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Preferred Mode of Communication</label>
                        <select
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          value={formData.preferredCommunication}
                          onChange={(e) => updateField('preferredCommunication', e.target.value)}
                        >
                          <option value="">Select mode</option>
                          {COMMUNICATION_MODES.filter(mode => {
                            // Filter options based on connectivity
                            if (mode.value === 'whatsapp' && formData.mobileType !== 'smartphone') return false;
                            if (mode.value === 'email' && formData.hasInternet !== 'yes') return false;
                            return true;
                          }).map((mode) => (
                            <option key={mode.value} value={mode.value}>{mode.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {formData.hasMobile === 'no' && formData.hasInternet === 'yes' && (
                    <div className="mt-4">
                      <label className="text-sm font-medium mb-1 block">Preferred Mode of Communication</label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={formData.preferredCommunication}
                        onChange={(e) => updateField('preferredCommunication', e.target.value)}
                      >
                        <option value="">Select mode</option>
                        <option value="email">Email</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Referral Source */}
                <div className="border-t pt-4 mt-4">
                  <label className="text-sm font-medium mb-1 block">How did you hear about Magic Upskilling Programme? *</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData.referralSource}
                    onChange={(e) => updateField('referralSource', e.target.value)}
                  >
                    <option value="">Select source</option>
                    {REFERRAL_SOURCES.map((source) => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </div>

                {/* First Generation Graduate Question */}
                <div className="border-t pt-4 mt-4">
                  <label className="text-sm font-medium mb-1 block">Are you a first generation graduate in your family? *</label>
                  <p className="text-xs text-muted-foreground mb-2">First generation graduate means you will be the first person in your immediate family to complete a degree or diploma.</p>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData.firstGenerationGraduate}
                    onChange={(e) => updateField('firstGenerationGraduate', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes, I will be the first graduate in my family</option>
                    <option value="no">No, someone in my family has graduated</option>
                  </select>
                </div>

                {/* Career Aspirations */}
                <div className="border-t pt-4 mt-4">
                  <label className="text-sm font-medium mb-1 block">Career Aspirations *</label>
                  <p className="text-xs text-muted-foreground mb-2">Tell us about your career goals and what you hope to achieve through this programme.</p>
                  <div className="relative">
                    <textarea
                      className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background resize-y pr-12"
                      placeholder="Describe your career aspirations, goals, and what you hope to learn..."
                      value={formData.careerAspirations}
                      onChange={(e) => updateField('careerAspirations', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={`absolute right-2 top-2 p-2 h-8 w-8 ${isRecording ? 'bg-red-100 border-red-300 text-red-600' : ''}`}
                      onClick={startVoiceRecording}
                      title={isRecording ? 'Recording...' : 'Click to speak'}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </div>
                  {isRecording && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      Listening... Speak now
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Eligibility */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Age Eligibility Check */}
                {formData.dateOfBirth && !isAgeEligible && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-700">Age Requirement Not Met</span>
                    </div>
                    <p className="text-sm text-red-600 mt-2">
                      We're sorry, the Upskilling Programme is available for candidates between 18 and 25 years of age.
                      Your current age is {candidateAge} years. Please contact your nearest Magic Bus centre for other opportunities.
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium mb-1 block">Annual Family Income *</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData.annualFamilyIncome}
                    onChange={(e) => updateField('annualFamilyIncome', e.target.value)}
                  >
                    <option value="">Select income bracket</option>
                    {INCOME_BRACKETS.map((bracket) => (
                      <option key={bracket.value} value={bracket.value}>
                        {bracket.label}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.annualFamilyIncome && !isIncomeEligible && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-700">Income Requirement Not Met</span>
                    </div>
                    <p className="text-sm text-red-600 mt-2">
                      We're sorry, the Upskilling Programme is currently available for families with annual income below ₹3.5 Lakhs.
                      Please contact your nearest Magic Bus centre for other opportunities.
                    </p>
                  </div>
                )}

                {/* Employment/Training Question */}
                <div>
                  <label className="text-sm font-medium mb-1 block">Are you currently employed or enrolled in any other training programme? *</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData.currentlyEmployedOrTraining}
                    onChange={(e) => updateField('currentlyEmployedOrTraining', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>

                {formData.currentlyEmployedOrTraining === 'yes' && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-700">Not Eligible</span>
                    </div>
                    <p className="text-sm text-red-600 mt-2">
                      We're sorry, the Upskilling Programme is available only for candidates who are not currently employed or enrolled in other training programmes.
                      Please contact your nearest Magic Bus centre for other opportunities.
                    </p>
                  </div>
                )}

                {/* Overall Eligibility Status */}
                {formData.annualFamilyIncome && formData.currentlyEmployedOrTraining && isAgeEligible && isEligible && (
                  <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-700">You are eligible for the Upskilling Programme!</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Documents */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Please upload clear photos or scans of your identity documents. Aadhaar card is required.
                </p>

                <FileUpload
                  label="Aadhaar Card"
                  required
                  accept="image/*"
                  onFileSelect={(file) => handleFileSelect('aadhaar', file)}
                  status={docValidation.aadhaar.status}
                  error={docValidation.aadhaar.error}
                />

                <FileUpload
                  label="BPL Card"
                  accept="image/*"
                  onFileSelect={(file) => handleFileSelect('bpl', file)}
                  status={docValidation.bpl.status}
                  error={docValidation.bpl.error}
                />

                <FileUpload
                  label="Ration Card"
                  accept="image/*"
                  onFileSelect={(file) => handleFileSelect('ration', file)}
                  status={docValidation.ration.status}
                  error={docValidation.ration.error}
                />

                {docValidation.aadhaar.status === 'error' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm text-amber-700">
                      <strong>Tip:</strong> Make sure the name on your Aadhaar card matches the name you entered in Step 1.
                      You can go back and correct it, or re-upload a clearer image.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Centre Selection */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select the Magic Bus centre nearest to your location. Based on your PIN code ({formData.pinCode}),
                  we've highlighted the recommended centre.
                </p>

                <CentreMap
                  centres={MAGIC_BUS_CENTRES}
                  selectedCentreId={formData.selectedCentreId}
                  nearestCentreId={nearestCentre?.id || null}
                  onSelectCentre={handleCentreSelect}
                  userPinCode={formData.pinCode}
                />
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
              {currentStep === 1 ? (
                <Button variant="outline" asChild>
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              )}

              {currentStep < 4 ? (
                <Button
                  onClick={() => setCurrentStep((s) => s + 1)}
                  disabled={!canProceed()}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Submit Registration
                    </>
                  )}
                </Button>
              )}
            </div>
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
