import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, TrendingUp, Loader2 } from 'lucide-react';
import { SiBinance } from 'react-icons/si';
import { SUPPORTED_DENOMINATIONS } from '@/utils/denominations';
import { calculateDiscountedAmount, calculateBtcAmountWithDiscount } from '@/utils/pricing';
import { useBtcUsdtRate } from '@/hooks/useBtcUsdtRate';

interface DenominationCardGridProps {
  selectedDenomination: number;
  onSelect: (denomination: number) => void;
}

export function DenominationCardGrid({ selectedDenomination, onSelect }: DenominationCardGridProps) {
  const { effectiveRate, source, isLoading, isFetched } = useBtcUsdtRate();

  return (
    <div className="space-y-4">
      {/* Rate indicator */}
      <div className="flex items-center justify-between text-sm bg-binance-dark border border-binance-dark-border rounded-lg px-4 py-2.5">
        <div className="flex items-center gap-2 text-binance-yellow">
          <TrendingUp className="h-4 w-4" />
          <span>
            BTC Rate: {isLoading && !isFetched ? (
              <Loader2 className="inline h-3 w-3 animate-spin ml-1" />
            ) : (
              <>
                <span className="font-mono font-bold text-binance-yellow">
                  ${effectiveRate.toLocaleString()}
                </span>
                <span className="ml-1 text-xs text-binance-yellow/70">
                  ({source === 'Loading' ? 'Loading...' : source})
                </span>
              </>
            )}
          </span>
        </div>
        {source === 'Cached' && (
          <Badge variant="outline" className="text-xs border-binance-yellow/50 text-binance-yellow py-0 h-5">
            Using cached rate
          </Badge>
        )}
        {source === 'Fallback' && (
          <Badge variant="outline" className="text-xs border-yellow-500/50 text-yellow-500 py-0 h-5">
            Rate unavailable - using fallback
          </Badge>
        )}
      </div>

      {/* Cards grid - more compact */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {SUPPORTED_DENOMINATIONS.map((denomination) => {
          const isSelected = selectedDenomination === denomination;
          const discountedUsdt = calculateDiscountedAmount(denomination);
          // Use the exact same rate displayed in the indicator
          const btcAmount = calculateBtcAmountWithDiscount(denomination, effectiveRate);

          return (
            <Card
              key={denomination}
              className={`cursor-pointer transition-all border-2 bg-binance-dark ${
                isSelected
                  ? 'border-binance-yellow shadow-binance-glow-strong scale-[1.02]'
                  : 'border-binance-dark-border hover:border-binance-yellow/50 hover:shadow-binance-glow'
              }`}
              onClick={() => onSelect(denomination)}
            >
              <CardHeader className="pb-2 space-y-1.5 px-4 pt-4">
                <div className="flex items-center gap-1.5 text-binance-yellow/80">
                  <SiBinance className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-medium uppercase tracking-wide">
                    Binance Gift Card
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl font-bold text-white">
                    {formatUsdt(denomination)}
                  </CardTitle>
                  {isSelected && (
                    <Badge className="bg-binance-yellow text-binance-dark hover:bg-binance-yellow-dark text-xs py-0 h-5">
                      <Check className="h-3 w-3 mr-0.5" />
                      Selected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2 px-4 pb-4">
                <div className="rounded-lg bg-binance-dark-lighter border-2 border-binance-yellow/30 p-2.5 space-y-1">
                  <p className="text-[10px] font-medium text-binance-yellow/70 uppercase tracking-wide">
                    Pay Only (50% Off):
                  </p>
                  <p className="text-lg font-bold text-binance-yellow">
                    ${discountedUsdt.toLocaleString()} USDT
                  </p>
                  <div className="flex items-center gap-1 text-xs font-mono text-white/80 pt-1 border-t border-binance-yellow/20">
                    <span className="text-[10px]">≈</span>
                    {isLoading && !isFetched ? (
                      <span className="text-[10px] text-white/50">Loading BTC...</span>
                    ) : (
                      <span className="text-xs">{btcAmount} BTC</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function formatUsdt(amount: number): string {
  return `$${amount.toLocaleString()}`;
}
