import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Tv, BellRing, BellOff, Users, ArrowUpRight, ShieldCheck, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SubscriptionFeed: React.FC = () => {
  const { channels, toggleSubscribe, videos, setSelectedVideo, setCurrentView, addCacheBytes } = useApp();
  const [notifPreferences, setNotifPreferences] = useState<Record<string, 'all' | 'none'>>({});

  const subscribedChannels = channels.filter(ch => ch.isSubscribed);

  const toggleNotifPref = (channelId: string) => {
    setNotifPreferences(prev => {
      const current = prev[channelId] || 'all';
      const next = current === 'all' ? 'none' : 'all';
      addCacheBytes(100);
      return { ...prev, [channelId]: next };
    });
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
        <div className="border-b border-zinc-150 dark:border-zinc-900 pb-4">
        <h2 className="text-sm md:text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Tv className="w-5 h-5 text-red-600 dark:text-red-500" />
          Feed de Suscripciones
        </h2>
        <p className="text-4xs text-zinc-500 dark:text-zinc-400 mt-1">
          Administra tus canales y publicaciones recientes. Toda la información se sincroniza reactivamente en memoria local.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Subscribed channels list and config */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-4">
            <span className="text-3xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-3.5">
              Tus Canales ({subscribedChannels.length})
            </span>

            {subscribedChannels.length === 0 ? (
              <div className="py-8 text-center text-zinc-400 dark:text-zinc-500 italic text-xs">
                No te has suscrito a ningún canal todavía.
              </div>
            ) : (
              <div className="space-y-3">
                {subscribedChannels.map(ch => {
                  const hasNotifs = (notifPreferences[ch.id] || 'all') === 'all';
                  return (
                    <div
                      key={ch.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={ch.avatar}
                          alt={ch.name}
                          className="w-8 h-8 rounded-full object-cover shadow-sm shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate">
                            {ch.name}
                          </h4>
                          <span className="text-5xs text-zinc-400 block mt-0.5">
                            {(ch.subscribers / 1000).toFixed(0)}K subs
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Toggle notification mode */}
                        <button
                          onClick={() => toggleNotifPref(ch.id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            hasNotifs
                              ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20'
                              : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850'
                          }`}
                          title={hasNotifs ? 'Notificaciones Push Activas' : 'Notificaciones Silenciadas'}
                        >
                          {hasNotifs ? <BellRing className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                        </button>
                        
                        {/* Unsubscribe */}
                        <button
                          onClick={() => toggleSubscribe(ch.id)}
                          className="p-1 px-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-300 font-bold text-5xs cursor-pointer"
                          title="Anular suscripción"
                        >
                          Anular
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Websocket simulation explanation */}
          <div className="bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-100 dark:border-zinc-900 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
              <Info className="w-4 h-4 text-red-500 shrink-0" />
              <span className="text-3xs font-bold">Tecnología Push Síncrona</span>
            </div>
            <p className="text-4xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Las notificaciones de subidas y transmisiones "en vivo" se transmiten de forma asíncrona mediante un procesador local. Cuando estás suscrito, los eventos aparecen inmediatamente en el timbre superior.
            </p>
          </div>
        </div>

        {/* Right Side: Upload feed list */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-3xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-1">
            Contenido Reciente de tus Suscripciones
          </span>

          {subscribedChannels.length === 0 ? (
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-8 text-center text-zinc-400 dark:text-zinc-500">
              <Users className="w-10 h-10 text-zinc-300 dark:text-zinc-800 mx-auto mb-2" />
              <span className="text-xs font-semibold block">Sin actividad</span>
              <p className="text-4xs text-zinc-400 mt-1 max-w-xs mx-auto">
                Suscríbete a canales en la página de inicio o en los videos para ver sus publicaciones más recientes y actualizaciones.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {videos
                .filter(v => subscribedChannels.some(ch => ch.id === v.channelId))
                .map(video => (
                  <div
                    key={video.id}
                    onClick={() => handlePlayVideo(video.id)}
                    className="flex flex-col sm:flex-row bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-900 rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer p-3 gap-4"
                  >
                    {/* Thumbnail */}
                    <div className="w-full sm:w-44 aspect-video bg-zinc-100 dark:bg-zinc-900 rounded-xl overflow-hidden shrink-0 border border-zinc-200/50 dark:border-zinc-800">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Metadata detail */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1 font-sans">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <img
                            src={video.channelAvatar}
                            alt={video.channelName}
                            className="w-4 h-4 rounded-full object-cover border border-zinc-100"
                          />
                          <span className="text-4xs font-bold text-zinc-700 dark:text-zinc-300">
                            {video.channelName}
                          </span>
                          <span className="text-4xs text-zinc-400 font-mono">• {video.publishedAt}</span>
                        </div>

                        <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 line-clamp-2 leading-relaxed">
                          {video.title}
                        </h3>

                        <p className="text-4xs text-zinc-500 dark:text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {video.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-zinc-100">
                        <span className="text-5xs font-mono text-zinc-400 font-semibold bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded uppercase">
                          {video.category}
                        </span>
                        
                        <div className="text-red-600 dark:text-red-400 font-bold text-4xs flex items-center gap-0.5">
                          <span>Ver video</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
