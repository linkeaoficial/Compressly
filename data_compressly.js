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