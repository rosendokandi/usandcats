import confetti from 'canvas-confetti';

type ConfettiFn = (options?: confetti.Options) => Promise<null | undefined> | null | void;
let customConfettiInstance: ConfettiFn | null = null;

function getConfetti(): ConfettiFn {
  if (!customConfettiInstance && typeof document !== 'undefined') {
    let canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement | null;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'confetti-canvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '9999';
      (canvas.style as any).webkitTapHighlightColor = 'transparent';
      canvas.style.transform = 'translateZ(0)';
      canvas.style.willChange = 'transform';
      document.body.appendChild(canvas);
    }

    try {
      customConfettiInstance = confetti.create(canvas, {
        resize: true,
        useWorker: true,
        disableForReducedMotion: true,
      });
    } catch {
      customConfettiInstance = confetti;
    }
  }
  return customConfettiInstance || confetti;
}

export const fireHeartShower = (originX: number = 0.5, originY: number = 0.5) => {
  const instance = getConfetti();
  instance({
    particleCount: 35,
    spread: 55,
    origin: { x: originX, y: originY },
    colors: ['#fadadd', '#debfc2', '#70585b', '#e1e1f5', '#d6e6d7'],
    shapes: ['square', 'circle'],
    scalar: 1.1,
    ticks: 180,
    gravity: 0.85,
  });
};

export const fireBigCelebration = () => {
  const instance = getConfetti();
  const duration = 2.0 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const interval: ReturnType<typeof setInterval> = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);
    instance({ 
      ...defaults, 
      particleCount, 
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, 
      colors: ['#fadadd', '#fbdbde', '#e1e1f5'] 
    });
    instance({ 
      ...defaults, 
      particleCount, 
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, 
      colors: ['#fadadd', '#d6e6d7', '#70585b'] 
    });
  }, 250);
};

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
