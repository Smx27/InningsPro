/**
 * Generates a cryptographically secure unique ID.
 * Uses `crypto.randomUUID()` if available, otherwise falls back to `crypto.getRandomValues()`.
 *
 * @param prefix - Optional prefix for the ID
 * @returns A unique string ID
 * @throws Error if no secure random number generator is available
 */
export const generateId = (prefix?: string): string => {
  let id: string;

  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    id = crypto.randomUUID();
  } else if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    // Fallback for environments where crypto.randomUUID is not available but getRandomValues is
    // This implements a basic UUID v4 format
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    // Set version to 4 (UUID v4)
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    // Set variant to 10xx (RFC4122)
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    id = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
  } else {
    throw new Error('Cryptographically secure random number generator is not available.');
  }

  return prefix ? `${prefix}-${id}` : id;
};
