import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { SiBitcoin } from 'react-icons/si';

interface BitcoinPaymentInstructionsProps {
  orderId: string;
  btcAddress: string;
  btcAmount: string;
  usdtAmount: number;
}

export function BitcoinPaymentInstructions({ 
  orderId, 
  btcAddress, 
  btcAmount,
  usdtAmount 
}: BitcoinPaymentInstructionsProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  const copyToClipboard = async (text: string, setter: (val: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <SiBitcoin className="h-6 w-6 text-primary" />
          <CardTitle>Bitcoin Payment Instructions</CardTitle>
        </div>
        <CardDescription>
          Complete your payment by sending Bitcoin to the address below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please include your Order ID in the transaction memo/note for faster processing.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Order ID</span>
              <Badge variant="outline">{orderId}</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => copyToClipboard(orderId, setCopiedOrderId)}
            >
              {copiedOrderId ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Order ID
                </>
              )}
            </Button>
          </div>

          <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Bitcoin Address</span>
            </div>
            <p className="font-mono text-sm break-all bg-background p-3 rounded border">
              {btcAddress}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => copyToClipboard(btcAddress, setCopiedAddress)}
            >
              {copiedAddress ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Address
                </>
              )}
            </Button>
          </div>

          <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Amount to Send</span>
            </div>
            <div className="space-y-2">
              <p className="font-mono text-2xl font-bold bg-background p-3 rounded border">
                {btcAmount} BTC
              </p>
              {usdtAmount > 0 && (
                <p className="text-sm text-muted-foreground">
                  ≈ ${usdtAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT (estimate at time of order)
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => copyToClipboard(btcAmount, setCopiedAmount)}
            >
              {copiedAmount ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Amount
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              1
            </span>
            Send Payment
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            Send exactly <span className="font-mono font-semibold text-foreground">{btcAmount} BTC</span> to the address above.
          </p>

          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              2
            </span>
            Include Order ID
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            Add your Order ID (<span className="font-mono font-semibold text-foreground">{orderId}</span>) in the transaction memo or note field.
          </p>

          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              3
            </span>
            Wait for Confirmation
          </h4>
          <p className="text-sm text-muted-foreground">
            Your order will be processed once the payment is confirmed on the blockchain. This typically takes 10-30 minutes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
