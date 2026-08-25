/**
 * Abstracción de acceso seguro a almacenamiento local (localStorage).
 * Maneja serialización JSON, captura de excepciones (ej. modo incógnito, cuota excedida)
 * y provee valores por defecto en caso de fallo.
 */

export const StorageService = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[StorageService] Error al leer la clave "${key}":`, error);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`[StorageService] Error al guardar la clave "${key}":`, error);
      return false;
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[StorageService] Error al eliminar la clave "${key}":`, error);
    }
  }
};
