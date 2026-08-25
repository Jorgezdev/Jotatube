import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Fingerprint, Scan, ShieldCheck, Eye, EyeOff, Lock, User, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BiometricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
}

export const BiometricsModal: React.FC<BiometricsModalProps> = ({ isOpen, onClose, mode }) => {
    // estado global compartido (likes, playlists, sesión, etc.)
  const { user, loginWithBiometrics, registerBiometrics, addCacheBytes } = useApp();
  
    // estado local del modal
  // Almacena el nombre del usuario o alias durante el registro
  const [username, setUsername] = useState('');
  // Guarda el tipo de autenticación biométrica elegida (Touch ID o Face ID)
  const [biometricType, setBiometricType] = useState<'touchid' | 'faceid'>('touchid');
  // Controla el estado actual del flujo biométrico (inactivo, escaneando, éxito o error)
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  // Lleva la cuenta del porcentaje de progreso de la simulación del escaneo (0 a 100)
  const [progress, setProgress] = useState(0);
  // Mensaje detallado que se muestra al usuario en caso de ocurrir algún error
  const [errorMessage, setErrorMessage] = useState('');

    // resetea el modal al cerrarse
  // Reinicia los estados locales cada vez que el modal se abre o cierra.
  // Si el modal está en modo de inicio de sesión ('login') y el usuario ya tiene la biometría registrada,
  // se dispara automáticamente la simulación del escaneo de huella/rostro.
  useEffect(() => {
    if (!isOpen) {
      setStatus('idle');
      setProgress(0);
      setErrorMessage('');
    } else if (mode === 'login' && user.biometricRegistered) {
      // Dispara automáticamente el escaneo si ya está registrado
      handleBiometricScan();
    }
  }, [isOpen, mode]);

    // simula el escaneo de huella/rostro
  // Simula el proceso seguro de autenticación WebAuthn y actualiza los flujos en el estado global.
  const handleBiometricScan = async () => {
    setStatus('scanning');
    setProgress(0);
    // Simula el consumo de ancho de banda local (caché/datos) para realizar el handshake seguro
    addCacheBytes(1200);

    // Animación visual para simular el progreso del escaneo biométrico en milisegundos
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 50);

    // Simulación asíncrona del apretón de manos (handshake) criptográfico de WebAuthn / FIDO2
    setTimeout(async () => {
      try {
        if (mode === 'login') {
          // Intenta autenticar el usuario con credenciales biométricas locales persistidas
          await loginWithBiometrics(user.username || 'Usuario VIP');
          setStatus('success');
          setTimeout(() => {
            onClose();
          }, 1200);
        } else {
          // Flujo de Registro: Valida que el nombre de usuario no esté vacío
          if (!username.trim()) {
            clearInterval(interval);
            setStatus('error');
            setErrorMessage('Por favor ingrese un nombre de usuario.');
            return;
          }
          await registerBiometrics(username, biometricType);
          setStatus('success');
          setTimeout(() => {
            onClose();
          }, 1200);
        }
      } catch (err) {
        setStatus('error');
        setErrorMessage('Fallo en la verificación biométrica. Inténtelo de nuevo.');
      }
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md overflow-hidden bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Logo / Badge */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-sans flex items-center justify-center gap-2">
            {mode === 'login' ? 'Acceso Biométrico' : 'Registro de Perfil'}
            <span className="text-4xs font-mono bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full font-semibold">
              DEMO
            </span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs font-sans">
            {mode === 'login'
              ? 'Simulación de verificación de identidad local para pruebas de frontend.'
              : 'Configura un alias y selecciona tu método preferido de autenticación visual.'}
          </p>

          {/* Form for registering */}
          {mode === 'register' && status === 'idle' && (
            <div className="w-full mt-5 space-y-4 text-left">
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 font-sans">
                  Nombre de Usuario o Alias
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ej. Juan Perez"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-red-500 focus:border-red-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 font-sans">
                  Tipo de Autenticador
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBiometricType('touchid')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      biometricType === 'touchid'
                        ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400'
                        : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <Fingerprint className="w-4 h-4" />
                    <span>Huella Digital</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBiometricType('faceid')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      biometricType === 'faceid'
                        ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400'
                        : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <Scan className="w-4 h-4" />
                    <span>Rostro ID</span>
                  </button>
                </div>
              </div>

              <button
                onClick={handleBiometricScan}
                className="w-full py-2.5 mt-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 font-sans"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Registrar Perfil Local (Demo)</span>
              </button>
            </div>
          )}

          {/* Scanning Animation Stage */}
          {status === 'scanning' && (
            <div className="my-6 flex flex-col items-center">
              <div className="relative flex items-center justify-center w-28 h-28 border border-zinc-200 dark:border-zinc-800 rounded-full bg-zinc-50 dark:bg-zinc-900/50">
                {/* Rotating ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-2 border-2 border-dashed border-red-500/40 rounded-full"
                />

                {/* Laser scan bar */}
                <motion.div
                  animate={{ y: [-36, 36, -36] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-4 right-4 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444]"
                />

                {biometricType === 'touchid' ? (
                  <Fingerprint className="w-12 h-12 text-red-600 dark:text-red-400" />
                ) : (
                  <Scan className="w-12 h-12 text-red-600 dark:text-red-400" />
                )}
              </div>

              <div className="mt-4 w-48 bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-red-600 h-full transition-all duration-100 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-2xs font-mono text-zinc-400 dark:text-zinc-500 mt-2">
                SIMULACIÓN DE VERIFICACIÓN: {progress}%
              </span>
            </div>
          )}

          {/* Success Stage */}
          {status === 'success' && (
            <div className="my-8 flex flex-col items-center">
              <div className="flex items-center justify-center w-20 h-20 bg-emerald-100 dark:bg-emerald-950/30 rounded-full text-emerald-600 dark:text-emerald-400 shadow-lg">
                <ShieldCheck className="w-10 h-10 animate-bounce" />
              </div>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-4 font-sans">
                {mode === 'login' ? '¡Acceso Concedido!' : '¡Registro Completado!'}
              </span>
              <p className="text-2xs text-zinc-400 font-mono mt-1">
                Estado: SESIÓN_LOCAL_AUTORIZADA
              </p>
            </div>
          )}

          {/* Error Stage */}
          {status === 'error' && (
            <div className="my-6 flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-950/30 rounded-full text-amber-600 dark:text-amber-400 mb-3">
                <AlertCircle className="w-8 h-8" />
              </div>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 font-sans">
                Error en Registro
              </span>
              <p className="text-xs text-red-500 mt-1 max-w-xs px-4">
                {errorMessage}
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 px-3 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg cursor-pointer"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Footnote about privacy */}
          <div className="w-full mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-900 flex items-start gap-2 text-left">
            <Lock className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <p className="text-2xs text-zinc-400 dark:text-zinc-500 font-sans">
              <strong>Modo Demostración:</strong> Este flujo es una simulación visual para pruebas de frontend. No solicita acceso a hardware real ni transmite datos fuera del navegador.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
