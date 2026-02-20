import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Smartphone, Shield, Info, ChevronRight } from 'lucide-react';
import { getSettings, saveSettings, AppSettings } from '@/lib/storage';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<AppSettings>(getSettings());

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  function update<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  const sensitivities: Array<{ value: AppSettings['sensitivity']; label: string; desc: string }> = [
    { value: 'low', label: 'Low', desc: 'Fewer alerts' },
    { value: 'medium', label: 'Medium', desc: 'Balanced' },
    { value: 'high', label: 'High', desc: 'More sensitive' },
  ];

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
        <h1 className="text-foreground font-bold text-xl">Settings</h1>
      </div>

      <div className="flex-1 px-6 pb-12 flex flex-col gap-6">
        {/* Sensitivity */}
        <div className="gradient-card border border-border rounded-2xl p-5">
          <h2 className="text-foreground font-semibold text-sm mb-1">Detection Sensitivity</h2>
          <p className="text-muted-foreground text-xs mb-4">How quickly Wakey triggers an alert</p>
          <div className="flex gap-2">
            {sensitivities.map((s) => (
              <button
                key={s.value}
                onClick={() => update('sensitivity', s.value)}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                  settings.sensitivity === s.value
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-muted/50 border-border text-muted-foreground'
                }`}
              >
                <div>{s.label}</div>
                <div className="text-xs opacity-70 mt-0.5">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="gradient-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 pt-5 pb-2">
            <h2 className="text-foreground font-semibold text-sm">Alert Methods</h2>
          </div>

          <ToggleRow
            icon={<Volume2 className="w-5 h-5" />}
            label="Sound alerts"
            desc="Audio warning and alarm tones"
            checked={settings.soundEnabled}
            onChange={(v) => update('soundEnabled', v)}
          />
          <div className="h-px bg-border mx-5" />
          <ToggleRow
            icon={<Smartphone className="w-5 h-5" />}
            label="Vibration"
            desc="Haptic feedback alerts"
            checked={settings.vibrationEnabled}
            onChange={(v) => update('vibrationEnabled', v)}
          />
        </div>

        {/* Privacy */}
        <div className="gradient-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 pt-5 pb-2">
            <h2 className="text-foreground font-semibold text-sm">Privacy</h2>
          </div>

          <ToggleRow
            icon={<Shield className="w-5 h-5" />}
            label="Share anonymous data"
            desc="Help improve detection algorithms"
            checked={settings.shareAnonymousData}
            onChange={(v) => update('shareAnonymousData', v)}
          />
        </div>

        {/* Links */}
        <div className="gradient-card border border-border rounded-2xl overflow-hidden">
          <LinkRow label="Privacy Policy" />
          <div className="h-px bg-border mx-5" />
          <LinkRow label="Terms & Conditions" />
        </div>

        {/* Version */}
        <div className="text-center text-muted-foreground text-xs mt-2">
          Wakey v1.0.0 · All processing is on-device
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  desc,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${checked ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-foreground text-sm font-medium">{label}</p>
        <p className="text-muted-foreground text-xs">{desc}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-primary' : 'bg-muted'}`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-0.5'}`}
        />
      </button>
    </div>
  );
}

function LinkRow({ label }: { label: string }) {
  return (
    <button className="w-full flex items-center justify-between px-5 py-4 text-muted-foreground hover:text-foreground transition-colors">
      <span className="text-sm font-medium">{label}</span>
      <ChevronRight className="w-4 h-4" />
    </button>
  );
}
