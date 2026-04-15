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

// 📱 ==========================================
// LÓGICA DE INSTALACIÓN PWA (BOTÓN INSTALAR)
// ==========================================
let deferredPrompt;
const installBtn = document.getElementById('installAppBtn');
const installBtnMobile = document.getElementById('installAppBtnMobile');

window.addEventListener('beforeinstallprompt', (e) => {
    // Evitar que el navegador muestre el aviso automático
    e.preventDefault();
    deferredPrompt = e;
    // Mostrar los botones solo si la app se puede instalar
    if (installBtn) installBtn.classList.remove('hidden');
    if (installBtnMobile) installBtnMobile.classList.remove('hidden');
});

async function handleInstallClick() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
        if (installBtn) installBtn.classList.add('hidden');
        if (installBtnMobile) installBtnMobile.classList.add('hidden');
    }
    deferredPrompt = null;
}

if (installBtn) installBtn.addEventListener('click', handleInstallClick);
if (installBtnMobile) installBtnMobile.addEventListener('click', handleInstallClick);

window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    if (installBtn) installBtn.classList.add('hidden');
    if (installBtnMobile) installBtnMobile.classList.add('hidden');
    // Usamos tu sistema de notificaciones premium
    if (typeof Notify !== 'undefined') {
        Notify.show('¡App Instalada!', 'Compressly ya está lista en tu pantalla de inicio.', 'success');
    }
});


// 📊 ==========================================
// DASHBOARD ANALÍTICO (Estadísticas Locales)
// ==========================================
let appStats = JSON.parse(localStorage.getItem('compressly_stats')) || { total: 0, webp: 0, jpg: 0, png: 0 };

window.updateDashboardStats = function (format) {
    appStats.total += 1;
    if (format === 'webp') appStats.webp += 1;
    else if (format === 'jpg' || format === 'jpeg') appStats.jpg += 1;
    else if (format === 'png') appStats.png += 1;

    localStorage.setItem('compressly_stats', JSON.stringify(appStats));
    renderDashboard();
};

window.renderDashboard = function () {
    const statTotal = document.getElementById('statTotalImages');
    if (!statTotal) return; // Si no estamos en el index, salir

    statTotal.innerText = appStats.total;
    if (appStats.total === 0) return;

    // Calcular porcentajes exactos
    const webpPct = Math.round((appStats.webp / appStats.total) * 100);
    const jpgPct = Math.round((appStats.jpg / appStats.total) * 100);
    const pngPct = Math.round((appStats.png / appStats.total) * 100);

    // Mover las barras
    document.getElementById('statWebpPct').innerText = webpPct + '%';
    document.getElementById('barWebp').style.width = webpPct + '%';

    document.getElementById('statJpgPct').innerText = jpgPct + '%';
    document.getElementById('barJpg').style.width = jpgPct + '%';

    document.getElementById('statPngPct').innerText = pngPct + '%';
    document.getElementById('barPng').style.width = pngPct + '%';
};

// Cargar las barritas apenas se inicie la web
document.addEventListener('DOMContentLoaded', renderDashboard);

// 📈 ==========================================
// LÓGICA DE BARRA DE PROGRESO DE LECTURA
// ==========================================
window.addEventListener('scroll', () => {
    const progressBar = document.getElementById("readingProgress");
    if (!progressBar) return;

    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    // 🚀 Restamos 60px al alto total para compensar márgenes y garantizar que llegue al final
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight - 60;

    let scrolled = (winScroll / height) * 100;
    if (scrolled > 100) scrolled = 100; // 🚀 Tope de seguridad para que la barra no se salga del monitor

    progressBar.style.width = scrolled + "%";
});