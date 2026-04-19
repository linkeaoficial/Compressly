// 🗄️ LA VARIABLE GLOBAL FUE REEMPLAZADA POR 'DB' en data_compressly.js
// 🔄 Mantenemos la compatibilidad del código viejo así:
Object.defineProperty(window, 'isPremiumUser', {
    get: function () { return DB.isPro(); }
});

lucide.createIcons();

// 🔌 CONEXIONES VITALES DEL DOM (Cables restaurados)
const imageInput = document.getElementById('imageInput');
const qualityRange = document.getElementById('qualityRange');
const qualityVal = document.getElementById('qualityVal');
const compressBtn = document.getElementById('compressBtn');

const btnWebp = document.getElementById('btnWebp');
const btnPng = document.getElementById('btnPng');
const btnJpg = document.getElementById('btnJpg');
const btnAuto = document.getElementById('btnAuto');

const resizeSelect = document.getElementById('resizeSelect');
const resizeVal = document.getElementById('resizeVal');

const origPreview = document.getElementById('origPreview');
const resPreview = document.getElementById('resPreview');
const placeholderOrig = document.getElementById('placeholderOrig');

const origFormatBadge = document.getElementById('origFormat');
const origDimBadge = document.getElementById('origDim');
const resFormatBadge = document.getElementById('resFormat');
const resDimBadge = document.getElementById('resDim');

const savePercent = document.getElementById('savePercent');
const statsTitle = document.getElementById('statsTitle');
const statsMsg = document.getElementById('statsMsg');
const resSizeBadge = document.getElementById('resSize');
const origSizeBadge = document.getElementById('origSize');
const downloadBtn = document.getElementById('downloadBtn');

// 👑 APLICAR ESTADO VISUAL PREMIUM (Menús Dinámicos PRO y ULTRA)
function applyPremiumUI() {
    const btnGoPro = document.getElementById('btnGoPro');
    const btnGoProMobile = document.getElementById('btnGoProMobile');

    // 🚀 PRIORIDAD ULTRA (Morado)
    if (typeof DB !== 'undefined' && DB.isUltra()) {
        if (btnGoPro) {
            btnGoPro.className = 'bg-purple-500/10 text-purple-500 px-6 py-2.5 rounded-full text-sm font-black backdrop-blur-md border border-purple-500/20 flex items-center gap-2 pointer-events-none whitespace-nowrap shrink-0';
            btnGoPro.innerHTML = '<i data-lucide="sparkles" class="w-4 h-4 fill-current"></i> ULTRA Activo';
        }
        if (btnGoProMobile) btnGoProMobile.style.display = 'none';

    }
    // 👑 SEGUNDO NIVEL PRO (Amarillo)
    else if (typeof DB !== 'undefined' && DB.isPro()) {
        if (btnGoPro) {
            btnGoPro.className = 'bg-yellow-500/10 text-yellow-500 px-6 py-2.5 rounded-full text-sm font-black backdrop-blur-md border border-yellow-500/20 flex items-center gap-2 pointer-events-none whitespace-nowrap shrink-0';
            btnGoPro.innerHTML = '<i data-lucide="crown" class="w-4 h-4 fill-current"></i> PRO Activo';
        }
        if (btnGoProMobile) btnGoProMobile.style.display = 'none';
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Ejecutar al instante
applyPremiumUI();

let currentFile = null;
let selectedFormat = 'image/jpeg'; // 🟢 JPG por defecto
const exifToggle = document.getElementById('exifToggle'); // 🟢 Referencia al escudo

// Mapa maestro de formatos
const formatButtons = [
    { btn: btnWebp, format: 'image/webp' },
    { btn: btnPng, format: 'image/png' },
    { btn: btnJpg, format: 'image/jpeg' },
    { btn: btnAuto, format: 'auto' }
];

// Función inteligente para actualizar la interfaz
function updateFormatUI(activeBtn) {
    formatButtons.forEach(item => {
        // 1. Quitamos TODAS las clases de color (activas e inactivas) sin tocar el tamaño
        item.btn.classList.remove(
            'bg-primary-500', 'text-white', 'shadow-lg', 'dark:border-white/10',
            'text-slate-500', 'dark:text-gray-400', 'hover:text-slate-900',
            'dark:hover:text-white', 'hover:bg-slate-200', 'dark:hover:bg-white/5'
        );

        // 2. Aplicamos los colores correctos
        if (item.btn === activeBtn) {
            item.btn.classList.add('bg-primary-500', 'text-white', 'shadow-lg', 'dark:border-white/10');
        } else {
            item.btn.classList.add('text-slate-500', 'dark:text-gray-400', 'hover:text-slate-900', 'dark:hover:text-white', 'hover:bg-slate-200', 'dark:hover:bg-white/5');
        }
    });

    // 🟢 Lógica de la alerta PNG
    const pngWarning = document.getElementById('pngWarning');
    if (selectedFormat === 'image/png') {
        pngWarning.classList.remove('hidden');
    } else {
        pngWarning.classList.add('hidden');
    }
}

// Asignación automática de eventos
formatButtons.forEach(item => {
    item.btn.addEventListener('click', () => {
        selectedFormat = item.format;
        updateFormatUI(item.btn);
        triggerVibration();
    });
});

// 🚀 LÓGICA DE CARPETAS EN ZIP
let useZipFolders = false;
const folderOrgBtn = document.getElementById('folderOrgBtn');
if (folderOrgBtn) {
    folderOrgBtn.addEventListener('click', () => {
        if (!isPremiumUser) { openPremiumModal(); return; }

        useZipFolders = !useZipFolders;
        triggerVibration(20);

        if (useZipFolders) {
            // 🚀 NUEVO: Quitamos el gris y forzamos el morado
            folderOrgBtn.classList.remove('bg-slate-100', 'dark:bg-black/40', 'border-slate-200', 'dark:border-white/5');
            folderOrgBtn.classList.add('border-primary-500', 'bg-primary-500/10', 'dark:bg-primary-500/20');

            document.getElementById('folderIcon').classList.remove('text-slate-400');
            document.getElementById('folderIcon').classList.add('text-primary-500');
            Notify.show('Carpetas Activadas', 'Tu archivo ZIP se organizará automáticamente.', 'info');
        } else {
            // 🚀 NUEVO: Devolvemos el color gris original
            folderOrgBtn.classList.add('bg-slate-100', 'dark:bg-black/40', 'border-slate-200', 'dark:border-white/5');
            folderOrgBtn.classList.remove('border-primary-500', 'bg-primary-500/10', 'dark:bg-primary-500/20');

            document.getElementById('folderIcon').classList.add('text-slate-400');
            document.getElementById('folderIcon').classList.remove('text-primary-500');
        }
    });
}

// 🚀 LÓGICA DE MARCA DE AGUA (Texto, Logo, Papelera y Ajustes Flotantes)
const watermarkInput = document.getElementById('watermarkInput');
const watermarkLogoInput = document.getElementById('watermarkLogoInput');
const watermarkLogoBtn = document.getElementById('watermarkLogoBtn');
const clearWatermarkLogoBtn = document.getElementById('clearWatermarkLogoBtn'); // 🗑️ Nuevo
const wmSettingsBtn = document.getElementById('wmSettingsBtn'); // 🎛️ Nuevo
const wmSettingsPanel = document.getElementById('wmSettingsPanel'); // 🎈 Nuevo
let customLogoImage = null; // Memoria RAM del Logo 🧠

if (watermarkInput) {
    watermarkInput.addEventListener('focus', (e) => {
        if (!isPremiumUser) {
            e.preventDefault();
            watermarkInput.blur();
            openPremiumModal();
        }
    });
}

// 🎛️ Abrir/Cerrar Panel de Ajustes (Evita deformar el diseño en PC)
if (wmSettingsBtn) {
    wmSettingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Evitar que el clic lo cierre de inmediato
        if (!isPremiumUser) { openPremiumModal(); return; }

        wmSettingsPanel.classList.toggle('hidden');
        wmSettingsBtn.classList.toggle('text-primary-500');
        triggerVibration(10);
    });
}

