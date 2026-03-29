/**
 * App settings — FTP persistence via localStorage.
 */

const FTP_KEY = 'ftp';
const FTP_DEFAULT = 200;

/**
 * Get the stored FTP value, or the default (200W) if none is saved.
 * @returns {number}
 */
export function getFtp() {
  const stored = localStorage.getItem(FTP_KEY);
  if (stored === null) return FTP_DEFAULT;
  const value = parseInt(stored, 10);
  return Number.isFinite(value) && value > 0 ? value : FTP_DEFAULT;
}

/**
 * Save a new FTP value to localStorage.
 * @param {number|string} value
 * @throws {Error} if value is not a positive integer
 */
export function setFtp(value) {
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 9999) {
    throw new Error('FTP must be a positive number between 1 and 9999.');
  }
  localStorage.setItem(FTP_KEY, String(parsed));
}
