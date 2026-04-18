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

function openModal(titleKey, contentKey) {
    modalTitle.innerHTML = `<i data-lucide="shield" class="w-6 h-6 text-primary-400"></i> ${translations[currentLanguage][titleKey]}`;
    modalBody.innerHTML = translations[currentLanguage][contentKey];

    legalModal.classList.remove('hidden');
    legalModal.classList.add('flex');
    document.body.style.overflow = 'hidden'; // 🚀 Bloquear Scroll del Fondo
    if (window.innerWidth <= 480) document.getElementById('aiToggler')?.classList.add('hidden'); // 🚀 Ocultar bot en móvil

    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);

    lucide.createIcons();
    if (navigator.vibrate) navigator.vibrate(30);
}

function closeModal() {
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        legalModal.classList.add('hidden');
        legalModal.classList.remove('flex');
        document.body.style.overflow = ''; // 🚀 Restaurar Scroll
        if (window.innerWidth <= 480) document.getElementById('aiToggler')?.classList.remove('hidden'); // 🚀 Mostrar bot
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
    profileModal.classList.remove('hidden');
    profileModal.classList.add('flex');
    document.body.style.overflow = 'hidden'; // 🚀 Bloquear Scroll del Fondo

    // 🚀 Ocultar bot en TODAS las pantallas (PC y Móvil)
    const botBtn = document.getElementById('aiToggler');
    if (botBtn) botBtn.style.display = 'none';

    setTimeout(() => {
        profileContent.classList.remove('scale-95', 'opacity-0');
        profileContent.classList.add('scale-100', 'opacity-100');
    }, 10);
    lucide.createIcons();
    if (navigator.vibrate) navigator.vibrate([50, 50]);
};

window.closeProfileModal = function () {
    profileContent.classList.remove('scale-100', 'opacity-100');
    profileContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        profileModal.classList.add('hidden');
        profileModal.classList.remove('flex');
        document.body.style.overflow = ''; // 🚀 Restaurar Scroll

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
    const profileTotalText = document.getElementById('profileTotalSaved');

    if (totalSavedBytes > 0) {
        if (desktopBadge) { desktopBadge.classList.remove('hidden'); desktopBadge.classList.add('flex'); }
        if (mobileBadge) { mobileBadge.classList.remove('hidden'); mobileBadge.classList.add('flex'); }

        if (desktopText) desktopText.innerText = formatted;
        if (mobileText) mobileText.innerText = formatted;
        if (profileTotalText) profileTotalText.innerText = formatted;

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

window.openFeedbackModal = function () {
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

    lucide.createIcons();
    if (navigator.vibrate) navigator.vibrate([50, 50]);
};

window.closeFeedbackModal = function () {
    // Cerrar el dropdown si estaba abierto al cerrar el modal
    feedbackSelectDropdown?.classList.remove('custom-select-dropdown-open');
    feedbackSelectArrow?.classList.remove('custom-select-arrow-open');

    feedbackContent.classList.remove('scale-100', 'opacity-100');
    feedbackContent.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        feedbackModal.classList.add('hidden');
        feedbackModal.classList.remove('flex');
        document.body.style.overflow = '';
        const botBtn = document.getElementById('aiToggler');
        if (botBtn) botBtn.style.display = '';
    }, 200);
    if (navigator.vibrate) navigator.vibrate(20);
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

document.getElementById('feedbackForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (typeof Notify !== 'undefined') {
        Notify.show('¡Mensaje Enviado!', 'Gracias por ayudarnos a mejorar Compressly.', 'success');
    }
    closeFeedbackModal();
    document.getElementById('feedbackText').value = '';
});

// 🚀 FUNCIONES DEL MODAL ULTRA
window.openUltraModal = function () {
    const modal = document.getElementById('ultraModal');
    const content = document.getElementById('ultraContent');

    if (modal && content) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden'; // 🚀 Bloqueo de scroll profesional

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
        document.body.style.overflow = 'hidden';

        // 🤖 OCULTAR CHATBOT IA
        const botBtn = document.getElementById('aiToggler');
        if (botBtn) botBtn.style.display = 'none';

        setTimeout(() => {
            // 🚀 Cambiamos a escala para que sea igual al modal PRO
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);

        lucide.createIcons();
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
            document.body.style.overflow = '';

            // 🤖 MOSTRAR CHATBOT IA
            const botBtn = document.getElementById('aiToggler');
            if (botBtn) botBtn.style.display = '';
        }, 200);
        if (navigator.vibrate) navigator.vibrate(20);
    }
};