// 🖱️ Cerrar panel de ajustes si hacen clic en cualquier otra parte de la pantalla
document.addEventListener('click', (e) => {
    if (wmSettingsPanel && !wmSettingsPanel.classList.contains('hidden')) {
        if (!wmSettingsPanel.contains(e.target) && !wmSettingsBtn.contains(e.target)) {
            wmSettingsPanel.classList.add('hidden');
            wmSettingsBtn.classList.remove('text-primary-500');
        }
    }
});

// 🖼️ Protección de Clic en el Botón de Logo
if (watermarkLogoBtn) {
    watermarkLogoBtn.addEventListener('click', (e) => {
        if (!isPremiumUser) {
            e.preventDefault(); // 🛑 Evita que se abra el selector de archivos
            openPremiumModal(); // 💰 Muestra el modal de ventas
        }
    });
}

// 🖼️ Subir Logo (Este se mantiene casi igual, pero quitamos la validación interna que ya hicimos arriba)
if (watermarkLogoInput) {
    watermarkLogoInput.addEventListener('change', (e) => {
        // Ya no necesitamos el if(!isPremiumUser) aquí porque el clic ya lo bloquea
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    customLogoImage = img;
                    Notify.show('Logo Cargado', 'Tu marca de agua visual está lista.', 'success');

                    // 🚀 Magia UI: Ocultamos botón de subir, mostramos papelera
                    watermarkLogoBtn.classList.add('hidden');
                    clearWatermarkLogoBtn.classList.remove('hidden');

                    // 🚀 Cambiamos el icono de copyright por uno de imagen
                    const wmIconIndicator = document.getElementById('wmIconIndicator');
                    if (wmIconIndicator) wmIconIndicator.setAttribute('data-lucide', 'image');

                    watermarkInput.value = '';
                    // 🚀 NUEVO: Traducción inteligente dinámica
                    watermarkInput.placeholder = (typeof translations !== 'undefined' && translations[currentLanguage]) ? translations[currentLanguage].wm_logo_selected : 'Logo seleccionado ✓';
                    watermarkInput.disabled = true;
                    lucide.createIcons();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

// 🗑️ Eliminar Logo (La Papelera Mágica)
if (clearWatermarkLogoBtn) {
    clearWatermarkLogoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        customLogoImage = null; // 🧠 Borramos de la memoria
        watermarkLogoInput.value = ''; // Limpiamos el archivo subido

        // 🚀 Restauramos el icono a copyright
        const wmIconIndicator = document.getElementById('wmIconIndicator');
        if (wmIconIndicator) wmIconIndicator.setAttribute('data-lucide', 'copyright');

        // Restauramos Interfaz
        watermarkInput.disabled = false;
        watermarkInput.placeholder = (typeof translations !== 'undefined' && translations[currentLanguage]) ? translations[currentLanguage].watermark_placeholder : '@TuMarca o Texto...';

        clearWatermarkLogoBtn.classList.add('hidden'); // Ocultar papelera
        watermarkLogoBtn.classList.remove('hidden'); // Volver a mostrar botón de subir imagen

        lucide.createIcons();
        Notify.show('Logo Eliminado', 'Se ha quitado la marca visual.', 'info');
        triggerVibration(20);
    });
}

// 🚀 LÓGICA DE SELECTORES PERSONALIZADOS (Ajustes de Marca de Agua)
function setupWmCustomSelect(containerId, dropdownId, arrowId, labelId, selectId) {
    const container = document.getElementById(containerId);
    const dropdown = document.getElementById(dropdownId);
    const arrow = document.getElementById(arrowId);
    const label = document.getElementById(labelId);
    const hiddenSelect = document.getElementById(selectId);

    if (!container) return;

    container.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('custom-select-dropdown-open');
        arrow.classList.toggle('custom-select-arrow-open');
        triggerVibration(20);
    });

    const options = dropdown.querySelectorAll('.custom-option');
    options.forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            // 🛑 Muro de pago
            if (!isPremiumUser) {
                openPremiumModal();
                dropdown.classList.remove('custom-select-dropdown-open');
                arrow.classList.remove('custom-select-arrow-open');
                return;
            }

            // 🟢 Marcar visualmente la opción
            options.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');

            // 🟢 Actualizar el texto del botón
            label.innerText = opt.innerText;

            // 🟢 Actualizar el select oculto
            hiddenSelect.value = opt.getAttribute('data-value');
            triggerVibration(10);

            // 🟢 Cerrar el menú
            dropdown.classList.remove('custom-select-dropdown-open');
            arrow.classList.remove('custom-select-arrow-open');
        });
    });

    // 🟢 Cerrar si hacen clic afuera
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('custom-select-dropdown-open');
            arrow.classList.remove('custom-select-arrow-open');
        }
    });
}

