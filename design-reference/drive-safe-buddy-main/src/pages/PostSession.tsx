import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Clock, Home, History } from 'lucide-react';
import { formatDuration } from '@/lib/storage';

interface SessionResult {
  durationMs: number;
  alertsCount: number;
  warningsCount: number;
}

export default function PostSession() {
  const navigate = useNavigate();
  const location = useLocation();

  const result = (location.state as SessionResult | null) ?? {
    durationMs: 0,
    alertsCount: 0,
    warningsCount: 0,
  };

  const isSafe = result.alertsCount === 0;

  return (
    <div className="flex flex-col min-h-screen gradient-hero items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center text-center gap-8 animate-fade-in-up">
        {/* Icon */}
        <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 ${
          isSafe
            ? 'bg-state-awake/15 border-state-awake glow-awake'
            : 'bg-state-alarm/15 border-state-alarm glow-alarm'
        }`}>
          {isSafe ? (
            <CheckCircle className="w-12 h-12 text-state-awake" />
          ) : (
            <AlertTriangle className="w-12 h-12 text-state-alarm" />
          )}
        </div>

        {/* Title */}
        <div>
          <h1 className="text-foreground font-bold text-3xl mb-2">Session ended</h1>
          <p className="text-muted-foreground text-base">
            {isSafe ? 'Great drive! No drowsiness detected.' : 'Stay rested before your next drive.'}
          </p>
        </div>

        {/* Stats */}
        <div className="w-full gradient-card border border-border rounded-2xl p-5 flex flex-col gap-4">
          <StatRow
            icon={<Clock className="w-5 h-5 text-primary" />}
            label="Duration"
            value={formatDuration(result.durationMs)}
          />
          <div className="h-px bg-border" />
          <StatRow
            icon={<AlertTriangle className="w-5 h-5 text-state-drowsy" />}
            label="Warnings"
            value={`${result.warningsCount}`}
          />
          <div className="h-px bg-border" />
          <StatRow
            icon={<AlertTriangle className="w-5 h-5 text-state-alarm" />}
            label="Alarms"
            value={`${result.alertsCount}`}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => navigate('/history')}
            className="w-full py-4 rounded-2xl bg-secondary border border-border text-foreground font-semibold text-base flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <History className="w-5 h-5" />
            View history
          </button>
          <button
            onClick={() => navigate('/home')}
            className="w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 glow-primary active:scale-95 transition-all"
          >
            <Home className="w-5 h-5" />
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-muted-foreground text-sm">{label}</span>
      </div>
      <span className="text-foreground font-bold text-lg">{value}</span>
    </div>
  );
}
