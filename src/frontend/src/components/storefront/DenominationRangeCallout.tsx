import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp } from 'lucide-react';

export function DenominationRangeCallout() {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Available Denominations</h3>
              <p className="text-sm text-muted-foreground">
                Choose from a wide range of USDT values
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              $500 USDT
            </Badge>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <Badge variant="outline" className="text-lg px-4 py-2">
              $50,000 USDT
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
