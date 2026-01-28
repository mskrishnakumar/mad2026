'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle2, X } from 'lucide-react';

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const TIME_SLOTS = [
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '13:00', label: '1:00 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '17:00', label: '5:00 PM' },
  { value: '18:00', label: '6:00 PM' },
  { value: '19:00', label: '7:00 PM' },
  { value: '20:00', label: '8:00 PM' },
];

export default function SelectAvailabilityPage() {
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [currentDay, setCurrentDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddSlot = () => {
    if (!currentDay || !startTime || !endTime) {
      alert('Please select day, start time, and end time');
      return;
    }

    if (startTime >= endTime) {
      alert('End time must be after start time');
      return;
    }

    const newSlot: TimeSlot = {
      id: `${currentDay}-${startTime}-${endTime}-${Date.now()}`,
      day: currentDay,
      startTime,
      endTime,
    };

    setSelectedSlots([...selectedSlots, newSlot]);

    // Reset form
    setCurrentDay('');
    setStartTime('');
    setEndTime('');
  };

  const handleRemoveSlot = (id: string) => {
    setSelectedSlots(selectedSlots.filter(slot => slot.id !== id));
  };

  const handleSaveAvailability = async () => {
    if (selectedSlots.length === 0) {
      alert('Please add at least one time slot');
      return;
    }

    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const getTimeLabel = (time: string) => {
    const slot = TIME_SLOTS.find(t => t.value === time);
    return slot ? slot.label : time;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your Availability</h1>
        <p className="text-muted-foreground">
          Choose the days and times when you are available to volunteer
        </p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span className="text-green-800 font-medium">
            Availability saved successfully!
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Add Availability */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Add Availability</CardTitle>
            </div>
            <CardDescription>Select a day and time slot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Day Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Day of Week <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={currentDay}
                onChange={(e) => setCurrentDay(e.target.value)}
              >
                <option value="">Select a day</option>
                {DAYS_OF_WEEK.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                >
                  <option value="">Select time</option>
                  {TIME_SLOTS.map(slot => (
                    <option key={slot.value} value={slot.value}>{slot.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                >
                  <option value="">Select time</option>
                  {TIME_SLOTS.map(slot => (
                    <option key={slot.value} value={slot.value}>{slot.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              onClick={handleAddSlot}
              className="w-full"
              variant="outline"
            >
              Add Time Slot
            </Button>
          </CardContent>
        </Card>

        {/* Right Column - Selected Slots */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle>Your Selected Availability</CardTitle>
            </div>
            <CardDescription>
              {selectedSlots.length} time slot{selectedSlots.length !== 1 ? 's' : ''} added
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedSlots.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No availability added yet</p>
                <p className="text-sm">Add time slots from the left panel</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {DAYS_OF_WEEK.map(day => {
                  const daySlots = selectedSlots.filter(slot => slot.day === day);
                  if (daySlots.length === 0) return null;

                  return (
                    <div key={day} className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">{day}</h4>
                      {daySlots.map(slot => (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg mb-2"
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-900">
                              {getTimeLabel(slot.startTime)} - {getTimeLabel(slot.endTime)}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveSlot(slot.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-100 rounded p-1 transition-colors"
                            title="Remove slot"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSaveAvailability}
          size="lg"
          disabled={isSaving || selectedSlots.length === 0}
          className="px-8"
        >
          {isSaving ? 'Saving...' : 'Save Availability'}
        </Button>
      </div>

      {/* Weekly Summary */}
      {selectedSlots.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Weekly Summary</CardTitle>
            <CardDescription>Overview of your availability across the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {DAYS_OF_WEEK.map(day => {
                const daySlots = selectedSlots.filter(slot => slot.day === day);
                const totalHours = daySlots.reduce((total, slot) => {
                  const start = parseInt(slot.startTime.split(':')[0]);
                  const end = parseInt(slot.endTime.split(':')[0]);
                  return total + (end - start);
                }, 0);

                return (
                  <div
                    key={day}
                    className={`p-3 rounded-lg border ${
                      daySlots.length > 0
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <p className="text-xs font-medium text-gray-600 mb-1">{day}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {totalHours > 0 ? `${totalHours}h` : '-'}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
