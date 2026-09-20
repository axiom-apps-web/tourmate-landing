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
