import { useState, useEffect } from 'react';
import { Calendar, Clock, Video, Plus, CheckCircle2, LayoutDashboard, FileText, Users, ArrowRight } from 'lucide-react';
import { format, isAfter, parseISO } from 'date-fns';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import { Link, useNavigate } from 'react-router-dom';
import { Meeting } from '../lib/storage';

export default function Dashboard() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/meetings');
      const data = await res.json();
      setMeetings(data);
    } catch (err) {
      console.error('Failed to load meetings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const upcomingMeetings = (meetings || []).filter(m => {
    if (!m.date || !m.time) return false;
    try {
      const meetingDate = parseISO(`${m.date}T${m.time}`);
      return isAfter(meetingDate, new Date());
    } catch (e) {
      return false;
    }
  }).sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  const meetingsWithSummaries = (meetings || []).filter(m => m.hasSummary).sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

  const nextMeeting = upcomingMeetings.length > 0 ? upcomingMeetings[0] : null;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-lavender-950 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-lavender-600" />
            Dashboard
          </h1>
          <p className="text-lavender-600 mt-2 text-lg">Your meeting quick overview</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none rounded-full shadow-sm bg-white hover:bg-lavender-50" onClick={() => navigate('/meetings')}>
            <Calendar className="w-4 h-4 mr-2" />
            All Meetings
          </Button>
          <Link to="/schedule" className="flex-1 sm:flex-none">
            <Button className="w-full rounded-full shadow-md shadow-lavender-300">
              <Plus className="w-4 h-4 mr-2" />
              New Meeting
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lavender-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Main Stats & Next Meeting) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-lavender-500 to-lavender-700 text-white border-0 shadow-lg shadow-lavender-300 transform transition-all duration-300 hover:scale-105 hover:-translate-y-2">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-lavender-100 text-sm font-medium mb-1">Upcoming</p>
                  <h3 className="text-4xl font-black drop-shadow-md">{upcomingMeetings.length}</h3>
                </CardContent>
              </Card>

              <Card className="bg-white hover:border-lavender-300 transition-all shadow-sm group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-lavender-50 p-3 rounded-2xl group-hover:scale-110 group-hover:bg-lavender-100 transition-all">
                      <CheckCircle2 className="w-6 h-6 text-lavender-600" />
                    </div>
                  </div>
                  <p className="text-lavender-600 text-sm font-medium mb-1">Summaries</p>
                  <h3 className="text-4xl font-black text-lavender-950">{meetingsWithSummaries.length}</h3>
                </CardContent>
              </Card>

              <Card className="bg-white hover:border-lavender-300 transition-all shadow-sm hidden md:block group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-lavender-100 p-3 rounded-2xl group-hover:scale-110 group-hover:bg-lavender-200 transition-all">
                      <Users className="w-6 h-6 text-lavender-700" />
                    </div>
                  </div>
                  <p className="text-lavender-600 text-sm font-medium mb-1">Total Mts</p>
                  <h3 className="text-4xl font-black text-lavender-950">{meetings.length}</h3>
                </CardContent>
              </Card>
            </div>

            {/* Next Meeting Highlight */}
            <h2 className="text-xl font-bold text-lavender-950">Next Up</h2>
            {nextMeeting ? (
              <Card className="border-2 border-lavender-100 hover:border-lavender-300 transition-all shadow-sm group overflow-hidden hover:shadow-[0_20px_35px_-12px_rgba(155,89,182,0.15)]">
                <div className="h-2 w-full bg-gradient-to-r from-lavender-400 via-lavender-500 to-lavender-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-lavender-100 text-lavender-700 shadow-sm border border-lavender-200">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          Starting soon
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-lavender-950 mb-2">{nextMeeting.topic}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-lavender-600 text-sm font-medium">
                        <div className="flex items-center bg-lavender-50 px-2.5 py-1 rounded-md">
                          <Calendar className="w-4 h-4 mr-2 text-lavender-500" />
                          {format(parseISO(nextMeeting.date), 'EEEE, MMM do')}
                        </div>
                        <div className="flex items-center bg-lavender-50 px-2.5 py-1 rounded-md">
                          <Clock className="w-4 h-4 mr-2 text-lavender-500" />
                          {nextMeeting.time}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 w-full md:w-auto">
                      {nextMeeting.meetLink && (
                        <a href={nextMeeting.meetLink} target="_blank" rel="noreferrer" className="flex-1 md:flex-none">
                          <Button className="w-full bg-lavender-600 hover:bg-lavender-500 text-white rounded-xl shadow-[0_10px_20px_-8px_rgba(155,89,182,0.3)] hover:shadow-[0_25px_40px_-12px_rgba(155,89,182,0.25)] hover:scale-105 transition-all">
                            <Video className="w-4 h-4 mr-2" />
                            Join Call
                          </Button>
                        </a>
                      )}
                      <Link to={`/meeting/${nextMeeting._id}`} className="flex-1 md:flex-none">
                        <Button variant="outline" className="w-full rounded-xl hover:bg-lavender-50">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-lavender-50/50 border-dashed border-2 border-lavender-200 py-12">
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <div className="bg-white p-4 rounded-full mb-4 shadow-sm border border-lavender-100">
                    <Calendar className="w-8 h-8 text-lavender-300" />
                  </div>
                  <h3 className="text-lg font-bold text-lavender-800">No upcoming meetings</h3>
                  <p className="text-lavender-500 mb-6">Enjoy your free time, or schedule one right now.</p>
                  <Link to="/schedule">
                    <Button variant="outline" className="rounded-full bg-white">Schedule Meeting</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column (Recent Summaries) */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-lavender-950 flex items-center justify-between">
              Recent Summaries
              <Link to="/meetings" className="text-sm text-lavender-600 hover:text-lavender-800 font-medium flex items-center transition-colors">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </h2>

            <div className="space-y-4">
              {meetingsWithSummaries.length > 0 ? (
                meetingsWithSummaries.slice(0, 4).map((meeting) => (
                  <div key={meeting._id}>
                    <Card className="hover:border-lavender-300 transition-all shadow-sm hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(155,89,182,0.15)] group">
                      <CardContent className="p-5">
                      <h4 className="font-bold text-lavender-950 mb-2 line-clamp-1 group-hover:text-lavender-700 transition-colors">{meeting.topic}</h4>
                      <p className="text-xs text-lavender-500 mb-4 flex items-center font-medium bg-lavender-50 w-max px-2 py-1 rounded-md">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-lavender-400" />
                        {format(parseISO(meeting.date), 'MMM do, yyyy')}
                      </p>
                      <Link to={`/meeting/${meeting._id}`}>
                        <Button variant="ghost" size="sm" className="w-full justify-between hover:bg-lavender-100 hover:text-lavender-800 rounded-xl text-lavender-600 bg-lavender-50 group-hover:bg-white group-hover:shadow-[0_5px_15px_-5px_rgba(155,89,182,0.1)] transition-all">
                          <span className="flex items-center">
                            <FileText className="w-4 h-4 mr-2 opacity-70" />
                            Read Summary
                          </span>
                          <ArrowRight className="w-4 h-4 opacity-70 group-hover:scale-110 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                    </Card>
                  </div>
                ))
              ) : (
                <Card className="bg-lavender-50/50 border-none">
                  <CardContent className="p-8 text-center text-lavender-500">
                    <FileText className="w-8 h-8 mx-auto mb-3 text-lavender-300" />
                    <p className="text-sm font-medium">No summaries generated yet.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
