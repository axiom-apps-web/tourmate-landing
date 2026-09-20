/**
 * visitor.js — TourMate returning-visitor detection and scroll interactions
 * NexumDevs · UPC 2026
 *
 * Handles three independent concerns:
 * 1. Recurring-visitor detection via localStorage (shows the news banner).
 * 2. Scroll-triggered reveal for the narrative section (IntersectionObserver).
 * 3. Animated count-up for the social-proof counters (IntersectionObserver).
 */
const LAST_VISIT_KEY = 'tourmate_last_visit';
/**
 * Shows the "news since your last visit" banner for returning visitors.
 * First-time visitors just get the timestamp stored, with no banner.
 */
function initVisitorTracking() {
    const hasVisitedBefore = Boolean(localStorage.getItem(LAST_VISIT_KEY));
    localStorage.setItem(LAST_VISIT_KEY, Date.now().toString());
    if (!hasVisitedBefore) {
        return;
    }
    const banner = document.getElementById('return-banner');
    if (banner) {
        banner.hidden = false;
        document.body.classList.add('has-banner');
    }
}
/**
 * Wires the banner's dismiss button — closes it for the rest of the session
 * without touching the localStorage visit record.
 */
function initBannerDismiss() {
    const closeBtn = document.getElementById('return-banner-close');
    const banner = document.getElementById('return-banner');
    if (!closeBtn || !banner) {
        return;
    }
    closeBtn.addEventListener('click', () => {
        banner.hidden = true;
        document.body.classList.remove('has-banner');
    });
}
/**
 * Reveals narrative steps as they scroll into view. Skips the animation
 * entirely when the user prefers reduced motion.
 */
function initScrollReveal() {
    const steps = document.querySelectorAll('[data-reveal]');
    if (!steps.length) {
        return;
    }
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        steps.forEach(step => step.classList.add('is-visible'));
        return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    steps.forEach(step => observer.observe(step));
}

