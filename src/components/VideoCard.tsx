import React, { useState, useEffect } from 'react';
import { Video } from '../types';
import { useApp } from '../context/AppContext';
import { Play, Eye, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface VideoCardProps {
  video: Video;
  onClick: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  const { connectionSpeed, addCacheBytes } = useApp();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isCached, setIsCached] = useState(false);

  // Simulate local cache check
  useEffect(() => {
    const viewed = localStorage.getItem(`yt_viewed_${video.id}`);
    if (viewed === 'true' || Math.random() > 0.6) {
      setIsCached(true);
    }
  }, [video.id]);

  const handleCardClick = () => {
    localStorage.setItem(`yt_viewed_${video.id}`, 'true');
    // If connection speed is slow, we save a huge chunk of network transit bytes because we already "cached" the data
    const savedNetworkTransit = connectionSpeed === 'slow' ? 320000 : 45000;
    addCacheBytes(savedNetworkTransit);
    onClick();
  };

  const formattedViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)} M de vistas`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(0)} K de vistas`;
    }
    return `${views} vistas`;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className="group flex flex-col bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/60 dark:border-zinc-900/60 overflow-hidden shadow-xs hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-850 transition-all cursor-pointer select-none h-full"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
        {/* Progressive Loading & Blur */}
        {connectionSpeed === 'slow' && !imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-900 dark:to-zinc-800 animate-pulse flex flex-col items-center justify-center p-4">
            <span className="text-4xs font-mono text-zinc-500 text-center">Optimización 3G Activa</span>
            <span className="text-4xs font-mono text-zinc-400 mt-1">Cargando portada progresiva...</span>
          </div>
        )}

        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? 'scale-100 blur-0' : 'scale-105 blur-md'
          } group-hover:scale-102`}
        />

        {/* Video Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-white text-4xs font-bold font-mono px-1.5 py-0.5 rounded-md flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          <span>{video.duration}</span>
        </div>

        {/* Caching indicator badge in slow connection */}
        {isCached && (
          <div className="absolute top-2 left-2 bg-emerald-600/90 backdrop-blur-xs text-white text-5xs font-mono font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1 shadow-xs uppercase">
            <ShieldCheck className="w-2.5 h-2.5" />
            <span>Caché Local</span>
          </div>
        )}

        {/* Hover play button overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
          <div className="bg-white/95 dark:bg-zinc-900/95 text-red-600 dark:text-red-500 p-2.5 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-200">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Video Info Content */}
      <div className="p-4 flex gap-3 flex-1">
        {/* Channel Avatar */}
        <img
          src={video.channelAvatar}
          alt={video.channelName}
          referrerPolicy="no-referrer"
          className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 border border-zinc-100 dark:border-zinc-900"
        />

        {/* Text Details */}
        <div className="flex flex-col flex-1 min-w-0">
          <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 font-sans line-clamp-2 leading-relaxed group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            {video.title}
          </h4>

          <span className="text-3xs text-zinc-500 dark:text-zinc-400 font-sans font-medium mt-1.5 hover:text-zinc-700 dark:hover:text-zinc-350 truncate">
            {video.channelName}
          </span>

          <div className="flex items-center gap-1.5 text-4xs text-zinc-400 dark:text-zinc-500 font-mono mt-1 shrink-0">
            <div className="flex items-center gap-0.5">
              <Eye className="w-2.5 h-2.5" />
              <span>{formattedViews(video.views)}</span>
            </div>
            <span>•</span>
            <span>{video.publishedAt}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
