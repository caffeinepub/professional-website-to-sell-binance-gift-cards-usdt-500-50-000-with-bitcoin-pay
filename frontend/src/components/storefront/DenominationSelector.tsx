import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SUPPORTED_DENOMINATIONS } from '@/utils/denominations';

interface DenominationSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function DenominationSelector({ value, onChange }: DenominationSelectorProps) {
  const minDenom = Math.min(...SUPPORTED_DENOMINATIONS);
  const maxDenom = Math.max(...SUPPORTED_DENOMINATIONS);

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
          {SUPPORTED_DENOMINATIONS.map((amount) => (
            <SelectItem key={amount} value={amount.toString()}>
              ${amount.toLocaleString()} USDT
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Available range: ${minDenom.toLocaleString()} - ${maxDenom.toLocaleString()} USDT
      </p>
    </div>
  );
}
