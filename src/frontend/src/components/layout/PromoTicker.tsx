import React from 'react';
import { Zap, Clock, Gift, TrendingUp } from 'lucide-react';
import { useBtcUsdtRate } from '@/hooks/useBtcUsdtRate';
import { formatBtcRate, getBtcRateTickerLabel } from '@/utils/btcRate';

export function PromoTicker() {
  const { effectiveRate, source, isLoading, isFetched, isLive } = useBtcUsdtRate();
  
  // Engaging promo message with flash sale, urgency, and special reason
  const promoMessage = "🎉 FLASH SALE: 50% OFF All Gift Cards! Limited Time Anniversary Bonus — Stock Running Low! Grab Your Discounted Cards Before They're Gone! 🚀";
  
  // BTC price display
  const btcPriceDisplay = isLoading && !isFetched 
    ? 'Loading BTC price…' 
    : `BTC: ${formatBtcRate(effectiveRate)}`;
  
  const btcStatusLabel = getBtcRateTickerLabel(source, isLoading, isFetched);
  
  // Combine promo with BTC price
  const tickerContent = (
    <>
      <span className="ticker-item">
        <Zap className="inline h-4 w-4 text-binance-yellow mr-2" />
        {promoMessage}
      </span>
      <span className="ticker-item">
        <TrendingUp className="inline h-4 w-4 text-binance-yellow mr-2" />
        <span className="font-semibold">{btcPriceDisplay}</span>
        {btcStatusLabel && (
          <span className={`ml-2 text-xs ${isLive ? 'text-green-400' : 'text-yellow-400'}`}>
            ({btcStatusLabel})
          </span>
        )}
      </span>
      <span className="ticker-item">
        <Clock className="inline h-4 w-4 text-binance-yellow mr-2" />
        {promoMessage}
      </span>
      <span className="ticker-item">
        <Gift className="inline h-4 w-4 text-binance-yellow mr-2" />
        {promoMessage}
      </span>
    </>
  );
  
  return (
    <div className="ticker-container bg-binance-dark border-b-2 border-binance-yellow/30 overflow-hidden relative">
      <div className="ticker-wrapper">
        <div className="ticker-content">
          {tickerContent}
        </div>
      </div>
    </div>
  );
}
