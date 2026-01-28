'use client';

import { forwardRef } from 'react';
import { Education } from './EducationStep';
import { Experience } from './ExperienceStep';
import { ColorScheme } from './ColorSchemeSelector';

// Default placeholder content shown in preview when fields are empty
const PLACEHOLDER = {
  name: 'Your Full Name',
  email: 'email@example.com',
  phone: '+91 9876543210',
  location: 'Mumbai, Maharashtra',
  summary: 'Motivated and detail-oriented professional seeking opportunities to apply my skills and contribute to organizational success. Eager to learn, adapt, and grow in a dynamic work environment while delivering quality results.',
  education: {
    id: 'placeholder',
    qualification: 'Bachelor of Commerce (B.Com)',
    specialization: 'Accounting & Finance',
    institution: 'University Name',
    year: '2024',
  },
  skills: ['Communication', 'MS Excel', 'Teamwork', 'Time Management', 'Problem Solving'],
  languages: ['English', 'Hindi'],
  jobTarget: 'Fresher seeking entry-level opportunities',
  experience: {
    id: 'placeholder-exp',
    company: 'Company Name',
    jobTitle: 'Job Title / Internship',
    startDate: '2023-06',
    endDate: '2024-01',
    details: 'Describe your key responsibilities and achievements in this role. Include specific accomplishments and skills gained.',
  },
};

