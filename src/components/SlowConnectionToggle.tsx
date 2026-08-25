import React from 'react';
import { useApp } from '../context/AppContext';
import { Wifi, WifiOff, Cpu, Database, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// switch para simular una conexión 3G lenta
// Proporciona una interfaz visual de depuración en la parte superior del sitio web.
// Permite alternar entre una simulación de conexión rápida (fibra óptica) y lenta (3G)
// para comprobar el diseño adaptativo y los tiempos de búfer y optimizaciones de la web.
export const SlowConnectionToggle: React.FC = () => {
  // Suscripción al contexto para leer la velocidad actual, guardar cambios y monitorear bytes cacheados.
  const { connectionSpeed, setConnectionSpeed, cacheSavedBytes, addCacheBytes } = useApp();

  // Cambia el estado de conexión entre rápido y lento y escribe bytes de depuración en la caché
  const handleToggle = () => {
    const nextSpeed = connectionSpeed === 'fast' ? 'slow' : 'fast';
    setConnectionSpeed(nextSpeed);
    addCacheBytes(450); // Escribe 450 bytes de simulación al guardar el estado
  };

  // Función utilitaria para dar formato legible a los bytes guardados en almacenamiento local
  const formattedBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-1 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        {/* Sección Izquierda: Estadísticas de Privacidad local y Memoria de Caché */}
        <div className="flex items-center gap-2 font-mono text-zinc-600 dark:text-zinc-400">
          <Database className="w-3.5 h-3.5 text-red-600 dark:text-red-500 animate-pulse" />
          <span>Almacenamiento:</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
            Client-Side (LocalStorage)
          </span>
          <span className="hidden md:inline text-zinc-400">|</span>
          <Cpu className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden md:inline">Ahorro estimado (Demo):</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {formattedBytes(cacheSavedBytes)} simulados
          </span>
        </div>

        {/* Sección Derecha: Botón de Alternancia de velocidad de Red simulada */}
        <div className="flex items-center gap-2">
          <span className="font-sans text-zinc-500 dark:text-zinc-400 hidden xs:inline">
            Modulador de Red para Pruebas:
          </span>
          <button
            onClick={handleToggle}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-2xs font-semibold transition-all duration-300 shadow-xs cursor-pointer ${
              connectionSpeed === 'slow'
                ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800/60'
                : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/60'
            }`}
          >
            {connectionSpeed === 'slow' ? (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span>Simulando Conexión Lenta (3G)</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 animate-pulse" />
                <span>Fibra Óptica Activa (Rendimiento Óptimo)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
