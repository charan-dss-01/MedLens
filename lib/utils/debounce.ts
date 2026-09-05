/**
 * MedLens Debounced Function Wrapper
 * Prevents rapid repeated execution on search input fields and document uploads.
 */

/**
 * Creates a debounced version of a function that delays execution until wait ms have elapsed.
 * @param func Target function to debounce
 * @param wait Delay in milliseconds (default 300ms)
 * @complexity Time: O(1), Space: O(1)
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Sanitizes input string to prevent XSS injection.
 * @param input Raw text string
 * @complexity Time: O(N), Space: O(N) where N is input string length
 */
export function sanitizeInputText(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}
