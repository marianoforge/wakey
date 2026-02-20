let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(frequency: number, duration: number, volume: number, type: OscillatorType = 'sine') {
  try {
    const ctx = getCtx();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration - 0.05);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available
  }
}

export function playWarningSound() {
  playTone(660, 0.3, 0.4, 'sine');
  setTimeout(() => playTone(550, 0.3, 0.4, 'sine'), 350);
}

export function playAlarmSound() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      playTone(880, 0.18, 0.7, 'sawtooth');
      playTone(440, 0.18, 0.5, 'square');
    }, i * 200);
  }
}

export function vibrateWarning() {
  if ('vibrate' in navigator) {
    navigator.vibrate([200, 100, 200]);
  }
}

export function vibrateAlarm() {
  if ('vibrate' in navigator) {
    navigator.vibrate([500, 100, 500, 100, 500, 100, 500]);
  }
}
