// ⚖️ ==========================================
// LÓGICA DEL MODAL LEGAL (Términos y Privacidad)
// ==========================================
const legalModal = document.getElementById('legalModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

const btnTerminos = document.getElementById('btnTerminos');
const btnPrivacidad = document.getElementById('btnPrivacidad');
const btnPrivacidadCard = document.getElementById('btnPrivacidadCard');

// 🟢 CÓDIGO NUEVO:
function openModal(titleKey, contentKey) {
    modalTitle.innerHTML = `<i data-lucide="shield" class="w-6 h-6 text-primary-400"></i> ${translations[currentLanguage][titleKey]}`;
    modalBody.innerHTML = translations[currentLanguage][contentKey];

    legalModal.classList.remove('hidden');
    legalModal.classList.add('flex');

    // 🛡️ TRUCO ANTI-GOLPE VISUAL: Calculamos el ancho de la barra y lo damos como padding
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = 'hidden'; // 🚀 Bloquear Scroll del Fondo

    // 🤖 Ocultar bot en TODAS las pantallas (Exactamente igual que Centro de Ideas)
    const botBtn = document.getElementById('aiToggler');
    if (botBtn) botBtn.style.display = 'none';

    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);

    lucide.createIcons();
    if (navigator.vibrate) navigator.vibrate([50, 50]);
}

function closeModal() {
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        legalModal.classList.add('hidden');
        legalModal.classList.remove('flex');

        // 🔓 Restaurar Scroll y quitar el padding anti-salto
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        // 🤖 Mostrar bot nuevamente en TODAS las pantallas
        const botBtn = document.getElementById('aiToggler');
        if (botBtn) botBtn.style.display = '';
    }, 200);
    if (navigator.vibrate) navigator.vibrate(20);
}

if (btnPrivacidad) btnPrivacidad.addEventListener('click', (e) => { e.preventDefault(); openModal('legal_privacy_title', 'legal_privacy_body'); });
if (btnTerminos) btnTerminos.addEventListener('click', (e) => { e.preventDefault(); openModal('legal_terms_title', 'legal_terms_body'); });
if (btnPrivacidadCard) btnPrivacidadCard.addEventListener('click', (e) => { e.preventDefault(); openModal('legal_privacy_title', 'legal_privacy_body'); });
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);


// 👑 ==========================================
// LÓGICA DEL MURO DE PAGO (PREMIUM MODAL)
// ==========================================
const premiumModal = document.getElementById('premiumModal');
const premiumOverlay = document.getElementById('premiumOverlay');
const premiumContent = document.getElementById('premiumContent');
const closePremiumBtn = document.getElementById('closePremiumBtn');

window.openPremiumModal = function (force = false) {
    if (isPremiumUser && !force) return;

    premiumModal.classList.remove('hidden');
    premiumModal.classList.add('flex');
    document.body.style.overflow = 'hidden'; // 🚀 Bloquear Scroll del Fondo

    // 🚀 Autocompletar correo si ya inició sesión (Editable)
    const emailElement = document.getElementById('userEmailDisplay');
    const emailInput = premiumModal.querySelector('input[type="email"]');
    if (emailElement && emailElement.innerText !== 'usuario@ejemplo.com' && emailInput) {
        emailInput.value = emailElement.innerText;
    }

    // 🚀 Ocultar bot en TODAS las pantallas (PC y Móvil)
    const botBtn = document.getElementById('aiToggler');
    if (botBtn) botBtn.style.display = 'none';

    setTimeout(() => {
        premiumContent.classList.remove('scale-95', 'opacity-0');
        premiumContent.classList.add('scale-100', 'opacity-100');
    }, 10);

    lucide.createIcons();
    if (navigator.vibrate) navigator.vibrate([50, 50]);
};

window.closePremiumModal = function () {
    premiumContent.classList.remove('scale-100', 'opacity-100');
    premiumContent.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        premiumModal.classList.add('hidden');
        premiumModal.classList.remove('flex');
        document.body.style.overflow = ''; // 🚀 Restaurar Scroll

        // 🚀 Mostrar bot nuevamente al cerrar en TODAS las pantallas
        const botBtn = document.getElementById('aiToggler');
        if (botBtn) botBtn.style.display = '';
    }, 200);
    if (navigator.vibrate) navigator.vibrate(20);
};

if (closePremiumBtn) closePremiumBtn.addEventListener('click', closePremiumModal);
if (premiumOverlay) premiumOverlay.addEventListener('click', closePremiumModal);

document.getElementById('btnGoPro')?.addEventListener('click', () => openPremiumModal(true));
document.getElementById('btnGoProMobile')?.addEventListener('click', () => {
    if (typeof toggleMobileMenu === 'function') toggleMobileMenu(); // 🚀 Resetea iconos y cierra
    openPremiumModal(true);
});

['btnAvifLock', 'watermarkLock', 'folderOrgLock'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); openPremiumModal(); });
});


// 👤 ==========================================
// LÓGICA DEL PERFIL HÍBRIDO Y AUTENTICACIÓN
// ==========================================
const profileModal = document.getElementById('profileModal');
const profileOverlay = document.getElementById('profileOverlay');
const profileContent = document.getElementById('profileContent');
const closeProfileBtn = document.getElementById('closeProfileBtn');

