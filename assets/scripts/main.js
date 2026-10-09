function switchPlans(planType) {
    const btnTourists = document.getElementById('btn-tourists');
    const btnAgencies = document.getElementById('btn-agencies');
    const touristPlans = document.getElementById('tourist-plans');
    const agencyPlans = document.getElementById('agency-plans');
    if (planType === 'tourists') {
        btnTourists.classList.add('active');
        btnAgencies.classList.remove('active');
        touristPlans.classList.add('active');
        agencyPlans.classList.remove('active');
        btnTourists.setAttribute('aria-selected', 'true');
        btnAgencies.setAttribute('aria-selected', 'false');
    } else if (planType === 'agencies') {
        btnTourists.classList.remove('active');
        btnAgencies.classList.add('active');
        touristPlans.classList.remove('active');
        agencyPlans.classList.add('active');
        btnTourists.setAttribute('aria-selected', 'false');
        btnAgencies.setAttribute('aria-selected', 'true');
    }
}

function toggleMobileMenu() {
    const navCollapse = document.getElementById('nav-collapse');
    const hamburger = document.querySelector('.hamburger-button');
    if (navCollapse && hamburger) {
        const isOpen = navCollapse.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
    }
}

(function () {
    const stage = document.getElementById('carousel-stage')
    if(!stage) return

    const slides = [...stage.querySelectorAll('.carousel-slide')]
    const dotsBox = document.getElementById('carousel-dots')
    const n = slides.length

    let current = 0, timer

    const dots = slides.map((_, i) => {
        const b = document.createElement('button')
        b.setAttribute('aria-label', `go to cap ${i + 1}`)
        b.addEventListener('click', () => { 
            goTo(i)

            restart()
        })

        dotsBox.appendChild(b)

        return b
    })

    function render(prevIndex) {
        slides.forEach((s, i) => {
            s.classList.toggle('is-active', i === current)
            s.classList.toggle('is-prev', i === (current - 1 + n) % n && n > 2)
            s.classList.toggle('is-next', i === (current + 1) % n)
            s.setAttribute('aria-hidden', i === current ? 'false' : 'true')
        })

        if(prevIndex !== undefined && prevIndex !== current) {
            const out = slides[prevIndex]
            out.classList.add('is-leaving')
            setTimeout(() => out.classList.remove('is-leaving'), 600)
        }

        dots.forEach((d,i) => d.classList.toggle('active'), i === current)
    }

    function goTo(i) {
        const prev = current
        current = (i + n) % n
        render(prev)
    }

    slides.forEach((s, i) => s.addEventListener('click', () => {
        if (i !== current) { goTo(i); restart(); }
    }));

    const start = () => { timer = setInterval(() => goTo(current + 1), 4500); };
    const restart = () => { clearInterval(timer); start(); };
    stage.addEventListener('mouseenter', () => clearInterval(timer));
    stage.addEventListener('mouseleave', start);


    let x0 = null;
    stage.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; clearInterval(timer); }, { passive: true });
    stage.addEventListener('touchend', e => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
        x0 = null; start();
    });

    stage.tabIndex = 0;
    stage.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { goTo(current + 1); restart(); }
        if (e.key === 'ArrowLeft')  { goTo(current - 1); restart(); }
    });

    render();
    start();

})()
