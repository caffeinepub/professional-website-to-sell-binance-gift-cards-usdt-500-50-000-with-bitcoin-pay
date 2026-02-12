interface CartSession {
  denomination: number;
  quantity: number;
  total: number;
}

const CART_SESSION_KEY = 'binance_giftcard_cart';

export function saveCartSession(cart: CartSession): void {
  try {
    sessionStorage.setItem(CART_SESSION_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart session:', error);
  }
}

export function getCartSession(): CartSession | null {
  try {
    const stored = sessionStorage.getItem(CART_SESSION_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as CartSession;
  } catch (error) {
    console.error('Failed to load cart session:', error);
    return null;
  }
}

export function clearCartSession(): void {
  try {
    sessionStorage.removeItem(CART_SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear cart session:', error);
  }
}