window.openProfileModal = function () {
    const modal = document.getElementById('profileModal');
    const content = document.getElementById('profileContent');

    if (modal && content) {
        // 🔄 RESETEO CRÍTICO
        content.style.opacity = '1';
        content.style.transform = 'scale(1)';

        modal.classList.remove('hidden');
        modal.classList.add('flex');

        // 🚀 BLOQUEO MANUAL RESTAURADO (Corrección de error)
        document.body.style.overflow = 'hidden';

        // 🤖 OCULTAR CHATBOT
        const botBtn = document.getElementById('aiToggler');
        if (botBtn) botBtn.style.display = 'none';

        // 🚀 LLAMADA MAESTRA: Cargamos el historial y estadísticas desde Supabase
        if (typeof cargarHistorialPerfil === 'function') {
            cargarHistorialPerfil();
        }

        lucide.createIcons();
        if (navigator.vibrate) navigator.vibrate([50, 50]);
    }
};

window.closeProfileModal = function () {
    profileContent.classList.remove('scale-100', 'opacity-100');
    profileContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        profileModal.classList.add('hidden');
        profileModal.classList.remove('flex');

        // 🔓 RESTAURACIÓN TOTAL (Doble liberación para evitar bloqueos)
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';

        // 🚀 Mostrar bot nuevamente al cerrar en TODAS las pantallas
        const botBtn = document.getElementById('aiToggler');
        if (botBtn) botBtn.style.display = '';
    }, 200);
    if (navigator.vibrate) navigator.vibrate(20);
};

if (closeProfileBtn) closeProfileBtn.addEventListener('click', closeProfileModal);
if (profileOverlay) profileOverlay.addEventListener('click', closeProfileModal);

document.getElementById('btnProfileDesktop')?.addEventListener('click', openProfileModal);
document.getElementById('btnProfileMobile')?.addEventListener('click', () => {
    if (typeof toggleMobileMenu === 'function') toggleMobileMenu(); // 🚀 Resetea iconos y cierra
    openProfileModal();
});

const togglePasswordBtn = document.getElementById('togglePasswordBtn');
const authPassword = document.getElementById('authPassword');
if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
        if (authPassword.type === 'password') {
            authPassword.type = 'text';
            // 🚀 Ahora se ve la contraseña = Ojito abierto
            togglePasswordBtn.innerHTML = '<i data-lucide="eye" class="w-4 h-4"></i>';
        } else {
            authPassword.type = 'password';
            // 🚀 Contraseña oculta = Ojito con rayita
            togglePasswordBtn.innerHTML = '<i data-lucide="eye-off" class="w-4 h-4"></i>';
        }
        lucide.createIcons();
    });
}


// 🏆 ==========================================
// SISTEMA DE GAMIFICACIÓN (IMPACTO GLOBAL)
// ==========================================
let totalSavedBytes = parseInt(localStorage.getItem('compressly_total_saved')) || 0;

function formatBytesGamification(bytes) {
    if (bytes === 0) return '0 MB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

window.updateGlobalImpact = function (newSavedBytes = 0) {
    if (newSavedBytes > 0) {
        totalSavedBytes += newSavedBytes;
        localStorage.setItem('compressly_total_saved', totalSavedBytes);
    }

    const formatted = formatBytesGamification(totalSavedBytes);
    const desktopBadge = document.getElementById('globalImpactDesktop');
    const mobileBadge = document.getElementById('globalImpactMobile');
    const desktopText = document.getElementById('totalSavedDesktop');
    const mobileText = document.getElementById('totalSavedMobile');

    if (totalSavedBytes > 0) {
        if (desktopBadge) { desktopBadge.classList.remove('hidden'); desktopBadge.classList.add('flex'); }
        if (mobileBadge) { mobileBadge.classList.remove('hidden'); mobileBadge.classList.add('flex'); }

        if (desktopText) desktopText.innerText = formatted;
        if (mobileText) mobileText.innerText = formatted;

        // 🚀 MEJORA: Animación para AMBOS (PC y Móvil)
        if (newSavedBytes > 0) {
            [desktopBadge, mobileBadge].forEach(badge => {
                if (badge) {
                    badge.classList.add('scale-110', 'bg-green-500/30', 'border-green-400', 'shadow-[0_0_15px_rgba(34,197,94,0.4)]');
                    setTimeout(() => {
                        badge.classList.remove('scale-110', 'bg-green-500/30', 'border-green-400', 'shadow-[0_0_15px_rgba(34,197,94,0.4)]');
                    }, 400);
                }
            });
        }
    }
};

updateGlobalImpact(0);

// 💡 ==========================================
// LÓGICA DEL CENTRO DE IDEAS (FEEDBACK)
// ==========================================
const feedbackModal = document.getElementById('feedbackModal');
const feedbackOverlay = document.getElementById('feedbackOverlay');
const feedbackContent = document.getElementById('feedbackContent');

// Elementos del selector personalizado de Feedback
const feedbackSelectContainer = document.getElementById('feedbackSelectContainer');
const feedbackSelectTrigger = document.getElementById('feedbackSelectTrigger');
const feedbackSelectDropdown = document.getElementById('feedbackSelectDropdown');
const feedbackSelectLabel = document.getElementById('feedbackSelectLabel');
const feedbackSelectArrow = document.getElementById('feedbackSelectArrow');
const feedbackTypeHidden = document.getElementById('feedbackType');

window.openFeedbackModal = function (fromTickets = false) {
    // 🧠 Guardamos en la memoria global si venimos de la ventana de reportes
    window.returnToTickets = fromTickets === true;

    feedbackModal.classList.remove('hidden');
    feedbackModal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    // 🚀 Ocultar bot en TODAS las pantallas (Misma lógica que el PRO)
    const botBtn = document.getElementById('aiToggler');
    if (botBtn) botBtn.style.display = 'none';

    setTimeout(() => {
        feedbackContent.classList.remove('scale-95', 'opacity-0');
        feedbackContent.classList.add('scale-100', 'opacity-100');
    }, 10);

    if (typeof lucide !== 'undefined') lucide.createIcons();
    if (navigator.vibrate) navigator.vibrate([50, 50]);
};

window.closeFeedbackModal = function () {
    // Cerrar el dropdown si estaba abierto al cerrar el modal
    const feedbackSelectDropdown = document.getElementById('feedbackSelectDropdown');
    const feedbackSelectArrow = document.getElementById('feedbackSelectArrow');

    if (feedbackSelectDropdown) feedbackSelectDropdown.classList.remove('custom-select-dropdown-open');
    if (feedbackSelectArrow) feedbackSelectArrow.classList.remove('custom-select-arrow-open');

    const modal = document.getElementById('feedbackModal');
    const content = document.getElementById('feedbackContent');

    if (modal && content) {
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');

            // 🔙 LÓGICA DE RETORNO INTELIGENTE 2.0
            if (window.returnToTickets) {
                // 1. Si veníamos de los Reportes, lo volvemos a abrir automáticamente
                window.returnToTickets = false; // Limpiamos la memoria
                if (typeof openTicketsModal === 'function') openTicketsModal();
            } else {
                const profileModal = document.getElementById('profileModal');
                if (!profileModal || profileModal.classList.contains('hidden')) {
                    // 2. Si venimos desde el Footer, liberamos todo
                    document.body.style.overflow = '';
                    const botBtn = document.getElementById('aiToggler');
                    if (botBtn) botBtn.style.display = '';
                } else {
                    // 3. Por si acaso el perfil estaba de fondo
                    profileModal.classList.remove('opacity-0');
                    document.body.style.overflow = 'hidden';
                }
            }
        }, 200);
        if (navigator.vibrate) navigator.vibrate(20);
    }
};

