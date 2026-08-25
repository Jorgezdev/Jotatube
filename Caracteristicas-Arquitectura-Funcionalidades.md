## Características Principales

-  **Reproductor de Video Completo**: Soporte de calidades dinámicas (1080p, 720p, 360p), modo cine (*Theater Mode*), buffering simulado y atajos de teclado ergonómicos (`Espacio`, `T`, `M`).
-  **Interacciones y Engagement**: Sistema de *Likes*/*Dislikes*, suscripción a canales, listas de reproducción personalizadas y gestión de comentarios.
-  **Simulación de Identificación Biométrica (Demo)**: Flujo demostrativo de registro e inicio de sesión con animación de Touch ID / Face ID para pruebas en frontend.
-  **Privacidad Client-Side**: Cero rastreo comercial; estado y preferencias persistidos localmente (LocalStorage) sin enviar telemetría a terceros.
-  **Modulador de Red y Caché**: Herramienta de depuración en cabecera para alternar entre conexión rápida y 3G lenta con monitor de bytes cacheados en sesión.
-  **Tema Adaptativo**: Soporte completo para Modo Oscuro y Modo Claro con transiciones fluidas.
-  **Diseño 100% Responsivo**: Layout optimizado para dispositivos móviles, tablets y monitores de escritorio.

---

##  Decisiones de Arquitectura y Diseño

### 1. ¿Por qué una Arquitectura Client-First / On-Device?
El proyecto fue concebido bajo el principio de **máxima privacidad y disponibilidad inmediata**. Al desacoplar la aplicación de llamadas a APIs externas en su fase frontend:
- **Independencia de backend**: Se puede ejecutar y evaluar completamente en cualquier navegador sin configurar bases de datos previas o tokens de terceros.
- **Sin telemetría invasiva**: Todas las operaciones de listas, historial, likes y comentarios se procesan en memoria y se persisten de forma segura en `localStorage`.
- **Cero latencia de arranque**: La interfaz carga al instante sin pantallas de bloqueo ni caídas por fallas de conexión a servicios externos.

### 2. Gestión de Estado Centralizada (`AppContext.tsx`)
En lugar de dispersar la lógica de negocio en múltiples componentes visuales, el estado global se encapsula dentro del proveedor `AppProvider`:
- **Desacoplamiento UI / Lógica**: Componentes como `VideoPlayer`, `Header`, `Sidebar` o `CommentsSection` son puramente presentacionales y consumen el contexto mediante el hook `useApp()`.
- **Fácil transición a producción**: Para reemplazar `localStorage` por llamadas HTTP a un servidor REST o GraphQL, solo se debe modificar `AppContext.tsx` sin tocar la capa visual.

### 3. Accesibilidad y Ergonomía (A11y)
- Soporte nativo para navegación por teclado en el reproductor (espacio para reproducir/pausar, `T` para modo cine, `M` para silenciar).
- Detección inteligente para desactivar atajos de teclado mientras el usuario redacta comentarios o escribe en la barra de búsqueda.
- Contrastes cromáticos validados para accesibilidad visual tanto en tema claro como oscuro.

---

## 🎯 Funcionalidades del Frontend en Detalle

###  1. Reproductor de Video (`VideoPlayer.tsx`)
- **Modo Cine (*Theater Mode*)**: Expande el reproductor ocupando todo el ancho de la rejilla.
- **Calidades de Video**: Selección manual entre `1080p`, `720p` y `360p` con simulación de *buffering*.
- **Atajos de Teclado**:
  - `Espacio` → Reproducir / Pausar.
  - `T` → Alternar Modo Cine.
  - `M` → Silenciar / Activar sonido.
- **Acciones Rápidas**: Botones de Like, Dislike, Compartir (con copia al portapapeles) y Guardar en lista de reproducción existente o nueva.

###  2. Sistema de Comentarios (`CommentsSection.tsx`)
- Adición de comentarios en tiempo real con vinculación al usuario autenticado o anónimo.
- Contador de *Likes* por comentario individual.
- Eliminación de comentarios propios.
- Sincronización instantánea con el almacenamiento local.

###  3. Listas de Reproducción (`PlaylistFeed.tsx`)
- Creación de listas personalizadas públicas o privadas.
- Inserción y eliminación de videos dentro de listas.
- Reproducción directa de videos desde la vista de colecciones.

###  4. Suscripciones y Notificaciones (`SubscriptionFeed.tsx` y `Header.tsx`)
- Suscripción y desuscripción de canales con actualización de contadores.
- Panel desplegable de notificaciones con conteo de no leídas, marcado como leídas y enlace a videos.
- Integración opcional con la API nativa del navegador (`window.Notification`).

###  5. Autenticación Biométrica Simulada (`BiometricsModal.tsx`)
- Registro de perfil con soporte simulado de hardware biométrico (**Touch ID / Face ID**).
- Animación de escaneo y apretón de manos (*handshake*) con validación de credenciales.

###  6. Modulador de Red y Depuración (`SlowConnectionToggle.tsx`)
- Switch superior para simular conexiones de baja velocidad (retrasos de búfer y calidad 360p predeterminada).
- Monitor de telemetría de bytes guardados/cacheados localmente.

###  7. Reporte de Privacidad (`PrivacyReport.tsx`)
- Métricas transparentes sobre almacenamiento en uso, elementos cacheados y rastreadores comerciales bloqueados por diseño.

---


##  Estructura del Proyecto

```text
├── index.html                  # Punto de entrada HTML con viewport y metadatos
├── package.json                # Dependencias y scripts de compilación
├── tsconfig.json               # Configuración de TypeScript y paths
├── vite.config.ts              # Configuración de Vite y plugins (React, Tailwind)
├── src/
│   ├── main.tsx                # Entrada principal de renderizado en DOM (React 19)
│   ├── App.tsx                 # Enrutador de vistas, control de layout y parrilla principal
│   ├── index.css               # Estilos globales, variables de tipografía y scrollbar
│   ├── types.ts                # Definiciones de TypeScript (Video, Channel, Comment, Playlist, etc.)
│   ├── services/               # Capa de abstracción de datos (Storage, Video, Comments, Playlists)
│   │   ├── storage.ts          # Driver seguro con tolerancia a fallos para localStorage
│   │   ├── videoService.ts     # Abstracción de videos, canales y likes
│   │   ├── commentService.ts   # Abstracción de comentarios
│   │   ├── playlistService.ts  # Abstracción de playlists, notificaciones y perfil
│   │   └── index.ts            # Exportador central de servicios
│   ├── context/
│   │   └── AppContext.tsx      # Proveedor de estado global desacoplado y conectado a servicios
│   ├── data/
│   │   └── videos.ts           # Datos de muestra iniciales y metadatos de canales
│   └── components/
│       ├── Header.tsx          # Barra superior (búsqueda, notificaciones, perfil, biometría)
│       ├── Sidebar.tsx         # Barra lateral de navegación con contador de insignias
│       ├── VideoCard.tsx       # Tarjeta de miniatura para la parrilla con badges de duración
│       ├── VideoPlayer.tsx     # Reproductor HTML5 con controles, modo cine y atajos
│       ├── CommentsSection.tsx # Lista y formulario interactivo de comentarios
│       ├── PlaylistFeed.tsx    # Gestión y visualización de listas de reproducción
│       ├── SubscriptionFeed.tsx# Feed de canales y creadores suscritos
│       ├── BiometricsModal.tsx # Modal de registro/login biométrico (Touch ID / Face ID)
│       ├── SlowConnectionToggle.tsx # Barra de telemetría y modulación de velocidad
│       └── PrivacyReport.tsx   # Panel de auditoría de privacidad y almacenamiento local
```


