// --- FUNCIONES DE ELIMINACIÓN DE CUENTA ---

// 🔒 Lógica del Candado de Seguridad
window.toggleDeleteLock = function () {
    const btn = document.getElementById('confirmDeleteBtn');
    const icon = document.getElementById('lockIcon');
    const text = document.getElementById('lockText');

    if (btn.disabled) {
        // 🔓 Desbloquear
        btn.disabled = false;
        btn.className = "w-full bg-gradient-to-r from-red-600 to-rose-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-red-900/20 active:scale-95 flex items-center justify-center gap-2 transition-all border border-transparent";
        icon.setAttribute('data-lucide', 'unlock');
        icon.classList.add('text-red-500');
        text.innerText = "Botón Desbloqueado";
        text.classList.replace('text-gray-500', 'text-red-500');
        if (typeof triggerVibration !== 'undefined') triggerVibration([20, 30]);
    } else {
        // 🔒 Bloquear de nuevo
        btn.disabled = true;
        btn.className = "w-full bg-slate-800 text-gray-600 cursor-not-allowed font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 border border-white/5";
        icon.setAttribute('data-lucide', 'lock');
        icon.classList.remove('text-red-500');
        text.innerText = "Seguro Activado";
        text.classList.replace('text-red-500', 'text-gray-500');
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
};

window.openDeleteAccountModal = function () {
    closeSettingsModal(); // Cerramos el de ajustes primero

    // 🛡️ Forzar que el candado SIEMPRE esté cerrado al abrir
    const btn = document.getElementById('confirmDeleteBtn');
    if (btn && !btn.disabled) {
        toggleDeleteLock();
    }

    const modal = document.getElementById('deleteAccountModal');
    const content = document.getElementById('deleteAccountContent');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
    if (typeof lucide !== 'undefined') lucide.createIcons();
};

window.closeDeleteAccountModal = function () {
    const modal = document.getElementById('deleteAccountModal');
    const content = document.getElementById('deleteAccountContent');
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
};

window.ejecutarBorradoTotal = async function () {
    const btn = document.getElementById('confirmDeleteBtn');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> PROCESANDO BORRADO...';
    lucide.createIcons();

    try {
        const { data: { session } } = await supabaseClient.auth.getSession();

        if (session && session.user) {
            // 1. Borramos sus datos de cliente en la tabla pública
            const { error: dbError } = await supabaseClient
                .from('api_clients')
                .delete()
                .eq('id', session.user.id);

            if (dbError) throw dbError;

            // Nota: Para borrar el usuario de AUTH (la cuenta de login), 
            // normalmente necesitas un Edge Function porque un usuario no puede borrarse a sí mismo por SDK.
            // Pero al borrar su fila en 'api_clients', ya le quitas todos sus privilegios SaaS.
        }

        // 2. Notificamos y sacamos al usuario
        Notify.show('Datos Eliminados', 'Tu información ha sido borrada con éxito. Adiós 💔', 'info');

        setTimeout(() => {
            logoutUsuario(); // Esto hace el signOut final y recarga la página
        }, 2000);

    } catch (error) {
        Notify.show('Error', 'No pudimos completar el borrado. Intenta más tarde.', 'error');
        btn.disabled = false;
        btn.innerHTML = originalHTML;
        lucide.createIcons();
    }
};


// =====================================================================
// 🔐 FUNCIÓN PARA CAMBIAR CONTRASEÑA (MODERN MAGIC LINK CON SEGURO)
// =====================================================================

window.solicitarCambioPassword = async function (boton) {

    // 🛡️ ESCUDO CONTRA CLICS ACCIDENTALES (Botón Inteligente de Doble Paso)
    if (!boton.dataset.confirmado) {
        // Paso 1: Pedir confirmación visual en el mismo botón
        boton.dataset.confirmado = "true";
        boton.dataset.originalHtml = boton.innerHTML;

        boton.innerHTML = `
            <div class="flex items-center gap-3">
                <i data-lucide="alert-triangle" class="w-5 h-5 text-red-500 animate-pulse"></i>
                <span class="text-red-500 font-black">¿Confirmar envío al correo?</span>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-red-400"></i>
        `;
        boton.classList.add('!border-red-500/50', '!bg-red-500/5'); // Tinte rojo de alerta

        if (typeof lucide !== 'undefined') lucide.createIcons();
        if (typeof triggerVibration !== 'undefined') triggerVibration([15, 15]);

        // ⏱️ Auto-cancelación: Si ignora la alerta por 3 segundos, lo regresamos a la normalidad
        setTimeout(() => {
            if (boton.dataset.confirmado) {
                delete boton.dataset.confirmado;
                boton.innerHTML = boton.dataset.originalHtml;
                boton.classList.remove('!border-red-500/50', '!bg-red-500/5');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }, 3000);

        return; // Detenemos la función aquí hasta que haga el segundo clic
    }

    // 🚀 Si llegamos aquí, es porque hizo el SEGUNDO clic (Usuario Confirmó)
    delete boton.dataset.confirmado;
    boton.classList.remove('!border-red-500/50', '!bg-red-500/5');

    // 1. Extraemos el correo que ya está en la pantalla
    const emailElement = document.getElementById('settingsEmailDisplay');
    const email = emailElement ? emailElement.innerText : null;

    if (!email || email === 'usuario@ejemplo.com') {
        if (typeof Notify !== 'undefined') Notify.show('Error', 'No se detectó una cuenta válida.', 'error');
        return;
    }

    // 2. Efecto visual de carga en el botón (Bloquea spam)
    const textoOriginal = boton.dataset.originalHtml; // Guardamos el diseño original por si falla
    boton.innerHTML = '<div class="flex items-center justify-center gap-3 w-full"><i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i><span class="font-bold">Enviando enlace...</span></div>';
    boton.disabled = true;

    try {
        // 3. 🚀 LA MAGIA DE SUPABASE
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/?reset=true',
        });

        if (error) throw error;

        // 4. Transformamos el Contenido (Buscamos el contenedor de perfil o bento)
        const modalContent = boton.closest('.bento-card') || document.getElementById('profileContent') || document.getElementById('settingsContent');

        if (modalContent) {
            modalContent.innerHTML = `
                <div class="text-center py-12 animate-in fade-in zoom-in duration-300">
                    <div class="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-green-500 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                        <i data-lucide="mail-check" class="w-10 h-10"></i>
                    </div>
                    <h2 class="text-2xl font-black text-white mb-3">¡Correo Enviado!</h2>
                    <p class="text-gray-400 text-sm leading-relaxed mb-8">
                        Hemos enviado las instrucciones a:<br>
                        <b class="text-primary-400 mt-1 inline-block">${email}</b>
                    </p>
                    <p class="text-[10px] text-gray-500 uppercase tracking-widest font-bold animate-pulse">Finalizando sesión de seguridad...</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        // 5. Cierre automático y silencioso después de 4 segundos
        setTimeout(() => {
            if (typeof closeSettingsModal === 'function') closeSettingsModal();
            if (typeof closeProfileModal === 'function') closeProfileModal();
        }, 4000);

    } catch (error) {
        // Si hay error, regresamos el botón a la normalidad para que intente de nuevo
        if (typeof Notify !== 'undefined') {
            Notify.show('Ups...', error.message, 'error');
        }
        boton.innerHTML = textoOriginal;
        boton.disabled = false;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
};

// =====================================================================
// 🔐 FUNCIÓN PARA GUARDAR LA CONTRASEÑA DEFINITIVAMENTE
// =====================================================================
window.actualizarPasswordFinal = async function (e) {
    e.preventDefault();
    const nuevaPass = document.getElementById('newPasswordInput').value;
    const btn = document.getElementById('btnUpdatePass');

    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Guardando...';
    if (typeof lucide !== 'undefined') lucide.createIcons();

    try {
        // 🚀 LLAMADA REAL A SUPABASE
        const { error } = await supabaseClient.auth.updateUser({ password: nuevaPass });

        if (error) throw error;

        if (typeof Notify !== 'undefined') {
            Notify.show('¡Éxito!', 'Tu contraseña ha sido actualizada. Ya puedes entrar.', 'success');
        }

        // Cerramos el modal y limpiamos la URL
        const modal = document.getElementById('resetPasswordModal');
        if (modal) modal.classList.add('hidden');

        window.history.replaceState({}, document.title, "/");

    } catch (error) {
        if (typeof Notify !== 'undefined') {
            Notify.show('Error', error.message, 'error');
        }
        btn.disabled = false;
        btn.innerText = 'Guardar Cambios';
    } finally {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
};

// =====================================================================
// 📝 FUNCIÓN PARA ACTUALIZAR NOMBRE / EMPRESA
// =====================================================================
window.guardarNombreUsuario = async function (btn) {
    const input = document.getElementById('settingsNameInput');
    const nuevoNombre = input.value.trim();

    // Obtenemos el UUID oculto del usuario
    const internalDisplay = document.getElementById('userInternalIdDisplay');
    const userId = internalDisplay ? internalDisplay.getAttribute('data-uuid') : null;

    if (!userId) return;

    // 🔄 Efecto visual de carga
    const iconOriginal = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>';
    if (typeof lucide !== 'undefined') lucide.createIcons();

    try {
        // 🚀 LLAMADA A SUPABASE: Actualizamos solo la columna 'name'
        const { error } = await supabaseClient
            .from('api_clients')
            .update({ name: nuevoNombre })
            .eq('id', userId);

        if (error) throw error;

        // ✅ Notificación de Éxito
        if (typeof Notify !== 'undefined') {
            Notify.show('¡Actualizado!', 'Tu información ha sido guardada exitosamente.', 'success');
        }

        // 🎨 Actualizar la interfaz inmediatamente sin recargar
        const profileNameDisplay = document.getElementById('profileNameDisplay');
        if (profileNameDisplay) {
            if (nuevoNombre) {
                profileNameDisplay.innerText = `Hola, ${nuevoNombre}`;
            } else {
                // Si el usuario borró el nombre, volvemos a mostrar su correo
                const email = document.getElementById('userEmailDisplay').innerText;
                const nombreCorto = email.split('@')[0];
                const nombreFormateado = nombreCorto.charAt(0).toUpperCase() + nombreCorto.slice(1);
                profileNameDisplay.innerText = `Hola, ${nombreFormateado}`;
            }
        }

    } catch (error) {
        if (typeof Notify !== 'undefined') {
            Notify.show('Error', 'No se pudo guardar la información. Intenta más tarde.', 'error');
        }
    } finally {
        // 🔄 Restaurar el botón
        btn.innerHTML = iconOriginal;
        btn.disabled = false;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
};

// =====================================================================
// 💾 FUNCIÓN PARA GUARDAR PRESETS Y SUBIR MARCA DE AGUA AL BÚNKER
// =====================================================================
window.guardarAjustesPorDefecto = async function (btn) {
    const internalDisplay = document.getElementById('userInternalIdDisplay');
    const userId = internalDisplay ? internalDisplay.getAttribute('data-uuid') : null;

    if (!userId) {
        if (typeof Notify !== 'undefined') Notify.show('Aviso', 'Inicia sesión para guardar presets.', 'warning');
        return;
    }

    // 1. Recolectamos TODO directamente de la pantalla
    const calidad = document.getElementById('qualityRange').value;
    const formatoVisual = typeof selectedFormat !== 'undefined' ? selectedFormat : 'image/webp';
    const redimensionar = document.getElementById('resizeSelect').value;
    const wmTexto = document.getElementById('watermarkInput').value.trim();
    const antiRastreo = document.getElementById('exifToggle').checked;
    const autoDescarga = document.getElementById('autoDownloadToggle') ? document.getElementById('autoDownloadToggle').checked : false;

    let misAjustes = {
        calidad: parseInt(calidad),
        formato: formatoVisual,
        redimensionar: parseInt(redimensionar),
        wm_texto: wmTexto,
        anti_rastreo: antiRastreo,
        auto_descarga: autoDescarga
    };

    const iconOriginal = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Guardando...';
    if (typeof lucide !== 'undefined') lucide.createIcons();

    try {
        const logoInput = document.getElementById('watermarkLogoInput');
        const clearLogoBtn = document.getElementById('clearWatermarkLogoBtn');
        const logoVisibleEnPantalla = clearLogoBtn && !clearLogoBtn.classList.contains('hidden');

        // 3. ¿Seleccionó un LOGO NUEVO? ☁️
        if (logoInput && logoInput.files.length > 0) {
            const archivo = logoInput.files[0];
            const rutaArchivo = `${userId}/watermark_logo.png`; // Mantenemos el mismo nombre siempre

            // Subimos a Supabase DIRECTAMENTE (Con upsert en TRUE para sobrescribir)
            const { error: uploadError } = await supabaseClient
                .storage.from('user_assets').upload(rutaArchivo, archivo, { cacheControl: '1', upsert: true });

            if (uploadError) throw uploadError;

            // Obtenemos URL limpia y le agregamos un "?t=" para forzar que la pantalla actualice la nueva imagen
            const { data: publicUrlData } = supabaseClient.storage.from('user_assets').getPublicUrl(rutaArchivo);
            misAjustes.wm_logo_url = `${publicUrlData.publicUrl}?t=${Date.now()}`;

        }
        // 4. Si NO subió nada nuevo, comprobamos si el logo sigue en pantalla...
        else {
            // Si la papelera se ve, es que la imagen existe y hay que conservarla
            if (logoVisibleEnPantalla) {
                const { data: oldData } = await supabaseClient.from('api_clients').select('ajustes_default').eq('id', userId).single();
                if (oldData && oldData.ajustes_default && oldData.ajustes_default.wm_logo_url) {
                    // Solo refrescamos el "?t=" para evitar el caché
                    const baseUrL = oldData.ajustes_default.wm_logo_url.split('?')[0];
                    misAjustes.wm_logo_url = `${baseUrL}?t=${Date.now()}`;
                } else {
                    misAjustes.wm_logo_url = null;
                }
            }
            // Si la papelera NO se ve, significa que el usuario la borró visualmente, así que la borramos en base de datos.
            else {
                misAjustes.wm_logo_url = null;
            }
        }

        // 5. Guardamos todo el JSONB en la base de datos
        const { error: dbError } = await supabaseClient
            .from('api_clients')
            .update({ ajustes_default: misAjustes })
            .eq('id', userId);

        if (dbError) throw dbError;

        if (typeof Notify !== 'undefined') Notify.show('Presets Guardados', 'Tus ajustes en la nube están listos.', 'success');

    } catch (error) {
        console.error(error);
        if (typeof Notify !== 'undefined') Notify.show('Error', 'No se pudieron guardar los ajustes.', 'error');
    } finally {
        btn.innerHTML = iconOriginal;
        btn.disabled = false;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
};

// =====================================================================
// 👤 FUNCIÓN PARA SUBIR Y COMPRIMIR LA FOTO DE PERFIL (AVATAR)
// =====================================================================
window.subirAvatarPerfil = async function (input) {
    const file = input.files[0];
    if (!file) return;

    const internalDisplay = document.getElementById('userInternalIdDisplay');
    const userId = internalDisplay ? internalDisplay.getAttribute('data-uuid') : null;
    if (!userId) return;

    // Identificamos las dos imágenes (La de ajustes y la del perfil principal)
    const iconS = document.getElementById('settingsAvatarIcon');
    const imgS = document.getElementById('settingsAvatarImg');
    const iconP = document.getElementById('profileAvatarIcon');
    const imgP = document.getElementById('profileAvatarImg');

    // Efecto de carga solo en el botón que tocamos (Ajustes)
    if (iconS) {
        iconS.setAttribute('data-lucide', 'loader-2');
        iconS.classList.add('animate-spin');
        iconS.classList.remove('hidden');
    }
    if (imgS) imgS.classList.add('hidden', 'opacity-50');
    lucide.createIcons();

    try {
        // 🚀 MAGIA: Usamos Compressor.js para achicar la foto a 400x400 y pasarla a WebP
        new Compressor(file, {
            quality: 0.9,
            maxWidth: 400,
            maxHeight: 400,
            mimeType: 'image/webp',
            async success(resultBlob) {
                const rutaArchivo = `${userId}/avatar.webp`; // Nombre fijo para no acumular basura

                // 1. Subir al Búnker (Supabase Storage) ☁️
                const { error: uploadError } = await supabaseClient
                    .storage.from('user_assets').upload(rutaArchivo, resultBlob, {
                        cacheControl: '0',
                        upsert: true,
                        contentType: 'image/webp' // 🚀 Le gritamos a Supabase que es un archivo nuevo
                    });

                if (uploadError) throw uploadError;

                // 2. Obtener URL y guardar en la Base de Datos (api_clients)
                const { data: urlData } = supabaseClient.storage.from('user_assets').getPublicUrl(rutaArchivo);
                const finalUrl = `${urlData.publicUrl}?t=${Date.now()}`; // Evita el caché en el navegador del cliente

                const { error: dbError } = await supabaseClient
                    .from('api_clients').update({ avatar_url: finalUrl }).eq('id', userId);

                if (dbError) throw dbError;

                // 3. Pintar la imagen en AMBOS lados al instante 🎨
                if (imgS && iconS) {
                    imgS.src = finalUrl;
                    imgS.classList.remove('hidden', 'opacity-50');
                    iconS.classList.add('hidden');
                    iconS.classList.remove('animate-spin');
                    iconS.setAttribute('data-lucide', 'user');
                }
                if (imgP && iconP) {
                    imgP.src = finalUrl;
                    imgP.classList.remove('hidden');
                    iconP.classList.add('hidden');
                    iconP.classList.remove('animate-spin');
                    iconP.setAttribute('data-lucide', 'user');
                }

                // Mostrar el botón de la papelera
                document.getElementById('clearAvatarBtn')?.classList.remove('hidden');

                if (typeof Notify !== 'undefined') Notify.show('¡Avatar Listo!', 'Tu foto de perfil ha sido actualizada.', 'success');
            },
            error(err) { throw err; }
        });
    } catch (error) {
        console.error(error);
        if (typeof Notify !== 'undefined') Notify.show('Error', 'No se pudo actualizar el avatar.', 'error');
        if (iconS) {
            iconS.setAttribute('data-lucide', 'user');
            iconS.classList.remove('animate-spin');
        }
        lucide.createIcons();
    }
};


// =====================================================================
// 🗑️ FUNCIÓN PARA ELIMINAR LA FOTO DE PERFIL (AVATAR)
// =====================================================================
window.eliminarAvatarPerfil = async function (event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const internalDisplay = document.getElementById('userInternalIdDisplay');
    const userId = internalDisplay ? internalDisplay.getAttribute('data-uuid') : null;

    if (!userId) return;

    // Botón que pulsó
    const btn = event.currentTarget;
    const originalIcon = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-3.5 h-3.5 animate-spin"></i>';
    if (typeof lucide !== 'undefined') lucide.createIcons();

    try {
        // 1. Borramos la URL de la base de datos
        const { error: dbError } = await supabaseClient
            .from('api_clients')
            .update({ avatar_url: null })
            .eq('id', userId);

        if (dbError) throw dbError;

        // 2. Opcional: Borramos el archivo físico del Búnker
        await supabaseClient.storage.from('user_assets').remove([`${userId}/avatar.webp`]);

        // 3. Restauramos la interfaz visualmente (Ajustes y Perfil)
        const iconS = document.getElementById('settingsAvatarIcon');
        const imgS = document.getElementById('settingsAvatarImg');
        const iconP = document.getElementById('profileAvatarIcon');
        const imgP = document.getElementById('profileAvatarImg');
        const clearBtn = document.getElementById('clearAvatarBtn');

        if (imgS && iconS) {
            imgS.src = '';
            imgS.classList.add('hidden');
            iconS.setAttribute('data-lucide', 'user');
            iconS.classList.remove('hidden', 'animate-spin');
        }
        if (imgP && iconP) {
            imgP.src = '';
            imgP.classList.add('hidden');
            iconP.setAttribute('data-lucide', 'user');
            iconP.classList.remove('hidden', 'animate-spin');
        }
        if (clearBtn) {
            clearBtn.classList.add('hidden'); // Ocultamos la papelera
        }

        if (typeof Notify !== 'undefined') Notify.show('Avatar Eliminado', 'Tu foto de perfil ha sido borrada.', 'info');

    } catch (error) {
        console.error("Error borrando avatar:", error);
        if (typeof Notify !== 'undefined') Notify.show('Error', 'No se pudo eliminar la foto.', 'error');
    } finally {
        btn.innerHTML = originalIcon;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
};


// =====================================================================
// 🧑‍💻 FUNCIÓN PARA REGENERAR API KEY (ZONA DE DESARROLLADOR)
// =====================================================================
window.regenerarApiKey = async function (btn) {
    // 🛡️ ESCUDO DE CONFIRMACIÓN (Doble Clic)
    if (!btn.dataset.confirmado) {
        btn.dataset.confirmado = "true";
        btn.dataset.originalHtml = btn.innerHTML;

        btn.innerHTML = `
            <div class="flex items-center gap-3 w-full justify-center">
                <i data-lucide="alert-triangle" class="w-4 h-4 animate-pulse"></i>
                <span class="font-black uppercase tracking-widest text-[11px]">¿Confirmar?</span>
            </div>
        `;
        btn.classList.replace('bg-red-500/5', 'bg-red-500');
        btn.classList.replace('text-red-600', 'text-white');
        btn.classList.replace('dark:text-red-400', 'dark:text-white');

        if (typeof lucide !== 'undefined') lucide.createIcons();
        if (typeof triggerVibration !== 'undefined') triggerVibration([15, 15]);

        // Auto-cancelación si ignora la alerta
        setTimeout(() => {
            if (btn.dataset.confirmado) {
                delete btn.dataset.confirmado;
                btn.innerHTML = btn.dataset.originalHtml;
                btn.classList.replace('bg-red-500', 'bg-red-500/5');
                btn.classList.replace('text-white', 'text-red-600');
                btn.classList.replace('dark:text-white', 'dark:text-red-400');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }, 3000);
        return;
    }

    // 🚀 INICIO DEL PROCESO (Confirmado)
    delete btn.dataset.confirmado;
    const internalDisplay = document.getElementById('userInternalIdDisplay');
    const userId = internalDisplay ? internalDisplay.getAttribute('data-uuid') : null;

    if (!userId) {
        if (typeof Notify !== 'undefined') Notify.show('Error', 'No se pudo identificar la cuenta.', 'error');
        return;
    }

    const textoOriginal = btn.dataset.originalHtml;
    btn.innerHTML = '<div class="flex items-center gap-2 justify-center w-full"><i data-lucide="loader-2" class="w-4 h-4 animate-spin text-white"></i><span class="text-white font-bold text-xs">Regenerando...</span></div>';
    btn.disabled = true;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    try {
        // 1. Generamos una nueva API Key de grado militar (CPLY-API- + 15 caracteres HEX)
        const arraySeguro = new Uint8Array(15);
        window.crypto.getRandomValues(arraySeguro);

        const caracteresHex = '0123456789ABCDEF';
        let codigoAleatorio = '';

        for (let i = 0; i < 15; i++) {
            codigoAleatorio += caracteresHex[arraySeguro[i] % 16];
        }

        const nuevaLlave = `CPLY-API-${codigoAleatorio}`;

        // 2. Actualizamos en Supabase
        const { error: dbError } = await supabaseClient
            .from('api_clients')
            .update({ api_key: nuevaLlave })
            .eq('id', userId);

        if (dbError) throw dbError;

        // 3. Actualizamos la Interfaz Localmente (El motor de estado de data_compressly)
        if (typeof DB !== 'undefined' && DB.user) {
            DB.user.apiKey = nuevaLlave;
            DB.updateUI(); // Esto refresca la pantalla principal del perfil
        }

        if (typeof Notify !== 'undefined') {
            Notify.show('API Key Renovada', 'Tu antigua llave ha sido invalidada inmediatamente.', 'success');
        }

        // Cerramos el modal de ajustes para que vea su nueva llave en el perfil
        if (typeof closeSettingsModal === 'function') closeSettingsModal();

    } catch (error) {
        console.error("Error regenerando llave:", error);
        if (typeof Notify !== 'undefined') Notify.show('Error', 'No se pudo regenerar la llave. Intenta de nuevo.', 'error');
        btn.disabled = false;
        btn.innerHTML = textoOriginal;
        btn.classList.replace('bg-red-500', 'bg-red-500/5');
        btn.classList.replace('text-white', 'text-red-600');
        btn.classList.replace('dark:text-white', 'dark:text-red-400');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
};

// =====================================================================
// 🤫 FUNCIÓN MAESTRA: SINCRONIZACIÓN SILENCIOSA DE PRESETS
// =====================================================================
window.actualizarPresetSilencioso = async function (clave, valor) {
    const internalDisplay = document.getElementById('userInternalIdDisplay');
    const userId = internalDisplay ? internalDisplay.getAttribute('data-uuid') : null;

    // Si es invitado o no hay conexión, ignoramos
    if (!userId || userId === '---' || typeof supabaseClient === 'undefined') return;

    try {
        // 1. Descargamos los presets actuales de la Nube para NO romper/borrar el resto (Calidad, Formato, etc)
        const { data } = await supabaseClient.from('api_clients').select('ajustes_default').eq('id', userId).single();
        let ajustesActuales = data && data.ajustes_default ? data.ajustes_default : {};

        // 2. Modificamos SOLO el valor que queremos (ej. el texto, o vaciar el logo a null)
        ajustesActuales[clave] = valor;

        // 3. Subimos la actualización en silencio ☁️
        await supabaseClient.from('api_clients').update({ ajustes_default: ajustesActuales }).eq('id', userId);
        console.log(`☁️✅ Sincronización silenciosa completada: ${clave} actualizado.`);
    } catch (e) {
        console.error("Error en sincronización silenciosa:", e);
    }
};
