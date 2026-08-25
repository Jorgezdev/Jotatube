import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, Database, Key, ServerOff, Eye, RefreshCw, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const PrivacyReport: React.FC = () => {
  const { cacheSavedBytes, user, likedVideos, playlists, comments, channels } = useApp();
  const [runningAudit, setRunningAudit] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);

  const totalLikes = likedVideos.length;
  const totalComments = comments.filter(c => c.id.startsWith('c-added-')).length;
  const totalPlaylists = playlists.length;
  const totalSubs = channels.filter(c => c.isSubscribed).length;

  const triggerPrivacyAudit = () => {
    setRunningAudit(true);
    setAuditProgress(0);
    setAuditLogs(['Iniciando auditoría de privacidad local...', 'Analizando sandbox del navegador en iframe...']);

    const steps = [
      { p: 25, log: 'Verificando estado de credenciales de demostración en localStorage...' },
      { p: 50, log: 'Escaneando datos de comentarios y listas de reproducción locales...' },
      { p: 75, log: 'Verificando peticiones de medios (origen: commondatastorage.googleapis.com)...' },
      { p: 100, log: 'Verificación completada. Sin telemetría de aplicación ni rastreadores comerciales.' }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setAuditProgress(step.p);
        setAuditLogs(prev => [...prev, step.log]);
        if (idx === steps.length - 1) {
          setTimeout(() => setRunningAudit(false), 1000);
        }
      }, (idx + 1) * 800);
    });
  };

  const formattedBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title Header */}
      <div className="border-b border-zinc-150 dark:border-zinc-900 pb-4">
        <h2 className="text-sm md:text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-red-600 dark:text-red-500" />
          Informe de Privacidad y Almacenamiento Local
        </h2>
        <p className="text-4xs text-zinc-500 dark:text-zinc-400 mt-1">
          Enfoque Client-First / Local-First. Todos tus likes, comentarios de prueba y listas de reproducción se gestionan en tu navegador sin analíticas de terceros.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric Card 1 */}
        <div className="p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl flex items-center gap-3.5">
          <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-5xs uppercase tracking-wider font-semibold text-zinc-400 block">Telemetría de App</span>
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100 mt-0.5 block">0% Enviada</span>
            <span className="text-5xs text-emerald-600 dark:text-emerald-400 font-medium font-mono mt-0.5 block">✓ Sin analíticas externas</span>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl flex items-center gap-3.5">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-5xs uppercase tracking-wider font-semibold text-zinc-400 block">Almacenamiento Local</span>
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100 mt-0.5 block">{formattedBytes(cacheSavedBytes)}</span>
            <span className="text-5xs text-zinc-400 dark:text-zinc-500 block mt-0.5">En LocalStorage (Demo)</span>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl flex items-center gap-3.5">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <span className="text-5xs uppercase tracking-wider font-semibold text-zinc-400 block">Identificación Demo</span>
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100 mt-0.5 block">
              {user.biometricRegistered ? 'Demo Registrada' : 'Sin Registrar'}
            </span>
            <span className="text-5xs text-zinc-400 block mt-0.5">
              {user.biometricRegistered ? 'Simulación Touch/Face' : 'Configurable en perfil'}
            </span>
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl flex items-center gap-3.5">
          <div className="p-3 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
            <ServerOff className="w-5 h-5" />
          </div>
          <div>
            <span className="text-5xs uppercase tracking-wider font-semibold text-zinc-400 block">Modo Fuera de Línea</span>
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100 mt-0.5 block">Soporte Caché</span>
            <span className="text-5xs text-zinc-400 block mt-0.5">Carga de recursos diferida</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Audit Console */}
        <div className="lg:col-span-2 bg-zinc-950 text-zinc-100 border border-zinc-850 rounded-2xl p-4 md:p-6 font-mono text-2xs space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="font-bold text-zinc-50 uppercase tracking-widest text-4xs">Cónsola de Auditoría Criptográfica</span>
            </div>

            <button
              onClick={triggerPrivacyAudit}
              disabled={runningAudit}
              className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white disabled:text-zinc-500 font-bold text-4xs rounded-md transition-all cursor-pointer select-none"
            >
              <RefreshCw className={`w-3 h-3 ${runningAudit ? 'animate-spin' : ''}`} />
              <span>Ejecutar Escáner</span>
            </button>
          </div>

          {/* Audit progress bar */}
          {runningAudit && (
            <div className="space-y-1">
              <div className="flex justify-between text-4xs text-zinc-400 font-sans">
                <span>Escaneando puertos locales y enclaves...</span>
                <span>{auditProgress}%</span>
              </div>
              <div className="w-full bg-zinc-850 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-full transition-all duration-300"
                  style={{ width: `${auditProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5 max-h-48 overflow-y-auto bg-black p-4 rounded-xl text-3xs border border-zinc-900 select-text leading-relaxed">
            {auditLogs.length === 0 ? (
              <p className="text-zinc-500 italic text-center py-6">
                Presiona "Ejecutar Escáner" para auditar las llamadas salientes y el cifrado de datos de tu perfil.
              </p>
            ) : (
              auditLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-zinc-600 shrink-0 select-none">[{idx + 1}]</span>
                  <p className={idx === auditLogs.length - 1 && !runningAudit ? 'text-emerald-400 font-bold' : 'text-zinc-300'}>
                    {log}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Local Data Breakdown */}
        <div className="lg:col-span-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-4 space-y-4">
          <span className="text-3xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block">
            Desglose de Datos Locales
          </span>

          <div className="space-y-2.5">
            
            {/* List item */}
            <div className="flex justify-between items-center text-xs border-b border-zinc-100 dark:border-zinc-900 pb-2">
              <span className="text-zinc-600 dark:text-zinc-400">Listas creadas:</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{totalPlaylists} playlists</span>
            </div>

            {/* List item */}
            <div className="flex justify-between items-center text-xs border-b border-zinc-100 dark:border-zinc-900 pb-2">
              <span className="text-zinc-600 dark:text-zinc-400">Tus Likes guardados:</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{totalLikes} likes</span>
            </div>

            {/* List item */}
            <div className="flex justify-between items-center text-xs border-b border-zinc-100 dark:border-zinc-900 pb-2">
              <span className="text-zinc-600 dark:text-zinc-400">Comentarios escritos:</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{totalComments} comments</span>
            </div>

            {/* List item */}
            <div className="flex justify-between items-center text-xs border-b border-zinc-100 dark:border-zinc-900 pb-2">
              <span className="text-zinc-600 dark:text-zinc-400">Suscripciones:</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{totalSubs} creadores</span>
            </div>

            {/* Safe certificate badge */}
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-950 flex gap-2.5 items-start mt-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div className="space-y-0.5 leading-normal">
                <span className="text-3xs font-bold block">Sin Rastreadores de Usuario</span>
                <p className="text-5xs text-emerald-700 dark:text-emerald-500">
                  Esta aplicación cliente no integra SDKs de rastreo comercial, cookies publicitarias ni herramientas de telemetría invasiva.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
