import { useNavigate } from 'react-router-dom';
import { Eye, History, Settings, Play, Clock, AlertTriangle } from 'lucide-react';
import { getSessions, formatDuration, formatDate } from '@/lib/storage';

export default function Home() {
  const navigate = useNavigate();
  const sessions = getSessions();
  const lastSession = sessions[0] ?? null;

  return (
    <div className="flex flex-col min-h-screen gradient-hero">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Eye className="w-4 h-4 text-primary" />
          </div>
          <span className="text-foreground font-bold text-xl tracking-wide">Wakey</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/history')}
            className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="History"
          >
            <History className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8 pb-12">
        {/* Big start button */}
        <div className="flex flex-col items-center gap-4 animate-fade-in-up">
          <button
            onClick={() => navigate('/drive')}
            className="relative w-52 h-52 rounded-full gradient-primary flex flex-col items-center justify-center gap-3 glow-primary active:scale-95 transition-all duration-150 shadow-2xl"
          >
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 scale-110 opacity-60 animate-pulse" />
            <div className="absolute inset-0 rounded-full border border-primary/20 scale-125 opacity-30 animate-pulse" style={{ animationDelay: '0.3s' }} />

            <Play className="w-10 h-10 text-primary-foreground fill-primary-foreground ml-1" />
            <span className="text-primary-foreground font-bold text-lg tracking-wide">Start Drive</span>
          </button>

          <p className="text-muted-foreground text-sm text-center max-w-xs">
            Place your phone on the dashboard with the front camera facing you
          </p>
        </div>

        {/* Last session card */}
        {lastSession ? (
          <div className="w-full max-w-sm gradient-card border border-border rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-3">Last session</p>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-foreground font-semibold text-base">{formatDate(lastSession.startTime)}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(lastSession.durationMs)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <AlertTriangle className={`w-4 h-4 ${lastSession.alertsCount > 0 ? 'text-state-alarm' : 'text-state-awake'}`} />
                    <span className={lastSession.alertsCount > 0 ? 'text-state-alarm' : 'text-state-awake'}>
                      {lastSession.alertsCount} {lastSession.alertsCount === 1 ? 'alarm' : 'alarms'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/history')}
                className="text-primary text-sm font-medium mt-1"
              >
                All →
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm gradient-card border border-border rounded-2xl p-5 flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-foreground font-medium text-sm">No sessions yet</p>
              <p className="text-muted-foreground text-xs mt-0.5">Start your first drive above</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
