import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, User, Video, FileText, ArrowLeft, Send, CheckCircle2, List, ClipboardCheck, MessageSquare } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '../components/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../components/Card';
import LiveMeetingRecorder, { TranscriptEntry } from '../components/LiveMeetingRecorder';

export default function MeetingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailing, setIsEmailing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/meetings/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMeeting(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    let notesText = notes.trim();

    // Use transcript if available and notes textarea is empty
    if (meeting?.transcript && meeting.transcript.length > 0) {
      const formattedTranscript = meeting.transcript
        .map((t: TranscriptEntry) => `[${t.time}] ${t.speaker}: ${t.text}`)
        .join('\n');

      notesText = formattedTranscript;
    }

    if (!notesText) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/integrations/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId: id, topic: meeting.topic, notes: notesText })
      });
      const data = await res.json();

      if (!res.ok) {
        alert(`Generation Failed: ${data.details || data.error || 'Unknown error'}`);
        return;
      }

      const updatedMeeting = {
        ...meeting,
        summary: typeof data === 'string' ? data : JSON.stringify(data, null, 2),
        hasSummary: true
      };

      await fetch(`/api/meetings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMeeting)
      });

      setMeeting(updatedMeeting);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveTranscript = async (transcript: TranscriptEntry[]) => {
    if (!transcript || transcript.length === 0) return;

    try {
      const updatedMeeting = {
        ...meeting,
        transcript
      };

      const res = await fetch(`/api/meetings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMeeting)
      });

      if (res.ok) {
        setMeeting(updatedMeeting);
      }
    } catch (err) {
      console.error('Failed to save transcript:', err);
    }
  };

  const handlePrintSummary = () => {
    if (!meeting?.summary) return alert("Please generate a summary first.");
    window.print();
  };

  const handleEmailSummary = async () => {
    if (!meeting?.summary) {
      alert("Please generate a summary first.");
      return;
    }

    setIsEmailing(true);
    try {
      const summaryText = typeof meeting.summary === 'string'
        ? meeting.summary
        : JSON.stringify(meeting.summary, null, 2);

      const res = await fetch('/api/integrations/email-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: meeting.topic,
          attendees: meeting.attendees || [],
          organizer: meeting.organizer,
          summary: summaryText
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Failed to send: ${data.details || data.error}`);
      } else {
        alert(`✅ Summary emailed to all participants!`);
      }
    } catch (err) {
      alert("Failed to send email. Please check console for details.");
      console.error(err);
    } finally {
      setIsEmailing(false);
    }
  };

  // Helper function to format and display summary
  const renderFormattedSummary = () => {
    if (!meeting?.summary) return null;

    try {
      // Parse the summary if it's a string
      const summaryData = typeof meeting.summary === 'string'
        ? JSON.parse(meeting.summary)
        : meeting.summary;

      return (
        <div className="space-y-6">
          {/* Key Points */}
          {summaryData.key_points && summaryData.key_points.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-lavender-900 mb-3 flex items-center">
                <span className="bg-lavender-100 text-lavender-700 p-1.5 rounded-lg mr-2">📌</span>
                Key Points
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                {summaryData.key_points.map((point: string, idx: number) => (
                  <li key={idx} className="text-lavender-700">{point}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Decisions */}
          {summaryData.decisions && summaryData.decisions.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-lavender-900 mb-3 flex items-center">
                <span className="bg-lavender-100 text-lavender-700 p-1.5 rounded-lg mr-2">✅</span>
                Decisions Made
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                {summaryData.decisions.map((decision: string, idx: number) => (
                  <li key={idx} className="text-lavender-700">{decision}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Items */}
          {summaryData.action_items && summaryData.action_items.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-lavender-900 mb-3 flex items-center">
                <span className="bg-lavender-100 text-lavender-700 p-1.5 rounded-lg mr-2">📋</span>
                Action Items
              </h3>
              <div className="space-y-3">
                {summaryData.action_items.map((item: any, idx: number) => (
                  <div key={idx} className="bg-lavender-50/50 p-4 rounded-xl border border-lavender-200 shadow-sm">
                    <p className="font-bold text-lavender-900 mb-2">{item.task}</p>
                    <div className="flex gap-4 text-sm text-lavender-600 font-medium">
                      {item.assignee && item.assignee !== "Not specified" && (
                        <span className="flex items-center bg-white px-2 py-1 rounded-md border border-lavender-100">
                          <Users className="w-3.5 h-3.5 mr-1.5 text-lavender-400" />
                          {item.assignee}
                        </span>
                      )}
                      {item.deadline && (
                        <span className="flex items-center bg-white px-2 py-1 rounded-md border border-lavender-100">
                          <Clock className="w-3.5 h-3.5 mr-1.5 text-lavender-400" />
                          {item.deadline}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Follow Up */}
          {summaryData.follow_up && summaryData.follow_up.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-lavender-900 mb-3 flex items-center">
                <span className="bg-lavender-100 text-lavender-700 p-1.5 rounded-lg mr-2">🔄</span>
                Follow Up
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                {summaryData.follow_up.map((item: string, idx: number) => (
                  <li key={idx} className="text-lavender-700">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    } catch (e) {
      // If parsing fails, show as plain text
      return <div className="whitespace-pre-wrap">{meeting.summary}</div>;
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lavender-500"></div></div>;
  if (!meeting) return <div className="text-center py-20 text-lavender-900">Meeting not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 font-sans print:py-0 print:px-0">

      {/* --- PRINT ONLY VIEW --- */}
      <div className="hidden print:block text-black">
        <h1 className="text-3xl font-bold mb-4 pb-2 border-b border-gray-200">Meeting Summary: {meeting.topic}</h1>
        <div className="mb-6 text-sm text-gray-600">
          <p><strong>Date:</strong> {meeting.date ? format(parseISO(meeting.date), 'EEEE, MMM do, yyyy') : 'N/A'}</p>
          <p><strong>Attendees:</strong> {(meeting.attendees || []).join(', ')}</p>
        </div>
        <div className="text-base leading-relaxed">
          {(() => {
            if (!meeting.summary) return 'No summary available.';
            try {
              const summaryData = typeof meeting.summary === 'string'
                ? JSON.parse(meeting.summary)
                : meeting.summary;

              return (
                <div className="space-y-6">
                  {summaryData.key_points && (
                    <>
                      <h3 className="text-xl font-bold mt-4">Key Points:</h3>
                      <ul className="list-disc pl-6">
                        {summaryData.key_points.map((p: string, i: number) => <li key={i}>{p}</li>)}
                      </ul>
                    </>
                  )}

                  {summaryData.decisions && (
                    <>
                      <h3 className="text-xl font-bold mt-4">Decisions Made:</h3>
                      <ul className="list-disc pl-6">
                        {summaryData.decisions.map((d: string, i: number) => <li key={i}>{d}</li>)}
                      </ul>
                    </>
                  )}

                  {summaryData.action_items && (
                    <>
                      <h3 className="text-xl font-bold mt-4">Action Items:</h3>
                      {summaryData.action_items.map((item: any, i: number) => (
                        <div key={i} className="mb-3">
                          <p className="font-semibold">• {item.task}</p>
                          {item.assignee && item.assignee !== "Not specified" && (
                            <p className="ml-4 text-sm">Assignee: {item.assignee}</p>
                          )}
                          {item.deadline && (
                            <p className="ml-4 text-sm">Deadline: {item.deadline}</p>
                          )}
                        </div>
                      ))}
                    </>
                  )}

                  {summaryData.follow_up && (
                    <>
                      <h3 className="text-xl font-bold mt-4">Follow Up:</h3>
                      <ul className="list-disc pl-6">
                        {summaryData.follow_up.map((f: string, i: number) => <li key={i}>{f}</li>)}
                      </ul>
                    </>
                  )}
                </div>
              );
            } catch (e) {
              return <div className="whitespace-pre-wrap">{meeting.summary}</div>;
            }
          })()}
        </div>
      </div>

      {/* --- SCREEN VIEW --- */}
      <div className="print:hidden">
        <button onClick={() => navigate(-1)} className="flex items-center text-lavender-500 hover:text-lavender-700 mb-6 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border border-lavender-100 shadow-[0_15px_30px_-10px_rgba(155,89,182,0.15)]">
              <CardHeader className="bg-lavender-50/50 border-b border-lavender-100 rounded-t-[24px]">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-lavender-950">{meeting.topic}</h1>
                    <p className="text-lavender-600 mt-1">Organized by <span className="font-medium text-lavender-800">{meeting.organizer}</span></p>
                  </div>
                  {meeting.meetLink && (
                    <a href={meeting.meetLink} target="_blank" rel="noreferrer">
                      <Button className="rounded-full bg-lavender-600 hover:bg-lavender-500 shadow-[0_10px_20px_-8px_rgba(155,89,182,0.3)]">
                        <Video className="w-4 h-4 mr-2" />
                        Join Meet
                      </Button>
                    </a>
                  )}
                </div>
              </CardHeader>
              <CardContent className="py-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-lavender-700">
                    <Calendar className="w-5 h-5 mr-3 text-lavender-500" />
                    <div>
                      <p className="text-xs font-bold text-lavender-400 uppercase tracking-wider">Date</p>
                      <p className="font-semibold">{format(parseISO(meeting.date), 'EEEE, MMM do, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-lavender-700">
                    <Clock className="w-5 h-5 mr-3 text-lavender-500" />
                    <div>
                      <p className="text-xs font-bold text-lavender-400 uppercase tracking-wider">Time</p>
                      <p className="font-semibold">{meeting.time}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-lavender-400 uppercase mb-3 tracking-wider">Attendees</p>
                  <div className="flex flex-wrap gap-2">
                    {(meeting.attendees || []).map((email: string) => (
                      <div key={email} className="inline-flex items-center px-3 py-1.5 rounded-full bg-lavender-50 text-lavender-800 text-sm border border-lavender-200 font-medium shadow-sm hover:shadow-md transition-shadow">
                        <User className="w-3.5 h-3.5 mr-2 text-lavender-400" />
                        {email}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <LiveMeetingRecorder
              onSaveTranscript={handleSaveTranscript}
              savedTranscript={meeting.transcript || []}
              currentUser={meeting.organizer || "Local User"}
            />

            {meeting.hasSummary && meeting.summary ? (
              <Card className="border-emerald-100 shadow-[0_15px_30px_-10px_rgba(16,185,129,0.15)] mt-8">
                <CardHeader className="bg-emerald-50/50 border-b border-emerald-100 rounded-t-[24px]">
                  <div className="flex items-center text-emerald-800">
                    <CheckCircle2 className="w-6 h-6 mr-3 text-emerald-500" />
                    <h2 className="text-xl font-bold">AI Meeting Summary</h2>
                  </div>
                </CardHeader>
                <CardContent className="py-8">
                  <div className="prose prose-lavender max-w-none text-lavender-800 leading-relaxed">
                    {renderFormattedSummary()}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="mt-8 border border-lavender-100 shadow-[0_15px_30px_-10px_rgba(155,89,182,0.1)]">
                <CardHeader className="bg-lavender-50/30 border-b border-lavender-50 rounded-t-[24px]">
                  <h2 className="text-xl font-bold text-lavender-950">Generate Summary</h2>
                  <p className="text-sm text-lavender-600 mt-1">
                    {meeting.transcript?.length > 0
                      ? "Click below to generate an AI summary from the recorded transcript."
                      : "Paste your meeting notes below to generate an AI summary."}
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  {!(meeting.transcript?.length > 0) && (
                    <textarea
                      className="w-full h-40 p-4 rounded-xl border border-lavender-200 focus:ring-2 focus:ring-lavender-500 focus:border-transparent focus:outline-none text-sm transition-all shadow-inner"
                      placeholder="Paste meeting notes, transcripts, or key discussion points here..."
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                    />
                  )}
                  {meeting.transcript?.length > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-emerald-800 flex items-center shadow-sm">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-3" />
                      <span className="font-medium">Live transcript saved and ready for AI summarization.</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end pt-4 pb-6">
                  <Button
                    onClick={handleGenerateSummary}
                    isLoading={isGenerating}
                    disabled={!(meeting.transcript?.length > 0) && !notes.trim()}
                    className="shadow-[0_10px_20px_-8px_rgba(155,89,182,0.3)] bg-gradient-to-r from-lavender-500 to-lavender-600 hover:scale-105"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Generate AI Summary
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-lavender-600 to-lavender-800 text-white border-none shadow-[0_20px_35px_-12px_rgba(155,89,182,0.3)]">
              <CardContent className="p-8">
                <h3 className="font-bold mb-4 text-lavender-100 text-lg">Meeting Status</h3>
                <div className="flex items-center gap-3 mb-6 bg-white/10 p-3 rounded-xl border border-white/20">
                  <div className={`w-3 h-3 rounded-full ${meeting.status === 'upcoming' ? 'bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'bg-lavender-300'}`} />
                  <span className="capitalize font-bold text-lg">{meeting.status}</span>
                </div>
                <p className="text-lavender-100 text-sm leading-relaxed">
                  {meeting.status === 'upcoming'
                    ? 'This meeting is scheduled and invitations have been uniquely beautifully sent to all attendees.'
                    : 'This meeting has beautifully concluded.'}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-lavender-100 shadow-[0_15px_30px_-10px_rgba(155,89,182,0.15)]">
              <CardContent className="p-8">
                <h3 className="font-bold text-lavender-950 mb-5 text-lg">Quick Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-lavender-200 hover:bg-lavender-50 hover:text-lavender-700 text-lavender-600 bg-white" onClick={handlePrintSummary}>
                    <FileText className="w-4 h-4 mr-3 text-lavender-400" />
                    Print Summary
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-lavender-200 hover:bg-lavender-50 hover:text-lavender-700 text-lavender-600 bg-white" onClick={handleEmailSummary} isLoading={isEmailing}>
                    <Send className="w-4 h-4 mr-3 text-lavender-400" />
                    Email Summary
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}