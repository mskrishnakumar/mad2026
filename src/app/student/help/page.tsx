'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, Phone, Mail, MessageSquare, MapPin, Clock, ChevronRight } from 'lucide-react';

const faqs = [
  {
    question: 'How do I update my profile information?',
    answer: 'Go to "My Profile" in the sidebar, click on "Edit Profile" button, make your changes, and save.',
  },
  {
    question: 'How can I enroll in a new programme?',
    answer: 'Visit "My Programmes" page, browse recommended programmes, and click "Learn More" to see details and enrollment options.',
  },
  {
    question: 'What documents do I need for verification?',
    answer: 'You need a valid Aadhaar card. BPL card and Ration card are optional but help expedite the verification process.',
  },
  {
    question: 'How long does registration verification take?',
    answer: 'Registration verification typically takes 2-3 business days. You will receive a notification once verified.',
  },
  {
    question: 'Can I change my assigned centre?',
    answer: 'Contact your counsellor or visit your current centre to request a centre transfer based on availability.',
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-muted-foreground">Get assistance and find answers to common questions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Contact Support
            </CardTitle>
            <CardDescription>Reach out to our support team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Helpline</p>
                <p className="font-medium">1800-123-4567</p>
                <p className="text-xs text-muted-foreground">Toll-free, Mon-Sat 9AM-6PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email Support</p>
                <p className="font-medium">info@magicbusindia.org</p>
                <p className="text-xs text-muted-foreground">Response within 24 hours</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">WhatsApp Support</p>
                <p className="font-medium">+91 98765 43210</p>
                <p className="text-xs text-muted-foreground">Quick queries and updates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Centre */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Your Centre
            </CardTitle>
            <CardDescription>Visit your assigned Magic Bus centre</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-xl">
              <h3 className="font-semibold">Magic Bus Porur Centre</h3>
              <p className="text-sm text-muted-foreground mt-1">
                123 Mount Poonamallee Road, Porur, Chennai 600116
              </p>
              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Mon-Sat: 9:00 AM - 5:00 PM</span>
              </div>
              <Button variant="outline" size="sm" className="mt-3">
                Get Directions
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              For in-person assistance, visit your centre during working hours. Bring your registration ID.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900">{faq.question}</h4>
                <p className="text-sm text-muted-foreground mt-2">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