// Manejo del selector personalizado
feedbackSelectContainer?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation(); // 🚀 ESCUDO 1: Evita que scripts externos detecten el clic aquí
    feedbackSelectDropdown.classList.toggle('custom-select-dropdown-open');
    feedbackSelectArrow.classList.toggle('custom-select-arrow-open');
});

feedbackSelectDropdown?.querySelectorAll('.custom-option').forEach(option => {
    option.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation(); // 🚀 ESCUDO 2: Bloquea definitivamente el modal PRO

        const val = option.getAttribute('data-value');

        // 🚀 NUEVO: Capturamos la estructura HTML para mantener el diseño responsive
        const textHtml = option.querySelector('.option-text').innerHTML;

        // Actualizar UI (Usamos innerHTML para no borrar las clases de Tailwind)
        feedbackSelectLabel.innerHTML = textHtml;
        feedbackTypeHidden.value = val;

        // Actualizar clases de selección
        feedbackSelectDropdown.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');

        // 🚀 MEJORA: Cerrar el menú automáticamente después de seleccionar la opción
        feedbackSelectDropdown.classList.remove('custom-select-dropdown-open');
        feedbackSelectArrow.classList.remove('custom-select-arrow-open');

        if (navigator.vibrate) navigator.vibrate(10);
    });
});

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', () => {
    feedbackSelectDropdown?.classList.remove('custom-select-dropdown-open');
    feedbackSelectArrow?.classList.remove('custom-select-arrow-open');
});

if (feedbackOverlay) feedbackOverlay.addEventListener('click', closeFeedbackModal);

// 🚀 CONEXIÓN ENTERPRISE: ENVÍO REAL DE FEEDBACK A SUPABASE
document.getElementById('feedbackForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Identificar al usuario y su correo
    const userIdDisplay = document.getElementById('userInternalIdDisplay');
    const userId = userIdDisplay ? userIdDisplay.getAttribute('data-uuid') : null;

    // Capturar correo del DOM
    const userEmailEl = document.getElementById('userEmailDisplay');
    const userEmail = (userEmailEl && userEmailEl.innerText !== 'usuario@ejemplo.com') ? userEmailEl.innerText : 'Desconocido';

    if (!userId || userId === '---' || typeof supabaseClient === 'undefined') {
        if (typeof Notify !== 'undefined') Notify.show('Inicia Sesión', 'Debes estar logueado para enviar sugerencias o reportes.', 'error');
        return;
    }

    // 2. Capturar los datos de TU diseño actual
    const texto = document.getElementById('feedbackText').value.trim();
    const tipo = document.getElementById('feedbackType').value || 'sugerencia';

    if (!texto) return;

    // 3. Efecto visual de "Enviando..." en tu botón
    const btn = e.target.querySelector('button[type="submit"]');
    const originalBtnHTML = btn.innerHTML; // Guardamos cómo se veía
    btn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> <span>Enviando a la nube...</span>';
    btn.disabled = true;
    btn.classList.add('opacity-80', 'cursor-not-allowed');
    if (typeof lucide !== 'undefined') lucide.createIcons();

    try {
        // ☁️ 4. INSERCIÓN EN BASE DE DATOS (Ahora incluye el correo)
        const { error } = await supabaseClient.from('feedback_usuarios').insert([
            {
                usuario_id: userId,
                usuario_email: userEmail,
                tipo_mensaje: tipo,
                mensaje_texto: texto
            }
        ]);

        if (error) throw error;

        // ✅ 5. ÉXITO
        if (typeof Notify !== 'undefined') {
            Notify.show('¡Mensaje Recibido!', 'Tu reporte ha sido enviado directamente a nuestro equipo.', 'success');
        }
        if (navigator.vibrate) navigator.vibrate([20, 30]);

        closeFeedbackModal();
        document.getElementById('feedbackText').value = ''; // Limpiar caja

    } catch (error) {
        console.error("Error enviando feedback:", error);
        if (typeof Notify !== 'undefined') Notify.show('Error', 'No pudimos enviar el mensaje. Revisa tu conexión.', 'error');
    } finally {
        // 🔄 6. RESTAURAR BOTÓN
        btn.innerHTML = originalBtnHTML;
        btn.disabled = false;
        btn.classList.remove('opacity-80', 'cursor-not-allowed');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
});