// Inicializamos los dos selectores nuevos
setupWmCustomSelect('wmPosContainer', 'wmPosDropdown', 'wmPosArrow', 'wmPosLabel', 'wmPosition');
setupWmCustomSelect('wmSizeContainer', 'wmSizeDropdown', 'wmSizeArrow', 'wmSizeLabel', 'wmSize');

// 🚀 PROTEGER LOS NUEVOS CONTROLES DE POSICIÓN/TAMAÑO
['wmPosition', 'wmSize'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('change', (e) => {
            if (!isPremiumUser) {
                e.preventDefault();
                el.value = el.id === 'wmSize' ? '0.15' : 'bottom-right'; // Reseteamos al valor base
                openPremiumModal();
            } else {
                triggerVibration(10);
            }
        });
    }
});

// 🎨 MOTOR DE PINTURA (Ahora con 5 posiciones y 3 tamaños) 📐
function drawWatermark(context, canvas) {
    const posSelect = document.getElementById('wmPosition')?.value || 'bottom-right';
    const sizeMultiplier = parseFloat(document.getElementById('wmSize')?.value || 0.15);
    const padding = Math.max(15, canvas.width * 0.02); // Margen dinámico que se adapta a la foto

    // 1️⃣ Si hay un LOGO subido, lo pintamos 🌟
    if (customLogoImage) {
        const logoWidth = canvas.width * sizeMultiplier;
        const ratio = customLogoImage.height / customLogoImage.width;
        const logoHeight = logoWidth * ratio;

        let xPos, yPos;

        // 🧮 Lógica matemática de posiciones para el Logo
        if (posSelect === 'bottom-right') { xPos = canvas.width - logoWidth - padding; yPos = canvas.height - logoHeight - padding; }
        else if (posSelect === 'bottom-left') { xPos = padding; yPos = canvas.height - logoHeight - padding; }
        else if (posSelect === 'top-right') { xPos = canvas.width - logoWidth - padding; yPos = padding; }
        else if (posSelect === 'top-left') { xPos = padding; yPos = padding; }
        else if (posSelect === 'center') { xPos = (canvas.width - logoWidth) / 2; yPos = (canvas.height - logoHeight) / 2; }

        context.shadowColor = 'rgba(0, 0, 0, 0.5)';
        context.shadowBlur = 10;
        context.drawImage(customLogoImage, xPos, yPos, logoWidth, logoHeight);
        context.shadowBlur = 0;
        return;
    }

    // 2️⃣ Si NO hay logo, pintamos TEXTO ✍️
    if (!watermarkInput) return;
    const text = watermarkInput.value.trim();
    if (text !== "") {
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';

        // El tamaño de la fuente también cambia según si eligen Pequeño, Medio o Grande
        const fontScale = sizeMultiplier / 0.15;
        context.font = `normal ${Math.max(20, (canvas.width / 40) * fontScale)}px "Plus Jakarta Sans", Arial, sans-serif`;

        context.shadowColor = 'rgba(0, 0, 0, 0.8)';
        context.shadowBlur = 6;
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;

        let xPos, yPos;

        // 🧮 Lógica matemática de posiciones y alineación para el Texto
        if (posSelect === 'bottom-right') { context.textAlign = 'right'; context.textBaseline = 'bottom'; xPos = canvas.width - padding; yPos = canvas.height - padding; }
        else if (posSelect === 'bottom-left') { context.textAlign = 'left'; context.textBaseline = 'bottom'; xPos = padding; yPos = canvas.height - padding; }
        else if (posSelect === 'top-right') { context.textAlign = 'right'; context.textBaseline = 'top'; xPos = canvas.width - padding; yPos = padding; }
        else if (posSelect === 'top-left') { context.textAlign = 'left'; context.textBaseline = 'top'; xPos = padding; yPos = padding; }
        else if (posSelect === 'center') { context.textAlign = 'center'; context.textBaseline = 'middle'; xPos = canvas.width / 2; yPos = canvas.height / 2; }

        context.fillText(text, xPos, yPos);
    }
}

