# 🚀 Guía de despliegue: GitHub + Cloudflare Pages

Esta guía te lleva desde "no tengo nada" hasta "mi web está online con dominio propio y HTTPS" en aproximadamente 45 minutos.

## 📋 Resumen del flujo

```
1. Crear cuenta en GitHub
2. Subir este repositorio
3. Crear cuenta en Cloudflare
4. Conectar el repo a Cloudflare Pages
5. (Opcional) Conectar dominio propio
```

Coste total: **0€** (o ~10€/año si quieres dominio propio).

---

## PASO 1: Cuenta de GitHub

1. Entra en **github.com**
2. Haz clic en **Sign up**
3. Elige un nombre de usuario, email y contraseña
4. Confirma tu email

Si ya tienes cuenta, pasa al paso 2.

---

## PASO 2: Subir este proyecto a GitHub

Tienes dos formas de hacerlo. Elige la que te resulte más cómoda.

### Forma A: Sin saber Git (más fácil)

1. En github.com, haz clic en el botón **+** arriba a la derecha → **New repository**
2. Configura el repo:
   - **Repository name:** `aseguratumascota`
   - **Description:** `Web de seguros para mascotas`
   - **Public** (déjalo público — necesario para el plan gratis de Cloudflare)
   - **NO** marques "Add a README file" (ya tenemos uno)
3. Haz clic en **Create repository**
4. En la pantalla siguiente verás "uploading an existing file" → **haz clic en ese enlace**
5. Arrastra **TODOS los archivos y carpetas** de este proyecto al área de subida
   - Importante: arrastra los archivos individuales, NO una carpeta padre
   - Sube `index.html`, `calculadora.html`, las carpetas `articulos/`, `assets/`, `legal/`, etc.
6. Espera a que se suban todos (1-2 minutos)
7. Baja hasta el fondo, escribe "Initial commit" en el mensaje
8. Haz clic en **Commit changes**

✅ Tu repositorio ya está en GitHub.

### Forma B: Con Git instalado (más rápido para el futuro)

```bash
# Desde la carpeta del proyecto:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TUUSUARIO/aseguratumascota.git
git push -u origin main
```

Sustituye TUUSUARIO por tu nombre de usuario de GitHub.

---

## PASO 3: Cuenta de Cloudflare

1. Entra en **cloudflare.com**
2. Haz clic en **Sign Up**
3. Pon email y contraseña
4. Confirma tu email

No te pide tarjeta. Plan gratuito sin restricciones para Pages.

---

## PASO 4: Conectar GitHub con Cloudflare Pages

1. Una vez dentro del dashboard de Cloudflare, busca en el menú lateral izquierdo: **Workers & Pages**
2. Haz clic en **Create application** → pestaña **Pages** → **Connect to Git**
3. Te pedirá autorizar Cloudflare para acceder a tu GitHub → autoriza
4. Selecciona tu repositorio: `aseguratumascota`
5. Haz clic en **Begin setup**

En la pantalla de configuración:

| Campo | Valor |
|---|---|
| Project name | `aseguratumascota` (o el que quieras) |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | (déjalo vacío) |
| Build output directory | `/` |
| Root directory | (déjalo vacío) |

6. Haz clic en **Save and Deploy**

Cloudflare empieza a desplegar. Tarda 30-60 segundos. Verás un log en tiempo real.

Cuando termine, te asigna una URL del tipo:
```
https://aseguratumascota.pages.dev
```

✅ **Tu web ya está online en el mundo entero**, con HTTPS, en la red CDN más rápida del planeta. Pruébala.

---

## PASO 5: Conectar tu dominio propio (opcional)

Si tienes (o quieres tener) un dominio como `aseguratumascota.es`:

### Opción A: Comprar dominio en Cloudflare (lo más fácil)

1. En el dashboard de Cloudflare → **Domain Registration** → **Register Domains**
2. Busca tu dominio (ej: `aseguratumascota.es`)
3. Lo compras (precios al coste: ~10€/año el .es, ~8€/año el .com)
4. El dominio queda automáticamente conectado a tu cuenta

### Opción B: Tienes el dominio en otro sitio (Namecheap, GoDaddy, Dondominio)

1. En Cloudflare dashboard → **Add a site** → escribe tu dominio
2. Elige plan **Free**
3. Cloudflare te da 2 nameservers (algo como `tina.ns.cloudflare.com` y `walt.ns.cloudflare.com`)
4. Ve al panel de tu registrador (donde compraste el dominio) y cambia los nameservers a los de Cloudflare
5. Espera 1-24 horas a que se propague

