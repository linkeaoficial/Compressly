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
    document.body.classList.toggle('overflow-hidden');
    const iconMenu = document.getElementById('iconMenu');
    const iconClose = document.getElementById('iconClose');

    // 🚀 Identificamos el botón del chatbot
    const botBtn = document.getElementById('aiToggler');

    if (mobileMenu.classList.contains('hidden')) {
        iconMenu.classList.remove('hidden');
        iconClose.classList.add('hidden');
        // 🚀 Mostrar bot al cerrar el menú
        if (botBtn) botBtn.style.display = '';
    } else {
        iconMenu.classList.add('hidden');
        iconClose.classList.remove('hidden');
        // 🚀 Ocultar bot al abrir el menú
        if (botBtn) botBtn.style.display = 'none';
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


// 4. LÓGICA DEL MENÚ DESPLEGABLE PERSONALIZADO PREMIUM (Redimensionar) 🎯
const customSelectContainer = document.getElementById('customSelectContainer');
const customSelectTrigger = document.getElementById('customSelectTrigger');
const customSelectDropdown = document.getElementById('customSelectDropdown');
const customSelectArrow = document.getElementById('customSelectArrow');
const customSelectLabel = document.getElementById('customSelectLabel');

// 🚀 CAMBIO VITAL: Ahora solo buscamos las opciones DENTRO del menú de redimensionar
// Esto evita que el menú de Marca de Agua interfiera aquí.
const customOptions = customSelectDropdown ? customSelectDropdown.querySelectorAll('.custom-option') : [];

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


// 👑 ==========================================
// CONTROL DE ESTADOS VIP (PERFIL, MENÚS Y PRECIOS)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    function actualizarEstadoPlanes() {
        const btnNavPc = document.getElementById('btnGoPro');
        const btnNavMovil = document.getElementById('btnGoProMobile');

        // 🚀 Conectamos con tus IDs reales del Perfil
        const planBadge = document.getElementById('planBadge');
        const planIcon = document.getElementById('planIcon');
        const planLabel = document.getElementById('planLabel');

        const btnTablaPro = document.getElementById('btnTablaPro');
        const btnTablaUltra = document.getElementById('btnTablaUltra');

        if (typeof DB !== 'undefined') {
            if (DB.isUltra()) {
                // 🚀 USUARIO ULTRA (Poder Total)

                // 1. Perfil (Etiqueta Morada)
                if (planLabel) planLabel.innerText = 'Plan ULTRA';
                if (planIcon) planIcon.setAttribute('data-lucide', 'rocket');
                if (planBadge) planBadge.className = "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border transition-all duration-500 bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400";

                // 2. Menús (PC y Móvil)
                if (btnNavPc) btnNavPc.innerHTML = '<i data-lucide="sparkles" class="w-4 h-4 text-purple-400"></i> ULTRA Activo';
                if (btnNavMovil) {
                    btnNavMovil.innerHTML = '<i data-lucide="sparkles" class="w-5 h-5 text-white"></i> ULTRA Activo';
                    btnNavMovil.className = "w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3.5 rounded-xl text-base font-bold transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2";
                }

                // 3. Tabla Precios
                if (btnTablaPro) {
                    btnTablaPro.innerHTML = '<i data-lucide="check" class="w-5 h-5"></i> Incluido en ULTRA';
                    btnTablaPro.classList.add('opacity-50', 'pointer-events-none');
                }
                if (btnTablaUltra) {
                    btnTablaUltra.innerHTML = '<i data-lucide="check-circle" class="w-5 h-5 !text-white"></i> Tu Plan Actual';
                    btnTablaUltra.classList.add('pointer-events-none');
                }

            } else if (DB.isPro()) {
                // 👑 USUARIO PRO (Acceso Premium)

                // 1. Perfil (Etiqueta Dorada)
                if (planLabel) planLabel.innerText = 'Plan PRO';
                if (planIcon) planIcon.setAttribute('data-lucide', 'crown');
                if (planBadge) planBadge.className = "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border transition-all duration-500 bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400";

                // 2. Menús (PC y Móvil)
                if (btnNavPc) btnNavPc.innerHTML = '<i data-lucide="crown" class="w-4 h-4 text-yellow-400"></i> PRO Activo';
                if (btnNavMovil) {
                    btnNavMovil.innerHTML = '<i data-lucide="crown" class="w-5 h-5 text-yellow-300"></i> PRO Activo';
                    btnNavMovil.className = "w-full mt-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-5 py-3.5 rounded-xl text-base font-bold transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2";
                }

                // 3. Tabla Precios
                if (btnTablaPro) {
                    btnTablaPro.innerHTML = '<i data-lucide="check-circle" class="w-5 h-5 text-yellow-300"></i> Tu Plan Actual';
                    btnTablaPro.classList.add('pointer-events-none');
                }
            }
        }

        // Refrescar iconos inyectados para que el cohete o corona carguen visualmente
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // 🚀 NUEVO: Función para inyectar los créditos en la interfaz
    function actualizarCreditosUI() {
        const aiCreditsDisplay = document.getElementById('aiCreditsDisplay'); // Contador en Auto-SEO
        const profileAiCredits = document.getElementById('profileAiCredits'); // Contador en el Perfil

        if (typeof DB !== 'undefined') {
            // Buscamos los créditos en tu DB local (la ruta correcta es DB.user)
            let creditos = 0;
            if (DB.user && DB.user.aiCredits !== undefined) {
                creditos = DB.user.aiCredits;
            }

            // Pintamos el número real en la pantalla
            if (aiCreditsDisplay) aiCreditsDisplay.innerText = creditos;
            if (profileAiCredits) profileAiCredits.innerText = creditos;
        }
    }

    // Ejecución rápida al cargar
    setTimeout(() => {
        actualizarEstadoPlanes();
        actualizarCreditosUI(); // 🚀 Disparamos la lectura de créditos
    }, 100);
});