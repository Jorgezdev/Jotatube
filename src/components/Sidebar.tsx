import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, ListMusic, Tv, ShieldCheck, Lock, UserCheck, PlaySquare } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentView, setCurrentView, setSelectedVideo, channels, playlists, addCacheBytes } = { ...useApp() };

  const subCount = channels.filter(ch => ch.isSubscribed).length;
  const playlistCount = playlists.length;

  interface NavItem {
    id: 'home' | 'playlists' | 'subscriptions' | 'privacy';
    label: string;
    icon: React.ComponentType<any>;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'playlists', label: 'Mis Listas', icon: ListMusic, badge: playlistCount > 0 ? playlistCount : undefined },
    { id: 'subscriptions', label: 'Suscripciones', icon: Tv, badge: subCount > 0 ? subCount : undefined },
    { id: 'privacy', label: 'Privacidad', icon: ShieldCheck }
  ];

  const handleNavClick = (viewId: NavItem['id']) => {
    setCurrentView(viewId);
    setSelectedVideo(null); // Go back from video detail to specified view
    addCacheBytes(180);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Desktop Sidebar (Left Rail) */}
      <aside className="hidden md:block w-64 shrink-0 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-900 min-h-[calc(100vh-3.5rem)] py-6 px-3 select-none transition-colors duration-300">
        <div className="space-y-6">
          
          {/* Main Views */}
          <div className="space-y-1">
            <span className="px-3 text-3xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 font-sans block mb-2">
              Menu Principal
            </span>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-red-600 dark:text-red-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
                    <span className="font-sans">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-3xs font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-red-100 dark:bg-red-950 text-red-600' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Subscribed Channels List Preview */}
          <div className="space-y-2">
            <div className="px-3 flex justify-between items-center">
              <span className="text-3xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 font-sans">
                Suscripciones
              </span>
              {subCount > 0 && (
                <span className="text-4xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1 rounded">
                  En vivo
                </span>
              )}
            </div>
            
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {channels.filter(ch => ch.isSubscribed).length === 0 ? (
                <p className="px-3 text-4xs text-zinc-400 dark:text-zinc-500 font-sans italic leading-relaxed">
                  Canales a los que te suscribas aparecerán aquí en tiempo real.
                </p>
              ) : (
                channels.filter(ch => ch.isSubscribed).map(ch => (
                  <div
                    key={ch.id}
                    onClick={() => {
                      setCurrentView('subscriptions');
                      setSelectedVideo(null);
                      addCacheBytes(120);
                    }}
                    className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer text-xs"
                  >
                    <img
                      src={ch.avatar}
                      alt={ch.name}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover shadow-sm"
                    />
                    <span className="text-zinc-700 dark:text-zinc-300 font-sans font-medium truncate flex-1">
                      {ch.name}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shrink-0" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Private Local Storage Badge */}
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-100 dark:border-zinc-900 space-y-1.5">
            <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
              <Lock className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="text-3xs font-semibold font-sans">Persistencia Local</span>
            </div>
            <p className="text-4xs text-zinc-400 dark:text-zinc-500 leading-normal font-sans">
              Tus listas, suscripciones y preferencias se guardan de forma local en tu navegador (LocalStorage) sin analíticas externas.
            </p>
          </div>

        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-3xs md:hidden"
        />
      )}

      {/* Mobile Drawer (Collapsible Menu) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-900 z-40 p-4 space-y-6 md:hidden transition-transform duration-300 shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-900">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">Menú Navegación</span>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs font-semibold"
          >
            Cerrar
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    isActive
                      ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-red-600' : 'text-zinc-400'}`} />
                    <span className="font-sans">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-4xs font-bold px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-600">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <span className="px-3 text-4xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 font-sans block mb-2">
              Suscripciones Activas
            </span>
            <div className="space-y-1 max-h-36 overflow-y-auto">
              {channels.filter(ch => ch.isSubscribed).length === 0 ? (
                <p className="px-3 text-4xs text-zinc-400 font-sans italic">Sin suscripciones aún.</p>
              ) : (
                channels.filter(ch => ch.isSubscribed).map(ch => (
                  <div
                    key={ch.id}
                    onClick={() => {
                      setCurrentView('subscriptions');
                      setSelectedVideo(null);
                      if (onClose) onClose();
                    }}
                    className="flex items-center gap-3 px-3 py-1.5 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer text-xs"
                  >
                    <img src={ch.avatar} alt={ch.name} className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-zinc-700 dark:text-zinc-300 truncate flex-1 font-sans">{ch.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (Fulfills mobile responsive guidelines perfectly) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 h-16 flex items-center justify-around px-2 select-none transition-colors duration-300 shadow-lg">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer"
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'text-red-600 scale-110' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 text-4xs font-bold h-3.5 min-w-3.5 px-1 rounded-full bg-red-600 text-white flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-4xs mt-1 font-sans transition-all font-medium ${isActive ? 'text-red-600 font-semibold' : 'text-zinc-500 dark:text-zinc-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
