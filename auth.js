// 1. Inicializar Supabase (LLAVES REALES CONECTADAS 🚀)
const supabaseUrl = 'https://knyrjhbmunxydzcjwwxz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtueXJqaGJtdW54eWR6Y2p3d3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NTgxODAsImV4cCI6MjA5MjMzNDE4MH0.M0EMTiLetvIILXoz7eeAC3r8CT5MdBKA0xN-292x_rE';
// 🛠️ CAMBIO CLAVE: Renombramos a supabaseClient para no chocar con la librería global
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

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

    // 1. Estética de Salida con Logo Compressly (Efecto Rose)
    greeting.innerText = "Cerrando Sesión...";
    status.innerText = "Finalizando procesos de seguridad";
    // Usamos el logo pero con un filtro de sombra roja/rosada para indicar salida
    iconContainer.innerHTML = '<img src="imagenes/compressly_logo.png" class="w-16 h-16 object-contain grayscale drop-shadow-[0_0_20px_rgba(251,113,133,0.8)] opacity-80" alt="Compressly Logo">';
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

// 2. LÓGICA DE MODO (LOGIN VS REGISTRO VS RECUPERACIÓN) Y FUNCIÓN MAESTRA
let currentAuthMode = 'login'; // 'login', 'register', 'recovery'

