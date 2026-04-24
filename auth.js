// 1. Inicializar Supabase (LLAVES REALES CONECTADAS 🚀)
const supabaseUrl = 'https://knyrjhbmunxydzcjwwxz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtueXJqaGJtdW54eWR6Y2p3d3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NTgxODAsImV4cCI6MjA5MjMzNDE4MH0.M0EMTiLetvIILXoz7eeAC3r8CT5MdBKA0xN-292x_rE';
// 🛠️ CAMBIO CLAVE: Renombramos a supabaseClient para no chocar con la librería global
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// 🔄 1.5 VERIFICAR SESIÓN
window.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) mostrarPanelPrivado(session.user);
});

// 🔑 FUNCIÓN PARA GOOGLE (Protegida)
async function loginConGoogle(event) {
    event.preventDefault();
    if (window.location.protocol === 'file:') {
        alert('⚠️ SEGURIDAD DE GOOGLE: No puedes iniciar sesión con Google abriendo el archivo doble clic (file:///). Usa tu correo y contraseña por ahora.');
        return;
    }
    const { error } = await supabaseClient.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.href } });
    if (error) alert('Error Google: ' + error.message);
}

// 🚪 FUNCIÓN PARA CERRAR SESIÓN
window.logoutUsuario = async function () {
    const splash = document.getElementById('vipSplashOverlay');
    const greeting = document.getElementById('vipSplashGreeting');
    const status = document.getElementById('vipSplashStatus');
    const iconContainer = document.getElementById('vipSplashIconContainer');

    // 1. Estética de Salida (Rose/Violet)
    greeting.innerText = "Cerrando Sesión...";
    status.innerText = "Finalizando procesos de seguridad";
    iconContainer.innerHTML = '<i data-lucide="log-out" class="w-14 h-14 text-rose-400 drop-shadow-[0_0_20px_rgba(251,113,133,0.6)]"></i>';
    lucide.createIcons();

    // 2. Transición de salida suave
    splash.classList.remove('opacity-0', 'pointer-events-none');
    splash.classList.add('opacity-100');

    try {
        // 🧠 EL CANDADO: Obligamos al sistema a olvidar los privilegios de pago
        window.currentUserPlan = 'free';
        if (typeof actualizarEstadoPlanes === 'function') actualizarEstadoPlanes();

        await supabaseClient.auth.signOut();

        // ⏱️ EXTENDIDO: Esperamos para que el usuario vea el mensaje
        setTimeout(() => {
            greeting.innerText = "¡Vuelve pronto!";
            status.innerText = "Modo Local Restaurado";

            setTimeout(() => {
                window.location.reload();
            }, 2000); // 2 segundos extra para leer la despedida
        }, 1500);

    } catch (error) {
        window.location.reload();
    }
};