qualityRange.addEventListener('input', (e) => {
    qualityVal.innerText = `${e.target.value}%`;
});
qualityRange.addEventListener('change', () => triggerVibration(30));

// 🟢 Muro de Pago para el Escudo Anti-Rastreo
exifToggle.addEventListener('change', (e) => {
    triggerVibration([30, 50]);

    if (exifToggle.checked) {
        if (!isPremiumUser) {
            e.preventDefault();
            exifToggle.checked = false;
            openPremiumModal();
        } else {
            Notify.show('Escudo Activado', 'Los metadatos serán eliminados.', 'info');
        }
    }
});

resizeSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === "0") {
        resizeVal.innerText = "Original";
    } else {
        resizeVal.innerText = val + "px";
    }
    triggerVibration(20);
});

const dropzone = imageInput.closest('.bento-card');

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('border-primary-400', 'bg-primary-500/10');
});

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('border-primary-400', 'bg-primary-500/10');
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('border-primary-400', 'bg-primary-500/10');

    if (e.dataTransfer.files.length > 0) {
        // 🚀 Convertimos los archivos en una lista y los procesamos TODOS
        handleMultipleFiles(Array.from(e.dataTransfer.files));
    }
});

imageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        // 🚀 Convertimos los archivos en una lista y los procesamos TODOS
        handleMultipleFiles(Array.from(e.target.files));
    }
});

// 🚀 VARIABLES GLOBALES PARA LOTES
let batchFiles = [];
const batchDashboard = document.getElementById('batchDashboard');
const batchGrid = document.getElementById('batchGrid');
const batchCount = document.getElementById('batchCount');

// Referencias a las 3 tarjetas individuales (para ocultarlas/mostrarlas)
const singleCardOrig = document.getElementById('origSize').closest('.bento-card');
const singleCardRes = document.getElementById('resSize').closest('.bento-card');
const singleCardStats = document.getElementById('statsTitle').closest('.bento-card');

// 🚀 FUNCIÓN MAESTRA VISUAL PARA LOTES
function handleMultipleFiles(filesArray) {
    if (filesArray.length === 0) return;

    triggerVibration([30, 50, 30]);

    // 🛑 EL MURO DE PAGO: Limitar a 3 imágenes en versión gratuita
    if (filesArray.length > 3) {
        if (!isPremiumUser) {
            openPremiumModal();
            return;
        }
    }

    if (filesArray.length === 1) {
        // --- MODO SOLITARIO (1 Foto) ---
        batchFiles = []; // 🚀 NUEVO: Vaciamos la memoria del lote fantasma
        batchDashboard.classList.add('hidden');
        singleCardOrig.classList.remove('hidden');
        singleCardRes.classList.remove('hidden');
        singleCardStats.classList.remove('hidden');

        handleFileSelection(filesArray[0]);
    } else {
        // --- MODO LOTE PREMIUM (Múltiples Fotos) ---
        currentFile = null; // 🚀 NUEVO: Vaciamos la memoria de la foto individual fantasma
        batchFiles = filesArray;
        Notify.show('Modo Lote Activado', `Has cargado ${filesArray.length} imágenes.`, 'info');

        // 1. Ocultar las tarjetas de "1 sola foto"
        singleCardOrig.classList.add('hidden');
        singleCardRes.classList.add('hidden');
        singleCardStats.classList.add('hidden');

        // 2. Mostrar el Dashboard de Lotes
        batchDashboard.classList.remove('hidden');
        batchCount.innerText = filesArray.length;

        // 🚀 Resetear la barra horizontal nueva
        document.getElementById('batchSavePercent').innerText = '0%';
        // 🌍 Usamos el diccionario inteligente
        document.getElementById('batchStatsMsg').innerHTML = `<i data-lucide="clock" class="w-4 h-4"></i> ${translations[currentLanguage].batch_waiting}`;
        document.getElementById('batchStatsMsg').className = 'text-sm text-yellow-600 dark:text-yellow-400 font-bold flex items-center gap-1.5';
        document.getElementById('downloadBatchBtn').classList.add('hidden');
        // 🚀 (Línea del botón fantasma eliminada)

        // 3. Limpiar el grid y dibujar las tarjetitas con MINIATURAS REALES 🖼️
        batchGrid.innerHTML = '';
        filesArray.forEach((file, index) => {
            const sizeKB = (file.size / 1024).toFixed(1);

            // 🚀 MAGIA: Creamos una URL temporal ultrarrápida para la miniatura
            const previewUrl = URL.createObjectURL(file);

            const card = document.createElement('div');
            card.className = "bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex items-center gap-4 relative transition-colors group";
            card.innerHTML = `
                <div class="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-300 dark:border-white/10 shadow-sm relative">
                    <img src="${previewUrl}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="preview">
                    <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-slate-900 dark:text-white truncate" title="${file.name}">${file.name}</p>
                    <p class="text-xs text-slate-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                        ${sizeKB} KB <span class="text-gray-300 dark:text-gray-600 mx-1">•</span> 
                        <span id="status-${index}" class="text-yellow-600 dark:text-yellow-400 font-bold flex items-center gap-1">
                            <i data-lucide="clock" class="w-3 h-3"></i> ${translations[currentLanguage].batch_queue}
                        </span>
                    </p>
                </div>
            `;
            batchGrid.appendChild(card);
        });

        lucide.createIcons();

        // 4. Cambiar textos de la Nube principal
        document.getElementById('dropMainText').innerText = '¡Lote Cargado!';
        document.getElementById('dropSubText').innerText = `${filesArray.length} archivos listos`;
        document.getElementById('dropIconCloud').classList.add('hidden');
        document.getElementById('dropIconImage').classList.remove('hidden');

        document.getElementById('clearBtn').classList.remove('hidden'); // Mostrar papelera general


        // 📱💻 Control de Scroll Inteligente (Al cargar el Lote)
        setTimeout(() => {
            const element = document.getElementById('qualityRange');

            // Detectamos si es PC o Móvil
            const isDesktop = window.innerWidth >= 768;

            // 🟢 Reducimos a 100 para que en PC suba mucho más y se vean las miniaturas
            const offset = isDesktop ? 280 : 250;

            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }, 300);
    }
}

