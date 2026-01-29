/**
 * Storage utility for handling localStorage operations.
 */
export const StorageUtil = {
  /**
   * Get item from localStorage.
   */
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  },

  /**
   * Set item in localStorage.
   */
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;

    const item = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, item);
  },

  /**
   * Remove item from localStorage.
   */
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  /**
   * Clear all items from localStorage.
   */
  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  },
};
