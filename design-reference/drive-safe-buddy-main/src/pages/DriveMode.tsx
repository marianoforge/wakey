import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertTriangle, X, Camera } from 'lucide-react';
import { saveSession, getSettings } from '@/lib/storage';
import { playWarningSound, playAlarmSound, vibrateWarning, vibrateAlarm } from '@/lib/audio';

type DriveState = 'awake' | 'drowsy' | 'alarm';

interface SessionCounters {
  warnings: number;
  alarms: number;
}

// Sensitivity → seconds before triggering
const SENSITIVITY_THRESHOLDS = {
  low: { drowsy: 4, alarm: 8 },
  medium: { drowsy: 2.5, alarm: 5 },
  high: { drowsy: 1.5, alarm: 3 },
};

export default function DriveMode() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const stateTimerRef = useRef<number>(0); // seconds in current "bad" state
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionIdRef = useRef<string>(crypto.randomUUID());

  const [driveState, setDriveState] = useState<DriveState>('awake');
  const [cameraError, setCameraError] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [counters, setCounters] = useState<SessionCounters>({ warnings: 0, alarms: 0 });
  const [showHint, setShowHint] = useState(true);

  const settings = getSettings();
  const thresholds = SENSITIVITY_THRESHOLDS[settings.sensitivity];

  // Start camera
  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (!mounted) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch {
        if (mounted) setCameraError(true);
      }
    }

    startCamera();
    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // Simulated drowsiness detection engine
  // In a real app this would use TensorFlow.js or MediaPipe FaceMesh
  useEffect(() => {
    // Hide hint after 4 seconds
    const hintTimer = setTimeout(() => setShowHint(false), 4000);

    // Main detection loop — every 100ms tick
    let tick = 0;
    let currentSimState: 'awake' | 'bad' = 'awake';
    let badDuration = 0;
    let nextBadAt = randomBetween(15, 45); // seconds until first simulated event

    const loop = setInterval(() => {
      tick++;
      const elapsed = tick / 10; // seconds
      setElapsedSec(Math.floor(elapsed));

      // Simulate drowsiness events
      if (elapsed >= nextBadAt) {
        if (currentSimState === 'awake') {
          currentSimState = 'bad';
          badDuration = 0;
        }
      }

      if (currentSimState === 'bad') {
        badDuration += 0.1;

        if (badDuration >= thresholds.alarm) {
          if (driveStateRef.current !== 'alarm') {
            updateState('alarm');
          }
        } else if (badDuration >= thresholds.drowsy) {
          if (driveStateRef.current !== 'alarm' && driveStateRef.current !== 'drowsy') {
            updateState('drowsy');
          }
        }

        // Auto-recover after bad event ends (simulate user waking up)
        if (badDuration >= thresholds.alarm + 2) {
          currentSimState = 'awake';
          badDuration = 0;
          nextBadAt = elapsed + randomBetween(20, 60);
          updateState('awake');
        }
      }
    }, 100);

    intervalRef.current = loop;
    return () => {
      clearInterval(loop);
      clearTimeout(hintTimer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep ref for state inside interval closure
  const driveStateRef = useRef<DriveState>('awake');

  const updateState = useCallback((newState: DriveState) => {
    driveStateRef.current = newState;
    setDriveState(newState);

    if (newState === 'drowsy') {
      setCounters(c => ({ ...c, warnings: c.warnings + 1 }));
      if (settings.soundEnabled) playWarningSound();
      if (settings.vibrationEnabled) vibrateWarning();
    }
    if (newState === 'alarm') {
      setCounters(c => ({ ...c, alarms: c.alarms + 1 }));
      if (settings.soundEnabled) playAlarmSound();
      if (settings.vibrationEnabled) vibrateAlarm();
    }
  }, [settings]);

  const endSession = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());

    const durationMs = Date.now() - startTimeRef.current;
    const session = {
      id: sessionIdRef.current,
      startTime: startTimeRef.current,
      endTime: Date.now(),
      durationMs,
      alertsCount: counters.alarms,
      warningsCount: counters.warnings,
    };
    saveSession(session);

    navigate('/post-session', {
      state: {
        durationMs,
        alertsCount: counters.alarms,
        warningsCount: counters.warnings,
      },
    });
  };

  const stateConfig = {
    awake: {
      label: 'All Good',
      sublabel: 'Awake',
      icon: Eye,
      borderClass: 'border-state-awake',
      bgClass: 'bg-state-awake/8',
      textClass: 'text-state-awake',
      glowClass: 'glow-awake',
      animClass: '',
    },
    drowsy: {
      label: 'Caution',
      sublabel: 'Drowsiness detected',
      icon: AlertTriangle,
      borderClass: 'border-state-drowsy',
      bgClass: 'bg-state-drowsy/10',
      textClass: 'text-state-drowsy',
      glowClass: 'glow-drowsy',
      animClass: 'animate-pulse-drowsy',
    },
    alarm: {
      label: 'Wake up!',
      sublabel: 'ALERT',
      icon: EyeOff,
      borderClass: 'border-state-alarm',
      bgClass: 'bg-state-alarm/15',
      textClass: 'text-state-alarm',
      glowClass: 'glow-alarm',
      animClass: 'animate-pulse-alarm',
    },
  };

  const cfg = stateConfig[driveState];
  const Icon = cfg.icon;

  const formatElapsed = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (cameraError) {
    return <CameraPermissionDenied onGoHome={() => navigate('/home')} />;
  }

  return (
    <div className={`drive-mode-screen flex flex-col transition-colors duration-700 ${cfg.bgClass}`}>
      {/* Camera feed */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        playsInline
        muted
        autoPlay
      />

      {/* Alarm border overlay */}
      {driveState === 'alarm' && (
        <div className="absolute inset-0 border-8 border-state-alarm rounded-none animate-pulse-alarm pointer-events-none z-10" />
      )}
      {driveState === 'drowsy' && (
        <div className="absolute inset-0 border-4 border-state-drowsy pointer-events-none z-10 animate-pulse-drowsy" />
      )}

      {/* Content */}
      <div className="relative z-20 flex flex-col h-full px-6 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="gradient-card border border-border/50 rounded-2xl px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-state-alarm animate-pulse" />
            <span className="text-foreground font-mono font-bold text-lg">{formatElapsed(elapsedSec)}</span>
          </div>

          <div className="flex gap-3">
            <div className="gradient-card border border-border/50 rounded-2xl px-3 py-2 text-center">
              <div className="text-state-drowsy font-bold text-lg leading-none">{counters.warnings}</div>
              <div className="text-muted-foreground text-xs">warn</div>
            </div>
            <div className="gradient-card border border-border/50 rounded-2xl px-3 py-2 text-center">
              <div className="text-state-alarm font-bold text-lg leading-none">{counters.alarms}</div>
              <div className="text-muted-foreground text-xs">alarm</div>
            </div>
          </div>
        </div>

        {/* Center state display */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div
            className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 flex items-center justify-center ${cfg.borderClass} ${cfg.animClass} transition-all duration-500`}
          >
            <Icon className={`w-14 h-14 sm:w-18 sm:h-18 ${cfg.textClass} transition-colors duration-500`} />
          </div>

          <div className="text-center">
            <p className={`text-5xl sm:text-6xl font-black tracking-tight ${cfg.textClass} transition-colors duration-500`}>
              {cfg.label}
            </p>
            <p className="text-muted-foreground text-sm mt-1 font-medium uppercase tracking-widest">
              {cfg.sublabel}
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center gap-3">
          {showHint && (
            <p className="text-muted-foreground text-sm text-center animate-fade-in-up">
              Keep your face in front of the camera
            </p>
          )}

          <button
            onClick={endSession}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-secondary/80 border border-border text-foreground font-semibold text-base backdrop-blur-sm active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
            End session
          </button>
        </div>
      </div>
    </div>
  );
}

function CameraPermissionDenied({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="flex flex-col min-h-screen gradient-hero items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-state-alarm/15 border border-state-alarm/40 flex items-center justify-center mb-6">
        <Camera className="w-10 h-10 text-state-alarm" />
      </div>
      <h1 className="text-foreground font-bold text-2xl mb-3">Camera access required</h1>
      <p className="text-muted-foreground text-base mb-8 max-w-xs">
        Wakey needs the front camera to detect drowsiness in real time. No video is stored.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="w-full max-w-xs py-4 rounded-2xl gradient-primary text-primary-foreground font-semibold text-base glow-primary active:scale-95 transition-all mb-3"
      >
        Try again
      </button>
      <button
        onClick={onGoHome}
        className="text-muted-foreground text-sm"
      >
        Back to home
      </button>
    </div>
  );
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}
