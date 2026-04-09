// notificaciones.js
const Notify = {
    container: null,

    init() {
        // Crea el contenedor invisible si no existe
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            // Lo posicionamos arriba a la derecha, por encima de todo (z-[200])
            this.container.className = 'fixed top-24 right-4 sm:top-5 sm:right-5 z-[200] flex flex-col gap-3 pointer-events-none';
            document.body.appendChild(this.container);
        }
    },

    show(title, message, type = 'success') {
        this.init();

        // Configuraciones de colores e iconos SVG de alta resolución según el tipo de alerta
        const types = {
            success: {
                border: 'border-green-500/30 dark:border-green-400/20',
                bgIcon: 'bg-green-500/20 text-green-600 dark:text-green-400',
                icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
            },
            error: {
                border: 'border-red-500/30 dark:border-red-400/20',
                bgIcon: 'bg-red-500/20 text-red-600 dark:text-red-400',
                icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
            },
            info: {
                border: 'border-primary-500/30 dark:border-primary-400/20',
                bgIcon: 'bg-primary-500/20 text-primary-600 dark:text-primary-400',
                icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
            }
        };

        const config = types[type];

        // Crear la tarjeta visual
        const toast = document.createElement('div');
        // Clases Tailwind para efecto Glassmorphism y animación
        toast.className = `flex items-start gap-4 p-4 w-[calc(100vw-2rem)] sm:w-80 bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-xl border ${config.border} shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl transform translate-x-[120%] opacity-0 transition-all duration-500 ease-out pointer-events-auto`;

        toast.innerHTML = `
            <div class="flex-shrink-0 ${config.bgIcon} p-2 rounded-xl shadow-inner">
                ${config.icon}
            </div>
            <div class="flex-1 pt-0.5">
                <h4 class="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">${title}</h4>
                <p class="text-xs font-medium text-slate-500 dark:text-gray-400 mt-1 leading-relaxed">${message}</p>
            </div>
            <button class="flex-shrink-0 text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors p-1" onclick="this.parentElement.style.opacity='0'; setTimeout(() => this.parentElement.remove(), 500);">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        `;

        this.container.appendChild(toast);

        // Desatar la animación de entrada
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.classList.remove('translate-x-[120%]', 'opacity-0');
                toast.classList.add('translate-x-0', 'opacity-100');
            });
        });

        // Desatar animación de salida y destruir después de 4 segundos
        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.remove('translate-x-0', 'opacity-100');
                toast.classList.add('translate-x-[120%]', 'opacity-0');
                setTimeout(() => {
                    if (toast.parentElement) toast.remove();
                }, 500); // Tiempo que dura la animación CSS
            }
        }, 4000);
    }
};