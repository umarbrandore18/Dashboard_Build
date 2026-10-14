/**
 * Safe local storage manager with in-memory fallback
 */

const memoryStore: Record<string, string> = {};

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const raw = window.localStorage.getItem(key);
      if (!raw) return defaultValue;
      return JSON.parse(raw) as T;
    } catch (e) {
      console.warn(`[storage] Failed to read key "${key}":`, e);
      if (memoryStore[key]) {
        try {
          return JSON.parse(memoryStore[key]) as T;
        } catch {
          return defaultValue;
        }
      }
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, serialized);
      }
      memoryStore[key] = serialized;
      return true;
    } catch (e) {
      console.warn(`[storage] Failed to write key "${key}":`, e);
      try {
        memoryStore[key] = JSON.stringify(value);
      } catch {
        // ignore
      }
      return false;
    }
  },

  remove(key: string): void {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      delete memoryStore[key];
    } catch (e) {
      console.warn(`[storage] Failed to remove key "${key}":`, e);
    }
  },

  clearAll(): void {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
      }
      Object.keys(memoryStore).forEach((k) => delete memoryStore[k]);
    } catch (e) {
      console.warn('[storage] Failed to clear storage:', e);
    }
  },
};

