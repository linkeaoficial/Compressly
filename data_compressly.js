// 🗄️ GESTOR DE ESTADO GLOBAL (Sincronizado con Supabase)
// Este archivo está 100% limpio. No tiene datos falsos.

const DB = {
    // Estado inicial (Usuario Invitado / Free por defecto)
    user: {
        plan: 'free',
        aiCredits: 0,
        features: {
            seo: true,
            batch: false,
            api_access: false,
            r2_hosting: false
        },
        apiKey: null
    },

    // Funciones de validación usadas por script.js
    isPro: function () {
        return this.user.plan === 'pro' || this.user.plan === 'ultra' || this.user.plan === 'api_fullstack';
    },
    isUltra: function () {
        return this.user.plan === 'ultra' || this.user.plan === 'api_fullstack';
    },
    hasCredits: function () {
        return this.user.aiCredits > 0;
    },

    // ⚡ DESCONECTAR ENERGÍA IA (Sincronizado con Supabase)
    consumeCredit: async function () {
        if (this.user.aiCredits > 0) {
            // 1. Descontamos en la pantalla al instante
            this.user.aiCredits -= 1;
            this.updateUI();

            // 2. Le avisamos a Supabase para evitar el "Hack de F5"
            const userIdDisplay = document.getElementById('userInternalIdDisplay');
            const userId = userIdDisplay ? userIdDisplay.getAttribute('data-uuid') : null;

            if (userId && userId !== '---' && typeof supabaseClient !== 'undefined') {
                try {
                    await supabaseClient.rpc('descontar_energia_ia', {
                        usuario_id: userId
                    });
                } catch (e) {
                    console.error("Error al sincronizar consumo de IA:", e);
                }
            }
        }
    },

    // 🎨 MOTOR DE INTERFAZ DINÁMICA
    updateUI: function () {
        // 1. Actualizar Contadores de Energía
        const display = document.getElementById('aiCreditsDisplay');
        const profileDisplay = document.getElementById('profileAiCredits');
        if (display) display.innerText = this.user.aiCredits || 0;
        if (profileDisplay) profileDisplay.innerText = this.user.aiCredits || 0;

        // 2. Estilo del Badge de Energía
        const badge = document.getElementById('aiCreditBadge');
        if (badge) {
            if (this.user.aiCredits <= 2) {
                badge.classList.replace('text-purple-600', 'text-red-500');
                badge.classList.add('animate-pulse');
            } else {
                badge.classList.replace('text-red-500', 'text-purple-600');
                badge.classList.remove('animate-pulse');
            }
        }

        // 🔒 3. PROTECCIÓN DE API (Muro de Pago Inteligente - Dinámico 🧠)
        const apiAccessContainer = document.getElementById('apiAccessContainer');

        if (apiAccessContainer) {
            // 🕵️‍♂️ LÓGICA BLINDADA: Verificamos por nombre de plan explícito o por el permiso SQL
            const planesConApi = ['ultra', 'api_fullstack', 'enterprise'];
            const tienePermisoAPI = planesConApi.includes(this.user.plan) || (this.user.features && this.user.features.api_access === true);

            if (!tienePermisoAPI) {
                // 🔴 Bloqueado: Plan Free o Pro (Cofre Cerrado)
                apiAccessContainer.innerHTML = `
    <div onclick="event.preventDefault(); event.stopPropagation(); openApiModal();" class="flex items-center justify-between w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-2.5 rounded-xl group overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-all active:scale-[0.98]">
        <div class="flex flex-col items-start w-full pr-3 min-w-0">
            <span class="text-[8px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em] leading-none mb-1 flex items-center gap-1">
                <i data-lucide="lock" class="w-2.5 h-2.5"></i> API Key Bloqueada
            </span>
            <span class="text-[10px] font-bold text-slate-500 dark:text-gray-400 tracking-wide break-all w-full select-none">
                Exclusivo en planes ULTRA / API
            </span>
        </div>
        <div class="bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white p-2 rounded-lg transition-all shrink-0">
            <i data-lucide="zap" class="w-4 h-4"></i>
        </div>
    </div>
`;
            } else {
                // 🟢 Desbloqueado: Muestra la llave CPLY-XXXX real de la tabla
                apiAccessContainer.innerHTML = `
                    <div class="flex items-center justify-between w-full bg-violet-500/5 border border-violet-500/20 px-3 py-2.5 rounded-xl group cursor-pointer hover:bg-violet-500/10 hover:border-violet-500/40 transition-all shadow-sm active:scale-95 overflow-hidden"
                        onclick="navigator.clipboard.writeText('${this.user.apiKey || ''}'); if(typeof Notify !== 'undefined') Notify.show('API Key Copiada', 'Llave lista para usar', 'success');"
                        title="Copiar API Key">
                        <div class="flex flex-col items-start w-full pr-3 min-w-0">
                            <span class="text-[8px] font-black text-violet-400 uppercase tracking-[0.2em] leading-none mb-1 flex items-center gap-1">
                                <i data-lucide="key" class="w-2.5 h-2.5"></i> Tu API Key
                            </span>
                            <span id="userIdDisplay" class="text-xs font-bold text-slate-700 dark:text-white font-mono tracking-widest blur-[3px] group-hover:blur-none transition-all duration-300 break-all w-full select-all">
                                ${this.user.apiKey || 'Generando llave...'}
                            </span>
                        </div>
                        <i data-lucide="copy" class="w-4 h-4 text-violet-300 group-hover:text-slate-500 transition-colors shrink-0"></i>
                    </div>
                `;
            }
        }

        // 4. ACTUALIZAR TEXTOS DEL PERFIL SEGÚN EL PLAN
        const planLabel = document.getElementById('planLabel');
        const planBadge = document.getElementById('planBadge');
        const planIcon = document.getElementById('planIcon');

        if (planLabel && planBadge) {
            if (this.isUltra()) {
                planLabel.innerText = 'Plan ULTRA / API';
                planBadge.className = 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border bg-purple-500/10 text-purple-600 border-purple-500/30';
                if (planIcon) planIcon.setAttribute('data-lucide', 'sparkles');
            }
            else if (this.isPro()) {
                planLabel.innerText = 'Plan PRO';
                planBadge.className = 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
                if (planIcon) planIcon.setAttribute('data-lucide', 'crown');
            }
            else {
                planLabel.innerText = 'Plan Esencial';
                planBadge.className = 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border bg-slate-100 dark:bg-white/5 text-gray-500 border-slate-200 dark:border-white/10';
                if (planIcon) planIcon.setAttribute('data-lucide', 'award');
            }
        }

        // Refrescar iconos
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
};

// Exponemos la función setPlan por si la necesitas forzar manualmente
window.setPlan = function (nuevoPlan) {
    DB.user.plan = nuevoPlan;
    DB.updateUI();
};

// 📊 MÓDULO MAESTRO: CARGAR ESTADÍSTICAS E HISTORIAL DESDE LA NUBE
window.cargarHistorialPerfil = async function () {
    const userIdDisplay = document.getElementById('userInternalIdDisplay');
    const userId = userIdDisplay ? userIdDisplay.getAttribute('data-uuid') : null;

    const statsCol = document.getElementById('profileStatsColumn');
    const authCol = document.getElementById('profileAuthColumn');
    const brandCol = document.getElementById('profileBrandColumn');

    // 🚀 MODO INVITADO: Ocultar estadísticas y mostrar el panel de la marca
    if (!userId || userId === '---' || userId === 'Cargando...' || typeof supabaseClient === 'undefined') {
        if (statsCol) {
            statsCol.classList.add('hidden');
            statsCol.classList.remove('md:flex', 'flex');
        }
        if (brandCol) {
            // Aseguramos que se oculte en móvil (hidden) pero se muestre en PC (md:flex)
            brandCol.classList.add('hidden');
            brandCol.classList.add('md:flex');
        }
        if (authCol) {
            authCol.classList.remove('md:w-full');
            authCol.classList.add('md:w-[45%]');
        }
        return; // Terminamos aquí, no hay nada que buscar en la base de datos
    }

    try {
        // 🔓 MODO USUARIO: Expande el modal a dos columnas para mostrar estadísticas
        if (statsCol) {
            // 🟢 Forzamos la visibilidad eliminando cualquier rastro de 'hidden' y asegurando el flex
            statsCol.classList.remove('hidden');
            statsCol.style.setProperty('display', 'flex', 'important');
            statsCol.classList.add('flex', 'md:flex');
        }
        if (brandCol) {
            brandCol.classList.add('hidden');
            brandCol.classList.remove('md:flex');
        }
        if (authCol) {
            authCol.classList.remove('md:w-full');
            authCol.classList.add('md:w-[45%]');
        }

        let statsDiv = document.getElementById('compresslyStatsContainer');
        if (!statsDiv) return;

        // 1. TRAEMOS LAS ESTADÍSTICAS (Ahora desde la tabla user_stats) 📊
        let stats = { total_imagenes_procesadas: 0, total_ahorro_bytes: 0, stat_webp: 0, stat_jpg: 0, stat_png: 0 };

        const { data: userStats, error } = await supabaseClient.from('user_stats')
            .select('total_imagenes_procesadas, total_ahorro_bytes, stat_webp, stat_jpg, stat_png')
            .eq('usuario_id', userId).maybeSingle();

        // Si hay un error que NO es "fila no encontrada" (PGRST116), lo lanzamos.
        // Es normal que un usuario nuevo no tenga fila en user_stats todavía.
        if (error && error.code !== 'PGRST116') {
            throw new Error("Error en sincronía");
        }

        // Si encontró datos, los usamos
        if (userStats) {
            stats = userStats;
        }

        // 🚀 SINCRONIZACIÓN GLOBAL: Actualizamos el cintillo superior automáticamente
        localStorage.setItem('compressly_total_saved', stats.total_ahorro_bytes || 0);
        if (typeof updateGlobalImpact === 'function') {
            updateGlobalImpact(0);
        }

        // 2. RENDERIZAMOS EL DISEÑO COMPACTO (Bento Grid Style)
        let htmlContent = `
                <div class="grid grid-cols-2 gap-3 mb-3">
                    <div class="bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-primary-500/30 transition-all">
                        <div class="flex items-center gap-2 mb-2 relative z-10">
                            <i data-lucide="image" class="w-4 h-4 text-primary-500"></i>
                            <h3 class="text-slate-500 dark:text-gray-400 font-black text-[10px] uppercase tracking-widest">Procesadas</h3>
                        </div>
                        <span class="text-2xl font-black text-slate-900 dark:text-white relative z-10">${stats.total_imagenes_procesadas || 0}</span>
                    </div>
                    
                    <div class="bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div class="flex items-center gap-2 mb-2 relative z-10">
                            <i data-lucide="leaf" class="w-4 h-4 text-emerald-500"></i>
                            <h3 class="text-slate-500 dark:text-gray-400 font-black text-[10px] uppercase tracking-widest">Ahorro</h3>
                        </div>
                        <div class="relative z-10 flex items-baseline gap-1">
                            <span class="text-2xl font-black text-slate-900 dark:text-white">${(stats.total_ahorro_bytes / 1024 / 1024).toFixed(1)}</span>
                            <span class="text-[10px] font-bold text-emerald-500">MB</span>
                        </div>
                    </div>
                </div>
                
                <button onclick="openActivityModal()" class="w-full bg-transparent hover:bg-slate-100 dark:hover:bg-white/[0.05] border border-transparent rounded-xl px-2 py-2.5 mb-5 flex items-center justify-between transition-all active:scale-[0.98] group">
                    <div class="flex items-center gap-2 text-slate-500 dark:text-gray-400 group-hover:text-primary-500 transition-colors">
                        <i data-lucide="history" class="w-4 h-4"></i>
                        <span class="text-[11px] font-bold uppercase tracking-widest">Ver Historial de Actividad</span>
                    </div>
                    <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300 group-hover:translate-x-1 group-hover:text-primary-500 transition-all"></i>
                </button>
            `;

        statsDiv.innerHTML = htmlContent;

        // 📊 4. MATEMÁTICA Y ACTUALIZACIÓN DE BARRAS DE FORMATO
        const sWebp = stats.stat_webp || 0;
        const sJpg = stats.stat_jpg || 0;
        const sPng = stats.stat_png || 0;
        const totalFormatos = sWebp + sJpg + sPng;

        const pctWebp = totalFormatos > 0 ? Math.round((sWebp / totalFormatos) * 100) : 0;
        const pctJpg = totalFormatos > 0 ? Math.round((sJpg / totalFormatos) * 100) : 0;
        const pctPng = totalFormatos > 0 ? Math.round((sPng / totalFormatos) * 100) : 0;

        const statTotal = document.getElementById('statTotalImages');
        if (statTotal) statTotal.innerText = stats.total_imagenes_procesadas || 0;

        const barWebp = document.getElementById('barWebp');
        const txtWebp = document.getElementById('statWebpPct');
        if (barWebp && txtWebp) { barWebp.style.width = pctWebp + '%'; txtWebp.innerText = pctWebp + '%'; }

        const barJpg = document.getElementById('barJpg');
        const txtJpg = document.getElementById('statJpgPct');
        if (barJpg && txtJpg) { barJpg.style.width = pctJpg + '%'; txtJpg.innerText = pctJpg + '%'; }

        const barPng = document.getElementById('barPng');
        const txtPng = document.getElementById('statPngPct');
        if (barPng && txtPng) { barPng.style.width = pctPng + '%'; txtPng.innerText = pctPng + '%'; }

        if (typeof lucide !== 'undefined') lucide.createIcons();

    } catch (e) { console.error("Error cargando historial:", e); }
};

// ☁️ ==========================================
// SINCRONIZACIÓN DE COMPRESIÓN CON SUPABASE 🚀
// ==========================================
window.registrarCompresionEnNube = async function (formato, bytesAhorrados, nombreArchivo) {
    // 1. Verificamos si hay sesión activa 🕵️‍♂️ (Evita errores si un invitado comprime)
    if (typeof supabaseClient === 'undefined') return;
    const { data: sessionData } = await supabaseClient.auth.getSession();
    if (!sessionData || !sessionData.session) return;

    const userId = sessionData.session.user.id;

    // 2. Preparamos los datos matemáticos para tus columnas 🧮
    let cant_webp = formato.toLowerCase() === 'webp' ? 1 : 0;
    let cant_jpg = (formato.toLowerCase() === 'jpg' || formato.toLowerCase() === 'jpeg') ? 1 : 0;
    let cant_png = formato.toLowerCase() === 'png' ? 1 : 0;

    try {
        // ⚡ LLAMAMOS A TU FUNCIÓN SQL
        const { error } = await supabaseClient.rpc('registrar_compresion_exitosa', {
            u_id: userId,
            tipo_proceso: `Compresión ${formato.toUpperCase()}`, // Ejemplo: "Compresión WEBP" o "Compresión JPG"
            info_archivo: `Archivo: ${nombreArchivo || 'Imagen'}`,
            bytes_ahorrados: bytesAhorrados,
            cant_webp: cant_webp,
            cant_jpg: cant_jpg,
            cant_png: cant_png
        });

        if (error) {
            console.error("❌ Error guardando en Supabase:", error.message);
        } else {
            console.log("☁️✅ ¡Estadísticas guardadas en la Nube con éxito!");
            // 🔄 Refrescamos el perfil de fondo silenciosamente para que los números suban al instante
            if (typeof cargarHistorialPerfil === 'function') cargarHistorialPerfil();
        }
    } catch (e) {
        console.error("❌ Fallo crítico de conexión al intentar guardar stats:", e);
    }
};