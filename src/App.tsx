// App.tsx solo decide qué vista pintar (inicio, video, listas, etc).
// El estado y los datos viven en context/AppContext.tsx + src/services/ —
// ver el README para la guía de cómo enchufar un backend real ahí.

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SlowConnectionToggle } from './components/SlowConnectionToggle';
import { VideoCard } from './components/VideoCard';
import { VideoPlayer } from './components/VideoPlayer';
import { CommentsSection } from './components/CommentsSection';
import { PlaylistFeed } from './components/PlaylistFeed';
import { SubscriptionFeed } from './components/SubscriptionFeed';
import { PrivacyReport } from './components/PrivacyReport';
import { Sparkles, Library, Play, ArrowLeft, RefreshCw, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// categorías del filtro superior
// Lista estática para la barra de chips de navegación rápida de contenido.
const CATEGORIES = ['Todos', 'Tecnología', 'Cine y Animación', 'Deportes', 'Música', 'Viajes'];

function MainAppContent() {
    // estado global de la app
  // Extraemos las variables de control del reproductor, estado de la conexión,
  // listado de videos cargados y utilidades de almacenamiento en caché.
  const {
    currentView,
    setCurrentView,
    selectedVideo,
    setSelectedVideo,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    videos,
    darkMode,
    connectionSpeed,
    addCacheBytes
  } = useApp();

    // qué vista está activa
  // Controla si el menú lateral (Sidebar) en dispositivos móviles se encuentra desplegado.
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // filtra por búsqueda + categoría
  // Filtra los videos en memoria basados en la consulta de búsqueda actual y la categoría seleccionada.
  // Cumple con la directiva de cero recopilación de datos comerciales para preservar la privacidad del usuario.
  const filteredVideos = videos.filter(video => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channelName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === 'Todos' || video.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

    // handlers de navegación
  // Selecciona un video para su reproducción, cambia la vista activa y añade bytes virtuales a la caché.
  const handleSelectVideo = (video: any) => {
    setSelectedVideo(video);
    setCurrentView('video');
    addCacheBytes(500); // Simula el consumo de ancho de banda para metadatos del reproductor
  };

  // Cambia la categoría activa y simula la carga rápida añadiendo bytes virtuales al optimizador de datos.
  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    addCacheBytes(150); // Simula consumo para la descarga del listado filtrado
  };

  return (
    <div className={darkMode ? 'dark text-zinc-50' : 'text-zinc-900'}>
      <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-300 pb-20 md:pb-6">
        
        {/* modulador de velocidad de red
            Muestra el estado de la caché on-device y permite alternar velocidades para depuración. */}
        <SlowConnectionToggle />

        {/* cabecera
            Contiene la barra de búsqueda local, la bandeja de notificaciones y el menú biométrico. */}
        <Header onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <div className="max-w-7xl mx-auto flex">
          {/* menú lateral
              Permite desplazarse entre Inicio, Listas, Suscripciones y Reporte de Privacidad. */}
          <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

          {/* contenido principal */}
          <main className="flex-1 px-4 py-6 md:px-6 overflow-hidden min-h-[calc(100vh-6rem)]">
            <AnimatePresence mode="wait">
              
              {/* vista: inicio */}
              {currentView === 'home' && (
                <motion.div
                  key="home-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Selector rápido de categorías (Chips) */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none select-none font-sans">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all shrink-0 cursor-pointer ${
                          activeCategory === cat
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-850'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Resultados de Búsqueda y Parrilla de Videos */}
                  {filteredVideos.length === 0 ? (
                    <div className="py-20 text-center text-zinc-400 dark:text-zinc-500 font-sans">
                      <Sparkles className="w-12 h-12 text-zinc-300 dark:text-zinc-800 mx-auto mb-3" />
                      <span className="text-xs font-semibold block">Sin resultados para tu búsqueda</span>
                      <p className="text-4xs text-zinc-400 mt-1 max-w-xs mx-auto">
                        Intenta buscando con términos más genéricos o cambia de categoría en el selector superior.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {filteredVideos.map(video => (
                        <div key={video.id} className="h-full">
                          <VideoCard
                            video={video}
                            onClick={() => handleSelectVideo(video)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* vista: video */}
              {currentView === 'video' && selectedVideo && (
                <motion.div
                  key="video-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                  {/* Panel Izquierdo: Reproductor de Video y Caja de Comentarios Interactiva */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Botón de Retorno */}
                    <button
                      onClick={() => {
                        setCurrentView('home');
                        setSelectedVideo(null);
                        addCacheBytes(100);
                      }}
                      className="inline-flex items-center gap-1.5 text-4xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-full cursor-pointer font-sans"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Volver al inicio</span>
                    </button>

                    {/* Reproductor personalizado con soporte de atajos de teclado y modulación de calidad */}
                    <VideoPlayer video={selectedVideo} />

                    {/* Sección de comentarios y me gustas persistidos en LocalStorage */}
                    <CommentsSection videoId={selectedVideo.id} />
                  </div>

                  {/* Panel Derecho: Recomendaciones Relacionadas */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="border-b border-zinc-100 dark:border-zinc-900 pb-2">
                      <h3 className="text-3xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 font-sans">
                        Videos Relacionados
                      </h3>
                      <p className="text-5xs text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">
                        Basado en: {selectedVideo.category} • Recomendaciones sin seguimiento comercial
                      </p>
                    </div>

                    <div className="space-y-3.5">
                      {videos
                        .filter(v => v.id !== selectedVideo.id)
                        .map(recVideo => {
                          const isMatchCategory = recVideo.category === selectedVideo.category;
                          return (
                            <div
                              key={recVideo.id}
                              onClick={() => handleSelectVideo(recVideo)}
                              className={`flex gap-3 bg-white dark:bg-zinc-950 p-2.5 rounded-xl border hover:shadow-xs transition-all cursor-pointer ${
                                isMatchCategory
                                  ? 'border-red-500/20 dark:border-red-950/20'
                                  : 'border-zinc-200/50 dark:border-zinc-900/40'
                              }`}
                            >
                              {/* Miniatura del video recomendado */}
                              <div className="w-28 xs:w-32 aspect-video bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-hidden shrink-0 relative">
                                <img
                                  src={recVideo.thumbnail}
                                  alt={recVideo.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-5xs font-mono px-1 rounded-sm">
                                  {recVideo.duration}
                                </div>
                              </div>

                              {/* Metadatos y título resumidos */}
                              <div className="min-w-0 flex flex-col justify-between font-sans">
                                <div>
                                  <h4 className="text-3xs font-bold text-zinc-900 dark:text-zinc-50 line-clamp-2 leading-relaxed">
                                    {recVideo.title}
                                  </h4>
                                  <span className="text-4xs text-zinc-500 dark:text-zinc-400 mt-1 block">
                                    {recVideo.channelName}
                                  </span>
                                </div>

                                <span className="text-5xs text-zinc-400 dark:text-zinc-500 block font-mono">
                                  {(recVideo.views / 1000).toFixed(0)}K vistas • {recVideo.publishedAt}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* vista: playlists */}
              {currentView === 'playlists' && (
                <motion.div
                  key="playlists-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <PlaylistFeed />
                </motion.div>
              )}

              {/* vista: suscripciones */}
              {currentView === 'subscriptions' && (
                <motion.div
                  key="subscriptions-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <SubscriptionFeed />
                </motion.div>
              )}

              {/* vista: privacidad */}
              {currentView === 'privacy' && (
                <motion.div
                  key="privacy-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <PrivacyReport />
                </motion.div>
              )}

            </AnimatePresence>
          </main>
        </div>

      </div>
    </div>
  );
}

// entrada principal
export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
