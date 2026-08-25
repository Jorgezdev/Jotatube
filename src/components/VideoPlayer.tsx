import React, { useState, useRef, useEffect } from 'react';
import { Video } from '../types';
import { useApp } from '../context/AppContext';
import { ThumbsUp, ThumbsDown, Share2, FolderPlus, BellRing, ChevronDown, ChevronUp, Play, Pause, RefreshCw, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoPlayerProps {
  video: Video;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
    // estado global: likes, canales, playlists, caché
  // Permite acceder y manipular estados compartidos como likes, suscripciones, playlists y optimizaciones de caché.
  const {
    likedVideos,
    dislikedVideos,
    toggleLike,
    toggleDislike,
    channels,
    toggleSubscribe,
    playlists,
    addVideoToPlaylist,
    createPlaylist,
    connectionSpeed,
    addCacheBytes
  } = useApp();

    // ui local del reproductor
  // Controla si la caja de descripción del video está extendida o colapsada.
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  // Controla la visibilidad de la notificación emergente de "Enlace copiado".
  const [showShareToast, setShowShareToast] = useState(false);
  // Controla la visibilidad del menú desplegable para añadir el video a una lista de reproducción.
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  // Almacena el nombre de la nueva lista de reproducción que el usuario desea crear.
  const [newPlaylistName, setNewPlaylistName] = useState('');
  // Calidad de video seleccionada (Se adapta automáticamente de acuerdo con la velocidad de conexión detectada).
  const [selectedQuality, setSelectedQuality] = useState<'360p' | '720p' | '1080p'>(
    connectionSpeed === 'slow' ? '360p' : '1080p'
  );
  
    // refs y estado del <video>
  const videoRef = useRef<HTMLVideoElement>(null);
  // Rastrea si el video está actualmente reproduciéndose o en pausa.
  const [isPlaying, setIsPlaying] = useState(false);
  // Controla si el video está cargando/almacenando en búfer (simula latencias reales de red lentas).
  const [buffering, setBuffering] = useState(false);
  // Alterna entre la visualización estándar y el Modo Cine (Theater Mode) que expande el ancho del escenario.
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // Obtiene los datos del canal que subió el video (o genera valores por defecto si no se encuentra).
  const channel = channels.find(ch => ch.id === video.channelId) || {
    id: video.channelId,
    name: video.channelName,
    avatar: video.channelAvatar,
    subscribers: 50000,
    isSubscribed: false
  };

  // Verifica si el usuario actual le ha dado Me Gusta o No Me Gusta al video seleccionado.
  const hasLiked = likedVideos.includes(video.id);
  const hasDisliked = dislikedVideos.includes(video.id);

    // ajusta la calidad si la conexión es lenta
  // Cambia dinámicamente la resolución sugerida del video si se activa la conexión lenta en la cabecera.
  useEffect(() => {
    setSelectedQuality(connectionSpeed === 'slow' ? '360p' : '1080p');
  }, [connectionSpeed]);

    // atajos: espacio, T, M
  // Registra eventos globales del teclado para mejorar la accesibilidad y ergonomía:
  // - Espacio ('Space'): Alterna entre Play y Pausa.
  // - Tecla T ('KeyT'): Alterna el Modo Cine (Theater Mode).
  // - Tecla M ('KeyM'): Alterna el Silencio (Mute) del reproductor de video.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Previene disparar atajos si el usuario está escribiendo un comentario o buscando un video
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyT') {
        setIsTheaterMode(prev => !prev);
      } else if (e.code === 'KeyM') {
        if (videoRef.current) {
          videoRef.current.muted = !videoRef.current.muted;
          addCacheBytes(50);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

    // play/pause
  // Ejecuta la acción en el elemento HTML5 de video correspondiente y añade simulación
  // de buffering o latencias progresivas si la velocidad de conexión del usuario es lenta.
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      setBuffering(true);
      setTimeout(() => {
        videoRef.current?.play();
        setIsPlaying(true);
        setBuffering(false);
      }, connectionSpeed === 'slow' ? 900 : 50); // Retraso artificial simulado según la velocidad elegida
    }
    addCacheBytes(800);
  };

    // cambia la calidad seleccionada
  // Permite al usuario cambiar de forma manual la resolución de reproducción, disparando un búfer.
  const handleQualityChange = (q: '360p' | '720p' | '1080p') => {
    setSelectedQuality(q);
    setBuffering(true);
    addCacheBytes(2000);
    setTimeout(() => {
      setBuffering(false);
    }, connectionSpeed === 'slow' ? 1200 : 400);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/?v=${video.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    });
    addCacheBytes(50);
  };

  const handleCreateAndAddPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    createPlaylist(newPlaylistName);
    setNewPlaylistName('');
  };

  const formattedSubs = (subs: number) => {
    if (subs >= 1000000) return `${(subs / 1000000).toFixed(2)} M de suscriptores`;
    if (subs >= 1000) return `${(subs / 1000).toFixed(0)} K de suscriptores`;
    return `${subs} suscriptores`;
  };

  return (
    <div className={`space-y-4 ${isTheaterMode ? 'w-full' : ''}`}>
      
      {/* Video Container Frame */}
      <div className={`relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-lg border border-zinc-200/20 dark:border-zinc-900/40 transition-all duration-300 ${isTheaterMode ? 'max-h-[60vh]' : ''}`}>
        <video
          ref={videoRef}
          src={video.url}
          className="w-full h-full object-contain"
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controls
          preload="metadata"
        />

        {/* Buffering overlay */}
        <AnimatePresence>
          {buffering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10"
            >
              <RefreshCw className="w-10 h-10 text-red-500 animate-spin" />
              <span className="text-3xs font-mono font-bold text-white mt-3 tracking-widest uppercase">
                {connectionSpeed === 'slow' ? 'Carga Progresiva Lenta... (3G)' : 'Búfer de Red Fluidificando...'}
              </span>
              <span className="text-4xs text-zinc-400 mt-1 font-mono">
                {selectedQuality} • Optimización activa
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Micro-notifications overlay inside video */}
        {connectionSpeed === 'slow' && (
          <div className="absolute top-3 right-3 z-10 bg-amber-600/90 text-white font-mono text-5xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider animate-pulse flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Optimizador de Búfer Activo (360p)</span>
          </div>
        )}
      </div>

      {/* Video title, stats and sharing bar */}
      <div className="space-y-3 font-sans">
        <h1 className="text-sm md:text-base font-bold text-zinc-900 dark:text-zinc-50 leading-relaxed">
          {video.title}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-zinc-100 dark:border-zinc-900">
          
          {/* Creator Channel profile */}
          <div className="flex items-center gap-3">
            <img
              src={channel.avatar}
              alt={channel.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-zinc-100 dark:border-zinc-900"
            />
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5 hover:text-red-600 transition-colors cursor-pointer">
                {channel.name}
                {channel.isSubscribed && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 fill-current" />
                )}
              </h3>
              <p className="text-4xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {formattedSubs(channel.subscribers)}
              </p>
            </div>

            {/* Subscribe button */}
            <button
              onClick={() => {
                toggleSubscribe(channel.id);
                addCacheBytes(100);
              }}
              className={`ml-3 px-4 py-1.5 rounded-full font-bold text-4xs transition-all shadow-2xs hover:shadow-sm cursor-pointer ${
                channel.isSubscribed
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {channel.isSubscribed ? 'Suscrito' : 'Suscribirse'}
            </button>
          </div>

          {/* Action button bar */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Likes / Dislikes group */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850 rounded-full overflow-hidden p-0.5">
              <button
                onClick={() => toggleLike(video.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-l-full text-4xs font-bold transition-all cursor-pointer ${
                  hasLiked
                    ? 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                <span>{video.likes + (hasLiked ? 1 : 0)}</span>
              </button>

              <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-800 self-center" />

              <button
                onClick={() => toggleDislike(video.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-r-full text-4xs font-bold transition-all cursor-pointer ${
                  hasDisliked
                    ? 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <ThumbsDown className={`w-3.5 h-3.5 ${hasDisliked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Share action */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850 rounded-full text-4xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Compartir</span>
            </button>

            {/* Quality controls selector */}
            <div className="flex bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850 rounded-full p-0.5 font-mono text-5xs font-bold">
              {(['360p', '720p', '1080p'] as const).map(q => (
                <button
                  key={q}
                  onClick={() => handleQualityChange(q)}
                  disabled={connectionSpeed === 'slow' && q !== '360p'}
                  className={`px-2 py-1 rounded-full transition-all cursor-pointer ${
                    selectedQuality === q
                      ? 'bg-white dark:bg-zinc-800 text-red-600 dark:text-red-400 shadow-3xs'
                      : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-30 disabled:hover:text-zinc-400'
                  }`}
                  title={connectionSpeed === 'slow' && q !== '360p' ? 'Restringido por Conexión Lenta' : ''}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Playlist adder with drop-down */}
            <div className="relative">
              <button
                onClick={() => setShowPlaylistDropdown(!showPlaylistDropdown)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 border rounded-full text-4xs font-bold transition-all cursor-pointer ${
                  showPlaylistDropdown
                    ? 'border-red-500 bg-red-50/50 dark:bg-red-950/10 text-red-600 dark:text-red-400'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Guardar</span>
              </button>

              <AnimatePresence>
                {showPlaylistDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl shadow-xl overflow-hidden z-20 p-3"
                  >
                    <span className="text-4xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase block mb-2 tracking-wider">
                      Guardar en...
                    </span>
                    
                    <div className="space-y-1 max-h-36 overflow-y-auto mb-3">
                      {playlists.map(pl => {
                        const isAdded = pl.videoIds.includes(video.id);
                        return (
                          <button
                            key={pl.id}
                            onClick={() => {
                              addVideoToPlaylist(pl.id, video.id);
                              setShowPlaylistDropdown(false);
                            }}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg text-left text-4xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer"
                          >
                            <span>{pl.name}</span>
                            {isAdded ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <span className="w-3.5 h-3.5 border border-zinc-300 dark:border-zinc-700 rounded-sm" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="border-t border-zinc-100 dark:border-zinc-900 pt-2.5">
                      <form onSubmit={handleCreateAndAddPlaylist} className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Nueva lista..."
                          value={newPlaylistName}
                          onChange={(e) => setNewPlaylistName(e.target.value)}
                          className="flex-1 px-2 py-1 text-5xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md focus:outline-hidden text-zinc-900 dark:text-zinc-100"
                        />
                        <button
                          type="submit"
                          className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-md text-5xs font-bold cursor-pointer"
                        >
                          Crear
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Collapsible description panel */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-100/60 dark:border-zinc-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-4xs font-mono font-semibold text-zinc-600 dark:text-zinc-400">
              <span>{video.views.toLocaleString('es-ES')} vistas</span>
              <span>•</span>
              <span>Subido {video.publishedAt}</span>
              <span>•</span>
              <span className="text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-950/20 px-1 rounded">
                {video.category}
              </span>
            </div>
            
            <button
              onClick={() => setIsDescExpanded(!isDescExpanded)}
              className="text-4xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              {isDescExpanded ? (
                <>
                  <span>Ocultar</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Mostrar más</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          <p className={`text-xs text-zinc-700 dark:text-zinc-300 font-sans mt-2.5 leading-relaxed ${isDescExpanded ? '' : 'line-clamp-2'}`}>
            {video.description}
          </p>
        </div>

      </div>

      {/* Share Toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 font-sans font-bold text-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Enlace de video copiado al portapapeles localmente</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
