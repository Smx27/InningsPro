/**
 * Generates a cryptographically secure unique ID.
 * Falls back to a pseudo-random ID if crypto is not available (e.g. in some test environments).
 *
 * @param prefix - Optional prefix for the ID
 * @returns A unique string ID
 */
export const generateId = (prefix?: string): string => {
  let id: string;

  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    id = crypto.randomUUID();
  } else {
    // Fallback for environments where crypto.randomUUID is not available
    // Using a combination of timestamp and Math.random as a last resort
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).slice(2, 10);
    id = `${timestamp}-${random}`;
  }

  return prefix ? `${prefix}-${id}` : id;
};