// 🚀 FUNCIONES DEL MODAL ULTRA
window.openUltraModal = function () {
    const modal = document.getElementById('ultraModal');
    const content = document.getElementById('ultraContent');

    if (modal && content) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden'; // 🚀 Bloqueo de scroll profesional

        // 🚀 Autocompletar correo si ya inició sesión (Editable)
        const emailElement = document.getElementById('userEmailDisplay');
        const emailInput = modal.querySelector('input[type="email"]');
        if (emailElement && emailElement.innerText !== 'usuario@ejemplo.com' && emailInput) {
            emailInput.value = emailElement.innerText;
        }

        // 🤖 OCULTAR CHATBOT IA
        const botBtn = document.getElementById('aiToggler');
        if (botBtn) botBtn.style.display = 'none';

        setTimeout(() => {
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);

        lucide.createIcons();
        if (navigator.vibrate) navigator.vibrate([50, 50]);
    }
};

window.closeUltraModal = function () {
    const modal = document.getElementById('ultraModal');
    const content = document.getElementById('ultraContent');

    if (modal && content) {
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = ''; // 🔓 Liberar scroll

            // 🤖 MOSTRAR CHATBOT IA
            const botBtn = document.getElementById('aiToggler');
            if (botBtn) botBtn.style.display = '';
        }, 200);
        if (navigator.vibrate) navigator.vibrate(20);
    }
};

// 🔋 FUNCIONES DEL MODAL DE RECARGA
window.openRechargeModal = function () {
    const modal = document.getElementById('rechargeModal');
    const content = document.getElementById('rechargeContent');

    if (modal && content) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');

        // 🔒 BLOQUEO TOTAL DE SCROLL (Body y HTML)
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        // 💡 TRUCO UX: Si el perfil está abierto detrás, lo ocultamos visualmente
        const profileModal = document.getElementById('profileModal');
        if (profileModal && !profileModal.classList.contains('hidden')) {
            profileModal.classList.add('opacity-0');
        }

        // 🤖 OCULTAR CHATBOT IA
        const botBtn = document.getElementById('aiToggler');
        if (botBtn) {
            botBtn.style.display = 'none';
            botBtn.classList.remove('show-bot');
        }

        setTimeout(() => {
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);

        if (typeof lucide !== 'undefined') lucide.createIcons();
        if (navigator.vibrate) navigator.vibrate([50, 50]);
    }
};

window.closeRechargeModal = function () {
    const modal = document.getElementById('rechargeModal');
    const content = document.getElementById('rechargeContent');

    if (modal && content) {
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');

            const profileModal = document.getElementById('profileModal');

            // 🔓 RESTAURAR SCROLL solo si el modal de perfil NO está en uso
            if (!profileModal || profileModal.classList.contains('hidden')) {
                document.body.style.overflow = '';
                document.documentElement.style.overflow = ''; // 🚀 ESTO LIBERA LA PÁGINA PRINCIPAL

                // 🤖 MOSTRAR CHATBOT IA
                const botBtn = document.getElementById('aiToggler');
                if (botBtn) botBtn.style.display = '';
            } else {
                // 💡 TRUCO UX: El perfil estaba abierto, lo volvemos a mostrar y mantenemos el bloqueo
                profileModal.classList.remove('opacity-0');
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';
            }
        }, 200);

        if (navigator.vibrate) navigator.vibrate(20);
    }
};

// ⚙️ ==========================================
// LÓGICA DEL MODAL DE AJUSTES Y SEGURIDAD
// ==========================================
window.openSettingsModal = function () {
    const modal = document.getElementById('settingsModal');
    const content = document.getElementById('settingsContent');
    const settingsEmailDisplay = document.getElementById('settingsEmailDisplay');
    const userEmailDisplay = document.getElementById('userEmailDisplay');

    if (modal && content) {
        // 🚀 Clonar el email para que sea exacto al del perfil
        if (settingsEmailDisplay && userEmailDisplay) {
            settingsEmailDisplay.innerText = userEmailDisplay.innerText;
        }

        // Mostrar el modal de Ajustes
        modal.classList.remove('hidden');
        modal.classList.add('flex');

        // 💡 Truco de UX: Ocultar visualmente el de perfil para que no se vea feo "encimado"
        const profileModal = document.getElementById('profileModal');
        if (profileModal) profileModal.classList.add('opacity-0');

        setTimeout(() => {
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);

        lucide.createIcons();
        if (navigator.vibrate) navigator.vibrate(20);
    }
};

window.closeSettingsModal = function () {
    const modal = document.getElementById('settingsModal');
    const content = document.getElementById('settingsContent');

    if (modal && content) {
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');

            // 💡 Truco de UX: Volver a mostrar el modal de perfil que estaba debajo
            const profileModal = document.getElementById('profileModal');
            if (profileModal) profileModal.classList.remove('opacity-0');
        }, 200);
        if (navigator.vibrate) navigator.vibrate(20);
    }
};


