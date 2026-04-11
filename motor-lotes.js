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
        statusSpan.className = "text-primary-500 font-bold flex items-center gap-1";
        statusSpan.innerHTML = '<i data-lucide="loader-2" class="w-3 h-3 animate-spin"></i> Procesando...';
        lucide.createIcons();

        try {
            // Comprimir la imagen mágicamente
            const compressedBlob = await compressFileAsync(file, quality, selectedFormat, maxDimension, exifToggle.checked);
            totalCompressedSize += compressedBlob.size;

            // Determinar extensión correcta
            const extension = selectedFormat === 'image/webp' ? 'webp' : (selectedFormat === 'image/png' ? 'png' : (selectedFormat === 'image/jpeg' ? 'jpg' : file.name.split('.').pop()));

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