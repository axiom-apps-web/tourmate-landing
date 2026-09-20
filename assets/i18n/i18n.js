/**
 * i18n.js - TourMate internationalization module
 * NexumDevs - UPC 2026
 *
 * Loads EN/ES translations from JSON files and applies them
 * to all elements with data-i18n and data-i18n-attr attributes.
 */

let currentLang = 'en';
let translations = {};

const languageMeta = {
  en: {
    nextCode: 'ES',
    nextFlag: '\uD83C\uDDF5\uD83C\uDDEA',
    htmlLang: 'en',
    buttonLabel: 'Switch to Spanish',
    announcement: 'Language changed to English'
  },
  es: {
    nextCode: 'EN',
    nextFlag: '\uD83C\uDDFA\uD83C\uDDF8',
    htmlLang: 'es',
    buttonLabel: 'Cambiar a ingles',
    announcement: 'Idioma cambiado a espa\u00f1ol'
  }
};

/**
 * Flattens a nested object into dot-notation keys.
 * Example: { nav: { tourists: "Tourists" } } -> { "nav.tourists": "Tourists" }
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
  if (!response.ok) {
    throw new Error(`Could not load translations for ${lang}`);
  }

  const data = await response.json();
  return flattenTranslations(data);
}

function applyTextTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key] === undefined) return;

    if (key.endsWith('_html')) {
      el.innerHTML = translations[key];
    } else {
      el.textContent = translations[key];
    }
  });
}

function applyAttributeTranslations() {
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const rules = el.getAttribute('data-i18n-attr').split(';');

    rules.forEach(rule => {
      const [attr, key] = rule.split(':').map(part => part && part.trim());
      if (!attr || !key || translations[key] === undefined) return;
      el.setAttribute(attr, translations[key]);
    });
  });
}

/**
 * Applies the loaded translations to the DOM.
 */
function applyTranslations() {
  applyTextTranslations();
  applyAttributeTranslations();
}

function updateLanguageToggle() {
  const meta = languageMeta[currentLang];
  const langCode = document.getElementById('lang-code');
  const langFlag = document.getElementById('lang-flag');
  const langBtn = document.getElementById('lang-toggle-btn');

  document.documentElement.lang = meta.htmlLang;

  if (langCode) langCode.textContent = meta.nextCode;
  if (langFlag) langFlag.textContent = meta.nextFlag;
  if (langBtn) langBtn.setAttribute('aria-label', meta.buttonLabel);
}

function announceLanguageChange() {
  const announcer = document.getElementById('lang-announcer');
  if (announcer) {
    announcer.textContent = languageMeta[currentLang].announcement;
  }
}

/**
 * Toggles the language between EN and ES.
 */
async function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'es' : 'en';
  translations = await loadTranslations(currentLang);
  applyTranslations();
  updateLanguageToggle();
  announceLanguageChange();
}

/**
 * Initializes i18n on page load.
 */
async function initI18n() {
  translations = await loadTranslations(currentLang);
  applyTranslations();
  updateLanguageToggle();
}

document.addEventListener('DOMContentLoaded', initI18n);