// Mantenemos tu función vieja intacta justo debajo
function handleFileSelection(file) {
    if (!file) return;

    const maxSizeInBytes = 10 * 1024 * 1024;

    // 🛑 ESTRATEGIA: Si la imagen pesa más de 10MB, activamos el Muro de Pago
    if (file.size > maxSizeInBytes) {
        if (!isPremiumUser) {
            triggerVibration([100, 50, 100]);
            openPremiumModal();
            Notify.show('Límite Superado', 'Las imágenes de >10MB requieren la versión PRO.', 'info');
            imageInput.value = '';
            return;
        }
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        triggerVibration([100, 50, 100]);
        Notify.show('Formato Inválido', 'Solo admitimos imágenes profesionales: JPG, PNG o WEBP.', 'error');
        imageInput.value = '';
        return;
    }

    currentFile = file;
    triggerVibration(50);

    const reader = new FileReader();
    reader.onload = (event) => {
        origPreview.src = event.target.result;
        origPreview.alt = "Vista previa original de " + file.name; // 🚀 INYECCIÓN SEO ALT

        // 🟢 Extraer dimensiones reales de la imagen Original
        origPreview.onload = () => {
            origDimBadge.innerText = `${origPreview.naturalWidth} x ${origPreview.naturalHeight}`;
            origDimBadge.classList.remove('hidden');
        };

        // 🟢 Extraer formato original
        const fileExt = file.name.split('.').pop().toUpperCase();
        origFormatBadge.innerText = fileExt;
        origFormatBadge.classList.remove('hidden');

        origPreview.classList.remove('hidden');
        placeholderOrig.classList.add('hidden');

        origSizeBadge.innerText = (file.size / 1024).toFixed(1) + ' KB';

        // Resetear visuales de resultado
        resPreview.classList.add('hidden');
        downloadBtn.classList.add('hidden');
        savePercent.innerText = '0%';
        savePercent.className = "text-5xl font-black text-slate-800 dark:text-white transition-colors duration-300 drop-shadow-md dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]";
        resSizeBadge.innerText = '0 KB';
        resSizeBadge.className = "text-xs font-bold px-3 py-1.5 bg-white/5 text-gray-500 border border-white/10 rounded-lg";
        statsTitle.innerText = "Ahorro de Peso";
        statsTitle.className = "text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400 tracking-widest mb-6 transition-colors duration-300";
        statsMsg.innerHTML = '<i data-lucide="activity" class="w-4 h-4 text-primary-400 inline-block mr-1"></i> Presiona comprimir';

        // 🟢 Mostrar el botón de la papelera
        document.getElementById('clearBtn').classList.remove('hidden');

        // 🟢 NUEVO: Actualizar la zona principal (Dropzone)
        document.getElementById('dropMainText').innerText = '¡Imagen Cargada!';
        document.getElementById('dropSubText').innerText = file.name;
        document.getElementById('dropIconCloud').classList.add('hidden');
        document.getElementById('dropIconImage').classList.remove('hidden');

        // 🚀 NUEVA NOTIFICACIÓN:
        Notify.show('Imagen Lista', 'Tu archivo ha sido cargado y está listo para comprimir.', 'info');

        // 📱💻 Control de Scroll Inteligente (Al subir 1 foto)
        setTimeout(() => {
            const element = document.getElementById('qualityRange');

            // Detectamos si es PC o Móvil
            const isDesktop = window.innerWidth >= 768;

            // 🟢 Bajamos el margen a 100 para centrar la vista en el área de trabajo en PC
            const offset = isDesktop ? 280 : 250;

            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }, 150);
    };
    reader.readAsDataURL(file);
}

