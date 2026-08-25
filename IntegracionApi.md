🔌 Guía de Integración con Backend / API

Actualmente, el proyecto inicializa sus datos a través de `src/data/videos.ts` y sincroniza las mutaciones en `localStorage` dentro de `src/context/AppContext.tsx`.

Para conectar este frontend con una API real (Node.js, Express, Python FastAPI, NestJS, Go, Firebase o PostgreSQL), sigue estos pasos recomendados:

### Paso 1: Crear el Cliente de Servicio API (`src/services/api.ts`)

Crea un archivo centralizado para tus llamadas HTTP:

```typescript
// src/services/api.ts
const API_BASE = import.meta.env.VITE_API_URL || 'https://api.tu-servidor.com/api';

export const ApiService = {
  // Obtener catálogo de videos
  async getVideos() {
    const res = await fetch(`${API_BASE}/videos`);
    if (!res.ok) throw new Error('Error al cargar videos');
    return res.json();
  },

  // Obtener detalles de un video por ID
  async getVideoById(id: string) {
    const res = await fetch(`${API_BASE}/videos/${id}`);
    return res.json();
  },

  // Agregar comentario
  async postComment(videoId: string, text: string, userToken: string) {
    const res = await fetch(`${API_BASE}/videos/${videoId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ text })
    });
    return res.json();
  },

  // Alternar suscripción a canal
  async toggleSubscribe(channelId: string, userToken: string) {
    const res = await fetch(`${API_BASE}/channels/${channelId}/subscribe`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    return res.json();
  }
};
```

### Paso 2: Declarar Variables de Entorno (`.env` y `.env.example`)

Añade la URL base de tu backend:

```env
# .env.example
VITE_API_URL=http://localhost:5000/api
```

### Paso 3: Conectar `AppContext.tsx` con el Servicio API

En `src/context/AppContext.tsx`, sustituye los inicializadores estáticos por peticiones asíncronas en un `useEffect`:

```typescript
// En src/context/AppContext.tsx
import { ApiService } from '../services/api';

// Dentro de AppProvider:
useEffect(() => {
  async function loadInitialData() {
    try {
      const remoteVideos = await ApiService.getVideos();
      setVideos(remoteVideos);
    } catch (err) {
      console.error('Error conectando con la API, usando respaldo local:', err);
    }
  }
  loadInitialData();
}, []);
```

> **Ventaja de esta arquitectura**: Los componentes de interfaz (`App.tsx`, `VideoCard.tsx`, `VideoPlayer.tsx`, etc.) no necesitan modificarse en absoluto, ya que continuarán recibiendo los datos mediante `useApp()`.
