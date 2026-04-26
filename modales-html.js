const htmlModales = `
    <div id="legalModal" class="fixed inset-0 z-[100] hidden items-center justify-center px-0 md:px-4">
        <div id="modalOverlay" class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"></div>

        <div class="bento-card relative z-10 w-full max-w-2xl h-[100dvh] max-h-[100dvh] md:h-auto md:max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col shadow-2xl border-none md:border md:border-primary-500/30 transform transition-all scale-95 opacity-0 p-8 md:p-10 rounded-none md:rounded-3xl"
            id="modalContent">

            <div class="flex justify-between items-center border-b border-white/10 pb-5 mb-5 shrink-0">
                <h2 id="modalTitle" class="text-2xl font-extrabold text-white flex items-center gap-2">
                    <i data-lucide="file-text" class="w-6 h-6 text-primary-400"></i>
                    Documento Legal
                </h2>
                <button id="closeModalBtn"
                    class="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>

            <div id="modalBody"
                class="overflow-y-auto pr-2 space-y-4 text-gray-400 text-sm font-medium custom-scrollbar">
            </div>
        </div>
    </div>

    <div id="premiumModal" class="fixed inset-0 z-[125] hidden items-center justify-center px-0 md:px-8">
        <div id="premiumOverlay" onclick="closePremiumModal()"
            class="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity cursor-pointer"></div>

        <div class="bento-card relative z-10 w-full h-[100dvh] max-h-[100dvh] md:max-w-5xl md:h-[85vh] md:max-h-[85vh] rounded-none md:rounded-3xl border-none md:border md:border-yellow-500/30 overflow-y-auto no-scrollbar md:overflow-hidden block md:flex md:flex-row shadow-[0_0_50px_rgba(250,204,21,0.15)] transform transition-all scale-95 opacity-0 p-8 md:p-0"
            id="premiumContent">

            <div class="w-full md:w-[55%] md:p-12 flex flex-col relative text-left">
                
                <div class="flex justify-between items-start border-b border-slate-200 dark:border-white/10 pb-5 mb-6 md:pb-6 md:mb-8">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                            <i data-lucide="crown" class="w-7 h-7 text-white"></i>
                        </div>
                        <div>
                            <h2 data-i18n="premium_title" class="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">Dominio Profesional</h2>
                            <p class="text-sm font-medium text-yellow-600 flex items-center gap-2 mt-1">
                                <i data-lucide="award" class="w-4 h-4"></i>
                                Acceso de por vida
                            </p>
                        </div>
                    </div>
                    <button onclick="closePremiumModal()" class="md:hidden text-gray-400 hover:text-white p-2 rounded-lg transition-colors">
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                </div>

                <p class="text-slate-500 dark:text-gray-400 font-medium text-sm mb-8 leading-relaxed">
    Desbloquea el poder total de Compressly. Sin mensualidades, sin límites y con herramientas de grado profesional para tu flujo de trabajo<span class="hidden md:inline"> diario</span>.
</p>

                <div class="grid grid-cols-1 gap-4 mb-8">
                    <div class="bg-yellow-500/5 border border-yellow-500/10 rounded-2xl p-4 flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-600">
                            <i data-lucide="layers" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold text-slate-900 dark:text-white">Lotes Ilimitados</h4>
                            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Procesa cientos de fotos a la vez</p>
                        </div>
                    </div>
                    <div class="bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4">
                        <div class="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-500 shrink-0">
                            <i data-lucide="shield-check" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold text-slate-900 dark:text-white">Escudo Anti-Rastreo</h4>
                            <p class="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-tight md:tracking-wider">Limpieza automática de metadatos GPS</p>
                        </div>
                    </div>
                </div>
                
                <div class="mt-auto p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 hidden md:block">
                    <p class="text-xs font-bold text-yellow-700 dark:text-yellow-500 flex items-center gap-2">
                        <i data-lucide="info" class="w-4 h-4"></i>
                        Incluye 25 Créditos de IA para Auto-SEO como bono de bienvenida.
                    </p>
                </div>
            </div>

            <div class="w-full md:w-[45%] md:p-12 bg-transparent md:bg-gradient-to-br md:from-yellow-50/50 md:to-orange-50/50 dark:md:from-yellow-500/5 dark:md:to-orange-500/5 border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/10 flex flex-col justify-center relative overflow-hidden">
                
                <button onclick="closePremiumModal()" class="hidden md:block absolute top-4 right-4 text-gray-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-lg transition-colors z-50">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
                
                <div class="text-center relative z-10 w-full">
                    <div class="mb-6 hidden md:block">
    <span class="px-4 py-1.5 rounded-full bg-yellow-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-yellow-500/20">Pago Único</span>
</div>

                    <h3 class="text-lg md:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Activar Acceso PRO</h3>
                    <p class="text-sm text-slate-500 dark:text-gray-400 font-medium mb-8">Potencia tu flujo de trabajo sin límites.</p>

                    <form class="flex flex-col gap-4 text-left"
                        onsubmit="event.preventDefault(); const email = this.querySelector('input[type=email]').value; const msg = encodeURIComponent('¡Hola! Quiero aprovechar la oferta de Compressly PRO por $19.99. Mi correo es: ' + email); window.open('https://wa.me/584161356896?text=' + msg, '_blank'); closePremiumModal();">
                        
                        <div>
                            <label class="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2 block">Tu correo electrónico</label>
                            <input type="email" required data-i18n="premium_email_ph" placeholder="usuario@ejemplo.com"
                                class="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500 transition-colors placeholder-gray-500 font-bold text-sm">
                        </div>

                        <button type="submit"
                            class="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:scale-[1.02] active:scale-95 text-white font-extrabold py-4 rounded-xl transition-all shadow-[0_15px_30px_rgba(250,204,21,0.3)] flex items-center justify-center gap-2 text-sm mt-2 border border-white/10">
                            <i data-lucide="crown" class="w-5 h-5 text-white"></i> <span data-i18n="premium_btn">Obtener Acceso PRO ($19.99)</span>
                        </button>
                    </form>
                    
                    <button onclick="closePremiumModal()" class="mt-8 text-[10px] font-bold text-gray-400 hover:text-slate-600 dark:hover:text-white transition-colors uppercase tracking-widest">
                        <span data-i18n="premium_cancel">Quizás más tarde</span>
                    </button>
                </div>

                <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-yellow-500/10 blur-[80px] rounded-full pointer-events-none"></div>
            </div>
        </div>
    </div>

    <div id="ultraModal" class="fixed inset-0 z-[125] hidden items-center justify-center px-0 md:px-8">
        <div id="ultraOverlay" onclick="closeUltraModal()"
            class="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity cursor-pointer"></div>

        <div class="bento-card relative z-10 w-full h-[100dvh] max-h-[100dvh] md:max-w-5xl md:h-[85vh] md:max-h-[85vh] rounded-none md:rounded-3xl border-none md:border md:border-purple-500/30 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:overflow-hidden block md:flex md:flex-row shadow-[0_0_50px_rgba(168,85,247,0.15)] transform transition-all scale-95 opacity-0 px-6 py-10 md:p-0"
            id="ultraContent">

            <div class="w-full md:w-[55%] md:p-12 flex flex-col relative text-left">
                
                <div class="flex justify-between items-start border-b border-slate-200 dark:border-white/10 pb-5 mb-6 md:pb-6 md:mb-8">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                            <i data-lucide="sparkles" class="w-7 h-7 text-white"></i>
                        </div>
                        <div>
                            <h2 data-i18n="ultra_title" class="text-lg md:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight md:tracking-normal">Desbloquea <span class="hidden md:inline">el Poder</span> IA</h2>
                            <p class="text-sm font-medium text-purple-500 flex items-center gap-2 mt-1">
                                <i data-lucide="rocket" class="w-4 h-4"></i>
                                Velocidad Extrema
                            </p>
                        </div>
                    </div>
                    <button onclick="closeUltraModal()" class="md:hidden text-gray-400 hover:text-white p-2 rounded-lg transition-colors">
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                </div>

                <p class="text-slate-500 dark:text-gray-400 font-medium text-sm mb-8 leading-relaxed">
                    Genera descripciones y nombres optimizados automáticamente. Ahorra horas de trabajo en tu E-commerce<span class="hidden md:inline"> y mejora tu posicionamiento web con inteligencia artificial</span>.
                </p>

                <div class="grid grid-cols-1 gap-4 mb-8">
                    <div class="bg-purple-500/5 border border-purple-500/10 rounded-2xl p-4 flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-500 shrink-0">
                            <i data-lucide="bot" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold text-slate-900 dark:text-white">Módulo Auto-SEO</h4>
                            <p class="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-tight md:tracking-wider">Generación de nombres y etiquetas ALT</p>
                        </div>
                    </div>
                    <div class="bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-500 shrink-0">
                            <i data-lucide="zap" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold text-slate-900 dark:text-white">Cero Publicidad</h4>
                            <p class="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-tight md:tracking-wider">Experiencia limpia y descargas rápidas</p>
                        </div>
                    </div>
                </div>
                
                <div class="mt-auto p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 hidden md:block">
                    <p class="text-xs font-bold text-purple-700 dark:text-purple-400 flex items-center gap-2">
                        <i data-lucide="gift" class="w-4 h-4"></i>
                        Bono exclusivo: 100 Créditos API incluidos en tu plan mensual.
                    </p>
                </div>
            </div>

            <div class="w-full md:w-[45%] md:p-12 bg-transparent md:bg-gradient-to-br md:from-purple-50/50 md:to-indigo-50/50 dark:md:from-purple-500/5 dark:md:to-indigo-500/5 border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/10 flex flex-col justify-center relative overflow-hidden">
                
                <button onclick="closeUltraModal()" class="hidden md:block absolute top-4 right-4 text-gray-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-lg transition-colors z-50">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
                
                <div class="text-center relative z-10 w-full">
                    <div class="mb-6 hidden md:block">
                        <span class="px-4 py-1.5 rounded-full bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-500/20">Suscripción Mensual</span>
                    </div>

                    <h3 class="text-lg md:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Activar Acceso ULTRA</h3>
                    <p class="text-sm text-slate-500 dark:text-gray-400 font-medium mb-8">Automatiza tu trabajo hoy mismo.</p>

                    <form class="flex flex-col gap-4 text-left"
                        onsubmit="event.preventDefault(); window.open('https://wa.me/584161356896?text=¡Hola!%20Quiero%20activar%20el%20Plan%20ULTRA%20IA%20($6.99)%20en%20Compressly.%20Mi%20correo%20es:%20' + this.querySelector('input[type=email]').value, '_blank'); closeUltraModal();">
                        
                        <div>
                            <label class="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2 block">Tu correo electrónico</label>
                            <input type="email" required data-i18n="ultra_email_ph" placeholder="usuario@ejemplo.com"
                                class="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-500 font-bold text-sm">
                        </div>

                        <button type="submit"
                            class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.02] active:scale-95 !text-white font-extrabold py-4 rounded-xl transition-all shadow-[0_15px_30px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2 text-sm mt-2 border border-white/10">
                            <i data-lucide="rocket" class="w-5 h-5 !text-white"></i> <span data-i18n="ultra_btn">Activar Plan ULTRA ($6.99)</span>
                        </button>
                    </form>
                    
                    <button onclick="closeUltraModal()" class="mt-8 text-[10px] font-bold text-gray-400 hover:text-slate-600 dark:hover:text-white transition-colors uppercase tracking-widest">
                        <span data-i18n="ultra_cancel">Seguir usando el plan actual</span>
                    </button>
                </div>

                <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none"></div>
            </div>
        </div>
    </div>

    <div id="apiModal" class="fixed inset-0 z-[125] hidden items-center justify-center px-0 md:px-8">
        <div id="apiOverlay" onclick="closeApiModal()"
            class="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity cursor-pointer"></div>

       <div class="bento-card relative z-10 w-full h-[100dvh] max-h-[100dvh] md:max-w-5xl md:h-[85vh] md:max-h-[85vh] rounded-none md:rounded-3xl border-none md:border md:border-emerald-500/30 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:overflow-hidden block md:flex md:flex-row shadow-[0_0_50px_rgba(16,185,129,0.15)] transform transition-all scale-95 opacity-0 px-6 py-10 md:p-0"
    id="apiContent">

            <div class="w-full md:w-[55%] md:p-12 flex flex-col relative text-left">
                
                <div class="flex justify-between items-start border-b border-slate-200 dark:border-white/10 pb-5 mb-6 md:pb-6 md:mb-8">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                            <i data-lucide="webhook" class="w-7 h-7 text-white"></i>
                        </div>
                        <div>
                            <h2 data-i18n="api_modal_title" class="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">Poder Full-Stack</h2>
                            <p class="text-sm font-medium text-emerald-500 flex items-center gap-2 mt-1">
                                <span class="relative flex h-2 w-2 items-center justify-center">
                                    <span class="animate-ping absolute h-full w-full rounded-full bg-emerald-500 opacity-40"></span>
                                    <span class="relative rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Acceso Desarrollador
                            </p>
                        </div>
                    </div>
                    <button onclick="closeApiModal()" class="md:hidden text-gray-400 hover:text-white p-2 rounded-lg transition-colors">
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                </div>

                <p data-i18n="api_modal_desc" class="text-slate-500 dark:text-gray-400 font-medium text-sm mb-8 leading-relaxed">
                    Conecta tu E-commerce o App a nuestro motor. Compresión automática y hospedaje en la nube sin costo adicional.
                </p>

                <div class="grid grid-cols-1 gap-4 mb-8">
                    <div class="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                            <i data-lucide="layers" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold text-slate-900 dark:text-white">3,000 Imágenes / mes</h4>
                            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Escalabilidad inmediata</p>
                        </div>
                    </div>
                    <div class="bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-500">
                            <i data-lucide="database" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold text-slate-900 dark:text-white">Hospedaje R2 Incluido</h4>
                            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Cloudflare Infrastructure</p>
                        </div>
                    </div>
                </div>
                
                <a href="Documentación_API.html" class="mt-auto group hidden md:flex items-center justify-between p-4 rounded-xl border border-dashed border-emerald-500/30 hover:border-emerald-500/60 transition-all">
                    <div class="flex items-center gap-3">
                        <i data-lucide="code-2" class="w-5 h-5 text-emerald-500"></i>
                        <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">Ver Documentación Técnica</span>
                    </div>
                    <i data-lucide="external-link" class="w-4 h-4 text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                </a>
            </div>

            <div class="w-full md:w-[45%] md:p-12 bg-transparent md:bg-gradient-to-br md:from-emerald-50/50 md:to-teal-50/50 dark:md:from-emerald-500/5 dark:md:to-teal-500/5 border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/10 flex flex-col justify-center relative overflow-hidden">
                
                <button onclick="closeApiModal()" class="hidden md:block absolute top-4 right-4 text-gray-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-lg transition-colors z-50">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
                
                <div class="text-center relative z-10 w-full">
                    <div class="mb-6 hidden md:block">
                        <span class="px-4 py-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">Uso Profesional</span>
                    </div>

                    <h3 class="text-lg md:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Activar Acceso API</h3>
                    <p class="text-sm text-slate-500 dark:text-gray-400 font-medium mb-8">Comienza a automatizar hoy mismo.</p>

                    <form class="flex flex-col gap-4 text-left"
                        onsubmit="event.preventDefault(); window.open('https://wa.me/584161356896?text=¡Hola!%20Quiero%20solicitar%20acceso%20al%20Plan%20API%20Full-Stack%20($14.99)%20en%20Compressly.%20Mi%20correo%20es:%20' + this.querySelector('input[type=email]').value, '_blank'); closeApiModal();">
                        
                        <div>
                            <label class="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2 block">Tu correo de cuenta</label>
                            <input type="email" required data-i18n="api_email_ph" placeholder="usuario@ejemplo.com"
                                class="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-500 font-bold text-sm">
                        </div>

                        <button type="submit"
                            class="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-[1.02] active:scale-95 !text-white font-extrabold py-4 rounded-xl transition-all shadow-[0_15px_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 text-sm mt-2">
                            <i data-lucide="zap" class="w-5 h-5 !text-white"></i> <span data-i18n="api_modal_btn">Activar API ($14.99/mes)</span>
                        </button>
                    </form>
                    
                    <p class="mt-8 text-[10px] text-gray-400 font-medium italic">Suscripción gestionada vía WhatsApp para soporte directo.</p>
                </div>

                <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>
            </div>
        </div>
    </div>

    <div id="rechargeModal" class="fixed inset-0 z-[140] hidden items-center justify-center px-0 md:px-8">
        <div id="rechargeOverlay" onclick="closeRechargeModal()"
            class="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer transition-opacity"></div>
        <div class="bento-card relative z-10 w-full max-w-md h-[100dvh] max-h-[100dvh] md:max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col shadow-[0_0_50px_rgba(168,85,247,0.2)] border-none md:border md:border-purple-500/40 bg-gradient-to-b from-purple-500/5 to-transparent p-8 text-center transform transition-all scale-95 opacity-0 rounded-none md:rounded-3xl"
    id="rechargeContent">

            <button onclick="closeRechargeModal()"
                class="absolute top-4 right-4 text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 p-2 rounded-lg transition-colors z-50">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>

            <div
                class="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 border border-purple-400/50 rounded-full flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(168,85,247,0.4)] text-white">
                <i data-lucide="battery-charging" class="w-8 h-8"></i>
            </div>

            <h2 data-i18n="recharge_title"
                class="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Recargar Energía</h2>
            <p data-i18n="recharge_desc"
                class="text-slate-500 dark:text-gray-400 text-sm mb-6 font-medium leading-relaxed">Inyecta potencia
                extra
                a tu plan actual con paquetes de créditos inmediatos.</p>

            <div class="grid grid-cols-1 gap-3">

                <button
                    onclick="window.open('https://wa.me/584161356896?text=¡Hola!%20Quiero%20el%20Pack%20Básico%20de%20IA%20(500%20imágenes)%20por%20$4.99%20⚡', '_blank')"
                    class="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 transition-all flex items-center justify-between group active:scale-[0.98]">
                    <div class="text-left">
                        <span data-i18n="recharge_basic"
                            class="block text-xs font-black text-purple-500 uppercase tracking-widest">Pack
                            Básico</span>
                        <span class="text-lg font-black text-slate-800 dark:text-white">500 <span
                                data-i18n="recharge_images">Imágenes</span></span>
                    </div>
                    <span
                        class="bg-purple-100 text-purple-700 dark:bg-purple-600/20 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 px-3 py-1 rounded-lg font-black text-sm group-hover:bg-purple-500 group-hover:text-white transition-colors">$4.99</span>
                </button>

                <button
                    onclick="window.open('https://wa.me/584161356896?text=¡Hola!%20Quiero%20el%20Pack%20Ahorro%20de%20IA%20(1200%20imágenes)%20por%20$7.99%20🚀', '_blank')"
                    class="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/40 hover:border-purple-500 transition-all flex items-center justify-between group relative overflow-hidden active:scale-[0.98] shadow-[0_0_15px_rgba(168,85,247,0.15)]">

                    <div data-i18n="recharge_value"
                        class="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 text-[9px] font-black px-3 py-1 rounded-bl-lg rounded-tr-xl shadow-sm tracking-widest uppercase">
                        Mejor Valor
                    </div>

                    <div class="text-left mt-2">
                        <span data-i18n="recharge_save"
                            class="block text-xs font-black text-purple-500 uppercase tracking-widest">Pack
                            Ahorro</span>
                        <span class="text-lg font-black text-slate-800 dark:text-white">1,200 <span
                                data-i18n="recharge_images">Imágenes</span></span>
                    </div>
                    <span
                        class="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-lg font-black text-sm shadow-md group-hover:scale-105 transition-transform mt-2">$7.99</span>
                </button>

                <button
                    onclick="window.open('https://wa.me/584161356896?text=¡Hola!%20Quiero%20el%20Pack%20E-commerce%20de%20IA%20(3000%20imágenes)%20por%20$14.99%20🛒', '_blank')"
                    class="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 transition-all flex items-center justify-between group active:scale-[0.98]">
                    <div class="text-left">
                        <span data-i18n="recharge_ecom"
                            class="block text-xs font-black text-purple-500 uppercase tracking-widest">Pack
                            E-commerce</span>
                        <span class="text-lg font-black text-slate-800 dark:text-white">3,000 <span
                                data-i18n="recharge_images">Imágenes</span></span>
                    </div>
                    <span
                        class="bg-purple-100 text-purple-700 dark:bg-purple-600/20 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 px-3 py-1 rounded-lg font-black text-sm group-hover:bg-purple-500 group-hover:text-white transition-colors">$14.99</span>
                </button>

                <button
                    onclick="window.open('https://wa.me/584161356896?text=¡Hola!%20Quiero%20el%20Pack%20Agencia%20de%20IA%20(10000%20imágenes)%20por%20$39.99%20🏢', '_blank')"
                    class="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 transition-all flex items-center justify-between group active:scale-[0.98]">
                    <div class="text-left">
                        <span data-i18n="recharge_agency"
                            class="block text-xs font-black text-purple-500 uppercase tracking-widest">Pack
                            Agencia</span>
                        <span class="text-lg font-black text-slate-800 dark:text-white">10,000 <span
                                data-i18n="recharge_images">Imágenes</span></span>
                    </div>
                    <span
                        class="bg-purple-100 text-purple-700 dark:bg-purple-600/20 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 px-3 py-1 rounded-lg font-black text-sm group-hover:bg-purple-500 group-hover:text-white transition-colors">$39.99</span>
                </button>
            </div>

            <button onclick="closeRechargeModal()"
                class="mt-6 text-sm font-bold text-gray-400 hover:text-slate-700 dark:hover:text-white transition-colors"><span
                    data-i18n="recharge_back">Volver
                    a la App</span></button>
        </div>
    </div>

    <div id="profileModal" class="fixed inset-0 z-[120] hidden items-center justify-center px-0 md:px-8">
        <div id="profileOverlay"
            class="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity cursor-pointer"></div>



        <div class="bento-card relative z-10 w-full h-[100dvh] max-h-[100dvh] md:max-w-5xl md:h-[85vh] md:max-h-[85vh] rounded-none md:rounded-3xl border-none md:border md:border-primary-500/30 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:overflow-hidden block md:flex md:flex-row shadow-[0_0_50px_rgba(139,92,246,0.15)] transform transition-all scale-95 opacity-0 p-8 md:p-0"
    id="profileContent">

            <div class="w-full md:w-[55%] md:p-12 flex flex-col md:overflow-y-auto custom-scrollbar relative">

                <div
                    class="flex justify-between items-start border-b border-slate-200 dark:border-white/10 pb-5 mb-6 md:pb-6 md:mb-8">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                            <i data-lucide="user" class="w-7 h-7 text-white"></i>
                        </div>
                        <div class="flex flex-col justify-center">
                            <h2 id="profileNameDisplay" data-i18n="profile_greeting"
                                class="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                Hola, Creador
                            </h2>
                            <p
                                class="text-sm font-medium text-slate-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                                <span class="relative flex h-3 w-3 md:h-3 md:w-3 items-center justify-center shrink-0">
                                    <span id="profileStatusPing"
                                        class="animate-ping absolute h-full w-full rounded-full bg-green-500 opacity-40"></span>
                                    <span id="profileStatusDot"
                                        class="relative rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-green-500"></span>
                                </span>
                                <span id="profileStatusText" data-i18n="profile_status">Perfil Local Activo</span>
                            </p>
                        </div>
                    </div>

                    <button id="closeProfileBtn"
                        class="text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 p-2 rounded-lg transition-colors z-50">
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                </div>

                <div
                    class="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 md:p-5 mb-4 flex items-center justify-between gap-2">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                            <i data-lucide="leaf" class="w-5 h-5 text-green-500"></i>
                        </div>
                        <div class="text-left">
                            <h3 data-i18n="profile_impact_title"
                                class="text-slate-900 dark:text-white font-extrabold text-sm md:text-base leading-tight">
                                Impacto Global</h3>
                            <p data-i18n="profile_impact_sub"
                                class="text-[10px] md:text-xs text-slate-500 dark:text-gray-400 font-medium mt-0.5">
                                Planeta salvado:</p>
                        </div>
                    </div>
                    <span id="profileTotalSaved" class="text-xl md:text-2xl font-black text-green-500 shrink-0">0
                        MB</span>
                </div>

                <div id="profileAiStat"
                    class="flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-5 mb-5 gap-2">
                    <div class="flex items-center gap-3">
                        <div
                            class="bg-gradient-to-br from-purple-500 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center !text-white shadow-md shrink-0">
                            <i data-lucide="sparkles" class="w-5 h-5 !text-white"></i>
                        </div>
                        <div class="text-left">
                            <h3 class="text-slate-900 dark:text-white font-black text-sm md:text-base leading-tight">
                                Auto-SEO IA</h3>
                            <p
                                class="text-[10px] md:text-xs text-purple-600 dark:text-purple-400 font-extrabold tracking-widest mt-0.5 flex items-center gap-1">
                                <span id="profileAiCredits" class="text-sm font-black">0</span> CRÉDITOS
                            </p>
                        </div>
                    </div>
                    <button onclick="openRechargeModal()"
                        class="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 !text-white text-[10px] md:text-xs font-black px-3 md:px-4 py-2 rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1.5 uppercase shrink-0">
                        <i data-lucide="zap" class="w-3 h-3 md:w-4 md:h-4 !text-white"></i> <span
                            class="hidden sm:inline !text-white">Recargar</span><span
                            class="sm:hidden !text-white">Más</span>
                    </button>
                </div>

                <div
                    class="bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-2xl p-5 mb-8 text-left flex-grow">

                    <div id="planBadge"
                        class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border transition-all duration-500">
                        <i id="planIcon" data-lucide="award" class="w-3 h-3"></i>
                        <span id="planLabel">Plan Esencial</span>
                    </div>

                    <h3 class="text-sm font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <i data-lucide="pie-chart" class="w-4 h-4 text-primary-500"></i> <span
                            data-i18n="stat_title">Estadísticas de Uso</span>
                    </h3>

                    <div
                        class="flex justify-between items-center text-xs font-bold text-gray-500 mb-4 border-b border-slate-200 dark:border-white/10 pb-3">
                        <span data-i18n="stat_processed">Imágenes Procesadas:</span>
                        <span id="statTotalImages" class="text-primary-500 font-black text-sm">0</span>
                    </div>

                    <div id="profileActionContainer" class="w-full mb-6"></div>

                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1.5">
                                <span data-i18n="stat_webp" class="text-slate-700 dark:text-gray-300">WebP
                                    (Recomendado)</span>
                                <span id="statWebpPct" class="text-primary-500">0%</span>
                            </div>
                            <div class="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2">
                                <div id="barWebp" class="bg-primary-500 h-2 rounded-full transition-all duration-1000"
                                    style="width: 0%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1.5">
                                <span class="text-slate-700 dark:text-gray-300">JPG</span>
                                <span id="statJpgPct" class="text-blue-500">0%</span>
                            </div>
                            <div class="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2">
                                <div id="barJpg" class="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                                    style="width: 0%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1.5">
                                <span class="text-slate-700 dark:text-gray-300">PNG</span>
                                <span id="statPngPct" class="text-yellow-500">0%</span>
                            </div>
                            <div class="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2">
                                <div id="barPng" class="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                                    style="width: 0%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="w-full md:w-[45%] md:p-12 bg-transparent md:bg-gradient-to-br md:from-slate-50 md:to-slate-100 dark:md:from-black/40 dark:md:to-black/80 border-t-0 md:border-l border-slate-200 dark:border-white/10 flex flex-col justify-center relative overflow-hidden">

                <div
                    class="absolute -top-32 -right-32 w-96 h-96 bg-primary-500/20 blur-[100px] rounded-full pointer-events-none hidden md:block">
                </div>

                <div class="text-center relative z-10 w-full">

                    <div id="guestStateView" class="transition-opacity duration-300 w-full">
                        <h3 data-i18n="profile_sync_title"
                            class="text-lg md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 md:mb-3">
                            ☁️ Sincronizar Nube</h3>
                        <p data-i18n="profile_sync_sub"
                            class="text-sm md:text-sm text-slate-500 dark:text-gray-400 font-medium mb-5 px-2">
                            Crea tu cuenta gratis para guardar tu impacto y configuraciones.
                        </p>

                        <button onclick="loginConGoogle(event)"
                            class="w-full bg-white dark:bg-[#18181b] hover:bg-gray-50 dark:hover:bg-black text-slate-700 dark:text-white border border-slate-200 dark:border-white/10 px-5 py-3.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-3 active:scale-95 mb-4">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4" />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853" />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05" />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335" />
                            </svg>
                            <span data-i18n="profile_btn_google">Continuar con Google</span>
                        </button>

                        <div class="flex items-center gap-3 mb-4">
                            <div class="h-[1px] flex-1 bg-slate-200 dark:bg-white/10"></div>
                            <span data-i18n="profile_divider"
                                class="text-[10px] font-bold text-slate-400 tracking-widest">O CON CORREO</span>
                            <div class="h-[1px] flex-1 bg-slate-200 dark:bg-white/10"></div>
                        </div>

                        <form id="authForm" class="flex flex-col gap-3 text-left" onsubmit="procesarAuth(event)">
                            <div>
                                <input type="email" id="authEmail" required data-i18n="profile_email_ph"
                                    placeholder="Tu correo electrónico"
                                    class="w-full bg-slate-100 md:bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-primary-500 transition-colors placeholder-gray-500 font-bold text-sm">
                            </div>

                            <div class="relative">
                                <input type="password" id="authPassword" required data-i18n="profile_pass_ph"
                                    placeholder="Crea una contraseña" minlength="6" autocomplete="current-password"
                                    class="w-full bg-slate-100 md:bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-primary-500 transition-colors placeholder-gray-500 font-bold text-sm">
                                <button type="button" id="togglePasswordBtn"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors p-1">
                                    <i id="togglePasswordIcon" data-lucide="eye-off" class="w-4 h-4"></i>
                                </button>
                            </div>

                            <button type="submit"
                                class="w-full bg-primary-500 hover:bg-primary-600 active:scale-95 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center justify-center gap-2 text-sm mt-1">
                                <i data-lucide="log-in" class="w-4 h-4"></i> <span data-i18n="profile_btn_submit">Crear
                                    Cuenta / Entrar</span>
                            </button>
                        </form>
                    </div>

                    <div id="loggedInStateView"
                        class="hidden transition-opacity duration-300 w-full flex-col items-center">

                        <div
                            class="w-16 h-16 md:w-20 md:h-20 mx-auto bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-4 shadow-sm">
                            <i data-lucide="cloud-check" class="w-8 h-8 md:w-10 md:h-10 text-green-500"></i>
                        </div>

                        <h3 class="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mb-1">Cuenta
                            Sincronizada</h3>

                        <div class="flex flex-col items-center gap-3 mb-6 md:mb-8 w-full max-w-sm mx-auto">
                            <p id="userEmailDisplay"
                                class="text-sm text-slate-500 dark:text-gray-400 font-medium truncate px-2 leading-none mb-1 w-full text-center">
                                usuario@ejemplo.com
                            </p>

                            <div class="flex items-center justify-between w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 px-3 py-2.5 rounded-xl group cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95 overflow-hidden"
                                onclick="navigator.clipboard.writeText(document.getElementById('userInternalIdDisplay').innerText); if(typeof Notify !== 'undefined') Notify.show('ID Copiado', 'ID de soporte copiado con éxito', 'success');"
                                title="Copiar ID de Soporte">
                                <div class="flex flex-col items-start w-full pr-3 min-w-0">
                                    <span
                                        class="text-[8px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em] leading-none mb-1">ID
                                        Soporte</span>
                                    <span id="userInternalIdDisplay"
                                        class="text-[10px] font-medium text-slate-500 dark:text-gray-400 font-mono break-all w-full leading-tight select-all">Cargando...</span>
                                </div>
                                <i data-lucide="copy"
                                    class="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0"></i>
                            </div>

                            <div id="apiAccessContainer" class="w-full transition-all duration-300">
                            </div>
                        </div>

                        <div
                            class="w-full bg-slate-100 md:bg-white dark:bg-black/50 md:dark:bg-[#09090b] border border-slate-200 dark:border-white/10 rounded-xl p-4 md:p-5 mb-6 md:mb-8 text-left shadow-sm">
                            <p class="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">
                                Estado de Suscripción</p>
                            <div class="flex justify-between items-center mb-3">
                                <span id="accountPlanName"
                                    class="text-sm md:text-base font-extrabold text-slate-800 dark:text-white">Plan
                                    Esencial</span>
                                <span id="accountPlanStatus"
                                    class="text-[10px] font-black bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-md uppercase tracking-wider border border-green-500/20">Activo</span>
                            </div>
                            <div id="apiBonusLine"
                                class="pt-3 border-t border-slate-200 dark:border-white/5 flex justify-between items-center">
                                <span class="text-xs font-bold text-slate-600 dark:text-gray-400">
                                    <i id="apiBonusIcon" data-lucide="zap" class="w-3 h-3 inline-block text-primary-500 mb-0.5"></i> 
                                    <span id="apiBonusLabel">Créditos de Compresión:</span>
                                </span>
                                <span id="apiCreditsDisplay" class="text-sm font-black text-primary-500">0</span>
                            </div>
                        </div>

                        <div class="w-full flex flex-col gap-3 md:gap-4">
                            <button onclick="openSettingsModal()"
                                class="w-full bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-white border border-slate-200 dark:border-white/10 px-5 py-3.5 md:py-4 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95">
                                <i data-lucide="settings" class="w-4 h-4"></i> Ajustes de Cuenta
                            </button>

                            <button onclick="openLogoutModal()"
                                class="w-full bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-500 border border-red-500/20 px-5 py-3.5 md:py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-95">
                                <i data-lucide="log-out" class="w-4 h-4"></i> Cerrar Sesión
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <div id="logoutModal" class="fixed inset-0 z-[150] hidden items-center justify-center px-0 md:px-4">
        <div id="logoutOverlay" onclick="closeLogoutModal()"
            class="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer transition-opacity"></div>
        <div class="bento-card relative z-10 w-full max-w-md h-[100dvh] max-h-[100dvh] md:h-auto md:max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col justify-center md:justify-start shadow-[0_0_50px_rgba(239,68,68,0.1)] border-none md:border md:border-red-500/30 hover:md:!border-red-500/60 hover:!shadow-[0_0_30px_rgba(239,68,68,0.3)] transform transition-all scale-95 opacity-0 p-8 text-center rounded-none md:rounded-3xl"
            id="logoutContent">

            <div class="w-16 h-16 mx-auto bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6 text-red-500 shadow-sm">
                <i data-lucide="log-out" class="w-8 h-8"></i>
            </div>

            <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">¿Deseas salir?</h2>
            <p class="text-slate-500 dark:text-gray-400 text-sm mb-8 font-medium leading-relaxed px-2">
                Tu sesión se cerrará de forma segura. Tendrás que volver a entrar para acceder a tus herramientas PRO.
            </p>

            <div class="flex flex-col gap-3">
                <button onclick="logoutUsuario()"
                    class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-extrabold py-4 rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2">
                    Cerrar Sesión
                </button>
                <button onclick="closeLogoutModal()"
                    class="w-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-gray-400 font-bold py-3 rounded-xl transition-all active:scale-95">
                    Cancelar
                </button>
            </div>
        </div>
    </div>

    <div id="settingsModal" class="fixed inset-0 z-[135] hidden items-center justify-center px-0 md:px-4">
        <div id="settingsOverlay" onclick="closeSettingsModal()"
            class="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer transition-opacity"></div>

        <div class="bento-card relative z-10 w-full max-w-md h-[100dvh] max-h-[100dvh] md:h-auto md:max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col justify-center md:justify-start shadow-2xl border-none md:border md:border-slate-200 dark:md:border-white/10 transform transition-all scale-95 opacity-0 p-8 rounded-none md:rounded-3xl"
            id="settingsContent">

            <button onclick="closeSettingsModal()"
                class="absolute top-4 right-4 text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 p-2 rounded-lg transition-colors z-50">
                <i data-lucide="arrow-left" class="w-6 h-6"></i>
            </button>

            <h2 class="text-xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <div
                    class="bg-slate-100 dark:bg-white/5 p-2 rounded-xl text-slate-600 dark:text-gray-300 shadow-sm border border-slate-200 dark:border-white/5">
                    <i data-lucide="settings" class="w-5 h-5"></i>
                </div>
                Ajustes de Seguridad
            </h2>

            <div class="space-y-6">
                <div>
                    <label class="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2 block">Cuenta
                        vinculada</label>
                    <div
                        class="bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl p-4 flex items-center gap-3">
                        <i data-lucide="mail" class="w-5 h-5 text-primary-500"></i>
                        <span id="settingsEmailDisplay"
                            class="text-sm font-bold text-slate-700 dark:text-white truncate">usuario@ejemplo.com</span>
                    </div>
                </div>

                <button onclick="solicitarCambioPassword(this)"
                    class="w-full bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-white border border-slate-200 dark:border-white/10 px-5 py-4 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-between group active:scale-95">
                    <div class="flex items-center gap-3">
                        <i data-lucide="key-round"
                            class="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors"></i>
                        <span>Cambiar Contraseña</span>
                    </div>
                    <i data-lucide="chevron-right"
                        class="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform"></i>
                </button>

                <div class="h-[1px] w-full bg-slate-200 dark:bg-white/5 my-2"></div>

                <div class="pt-2">
                    <button onclick="openDeleteAccountModal()"
    class="w-full text-[11px] font-bold text-red-400 hover:text-red-600 flex items-center justify-center gap-2 transition-colors opacity-70 hover:opacity-100 p-2">
    <i data-lucide="trash-2" class="w-4 h-4"></i> Eliminar mi cuenta y todos mis datos
</button>
                    <p class="text-center text-[9px] text-gray-500 mt-2 px-4 leading-tight">
                        De acuerdo con las leyes <b>GDPR</b> y <b>CCPA</b>, esto borrará permanentemente toda tu
                        información y metadatos de nuestros servidores.
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div id="feedbackModal" class="fixed inset-0 z-[130] hidden items-center justify-center px-0 md:px-4">
        <div id="feedbackOverlay"
            class="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity cursor-pointer"></div>
        <div class="bento-card relative z-10 w-full max-w-md h-[100dvh] max-h-[100dvh] md:h-auto md:max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col justify-center md:justify-start p-8 shadow-[0_0_50px_rgba(139,92,246,0.15)] border-none md:border md:border-primary-500/30 transform transition-all scale-95 opacity-0 text-center rounded-none md:rounded-3xl"
            id="feedbackContent">

            <button onclick="closeFeedbackModal()"
                class="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors z-50">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>

            <div
                class="w-16 h-16 mx-auto bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(139,92,246,0.4)]">
                <i data-lucide="lightbulb" class="w-8 h-8 text-white"></i>
            </div>

            <h2 data-i18n="feedback_title"
                class="text-2xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">Centro de Ideas
            </h2>
            <p data-i18n="feedback_sub"
                class="text-slate-500 dark:text-gray-400 font-medium text-sm mb-8 leading-relaxed px-2">
                Ayúdanos a mejorar Compressly compartiendo tus sugerencias o reportando fallos. Tus ideas son
                nuestra
                hoja de ruta.
            </p>

            <form id="feedbackForm" class="flex flex-col gap-4 text-left relative z-20">
                <div>
                    <label data-i18n="feedback_label_type"
                        class="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 block">Tipo
                        de
                        mensaje</label>

                    <div id="feedbackSelectContainer"
                        class="bg-slate-100 dark:bg-black/50 p-2 rounded-xl border border-slate-200 dark:border-white/10 transition-all duration-300 relative group cursor-pointer h-[48px] flex items-center">
                        <select id="feedbackType" class="hidden">
                            <option value="sugerencia">Sugerencia</option>
                            <option value="error">Error / Bug</option>
                            <option value="duda">Duda Técnica</option>
                        </select>
                        <div id="feedbackSelectTrigger" class="flex items-center justify-between px-2 w-full">
                            <div class="flex items-center gap-2">
                                <i data-lucide="tag" class="w-4 h-4 text-slate-400 shrink-0"></i>
                                <span id="feedbackSelectLabel"
                                    class="text-sm font-bold text-slate-700 dark:text-gray-300 truncate">
                                    <span class="hidden sm:inline" data-i18n="feedback_opt_sug_long">Tengo una idea
                                        /
                                        Sugerencia</span><span class="sm:hidden"
                                        data-i18n="feedback_opt_sug_short">Sugerencia</span>
                                </span>
                            </div>
                            <i data-lucide="chevron-down" id="feedbackSelectArrow"
                                class="w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0"></i>
                        </div>
                        <div id="feedbackSelectDropdown"
                            class="absolute left-0 top-[110%] w-full bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-[70] opacity-0 invisible translate-y-[-10px] transition-all duration-300 overflow-hidden">
                            <div class="flex flex-col p-1.5 gap-1">
                                <div class="custom-option selected flex items-center gap-2" data-value="sugerencia">
                                    <i data-lucide="lightbulb" class="w-4 h-4 shrink-0"></i>
                                    <div class="option-text truncate"><span class="hidden sm:inline"
                                            data-i18n="feedback_opt_sug_long">Tengo una idea /
                                            Sugerencia</span><span class="sm:hidden"
                                            data-i18n="feedback_opt_sug_short">Sugerencia</span></div>
                                </div>
                                <div class="custom-option flex items-center gap-2" data-value="error">
                                    <i data-lucide="bug" class="w-4 h-4 shrink-0"></i>
                                    <div class="option-text truncate"><span class="hidden sm:inline"
                                            data-i18n="feedback_opt_bug_long">Encontré un error (Bug)</span><span
                                            class="sm:hidden" data-i18n="feedback_opt_bug_short">Error (Bug)</span>
                                    </div>
                                </div>
                                <div class="custom-option flex items-center gap-2" data-value="duda">
                                    <i data-lucide="help-circle" class="w-4 h-4 shrink-0"></i>
                                    <div class="option-text truncate"><span class="hidden sm:inline"
                                            data-i18n="feedback_opt_help_long">Tengo una duda técnica</span><span
                                            class="sm:hidden" data-i18n="feedback_opt_help_short">Duda
                                            técnica</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label data-i18n="feedback_label_msg"
                        class="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 block">Tu
                        mensaje</label>
                    <textarea id="feedbackText" rows="4" placeholder="..."
                        class="w-full bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-white focus:outline-none focus:border-primary-500 transition-colors resize-none placeholder-gray-500"
                        required></textarea>
                </div>

                <button type="submit"
                    class="w-full bg-gradient-to-r from-primary-500 to-purple-600 hover:scale-[1.02] active:scale-95 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-[0_10px_20px_rgba(139,92,246,0.3)] flex items-center justify-center gap-2 mt-2">
                    <i data-lucide="rocket" class="w-5 h-5"></i> <span data-i18n="feedback_btn_send">Enviar a
                        Compressly</span>
                </button>
            </form>
        </div>
    </div>

    <div id="vipSplashOverlay"
        class="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#050508] transition-all duration-1000 opacity-0 pointer-events-none overflow-hidden">

        <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-600/20 via-transparent to-transparent opacity-60">
        </div>

        <div class="relative w-32 h-32 mb-10 group">
            <div class="absolute inset-0 bg-violet-500 rounded-full blur-[60px] opacity-50 animate-pulse"></div>

            <div
                class="relative flex items-center justify-center w-full h-full bg-white/5 border border-white/10 rounded-[2.5rem] shadow-[0_0_40px_rgba(139,92,246,0.2)] backdrop-blur-3xl overflow-hidden bento-card">
                <div
                    class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-45 translate-x-[-100%] animate-[shimmer_3s_infinite]">
                </div>

                <div id="vipSplashIconContainer" class="relative z-10">
                    <i data-lucide="zap"
                        class="w-16 h-16 text-violet-400 drop-shadow-[0_0_20px_rgba(167,139,250,0.9)]"></i>
                </div>
            </div>
        </div>

        <h2 id="vipSplashGreeting"
            class="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 text-center px-4 bg-clip-text text-transparent bg-gradient-to-b from-white via-violet-100 to-violet-400/50">
            Iniciando Compressly...
        </h2>

        <div
            class="flex items-center gap-4 text-violet-100 font-bold bg-white/5 px-10 py-4 rounded-full border border-white/10 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] bento-card">
            <div id="vipSplashLoader">
                <div class="w-5 h-5 border-2 border-violet-500/30 border-t-violet-400 rounded-full animate-spin"></div>
            </div>
            <span id="vipSplashStatus"
                class="text-[11px] tracking-[0.4em] uppercase font-black drop-shadow-sm">Verificando
                Credenciales</span>
        </div>
    </div>

    <div id="deleteAccountModal" class="fixed inset-0 z-[200] hidden items-center justify-center px-0 md:px-4">
        <div class="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity cursor-pointer" onclick="closeDeleteAccountModal()"></div>
        <div class="bento-card relative z-10 w-full max-w-md h-[100dvh] max-h-[100dvh] md:h-auto md:max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col justify-center md:justify-start shadow-[0_0_50px_rgba(239,68,68,0.2)] border-none md:border md:border-red-500/40 p-8 text-center transform transition-all scale-95 opacity-0 rounded-none md:rounded-3xl" id="deleteAccountContent">
            
            <div class="w-20 h-20 mx-auto bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mb-6 text-red-500">
                <i data-lucide="alert-triangle" class="w-10 h-10 animate-pulse"></i>
            </div>

            <h2 class="text-2xl font-black text-white mb-3">¿Borrar todo permanentemente?</h2>
            <p class="text-gray-400 text-sm mb-8 leading-relaxed">
                Esta acción es <b>irreversible</b>. Perderás tu suscripción, tus créditos de IA y tu historial de ahorro. No podrás recuperar tu cuenta una vez confirmes.
            </p>

            <div class="flex flex-col gap-3">
                <div class="flex items-center justify-center gap-3 mb-2 bg-black/20 py-2 rounded-xl border border-white/5">
                    <span id="lockText" class="text-xs text-gray-500 font-black uppercase tracking-widest">Seguro Activado</span>
                    <button id="unlockDeleteBtn" onclick="toggleDeleteLock()" class="bg-slate-800 text-gray-400 hover:text-white p-2.5 rounded-xl transition-all ring-1 ring-white/10 hover:ring-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                        <i id="lockIcon" data-lucide="lock" class="w-4 h-4"></i>
                    </button>
                </div>

                <button id="confirmDeleteBtn" onclick="ejecutarBorradoTotal()" disabled
                    class="w-full bg-slate-800 text-gray-600 cursor-not-allowed font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 border border-white/5">
                    <i data-lucide="trash-2" class="w-5 h-5"></i> CONFIRMAR ELIMINACIÓN
                </button>
                <button onclick="closeDeleteAccountModal()"
                    class="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-bold py-3 rounded-xl transition-all">
                    Cancelar y volver
                </button>
            </div>
            <p class="mt-6 text-[9px] text-gray-600 uppercase tracking-widest font-black">Cumplimiento Estricto GDPR / CCPA</p>
        </div>
    </div>

    <div id="resetPasswordModal" class="fixed inset-0 z-[150] hidden items-center justify-center px-0 md:px-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
        <div class="bento-card relative z-10 w-full max-w-md h-[100dvh] max-h-[100dvh] md:h-auto md:max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col justify-center md:justify-start p-8 text-center shadow-2xl border-none md:border md:border-primary-500/30 rounded-none md:rounded-3xl">
            <div class="w-16 h-16 mx-auto bg-primary-500/20 rounded-full flex items-center justify-center mb-6 text-primary-400">
                <i data-lucide="shield-check" class="w-8 h-8"></i>
            </div>
            <h2 class="text-2xl font-extrabold text-white mb-2">Nueva Contraseña</h2>
            <p class="text-gray-400 text-sm mb-6">Escribe tu nueva clave de acceso para <b>Compressly</b>.</p>
            
            <form id="resetPasswordForm" class="space-y-4" onsubmit="actualizarPasswordFinal(event)">
                <input type="password" id="newPasswordInput" required placeholder="Mínimo 6 caracteres" minlength="6"
                    class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors font-bold text-sm">
                <button type="submit" id="btnUpdatePass"
                    class="w-full bg-primary-500 hover:bg-primary-600 text-white font-black py-3.5 rounded-xl transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2">
                    <i data-lucide="save" class="w-5 h-5"></i> Guardar Cambios
                </button>
            </form>
        </div>
    </div>
`;

// ⚡ CÓDIGO CORREGIDO PARA EL FINAL DEL ARCHIVO:
// Inyectamos el HTML de forma INSTANTÁNEA (Sin setTimeout)
document.body.insertAdjacentHTML('beforeend', htmlModales);

// Refrescamos los iconos de Lucide inmediatamente
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

console.log("⚡ Modales inyectados dinámicamente al instante.");