// --- 🟢 Lógica de la Papelera (Eliminar Imagen de la interfaz) ---
document.getElementById('clearBtn').addEventListener('click', () => {
    triggerVibration([20, 20]);
    currentFile = null;
    batchFiles = []; // 🚀 NUEVO: Destruir la memoria del lote
    imageInput.value = ''; // Limpia el input real

    // Resetear visuales de Original
    origPreview.src = '';
    origPreview.classList.add('hidden');
    placeholderOrig.classList.remove('hidden');
    origSizeBadge.innerText = '0 KB';

    // 🟢 Ocultar Metadatos
    origFormatBadge.classList.add('hidden');
    origDimBadge.classList.add('hidden');
    resFormatBadge.classList.add('hidden');
    resDimBadge.classList.add('hidden');

    document.getElementById('clearBtn').classList.add('hidden'); // Ocultar papelera

    // 🚀 NUEVO: Ocultar y limpiar el Dashboard de Lotes
    batchDashboard.classList.add('hidden');
    batchGrid.innerHTML = '';

    // 🟢 Limpiar el campo de renombrado personalizado
    const batchRenameInput = document.getElementById('batchRenameInput');
    if (batchRenameInput) batchRenameInput.value = '';

    // 🟢 NUEVO: Restaurar textos de la zona principal (Dropzone)
    document.getElementById('dropMainText').innerText = 'Arrastra tu imagen aquí';
    document.getElementById('dropSubText').innerText = 'o haz clic para explorar tus archivos';
    document.getElementById('dropIconCloud').classList.remove('hidden');
    document.getElementById('dropIconImage').classList.add('hidden');

    // Resetear visuales de Resultado
    resPreview.src = '';
    resPreview.classList.add('hidden');
    document.getElementById('placeholderRes').classList.remove('hidden'); // 🟢 Restaurar el texto de espera
    downloadBtn.classList.add('hidden');

    savePercent.innerText = '0%';
    savePercent.className = "text-5xl font-black text-slate-800 dark:text-white transition-colors duration-300 drop-shadow-md dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]";
    resSizeBadge.innerText = '0 KB';
    resSizeBadge.className = "text-xs font-bold px-3 py-1.5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-500 border border-slate-200 dark:border-white/10 rounded-lg transition-colors";
    statsTitle.innerText = "Ahorro de Peso";
    statsTitle.className = "text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400 tracking-widest mb-6 transition-colors duration-300";
    statsMsg.innerHTML = '<i data-lucide="activity" class="w-4 h-4 text-primary-400 inline-block mr-1"></i> Esperando imagen...';

    // Restaurar botón de compresión por si había error
    compressBtn.innerHTML = '<i data-lucide="zap" class="w-5 h-5"></i> Comprimir';
    compressBtn.classList.remove('opacity-75', 'pointer-events-none');

    lucide.createIcons();

    // 🚀 NUEVA NOTIFICACIÓN 
    Notify.show('Lienzo Limpio', 'Se han eliminado las imágenes y reseteado los ajustes.', 'info');
});

// 🚀 VINCULACIÓN: El botón del Lote ahora activa la misma limpieza general
document.getElementById('clearBatchBtn')?.addEventListener('click', () => document.getElementById('clearBtn').click());

