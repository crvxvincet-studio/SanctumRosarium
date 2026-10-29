# Sanctum Rosarium · Santo Rosario Tradicional PWA (Beta 1)

**Instaurare Omnia in Christo**

Aplicación Web Progresiva (PWA) de estética litúrgica tradicional para el rezo del **Santo Rosario Tradicional** en Latín Eclesiástico (*more romano*) y Español con traducciones teológicamente exactas, meditaciones bíblicas y patrísticas rotativas pre-1958 y banco verificable de Arte Sacro con licencia **CC0 / Dominio Público (PD-100)**.

## Estructura del Repositorio para GitHub Pages

- `index.html`: Aplicación principal con soporte offline, meta tags de Apple (`viewport-fit=cover`, `apple-touch-icon`), portada con los Sagrados Corazones, navegación `<` y `>`, contador en números romanos (`Ave Maria I ex X`) y *ribbon* sutil de configuración.
- `manifest.json`: Manifiesto Web App válido (`Santo Rosario · Beta 1`, orientación `portrait-primary`, color `#4a1c1c`, fondo `#f8f1e3`).
- `sw.js`: Service Worker con estrategia **Stale-While-Revalidate**, precache de oraciones e iconos, limpieza de cachés antiguas y respaldo automático al Crucifijo SVG/PNG cuando no hay red.
- `data/oraciones-tradicionales.json`: Corpus completo de oraciones en latín y español con nota dogmática sobre la *Oratio Fátima* (*«alléva ánimas Purgatórii, præsértim illas quæ máxime relíctæ sunt»* / *«alivia a las almas del purgatorio, especialmente a las más olvidadas»*).
- `data/misterios-meditaciones.json`: Los 15 Misterios Tradicionales (*Gaudiosa*, *Dolorosa*, *Gloriosa*), con **3 citas bíblicas y 3 meditaciones rotativas por misterio** (45 citas y 45 meditaciones en total).
- `data/banco-arte-sacro-cc0.json`: Catálogo verificable de 15 obras maestras de arte sacro en Dominio Público / CC0 (Fra Angelico, Giotto, Duccio, Murillo, Velázquez, El Greco, Guido Reni, Durero).
- `scripts/descargar_verificar_cc0.py`: Script de auditoría y verificación SHA-256 para comprobar el banco de imágenes en `assets/img/misterios/` y validar el Crucifijo de respaldo (`crucifijo-tradicional.svg` y `.png`).
- `audio/`: Carpeta estructurada para futuras actualizaciones de locución (`#audio-controls-pill` permanece oculto por defecto en la interfaz).
- `assets/icons/`: Iconos `apple-touch-icon.png` (180×180), `icon-192.png` (192×192), `icon-512.png` (512×512), `icon-1024.png` (1024×1024) e `icon-maskable.svg`.
