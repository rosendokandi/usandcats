import confetti from 'canvas-confetti';

export const fireHeartShower = (originX: number = 0.5, originY: number = 0.5) => {
  // Fire pastel confetti & hearts
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { x: originX, y: originY },
    colors: ['#fadadd', '#debfc2', '#70585b', '#e1e1f5', '#d6e6d7'],
    shapes: ['square', 'circle'],
    scalar: 1.2,
    ticks: 200,
    gravity: 0.8,
  });
};

export const fireBigCelebration = () => {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };

  const interval: ReturnType<typeof setInterval> = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#fadadd', '#fbdbde', '#e1e1f5'] });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#fadadd', '#d6e6d7', '#70585b'] });
  }, 250);
};

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