compressBtn.addEventListener('click', () => {
    // 1. Verificamos si no hay ni 1 foto ni un lote
    if (!currentFile && batchFiles.length === 0) {
        triggerVibration([100, 50, 100]);

        // 🐛 CORREGIDO: Cambiamos 'warning' por 'error' para que el sistema no colapse
        Notify.show('Falta la imagen', 'Por favor, sube al menos una imagen antes de intentar comprimir.', 'error');

        // 🚀 ANIMACIÓN MODERNA DE ATENCIÓN (Parpadeo Morado Intenso)
        // 🚀 1. SCROLL HACIA ARRIBA (Iniciamos rápido para guiar al usuario)
        setTimeout(() => {
            const element = document.getElementById('imageInput').parentElement;
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            window.scrollTo({ top: elementRect - bodyRect - offset, behavior: 'smooth' });
        }, 100);

        // 🚀 2. PARPADEO CON RETRASO (Ocurre justo cuando la vista llega arriba)
        setTimeout(() => {
            if (dropzone) {
                dropzone.classList.remove('animate-attention');
                void dropzone.offsetWidth; // Forzar reinicio de animación

                // Agregamos animación y un borde morado brillante temporal
                dropzone.classList.add('animate-attention', 'border-primary-500');

                // Limpiamos los efectos después de 0.6s
                setTimeout(() => {
                    dropzone.classList.remove('animate-attention', 'border-primary-500');
                }, 650);
            }
        }, 450); // 👈 Este retraso es la clave para que se vea espectacular
        return;
    }

    // 🚀 2. SI HAY UN LOTE, DISPARAMOS EL MOTOR SECUENCIAL Y DETENEMOS ESTA FUNCIÓN
    if (batchFiles.length > 0) {
        processBatchEngine();
        return;
    }

    // --- 3. LÓGICA ORIGINAL PARA 1 SOLA IMAGEN (Se queda intacta) ---
    triggerVibration(50);

    compressBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Procesando...';
    compressBtn.classList.add('opacity-75', 'pointer-events-none');
    lucide.createIcons();

    const maxDimension = parseInt(resizeSelect.value) || 0;

    new Compressor(currentFile, {
        quality: qualityRange.value / 100,
        mimeType: selectedFormat === 'auto' ? currentFile.type : selectedFormat,
        maxWidth: maxDimension === 0 ? Infinity : maxDimension,
        maxHeight: maxDimension === 0 ? Infinity : maxDimension,
        checkOrientation: exifToggle.checked,

        // 🚀 APLICAMOS EL MOTOR DE MARCA DE AGUA
        drew(context, canvas) { drawWatermark(context, canvas); },

        success(result) {
            const resUrl = URL.createObjectURL(result);
            resPreview.src = resUrl;
            resPreview.alt = "Imagen optimizada sin perder calidad de " + currentFile.name; // 🚀 INYECCIÓN SEO ALT

            // 🟢 Extraer dimensiones de la imagen Resultado
            resPreview.onload = () => {
                resDimBadge.innerText = `${resPreview.naturalWidth} x ${resPreview.naturalHeight}`;
                resDimBadge.classList.remove('hidden');
            };

            resPreview.classList.remove('hidden');
            document.getElementById('placeholderRes').classList.add('hidden'); // 🟢 Ocultar el texto de espera

            const resSizeKB = (result.size / 1024).toFixed(1);
            resSizeBadge.innerText = resSizeKB + ' KB';

            const savingPercent = ((1 - (result.size / currentFile.size)) * 100).toFixed(0);

            if (savingPercent <= 0) {
                savePercent.innerText = '0%';
                statsTitle.innerText = 'Sin cambios';
                statsTitle.className = "text-xs font-extrabold uppercase text-yellow-400 tracking-widest mb-6";
                savePercent.className = "text-5xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]";
                statsMsg.innerHTML = '<i data-lucide="shield" class="w-4 h-4 text-yellow-400 inline-block mr-1"></i> Previamente optimizada';
                resSizeBadge.className = "text-xs font-bold px-3 py-1.5 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded-lg";
            } else {
                savePercent.innerText = `-${savingPercent}%`;
                statsTitle.innerText = 'Optimización';
                statsTitle.className = "text-xs font-extrabold uppercase text-primary-400 tracking-widest mb-6";
                savePercent.className = "text-5xl font-black text-slate-900 dark:text-white drop-shadow-md dark:drop-shadow-[0_0_20px_rgba(139,92,246,0.8)]";
                statsMsg.innerHTML = '<i data-lucide="check-circle" class="w-4 h-4 text-primary-400 inline-block mr-1"></i> Calidad retenida con éxito';
                resSizeBadge.className = "text-xs font-bold px-3 py-1.5 bg-primary-500/20 text-primary-400 border border-primary-500/30 rounded-lg";
            }
            lucide.createIcons();

            triggerConfetti(); // 🚀 BUM! Confeti libre y sin restricciones matemáticas

            // 🏆 GAMIFICACIÓN: Sumar el ahorro al Impacto Global
            const savedBytes = currentFile.size - result.size;
            if (savedBytes > 0) {
                updateGlobalImpact(savedBytes);
            }

            // 🟢 SOLUCIÓN: Detectar la extensión correcta
            const extension = selectedFormat === 'image/webp' ? 'webp' :
                (selectedFormat === 'image/png' ? 'png' :
                    (selectedFormat === 'image/jpeg' ? 'jpg' : currentFile.name.split('.').pop()));

            // 📊 DASHBOARD: Registrar el formato usado en el perfil del usuario
            if (typeof updateDashboardStats === 'function') updateDashboardStats(extension);

            // 🚀 MÓDULO AUTO-SEO: Validación Inteligente Freemium (DB)
            const seoToggle = document.getElementById('seoToggle');
            const canUseSEO = DB.hasCredits(); // 🟢 Ahora la ÚNICA regla es tener saldo

            // Si intenta usarlo pero no tiene saldo, lo apagamos y empezamos la estrategia de venta
            if (seoToggle && seoToggle.checked && !canUseSEO) {
                seoToggle.checked = false;
                if (!DB.isUltra()) {
                    Notify.show('Créditos Gratis Agotados ⚡', 'Sube al Plan ULTRA para desbloquear el poder total.', 'warning');
                    if (typeof openUltraModal === 'function') openUltraModal();
                } else {
                    Notify.show('Créditos Agotados ⚡', 'Recarga energía IA para seguir optimizando.', 'error');
                    if (typeof openRechargeModal === 'function') openRechargeModal();
                }
            }

            if (seoToggle && seoToggle.checked && canUseSEO) {
                const seoContainer = document.getElementById('seoResults');
                if (seoContainer) {
                    seoContainer.innerHTML = '';
                    seoContainer.classList.remove('hidden');

                    const skeletonId = 'seo-loading-single';
                    const skeleton = document.createElement('div');
                    skeleton.id = skeletonId;
                    skeleton.className = "p-4 bg-primary-500/5 border border-primary-500/20 rounded-2xl animate-pulse flex items-center gap-3";
                    skeleton.innerHTML = `
                        <div class="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-black text-[10px]">1</div>
                        <div class="text-[10px] font-bold text-primary-600 uppercase tracking-widest">Analizando con IA...</div>
                    `;
                    seoContainer.appendChild(skeleton);

                    // Llamamos a la función global (que ahora vive segura en motor-lotes.js)
                    if (typeof generarAutoSEO === 'function') {
                        generarAutoSEO(result, 0, extension, skeletonId);
                    }
                }
            }

            // 🚀 NUEVA NOTIFICACIÓN DE ÉXITO
            Notify.show('¡Misión Cumplida!', savingPercent > 0 ? `Ahorraste un ${savingPercent}% de peso.` : 'Calidad optimizada al máximo.', 'success');

            // 🟢 Mostrar el formato final en la tarjetita visual
            resFormatBadge.innerText = extension.toUpperCase();
            resFormatBadge.classList.remove('hidden');

            setupDownload(resUrl, `compressly_${Date.now()}.${extension}`);

            compressBtn.innerHTML = '<i data-lucide="zap" class="w-5 h-5"></i> Comprimir';
            compressBtn.classList.remove('opacity-75', 'pointer-events-none');
            lucide.createIcons();

            triggerVibration([30, 50, 30]);

            // 📱💻 Control de Scroll Inteligente (Móvil vs PC)
            setTimeout(() => {
                // 🚀 Lógica Inteligente: Decidir a dónde mirar
                let element, offset;
                const isDesktop = window.innerWidth >= 768;

                if (seoToggle && seoToggle.checked && canUseSEO) {
                    // 🤖 Si el Auto-SEO está prendido, miramos hacia la caja del SEO
                    element = document.getElementById('seo-module-container');
                    offset = isDesktop ? 200 : 100;
                } else {
                    // 🖼️ Si no hay SEO, miramos hacia el tamaño de la imagen comprimida
                    element = document.getElementById('resSize');
                    offset = isDesktop ? 230 : 520;
                }

                if (element) {
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = element.getBoundingClientRect().top;
                    window.scrollTo({
                        top: (elementRect - bodyRect) - offset,
                        behavior: 'smooth'
                    });
                }
            }, 300);
        },
        error(err) {
            console.error(err.message);
            // 🚀 Usamos la notificación premium en vez del alert viejo
            Notify.show('Error de Compresión', 'Ocurrió un problema procesando la imagen. Intenta nuevamente.', 'error');
            compressBtn.innerHTML = '<i data-lucide="zap" class="w-5 h-5"></i> Comprimir';
            compressBtn.classList.remove('opacity-75', 'pointer-events-none');
            lucide.createIcons();
        },
    });
});

