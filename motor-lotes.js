// 🚀 ==========================================
// MOTOR SECUENCIAL DE COMPRESIÓN POR LOTES
// ==========================================

// Convertimos el compresor en Promesa para poder procesarlas en fila india (async/await)
function compressFileAsync(file, quality, format, maxDimension, stripMetadata) {
    return new Promise((resolve, reject) => {
        new Compressor(file, {
            quality: quality / 100,
            mimeType: format === 'auto' ? file.type : format,
            maxWidth: maxDimension === 0 ? Infinity : maxDimension,
            maxHeight: maxDimension === 0 ? Infinity : maxDimension,
            checkOrientation: stripMetadata,

            // 🚀 APLICAMOS EL MOTOR DE MARCA DE AGUA AL LOTE
            drew(context, canvas) { drawWatermark(context, canvas); },

            success(result) { resolve(result); },
            error(err) { reject(err); }
        });
    });
}

async function processBatchEngine() {
    triggerVibration(50);

    const seoContainer = document.getElementById('seoResults');
    const seoToggle = document.getElementById('seoToggle');

    // 🚀 VALIDACIÓN TEMPRANA: Revisamos permisos ANTES de borrar el trabajo anterior
    let willUseSEO = false;
    if (seoToggle && seoToggle.checked) {
        // 🚀 Ahora solo exigimos tener saldo
        if (typeof DB !== 'undefined' && DB.hasCredits()) {
            willUseSEO = true;
        } else {
            seoToggle.checked = false;

            // Estrategia de Venta al quedarse sin saldo
            if (!DB.isUltra()) {
                Notify.show('Créditos Gratis Agotados ⚡', 'Sube al Plan ULTRA para desbloquear el poder total.', 'warning');
                if (typeof openUltraModal === 'function') openUltraModal();
            } else {
                Notify.show('Créditos Agotados ⚡', 'Recarga energía para seguir generando SEO.', 'error');
                if (typeof openRechargeModal === 'function') openRechargeModal();
            }
        }
    }

    // ✨ LIMPIEZA INTELIGENTE: Solo borramos el lienzo si la IA tiene permisos para pintar
    if (seoContainer && willUseSEO) {
        seoContainer.innerHTML = '';
        seoContainer.classList.remove('hidden');
    }

    // Cambiar estado del botón principal
    compressBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Procesando Lote...';
    compressBtn.classList.add('opacity-75', 'pointer-events-none');
    lucide.createIcons();

    // Crear el archivo ZIP virtual en la RAM
    const zip = new JSZip();
    const zipFolder = zip.folder("Compressly_Lote");

    let totalOriginalSize = 0;
    let totalCompressedSize = 0;
    const quality = qualityRange.value;
    const maxDimension = parseInt(resizeSelect.value) || 0;

    // 🔄 Bucle Secuencial (Una por una para no trabar el navegador del celular)
    for (let i = 0; i < batchFiles.length; i++) {
        const file = batchFiles[i];
        totalOriginalSize += file.size;

        // Actualizar tarjetita visual a "Comprimiendo..."
        const statusSpan = document.getElementById(`status-${i}`);
        if (statusSpan) {
            statusSpan.className = "text-primary-500 font-bold flex items-center gap-1";
            statusSpan.innerHTML = '<i data-lucide="loader-2" class="w-3 h-3 animate-spin"></i> Procesando...';
            lucide.createIcons();
        }

        try {
            // Comprimir la imagen mágicamente
            const compressedBlob = await compressFileAsync(file, quality, selectedFormat, maxDimension, exifToggle.checked);
            totalCompressedSize += compressedBlob.size;

            // Determinar extensión correcta
            const extension = selectedFormat === 'image/webp' ? 'webp' : (selectedFormat === 'image/png' ? 'png' : (selectedFormat === 'image/jpeg' ? 'jpg' : file.name.split('.').pop()));

            // 📊 DASHBOARD: Sumar al lote de estadísticas
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
                // 🏗️ Creamos un "esqueleto" de carga para que el usuario vea que se está analizando esta foto específica
                const skeletonId = `seo-loading-${i}`;
                const skeleton = document.createElement('div');
                skeleton.id = skeletonId;
                skeleton.className = "p-4 bg-primary-500/5 border border-primary-500/20 rounded-2xl animate-pulse flex items-center gap-3";
                skeleton.innerHTML = `
                    <div class="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-black text-[10px]">${i + 1}</div>
                    <div class="text-[10px] font-bold text-primary-600 uppercase tracking-widest">Analizando con IA...</div>
                `;
                seoContainer.appendChild(skeleton);

                // Llamada a la IA (Pasamos el ID del skeleton para reemplazarlo luego)
                await generarAutoSEO(compressedBlob, i, extension, skeletonId);
            }

            // Lógica Inteligente de Renombrado
            const customPrefix = document.getElementById('batchRenameInput').value.trim();
            let newFileName = '';

            if (customPrefix) {
                const padIndex = (i + 1).toString().padStart(2, '0');
                newFileName = `${customPrefix}_${padIndex}.${extension}`;
            } else {
                const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                newFileName = `${baseName}_compressly.${extension}`;
            }

            // 🚀 MOTOR DE CARPETAS INTELIGENTES
            if (useZipFolders) {
                const folder = zipFolder.folder(extension.toUpperCase());
                folder.file(newFileName, compressedBlob);
            } else {
                zipFolder.file(newFileName, compressedBlob);
            }

            // Actualizar tarjetita visual a "Listo"
            statusSpan.className = "text-green-500 font-bold flex items-center gap-1";
            statusSpan.innerHTML = '<i data-lucide="check-circle" class="w-3 h-3"></i> Listo';
            lucide.createIcons();

            // Actualizar porcentaje general en vivo
            const currentSaving = ((1 - (totalCompressedSize / totalOriginalSize)) * 100).toFixed(0);
            document.getElementById('batchSavePercent').innerText = currentSaving > 0 ? `-${currentSaving}%` : '0%';

        } catch (err) {
            console.error("Error comprimiendo", file.name, err);
            statusSpan.className = "text-red-500 font-bold flex items-center gap-1";
            statusSpan.innerHTML = '<i data-lucide="x-circle" class="w-3 h-3"></i> Error';
            lucide.createIcons();
        }
    }

    // Generar el archivo .zip final
    document.getElementById('batchStatsMsg').innerHTML = '<i data-lucide="folder-output" class="w-4 h-4 text-primary-500"></i> Empaquetando ZIP...';
    lucide.createIcons();

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const zipUrl = URL.createObjectURL(zipBlob);

    // 🏆 GAMIFICACIÓN: Sumar el ahorro total del lote al Impacto Global
    const batchSavedBytes = totalOriginalSize - totalCompressedSize;
    if (batchSavedBytes > 0) {
        updateGlobalImpact(batchSavedBytes);
    }

    document.getElementById('batchSavePercent').className = "text-xl font-black text-primary-500 drop-shadow-md";
    document.getElementById('batchStatsMsg').className = "text-sm text-green-500 font-bold flex items-center gap-1.5";
    document.getElementById('batchStatsMsg').innerHTML = '<i data-lucide="check-circle" class="w-4 h-4"></i> ¡Lote completado!';

    // Configurar y mostrar el botón de Descarga ZIP
    const downloadBatchBtn = document.getElementById('downloadBatchBtn');
    downloadBatchBtn.href = zipUrl;
    downloadBatchBtn.download = `Compressly_Lote_${Date.now()}.zip`;
    downloadBatchBtn.classList.remove('hidden');

    // Restaurar botón principal
    compressBtn.innerHTML = '<i data-lucide="zap" class="w-5 h-5"></i> Comprimir';
    compressBtn.classList.remove('opacity-75', 'pointer-events-none');
    lucide.createIcons();

    triggerConfetti();
    Notify.show('¡Lote Terminado!', `Tus ${batchFiles.length} imágenes están empaquetadas en un ZIP listas para descargar.`, 'success');

    triggerVibration([30, 50, 30]);

    // 📱💻 Control de Scroll Inteligente para Lotes 
    setTimeout(() => {
        const element = document.getElementById('batchSummary');
        const isDesktop = window.innerWidth >= 768;
        const offset = isDesktop ? 430 : 400;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        window.scrollTo({
            top: (elementRect - bodyRect) - offset,
            behavior: 'smooth'
        });
    }, 400);
}