window.setAuthMode = function (mode) {
    currentAuthMode = mode;

    const elements = {
        title: document.getElementById('authTitle'),
        sub: document.getElementById('authSubtitle'),
        subMob: document.getElementById('authSubtitleMobile'),
        passCont: document.getElementById('authPasswordContainer'),
        passInput: document.getElementById('authPassword'),
        optCont: document.getElementById('authOptionsContainer'),
        googleCont: document.getElementById('googleAuthContainer'),
        submitBtn: document.getElementById('authSubmitBtn'),
        submitText: document.getElementById('authSubmitText'),
        submitIcon: document.getElementById('authSubmitIcon'),
        toggleText: document.getElementById('authToggleText'),
        toggleBtn: document.getElementById('authToggleBtn'),
        // 🚀 NUEVOS CONTENEDORES PARA REGISTRO
        termsCont: document.getElementById('termsContainer'),
        passStrCont: document.getElementById('passwordStrengthContainer')
    };

    if (mode === 'login') {
        elements.title.innerText = 'Inicia Sesión';
        elements.sub.innerText = 'Accede a tu cuenta para continuar optimizando.';
        elements.subMob.innerText = 'Accede a tu cuenta para continuar optimizando.';
        elements.passCont.classList.remove('hidden');
        elements.passInput.required = true;
        // 🔒 Placeholder limpio para Login
        elements.passInput.placeholder = 'Contraseña';
        elements.optCont.classList.remove('hidden');
        elements.googleCont.classList.remove('hidden');
        elements.submitText.innerText = 'Entrar a mi Cuenta';
        elements.submitIcon.setAttribute('data-lucide', 'log-in');
        elements.toggleText.innerText = '¿No tienes cuenta?';
        elements.toggleBtn.innerText = 'Regístrate gratis';
        elements.toggleBtn.onclick = () => setAuthMode('register');

        if (elements.termsCont) elements.termsCont.classList.add('hidden');
        if (elements.passStrCont) elements.passStrCont.classList.add('hidden');
    }
    else if (mode === 'register') {
        elements.title.innerText = 'Crea tu Cuenta';
        elements.sub.innerText = 'Únete gratis y sincroniza tus configuraciones en la nube.';
        elements.subMob.innerText = 'Únete gratis y sincroniza tus configuraciones en la nube.';
        elements.passCont.classList.remove('hidden');
        elements.passInput.required = true;
        // 📝 Placeholder descriptivo para Registro
        elements.passInput.placeholder = 'Contraseña (Min. 8 caracteres)';
        elements.optCont.classList.add('hidden');
        elements.googleCont.classList.remove('hidden');
        elements.submitText.innerText = 'Comenzar Ahora';
        elements.submitIcon.setAttribute('data-lucide', 'user-plus');
        elements.toggleText.innerText = '¿Ya tienes cuenta?';
        elements.toggleBtn.innerText = 'Inicia Sesión';
        elements.toggleBtn.onclick = () => setAuthMode('login');

        if (elements.termsCont) elements.termsCont.classList.remove('hidden');
        if (elements.passStrCont) elements.passStrCont.classList.remove('hidden', 'flex');
    }
    else if (mode === 'recovery') {
        elements.title.innerText = 'Recuperar Acceso';
        elements.sub.innerText = 'Enviaremos un enlace mágico a tu bandeja de entrada.';
        elements.subMob.innerText = 'Enviaremos un enlace mágico a tu bandeja de entrada.';
        elements.passCont.classList.add('hidden');
        elements.passInput.required = false;
        elements.optCont.classList.add('hidden');
        elements.googleCont.classList.add('hidden');
        elements.submitText.innerText = 'Enviar Enlace Mágico';
        elements.submitIcon.setAttribute('data-lucide', 'send');
        elements.toggleText.innerText = '¿Recordaste tu clave?';
        elements.toggleBtn.innerText = 'Volver al Login';
        elements.toggleBtn.onclick = () => setAuthMode('login');

        // Ocultamos barrras y términos en Recuperación
        if (elements.termsCont) elements.termsCont.classList.add('hidden');
        if (elements.passStrCont) elements.passStrCont.classList.add('hidden');
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
    if (typeof triggerVibration === 'function') triggerVibration(20);
};

// Mantenemos esta función para que el botón de abajo siga funcionando
window.toggleAuthMode = function (event) {
    if (event) event.preventDefault();
    if (currentAuthMode === 'login') {
        setAuthMode('register');
    } else {
        setAuthMode('login');
    }
};

// FUNCIÓN MAESTRA DE LOGIN / REGISTRO
async function procesarAuth(event) {
    event.preventDefault();

    // 💡 Si estamos en modo recuperación, derivamos a esa función inmediatamente
    if (currentAuthMode === 'recovery') {
        if (typeof enviarRecuperacion === 'function') enviarRecuperacion(event);
        return;
    }

    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value.trim();

    // 🛡️ ESCUDO DE PROTECCIÓN PARA NUEVOS REGISTROS 🛡️
    if (currentAuthMode === 'register') {

        // 1. Validar Reglas de Contraseña (NIVEL DIOS 🧠🔐)
        let faltantes = [];

        if (password.length < 8) faltantes.push("8 caracteres mínimo");
        if (!/[A-Z]/.test(password)) faltantes.push("una mayúscula");
        if (!/[a-z]/.test(password)) faltantes.push("una minúscula");
        if (!/[0-9]/.test(password) && !/[^A-Za-z0-9]/.test(password)) faltantes.push("un número o símbolo");

        // 🔥 REGLA IMPLACABLE: Si falta AUNQUE SEA UNA cosa, bloqueamos.
        // Esto obliga a que la barra siempre tenga que llegar a VERDE (Fuerte).
        if (faltantes.length > 0) {
            let mensajeError = "Te falta incluir: ";

            // 📝 Gramática perfecta en español
            if (faltantes.length === 1) {
                mensajeError += faltantes[0] + ".";
            } else if (faltantes.length === 2) {
                mensajeError += faltantes.join(" y ") + ".";
            } else {
                const ultimo = faltantes.pop();
                mensajeError += faltantes.join(", ") + " y " + ultimo + ".";
            }

            if (typeof Notify !== 'undefined') Notify.show('Contraseña Débil 🛡️', mensajeError, 'error');
            return; // 🛑 Detiene el proceso
        }

        // 2. Validar Términos DESPUÉS 📜
        const terms = document.getElementById('authTerms');
        if (terms && !terms.checked) {
            if (typeof Notify !== 'undefined') Notify.show('Acción Requerida ⚠️', 'Por favor, marca la casilla aceptando los Términos y la Privacidad.', 'warning');
            return; // 🛑 Detiene el proceso
        }
    }

    const btn = document.querySelector('#authForm button[type="submit"]');
    const btnOriginal = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Procesando...';
    btn.disabled = true;

    try {
        let data, error, esNuevoRegistro = false;

        if (currentAuthMode === 'login') {
            // 🔓 MODO LOGIN
            const response = await supabaseClient.auth.signInWithPassword({ email, password });
            data = response.data;
            error = response.error;
        } else {
            // 📝 MODO REGISTRO
            const response = await supabaseClient.auth.signUp({ email, password });
            data = response.data;
            error = response.error;
            esNuevoRegistro = true;
        }

        if (error) throw error;

        if (esNuevoRegistro) {
            if (typeof Notify !== 'undefined') Notify.show('¡Bienvenido!', 'Tu cuenta ha sido creada con éxito.', 'success');
        }

        if (!data || !data.user) {
            if (esNuevoRegistro) {
                if (typeof Notify !== 'undefined') Notify.show('Confirma tu correo', 'Revisa tu bandeja para activar la cuenta.', 'info');
                return;
            }
            throw new Error("Error en el servidor. Inténtalo de nuevo.");
        }

        // 🚀 EFECTO VIP: Personalización dinámica
        const nombreCorto = data.user.email.split('@')[0];
        const nombreFormateado = nombreCorto.charAt(0).toUpperCase() + nombreCorto.slice(1);

        const splash = document.getElementById('vipSplashOverlay');
        const greeting = document.getElementById('vipSplashGreeting');
        const status = document.getElementById('vipSplashStatus');
        const iconContainer = document.getElementById('vipSplashIconContainer');

        // Ajustamos colores para el inicio con el Logo Oficial de Compressly
        iconContainer.innerHTML = '<img src="imagenes/compressly_logo.png" class="w-16 h-16 object-contain drop-shadow-[0_0_20px_rgba(167,139,250,0.6)] animate-pulse" alt="Compressly Logo">';
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
        // 📡 1. Consulta Segura: Buscamos al cliente primero sin "Joins" para evitar el Error 400
        const { data: clientData, error: clientErr } = await supabaseClient
            .from('api_clients')
            .select('*') // Traemos todo de forma segura
            .eq('id', user.id)
            .single();

        // 🛡️ Respaldo por si el ID se guardó en la columna 'user_id'
        let dataSegura = clientData;
        if (!dataSegura) {
            const { data: fallbackData } = await supabaseClient.from('api_clients').select('*').eq('user_id', user.id).single();
            dataSegura = fallbackData;
        }

        if (dataSegura) {
            // 📡 2. Buscamos los beneficios y créditos directos en la tabla 'planes'
            const { data: planData } = await supabaseClient
                .from('planes')
                .select('features, creditos_ia')
                .eq('name', dataSegura.plan_type)
                .single();

            // 🧬 Fusionamos ambas respuestas para que el sistema funcione perfecto
            clienteInfo = {
                ...dataSegura,
                planes: planData || { features: { api_access: false }, creditos_ia: 0 }
            };
        } else {
            await new Promise(res => setTimeout(res, 800));
            intentos++;
        }
    }

    if (clienteInfo) {
        const planActual = clienteInfo.plan_type.toLowerCase();
        window.currentUserPlan = planActual; // 🧠 Sincronización Global

        // 🔄 SINCRONIZACIÓN CON EL GESTOR DE ESTADO (data_compressly.js)
        if (typeof DB !== 'undefined') {
            DB.user.plan = planActual;
            // 🧠 Ahora toma los créditos definidos en tu SQL de planes (creditos_ia)
            DB.user.aiCredits = clienteInfo.ai_creditos || clienteInfo.planes?.creditos_ia || 0;
            DB.user.features = clienteInfo.planes?.features || { api_access: false };
            DB.user.apiKey = clienteInfo.api_key;

            // 🎨 Disparamos la actualización (Candado 🔒 o Llave 🔑 en el perfil)
            DB.updateUI();
        }

        // 1. Inyectamos llaves e ID
        const userIdDisplay = document.getElementById('userIdDisplay');
        const internalDisplay = document.getElementById('userInternalIdDisplay');

        if (userIdDisplay) userIdDisplay.innerText = clienteInfo.api_key || 'Bloqueado';

        if (internalDisplay) {
            // 💎 MOSTRAMOS el ID profesional de 15 caracteres
            internalDisplay.innerText = clienteInfo.public_id || 'CPLY-USR-GENERANDO...';

            // 🛡️ GUARDAMOS el ID técnico en un atributo oculto para que el sistema siga funcionando
            internalDisplay.setAttribute('data-uuid', user.id);
        }

        // 2. LÓGICA DE JERARQUÍA (El Poder del Usuario)
        const niveles = { 'free': 0, 'pro': 1, 'ultra': 2, 'api_fullstack': 3, 'enterprise': 4 };
        const miNivel = niveles[planActual] || 0;

        // 3. Sincronización de Textos y Badge de Header
        let nombreLimpio = planActual.toUpperCase();
        if (planActual === 'api_fullstack') nombreLimpio = 'API Full-Stack';
        if (planActual === 'enterprise') nombreLimpio = 'Enterprise 💎';

        const accountPlanName = document.getElementById('accountPlanName');
        if (accountPlanName) {
            accountPlanName.innerText = `Plan ${nombreLimpio}`;
        }

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

        // 🔌 ACTUALIZACIÓN DE CRÉDITOS DINÁMICA (API vs Energía)
        const apiCount = document.getElementById('apiCreditsCount');
        const apiLabel = document.getElementById('apiLabelSub');
        const apiBonusLabel = document.getElementById('apiBonusLabel');

        const aiCreditsDisplay = document.getElementById('aiCreditsDisplay'); // UI General (Sidebar/Header)
        const profileAiCredits = document.getElementById('profileAiCredits'); // Perfil

        // 1. Sincronización de Potencia de API
        if (apiCount && apiBonusLabel) {
            if (miNivel >= 2) {
                apiBonusLabel.innerText = "Potencia de API";
                if (apiLabel) apiLabel.innerText = "Créditos Disponibles";
                apiCount.innerText = clienteInfo.creditos_restantes || 0;
                apiCount.className = "text-sm md:text-lg font-black text-emerald-500 tracking-widest uppercase mt-1";
            } else {
                apiBonusLabel.innerText = "Acceso API";
                if (apiLabel) apiLabel.innerText = "No Habilitado";
                apiCount.innerText = "BLOQUEADO";
                apiCount.className = "text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60";
            }
        }

        // 2. Sincronización de IA (Energía IA para UI General / Número solo para Perfil)
        const energiaIA = clienteInfo.ai_creditos || clienteInfo.planes?.creditos_ia || 0;

        if (aiCreditsDisplay) {
            // ⚡ SE MANTIENE "Energía IA" en la interfaz general (Sidebar/Header)
            aiCreditsDisplay.innerHTML = `${energiaIA} <span class="text-[9px] text-purple-500/70 font-black ml-0.5 tracking-widest uppercase">Energía IA</span>`;
        }

        if (profileAiCredits) {
            // ⚡ PERFIL: Inyectamos solo el número porque la etiqueta ya está en el HTML
            profileAiCredits.innerText = energiaIA;
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

        // 🚀 6.5 EXPANSIÓN MÁGICA: Le decimos a la columna izquierda que despierte y cargue los datos
        if (typeof cargarHistorialPerfil === 'function') cargarHistorialPerfil();

        // 🛡️ 7. ESCUDO ENTERPRISE: Forzar la interfaz VIP por si interfaz.js la borró
        if (planActual === 'enterprise') {
            // Restaurar el texto del perfil y forzar el color blanco
            const planLabel = document.getElementById('planLabel');
            if (planLabel) { planLabel.innerText = 'Plan ENTERPRISE'; planLabel.className = '!text-white'; }

            // Restaurar la medalla azul del Header con el nuevo degradado y forzar texto blanco
            const btnGoPro = document.getElementById('btnGoPro');
            if (btnGoPro) {
                btnGoPro.className = "px-4 py-2 rounded-full text-[11px] lg:text-xs font-black border flex items-center gap-2 shrink-0 pointer-events-none uppercase tracking-widest bg-gradient-to-r from-blue-500 to-blue-600 border-white/20 !text-white shadow-lg shadow-blue-500/20";
                btnGoPro.innerHTML = ` Enterprise Activo`;
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

// =====================================================================
// 🔐 FUNCIÓN PARA CAMBIAR CONTRASEÑA (MODERN MAGIC LINK)
// =====================================================================

window.solicitarCambioPassword = async function (boton) {
    // 1. Extraemos el correo que ya está en la pantalla
    const emailElement = document.getElementById('settingsEmailDisplay');
    const email = emailElement ? emailElement.innerText : null;

    if (!email || email === 'usuario@ejemplo.com') {
        if (typeof Notify !== 'undefined') Notify.show('Error', 'No se detectó una cuenta válida.', 'error');
        return;
    }

    // 2. Efecto visual de carga en el botón (Bloquea spam)
    const textoOriginal = boton.innerHTML;
    boton.innerHTML = '<div class="flex items-center justify-center gap-3"><i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i><span>Enviando enlace...</span></div>';
    boton.disabled = true;

    try {
        // 3. 🚀 LA MAGIA DE SUPABASE
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/?reset=true',
        });

        //
        if (error) throw error;

        // 4. Transformamos el Contenido (Buscamos el contenedor de perfil o bento)
        const modalContent = boton.closest('.bento-card') || document.getElementById('profileContent') || document.getElementById('settingsContent');

        if (modalContent) {
            modalContent.innerHTML = `
                <div class="text-center py-12 animate-in fade-in zoom-in duration-300">
                    <div class="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-green-500 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                        <i data-lucide="mail-check" class="w-10 h-10"></i>
                    </div>
                    <h2 class="text-2xl font-black text-white mb-3">¡Correo Enviado!</h2>
                    <p class="text-gray-400 text-sm leading-relaxed mb-8">
                        Hemos enviado las instrucciones a:<br>
                        <b class="text-primary-400 mt-1 inline-block">${email}</b>
                    </p>
                    <p class="text-[10px] text-gray-500 uppercase tracking-widest font-bold animate-pulse">Finalizando sesión de seguridad...</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        // 5. Cierre automático y silencioso después de 4 segundos
        setTimeout(() => {
            if (typeof closeSettingsModal === 'function') closeSettingsModal();
            if (typeof closeProfileModal === 'function') closeProfileModal();
        }, 4000);

    } catch (error) {
        // Si hay error, regresamos el botón a la normalidad para que intente de nuevo
        if (typeof Notify !== 'undefined') {
            Notify.show('Ups...', error.message, 'error');
        }
        boton.innerHTML = textoOriginal;
        boton.disabled = false;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
};

// =====================================================================
// 🔑 FUNCIÓN PARA RECUPERAR CONTRASEÑA (DESDE EL LOGIN / MODO INVITADO)
// =====================================================================
window.enviarRecuperacion = async function (event) {
    if (event) event.preventDefault();

    const emailInput = document.getElementById('authEmail');
    const email = emailInput.value.trim();

    if (!email) {
        Notify.show('Correo Requerido', 'Escribe tu correo primero.', 'warning');
        return;
    }

    const btn = document.getElementById('authSubmitBtn');
    const originalBtnText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Verificando...';
    lucide.createIcons();

    try {
        // 🔍 1. VALIDACIÓN PROFESIONAL: ¿Existe el correo en nuestra tabla pública?
        const { data: cliente, error: errorBusqueda } = await supabaseClient
            .from('api_clients')
            .select('id')
            .eq('email', email)
            .single();

        // 🛑 Si no lo encontramos, lanzamos el error profesional de inmediato
        if (!cliente) {
            throw new Error("Este correo no está registrado en Compressly. ❌");
        }

        // 🚀 2. Si existe, disparamos el correo de recuperación real
        const { error: errorEnvio } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/?reset=true',
        });

        if (errorEnvio) throw errorEnvio;

        // 🎨 VISTA DE ÉXITO GIGANTE (La que ya teníamos)
        const authForm = document.getElementById('authForm');
        if (authForm) {
            authForm.innerHTML = `
                <div class="flex flex-col items-center text-center py-6 animate-in fade-in zoom-in duration-500">
                    <div class="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                        <i data-lucide="mail-check" class="w-10 h-10 text-green-500"></i>
                    </div>
                    <h4 class="text-slate-900 dark:text-white font-black text-2xl mb-3">¡Enlace Enviado!</h4>
                    <p class="text-slate-500 dark:text-gray-400 text-sm px-2 leading-relaxed font-medium mb-8">
                        Hemos enviado las instrucciones a:<br>
                        <b class="text-primary-500 text-base mt-1 inline-block">${email}</b>
                    </p>
                    <p class="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold animate-pulse">
                        Cerrando sesión de seguridad...
                    </p>
                </div>
            `;
            lucide.createIcons();
            setTimeout(() => window.location.reload(), 5000);
        }

    } catch (error) {
        // ✨ Aquí es donde aparece tu notificación de "Correo no encontrado"
        if (typeof Notify !== 'undefined') {
            Notify.show('Aviso de Seguridad', error.message, 'error');
        }
        btn.innerHTML = originalBtnText;
        btn.disabled = false;
        lucide.createIcons();
    }
};

// =====================================================================
// 🚀 EVENTO MAESTRO AL CARGAR LA PÁGINA (SESIONES Y RECUPERACIÓN)
// =====================================================================
window.addEventListener('DOMContentLoaded', async () => {

    // 1. Verificar si viene de un correo de recuperación de contraseña
    if (window.location.hash.includes('type=recovery') || window.location.search.includes('reset=true')) {
        setTimeout(() => {
            const modal = document.getElementById('resetPasswordModal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }, 1500); // Damos tiempo a que se oculte el Splash Screen

        return; // 🛑 Detenemos la función aquí para que NO intente cargar el panel normal
    }

    // 2. Si NO es recuperación, verificamos si el usuario ya tenía sesión iniciada
    const { data: { session }, error } = await supabaseClient.auth.getSession();

    if (session && session.user) {
        console.log("⚡ Sesión recuperada automáticamente");
        mostrarPanelPrivado(session.user);
    } else {
        console.log("👋 No hay sesión activa, mostrando modo invitado");
    }
});

// =====================================================================
// 🔐 FUNCIÓN PARA GUARDAR LA CONTRASEÑA DEFINITIVAMENTE
// =====================================================================
window.actualizarPasswordFinal = async function (e) {
    e.preventDefault();
    const nuevaPass = document.getElementById('newPasswordInput').value;
    const btn = document.getElementById('btnUpdatePass');

    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Guardando...';
    if (typeof lucide !== 'undefined') lucide.createIcons();

    try {
        // 🚀 LLAMADA REAL A SUPABASE
        const { error } = await supabaseClient.auth.updateUser({ password: nuevaPass });

        if (error) throw error;

        if (typeof Notify !== 'undefined') {
            Notify.show('¡Éxito!', 'Tu contraseña ha sido actualizada. Ya puedes entrar.', 'success');
        }

        // Cerramos el modal y limpiamos la URL
        const modal = document.getElementById('resetPasswordModal');
        if (modal) modal.classList.add('hidden');

        window.history.replaceState({}, document.title, "/");

    } catch (error) {
        if (typeof Notify !== 'undefined') {
            Notify.show('Error', error.message, 'error');
        }
        btn.disabled = false;
        btn.innerText = 'Guardar Cambios';
    } finally {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
};