function setupDownload(url, filename) {
    downloadBtn.href = url;
    downloadBtn.download = filename;
    downloadBtn.classList.remove('hidden');
}


// 👑 ==========================================
// BLOQUEO ULTRA / RECARGA PARA MÓDULO SEO (Memoria Persistente)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const seoToggle = document.getElementById('seoToggle');

    if (seoToggle) {
        // 🧠 0. RECUPERAR MEMORIA AL RECARGAR LA PÁGINA
        setTimeout(() => {
            if (typeof DB !== 'undefined') {
                const isAutoSeoSaved = localStorage.getItem('auto_seo_enabled') === 'true';

                // 🚀 Ahora solo revisamos si TIENE CRÉDITOS para recordar el botón prendido
                if (isAutoSeoSaved && DB.hasCredits()) {
                    seoToggle.checked = true;
                } else {
                    seoToggle.checked = false;
                    localStorage.setItem('auto_seo_enabled', 'false');
                }
            }
        }, 150);

        // 🛡️ 1. Validamos el permiso ANTES de que el interruptor cambie de posición
        seoToggle.addEventListener('click', (e) => {
            if (typeof DB !== 'undefined') {

                // 🛑 PASO 1 (FUTURO SUPABASE): ¿Está logueado?
                // Como aún no tienes Supabase, usaremos el plan 'free' simulando que no está logueado,
                // y asumiremos que cuando se loguee le darás un estado interno de autenticado.
                // Por ahora, simularemos que si tiene el plan 'free' y 0 créditos, nunca se registró.

                const isLoggedIn = false; // 👈 En el futuro esto será: supabase.auth.getSession() !== null

                // Si NO está logueado, le pedimos que cree su cuenta para darle el regalo
                if (!isLoggedIn && DB.user.plan === 'free') {
                    e.preventDefault();
                    seoToggle.checked = false;
                    Notify.show('Requiere Cuenta Gratis ☁️', 'Regístrate o Inicia Sesión para reclamar tus 3 créditos de IA.', 'info');
                    if (typeof openProfileModal === 'function') openProfileModal();
                    return; // Cortamos la ejecución aquí
                }

                // 🚀 PASO 2: Si ya está logueado pero NO tiene créditos (Se le acabaron)
                if (!DB.hasCredits()) {
                    e.preventDefault();
                    seoToggle.checked = false;

                    // Estrategia de Venta
                    if (!DB.isUltra()) {
                        Notify.show('Créditos Agotados ⚡', 'Sube al Plan ULTRA para desbloquear el poder total.', 'warning');
                        if (typeof openUltraModal === 'function') openUltraModal();
                    } else {
                        Notify.show('Créditos Agotados ⚡', 'Recarga energía IA para seguir optimizando.', 'error');
                        if (typeof openRechargeModal === 'function') openRechargeModal();
                    }
                }
            }
        });

        // 🔔 2. Mostramos la notificación CUANDO el cambio es exitoso
        seoToggle.addEventListener('change', () => {
            // 💾 Guardamos la decisión del usuario en el disco duro de su navegador
            localStorage.setItem('auto_seo_enabled', seoToggle.checked);

            if (seoToggle.checked) {
                // Notificación al activar ✨
                if (typeof Notify !== 'undefined') {
                    Notify.show('Auto-SEO Activado', 'La IA procesará tus imágenes para optimizar el e-commerce.', 'success');
                }
            } else {
                // Notificación al desactivar 💤
                if (typeof Notify !== 'undefined') {
                    Notify.show('Auto-SEO Desactivado', 'Las imágenes se procesarán sin metadatos de IA.', 'info');
                }
            }

            // 📳 Vibración táctil si está disponible
            if (typeof triggerVibration === 'function') triggerVibration(30);
        });
    }
});