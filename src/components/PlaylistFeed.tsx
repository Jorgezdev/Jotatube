import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ListMusic, Play, Trash2, FolderPlus, Lock, Unlock, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PlaylistFeed: React.FC = () => {
  const { playlists, videos, createPlaylist, removeVideoFromPlaylist, setSelectedVideo, setCurrentView, addCacheBytes } = useApp();
  const [newListName, setNewListName] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  const selectedPlaylist = playlists.find(pl => pl.id === selectedPlaylistId);

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    createPlaylist(newListName);
    setNewListName('');
    addCacheBytes(200);
  };

  const handlePlayVideo = (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (video) {
      setSelectedVideo(video);
      setCurrentView('video');
      addCacheBytes(500);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-150 dark:border-zinc-900 pb-4">
        <div>
          <h2 className="text-sm md:text-base font-bold text-zinc-900 dark:text-zinc-50">
            Mis Listas de Reproducción
          </h2>
          <p className="text-4xs text-zinc-500 dark:text-zinc-400 mt-1">
            Organiza tus videos preferidos en carpetas locales seguras y 100% privadas.
          </p>
        </div>

        {/* Create playlist quick inline form */}
        <form onSubmit={handleCreateList} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Ej. Programación 2026"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-red-500 flex-1 sm:w-48"
          />
          <button
            type="submit"
            className="flex items-center gap-1 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-2xs shrink-0"
          >
            <FolderPlus className="w-4 h-4" />
            <span className="hidden xs:inline">Nueva</span>
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Playlists sidebar list */}
        <div className="lg:col-span-1 space-y-2">
          <span className="text-3xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-2.5">
            Carpetas Guardadas
          </span>

          <div className="space-y-1.5">
            {playlists.map(pl => {
              const isActive = pl.id === selectedPlaylistId;
              return (
                <div
                  key={pl.id}
                  onClick={() => {
                    setSelectedPlaylistId(pl.id);
                    addCacheBytes(100);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-red-50/50 dark:bg-red-950/10 border-red-500 text-red-600 dark:text-red-400 shadow-3xs'
                      : 'bg-white dark:bg-zinc-950 border-zinc-200/60 dark:border-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ListMusic className="w-5 h-5 opacity-85" />
                    <div>
                      <h4 className="text-xs font-semibold">{pl.name}</h4>
                      <span className="text-4xs text-zinc-400 dark:text-zinc-500 block mt-0.5 font-mono">
                        {pl.videoIds.length} videos • Creado {pl.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {pl.isPrivate ? (
                      <Lock className="w-3.5 h-3.5 text-zinc-400" title="Lista Privada" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5 text-zinc-400" title="Lista Pública" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Playlist Videos Detail Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-4 md:p-6 min-h-64">
          <AnimatePresence mode="wait">
            {!selectedPlaylistId ? (
              <motion.div
                key="no-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center text-zinc-400 dark:text-zinc-500"
              >
                <ListMusic className="w-12 h-12 text-zinc-300 dark:text-zinc-800 mb-3" />
                <span className="text-xs font-semibold">Ninguna lista seleccionada</span>
                <p className="text-4xs text-zinc-400 max-w-xs mt-1">
                  Haz clic en cualquiera de tus listas en el panel izquierdo para ver los videos agregados.
                </p>
              </motion.div>
            ) : selectedPlaylist && selectedPlaylist.videoIds.length === 0 ? (
              <motion.div
                key="empty-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center text-zinc-400 dark:text-zinc-500"
              >
                <FolderPlus className="w-12 h-12 text-zinc-300 dark:text-zinc-800 mb-3" />
                <span className="text-xs font-semibold">Lista "{selectedPlaylist.name}" vacía</span>
                <p className="text-4xs text-zinc-400 max-w-xs mt-1">
                  Explora videos en la página de inicio y presiona el botón "Guardar" en el reproductor para agregarlos.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="playlist-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-900 pb-3">
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
                    Videos en "{selectedPlaylist?.name}"
                  </h3>
                  <span className="text-4xs font-mono text-zinc-400 font-medium">
                    {selectedPlaylist?.videoIds.length} ítems en búfer
                  </span>
                </div>

                <div className="space-y-2 max-h-120 overflow-y-auto pr-1">
                  {selectedPlaylist?.videoIds.map((vidId, idx) => {
                    const video = videos.find(v => v.id === vidId);
                    if (!video) return null;
                    return (
                      <div
                        key={video.id}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Index number */}
                          <span className="text-4xs font-bold font-mono text-zinc-400 w-4 shrink-0">
                            {idx + 1}
                          </span>
                          
                          {/* Thumbnail preview */}
                          <div className="w-20 aspect-video rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200/50 dark:border-zinc-800">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Video details */}
                          <div className="min-w-0">
                            <h4
                              onClick={() => handlePlayVideo(video.id)}
                              className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-sans truncate hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                            >
                              {video.title}
                            </h4>
                            <span className="text-4xs text-zinc-400 dark:text-zinc-500 block mt-0.5 font-sans">
                              {video.channelName} • {video.duration}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handlePlayVideo(video.id)}
                            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-red-600 hover:text-red-700 rounded-md cursor-pointer"
                            title="Reproducir ahora"
                          >
                            <Play className="w-4 h-4 fill-current" />
                          </button>
                          <button
                            onClick={() => removeVideoFromPlaylist(selectedPlaylist.id, video.id)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-400 hover:text-red-600 rounded-md cursor-pointer"
                            title="Eliminar de la lista"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};
