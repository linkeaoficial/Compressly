import * as photon from "@cf-wasm/photon";

/**
 * 🚀 COMPRESSLY CLOUD API - MOTOR UNIVERSAL (Backend WASM)
 * Arquitectura Serverless conectada a Supabase, Photon y R2
 * Capacidad: Validación + Límite 3MB + Compresión WASM + Guardado R2
 */

export default {
  async fetch(request, env, ctx) {
    // 🛡️ CAPA 1: CORS (El Diplomático) - Permite que otras webs hablen con tu API
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
    };

    // Si el navegador pregunta si puede pasar (Petición OPTIONS), le decimos que sí.
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // 📦 ✨ NUEVA CAPA: VISOR PÚBLICO R2 (PASO 1 LOGRADO)
    // Si la URL termina en .webp, sacamos la imagen del búnker y la mostramos.
    if (request.method === "GET" && url.pathname.includes(".webp")) {
      const fileName = url.pathname.substring(1); // Quitamos la barra "/"
      const object = await env.STORAGE.get(fileName);

      if (!object) {
        return new Response("Imagen no encontrada en el Búnker 🕵️‍♂️", { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("Access-Control-Allow-Origin", "*");

      return new Response(object.body, { headers });
    }

    // 🕵️‍♂️ CAPA 2: EXTRACCIÓN DE LA LLAVE (El Inspector)
    // Buscamos la llave en los Headers (x-api-key o Authorization) o en la URL
    const apiKey = request.headers.get("x-api-key") ||
      (request.headers.get("Authorization") || "").replace("Bearer ", "") ||
      url.searchParams.get("api_key");

    if (!apiKey) {
      return new Response(JSON.stringify({
        error: "Acceso Denegado 🛑",
        message: "Falta la API Key. Por favor, envíala en el header 'x-api-key'."
      }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 🚦 CAPA 2.5: SEMÁFORO INTELIGENTE NATIVO (Rate Limiting en el Worker) 👮‍♂️🛡️
    // ¡Como usas *.workers.dev, esto frena abusos antes de tocar Supabase!
    try {
      // Evaluamos la velocidad usando la API Key del cliente como identificador único
      const { success } = await env.API_LIMITER.limit({ key: `user_${apiKey}` });

      if (!success) {
        return new Response(JSON.stringify({
          error: "Demasiadas peticiones (429) 🚦",
          message: "¡Wow, vas muy rápido! El límite de Compressly es de 5 peticiones cada 10 segundos. Por favor, procesa en orden."
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    } catch (limiterError) {
      // Si el limitador interno de Cloudflare falla por un milisegundo, dejamos pasar para no romper el servicio
      console.error("Error temporal en el rate limiter:", limiterError);
    }

    // ⚡ CAPA 3: VALIDACIÓN EN SUPABASE (El Detective Edge)
    try {
      // Hacemos una consulta ultrarrápida a la API REST de Supabase (AHORA TRAEMOS LOS CRÉDITOS)
      const supabaseResponse = await fetch(
        `${env.SUPABASE_URL}/rest/v1/api_clients?api_key=eq.${apiKey}&select=id,name,plan_type,creditos_restantes`,
        {
          method: 'GET',
          headers: {
            "apikey": env.SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      const clientes = await supabaseResponse.json();

      // Si Supabase devuelve un array vacío, la llave es inventada o no existe
      if (!clientes || clientes.length === 0) {
        return new Response(JSON.stringify({
          error: "Llave Inválida ❌",
          message: "La API Key proporcionada no existe en Compressly Cloud."
        }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // ¡CLIENTE VALIDADO CON ÉXITO! 🎉
      const clienteData = clientes[0];

      // 🛑 BLOQUEO POR FALTA DE CRÉDITOS
      if (clienteData.creditos_restantes <= 0) {
        return new Response(JSON.stringify({
          error: "Sin créditos 🪙",
          message: "Has agotado tus créditos de compresión. Por favor, recarga tu cuenta en Compressly."
        }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // 📸 CAPA 4: RECEPCIÓN DE IMÁGENES Y PROCESAMIENTO UNIVERSAL
      // Si el cliente nos envía un archivo (Método POST)...
      if (request.method === "POST") {
        const contentType = request.headers.get("content-type") || "";

        // Verificamos que realmente sea una imagen
        if (!contentType.includes("image")) {
          return new Response(JSON.stringify({ error: "¡Eso no es una imagen! 🚫🖼️" }), { status: 400, headers: corsHeaders });
        }

        // Extraemos los binarios crudos para la máquina trituradora WASM
        const bytes = await request.arrayBuffer();
        const inputBytes = new Uint8Array(bytes);

        // 🚨 LÍMITE DE SEGURIDAD: 3MB para proteger la memoria RAM de tu servidor
        if (inputBytes.length > 3 * 1024 * 1024) {
          return new Response(JSON.stringify({
            error: "Imagen Demasiado Pesada 🐘",
            message: "El límite máximo para el procesamiento en la API es de 3MB para evitar sobrecargas."
          }), { status: 413, headers: corsHeaders });
        }

        /**
         * 🌀 MOTOR DE COMPRESIÓN ACTIVO (PHOTON WASM)
         * Aquí el archivo validado entra al "Pasillo de Transformación".
         */
        let photonImg = photon.PhotonImage.new_from_byteslice(inputBytes);
        const outputBytes = photonImg.get_bytes(); // Obtenemos la imagen optimizada

        // 🔐 ARQUITECTURA DE PREFIJOS R2 (Aislamiento Total)
        // Usamos la API Key (ej. CPLY-ABCD...) en lugar del nombre para evitar que dos clientes con el mismo nombre choquen.
        // Extraemos los primeros 15 caracteres de su api_key como su "Carpeta Segura"
        const prefijoSeguro = apiKey.substring(0, 15);

        // Construimos la ruta perfecta: CPLY-ABCD12345/zapatos_rojos.webp
        const fileName = `compressed-${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
        const filePath = `${prefijoSeguro}/${fileName}`;

        // 📦 CAPA 5: GUARDADO INTELIGENTE EN EL BÚNKER R2 (Ahora con estructura de carpetas)
        await env.STORAGE.put(filePath, outputBytes, {
          httpMetadata: {
            contentType: "image/webp",
            cacheControl: "public, max-age=604800" // 🚀 Cache para que la imagen cargue ultra rápido luego
          },
          customMetadata: {
            "propietario": clienteData.name,
            "tamano-original": inputBytes.length.toString(),
            "tamano-final": outputBytes.length.toString()
          }
        });

        // 🔗 GENERAMOS EL LINK PÚBLICO PARA EL CLIENTE (Apunta directo a su carpeta)
        const urlDescarga = `${url.origin}/${filePath}`;

        // 🚀 CAPA 5.5: COBRO, ESTADÍSTICAS E HISTORIAL EN SUPABASE
        await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/registrar_compresion_exitosa`, {
          method: 'POST',
          headers: {
            "apikey": env.SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${env.SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            u_id: clienteData.id,
            tipo_proceso: 'API',
            info_archivo: `Compresión ${(inputBytes.length / 1024).toFixed(2)} KB a ${(outputBytes.length / 1024).toFixed(2)} KB`,
            bytes_ahorrados: inputBytes.length - outputBytes.length,
            cant_webp: 1,
            cant_jpg: 0,
            cant_png: 0,
            es_api: true // 💡 ¡ESTA ES LA MAGIA QUE HACE QUE SE DESCUENTE EL CRÉDITO!
          })
        });

        // 📊 CAPA 6: REPORTE DE RENDIMIENTO AL CLIENTE
        // Le respondemos al cliente con todos los datos de éxito y el % de ahorro
        return new Response(JSON.stringify({
          status: "success ✅",
          message: "¡Imagen procesada, triturada y asegurada en el búnker!",
          archivo_guardado: filePath,
          link_descarga: urlDescarga,
          peso_original: `${(inputBytes.length / 1024).toFixed(2)} KB`,
          peso_final: `${(outputBytes.length / 1024).toFixed(2)} KB`,
          ahorro_porcentaje: `${((1 - (outputBytes.length / inputBytes.length)) * 100).toFixed(0)}%`,
          propietario: clienteData.name
        }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // 🌐 CAPA 7: RESPUESTA DE NAVEGADOR (Si solo entra a saludar con GET)
      return new Response(JSON.stringify({
        status: "success",
        message: "¡Bienvenido al Motor Universal Compressly Cloud (Photon WASM)! 🚀",
        cliente_autenticado: {
          nombre: clienteData.name,
          plan: clienteData.plan_type
        },
        info: "Para procesar una imagen, envía una petición POST con el archivo (Máx: 3MB). 📥"
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (error) {
      // Si los servidores explotan, capturamos el error
      return new Response(JSON.stringify({
        error: "Error Interno del Servidor 💥",
        message: error.message
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};