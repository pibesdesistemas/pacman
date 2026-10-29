# jsPacman — X (Twitter) Player Card Edition (Single Player)

Adaptación autocontenida del remake **Ms. Pac-Man** de [pacman.js.org](https://pacman.js.org/) (`8tentaculos/jsPacman`) preparada para ejecutarse de forma nativa dentro de un **Twitter/X Player Card** (`480 × 480 px`) y para alojarse en cualquier servicio de archivos estáticos sin requerir *bundlers* ni dependencias externas.

---

## Estructura de Archivos Clave

| Archivo | Rol según la Documentación Técnica |
| :--- | :--- |
| `index.html` | Punto de entrada con los metadatos `<meta name="twitter:card" content="player">` y Open Graph (`video.other`), además de permitir jugar directamente desde el navegador. |
| `play.html` | Cliente interactivo embebido en el `iframe` (`480 × 480`, 1:1) con pantalla de inicio obligatoria (`#overlay` + `#start-btn`), D-Pad virtual táctil y ciclo de vida *blur/visibility*. |
| `assets/preview.png` | Imagen de vista previa (`480 × 480 px`) con borde arcade y botón explícito `> PLAY` centrado (plan de contingencia / *fallback*). |
| `card-preview.html` | Simulador local de un post de X con el `iframe` sandboxed a `480 × 480 px` para probar el juego exactamente como se ve en el feed. |
| `js/vendor/rasti/` | Dependencia `rasti` vendoreada localmente para evitar bloqueos de CDN por políticas `Content-Security-Policy` dentro del sandbox. |
| `_headers` / `vercel.json` | Configuraciones listas para Cloudflare Pages, Netlify o Vercel con las cabeceras `Access-Control-Allow-Origin`, `X-Frame-Options` y `Content-Security-Policy: frame-ancestors`. |
| `server.js` | Servidor HTTP ligero de cero dependencias (`node server.js`) que sirve los estáticos inyectando las cabeceras de seguridad requeridas. |

---

## Cómo Probar Localmente

No necesitas instalar paquetes ni hacer *build*:

```bash
python3 server.py
# o si tienes Node.js instalado:
node server.js
```

Luego abre en tu navegador:
- **Simulador de Post en X (`480×480`):** `http://localhost:3000/card-preview.html`
- **Reproductor del Iframe (`play.html`):** `http://localhost:3000/play.html`
- **Página principal (`index.html`):** `http://localhost:3000/index.html`

---

## Cómo Hostear en GitHub Pages (`pibesdesistemas/pacman`)

Los metadatos en [`index.html`](file:///home/lucax/CODE/pacman/index.html) ya están configurados con el dominio final:
- `twitter:image` → `https://pibesdesistemas.github.io/pacman/assets/preview.png`
- `twitter:player` → `https://pibesdesistemas.github.io/pacman/play.html`
- `og:image` → `https://pibesdesistemas.github.io/pacman/assets/preview.png`

### Subir a GitHub:
```bash
git init -b main
git add .
git commit -m "Initial commit: jsPacman X Player Card"
git remote add origin https://github.com/pibesdesistemas/pacman.git
git push -u origin main
```

### Cache Busting al publicar en X:
Usa un parámetro de versión en la URL del post para forzar la lectura de la tarjeta en el crawler de X:
`https://pibesdesistemas.github.io/pacman/index.html?v=1.0.1`
