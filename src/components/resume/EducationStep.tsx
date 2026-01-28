'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export interface Education {
  id: string;
  qualification: string;
  specialization: string;
  institution: string;
  year: string;
}

interface EducationStepProps {
  value: Education[];
  onChange: (education: Education[]) => void;
  error?: string;
}

const createNewEducation = (): Education => ({
  id: Date.now().toString(),
  qualification: '',
  specialization: '',
  institution: '',
  year: '',
});

export default function EducationStep({ value, onChange, error }: EducationStepProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (value.length === 0) {
      onChange([createNewEducation()]);
    }
  }, []);

  if (!mounted) {
    return <div className="text-gray-500">Loading...</div>;
  }

  const addEducation = () => {
    onChange([...value, createNewEducation()]);
  };

  const updateEducation = (id: string, field: keyof Education, fieldValue: string) => {
    onChange(
      value.map((edu) =>
        edu.id === id ? { ...edu, [field]: fieldValue } : edu
      )
    );
  };

  const removeEducation = (id: string) => {
    if (value.length > 1) {
      onChange(value.filter((edu) => edu.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {value.map((education, index) => (
        <div
          key={education.id}
          className="bg-white border border-gray-200 rounded-xl p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              Education {index + 1}
            </h4>
            {value.length > 1 && (
              <button
                type="button"
                onClick={() => removeEducation(education.id)}
                className="text-red-500 hover:text-red-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Qualification <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={education.qualification}
              onChange={(e) => updateEducation(education.id, 'qualification', e.target.value)}
              placeholder="e.g. Bachelor's Degree, Diploma, 12th Standard"
              className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none ${
                index === 0 && error
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-200 focus:border-blue-500'
              }`}
            />
            {index === 0 && error && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialization / Stream
            </label>
            <input
              type="text"
              value={education.specialization}
              onChange={(e) => updateEducation(education.id, 'specialization', e.target.value)}
              placeholder="e.g. Computer Science, Commerce, Arts"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution Name
              </label>
              <input
                type="text"
                value={education.institution}
                onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
                placeholder="e.g. Mumbai University"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year Completed
              </label>
              <input
                type="text"
                value={education.year}
                onChange={(e) => updateEducation(education.id, 'year', e.target.value)}
                placeholder="e.g. 2024"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addEducation}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Another Qualification
      </button>
    </div>
  );
}
