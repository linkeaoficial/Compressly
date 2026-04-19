// 🗄️ BASE DE DATOS SIMULADA DE COMPRESSLY (data_compressly.js)
// Aquí controlamos la sesión, el plan y el saldo de la IA.

const DB = {
    // ⚙️ CONFIGURACIÓN DE NEGOCIO (¡Fácil de cambiar para el CEO!)
    config: {
        creditosGratis: 3,  // Regalo diario para plan Esencial
        creditosPro: 10     // Regalo diario para plan PRO
    },

    // Datos del usuario actual (Inicia como Gratis con 3 créditos)
    user: {
        plan: 'ultra',       // Opciones: 'free', 'pro', 'ultra'
        aiCredits: 7        // Saldo de Energía para Auto-SEO
    },

    // Funciones de validación
    isPro: function () {
        return this.user.plan === 'pro' || this.user.plan === 'ultra';
    },
    isUltra: function () {
        return this.user.plan === 'ultra';
    },
    hasCredits: function () {
        return this.user.aiCredits > 0; // 🚀 Ahora la única regla es TENER SALDO
    },

    // Función para descontar un crédito cuando se usa la IA
    consumeCredit: function () {
        if (this.hasCredits()) {
            this.user.aiCredits--;
            this.updateUI();
            return true;
        }
        return false;
    },

    // Actualiza visualmente toda la App (Contadores, Perfil, Colores)
    updateUI: function () {
        // 1. Actualizar Contadores de Energía
        const display = document.getElementById('aiCreditsDisplay');
        const profileDisplay = document.getElementById('profileAiCredits');
        if (display) display.innerText = this.user.aiCredits;
        if (profileDisplay) profileDisplay.innerText = this.user.aiCredits;

        // 2. Estilo del Badge de Energía
        const badge = document.getElementById('aiCreditBadge');
        if (badge) {
            if (this.user.aiCredits <= 2) { // 🚨 Alerta en rojo si quedan 2 o menos
                badge.classList.replace('text-purple-600', 'text-red-500');
                badge.classList.add('animate-pulse');
            } else {
                badge.classList.replace('text-red-500', 'text-purple-600');
                badge.classList.remove('animate-pulse');
            }
        }

        // 3. ACTUALIZAR PERFIL SEGÚN EL PLAN
        const planLabel = document.getElementById('planLabel');
        const planBadge = document.getElementById('planBadge');
        const planIcon = document.getElementById('planIcon');
        const aiStat = document.getElementById('profileAiStat');
        const actionContainer = document.getElementById('profileActionContainer');

        if (planLabel && planBadge) {
            // 🚀 MOSTRAR LA CAJA DE CRÉDITOS PARA TODOS (Para que vean el regalo)
            if (aiStat) aiStat.classList.remove('hidden');

            if (this.isUltra()) {
                planLabel.innerText = 'Plan ULTRA IA';
                planBadge.className = 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border bg-purple-500/10 text-purple-600 border-purple-500/30';
                if (planIcon) planIcon.setAttribute('data-lucide', 'sparkles');

                // 🚀 BOTÓN BLINDADO: Se ve idéntico en modo claro y oscuro
                if (actionContainer) actionContainer.innerHTML = `
                    <button onclick="closeProfileModal(); openRechargeModal();" 
                        class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 !text-white font-black py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/10">
                        <i data-lucide="battery-charging" class="w-4 h-4 !text-white"></i> RECARGAR ENERGÍA IA
                    </button>`;
            }
            else if (this.isPro()) {
                planLabel.innerText = 'Plan PRO Acceso';
                planBadge.className = 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
                if (planIcon) planIcon.setAttribute('data-lucide', 'crown');

                if (actionContainer) actionContainer.innerHTML = `<button onclick="closeProfileModal(); openUltraModal();" class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"><i data-lucide="rocket" class="w-4 h-4"></i> SUBIR A ULTRA IA</button>`;
            }
            else {
                planLabel.innerText = 'Plan Esencial';
                planBadge.className = 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border bg-slate-100 dark:bg-white/5 text-gray-500 border-slate-200 dark:border-white/10';
                if (planIcon) planIcon.setAttribute('data-lucide', 'award');

                if (actionContainer) actionContainer.innerHTML = `<button onclick="closeProfileModal(); window.scrollTo({top: document.getElementById('precios').offsetTop, behavior: 'smooth'});" class="w-full bg-primary-500 hover:bg-primary-600 text-white font-black py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95">VER PLANES PREMIUM</button>`;
            }
        }

        // Refrescar iconos
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
};

// 🎮 TRUCO DE DESARROLLADOR: Asigna créditos automáticamente al cambiar de plan
window.setPlan = function (nuevoPlan) {
    DB.user.plan = nuevoPlan;

    // Ajuste de créditos por plan
    if (nuevoPlan === 'free') DB.user.aiCredits = DB.config.creditosGratis;
    else if (nuevoPlan === 'pro') DB.user.aiCredits = DB.config.creditosPro;
    else if (nuevoPlan === 'ultra') DB.user.aiCredits = 100;

    // 🚀 DISPARADOR MAESTRO: Actualiza absolutamente toda la interfaz
    if (typeof actualizarEstadoPlanes === 'function') {
        actualizarEstadoPlanes();
    }

    // También actualizamos los contadores de créditos específicos
    DB.updateUI();

    console.log(`UI INTEGRADA -> Estado: ${nuevoPlan === 'free' ? 'Local' : 'Sincronizado'} | Plan: ${nuevoPlan.toUpperCase()}`);
};

// 🔐 FUNCIÓN DE LOGOUT (Lista para Supabase)
window.logoutUsuario = function () {
    // 1. En el futuro aquí irá: await supabase.auth.signOut();

    // 2. Reseteamos el plan a free (Esto disparará actualizarEstadoPlanes automáticamente)
    setPlan('free');

    // 3. Notificación y limpieza visual
    if (typeof Notify !== 'undefined') {
        Notify.show('Sesión Cerrada', 'Has vuelto al perfil local con éxito.', 'info');
    }

    // 4. Opcional: Cerramos el modal para que el usuario vea el cambio en la app
    if (typeof closeProfileModal === 'function') {
        setTimeout(closeProfileModal, 500);
    }
};