/**
 * Formats a timestamp into a human-readable relative time string.
 * Accepts a Date, number (ms), or bigint (nanoseconds from ICP).
 */
export function formatTimeElapsed(timestamp: Date | number | bigint): string {
  let ms: number;

  if (timestamp instanceof Date) {
    ms = timestamp.getTime();
  } else if (typeof timestamp === 'bigint') {
    // ICP timestamps are in nanoseconds
    ms = Number(timestamp / 1_000_000n);
  } else {
    ms = timestamp;
  }

  const now = Date.now();
  const diff = now - ms;

  if (diff < 0) return 'just now';
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) {
    const mins = Math.floor(diff / 60_000);
    return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
  }
  if (diff < 86_400_000) {
    const hours = Math.floor(diff / 3_600_000);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  if (diff < 2_592_000_000) {
    const days = Math.floor(diff / 86_400_000);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
  const months = Math.floor(diff / 2_592_000_000);
  return `${months} month${months !== 1 ? 's' : ''} ago`;
}