// 🛍️ ==========================================
// MÓDULO AUTO-SEO (LÓGICA INDEPENDIENTE)
// ==========================================
async function generarAutoSEO(blob, index, currentExtension, skeletonId) {
    if (!navigator.onLine) {
        const skeleton = document.getElementById(skeletonId);
        if (skeleton) skeleton.innerHTML = '<div class="text-[9px] text-red-500 font-bold uppercase tracking-widest">Offline 📡 - Saltado</div>';
        return;
    }

    try {
        // 🚀 Creamos la miniatura aquí mismo para inyectarla en la tarjeta
        const previewUrl = URL.createObjectURL(blob);

        // 1. Convertir Blob a Base64
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        await new Promise(resolve => reader.onloadend = resolve);
        const base64data = reader.result.split(',')[1];

        // 2. Llamada al Agente Cloud
        const WORKER_URL = "https://agente-compressly.elitemarketing-a94.workers.dev";
        const response = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                isSEO: true,
                imageBase64: base64data,
                targetExtension: currentExtension
            })
        });

        if (!response.ok) throw new Error("Fallo en la respuesta de la IA");

        const seoData = await response.json();

        // ⚡ ¡CONSUMIMOS UN CRÉDITO PORQUE FUE UN ÉXITO!
        DB.consumeCredit();

        // ✨ REEMPLAZAR: Quitar el esqueleto y poner la tarjeta real
        const skeleton = document.getElementById(skeletonId);
        if (skeleton) {
            mostrarResultadosSEO(seoData, index, skeleton, previewUrl); // 👈 Pasamos la URL aquí
        }

    } catch (error) {
        console.error("Fallo Auto-SEO:", error);
        const skeleton = document.getElementById(skeletonId);
        if (skeleton) {
            // 🚀 Mensaje Premium y Amigable en lugar de un error técnico
            skeleton.classList.remove('animate-pulse', 'bg-primary-500/5');
            skeleton.classList.add('bg-red-500/10', 'border-red-500/30');
            skeleton.innerHTML = `
                <div class="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                    <i data-lucide="alert-triangle" class="w-4 h-4"></i>
                </div>
                <div>
                    <div class="text-[10px] font-black text-red-500 uppercase tracking-widest">Imagen Compleja</div>
                    <div class="text-[10px] text-slate-500 dark:text-gray-400 font-medium mt-0.5">La IA no pudo procesar esta imagen para E-commerce.</div>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();

            // 🛡️ Devolvemos el crédito si la IA falló
            if (typeof DB !== 'undefined') {
                DB.user.aiCredits++;
                DB.updateUI();
            }
        }
    }
}

// 📋 Utilidad para copiar al portapapeles mágicamente
window.copiarTextoSEO = function (texto) {
    navigator.clipboard.writeText(texto).then(() => {
        if (typeof Notify !== 'undefined') {
            Notify.show('¡Texto Copiado!', 'Listo para usar en tu catálogo o Plataforma de E-commerce.', 'success');
        }
        if (typeof triggerVibration === 'function') triggerVibration(20);
    });
};

function mostrarResultadosSEO(seoData, index, targetElement, previewUrl) {
    targetElement.classList.remove('animate-pulse', 'bg-primary-500/5', 'flex', 'items-center', 'gap-3');
    targetElement.className = "p-5 bg-white/60 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 animate-in zoom-in-95 duration-500";

    // 🚀 Creamos variables seguras reemplazando comillas dobles para que el HTML no se rompa
    const safeNombre = seoData.nombre_archivo ? seoData.nombre_archivo.replace(/"/g, '&quot;') : '';
    const safeAlt = seoData.alt_text ? seoData.alt_text.replace(/"/g, '&quot;') : '';
    const safeDesc = seoData.descripcion_corta ? seoData.descripcion_corta.replace(/"/g, '&quot;') : '';

    // 🚀 Se inyectan la miniatura real, botones de copiar y la lógica visual Premium
    targetElement.innerHTML = `
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-white/5">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm shrink-0">
                    <img src="${previewUrl}" class="w-full h-full object-cover" alt="Producto">
                </div>
                <div>
                    <div class="flex items-center gap-1.5 mb-0.5">
                        <span class="w-4 h-4 rounded-full bg-primary-500 text-white text-[8px] font-black flex items-center justify-center">0${index + 1}</span>
                        <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400">SEO Card</span>
                    </div>
                    <div class="text-[9px] font-bold text-primary-500 flex items-center gap-1">
                        <i data-lucide="sparkles" class="w-3 h-3"></i> Optimizado
                    </div>
                </div>
            </div>
            <img src="imagenes/compressly_logo2.png" class="w-4 h-4 md:w-5 md:h-5 opacity-30 grayscale" alt="IA">
        </div>
        <div class="space-y-4">
            
            <div class="relative group">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-[9px] font-black text-primary-500 uppercase tracking-tighter">Nombre Optimizado:</span>
                    <button onclick="copiarTextoSEO(this.getAttribute('data-text'))" data-text="${safeNombre}" class="text-slate-400 hover:text-primary-500 transition-colors p-1" title="Copiar nombre">
                        <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
                <p class="text-[11px] font-bold text-slate-800 dark:text-gray-200 leading-tight bg-slate-100 dark:bg-white/5 p-2.5 rounded-lg select-all border border-transparent group-hover:border-primary-500/30 transition-colors">${seoData.nombre_archivo}</p>
            </div>

            <div class="relative group">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-[9px] font-black text-primary-500 uppercase tracking-tighter">Texto ALT (Accesibilidad):</span>
                    <button onclick="copiarTextoSEO(this.getAttribute('data-text'))" data-text="${safeAlt}" class="text-slate-400 hover:text-primary-500 transition-colors p-1" title="Copiar ALT">
                        <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
                <p class="text-[11px] text-slate-600 dark:text-gray-400 italic leading-relaxed bg-slate-50 dark:bg-black/20 p-2.5 rounded-lg select-all border border-transparent group-hover:border-primary-500/30 transition-colors">${seoData.alt_text}</p>
            </div>

            <div class="pt-3 border-t border-slate-100 dark:border-white/5 relative group">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-[9px] font-black text-purple-500 uppercase tracking-tighter">Copy de Venta Sugerido:</span>
                    <button onclick="copiarTextoSEO(this.getAttribute('data-text'))" data-text="${safeDesc}" class="text-purple-400 hover:text-purple-600 transition-colors p-1" title="Copiar Copy">
                        <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
                <div class="text-[11px] text-slate-700 dark:text-gray-300 leading-relaxed bg-purple-500/5 p-3.5 rounded-xl border border-purple-500/10 select-all group-hover:border-purple-500/30 transition-colors">
                    ${seoData.descripcion_corta}
                </div>
            </div>
        </div>
    `;

    // Recargar iconos de Lucide
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // 🎯 LÓGICA DE SCROLL INTELIGENTE PARA AUTO-SEO
    setTimeout(() => {
        const seoContainer = document.getElementById('seo-module-container');
        if (seoContainer) {
            const isDesktop = window.innerWidth >= 768;
            const offset = isDesktop ? 200 : 100;

            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = seoContainer.getBoundingClientRect().top;

            window.scrollTo({
                top: (elementRect - bodyRect) - offset,
                behavior: 'smooth'
            });
        }
    }, 400);
}