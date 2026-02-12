// localStorage-backed order history store for guest checkout persistence

const STORAGE_KEY = 'binance-giftcards-order-history';
const MAX_ORDERS = 50; // Keep last 50 orders

export interface OrderHistoryEntry {
  orderId: string;
  lastSeen: number; // timestamp
  lastKnownStatus?: string;
}

// Safe parse with fallback
function safeParseStorage(): OrderHistoryEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item: any) =>
        item &&
        typeof item.orderId === 'string' &&
        typeof item.lastSeen === 'number'
    );
  } catch (error) {
    console.error('Failed to parse order history from localStorage:', error);
    return [];
  }
}

// Save to localStorage
function saveToStorage(entries: OrderHistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Failed to save order history to localStorage:', error);
  }
}

// Load all order history entries
export function loadOrderHistory(): OrderHistoryEntry[] {
  return safeParseStorage();
}

// Add or update an order in history (de-duplicated, newest first)
export function addOrderToHistory(
  orderId: string,
  lastKnownStatus?: string
): void {
  const entries = safeParseStorage();
  
  // Remove existing entry if present
  const filtered = entries.filter((e) => e.orderId !== orderId);
  
  // Add new entry at the beginning (newest first)
  const newEntry: OrderHistoryEntry = {
    orderId,
    lastSeen: Date.now(),
    lastKnownStatus,
  };
  
  const updated = [newEntry, ...filtered];
  
  // Keep only last MAX_ORDERS
  const bounded = updated.slice(0, MAX_ORDERS);
  
  saveToStorage(bounded);
  
  // Dispatch storage event for cross-tab sync
  window.dispatchEvent(new Event('storage'));
}

// Update last known status for an order
export function updateOrderStatus(orderId: string, status: string): void {
  const entries = safeParseStorage();
  const updated = entries.map((e) =>
    e.orderId === orderId
      ? { ...e, lastSeen: Date.now(), lastKnownStatus: status }
      : e
  );
  saveToStorage(updated);
  window.dispatchEvent(new Event('storage'));
}

// Remove an order from history
export function removeOrderFromHistory(orderId: string): void {
  const entries = safeParseStorage();
  const filtered = entries.filter((e) => e.orderId !== orderId);
  saveToStorage(filtered);
  window.dispatchEvent(new Event('storage'));
}

// Clear all order history
export function clearOrderHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('Failed to clear order history:', error);
  }
}
