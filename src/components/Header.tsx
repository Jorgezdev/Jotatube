import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Bell, Sun, Moon, ShieldAlert, ShieldCheck, LogOut, Check, Trash2, Fingerprint, HelpCircle, Menu, Info } from 'lucide-react';
import { BiometricsModal } from './BiometricsModal';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC<{ onMenuToggle?: () => void }> = ({ onMenuToggle }) => {
  const {
    searchQuery,
    setSearchQuery,
    darkMode,
    setDarkMode,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    user,
    logout,
    setCurrentView,
    setSelectedVideo,
    addCacheBytes
  } = useApp();

    // estado local del header (búsqueda, menús, etc.)
  // Almacena el texto actual en la barra de búsqueda de forma local antes de enviarla
  const [localSearch, setLocalSearch] = useState(searchQuery);
  // Controla si se muestra el panel emergente de notificaciones locales
  const [showNotifications, setShowNotifications] = useState(false);
  // Controla la visibilidad de la ventana de perfil de usuario y opciones de seguridad
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  // Controla si el modal de escaneo biométrico (TouchID/FaceID) está abierto
  const [biometricsOpen, setBiometricsOpen] = useState(false);
  // Define si el modal biométrico se abre para Registrarse o para Iniciar Sesión
  const [biometricsMode, setBiometricsMode] = useState<'login' | 'register'>('login');

  // Referencias para cerrar menús desplegables de forma táctil/clic externo
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

    // mantiene el input sincronizado si la búsqueda cambia desde afuera
  // Sincroniza el campo de entrada local si la búsqueda se borra o actualiza externamente.
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

    // cierra los menús al hacer clic fuera
  // Cierra los menús flotantes de notificaciones y perfil si el usuario hace clic fuera de ellos.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

    // maneja el submit del buscador
  // Ejecuta la búsqueda de videos, redirige a la vista de Inicio y simula la escritura en caché.
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setCurrentView('home');
    setSelectedVideo(null); // Vuelve a la parrilla de inicio si estaba en un video
    addCacheBytes(400);
  };

  // Cuenta de notificaciones no leídas
  const unreadCount = notifications.filter(n => !n.isRead).length;

    // acciones del menú de perfil/biometría
  // Abre el modal para registrar nuevas credenciales biométricas locales (TouchID/FaceID)
  const triggerRegisterBiometrics = () => {
    setBiometricsMode('register');
    setBiometricsOpen(true);
    setShowProfileMenu(false);
  };

  // Abre el modal para verificar la identidad mediante el escáner biométrico local
  const triggerLoginBiometrics = () => {
    setBiometricsMode('login');
    setBiometricsOpen(true);
    setShowProfileMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-3">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg md:hidden cursor-pointer text-zinc-600 dark:text-zinc-300"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div 
            onClick={() => {
              setSearchQuery('');
              setLocalSearch('');
              setCurrentView('home');
              setSelectedVideo(null);
            }}
            className="flex items-center gap-1.5 cursor-pointer select-none shrink-0"
          >
            <div className="bg-red-600 text-white p-1 rounded-lg shadow-sm">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11C6.482 20.455 12 20.455 12 20.455s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <span className="text-base font-bold font-sans tracking-tight bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent hidden xs:inline">
              YouTube<span className="text-zinc-900 dark:text-zinc-50 ml-0.5">Local</span>
            </span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg">
          <div className="relative flex items-center">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Buscar videos, canales, tutoriales..."
              className="w-full pl-3 pr-10 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-zinc-900 dark:text-zinc-50 focus:outline-hidden focus:ring-1 focus:ring-red-500 focus:border-red-500 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all font-sans"
            />
            <button
              type="submit"
              className="absolute right-1 p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full text-zinc-500 dark:text-zinc-400 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-1.5">
          
          {/* Theme Toggle */}
          <button
            onClick={() => {
              setDarkMode(prev => !prev);
              addCacheBytes(100);
            }}
            title="Cambiar Modo Visual"
            className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors cursor-pointer"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Notifications Center */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                addCacheBytes(150);
              }}
              title="Notificaciones"
              className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-3xs font-bold text-white leading-none scale-90">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl shadow-xl overflow-hidden z-50 font-sans text-xs"
                >
                  <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-100">Notificaciones</span>
                    <div className="flex gap-2">
                      <button
                        onClick={markAllNotificationsAsRead}
                        title="Marcar todo como leído"
                        className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-sm text-zinc-500 dark:text-zinc-400 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={clearNotifications}
                        title="Borrar todo"
                        className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-sm text-zinc-500 dark:text-zinc-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-900">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-zinc-400 dark:text-zinc-500">
                        No tienes notificaciones
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            if (notif.videoId) {
                              // If there is an associated video, click to play it
                              const found = notifications.find(n => n.id === notif.id);
                              if (found) {
                                // Simple find placeholder since we have global state
                              }
                            }
                            markNotificationAsRead(notif.id);
                            setShowNotifications(false);
                          }}
                          className={`p-3 transition-colors cursor-pointer ${
                            notif.isRead
                              ? 'bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900'
                              : 'bg-red-50/40 dark:bg-red-950/10 hover:bg-red-50/70 dark:hover:bg-red-950/20'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className={`font-medium text-zinc-900 dark:text-zinc-100 ${!notif.isRead ? 'font-semibold' : ''}`}>
                              {notif.title}
                            </span>
                            {!notif.isRead && (
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                            {notif.message}
                          </p>
                          <span className="text-3xs text-zinc-400 dark:text-zinc-500 block mt-1">
                            {notif.timestamp}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User/Biometrics Control */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                addCacheBytes(150);
              }}
              className={`flex items-center gap-1.5 p-1 rounded-full border cursor-pointer select-none transition-all duration-300 ${
                user.isAuthenticated
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/10 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                  : 'border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              {user.isAuthenticated ? (
                <>
                  <img
                    src={user.avatar}
                    alt={user.username}
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover shadow-xs border border-emerald-500"
                  />
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </>
              ) : (
                <>
                  <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                    <Fingerprint className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-3xs font-medium pr-1.5 text-zinc-700 dark:text-zinc-300 font-sans hidden xs:inline">
                    Acceder
                  </span>
                </>
              )}
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl shadow-xl overflow-hidden z-50 font-sans text-xs"
                >
                  {user.isAuthenticated ? (
                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-900">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-10 h-10 rounded-full object-cover border border-emerald-500"
                        />
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100">{user.username}</p>
                          <span className="text-3xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5 font-mono">
                            <ShieldCheck className="w-3 h-3" /> Acceso Local Activo
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="text-3xs text-zinc-500 dark:text-zinc-400">
                          Tus playlists y configuraciones se guardan localmente en tu navegador.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-900">
                      <p className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Inicia sesión de prueba</p>
                      <p className="text-zinc-500 dark:text-zinc-400 leading-normal mb-3">
                        Configura un alias o demo biométrica para tu sesión de pruebas.
                      </p>
                      <button
                        onClick={triggerRegisterBiometrics}
                        className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-center cursor-pointer transition-colors"
                      >
                        Iniciar Sesión Demo
                      </button>
                    </div>
                  )}

                  <div className="p-1.5 divide-y divide-zinc-100 dark:divide-zinc-900">
                    {user.isAuthenticated ? (
                      <button
                        onClick={() => {
                          logout();
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg cursor-pointer font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={triggerLoginBiometrics}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg cursor-pointer font-medium"
                        >
                          <Fingerprint className="w-4 h-4 text-zinc-400" />
                          <span>Identificación Demo</span>
                        </button>
                        <button
                          onClick={() => {
                            setCurrentView('privacy');
                            setShowProfileMenu(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg cursor-pointer"
                        >
                          <HelpCircle className="w-4 h-4 text-zinc-400" />
                          <span>Auditoría de Privacidad</span>
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Biometrics Handling Modals */}
      <BiometricsModal
        isOpen={biometricsOpen}
        onClose={() => setBiometricsOpen(false)}
        mode={biometricsMode}
      />
    </header>
  );
};
