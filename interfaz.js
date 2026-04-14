// 🎨 ==========================================
// INTERFAZ DE USUARIO Y EFECTOS VISUALES
// ==========================================

// 1. UTILIDADES VISUALES GLOBALES (Vibración y Confeti)
window.triggerVibration = function (pattern = 50) {
    if (navigator.vibrate) navigator.vibrate(pattern);
};

window.triggerConfetti = function () {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#A78BFA', '#ffffff']
    });
};

// 2. LÓGICA DEL MODO CLARO / OSCURO
const themeToggle = document.getElementById('themeToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const htmlElement = document.documentElement;

function toggleTheme() {
    if (htmlElement.classList.contains('dark')) {
        htmlElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        htmlElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
    triggerVibration(20);
}

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);


// 3. LÓGICA DEL MENÚ MÓVIL
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

window.toggleMobileMenu = function () {
    mobileMenu.classList.toggle('hidden');
    const iconMenu = document.getElementById('iconMenu');
    const iconClose = document.getElementById('iconClose');

    if (mobileMenu.classList.contains('hidden')) {
        iconMenu.classList.remove('hidden');
        iconClose.classList.add('hidden');
    } else {
        iconMenu.classList.add('hidden');
        iconClose.classList.remove('hidden');
    }
    triggerVibration(50);
};

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        if (!mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu();
        }
    });
});


// 4. LÓGICA DEL MENÚ DESPLEGABLE PERSONALIZADO PREMIUM (Redimensionar)
const customSelectContainer = document.getElementById('customSelectContainer');
const customSelectTrigger = document.getElementById('customSelectTrigger');
const customSelectDropdown = document.getElementById('customSelectDropdown');
const customSelectArrow = document.getElementById('customSelectArrow');
const customSelectLabel = document.getElementById('customSelectLabel');
const customOptions = document.querySelectorAll('.custom-option');
// 🚀 Borramos el 'const resizeSelect' global de aquí para que no choque con script.js

if (customSelectTrigger) {
    customSelectTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        customSelectDropdown.classList.toggle('custom-select-dropdown-open');
        customSelectArrow.classList.toggle('custom-select-arrow-open');
        triggerVibration(20);
    });
}

customOptions.forEach(option => {
    option.addEventListener('click', () => {
        const value = option.getAttribute('data-value');
        const text = option.innerText;

        // 🛑 MURO DE PAGO: Bloquear si intentan redimensionar y no son PRO
        if (value !== "0" && !isPremiumUser) {
            openPremiumModal();
            customSelectDropdown.classList.remove('custom-select-dropdown-open');
            customSelectArrow.classList.remove('custom-select-arrow-open');
            return;
        }

        // Marcar visualmente la opción
        customOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');

        // Actualizar el valor visual y el valor oculto
        customSelectLabel.innerText = text;

        // 🚀 Buscamos el elemento internamente SOLO cuando hacen clic
        const resizeSelectOculto = document.getElementById('resizeSelect');
        if (resizeSelectOculto) {
            resizeSelectOculto.value = value;
            resizeSelectOculto.dispatchEvent(new Event('change'));
        }

        // Cerrar menú
        customSelectDropdown.classList.remove('custom-select-dropdown-open');
        customSelectArrow.classList.remove('custom-select-arrow-open');
    });
});

// Cerrar el menú desplegable si hacen clic afuera
document.addEventListener('click', (e) => {
    if (customSelectContainer && !customSelectContainer.contains(e.target)) {
        if (customSelectDropdown) customSelectDropdown.classList.remove('custom-select-dropdown-open');
        if (customSelectArrow) customSelectArrow.classList.remove('custom-select-arrow-open');
    }
});

// 📍 ==========================================
// RADAR SCROLL SPY (Navegación de Puntos Lateral MEJORADA)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Quitamos 'main#inicio' de aquí, el sensor de tope máximo se encargará de él 🚀
    const sections = document.querySelectorAll('#caracteristicas, #como-funciona, #testimonios, #precios, #faq');
    const scrollDots = document.querySelectorAll('.scroll-dot');

    if (sections.length > 0 && scrollDots.length > 0) {
        // 2. Radar más preciso (Detecta cuando la sección cruza el centro de la pantalla)
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -40% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    scrollDots.forEach(dot => dot.classList.remove('active'));
                    const activeDot = document.querySelector(`.scroll-dot[href="#${entry.target.id}"]`);
                    if (activeDot) activeDot.classList.add('active');
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));

        // 🚀 3. SENSOR DE TOPE MÁXIMO (Asegura que "Inicio" se marque al llegar hasta arriba)
        window.addEventListener('scroll', () => {
            if (window.scrollY < 100) {
                scrollDots.forEach(dot => dot.classList.remove('active'));
                document.querySelector('.scroll-dot[href="#inicio"]')?.classList.add('active');
            }
        });
    }
});
