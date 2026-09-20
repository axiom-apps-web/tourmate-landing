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
