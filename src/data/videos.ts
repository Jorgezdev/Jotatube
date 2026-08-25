import { Video, Channel, VideoComment } from '../types';

export const INITIAL_CHANNELS: Channel[] = [
  {
    id: 'ch-techworld',
    name: 'TechWorld Latino',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
    subscribers: 1240000,
    isSubscribed: false,
    description: 'La mejor tecnología del futuro explicada hoy. Reseñas, análisis y unboxing.'
  },
  {
    id: 'ch-naturecam',
    name: 'Planeta Verde',
    avatar: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=150&q=80',
    subscribers: 890000,
    isSubscribed: false,
    description: 'Explorando la belleza oculta de nuestro mundo. Paisajes y vida silvestre.'
  },
  {
    id: 'ch-cinemaglow',
    name: 'Cineastas Pro',
    avatar: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=150&q=80',
    subscribers: 450000,
    isSubscribed: false,
    description: 'Detrás de cámaras, cortometrajes espectaculares y análisis cinematográfico.'
  },
  {
    id: 'ch-adventures',
    name: 'Rutas Salvajes',
    avatar: 'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=150&q=80',
    subscribers: 670000,
    isSubscribed: false,
    description: 'Deportes extremos, viajes sin mapa y las mayores aventuras del planeta.'
  }
];

export const INITIAL_VIDEOS: Video[] = [
  {
    id: 'v-bunny',
    title: 'La Gran Aventura de Bunny - Cortometraje Animado Clásico',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    duration: '9:56',
    views: 4520900,
    category: 'Cine y Animación',
    channelId: 'ch-cinemaglow',
    channelName: 'Cineastas Pro',
    channelAvatar: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=150&q=80',
    likes: 124000,
    dislikes: 1540,
    description: 'Un conejo gigante con un corazón de oro decide tomar venganza de tres molestos roedores que destruyen su bosque amado. Disfruta de este clásico de la animación en alta resolución con texturas progresivas.',
    publishedAt: 'Hace 3 meses'
  },
  {
    id: 'v-elephants',
    title: 'El Sueño de los Elefantes - CGI Ciencia Ficción',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    duration: '10:53',
    views: 2108700,
    category: 'Tecnología',
    channelId: 'ch-techworld',
    channelName: 'TechWorld Latino',
    channelAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
    likes: 89000,
    dislikes: 980,
    description: 'El primer proyecto cinematográfico de código abierto del mundo. Un viaje surrealista y de ciencia ficción dentro de una máquina de engranajes sin fin que desafía la gravedad y el tiempo.',
    publishedAt: 'Hace 5 meses'
  },
  {
    id: 'v-escapes',
    title: 'Escapes Imposibles: Downhill Extremo en los Alpes',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    duration: '0:14',
    views: 890400,
    category: 'Deportes',
    channelId: 'ch-adventures',
    channelName: 'Rutas Salvajes',
    channelAvatar: 'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=150&q=80',
    likes: 45000,
    dislikes: 310,
    description: 'Los paisajes más peligrosos de los Alpes se convierten en la pista de descenso de ciclistas de élite. Grabado en 4K fluido con estabilización activa.',
    publishedAt: 'Hace 1 semana'
  },
  {
    id: 'v-blazes',
    title: 'La Era del Fuego y de la Innovación en Dispositivos',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=800&q=80',
    duration: '0:15',
    views: 1205300,
    category: 'Tecnología',
    channelId: 'ch-techworld',
    channelName: 'TechWorld Latino',
    channelAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
    likes: 56000,
    dislikes: 240,
    description: 'Exploramos los dispositivos de streaming y cómo revolucionaron la distribución del contenido digital. Una reseña visualmente deslumbrante de la evolución de la TV inteligente.',
    publishedAt: 'Hace 2 semanas'
  },
  {
    id: 'v-joyrides',
    title: 'Roadtrip por la Costa de California en Auto Eléctrico',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    duration: '0:15',
    views: 540000,
    category: 'Viajes',
    channelId: 'ch-adventures',
    channelName: 'Rutas Salvajes',
    channelAvatar: 'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=150&q=80',
    likes: 32000,
    dislikes: 190,
    description: 'Un viaje inolvidable por la mítica Big Sur. Probamos el rendimiento de la batería y la autonomía en pendientes pronunciadas frente al Océano Pacífico.',
    publishedAt: 'Hace 3 días'
  },
  {
    id: 'v-subaru',
    title: 'Conducción Off-Road Extrema en Terreno Seco y Barro',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?auto=format&fit=crop&w=800&q=80',
    duration: '9:54',
    views: 675000,
    category: 'Deportes',
    channelId: 'ch-adventures',
    channelName: 'Rutas Salvajes',
    channelAvatar: 'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=150&q=80',
    likes: 28000,
    dislikes: 420,
    description: 'Ponemos a prueba el sistema de tracción total en las dunas del desierto y los bosques lluviosos. Todo lo que necesitas saber sobre tracción mecánica.',
    publishedAt: 'Hace 1 mes'
  },
  {
    id: 'v-steel',
    title: 'Tears of Steel - Cortometraje de Acción Real y VFX',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    duration: '12:14',
    views: 3410200,
    category: 'Cine y Animación',
    channelId: 'ch-cinemaglow',
    channelName: 'Cineastas Pro',
    channelAvatar: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=150&q=80',
    likes: 189000,
    dislikes: 2100,
    description: 'Cortometraje de ciencia ficción filmado en Ámsterdam. Muestra un grupo de guerreros y científicos que intentan salvar la ciudad de robots gigantes asesinos usando tecnología cuántica.',
    publishedAt: 'Hace 6 meses'
  },
  {
    id: 'v-fun',
    title: 'Festivales de Música: El Retorno de los Conciertos Libres',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    duration: '0:15',
    views: 920000,
    category: 'Música',
    channelId: 'ch-techworld',
    channelName: 'TechWorld Latino',
    channelAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
    likes: 72000,
    dislikes: 540,
    description: 'Un reportaje sobre las nuevas tecnologías de audio espacial en conciertos masivos al aire libre. La experiencia inmersiva definitiva.',
    publishedAt: 'Hace 2 meses'
  }
];

export const INITIAL_COMMENTS: VideoComment[] = [
  {
    id: 'c-1',
    videoId: 'v-bunny',
    userName: 'Carlos_VFX',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
    text: '¡Esta animación sigue siendo una obra maestra! Las físicas y el sombreado son increíbles para su época.',
    likes: 432,
    timestamp: 'Hace 2 días'
  },
  {
    id: 'c-2',
    videoId: 'v-bunny',
    userName: 'Sofia_Gamer',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
    text: 'Amo el diseño del conejo. La comedia de slapstick está muy bien lograda 😂',
    likes: 128,
    timestamp: 'Hace 1 día'
  },
  {
    id: 'c-3',
    videoId: 'v-elephants',
    userName: 'Nico_Developer',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80',
    text: 'Ver proyectos de animación hechos con software libre (Blender) me inspira a seguir programando e innovando.',
    likes: 256,
    timestamp: 'Hace 4 días'
  },
  {
    id: 'c-4',
    videoId: 'v-escapes',
    userName: 'Bici_Adict',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
    text: 'Qué locura de descenso. Se me aceleró el ritmo cardíaco solo de verlo.',
    likes: 84,
    timestamp: 'Hace 12 horas'
  }
];
