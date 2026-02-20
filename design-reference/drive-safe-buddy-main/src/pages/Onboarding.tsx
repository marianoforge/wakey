import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Eye, Shield, Bell, Camera } from 'lucide-react';
import { setOnboardingDone } from '@/lib/storage';
import onboardingHero from '@/assets/onboarding-hero.png';

const slides = [
  {
    icon: Eye,
    title: 'Stay alert,\nstay alive.',
    body: 'Wakey watches your eyes in real time while you drive, detecting drowsiness before it becomes dangerous.',
    accent: 'awake',
  },
  {
    icon: Shield,
    title: '100% private,\non your device.',
    body: 'All face analysis happens locally. No video is recorded, uploaded, or stored anywhere. Your data never leaves your phone.',
    accent: 'primary',
  },
  {
    icon: Bell,
    title: 'Instant alerts\nthat wake you up.',
    body: 'First a gentle warning. If drowsiness continues, a strong alarm — sound and vibration — jolts you awake.',
    accent: 'drowsy',
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const isLast = step === slides.length - 1;
  const slide = slides[step];

  const handleNext = () => {
    if (isLast) {
      setOnboardingDone();
      navigate('/home');
    } else {
      setStep((s) => s + 1);
    }
  };

  const accentClasses: Record<string, string> = {
    awake: 'text-state-awake',
    primary: 'text-primary',
    drowsy: 'text-state-drowsy',
  };

  const accentBg: Record<string, string> = {
    awake: 'bg-state-awake/15 border-state-awake/30',
    primary: 'bg-primary/15 border-primary/30',
    drowsy: 'bg-state-drowsy/15 border-state-drowsy/30',
  };

  const Icon = slide.icon;

  return (
    <div className="flex flex-col min-h-screen gradient-hero overflow-hidden">
      {/* Hero image */}
      <div className="relative flex-shrink-0 h-56 sm:h-72 overflow-hidden">
        <img
          src={onboardingHero}
          alt="Night road with eye icon"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        {/* Logo */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Eye className="w-4 h-4 text-primary" />
          </div>
          <span className="text-foreground font-bold text-lg tracking-wide">Wakey</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pb-8 pt-2">
        {/* Slide content */}
        <div className="flex-1 flex flex-col justify-center animate-fade-in-up" key={step}>
          <div
            className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-6 ${accentBg[slide.accent]}`}
          >
            <Icon className={`w-8 h-8 ${accentClasses[slide.accent]}`} />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight whitespace-pre-line mb-4">
            {slide.title}
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            {slide.body}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 mb-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-semibold text-lg flex items-center justify-center gap-2 glow-primary transition-all active:scale-95"
        >
          {isLast ? (
            <>
              <Camera className="w-5 h-5" />
              Enable camera
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>

        {isLast && (
          <p className="text-center text-muted-foreground text-xs mt-3">
            Camera is used only during active drive sessions
          </p>
        )}

        {!isLast && (
          <button
            onClick={() => {
              setOnboardingDone();
              navigate('/home');
            }}
            className="text-center text-muted-foreground text-sm mt-4 py-2"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
