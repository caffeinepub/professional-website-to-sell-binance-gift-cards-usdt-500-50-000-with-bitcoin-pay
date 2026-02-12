import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Shield, Zap, Users } from 'lucide-react';
import { SiBitcoin } from 'react-icons/si';

export default function AboutPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
          <Info className="h-8 w-8" />
          About Us
        </h1>
        <p className="text-lg text-muted-foreground">
          Your trusted marketplace for Binance Gift Cards
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Who We Are</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We are a professional marketplace specializing in Binance Gift Cards, offering a secure and 
              convenient way to purchase USDT vouchers using Bitcoin. Our platform is built on the Internet Computer 
              blockchain, ensuring transparency, security, and reliability for every transaction.
            </p>
            <p className="text-muted-foreground">
              With years of experience in the cryptocurrency space, we understand the importance of trust and 
              security when dealing with digital assets. That's why we've created a streamlined platform that 
              prioritizes user safety and satisfaction.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What We Offer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-3">
                <Users className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Wide Range of Denominations</h3>
                  <p className="text-sm text-muted-foreground">
                    From $500 to $50,000 USDT, we offer gift cards for every need, whether you're a casual 
                    user or a high-volume trader.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <SiBitcoin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Bitcoin Payments</h3>
                  <p className="text-sm text-muted-foreground">
                    We exclusively accept Bitcoin payments, providing a secure and decentralized payment method 
                    that protects your privacy.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Zap className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Fast Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Once your Bitcoin payment is confirmed, we process your order immediately. Most orders are 
                    delivered within 1-24 hours.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Secure Transactions</h3>
                  <p className="text-sm text-muted-foreground">
                    Built on the Internet Computer blockchain, every transaction is transparent, immutable, 
                    and secure.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Browse & Select</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose your desired gift card denomination and quantity from our catalog. We offer a 50% discount 
                    on all cards, so you get double the value.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Pay with Bitcoin</h3>
                  <p className="text-sm text-muted-foreground">
                    After checkout, you'll receive a unique Bitcoin address and the exact amount to send. 
                    The BTC amount is calculated using live market rates from CoinGecko.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Receive Your Cards</h3>
                  <p className="text-sm text-muted-foreground">
                    Once your payment is confirmed on the blockchain, we process your order and deliver your 
                    gift card codes. You can track your order status using your order ID.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment & Order Processing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We use live Bitcoin to USDT exchange rates from CoinGecko to calculate the exact BTC amount for your order. 
              This ensures fair pricing based on current market conditions. Our 50% discount is already applied to the 
              final price, giving you exceptional value.
            </p>
            <p className="text-muted-foreground">
              After you send your Bitcoin payment, we monitor the blockchain for confirmations. Once confirmed 
              (typically 1-3 confirmations), your order moves to the processing stage. Our team verifies the payment 
              and prepares your gift card codes for delivery.
            </p>
            <p className="text-muted-foreground">
              All orders are tracked on our secure platform. You can check your order status at any time using your 
              unique order ID. We recommend saving this ID for your records.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Have questions or need assistance? We're here to help! Use our contact form to reach out to our support team. 
              We typically respond within 24 hours.
            </p>
            <p className="text-muted-foreground">
              Whether you have questions about orders, payments, or our service in general, don't hesitate to get in touch. 
              We're committed to providing excellent customer service and ensuring your experience is smooth and secure.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
