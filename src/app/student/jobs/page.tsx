'use client';

import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, IndianRupee, Building2, ExternalLink, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedDate: string;
  description: string;
  requirements: string[];
  isNew?: boolean;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Junior Software Developer',
    company: 'TechCorp Solutions',
    location: 'Chennai',
    salary: '3.5 - 5 LPA',
    type: 'Full-time',
    postedDate: '2 days ago',
    description: 'Looking for a motivated junior developer to join our growing team. Training provided.',
    requirements: ['Basic programming knowledge', '12th pass or above', 'Good communication skills'],
    isNew: true,
  },
  {
    id: '2',
    title: 'Customer Service Executive',
    company: 'Barclays',
    location: 'Chennai',
    salary: '2.5 - 3.5 LPA',
    type: 'Full-time',
    postedDate: '1 week ago',
    description: 'Join our customer service team and help customers with banking queries.',
    requirements: ['Graduate in any field', 'Excellent communication', 'Computer literacy'],
  },
  {
    id: '3',
    title: 'Data Entry Operator',
    company: 'InfoTech Services',
    location: 'Chennai',
    salary: '1.8 - 2.5 LPA',
    type: 'Full-time',
    postedDate: '3 days ago',
    description: 'Accurate data entry and document management role with growth opportunities.',
    requirements: ['10th pass or above', 'Typing speed 30 WPM', 'Basic computer skills'],
    isNew: true,
  },
  {
    id: '4',
    title: 'Retail Sales Associate',
    company: 'Metro Mart',
    location: 'Chennai',
    salary: '1.5 - 2.2 LPA',
    type: 'Full-time',
    postedDate: '5 days ago',
    description: 'Customer-facing role in retail with performance-based incentives.',
    requirements: ['12th pass', 'Good communication', 'Willingness to work in shifts'],
  },
  {
    id: '5',
    title: 'Apprentice - Electrical',
    company: 'Power Grid Corp',
    location: 'Chennai',
    salary: 'Stipend + Training',
    type: 'Apprenticeship',
    postedDate: '1 week ago',
    description: '1-year apprenticeship program with hands-on training and certification.',
    requirements: ['ITI Electrical', '10th pass with science', 'Age 18-25'],
  },
];

export default function StudentJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJobs(mockJobs);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Job Opportunities</h1>
        <p className="text-muted-foreground mt-1">
          Discover job openings matched to your skills and interests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
              <p className="text-sm text-muted-foreground">Available Jobs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-muted-foreground">Partner Companies</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-muted-foreground">Applications Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search jobs by title, company, or location..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center">
            <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No jobs found matching your search</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    {job.isNew && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-primary font-medium">{job.company}</p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.type}
                    </span>
                  </div>

                  <p className="mt-3 text-gray-600">{job.description}</p>

                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Requirements:</p>
                    <ul className="flex flex-wrap gap-2">
                      {job.requirements.map((req, index) => (
                        <li
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                        >
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:items-end">
                  <p className="text-xs text-muted-foreground">{job.postedDate}</p>
                  <Button className="w-full sm:w-auto">
                    Apply Now
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Save Job
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