// 2. FUNCIÓN MAESTRA DE LOGIN / REGISTRO
async function procesarAuth(event) {
    event.preventDefault();
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value.trim();

    const btn = document.querySelector('#authForm button[type="submit"]');
    const btnOriginal = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Procesando...';
    btn.disabled = true;

    try {
        let esNuevoRegistro = false;
        let { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

        if (error && error.message.includes('Invalid login')) {
            const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({ email, password });
            if (signUpError) throw signUpError;
            data = signUpData;
            esNuevoRegistro = true;
        } else if (error) {
            throw error;
        }

        if (!data || !data.user) throw new Error("Error en el servidor. Inténtalo de nuevo.");

        // 🚀 EFECTO VIP: Personalización dinámica
        const nombreCorto = data.user.email.split('@')[0];
        const nombreFormateado = nombreCorto.charAt(0).toUpperCase() + nombreCorto.slice(1);

        const splash = document.getElementById('vipSplashOverlay');
        const greeting = document.getElementById('vipSplashGreeting');
        const status = document.getElementById('vipSplashStatus');
        const iconContainer = document.getElementById('vipSplashIconContainer');

        // Ajustamos colores para el inicio (Violet/Indigo)
        iconContainer.innerHTML = '<i data-lucide="zap" class="w-14 h-14 text-violet-400 drop-shadow-[0_0_20px_rgba(167,139,250,0.8)]"></i>';
        greeting.innerText = esNuevoRegistro ? `¡Bienvenido, ${nombreFormateado}!` : `¡Hola de nuevo, ${nombreFormateado}!`;
        status.innerText = "Configurando acceso prioritario";

        // Activamos el splash con transición más lenta (1000ms en CSS)
        splash.classList.remove('opacity-0', 'pointer-events-none');
        splash.classList.add('opacity-100');

        // 🛑 EL TRUCO VIP: Esperamos a que la pantalla morada cubra todo (800ms) ANTES de cargar los datos
        setTimeout(async () => {

            // Ahora sí, cambiamos la interfaz detrás del telón de forma invisible
            await mostrarPanelPrivado(data.user);

            // ⏱️ Dejamos la pantalla 3 segundos para que lea el mensaje
            setTimeout(() => {
                splash.classList.remove('opacity-100');
                splash.classList.add('opacity-0', 'pointer-events-none');
            }, 3000);

        }, 800);

    } catch (error) {
        if (typeof Notify !== 'undefined') Notify.show('Error', error.message, 'error');
    } finally {
        btn.innerHTML = btnOriginal;
        btn.disabled = false;
        lucide.createIcons();
    }
}

// 3. MOSTRAR PANEL PRIVADO
async function mostrarPanelPrivado(user) {
    if (!user) return;
    document.getElementById('guestStateView').classList.add('hidden');
    document.getElementById('loggedInStateView').classList.remove('hidden');
    document.getElementById('userEmailDisplay').innerText = user.email;

    let intentos = 0;
    let clienteInfo = null;

    while (intentos < 5 && !clienteInfo) {
        const { data, error } = await supabaseClient
            .from('api_clients')
            .select('api_key, plan_type, creditos_restantes')
            .eq('id', user.id)
            .single();

        if (data) {
            clienteInfo = data;
        } else {
            await new Promise(res => setTimeout(res, 800));
            intentos++;
        }
    }

    if (clienteInfo) {
        const planActual = clienteInfo.plan_type.toLowerCase();
        window.currentUserPlan = planActual; // 🧠 Sincronización Global

        // 1. Inyectamos llaves e ID
        document.getElementById('userIdDisplay').innerText = clienteInfo.api_key;
        document.getElementById('userInternalIdDisplay').innerText = user.id;

        // 2. LÓGICA DE JERARQUÍA (El Poder del Usuario)
        const niveles = { 'free': 0, 'pro': 1, 'ultra': 2, 'api_fullstack': 3, 'enterprise': 4 };
        const miNivel = niveles[planActual] || 0;

        // 3. Sincronización de Textos y Badge de Header
        let nombreLimpio = planActual.toUpperCase();
        if (planActual === 'api_fullstack') nombreLimpio = 'API Full-Stack';
        if (planActual === 'enterprise') nombreLimpio = 'Enterprise 💎';
        document.getElementById('accountPlanName').innerText = `Plan ${nombreLimpio}`;

        const headerBadge = document.querySelector('.plan-badge-header');
        const planLabel = document.getElementById('planLabel'); // 👤 El texto del perfil

        if (headerBadge) headerBadge.innerText = nombreLimpio;
        if (planLabel) planLabel.innerText = `Plan ${nombreLimpio}`;

        if (headerBadge) {
            headerBadge.className = `plan-badge-header hidden md:flex items-center text-[10px] font-black px-3 py-1 rounded-full shadow-sm tracking-widest ${planActual === 'free' ? 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400' :
                planActual === 'enterprise' ? 'bg-blue-500 text-white shadow-blue-500/20' :
                    planActual === 'pro' ? 'bg-primary-500 text-white shadow-primary-500/20' :
                        'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/20'
                }`;
        }

        // 🚀 4. EL BOTÓN DEL HEADER (Medalla de Estatus)
        const btnGoPro = document.getElementById('btnGoPro');
        const btnGoProMobile = document.getElementById('btnGoProMobile');

        if (planActual === 'free') {
            if (btnGoPro) {
                btnGoPro.classList.remove('hidden', 'pointer-events-none');
                btnGoPro.className = "bg-white/10 hover:bg-white/20 text-white px-3 lg:px-6 py-2.5 rounded-full text-[11px] lg:text-sm font-black backdrop-blur-md transition-all border border-white/10 hover:border-white/30 flex items-center gap-2 shrink-0 hover:scale-105 cursor-pointer";
                btnGoPro.innerHTML = '<i data-lucide="crown" class="w-3.5 h-3.5 lg:w-4 lg:h-4 text-yellow-400"></i> <span class="whitespace-nowrap">Go Pro</span>';
            }
            if (btnGoProMobile) btnGoProMobile.classList.remove('hidden');
            document.querySelectorAll('.promo-banner, .upgrade-invitation').forEach(a => a.classList.remove('hidden'));
        } else {
            if (btnGoPro) {
                btnGoPro.classList.remove('hidden');

                // 💎 CASO ENTERPRISE PRIORITARIO
                if (planActual === 'enterprise') {
                    btnGoPro.className = 'px-4 py-2 rounded-full text-[11px] lg:text-xs font-black border flex items-center gap-2 shrink-0 pointer-events-none uppercase tracking-widest bg-gradient-to-r from-blue-500 to-blue-600 border-white/20 !text-white shadow-lg shadow-blue-500/20';
                    btnGoPro.innerHTML = `<i data-lucide="building-2" class="w-3.5 h-3.5 fill-white/20"></i> <span class="whitespace-nowrap !text-white">Enterprise Activo</span>`;
                } else if (planActual === 'api_fullstack') {
                    btnGoPro.className = 'px-4 py-2 rounded-full text-[11px] lg:text-xs font-black border flex items-center gap-2 shrink-0 pointer-events-none uppercase tracking-widest bg-gradient-to-r from-emerald-500 to-teal-500 border-white/20 !text-white shadow-lg shadow-emerald-500/20';
                    btnGoPro.innerHTML = `<i data-lucide="webhook" class="w-3.5 h-3.5 fill-white/20"></i> <span class="whitespace-nowrap !text-white">API Activa</span>`;
                } else if (planActual === 'ultra') {
                    btnGoPro.className = 'px-4 py-2 rounded-full text-[11px] lg:text-xs font-black border flex items-center gap-2 shrink-0 pointer-events-none uppercase tracking-widest bg-gradient-to-r from-purple-600 to-indigo-600 border-white/20 !text-white shadow-lg shadow-purple-500/20';
                    btnGoPro.innerHTML = `<i data-lucide="rocket" class="w-3.5 h-3.5 fill-white/20"></i> <span class="whitespace-nowrap !text-white">Ultra Activo</span>`;
                } else if (planActual === 'pro') {
                    btnGoPro.className = 'px-4 py-2 rounded-full text-[11px] lg:text-xs font-black border flex items-center gap-2 shrink-0 pointer-events-none uppercase tracking-widest bg-gradient-to-r from-yellow-400 to-yellow-600 border-white/20 text-slate-900 dark:text-white shadow-lg shadow-yellow-500/20';
                    btnGoPro.innerHTML = `<i data-lucide="crown" class="w-3.5 h-3.5 fill-current opacity-80"></i> <span class="whitespace-nowrap">Pro Activo</span>`;
                }
            }
            if (btnGoProMobile) btnGoProMobile.classList.add('hidden');
            document.querySelectorAll('.promo-banner, .upgrade-invitation').forEach(a => a.classList.add('hidden'));
        }

        // Créditos (Con diseño de Bono Profesional)
        const apiCreditsDisplay = document.getElementById('apiCreditsDisplay');
        if (apiCreditsDisplay) {
            apiCreditsDisplay.innerHTML = `${clienteInfo.creditos_restantes} <span class="text-[9px] text-primary-500/70 font-black ml-0.5 tracking-widest uppercase">Créditos</span>`;
        }

        // 🚀 5. LÓGICA DE CASCADA EN TABLA DE PRECIOS
        const tablaBotones = {
            'free': { el: document.getElementById('btnTablaFree'), txtActivo: 'Tu Plan Actual', txtIncluido: 'Incluido en tu Plan' },
            'pro': { el: document.getElementById('btnTablaPro'), txtActivo: 'Tu Plan Actual', txtIncluido: 'Incluido en tu Plan' },
            'ultra': { el: document.getElementById('btnTablaUltra'), txtActivo: 'Suscripción Activa', txtIncluido: 'Incluido en tu Plan' },
            'api_fullstack': { el: document.getElementById('btnTablaApi'), txtActivo: 'API Activa', txtIncluido: 'Incluido en tu Plan' }
        };

        Object.keys(tablaBotones).forEach(key => {
            const btn = tablaBotones[key].el;
            if (!btn) return;

            const nivelBoton = niveles[key];

            // 🛡️ 1. ESTADO BLOQUEADO (Cuando ya posees el plan o uno superior)
            if (miNivel >= nivelBoton) {
                // 🚀 LIMPIEZA TOTAL: Eliminamos TODAS las sombras de colores (incluyendo la amarilla de PRO)
                btn.classList.remove('bg-primary-500', 'bg-gradient-to-r', 'from-purple-600', 'to-indigo-600', 'from-emerald-500', 'to-teal-500', 'from-yellow-400', 'to-yellow-600', 'border-emerald-500', 'bg-slate-200', 'dark:bg-white/10', 'hover:bg-slate-300', 'hover:bg-primary-600', 'text-emerald-600', 'text-slate-800', 'text-slate-600', 'text-white', 'shadow-lg', 'shadow-purple-500/30', 'shadow-[0_0_20px_rgba(16,185,129,0.3)]', 'shadow-[0_10px_20px_rgba(250,204,21,0.3)]');

                // Forzamos visibilidad sólida (SIN DESENFOQUE Y SIN GRADIENTE DE FONDO)
                btn.style.backgroundColor = '#1e293b';
                btn.style.backgroundImage = 'none';
                btn.style.color = '#ffffff';
                btn.classList.add('cursor-default', 'border-none', 'pointer-events-none');

                const texto = (miNivel === nivelBoton) ? tablaBotones[key].txtActivo : tablaBotones[key].txtIncluido;
                const icono = (miNivel === nivelBoton) ? 'check-circle' : 'check';
                const colorIcono = (miNivel === nivelBoton) ? '#34d399' : '#94a3b8';

                btn.innerHTML = `<i data-lucide="${icono}" class="w-5 h-5" style="color: ${colorIcono};"></i> <span class="font-bold !text-white">${texto}</span>`;
                btn.onclick = (e) => { e.preventDefault(); };
                if (btn.tagName === 'A') { btn.href = "javascript:void(0)"; btn.style.display = "flex"; }

                // 🔄 2. ESTADO DISPONIBLE (Cuando el plan es superior a tu nivel actual)
            } else {
                btn.style.backgroundColor = '';
                btn.style.color = '';
                btn.classList.remove('cursor-default', 'border-none', 'pointer-events-none', 'opacity-90');

                if (key === 'free') {
                    btn.className = "w-full bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white font-extrabold py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2";
                    btn.innerHTML = `<span>Comenzar Gratis</span> <i data-lucide="arrow-right" class="w-4 h-4"></i>`;
                    btn.onclick = () => { openProfileModal(); };

                } else if (key === 'pro') {
                    // 🚀 RESTAURACIÓN DEL DEGRADADO AMARILLO EXACTO DE PRO
                    btn.className = "w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:scale-[1.02] active:scale-95 text-white font-extrabold py-4 rounded-xl transition-all shadow-[0_10px_20px_rgba(250,204,21,0.3)] flex justify-center items-center gap-2 border border-white/10";
                    btn.innerHTML = `<i data-lucide="crown" class="w-5 h-5 text-white"></i> <span>Obtener Acceso PRO</span>`;
                    btn.onclick = () => { if (typeof openPremiumModal === 'function') openPremiumModal(true); };

                } else if (key === 'ultra') {
                    // 🚀 RESTAURACIÓN DEL BOTÓN ULTRA
                    btn.className = "w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.02] active:scale-95 !text-white font-extrabold py-4 rounded-xl transition-all shadow-lg shadow-purple-500/30 flex justify-center items-center gap-2 relative z-10";
                    btn.innerHTML = `<i data-lucide="rocket" class="w-5 h-5 !text-white"></i> <span>Suscribirse a ULTRA</span>`;
                    btn.onclick = () => { if (typeof openUltraModal === 'function') openUltraModal(); };

                } else if (key === 'api_fullstack') {
                    btn.className = "w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-[1.02] active:scale-95 !text-white font-extrabold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex justify-center items-center gap-2";
                    btn.innerHTML = `<i data-lucide="webhook" class="w-5 h-5 !text-white"></i> <span>Adquirir API Key</span>`;
                    btn.onclick = () => { if (typeof openApiModal === 'function') openApiModal(); };
                }
            }
        });

        // 6. Lanzar actualización del Modal de Perfil
        if (typeof actualizarEstadoPlanes === 'function') actualizarEstadoPlanes();

        // 🛡️ 7. ESCUDO ENTERPRISE: Forzar la interfaz VIP por si interfaz.js la borró
        if (planActual === 'enterprise') {
            // Restaurar el texto del perfil y forzar el color blanco
            const planLabel = document.getElementById('planLabel');
            if (planLabel) { planLabel.innerText = 'Plan ENTERPRISE'; planLabel.className = '!text-white'; }

            // Restaurar la medalla azul del Header con el nuevo degradado y forzar texto blanco
            const btnGoPro = document.getElementById('btnGoPro');
            if (btnGoPro) {
                btnGoPro.className = "px-4 py-2 rounded-full text-[11px] lg:text-xs font-black border flex items-center gap-2 shrink-0 pointer-events-none uppercase tracking-widest bg-gradient-to-r from-blue-500 to-blue-600 border-white/20 !text-white shadow-lg shadow-blue-500/20";
                btnGoPro.innerHTML = `<i data-lucide="building-2" class="w-3.5 h-3.5 fill-white/20"></i> <span class="whitespace-nowrap !text-white">Enterprise Activo</span>`;
            }

            // Destruir el botón "MEJORAR MI PLAN" que inyectó el otro archivo
            const actionContainer = document.getElementById('profileActionContainer');
            if (actionContainer) actionContainer.innerHTML = '';
        }

    } else {
        if (typeof Notify !== 'undefined') Notify.show('Error', 'Sincronización de plan fallida.', 'error');
    }
    lucide.createIcons();
}

// Este bloque es el que "recuerda" al usuario al refrescar
window.addEventListener('DOMContentLoaded', async () => {
    // 1. Pedimos a Supabase la sesión actual
    const { data: { session }, error } = await supabaseClient.auth.getSession();

    // 2. Si hay una sesión activa, saltamos directo al panel
    if (session && session.user) {
        console.log("⚡ Sesión recuperada automáticamente");
        mostrarPanelPrivado(session.user);
    } else {
        console.log("👋 No hay sesión activa, mostrando modo invitado");
    }
});

// --- FUNCIONES DE ELIMINACIÓN DE CUENTA ---

// 🔒 Lógica del Candado de Seguridad
window.toggleDeleteLock = function () {
    const btn = document.getElementById('confirmDeleteBtn');
    const icon = document.getElementById('lockIcon');
    const text = document.getElementById('lockText');

    if (btn.disabled) {
        // 🔓 Desbloquear
        btn.disabled = false;
        btn.className = "w-full bg-gradient-to-r from-red-600 to-rose-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-red-900/20 active:scale-95 flex items-center justify-center gap-2 transition-all border border-transparent";
        icon.setAttribute('data-lucide', 'unlock');
        icon.classList.add('text-red-500');
        text.innerText = "Botón Desbloqueado";
        text.classList.replace('text-gray-500', 'text-red-500');
        if (typeof triggerVibration !== 'undefined') triggerVibration([20, 30]);
    } else {
        // 🔒 Bloquear de nuevo
        btn.disabled = true;
        btn.className = "w-full bg-slate-800 text-gray-600 cursor-not-allowed font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 border border-white/5";
        icon.setAttribute('data-lucide', 'lock');
        icon.classList.remove('text-red-500');
        text.innerText = "Seguro Activado";
        text.classList.replace('text-red-500', 'text-gray-500');
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
};

window.openDeleteAccountModal = function () {
    closeSettingsModal(); // Cerramos el de ajustes primero

    // 🛡️ Forzar que el candado SIEMPRE esté cerrado al abrir
    const btn = document.getElementById('confirmDeleteBtn');
    if (btn && !btn.disabled) {
        toggleDeleteLock();
    }

    const modal = document.getElementById('deleteAccountModal');
    const content = document.getElementById('deleteAccountContent');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
    if (typeof lucide !== 'undefined') lucide.createIcons();
};

window.closeDeleteAccountModal = function () {
    const modal = document.getElementById('deleteAccountModal');
    const content = document.getElementById('deleteAccountContent');
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
};

window.ejecutarBorradoTotal = async function () {
    const btn = document.getElementById('confirmDeleteBtn');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> PROCESANDO BORRADO...';
    lucide.createIcons();

    try {
        const { data: { session } } = await supabaseClient.auth.getSession();

        if (session && session.user) {
            // 1. Borramos sus datos de cliente en la tabla pública
            const { error: dbError } = await supabaseClient
                .from('api_clients')
                .delete()
                .eq('id', session.user.id);

            if (dbError) throw dbError;

            // Nota: Para borrar el usuario de AUTH (la cuenta de login), 
            // normalmente necesitas un Edge Function porque un usuario no puede borrarse a sí mismo por SDK.
            // Pero al borrar su fila en 'api_clients', ya le quitas todos sus privilegios SaaS.
        }

        // 2. Notificamos y sacamos al usuario
        Notify.show('Datos Eliminados', 'Tu información ha sido borrada con éxito. Adiós 💔', 'info');

        setTimeout(() => {
            logoutUsuario(); // Esto hace el signOut final y recarga la página
        }, 2000);

    } catch (error) {
        Notify.show('Error', 'No pudimos completar el borrado. Intenta más tarde.', 'error');
        btn.disabled = false;
        btn.innerHTML = originalHTML;
        lucide.createIcons();
    }
};