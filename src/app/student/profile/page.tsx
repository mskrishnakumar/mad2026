'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, MapPin, GraduationCap, Building2, Edit, MessageSquare } from 'lucide-react';

// Mock student profile data
const studentProfile = {
  name: 'Rahul Kumar',
  email: 'rahul.kumar@student.magicbus.org',
  phone: '+91-9876543210',
  dateOfBirth: '15 March 2005',
  gender: 'Male',
  address: '45, Gandhi Street, Porur',
  pinCode: '600116',
  educationLevel: '12th Pass',
  centre: 'Magic Bus Porur Centre',
  registrationId: 'REG0001',
  registrationDate: '20 Jan 2026',
  status: 'Verified',
  hasInternet: true,
  hasMobile: true,
  mobileType: 'Smart Phone',
  preferredCommunication: 'WhatsApp',
  referralSource: 'Community Centre',
};

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-muted-foreground">View and manage your profile information</p>
        </div>
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {studentProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{studentProfile.name}</h3>
                <p className="text-sm text-muted-foreground">Registration ID: {studentProfile.registrationId}</p>
                <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  {studentProfile.status}
                </span>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{studentProfile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{studentProfile.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{studentProfile.address}, {studentProfile.pinCode}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Education & Centre */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Education & Centre
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Education Level</p>
                <p className="font-medium">{studentProfile.educationLevel}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Date of Birth</p>
                <p className="font-medium">{studentProfile.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Gender</p>
                <p className="font-medium">{studentProfile.gender}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Registered On</p>
                <p className="font-medium">{studentProfile.registrationDate}</p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Assigned Centre</p>
                  <p className="font-medium">{studentProfile.centre}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connectivity Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Connectivity Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Internet Access</p>
                <p className="font-medium">{studentProfile.hasInternet ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Mobile Phone</p>
                <p className="font-medium">{studentProfile.hasMobile ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Mobile Type</p>
                <p className="font-medium">{studentProfile.mobileType}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Preferred Communication</p>
                <p className="font-medium">{studentProfile.preferredCommunication}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral Information */}
        <Card>
          <CardHeader>
            <CardTitle>How You Found Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              You learned about Magic Upskilling Programme through:
            </p>
            <p className="font-medium text-primary mt-2">{studentProfile.referralSource}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
