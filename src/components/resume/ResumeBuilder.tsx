'use client';

import { useState, useRef, useEffect } from 'react';
import { User, GraduationCap, Briefcase, Code, Globe, Palette, Download, ChevronLeft, ChevronRight, Camera, CheckCircle, FileText, Sparkles, RotateCcw } from 'lucide-react';
import EducationStep, { Education } from './EducationStep';
import ExperienceStep, { Experience } from './ExperienceStep';
import SkillsSelector from './SkillsSelector';
import LanguagesSelector from './LanguagesSelector';
import ColorSchemeSelector, { ColorScheme, COLOR_SCHEMES } from './ColorSchemeSelector';
import LivePreview from './LivePreview';

interface FormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  photo: string | null;
  summary: string;
  education: Education[];
  skills: string[];
  languages: string[];
  experience: {
    hasExperience: boolean;
    experiences: Experience[];
    jobTarget: string;
  };
  colorScheme: ColorScheme;
}

// Empty form data - user starts with blank fields
const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  location: '',
  photo: null,
  summary: '',
  education: [],
  skills: [],
  languages: [],
  experience: {
    hasExperience: false,
    experiences: [],
    jobTarget: '',
  },
  colorScheme: COLOR_SCHEMES[1], // Ocean Blue by default
};


const SECTIONS = [
  { id: 'personal', label: 'Personal Details', icon: User, description: 'Your contact information' },
  { id: 'summary', label: 'Summary', icon: FileText, description: 'Professional summary' },
  { id: 'education', label: 'Education', icon: GraduationCap, description: 'Academic qualifications' },
  { id: 'skills', label: 'Skills', icon: Code, description: 'Your key competencies' },
  { id: 'experience', label: 'Experience', icon: Briefcase, description: 'Work history (optional)' },
  { id: 'languages', label: 'Languages', icon: Globe, description: 'Languages you know' },
  { id: 'customize', label: 'Customize', icon: Palette, description: 'Style your resume' },
];

const ATS_TIPS = [
  'Use clear section headings like "Education", "Skills", "Experience"',
  'Include relevant keywords from job descriptions',
  'Keep formatting simple - avoid complex tables or graphics',
  'Use standard fonts like Arial, Calibri, or Times New Roman',
  'Save as PDF to preserve formatting',
];

