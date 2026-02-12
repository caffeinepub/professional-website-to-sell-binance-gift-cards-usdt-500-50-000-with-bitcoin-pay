import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DenominationSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const DENOMINATIONS = [500, 1000, 2500, 5000, 10000, 25000, 50000];

export function DenominationSelector({ value, onChange }: DenominationSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="denomination">Select Denomination (USDT)</Label>
      <Select 
        value={value.toString()} 
        onValueChange={(val) => onChange(Number(val))}
      >
        <SelectTrigger id="denomination">
          <SelectValue placeholder="Choose amount" />
        </SelectTrigger>
        <SelectContent>
          {DENOMINATIONS.map((amount) => (
            <SelectItem key={amount} value={amount.toString()}>
              ${amount.toLocaleString()} USDT
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Available range: $500 - $50,000 USDT
      </p>
    </div>
  );
}
