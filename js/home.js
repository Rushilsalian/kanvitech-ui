/**
 * Kanvtech Solutions - Landing Page Interaction Layer
 * Loaded ONLY on index.html, in addition to main.js.
 * Adds: scroll progress bar, hero mouse parallax, magnetic buttons,
 * and the dashboard-mockup load-in animation.
 */

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

  // 1. Scroll Progress Bar
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // 2. Hero dashboard mockup - trigger load-in fill animation (chart bars, ring)
  const heroMockup = document.getElementById('heroMockup');
  if (heroMockup) {
    setTimeout(() => heroMockup.classList.add('mockup-in-view'), 350);
  }

  // 3. Hero mouse parallax (desktop only, respects reduced motion)
  const heroVisual = document.getElementById('heroVisual');
  if (heroVisual && heroMockup && hasFinePointer && !reduceMotion) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = null;

    const settle = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      heroMockup.style.transform = `rotateY(${-8 + currentX}deg) rotateX(${3 + currentY}deg)`;

      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        raf = requestAnimationFrame(settle);
      } else {
        raf = null;
      }
    };

    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = px * 10;
      targetY = -py * 8;
      if (!raf) raf = requestAnimationFrame(settle);
    });

    heroVisual.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      if (!raf) raf = requestAnimationFrame(settle);
    });
  }

  // 4. Magnetic buttons (desktop only, respects reduced motion)
  if (hasFinePointer && !reduceMotion) {
    document.querySelectorAll('.magnetic-btn').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }
});
