/**
 * TourMate - Unified i18n & Dual Modal Engine
 */
const DEFAULT_LANG = 'en';
let currentLang = localStorage.getItem('tourmate_lang') || DEFAULT_LANG;
let dict = {};

// 1. Navegación recursiva compacta
const getNested = (obj, path) => path.reduce((o, k) => (o ? o[k] : null), obj);

// 2. Carga asíncrona de diccionario y renderizado DOM
async function setLanguage(lang) {
    try {
        const res = await fetch(`assets/i18n/${lang}.json`);
        dict = await res.json();
        currentLang = lang;
        localStorage.setItem('tourmate_lang', lang);
        document.documentElement.lang = lang;

        // Traducir innerHTML
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const val = getNested(dict, el.getAttribute('data-i18n').split('.'));
            if (val) el.innerHTML = val;
        });

        // Traducir atributos (placeholder, alt, etc.)
        document.querySelectorAll('[data-i18n-attr]').forEach(el => {
            const [attr, keyPath] = el.getAttribute('data-i18n-attr').split(':');
            const val = getNested(dict, keyPath.split('.'));
            if (val) el.setAttribute(attr, val);
        });

        // Botón toggle de idioma
        const btn = document.getElementById('langToggle');
        if (btn) btn.textContent = dict.lang_btn || (lang === 'en' ? 'ES' : 'EN');
    } catch (err) {
        console.error('Error loading translations:', err);
    }
}

// 3. Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    // Carga de fragmento HTML de modales si no está en el DOM
    const modalContainer = document.getElementById('modalContainer');
    if (modalContainer && !document.getElementById('demoModal')) {
        try {
            const modalRes = await fetch('assets/html/modal-demo.html');
            if (modalRes.ok) {
                modalContainer.innerHTML = await modalRes.text();
            }
        } catch (e) {
            console.error('Error loading modal templates:', e);
        }
    }

    await setLanguage(currentLang);

    // Toggle de Idioma
    document.getElementById('langToggle')?.addEventListener('click', () => {
        setLanguage(currentLang === 'en' ? 'es' : 'en');
    });

    // Función genérica para abrir y cerrar modales
    const toggleModal = (modalId, show) => {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.classList.toggle('active', show);
        modal.setAttribute('aria-hidden', !show);
        document.body.style.overflow = show ? 'hidden' : '';
        if (!show) {
            const form = modal.querySelector('form');
            const status = modal.querySelector('.form-status');
            if (form) form.reset();
            if (status) status.textContent = '';
        }
    };

    // Modal 1: Apertura desde botón "Hablemos →"
    document.querySelectorAll('a[href="#contacto"], .button-dark').forEach(btn => {
        if (btn.closest('#agencias') || btn.getAttribute('data-i18n') === 'agencias.cta') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleModal('demoModal', true);
            });
        }
    });

    // Modal 2: Apertura desde botón "Quiero explorar →"
    document.getElementById('exploreBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        toggleModal('travelerModal', true);
    });

    // Cierre interactivo para ambos modales (cruces, cancelar y fondo)
    document.addEventListener('click', (e) => {
        if (e.target.closest('#closeDemoBtn') || e.target.closest('#cancelDemoBtn')) {
            toggleModal('demoModal', false);
        }
        if (e.target.closest('#closeTravelerBtn') || e.target.closest('#cancelTravelerBtn')) {
            toggleModal('travelerModal', false);
        }
        if (e.target.classList.contains('modal-backdrop')) {
            toggleModal(e.target.id, false);
        }
    });

    // Envío y validación: Formulario B2B Agencias
    document.addEventListener('submit', (e) => {
        if (e.target.id === 'demoForm') {
            e.preventDefault();
            const status = document.getElementById('modalFeedback');
            const isValid = ['modalAgency', 'modalRoute', 'modalWhatsapp'].every(
                id => document.getElementById(id)?.value.trim()
            );

            if (!isValid) {
                if (status) {
                    status.className = 'form-status error';
                    status.textContent = dict.modal?.feedback_error || 'Error: complete all fields.';
                }
                return;
            }

            if (status) {
                status.className = 'form-status success';
                status.textContent = dict.modal?.feedback_success || 'Success! We will contact you soon.';
            }
            setTimeout(() => toggleModal('demoModal', false), 1800);
        }

        // Envío y validación: Formulario B2C Viajeros
        if (e.target.id === 'travelerForm') {
            e.preventDefault();
            const status = document.getElementById('travelerFeedback');
            const isValid = ['travelerName', 'travelerRoute', 'travelerContact'].every(
                id => document.getElementById(id)?.value.trim()
            );

            if (!isValid) {
                if (status) {
                    status.className = 'form-status error';
                    status.textContent = dict.traveler_modal?.feedback_error || 'Error: complete all fields.';
                }
                return;
            }

            if (status) {
                status.className = 'form-status success';
                status.textContent = dict.traveler_modal?.feedback_success || 'Route info sent successfully!';
            }
            setTimeout(() => toggleModal('travelerModal', false), 1800);
        }
    });
});