'use client';

import { Plus, Trash2 } from 'lucide-react';

export interface Experience {
  id: string;
  company: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  details: string;
}

interface ExperienceData {
  hasExperience: boolean;
  experiences: Experience[];
  jobTarget: string;
}

interface ExperienceStepProps {
  value: ExperienceData;
  onChange: (data: ExperienceData) => void;
}

const createNewExperience = (): Experience => ({
  id: Date.now().toString(),
  company: '',
  jobTitle: '',
  startDate: '',
  endDate: '',
  details: '',
});

export default function ExperienceStep({ value, onChange }: ExperienceStepProps) {
  const { hasExperience, experiences, jobTarget } = value;

  const handleHasExperienceChange = (has: boolean) => {
    onChange({
      ...value,
      hasExperience: has,
      experiences: has && experiences.length === 0 ? [createNewExperience()] : experiences,
    });
  };

  const addExperience = () => {
    onChange({
      ...value,
      experiences: [...experiences, createNewExperience()],
    });
  };

  const updateExperience = (id: string, field: keyof Experience, fieldValue: string) => {
    onChange({
      ...value,
      experiences: experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: fieldValue } : exp
      ),
    });
  };

  const removeExperience = (id: string) => {
    if (experiences.length > 1) {
      onChange({
        ...value,
        experiences: experiences.filter((exp) => exp.id !== id),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Job Target */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          What job are you looking for?
        </label>
        <input
          type="text"
          value={jobTarget}
          onChange={(e) => onChange({ ...value, jobTarget: e.target.value })}
          placeholder="e.g. Retail Associate, Data Entry Operator, Customer Service"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
        />
      </div>

      {/* Has Experience Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Do you have any work experience?
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleHasExperienceChange(true)}
            className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
              hasExperience
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 text-gray-600 hover:border-blue-200'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => handleHasExperienceChange(false)}
            className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
              !hasExperience
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 text-gray-600 hover:border-blue-200'
            }`}
          >
            No
          </button>
        </div>
      </div>

      {/* Experience Entries */}
      {hasExperience && (
        <div className="space-y-4">
          {experiences.map((experience, index) => (
            <div
              key={experience.id}
              className="bg-white border border-gray-200 rounded-xl p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">
                  Experience {index + 1}
                </h4>
                {experiences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExperience(experience.id)}
                    className="text-red-500 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={experience.company}
                    onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                    placeholder="e.g. ABC Company"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={experience.jobTitle}
                    onChange={(e) => updateExperience(experience.id, 'jobTitle', e.target.value)}
                    placeholder="e.g. Sales Executive"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={experience.startDate}
                    onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={experience.endDate}
                    onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsibilities & Achievements
                </label>
                <textarea
                  value={experience.details}
                  onChange={(e) => updateExperience(experience.id, 'details', e.target.value)}
                  placeholder="Describe your key responsibilities and achievements..."
                  rows={3}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addExperience}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Another Experience
          </button>
        </div>
      )}
    </div>
  );
}
