import crypto from 'crypto';

/**
 * Calculates SHA-256 hash of a file buffer or string content
 */
export function calculateFileHash(buffer: Buffer | string): string {
  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  return hash.digest('hex');
}
