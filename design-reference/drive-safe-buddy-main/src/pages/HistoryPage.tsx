import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { getSessions, formatDuration, formatDate } from '@/lib/storage';

export default function HistoryPage() {
  const navigate = useNavigate();
  const sessions = getSessions();

  return (
    <div className="flex flex-col min-h-screen gradient-hero">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 pt-12 pb-6">
        <button
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-foreground font-bold text-xl">Drive History</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-8">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-semibold text-lg mb-2">No sessions yet</p>
            <p className="text-muted-foreground text-sm">
              Your drive sessions will appear here after you complete them.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-muted-foreground text-sm mb-1">
              {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'} recorded
            </p>
            {sessions.map((session, i) => (
              <div
                key={session.id}
                className="gradient-card border border-border rounded-2xl p-4 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-foreground font-semibold text-sm">{formatDate(session.startTime)}</p>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(session.durationMs)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <AlertTriangle className={`w-4 h-4 ${session.alertsCount > 0 ? 'text-state-alarm' : 'text-muted-foreground'}`} />
                        <span className={session.alertsCount > 0 ? 'text-state-alarm' : 'text-muted-foreground'}>
                          {session.alertsCount} {session.alertsCount === 1 ? 'alarm' : 'alarms'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <AlertTriangle className={`w-4 h-4 ${session.warningsCount > 0 ? 'text-state-drowsy' : 'text-muted-foreground'}`} />
                        <span className={session.warningsCount > 0 ? 'text-state-drowsy' : 'text-muted-foreground'}>
                          {session.warningsCount} {session.warningsCount === 1 ? 'warning' : 'warnings'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    session.alertsCount === 0 ? 'bg-state-awake/15' : 'bg-state-alarm/15'
                  }`}>
                    {session.alertsCount === 0 ? (
                      <CheckCircle className="w-5 h-5 text-state-awake" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-state-alarm" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
