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

    window.actualizarEstadoPlanes = function () {
        const btnNavPc = document.getElementById('btnGoPro');
        const btnNavMovil = document.getElementById('btnGoProMobile');
        const planBadge = document.getElementById('planBadge');
        const planIcon = document.getElementById('planIcon');
        const planLabel = document.getElementById('planLabel');
        const guestView = document.getElementById('guestStateView');
        const loggedInView = document.getElementById('loggedInStateView');
        const statusText = document.getElementById('profileStatusText');
        const statusDot = document.getElementById('profileStatusDot');
        const statusPing = document.getElementById('profileStatusPing');

        // Textos y botones extra del Perfil
        const accountPlanName = document.getElementById('accountPlanName');
        const actionContainer = document.getElementById('profileActionContainer');
        const statTitle = document.querySelector('[data-i18n="stat_title"]');

        // 🧠 Leemos el plan global desde el Puente de Supabase (Si no hay, es free)
        const planActual = window.currentUserPlan || 'free';

        // 🔐 LÓGICA DE VISTAS (Invitado vs Logueado)
        // Nota: Asumimos que si cambió a un plan de pago, sí o sí está logueado en la nube.
        if (planActual !== 'free') {
            if (guestView) guestView.classList.add('hidden');
            if (loggedInView) loggedInView.classList.remove('hidden');
            if (statusText) statusText.innerText = 'Nube Sincronizada';
            if (statusDot) statusDot.className = "relative rounded-full h-2 w-2 bg-blue-500";
            if (statusPing) statusPing.className = "animate-ping absolute h-full w-full rounded-full bg-blue-500 opacity-40";
        } else {
            // El usuario FREE se gestiona visualmente como Perfil Local por defecto
            if (statusText) statusText.innerText = 'Perfil Local Activo';
            if (statusDot) statusDot.className = "relative rounded-full h-2 w-2 bg-green-500";
            if (statusPing) statusPing.className = "animate-ping absolute h-full w-full rounded-full bg-green-500 opacity-40";
        }

        // 🎨 LÓGICA DE ESTILOS POR PLAN EN EL MENÚ Y PERFIL
        const baseMenuBtnClass = "px-3 lg:px-6 py-2.5 rounded-full text-[11px] lg:text-sm font-black transition-all flex items-center gap-2 shrink-0 ";
        if (planActual === 'api_fullstack') {
            if (planLabel) planLabel.innerText = 'API FULL-STACK';
            if (accountPlanName) accountPlanName.innerText = 'API Full-Stack';
            if (planIcon) planIcon.setAttribute('data-lucide', 'webhook');
            if (planBadge) planBadge.className = "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border transition-all duration-500 bg-emerald-500/10 border-emerald-500/30 text-emerald-500";

            // Nivel Máximo: Etiqueta de estatus final
            if (actionContainer) actionContainer.innerHTML = '<div class="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center w-full"><span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sincronización Empresarial Activa</span></div>';

            if (btnNavPc) {
                btnNavPc.classList.remove('hidden');
                btnNavPc.className = "px-4 py-2 rounded-full text-[11px] lg:text-xs font-black backdrop-blur-md border flex items-center gap-2 shrink-0 pointer-events-none uppercase tracking-widest bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400";
                btnNavPc.innerHTML = '<i data-lucide="webhook" class="w-3.5 h-3.5"></i> <span class="whitespace-nowrap">API Activa</span>';
            }
            if (btnNavMovil) btnNavMovil.classList.add('hidden');

        } else if (planActual === 'ultra') {
            if (planLabel) planLabel.innerText = 'PLAN ULTRA IA';
            if (accountPlanName) accountPlanName.innerText = 'Plan ULTRA IA';
            if (planIcon) planIcon.setAttribute('data-lucide', 'rocket');
            if (planBadge) planBadge.className = "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border transition-all duration-500 bg-purple-500/10 border-purple-500/30 text-purple-400";

            // 🚀 MEJORA: Botón para descubrir el siguiente nivel (API)
            if (actionContainer) {
                actionContainer.innerHTML = `<a href="Documentación_API.html" class="w-full border-2 border-emerald-500 hover:bg-emerald-500 hover:text-white text-emerald-500 dark:text-emerald-400 dark:hover:text-white font-black py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer no-underline"><i data-lucide="webhook" class="w-4 h-4"></i> DESCUBRIR API FULL-STACK</a>`;
            }

            if (btnNavPc) {
                btnNavPc.classList.remove('hidden');
                btnNavPc.className = "px-4 py-2 rounded-full text-[11px] lg:text-xs font-black backdrop-blur-md border flex items-center gap-2 shrink-0 pointer-events-none uppercase tracking-widest bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400";
                btnNavPc.innerHTML = '<i data-lucide="rocket" class="w-3.5 h-3.5"></i> <span class="whitespace-nowrap">Ultra Activo</span>';
            }
            if (btnNavMovil) btnNavMovil.classList.add('hidden');

        } else if (planActual === 'pro') {
            if (planLabel) planLabel.innerText = 'PLAN PRO ACCESO';
            if (accountPlanName) accountPlanName.innerText = 'Plan PRO Acceso';
            if (planIcon) planIcon.setAttribute('data-lucide', 'crown');
            if (planBadge) planBadge.className = "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border transition-all duration-500 bg-yellow-500/10 border-yellow-500/30 text-yellow-500";

            // 🚀 MEJORA: Botón para subir al siguiente nivel (ULTRA)
            if (actionContainer) {
                actionContainer.innerHTML = `<button onclick="closeProfileModal(); openUltraModal();" class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"><i data-lucide="rocket" class="w-4 h-4"></i> SUBIR A ULTRA IA</button>`;
            }

            if (btnNavPc) {
                btnNavPc.classList.remove('hidden');
                btnNavPc.className = "px-4 py-2 rounded-full text-[11px] lg:text-xs font-black backdrop-blur-md border flex items-center gap-2 shrink-0 pointer-events-none uppercase tracking-widest bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-500";
                btnNavPc.innerHTML = '<i data-lucide="crown" class="w-3.5 h-3.5"></i> <span class="whitespace-nowrap">Pro Activo</span>';
            }
            if (btnNavMovil) btnNavMovil.classList.add('hidden');

        } else if (planActual === 'enterprise') {
            // 💎 NUEVA LÓGICA EXCLUSIVA PARA ENTERPRISE
            if (planLabel) planLabel.innerText = 'PLAN ENTERPRISE';
            if (accountPlanName) accountPlanName.innerText = 'Plan Enterprise';
            if (planIcon) planIcon.setAttribute('data-lucide', 'building-2');

            // Etiqueta con colores azules únicos
            if (planBadge) planBadge.className = "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border transition-all duration-500 bg-blue-500/10 border-blue-500/30 text-blue-500";

            if (actionContainer) {
                actionContainer.innerHTML = '<div class="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center w-full"><span class="text-[10px] font-black text-blue-500 uppercase tracking-widest">Sincronización Enterprise Activa</span></div>';
            }

            if (btnNavPc) {
                btnNavPc.classList.remove('hidden');
                btnNavPc.className = "px-4 py-2 rounded-full text-[11px] lg:text-xs font-black backdrop-blur-md border flex items-center gap-2 shrink-0 pointer-events-none uppercase tracking-widest bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400";
                btnNavPc.innerHTML = '<i data-lucide="building-2" class="w-3.5 h-3.5"></i> <span class="whitespace-nowrap">Enterprise Activo</span>';
            }
            if (btnNavMovil) btnNavMovil.classList.add('hidden');

        } else {
            // PLAN FREE (Local)
            if (planLabel) planLabel.innerText = 'PLAN ESENCIAL';
            if (accountPlanName) accountPlanName.innerText = 'Plan Esencial';
            if (planIcon) planIcon.setAttribute('data-lucide', 'award');
            if (planBadge) planBadge.className = "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border transition-all duration-500 border-slate-300 dark:border-white/20 text-slate-700 dark:text-gray-300 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-white/10 dark:to-white/5 backdrop-blur-md shadow-sm";

            // Botón estándar para invitar a comprar planes
            if (actionContainer) {
                actionContainer.innerHTML = `<button onclick="closeProfileModal(); window.scrollTo({top: document.getElementById('precios').offsetTop, behavior: 'smooth'});" class="w-full bg-primary-500 hover:bg-primary-600 text-white font-black py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95">MEJORAR MI PLAN</button>`;
            }

            if (btnNavPc) {
                btnNavPc.classList.remove('hidden');
                btnNavPc.innerHTML = '<i data-lucide="crown" class="w-3.5 h-3.5 lg:w-4 lg:h-4 text-yellow-400"></i> <span class="whitespace-nowrap">Go Pro</span>';
                btnNavPc.className = baseMenuBtnClass + "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 hover:border-white/30 hover:scale-105 cursor-pointer";
            }
            if (btnNavMovil) btnNavMovil.classList.remove('hidden');
        }

        // 📊 Control Inteligente de las Estadísticas en el Perfil
        if (statTitle) {
            const statSection = document.getElementById('statTotalImages');
            if (statSection && statSection.closest('.space-y-4')) {
                const contenedorStats = statSection.closest('.space-y-4').parentElement;

                if (planActual === 'free') {
                    // Opacar sección si es gratis
                    contenedorStats.style.opacity = '0.4';
                    contenedorStats.style.pointerEvents = 'none';
                    statTitle.innerHTML = 'Estadísticas <span class="ml-2 text-[8px] bg-primary-500/20 text-primary-500 px-2 py-0.5 rounded-full">SOLO PRO</span>';
                } else {
                    // Encender sección si pagó
                    contenedorStats.style.opacity = '1';
                    contenedorStats.style.pointerEvents = 'auto';
                    statTitle.innerHTML = 'Estadísticas de Uso';
                }
            }
        }

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Llamar una vez al iniciar por precaución
    actualizarEstadoPlanes();


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
        if (typeof DB !== 'undefined') DB.updateUI(); // 🚀 FIX: Enciende la caja de IA y los colores correctos desde el segundo cero
        actualizarEstadoPlanes();
        actualizarCreditosUI(); // 🚀 Disparamos la lectura de créditos
    }, 100);
});