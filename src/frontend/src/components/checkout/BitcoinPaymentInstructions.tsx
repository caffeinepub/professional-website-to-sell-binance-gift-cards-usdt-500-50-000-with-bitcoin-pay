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
            <div>
              <span className="text-sm font-medium">Bitcoin Amount</span>
              <p className="font-mono text-lg font-bold mt-1">{btcAmount} BTC</p>
              {usdtAmount > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  ≈ ${usdtAmount.toLocaleString()} USDT
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

          <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-3">
            <div>
              <span className="text-sm font-medium">Payment Address</span>
              <p className="font-mono text-sm break-all mt-1">{btcAddress}</p>
            </div>
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
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <h4 className="font-semibold mb-2 text-sm">Payment Steps:</h4>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li>1. Copy the Bitcoin address above</li>
            <li>2. Send exactly {btcAmount} BTC to the address</li>
            <li>3. Include Order ID "{orderId}" in transaction memo (if supported)</li>
            <li>4. Wait for payment confirmation (usually 10-30 minutes)</li>
            <li>5. Your gift card will be delivered after verification</li>
          </ol>
        </div>

        <Alert>
          <AlertDescription className="text-xs">
            <strong>Important:</strong> Send only Bitcoin (BTC) to this address. Sending any other cryptocurrency will result in permanent loss of funds.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
