import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, User, Type, ArrowLeft, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardHeader, CardContent, CardFooter } from '../components/Card';

export default function ScheduleMeeting() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    topic: '',
    date: '',
    time: '',
    attendees: '',
    organizer: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/integrations/create-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Save to server
        await fetch('/api/meetings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        navigate('/');
      } else {
        setError(data.error || 'Failed to schedule meeting. Please ensure you are connected to Google.');
      }
    } catch (err) {
      console.error(err);
      setError('A connection error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formattedDate = formData.date ? format(parseISO(formData.date), 'EEEE, MMMM do, yyyy') : '';

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 font-sans">
      <button onClick={() => navigate(-1)} className="flex items-center text-lavender-500 hover:text-lavender-700 mb-6 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      <Card className="shadow-[0_20px_35px_-12px_rgba(155,89,182,0.15)] border-lavender-200">
        <CardHeader className="border-b border-lavender-100 bg-lavender-50/80 rounded-t-[24px]">
          <h2 className="text-2xl font-bold text-lavender-950">Schedule New Meeting</h2>
          <p className="text-sm text-lavender-600 mt-1">Fill in the details to create a beautiful connected event</p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-8">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm shadow-sm">
                {error}
              </div>
            )}
            <Input
              label="Meeting Topic"
              placeholder="e.g., Weekly Sync"
              required
              value={formData.topic}
              onChange={e => setFormData({ ...formData, topic: e.target.value })}
              icon={<Type className="w-4 h-4 text-lavender-400" />}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Input
                  label="Date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
                {formattedDate && <p className="text-xs text-lavender-600 font-bold ml-1">{formattedDate}</p>}
              </div>
              <Input
                label="Time"
                type="time"
                required
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
              />
            </div>

            <Input
              label="Attendee Emails"
              placeholder="team@example.com, partner@example.com"
              required
              value={formData.attendees}
              onChange={e => setFormData({ ...formData, attendees: e.target.value })}
            />

            <Input
              label="Organizer Name"
              placeholder="Your Name"
              required
              value={formData.organizer}
              onChange={e => setFormData({ ...formData, organizer: e.target.value })}
            />
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm flex items-start gap-3 shadow-sm">
                <div className="bg-red-100 p-1 rounded-full mt-0.5">
                  <AlertCircle className="w-3 h-3" />
                </div>
                <div>
                  <p className="font-bold">Error</p>
                  <p>{error}</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-3 pb-8 px-6 border-t border-lavender-50 pt-6">
            <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isLoading} className="bg-transparent border-lavender-200 hover:bg-lavender-50 text-lavender-700">Cancel</Button>
            <Button type="submit" isLoading={isLoading} className="shadow-[0_10px_20px_-8px_rgba(155,89,182,0.3)]">
              {isLoading ? 'Scheduling...' : 'Schedule Meeting'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
