// localStorage-backed order history store with crash-safe fallback to in-memory state

const STORAGE_KEY = 'binance-giftcards-order-history';
const MAX_ORDERS = 50; // Keep last 50 orders

export interface OrderHistoryEntry {
  orderId: string;
  lastSeen: number; // timestamp
  lastKnownStatus?: string;
}

// In-memory fallback when localStorage is unavailable
let inMemoryFallback: OrderHistoryEntry[] = [];
let storageAvailable = true;

// Check if localStorage is available and working
function checkStorageAvailability(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// Safe parse with fallback to in-memory state
function safeParseStorage(): OrderHistoryEntry[] {
  if (!storageAvailable) {
    return inMemoryFallback;
  }

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
    console.error('[OrderHistory] Failed to parse from localStorage, using in-memory fallback:', error);
    storageAvailable = false;
    return inMemoryFallback;
  }
}

// Save to localStorage with fallback to in-memory
function saveToStorage(entries: OrderHistoryEntry[]): void {
  // Always update in-memory fallback
  inMemoryFallback = entries;

  if (!storageAvailable) {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('[OrderHistory] Failed to save to localStorage, using in-memory fallback:', error);
    storageAvailable = false;
  }
}

// Load all order history entries
export function loadOrderHistory(): OrderHistoryEntry[] {
  try {
    // Re-check storage availability on each load
    if (!storageAvailable) {
      storageAvailable = checkStorageAvailability();
    }
    return safeParseStorage();
  } catch (error) {
    console.error('[OrderHistory] Unexpected error loading history:', error);
    return inMemoryFallback;
  }
}

// Add or update an order in history (de-duplicated, newest first)
export function addOrderToHistory(
  orderId: string,
  lastKnownStatus?: string
): void {
  try {
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
    
    // Dispatch storage event for cross-tab sync (safe to fail)
    try {
      window.dispatchEvent(new Event('storage'));
    } catch {
      // Ignore dispatch errors
    }
  } catch (error) {
    console.error('[OrderHistory] Failed to add order to history:', error);
  }
}

// Update last known status for an order
export function updateOrderStatus(orderId: string, status: string): void {
  try {
    const entries = safeParseStorage();
    const updated = entries.map((e) =>
      e.orderId === orderId
        ? { ...e, lastSeen: Date.now(), lastKnownStatus: status }
        : e
    );
    saveToStorage(updated);
    
    try {
      window.dispatchEvent(new Event('storage'));
    } catch {
      // Ignore dispatch errors
    }
  } catch (error) {
    console.error('[OrderHistory] Failed to update order status:', error);
  }
}

// Remove an order from history
export function removeOrderFromHistory(orderId: string): void {
  try {
    const entries = safeParseStorage();
    const filtered = entries.filter((e) => e.orderId !== orderId);
    saveToStorage(filtered);
    
    try {
      window.dispatchEvent(new Event('storage'));
    } catch {
      // Ignore dispatch errors
    }
  } catch (error) {
    console.error('[OrderHistory] Failed to remove order from history:', error);
  }
}

// Clear all order history
export function clearOrderHistory(): void {
  try {
    inMemoryFallback = [];
    
    if (storageAvailable) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error('[OrderHistory] Failed to clear localStorage:', error);
        storageAvailable = false;
      }
    }
    
    try {
      window.dispatchEvent(new Event('storage'));
    } catch {
      // Ignore dispatch errors
    }
  } catch (error) {
    console.error('[OrderHistory] Failed to clear order history:', error);
  }
}
