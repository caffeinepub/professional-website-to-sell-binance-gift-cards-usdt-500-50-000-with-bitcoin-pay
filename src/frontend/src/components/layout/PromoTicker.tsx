import React from 'react';
import { Zap, Clock, Gift } from 'lucide-react';

export function PromoTicker() {
  // Engaging promo message with flash sale, urgency, and special reason
  const promoMessage = "🎉 FLASH SALE: 50% OFF All Gift Cards! Limited Time Anniversary Bonus — Stock Running Low! Grab Your Discounted Cards Before They're Gone! 🚀";
  
  return (
    <div className="ticker-container bg-binance-dark border-b-2 border-binance-yellow/30 overflow-hidden relative">
      <div className="ticker-wrapper">
        <div className="ticker-content">
          <span className="ticker-item">
            <Zap className="inline h-4 w-4 text-binance-yellow mr-2" />
            {promoMessage}
          </span>
          <span className="ticker-item">
            <Clock className="inline h-4 w-4 text-binance-yellow mr-2" />
            {promoMessage}
          </span>
          <span className="ticker-item">
            <Gift className="inline h-4 w-4 text-binance-yellow mr-2" />
            {promoMessage}
          </span>
        </div>
      </div>
    </div>
  );
}
