'use client';

import ResumeBuilder from '@/components/resume/ResumeBuilder';
import { FileText, Sparkles } from 'lucide-react';

export default function ResumePage() {
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                ATS Optimized
              </span>
            </div>
            <p className="text-gray-600">
              Create a professional, job-ready resume that passes ATS screening
            </p>
          </div>
        </div>
      </div>
      <ResumeBuilder />
    </div>
  );
}