// 🟢 ANIMACIONES DEL MODAL DE API
window.openApiModal = function () {
    const modal = document.getElementById('apiModal');
    const content = document.getElementById('apiContent');

    if (modal && content) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';

        // 💡 TRUCO UX: Si el perfil está abierto detrás, lo ocultamos visualmente
        const profileModal = document.getElementById('profileModal');
        if (profileModal && !profileModal.classList.contains('hidden')) {
            profileModal.classList.add('opacity-0');
        }

        // Autocompletar correo
        const emailElement = document.getElementById('userEmailDisplay');
        const emailInput = modal.querySelector('input[type="email"]');
        if (emailElement && emailElement.innerText !== 'usuario@ejemplo.com' && emailInput) {
            emailInput.value = emailElement.innerText;
        }

        // 🤖 OCULTAR CHATBOT IA
        const botBtn = document.getElementById('aiToggler');
        if (botBtn) botBtn.style.display = 'none';

        setTimeout(() => {
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);

        lucide.createIcons();
        if (navigator.vibrate) navigator.vibrate([50, 50]);
    }
};

window.closeApiModal = function () {
    const modal = document.getElementById('apiModal');
    const content = document.getElementById('apiContent');

    if (modal && content) {
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');

            const profileModal = document.getElementById('profileModal');
            // 🔓 RESTAURAR SCROLL solo si el modal de perfil está realmente cerrado
            if (!profileModal || profileModal.classList.contains('hidden')) {
                document.body.style.overflow = '';

                // 🤖 MOSTRAR CHATBOT IA solo si volvemos a la landing
                const botBtn = document.getElementById('aiToggler');
                if (botBtn) botBtn.style.display = '';
            } else {
                // Si el perfil estaba abierto, le devolvemos su visibilidad
                profileModal.classList.remove('opacity-0');
            }
        }, 200);

        if (navigator.vibrate) navigator.vibrate(20);
    }
};

// 🚪 ==========================================
// LÓGICA DEL MODAL DE CIERRE DE SESIÓN
// ==========================================
window.openLogoutModal = function () {
    const modal = document.getElementById('logoutModal');
    const content = document.getElementById('logoutContent');

    if (modal && content) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');

        // 🚀 Ocultamos el modal de perfil por debajo para que el desenfoque sea limpio
        const profileModal = document.getElementById('profileModal');
        if (profileModal) profileModal.classList.add('opacity-0');

        setTimeout(() => {
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);

        lucide.createIcons();
        if (navigator.vibrate) navigator.vibrate(30);
    }
};

window.closeLogoutModal = function () {
    const modal = document.getElementById('logoutModal');
    const content = document.getElementById('logoutContent');

    if (modal && content) {
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');

            // 🔓 Restauramos visibilidad del perfil si el usuario canceló
            const profileModal = document.getElementById('profileModal');
            if (profileModal) profileModal.classList.remove('opacity-0');
        }, 200);
    }
};

// 🕒 ==========================================
// LÓGICA DEL MODAL DE ACTIVIDAD COMPLETA
// ==========================================
window.openActivityModal = async function () {
    const modal = document.getElementById('activityModal');
    const content = document.getElementById('activityContent');
    const list = document.getElementById('activityFullList');
    const userIdDisplay = document.getElementById('userInternalIdDisplay');
    const userId = userIdDisplay ? userIdDisplay.getAttribute('data-uuid') : null;

    if (!modal || !content || !list || !userId) return;

    // Mostrar modal con efecto
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Opcional: Opacar perfil de fondo para enfocar historial
    const profileModal = document.getElementById('profileModal');
    if (profileModal) profileModal.classList.add('opacity-0');

    // Estado de carga
    list.innerHTML = `<div class="flex flex-col items-center justify-center py-12 gap-3 text-primary-500 animate-pulse">
        <i data-lucide="loader-2" class="w-8 h-8 animate-spin"></i>
        <span class="text-xs font-black uppercase tracking-widest">Sincronizando...</span>
    </div>`;
    lucide.createIcons();

    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);

    try {
        // Consultar historial completo
        const { data: historial, error } = await supabaseClient.from('historial_uso')
            .select('*').eq('usuario_id', userId).order('fecha', { ascending: false });

        if (error) throw error;

        if (!historial || historial.length === 0) {
            list.innerHTML = `<div class="text-center py-12 text-gray-400 font-bold text-sm italic">No hay actividad registrada.</div>`;
        } else {
            list.innerHTML = historial.map(item => {
                // 🧠 Lógica para detectar el tipo de acción
                const isIA = item.tipo_accion === 'IA SEO';
                const isAPI = item.tipo_accion.toUpperCase().includes('API');

                // 🎨 Colores y Logos Dinámicos
                let iconColor = 'text-primary-500 bg-primary-500/10 border-primary-500/20'; // Por defecto Web (Tu color principal)
                let iconName = 'monitor';
                let badgeColor = 'text-primary-500 bg-primary-500/10';

                if (isIA) {
                    iconColor = 'text-purple-500 bg-purple-500/10 border-purple-500/20';
                    iconName = 'sparkles';
                    badgeColor = 'text-purple-500 bg-purple-500/10';
                } else if (isAPI) {
                    iconColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
                    iconName = 'webhook'; // Logo de enchufe/red para la API
                    badgeColor = 'text-emerald-500 bg-emerald-500/10';
                }

                const fecha = new Date(item.fecha);
                const fechaStr = fecha.toLocaleDateString() + ' ' + fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return `
                    <div class="flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/5 transition-all hover:border-primary-500/30">
                        <div class="w-10 h-10 rounded-xl ${iconColor} border flex items-center justify-center shrink-0 shadow-sm">
                            <i data-lucide="${iconName}" class="w-5 h-5"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex justify-between items-start mb-1 gap-2">
                                <span class="text-sm font-bold text-slate-900 dark:text-white truncate">${item.detalle}</span>
                                <span class="text-[9px] font-black ${badgeColor} px-2 py-0.5 rounded-md shrink-0 uppercase tracking-tighter">${item.tipo_accion}</span>
                            </div>
                            <span class="text-[11px] text-gray-500 font-medium flex items-center gap-1.5 leading-none">
                                <i data-lucide="calendar" class="w-3 h-3"></i> ${fechaStr}
                            </span>
                        </div>
                    </div>
                `;
            }).join('');
        }
        lucide.createIcons();
    } catch (e) {
        list.innerHTML = `<div class="text-red-500 text-center py-8 font-black">Error de conexión.</div>`;
    }

    if (navigator.vibrate) navigator.vibrate(30);
};