interface ResumeData {
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

interface LivePreviewProps {
  data: ResumeData;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString + '-01');
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const LivePreview = forwardRef<HTMLDivElement, LivePreviewProps>(({ data }, ref) => {
  const { name, email, phone, location, photo, summary, education, skills, languages, experience, colorScheme } = data;

  // Determine if we should show placeholders
  const showNamePlaceholder = !name;
  const showEmailPlaceholder = !email;
  const showPhonePlaceholder = !phone;
  const showLocationPlaceholder = !location;
  const showSummaryPlaceholder = !summary;
  const showEducationPlaceholder = !education.some(e => e.qualification);
  const showSkillsPlaceholder = skills.length === 0;
  const showLanguagesPlaceholder = languages.length === 0;
  const showJobTargetPlaceholder = !experience.jobTarget;
  const hasRealExperience = experience.hasExperience && experience.experiences.some(e => e.company || e.jobTitle);
  const showExperiencePlaceholder = !hasRealExperience;

  // Display values (actual or placeholder)
  const displayName = name || PLACEHOLDER.name;
  const displayEmail = email || PLACEHOLDER.email;
  const displayPhone = phone || PLACEHOLDER.phone;
  const displayLocation = location || PLACEHOLDER.location;
  const displaySummary = summary || PLACEHOLDER.summary;
  const displayJobTarget = experience.jobTarget || PLACEHOLDER.jobTarget;
  const displaySkills = skills.length > 0 ? skills : PLACEHOLDER.skills;
  const displayLanguages = languages.length > 0 ? languages : PLACEHOLDER.languages;
  const displayEducation = education.some(e => e.qualification) ? education.filter(e => e.qualification) : [PLACEHOLDER.education];
  const displayExperiences = hasRealExperience ? experience.experiences.filter(e => e.company || e.jobTitle) : [PLACEHOLDER.experience];

  // Placeholder style - faded/italic
  const placeholderClass = 'opacity-50 italic';

  return (
    <div
      ref={ref}
      className="bg-white shadow-2xl"
      style={{
        width: '794px',
        minHeight: '1123px',
        fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
        fontSize: '11pt',
        lineHeight: '1.5',
        color: '#333333',
      }}
    >
      {/* Header Section */}
      <div
        className="px-10 py-8"
        style={{ backgroundColor: colorScheme.primary }}
      >
        <div className="flex items-start gap-6">
          {photo && (
            <div
              className="w-28 h-28 rounded-lg overflow-hidden border-4 flex-shrink-0"
              style={{ borderColor: 'rgba(255,255,255,0.3)' }}
            >
              <img
                src={photo}
                alt={name || 'Profile'}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className={`flex-1 ${!photo ? 'text-center' : ''}`}>
            <h1
              className={`text-white font-bold tracking-wide mb-1 ${showNamePlaceholder ? placeholderClass : ''}`}
              style={{ fontSize: '32px', letterSpacing: '0.5px' }}
            >
              {displayName}
            </h1>
            <p
              className={`text-white/90 font-medium mb-3 ${showJobTargetPlaceholder ? placeholderClass : ''}`}
              style={{ fontSize: '16px' }}
            >
              {displayJobTarget}
            </p>
            <div
              className={`flex flex-wrap gap-x-6 gap-y-1 text-white/85 ${!photo ? 'justify-center' : ''}`}
              style={{ fontSize: '12px' }}
            >
              <span className={`flex items-center gap-1.5 ${showEmailPlaceholder ? placeholderClass : ''}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {displayEmail}
              </span>
              <span className={`flex items-center gap-1.5 ${showPhonePlaceholder ? placeholderClass : ''}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {displayPhone}
              </span>
              <span className={`flex items-center gap-1.5 ${showLocationPlaceholder ? placeholderClass : ''}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {displayLocation}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-10 py-8 space-y-6">
        {/* Professional Summary */}
        <section>
          <h2
            className="font-bold uppercase tracking-wider pb-2 mb-3 border-b-2"
            style={{
              fontSize: '14px',
              color: colorScheme.primary,
              borderColor: colorScheme.accent,
              letterSpacing: '1px'
            }}
          >
            Professional Summary
          </h2>
          <p
            className={`text-gray-700 leading-relaxed ${showSummaryPlaceholder ? placeholderClass : ''}`}
            style={{ fontSize: '11pt' }}
          >
            {displaySummary}
          </p>
        </section>

        {/* Skills */}
        <section>
          <h2
            className="font-bold uppercase tracking-wider pb-2 mb-3 border-b-2"
            style={{
              fontSize: '14px',
              color: colorScheme.primary,
              borderColor: colorScheme.accent,
              letterSpacing: '1px'
            }}
          >
            Key Skills
          </h2>
          <div className={`flex flex-wrap gap-2 ${showSkillsPlaceholder ? placeholderClass : ''}`}>
            {displaySkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${colorScheme.accent}20`,
                  color: colorScheme.primary,
                  border: `1px solid ${colorScheme.accent}40`
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Work Experience - Always show with placeholder if no user data */}
        <section>
          <h2
            className="font-bold uppercase tracking-wider pb-2 mb-3 border-b-2"
            style={{
              fontSize: '14px',
              color: colorScheme.primary,
              borderColor: colorScheme.accent,
              letterSpacing: '1px'
            }}
          >
            Work Experience
          </h2>
          <div className={`space-y-4 ${showExperiencePlaceholder ? placeholderClass : ''}`}>
            {displayExperiences.map((exp) => (
              <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: colorScheme.accent }}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900" style={{ fontSize: '13px' }}>
                      {exp.jobTitle || 'Job Title'}
                    </h3>
                    {exp.company && (
                      <p className="font-medium" style={{ color: colorScheme.primary, fontSize: '12px' }}>
                        {exp.company}
                      </p>
                    )}
                  </div>
                  {(exp.startDate || exp.endDate) && (
                    <span className="text-gray-500 text-sm font-medium bg-gray-100 px-2 py-0.5 rounded">
                      {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                    </span>
                  )}
                </div>
                {exp.details && (
                  <p className="text-gray-600 mt-1" style={{ fontSize: '11px', lineHeight: '1.6' }}>
                    {exp.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h2
            className="font-bold uppercase tracking-wider pb-2 mb-3 border-b-2"
            style={{
              fontSize: '14px',
              color: colorScheme.primary,
              borderColor: colorScheme.accent,
              letterSpacing: '1px'
            }}
          >
            Education
          </h2>
          <div className={`space-y-3 ${showEducationPlaceholder ? placeholderClass : ''}`}>
            {displayEducation.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900" style={{ fontSize: '13px' }}>
                    {edu.qualification}
                  </h3>
                  {edu.specialization && (
                    <p className="text-gray-600" style={{ fontSize: '12px' }}>
                      {edu.specialization}
                    </p>
                  )}
                  {edu.institution && (
                    <p className="font-medium" style={{ color: colorScheme.primary, fontSize: '11px' }}>
                      {edu.institution}
                    </p>
                  )}
                </div>
                {edu.year && (
                  <span className="text-gray-500 text-sm font-medium bg-gray-100 px-2 py-0.5 rounded">
                    {edu.year}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Languages */}
        <section>
          <h2
            className="font-bold uppercase tracking-wider pb-2 mb-3 border-b-2"
            style={{
              fontSize: '14px',
              color: colorScheme.primary,
              borderColor: colorScheme.accent,
              letterSpacing: '1px'
            }}
          >
            Languages
          </h2>
          <div className={`flex flex-wrap gap-3 ${showLanguagesPlaceholder ? placeholderClass : ''}`}>
            {displayLanguages.map((lang, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 rounded text-gray-700 font-medium"
                style={{ fontSize: '11px' }}
              >
                {lang}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <div
        className="px-10 py-3 mt-auto border-t"
        style={{ borderColor: `${colorScheme.accent}30` }}
      >
        <p className="text-center text-gray-400" style={{ fontSize: '9px' }}>
          Resume created with Mission Possible Resume Builder
        </p>
      </div>
    </div>
  );
});

LivePreview.displayName = 'LivePreview';

export default LivePreview;
