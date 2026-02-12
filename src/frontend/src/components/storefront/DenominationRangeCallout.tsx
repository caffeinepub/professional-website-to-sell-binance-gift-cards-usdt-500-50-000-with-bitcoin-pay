import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp } from 'lucide-react';
import { SUPPORTED_DENOMINATIONS } from '@/utils/denominations';

export function DenominationRangeCallout() {
  const minDenom = Math.min(...SUPPORTED_DENOMINATIONS);
  const maxDenom = Math.max(...SUPPORTED_DENOMINATIONS);

  return (
    <Card className="border-2 border-binance-yellow/30 bg-binance-dark shadow-binance-glow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-binance-yellow/20 border border-binance-yellow/40">
              <DollarSign className="h-6 w-6 text-binance-yellow" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1 text-white">Available Denominations</h3>
              <p className="text-sm text-binance-yellow/70">
                Choose from a wide range of USDT values
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg px-4 py-2 border-binance-yellow text-binance-yellow bg-binance-dark-lighter">
              ${minDenom.toLocaleString()} USDT
            </Badge>
            <TrendingUp className="h-5 w-5 text-binance-yellow" />
            <Badge variant="outline" className="text-lg px-4 py-2 border-binance-yellow text-binance-yellow bg-binance-dark-lighter">
              ${maxDenom.toLocaleString()} USDT
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