// 🗑️ FUNCIÓN MAESTRA: LIMPIAR HISTORIAL CON MODAL PROFESIONAL (CUSTOM)
window.limpiarHistorialActividad = function () {
    const userIdDisplay = document.getElementById('userInternalIdDisplay');
    const userId = userIdDisplay ? userIdDisplay.getAttribute('data-uuid') : null;

    if (!userId || userId === '---' || typeof supabaseClient === 'undefined') return;

    if (navigator.vibrate) navigator.vibrate(20);

    // 🎨 1. DIBUJAR EL MODAL PROFESIONAL DINÁMICO
    const overlay = document.createElement('div');
    overlay.id = 'customConfirmModal';
    overlay.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-indigo-950/30 backdrop-blur-sm p-4 opacity-0 transition-opacity duration-300';

    overlay.innerHTML = `
        <div class="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 w-full max-w-sm shadow-2xl transform scale-95 transition-transform duration-300 relative overflow-hidden">
            
            <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-500/20 blur-[50px] rounded-full pointer-events-none"></div>

            <div class="flex flex-col items-center text-center relative z-10">
                <div class="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
                    <i data-lucide="trash-2" class="w-8 h-8"></i>
                </div>
                
                <h3 class="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">¿Limpiar Historial?</h3>
                
                <p class="text-[13px] text-slate-500 dark:text-gray-400 mb-8 font-medium leading-relaxed">
                    Esta acción borrará el registro visual de tus actividades. <br>
                    <b class="text-slate-700 dark:text-gray-300">Tus estadísticas totales quedarán intactas.</b>
                </p>
                
                <div class="flex gap-3 w-full">
                    <button id="cancelConfirmBtn" class="flex-1 px-4 py-3.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white rounded-xl font-bold transition-all text-[13px] active:scale-95">
                        Cancelar
                    </button>
                    <button id="acceptConfirmBtn" class="flex-1 px-4 py-3.5 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 rounded-xl font-black transition-all active:scale-95 text-[13px] flex items-center justify-center gap-2">
                        <i data-lucide="trash-2" class="w-4 h-4"></i> Borrar Todo
                    </button>
                </div>
            </div>
        </div>
    `;

    // Lo inyectamos en la pantalla
    document.body.appendChild(overlay);
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // 🎬 2. ANIMACIÓN DE ENTRADA SUAVE
    requestAnimationFrame(() => {
        overlay.classList.remove('opacity-0');
        overlay.firstElementChild.classList.remove('scale-95');
    });

    // ❌ 3. LÓGICA DE CANCELACIÓN (Cerrar el modal)
    const closeOverlay = () => {
        overlay.classList.add('opacity-0');
        overlay.firstElementChild.classList.add('scale-95');
        setTimeout(() => overlay.remove(), 300); // Esperar que termine la animación
    };

    document.getElementById('cancelConfirmBtn').onclick = closeOverlay;
    overlay.onclick = (e) => { if (e.target === overlay) closeOverlay(); };

    // 💥 4. LÓGICA DE ELIMINACIÓN (Botón Rojo)
    document.getElementById('acceptConfirmBtn').onclick = async () => {
        // Efecto de carga
        const btn = document.getElementById('acceptConfirmBtn');
        btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Borrando...';
        btn.classList.add('opacity-80', 'pointer-events-none');
        if (typeof lucide !== 'undefined') lucide.createIcons();

        try {
            // Borrar de Supabase ☁️
            const { error } = await supabaseClient.from('historial_uso').delete().eq('usuario_id', userId);
            if (error) throw error;

            // Magia Visual: Pantalla en blanco
            document.getElementById('activityFullList').innerHTML = `
                <div class="flex flex-col items-center justify-center py-12 text-center">
                    <i data-lucide="inbox" class="w-16 h-16 text-slate-300 dark:text-white/10 mb-4"></i>
                    <h3 class="text-sm font-bold text-slate-700 dark:text-white mb-1">Historial Limpio</h3>
                    <p class="text-xs text-gray-500">Tus próximas acciones aparecerán aquí.</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            if (typeof Notify !== 'undefined') Notify.show('Historial Borrado', 'Tu registro de actividad está vacío.', 'success');
            if (navigator.vibrate) navigator.vibrate([20, 30]);

        } catch (e) {
            console.error("Error borrando historial:", e);
            if (typeof Notify !== 'undefined') Notify.show('Error', 'No se pudo limpiar el historial.', 'error');
        }

        closeOverlay();
    };
};

window.closeActivityModal = function () {
    const modal = document.getElementById('activityModal');
    const content = document.getElementById('activityContent');

    if (modal && content) {
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');

            // Restaurar perfil de fondo
            const profileModal = document.getElementById('profileModal');
            if (profileModal) profileModal.classList.remove('opacity-0');
        }, 200);
    }
};

// 🎫 ==========================================
// LÓGICA DE "MIS TICKETS" Y REPORTES
// ==========================================
window.openTicketsModal = async function () {
    const modal = document.getElementById('ticketsModal');
    const content = document.getElementById('ticketsContent');
    const list = document.getElementById('ticketsFullList');

    const userIdDisplay = document.getElementById('userInternalIdDisplay');
    const userId = userIdDisplay ? userIdDisplay.getAttribute('data-uuid') : null;

    if (!modal || !content || !list || !userId || typeof supabaseClient === 'undefined') return;

    // Abrir Modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Ocultar perfil visualmente para que no estorbe
    const profileModal = document.getElementById('profileModal');
    if (profileModal) profileModal.classList.add('opacity-0');

    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);

    // Ruedita de carga
    list.innerHTML = `<div class="flex flex-col items-center justify-center py-12 gap-3 text-primary-500 animate-pulse">
        <i data-lucide="loader-2" class="w-8 h-8 animate-spin"></i>
        <span class="text-xs font-black uppercase tracking-widest">Sincronizando...</span>
    </div>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    try {
        // 🚀 LLAMADA A SUPABASE
        const { data: tickets, error } = await supabaseClient.from('feedback_usuarios')
            .select('*').eq('usuario_id', userId).order('fecha', { ascending: false });

        if (error) throw error;

        if (!tickets || tickets.length === 0) {
            list.innerHTML = `
                <div class="flex flex-col items-center justify-center py-12 text-center">
                    <i data-lucide="inbox" class="w-16 h-16 text-slate-300 dark:text-white/10 mb-4"></i>
                    <h3 class="text-sm font-bold text-slate-700 dark:text-white mb-1">Bandeja Vacía</h3>
                    <p class="text-xs text-gray-500 mb-5">Aún no has enviado sugerencias o reportes.</p>
                    
                    <button onclick="closeTicketsModal(true)" class="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-[0_5px_15px_rgba(139,92,246,0.3)] active:scale-95 flex items-center gap-2">
                        <i data-lucide="plus" class="w-4 h-4"></i> Crear mi primer reporte
                    </button>
                </div>`;
        } else {
            list.innerHTML = tickets.map(ticket => {
                // 🎨 Lógica de Etiquetas Dinámicas (Badges)
                let badgeClass = 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'; // Pendiente
                let iconName = 'clock';
                let stateText = ticket.estado || 'Pendiente';

                // Normalizamos a minúsculas para buscar más fácil
                const estadoLower = stateText.toLowerCase();

                // 🚀 BÚSQUEDA A PRUEBA DE ACENTOS Y FORZADO DE TILDE
                if (estadoLower.includes('revisi') || estadoLower.includes('desarrollo')) {
                    badgeClass = 'bg-blue-500/10 text-blue-600 border-blue-500/20'; // Igualamos el azul
                    iconName = 'eye';
                    stateText = 'En Revisión'; // ✏️ Forzamos la tilde visualmente en el HTML
                } else if (estadoLower.includes('solucionado') || estadoLower.includes('implementado')) {
                    badgeClass = 'bg-green-500/10 text-green-600 border-green-500/20'; // Igualamos el verde
                    iconName = 'check-circle-2';
                    stateText = 'Solucionado';
                } else {
                    stateText = 'Pendiente'; // Por si acaso, lo ponemos bonito
                }

                // Icono por tipo de reporte (Bug, Idea, Duda)
                let typeIcon = 'message-square';
                let typeColor = 'text-slate-500';
                if (ticket.tipo_mensaje.toLowerCase().includes('bug') || ticket.tipo_mensaje.toLowerCase().includes('error')) { typeIcon = 'bug'; typeColor = 'text-red-500'; }
                if (ticket.tipo_mensaje.toLowerCase().includes('idea') || ticket.tipo_mensaje.toLowerCase().includes('sugerencia')) { typeIcon = 'lightbulb'; typeColor = 'text-primary-500'; }

                const fecha = new Date(ticket.fecha);
                const fechaStr = fecha.toLocaleDateString() + ' ' + fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let respuestaHTML = '';
                if (ticket.respuesta_admin && ticket.respuesta_admin.trim() !== '') {
                    respuestaHTML = `
                        <div class="mt-3 bg-primary-500/10 border border-primary-500/20 rounded-xl p-3 relative shadow-inner">
                            <div class="flex items-center gap-2 mb-1.5">
                                <i data-lucide="shield-check" class="w-3.5 h-3.5 text-primary-500"></i>
                                <span class="text-[10px] font-black uppercase tracking-widest text-primary-500">Respuesta de Compressly</span>
                            </div>
                            <p class="text-[13px] font-medium text-slate-700 dark:text-gray-300 leading-relaxed">${ticket.respuesta_admin}</p>
                        </div>
                    `;
                }

                return `
                    <div class="flex flex-col gap-2 p-4 bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200 dark:border-white/5 transition-all hover:border-primary-500/30 shadow-sm">
                        <div class="flex justify-between items-start gap-2">
                            <div class="flex items-center gap-2">
                                <i data-lucide="${typeIcon}" class="w-4 h-4 ${typeColor}"></i>
                                <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">${ticket.tipo_mensaje}</span>
                            </div>
                            <span class="flex items-center gap-1.5 text-[9px] font-black ${badgeClass} px-2 py-1 rounded-lg border uppercase tracking-widest shrink-0">
                                <i data-lucide="${iconName}" class="w-3 h-3"></i> ${stateText}
                            </span>
                        </div>
                        <p class="text-sm font-medium text-slate-800 dark:text-gray-300 mt-1 line-clamp-4">${ticket.mensaje_texto}</p>
                        
                        ${respuestaHTML} <span class="text-[10px] text-gray-400 font-bold mt-2 flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> ${fechaStr}</span>
                    </div>
                `;
            }).join('');
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    } catch (e) {
        list.innerHTML = `<div class="text-red-500 text-center py-8 font-black">Error cargando tus reportes.</div>`;
    }
};

window.closeTicketsModal = function (openFeedback = false) {
    const modal = document.getElementById('ticketsModal');
    const content = document.getElementById('ticketsContent');

    if (modal && content) {
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');

            if (openFeedback) {
                // 🚀 TRUCO ENTERPRISE: Saltamos al Centro de Ideas y le decimos que venimos de aquí (true)
                openFeedbackModal(true);
            } else {
                // 🔄 Si cerramos normal con la "X", devolvemos la opacidad al perfil
                const profileModal = document.getElementById('profileModal');
                if (profileModal) profileModal.classList.remove('opacity-0');
            }
        }, 200);
    }
};

// 🗑️ FUNCIÓN PARA BORRAR REPORTES CON MODAL DINÁMICO
window.limpiarTicketsUsuario = function () {
    const userIdDisplay = document.getElementById('userInternalIdDisplay');
    const userId = userIdDisplay ? userIdDisplay.getAttribute('data-uuid') : null;

    if (!userId || userId === '---' || typeof supabaseClient === 'undefined') return;
    if (navigator.vibrate) navigator.vibrate(20);

    // 🎨 DIBUJAR EL MODAL DE CONFIRMACIÓN
    const overlay = document.createElement('div');
    overlay.id = 'customConfirmModalTickets';
    overlay.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-indigo-950/30 backdrop-blur-sm p-4 opacity-0 transition-opacity duration-300';

    overlay.innerHTML = `
        <div class="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 w-full max-w-sm shadow-2xl transform scale-95 transition-transform duration-300 relative overflow-hidden">
            <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-500/20 blur-[50px] rounded-full pointer-events-none"></div>

            <div class="flex flex-col items-center text-center relative z-10">
                <div class="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
                    <i data-lucide="trash-2" class="w-8 h-8"></i>
                </div>
                
                <h3 class="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">¿Borrar Reportes?</h3>
                
                <p class="text-[13px] text-slate-500 dark:text-gray-400 mb-8 font-medium leading-relaxed">
                    Esta acción eliminará todo tu historial de tickets y respuestas del equipo.<br>
                    <b class="text-red-500 dark:text-red-400">Esta acción no se puede deshacer.</b>
                </p>
                
                <div class="flex gap-3 w-full">
                    <button id="cancelTicketBtn" class="flex-1 px-4 py-3.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white rounded-xl font-bold transition-all text-[13px] active:scale-95">
                        Cancelar
                    </button>
                    <button id="acceptTicketBtn" class="flex-1 px-4 py-3.5 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 rounded-xl font-black transition-all active:scale-95 text-[13px] flex items-center justify-center gap-2">
                        <i data-lucide="trash-2" class="w-4 h-4"></i> Borrar Todo
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Animación entrada
    requestAnimationFrame(() => {
        overlay.classList.remove('opacity-0');
        overlay.firstElementChild.classList.remove('scale-95');
    });

    const closeOverlay = () => {
        overlay.classList.add('opacity-0');
        overlay.firstElementChild.classList.add('scale-95');
        setTimeout(() => overlay.remove(), 300);
    };

    document.getElementById('cancelTicketBtn').onclick = closeOverlay;
    overlay.onclick = (e) => { if (e.target === overlay) closeOverlay(); };

    // Lógica al aceptar borrar
    document.getElementById('acceptTicketBtn').onclick = async () => {
        const btn = document.getElementById('acceptTicketBtn');
        btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Borrando...';
        btn.classList.add('opacity-80', 'pointer-events-none');
        if (typeof lucide !== 'undefined') lucide.createIcons();

        try {
            // Eliminar desde Supabase
            const { error } = await supabaseClient.from('feedback_usuarios').delete().eq('usuario_id', userId);
            if (error) throw error;

            // Mostrar el nuevo "Estado Vacío" mágicamente
            document.getElementById('ticketsFullList').innerHTML = `
                <div class="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                    <i data-lucide="inbox" class="w-16 h-16 text-slate-300 dark:text-white/10 mb-4"></i>
                    <h3 class="text-sm font-bold text-slate-700 dark:text-white mb-1">Bandeja Vacía</h3>
                    <p class="text-xs text-gray-500 mb-5">Aún no has enviado sugerencias o reportes.</p>
                    
                    <button onclick="closeTicketsModal(true)" class="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-[0_5px_15px_rgba(139,92,246,0.3)] active:scale-95 flex items-center gap-2">
                        <i data-lucide="plus" class="w-4 h-4"></i> Crear mi primer reporte
                    </button>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            if (typeof Notify !== 'undefined') Notify.show('Reportes Borrados', 'Tu bandeja ahora está vacía.', 'success');
            if (navigator.vibrate) navigator.vibrate([20, 30]);

        } catch (e) {
            console.error("Error borrando reportes:", e);
            if (typeof Notify !== 'undefined') Notify.show('Error', 'No se pudieron borrar los reportes.', 'error');
        }

        closeOverlay();
    };
};