### Vincular el dominio al proyecto Pages

Con el dominio ya en tu cuenta Cloudflare:

1. Ve a **Workers & Pages** → tu proyecto `aseguratumascota`
2. Pestaña **Custom domains** → **Set up a custom domain**
3. Escribe tu dominio: `aseguratumascota.es`
4. Cloudflare configura automáticamente los DNS
5. En 1-5 minutos, tu dominio apunta a la web con HTTPS

✅ Listo. Tu web está en tudominio.es con SSL gratis automático.

---

## 🔄 Cómo actualizar la web a partir de ahora

### Si cambias UN archivo (ej: corregir una palabra)

1. En github.com, navega hasta el archivo
2. Haz clic en el icono del lápiz (Edit)
3. Haz los cambios en el editor web
4. Baja al final → escribe el mensaje del commit → **Commit changes**
5. Cloudflare detecta el cambio y republica automáticamente en 30-60 segundos

### Si cambias MUCHOS archivos a la vez

1. En la página del repo en GitHub → **Add file** → **Upload files**
2. Arrastra los archivos nuevos/modificados (sobrescriben los existentes)
3. Commit
4. Cloudflare republica solo

### Si quieres trabajar en local

Instala **GitHub Desktop** (gratis): desktop.github.com
- Clonas el repo en tu ordenador
- Editas archivos con cualquier editor (recomendado: VS Code, gratis)
- Desde GitHub Desktop, haces commit y push con dos clics

---

## 📊 Ver estadísticas de visitas (gratis)

Cloudflare Pages incluye **Web Analytics** gratis sin necesidad de Google Analytics:

1. En tu proyecto → pestaña **Analytics** → activa Web Analytics
2. Tienes datos de visitas, referrers, países y dispositivos sin scripts externos
3. Como bonus: **no necesitas banner de cookies para esto** (Cloudflare Analytics es privacy-friendly por diseño)

Para Google Analytics 4 también funciona, pégalo donde te indica el `README.md`.

---

## ✅ Checklist post-despliegue

Cuando todo esté online, repasa:

- [ ] La web carga en tudominio.es
- [ ] HTTPS funciona (candado verde en el navegador)
- [ ] Todas las páginas internas cargan (calculadora, comparativas, blog, etc.)
- [ ] La calculadora funciona (selecciona opciones y avanza)
- [ ] El menú móvil funciona en el móvil
- [ ] El sitemap es accesible en `tudominio.es/sitemap.xml`
- [ ] robots.txt es accesible en `tudominio.es/robots.txt`
- [ ] Página 404 funciona (entra a `tudominio.es/pagina-que-no-existe`)

---

## 🆘 Problemas comunes

### "La web carga pero sin estilos"
→ Verifica que la carpeta `assets/css/` y `assets/js/` se subieron correctamente. En GitHub deberías ver esas carpetas.

### "Mi dominio no funciona después de 24 horas"
→ Comprueba que cambiaste los nameservers en tu registrador. Usa whatsmydns.net para ver si propagaron.

### "Quiero ver cambios antes de que la web pública se actualice"
→ Cloudflare crea automáticamente **preview deployments** para cada commit. Tienes una URL temporal para cada cambio antes de pasarlo a producción. Lo configuras en Settings → Builds & deployments → Preview deployments.

### "Cómo añadir página de errores personalizada"
→ Ya está. El archivo `404.html` se sirve automáticamente cuando alguien entra a una URL que no existe.

---

## 🚀 Siguiente paso: AdSense

Cuando tengas 20-30 artículos publicados + las páginas legales:

1. Solicita aprobación en **adsense.google.com**
2. Pega el código de verificación en el `<head>` de tu `index.html`
3. Sube los cambios
4. Espera aprobación (de 1 día a 2 semanas)
5. Cuando te aprueben, sustituye cada `<div class="ad-placeholder">...</div>` por el código del bloque de AdSense

---

## 💡 Tips profesionales

- **Branches:** crea ramas como `dev` para probar cambios grandes antes de subirlos a producción
- **Issues:** usa la pestaña Issues de GitHub para anotar artículos pendientes, ideas, bugs
- **Releases:** marca versiones importantes con tags
- **README en cada carpeta:** ayuda a recordar qué hay en cada sitio cuando vuelvas en 6 meses

---

¿Dudas? Pregunta y te ayudo paso a paso.
