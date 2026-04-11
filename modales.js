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