export default function ResumeBuilder() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [activeSection, setActiveSection] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('resume_builder_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure all fields exist
        setFormData({ ...initialFormData, ...parsed });
      } catch (e) {
        console.error('Failed to load saved data');
        setFormData(initialFormData);
      }
    }
    setHasLoadedFromStorage(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (hasLoadedFromStorage) {
      localStorage.setItem('resume_builder_data', JSON.stringify(formData));
    }
  }, [formData, hasLoadedFromStorage]);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateField('photo', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearAll = () => {
    if (confirm('This will clear all your resume data and start fresh. Continue?')) {
      setFormData(initialFormData);
      localStorage.removeItem('resume_builder_data');
    }
  };

  const isSectionComplete = (sectionId: string): boolean => {
    switch (sectionId) {
      case 'personal':
        return !!(formData.name && formData.email && formData.phone);
      case 'summary':
        return !!formData.summary;
      case 'education':
        return formData.education.some((e) => e.qualification);
      case 'skills':
        return formData.skills.length > 0;
      case 'experience':
        // Only complete if user has entered job target or has experience
        return !!(formData.experience.jobTarget || (formData.experience.hasExperience && formData.experience.experiences.some(e => e.company || e.jobTitle)));
      case 'languages':
        return formData.languages.length > 0;
      case 'customize':
        // Never show as complete - it's optional customization
        return false;
      default:
        return false;
    }
  };

  const validateCurrentSection = (): boolean => {
    const newErrors: Record<string, string> = {};
    const section = SECTIONS[activeSection].id;

    if (section === 'personal') {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone is required';
    }

    if (section === 'education') {
      if (!formData.education.some((e) => e.qualification)) {
        newErrors.education = 'At least one qualification is required';
      }
    }

    if (section === 'skills') {
      if (formData.skills.length === 0) {
        newErrors.skills = 'Select at least one skill';
      }
    }

    if (section === 'languages') {
      if (formData.languages.length === 0) {
        newErrors.languages = 'Select at least one language';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentSection() && activeSection < SECTIONS.length - 1) {
      setActiveSection(activeSection + 1);
    }
  };

  const handlePrevious = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
    }
  };

  const canDownload = (): boolean => {
    return !!(
      formData.name &&
      formData.email &&
      formData.phone &&
      formData.education.some((e) => e.qualification) &&
      formData.skills.length > 0 &&
      formData.languages.length > 0
    );
  };

  const handleDownload = async () => {
    if (!canDownload() || !previewRef.current) return;

    setIsDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${formData.name.replace(/\s+/g, '_') || 'resume'}_resume.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderSectionContent = () => {
    const section = SECTIONS[activeSection].id;

    switch (section) {
      case 'personal':
        return (
          <div className="space-y-5">
            {/* Photo Upload */}
            <div className="flex items-center gap-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-xl bg-white border-2 border-dashed border-blue-300 flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all overflow-hidden shadow-sm"
              >
                {formData.photo ? (
                  <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-blue-400" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div>
                <p className="font-medium text-gray-800">Profile Photo</p>
                <p className="text-sm text-gray-500">Optional - Click to upload a professional photo</p>
                {formData.photo && (
                  <button
                    onClick={() => updateField('photo', null)}
                    className="text-xs text-red-500 hover:text-red-600 mt-1"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="e.g. Rahul Kumar"
                  className={`w-full border-2 rounded-xl px-4 py-3 text-base focus:ring-4 focus:ring-blue-100 transition-all outline-none ${
                    errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="rahul@email.com"
                  className={`w-full border-2 rounded-xl px-4 py-3 text-base focus:ring-4 focus:ring-blue-100 transition-all outline-none ${
                    errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+91 9876543210"
                  className={`w-full border-2 rounded-xl px-4 py-3 text-base focus:ring-4 focus:ring-blue-100 transition-all outline-none ${
                    errors.phone ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                />
              </div>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">ATS Tip: Professional Summary</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Write 2-3 sentences highlighting your key strengths, experience level, and career goals.
                    Include relevant keywords from job descriptions you&apos;re targeting.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Professional Summary
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => updateField('summary', e.target.value)}
                placeholder="Write a brief summary about yourself, your skills, and what you're looking for..."
                rows={5}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.summary.length} characters</p>
            </div>
          </div>
        );

      case 'education':
        return (
          <EducationStep
            value={formData.education}
            onChange={(education) => updateField('education', education)}
            error={errors.education}
          />
        );

      case 'skills':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">ATS Tip: Skills Section</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Include both technical skills (MS Office, data entry) and soft skills (communication, teamwork).
                    Match skills from job postings you&apos;re applying to.
                  </p>
                </div>
              </div>
            </div>
            <SkillsSelector
              value={formData.skills}
              onChange={(skills) => updateField('skills', skills)}
            />
            {errors.skills && (
              <p className="text-red-500 text-xs mt-2">{errors.skills}</p>
            )}
          </div>
        );

      case 'experience':
        return (
          <ExperienceStep
            value={formData.experience}
            onChange={(experience) => updateField('experience', experience)}
          />
        );

      case 'languages':
        return (
          <div>
            <LanguagesSelector
              value={formData.languages}
              onChange={(languages) => updateField('languages', languages)}
            />
            {errors.languages && (
              <p className="text-red-500 text-xs mt-2">{errors.languages}</p>
            )}
          </div>
        );

      case 'customize':
        return (
          <div className="space-y-6">
            <ColorSchemeSelector
              value={formData.colorScheme}
              onChange={(colorScheme) => updateField('colorScheme', colorScheme)}
            />

            {/* ATS Tips */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                ATS-Friendly Resume Tips
              </p>
              <ul className="space-y-2">
                {ATS_TIPS.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                    <span className="text-green-500 mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const completedSections = SECTIONS.filter((s) => isSectionComplete(s.id)).length;
  const progressPercent = Math.round((completedSections / SECTIONS.length) * 100);

  return (
    <div className="min-h-screen">
      <div className="max-w-[1800px] mx-auto">
        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Resume Progress</span>
            <span className="text-sm font-bold text-blue-600">{progressPercent}% Complete</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Main Layout - Form Left, Preview Right */}
        <div className="flex flex-col xl:flex-row gap-4">
          {/* Form Section - Left Side */}
          <div className="xl:w-1/2">
            {/* Section Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">Fill Your Details</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Clear All
                  </button>
                </div>
              </div>
              <div className="flex overflow-x-auto gap-2 pb-2 -mb-2">
                {SECTIONS.map((section, index) => {
                  const Icon = section.icon;
                  const isComplete = isSectionComplete(section.id);
                  const isActive = index === activeSection;

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(index)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : isComplete
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {isComplete && !isActive ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">{section.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  {SECTIONS[activeSection].label}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {SECTIONS[activeSection].description}
                </p>
              </div>

              {renderSectionContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6 pt-5 border-t border-gray-100">
                <button
                  onClick={handlePrevious}
                  disabled={activeSection === 0}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {activeSection < SECTIONS.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-md transition-all"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleDownload}
                    disabled={!canDownload() || isDownloading}
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:from-green-600 hover:to-emerald-700 shadow-md transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    {isDownloading ? 'Generating...' : 'Download Resume'}
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Preview Toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="xl:hidden w-full mt-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 text-sm font-medium text-gray-700 flex items-center justify-center gap-2"
            >
              {showPreview ? 'Hide Preview' : 'Show Live Preview'}
            </button>
          </div>

          {/* Preview Section - Right Side */}
          <div className={`xl:w-1/2 min-w-0 ${showPreview ? 'block' : 'hidden xl:block'}`}>
            <div className="sticky top-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-800">Live Preview</h3>
                <button
                  onClick={handleDownload}
                  disabled={!canDownload() || isDownloading}
                  className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Download className="w-3 h-3" />
                  {isDownloading ? '...' : 'PDF'}
                </button>
              </div>
              <div
                className="rounded-lg border border-gray-300 shadow-xl w-full bg-white flex items-start justify-center"
                style={{ height: 'calc(100vh - 140px)', overflow: 'hidden', padding: '4px' }}
              >
                <div
                  style={{
                    transform: 'scale(0.60)',
                    transformOrigin: 'top center',
                    width: '794px',
                    height: '1123px',
                    flexShrink: 0
                  }}
                >
                  <LivePreview ref={previewRef} data={formData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
