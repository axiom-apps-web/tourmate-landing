/**
 * i18n.js â€” TourMate internationalization module
 * NexumDevs Â· UPC 2026
 *
 * Loads EN/ES translations from JSON files and applies them
 * to all elements with a data-i18n attribute.
 */

let currentLang = 'en';
let translations = {};

/**
 * Flattens a nested object into dot-notation keys.
 * e.g. { nav: { tourists: "Tourists" } } â†’ { "nav.tourists": "Tourists" }
 */
function flattenTranslations(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(acc, flattenTranslations(obj[key], fullKey));
    } else {
      acc[fullKey] = obj[key];
    }
    return acc;
  }, {});
}

/**
 * Loads a JSON translation file for the given language code.
 * @param {string} lang - 'en' or 'es'
 * @returns {Promise<object>} flattened translations object
 */
async function loadTranslations(lang) {
  const response = await fetch(`assets/i18n/${lang}.json`);
  const data = await response.json();
  return flattenTranslations(data);
}

/**
 * Applies the loaded translations to all [data-i18n] elements in the DOM.
 */
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key] !== undefined) {
      if (key.endsWith('_html')) {
        el.innerHTML = translations[key];
      } else {
        el.textContent = translations[key];
      }
    }
  });
}

/**
 * Toggles the language between EN and ES, updates the navbar button,
 * and announces the change to screen readers.
 */
async function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'es' : 'en';
  translations = await loadTranslations(currentLang);
  applyTranslations();

  // update navbar toggle button labels
  const langCode = document.getElementById('lang-code');
  const langFlag = document.getElementById('lang-flag');
  const langBtn  = document.getElementById('lang-toggle-btn');

  if (currentLang === 'es') {
    if (langCode) langCode.textContent = 'EN';
    if (langFlag) langFlag.textContent = 'ðŸ‡ºðŸ‡¸';
    if (langBtn)  langBtn.setAttribute('aria-label', 'Switch to English');
  } else {
    if (langCode) langCode.textContent = 'ES';
    if (langFlag) langFlag.textContent = 'ðŸ‡µðŸ‡ª';
    if (langBtn)  langBtn.setAttribute('aria-label', 'Switch to Spanish');
  }

  // announce language change to screen readers
  const announcer = document.getElementById('lang-announcer');
  if (announcer) {
    announcer.textContent = currentLang === 'es'
      ? 'Idioma cambiado a espaÃ±ol'
      : 'Language changed to English';
  }
}

/**
 * Initializes i18n on page load â€” loads English by default.
 */
async function initI18n() {
  translations = await loadTranslations(currentLang);
  applyTranslations();
}

document.addEventListener('DOMContentLoaded', initI18n);
