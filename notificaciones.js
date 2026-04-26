// notificaciones.js
const Notify = {
    container: null,

    init() {
        // Crea el contenedor invisible si no existe
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            // 💎 NUEVO: Centrado en móvil, alineado a la derecha en PC. Z-index muy alto.
            this.container.className = 'fixed top-4 left-0 right-0 sm:left-auto sm:right-6 z-[300] flex flex-col items-center sm:items-end gap-3 pointer-events-none px-4 sm:px-0';
            document.body.appendChild(this.container);
        }
    },

    show(title, message, type = 'success') {
        this.init();

        // 💎 NUEVO: Iconos con gradientes sólidos y sombras tipo "Glow" adaptativas
        const types = {
            success: {
                glow: 'shadow-[0_10px_40px_rgba(34,197,94,0.25)]',
                bgIcon: 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg text-white',
                icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>`
            },
            error: {
                glow: 'shadow-[0_10px_40px_rgba(239,68,68,0.25)]',
                bgIcon: 'bg-gradient-to-br from-red-400 to-red-600 shadow-lg text-white',
                icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`
            },
            info: {
                glow: 'shadow-[0_10px_40px_rgba(139,92,246,0.25)]', // Púrpura Compressly
                bgIcon: 'bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg text-white',
                icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
            },
            warning: {
                glow: 'shadow-[0_10px_40px_rgba(234,179,8,0.25)]',
                bgIcon: 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg text-white',
                icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`
            }
        };

        const config = types[type] || types['info'];

        // Crear la tarjeta visual
        const toast = document.createElement('div');
        // 💎 NUEVO: Bordes invisibles, fondo blur premium y animación "Pop-in"
        toast.className = `flex items-center gap-4 p-4 w-full sm:w-96 bg-white/80 dark:bg-black/60 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 ${config.glow} rounded-2xl transform scale-95 opacity-0 -translate-y-4 transition-all duration-400 ease-out pointer-events-auto`;

        toast.innerHTML = `
            <div class="flex-shrink-0 ${config.bgIcon} w-10 h-10 flex items-center justify-center rounded-xl">
                ${config.icon}
            </div>
            <div class="flex-1">
                <h4 class="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">${title}</h4>
                <p class="text-xs font-bold text-slate-500 dark:text-gray-400 mt-1.5 leading-tight">${message}</p>
            </div>
            <button class="flex-shrink-0 text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10" onclick="this.parentElement.classList.remove('scale-100', 'opacity-100', 'translate-y-0'); this.parentElement.classList.add('scale-95', 'opacity-0', '-translate-y-4'); setTimeout(() => this.parentElement.remove(), 400);">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        `;

        this.container.appendChild(toast);

        // Desatar la animación de entrada (Pop-in)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.classList.remove('scale-95', 'opacity-0', '-translate-y-4');
                toast.classList.add('scale-100', 'opacity-100', 'translate-y-0');
            });
        });

        // Desatar animación de salida
        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.remove('scale-100', 'opacity-100', 'translate-y-0');
                toast.classList.add('scale-95', 'opacity-0', '-translate-y-4');
                setTimeout(() => {
                    if (toast.parentElement) toast.remove();
                }, 400); // Tiempo exacto de la transición Tailwind
            }
        }, 4000);
    }
};