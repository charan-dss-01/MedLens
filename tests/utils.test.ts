import { describe, it, expect, beforeEach } from 'vitest';
import { LRUSessionCache } from '../lib/utils/cache';
import { compressImagePayload } from '../lib/utils/imageCompressor';
import { debounce, sanitizeInputText } from '../lib/utils/debounce';
import { calculateFileHash } from '../lib/security/hash';
import { encryptSensitiveData, decryptSensitiveData } from '../lib/security/crypto';

describe('Utility & Performance Test Suite', () => {
  let cache: LRUSessionCache<string>;

  beforeEach(() => {
    cache = new LRUSessionCache<string>(3, 'test_cache_');
    cache.clear();
  });

  it('LRU Cache stores and retrieves memoized data correctly', () => {
    cache.set('key1', 'payload_1');
    expect(cache.get('key1')).toBe('payload_1');
  });

  it('LRU Cache evicts least recently used items when capacity is exceeded', () => {
    cache.set('key1', 'payload_1');
    cache.set('key2', 'payload_2');
    cache.set('key3', 'payload_3');

    // Access key1 to make key2 the least recently used
    cache.get('key1');

    // Adding key4 should evict key2
    cache.set('key4', 'payload_4');

    expect(cache.get('key1')).toBe('payload_1');
    expect(cache.get('key2')).toBeNull(); // Evicted
    expect(cache.get('key3')).toBe('payload_3');
    expect(cache.get('key4')).toBe('payload_4');
  });

  it('sanitizeInputText escapes XSS scripts and dangerous HTML entities', () => {
    const rawInput = '<script>alert("xss")</script>';
    const sanitized = sanitizeInputText(rawInput);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('sanitizeInputText handles empty or whitespace input safely', () => {
    expect(sanitizeInputText('')).toBe('');
    expect(sanitizeInputText('   ')).toBe('');
  });

  it('compressImagePayload handles string input payload compression', async () => {
    const rawData = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const result = await compressImagePayload(rawData);

    expect(result).toHaveProperty('base64Data');
    expect(result).toHaveProperty('compressedSize');
    expect(result.compressedSize).toBeGreaterThan(0);
  });

  it('calculateFileHash computes deterministic SHA-256 hash', () => {
    const buffer1 = Buffer.from('PDF_TEST_DATA');
    const buffer2 = Buffer.from('PDF_TEST_DATA');
    const buffer3 = Buffer.from('DIFFERENT_DATA');

    const hash1 = calculateFileHash(buffer1);
    const hash2 = calculateFileHash(buffer2);
    const hash3 = calculateFileHash(buffer3);

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
    expect(hash1.length).toBe(64);
  });

  it('encryptSensitiveData & decryptSensitiveData preserve PII privacy', () => {
    const originalText = 'Robert Chen - Patient 102';
    const encrypted = encryptSensitiveData(originalText);
    const decrypted = decryptSensitiveData(encrypted);

    expect(encrypted).not.toBe(originalText);
    expect(decrypted).toBe(originalText);
  });

  it('debounce delays function invocation until wait period elapses', async () => {
    let count = 0;
    const increment = debounce(() => {
      count++;
    }, 50);

    increment();
    increment();
    increment();

    expect(count).toBe(0);

    await new Promise((r) => setTimeout(r, 100));
    expect(count).toBe(1);
  });
});
