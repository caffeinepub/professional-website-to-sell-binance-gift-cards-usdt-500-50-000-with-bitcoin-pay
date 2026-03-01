// Centralized pricing rules for the application

// Fixed 50% discount rate
export const DISCOUNT_RATE = 0.5;

/**
 * Calculate the discounted USDT amount (50% off)
 */
export function calculateDiscountedAmount(usdtAmount: number): number {
  return usdtAmount * DISCOUNT_RATE;
}

/**
 * Convert USDT amount to BTC using provided conversion rate
 * Returns formatted string with proper precision and handles edge cases
 */
export function convertUsdtToBtcWithRate(usdtAmount: number, btcRate: number): string {
  // Handle invalid inputs
  if (!isFinite(usdtAmount) || !isFinite(btcRate) || btcRate <= 0) {
    return '0.00000000';
  }
  
  const btcAmount = usdtAmount / btcRate;
  
  // Handle NaN or Infinity
  if (!isFinite(btcAmount)) {
    return '0.00000000';
  }
  
  // Format to 8 decimal places (standard BTC precision)
  return btcAmount.toFixed(8);
}

/**
 * Convert BTC amount to USDT using provided conversion rate
 */
export function convertBtcToUsdtWithRate(btcAmount: string, btcRate: number): number {
  const btcValue = parseFloat(btcAmount);
  
  // Handle invalid inputs
  if (!isFinite(btcValue) || !isFinite(btcRate)) {
    return 0;
  }
  
  const usdtValue = btcValue * btcRate;
  
  // Handle NaN or Infinity
  if (!isFinite(usdtValue)) {
    return 0;
  }
  
  return usdtValue;
}

/**
 * Calculate the final BTC amount for a given USDT amount with discount applied
 */
export function calculateBtcAmountWithDiscount(usdtAmount: number, btcRate: number): string {
  const discountedUsdt = calculateDiscountedAmount(usdtAmount);
  return convertUsdtToBtcWithRate(discountedUsdt, btcRate);
}

/**
 * Format USDT amount for display
 */
export function formatUsdt(amount: number): string {
  return `$${amount.toLocaleString()} USDT`;
}

/**
 * Format BTC amount for display
 */
export function formatBtc(amount: string): string {
  return `${amount} BTC`;
}
