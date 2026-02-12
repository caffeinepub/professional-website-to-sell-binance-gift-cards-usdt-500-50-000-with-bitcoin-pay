import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

export default function FaqPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
          <HelpCircle className="h-8 w-8" />
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-muted-foreground">
          Find answers to common questions about our Binance Gift Cards
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Questions</CardTitle>
          <CardDescription>Everything you need to know about our service</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What are Binance Gift Cards?</AccordionTrigger>
              <AccordionContent>
                Binance Gift Cards are prepaid USDT vouchers that can be redeemed on the Binance platform. 
                They provide a convenient way to add funds to your Binance account or gift cryptocurrency to others.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>What denominations are available?</AccordionTrigger>
              <AccordionContent>
                We offer gift cards ranging from $500 to $50,000 USDT. Available denominations include: 
                $500, $1,000, $2,000, $3,000, $5,000, $10,000, $15,000, $20,000, $30,000, $35,000, $40,000, $45,000, and $50,000.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How do I pay for my order?</AccordionTrigger>
              <AccordionContent>
                We accept Bitcoin (BTC) payments only. After placing your order, you'll receive a unique Bitcoin 
                address and the exact amount to send. Once we confirm your payment on the blockchain, we'll process your order.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>How long does delivery take?</AccordionTrigger>
              <AccordionContent>
                Once your Bitcoin payment is confirmed on the blockchain (typically 1-3 confirmations), 
                we process your order immediately. Gift card codes are usually delivered within 1-24 hours 
                depending on verification requirements.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Is there a discount available?</AccordionTrigger>
              <AccordionContent>
                Yes! We offer a 50% discount on all gift cards. The BTC amount you pay reflects this discount, 
                so you're getting double the value for your Bitcoin.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>How do I track my order?</AccordionTrigger>
              <AccordionContent>
                After placing your order, you'll receive an order ID. You can use this ID to check your order 
                status at any time. Simply visit the order status page and enter your order ID.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>What if I send the wrong amount of Bitcoin?</AccordionTrigger>
              <AccordionContent>
                Please ensure you send the exact amount specified in your order. If you send an incorrect amount, 
                contact us immediately through our contact form with your order ID and transaction details. 
                We'll work to resolve the issue, though processing may be delayed.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger>Are the gift cards legitimate?</AccordionTrigger>
              <AccordionContent>
                Yes, all our Binance Gift Cards are authentic and can be redeemed directly on the Binance platform. 
                We source our cards through authorized channels and guarantee their validity.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger>Can I get a refund?</AccordionTrigger>
              <AccordionContent>
                Due to the nature of digital gift cards and cryptocurrency payments, all sales are final. 
                Please ensure you've entered the correct information before completing your order. 
                If you experience any issues with your gift card, contact us immediately.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger>How do I contact support?</AccordionTrigger>
              <AccordionContent>
                You can reach us through our contact form. Provide your name, contact details (email, Telegram, or WhatsApp), 
                and a detailed message about your inquiry. We typically respond within 24 hours.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
