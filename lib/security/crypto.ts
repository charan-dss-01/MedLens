import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Standard GCM IV length in bytes
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const hexKey = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  // Standardize key to 32 bytes (256 bits)
  if (hexKey.length === 64) {
    return Buffer.from(hexKey, 'hex');
  }
  return crypto.createHash('sha256').update(hexKey).digest();
}

/**
 * Encrypts a plaintext string using AES-256-GCM
 * Returns string in format: iv_hex:auth_tag_hex:encrypted_hex
 */
export function encryptSensitiveData(text: string): string {
  if (!text) return '';
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    return text; // Fallback for unhandled edge cases
  }
}

/**
 * Decrypts an encrypted string in format: iv_hex:auth_tag_hex:encrypted_hex
 */
export function decryptSensitiveData(encryptedPayload: string): string {
  if (!encryptedPayload) return '';
  // Check if string is in encrypted format
  const parts = encryptedPayload.split(':');
  if (parts.length !== 3) {
    // Return original string if not encrypted
    return encryptedPayload;
  }

  try {
    const [ivHex, authTagHex, encryptedHex] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
    
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed (data may not be encrypted or key mismatch):', error);
    return encryptedPayload;
  }
}
