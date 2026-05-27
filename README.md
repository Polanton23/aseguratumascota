# AseguraTuMascota.es

Comparador independiente de seguros para mascotas en España. Web estática construida con HTML + CSS + JS vanilla, desplegada en Cloudflare Pages.

## 🏗️ Estructura del proyecto

```
aseguratumascota/
├── index.html                  # Página de inicio
├── calculadora.html            # Calculadora interactiva multi-paso
├── comparativas.html           # Tabla comparativa de aseguradoras
├── blog.html                   # Listado de artículos
├── seguros-perros.html         # Categoría perros
├── seguros-gatos.html          # Categoría gatos
├── seguros-exoticos.html       # Categoría exóticos
├── 404.html                    # Página de error 404
├── articulos/
│   └── bulldog-frances.html    # Artículos individuales (uno por archivo)
├── legal/
│   ├── aviso-legal.html
│   ├── politica-privacidad.html
│   └── politica-cookies.html
├── assets/
│   ├── css/
│   │   └── styles.css          # Hoja de estilos única
│   ├── js/
│   │   └── script.js           # Calculadora + menú móvil
│   └── images/                 # Imágenes de la web
├── robots.txt                  # Configuración de crawlers
├── sitemap.xml                 # Mapa del sitio para Google
├── _headers                    # Headers HTTP de Cloudflare
├── _redirects                  # Redirects para URLs limpias
└── README.md                   # Este archivo
```

## 🚀 Cómo desplegar (resumen)

1. Sube este repo a GitHub
2. Conecta el repo a Cloudflare Pages
3. Cloudflare publica automáticamente en cada push

Guía completa de despliegue en `DEPLOY.md`.

## ✍️ Cómo añadir un nuevo artículo

1. Copia `articulos/bulldog-frances.html` y renómbralo con el slug de tu nuevo artículo, ej: `articulos/yorkshire-terrier.html`
2. Edita el contenido (título, h1, párrafos)
3. Añade un enlace al artículo desde `blog.html` y desde la categoría correspondiente
4. Añade la URL al `sitemap.xml`
5. Haz commit y push → la web se actualiza sola en 1 minuto

## 🎨 Cómo cambiar colores

Edita las variables CSS en `assets/css/styles.css` (al principio del archivo):

```css
:root {
  --color-primary: #1B4D3E;   /* Verde principal */
  --color-accent: #E8704A;    /* Naranja acento */
  --color-bg: #FBF8F3;        /* Fondo crema */
}
```

## 💰 AdSense

Los espacios publicitarios están marcados con `<div class="ad-placeholder">`. Para activar AdSense:

1. Aprueba tu cuenta en adsense.google.com
2. Añade el script en el `<head>` de cada HTML:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXX" crossorigin="anonymous"></script>
   ```
3. Sustituye cada `<div class="ad-placeholder">...</div>` por el código de tu bloque de anuncio

## 📊 Analytics

Para añadir Google Analytics 4, pega en el `<head>` de cada HTML:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXX');
</script>
```

## 🛠️ Stack

- HTML5 semántico
- CSS3 con variables (sin frameworks)
- JavaScript vanilla (sin librerías)
- Fuentes Google (Fraunces + DM Sans)
- Despliegue: Cloudflare Pages
- Repositorio: GitHub

## 📝 Licencia

Código propietario. Todos los derechos reservados.
