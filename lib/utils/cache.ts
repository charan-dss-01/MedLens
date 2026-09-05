/**
 * MedLens Client-Side LRU Session Cache & Query Memoizer
 * Minimizes redundant Gemini API extractions and payload transmissions.
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hash: string;
}

export class LRUSessionCache<T = any> {
  private capacity: number;
  private cache: Map<string, CacheEntry<T>>;
  private storageKeyPrefix: string;

  /**
   * @param capacity Maximum number of entries to store in memory (default 50)
   * @param storageKeyPrefix Prefix for sessionStorage keys
   * @complexity Time: O(1), Space: O(N)
   */
  constructor(capacity = 50, storageKeyPrefix = 'medlens_cache_') {
    this.capacity = capacity;
    this.cache = new Map();
    this.storageKeyPrefix = storageKeyPrefix;
  }

  /**
   * Generates a deterministic hash key for queries or payload buffers.
   * @complexity Time: O(N), Space: O(1) where N is input string length
   */
  public generateHashKey(input: string): string {
    let hash = 0;
    if (input.length === 0) return 'hash_empty';
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return `hash_${Math.abs(hash).toString(36)}`;
  }

  /**
   * Retrieves a item from LRU memory cache or sessionStorage fallback.
   * @complexity Time: O(1), Space: O(1)
   */
  public get(key: string): T | null {
    const hashedKey = this.generateHashKey(key);

    if (this.cache.has(hashedKey)) {
      const entry = this.cache.get(hashedKey)!;
      // Refresh key position in Map for LRU tracking
      this.cache.delete(hashedKey);
      this.cache.set(hashedKey, entry);
      return entry.data;
    }

    // Fallback to sessionStorage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const stored = sessionStorage.getItem(this.storageKeyPrefix + hashedKey);
        if (stored) {
          const entry: CacheEntry<T> = JSON.parse(stored);
          this.cache.set(hashedKey, entry);
          return entry.data;
        }
      } catch (err) {
        console.warn('LRU Storage read error:', err);
      }
    }

    return null;
  }

  /**
   * Stores an item in LRU cache and syncs to sessionStorage.
   * Evicts least recently used items if capacity is exceeded.
   * @complexity Time: O(1), Space: O(1)
   */
  public set(key: string, data: T): void {
    const hashedKey = this.generateHashKey(key);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      hash: hashedKey,
    };

    if (this.cache.has(hashedKey)) {
      this.cache.delete(hashedKey);
    } else if (this.cache.size >= this.capacity) {
      // Evict oldest entry (first item in Map iterator)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
        if (typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.removeItem(this.storageKeyPrefix + oldestKey);
        }
      }
    }

    this.cache.set(hashedKey, entry);

    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.setItem(this.storageKeyPrefix + hashedKey, JSON.stringify(entry));
      } catch (err) {
        console.warn('LRU Storage write error:', err);
      }
    }
  }

  /**
   * Clears the in-memory and session storage cache.
   * @complexity Time: O(N), Space: O(1)
   */
  public clear(): void {
    this.cache.clear();
    if (typeof window !== 'undefined' && window.sessionStorage) {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith(this.storageKeyPrefix)) {
          sessionStorage.removeItem(key);
        }
      });
    }
  }
}

export const queryCache = new LRUSessionCache();
