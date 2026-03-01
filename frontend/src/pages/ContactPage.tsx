import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreateContactMessage } from '@/hooks/useQueries';
import { MessageSquare, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [contactDetail, setContactDetail] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const createMessage = useCreateContactMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(false);

    try {
      await createMessage.mutateAsync({ name, contactDetail, message });
      setShowSuccess(true);
      setName('');
      setContactDetail('');
      setMessage('');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const isFormValid = name.trim() && contactDetail.trim() && message.trim();

  return (
    <div className="container py-12 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
          <MessageSquare className="h-8 w-8" />
          Contact Us
        </h1>
        <p className="text-lg text-muted-foreground">
          Have a question or need assistance? Send us a message and we'll get back to you soon.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send us a message</CardTitle>
          <CardDescription>
            Fill out the form below and we'll respond within 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showSuccess && (
            <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Your message has been sent successfully! We'll get back to you soon.
              </AlertDescription>
            </Alert>
          )}

          {createMessage.isError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {createMessage.error instanceof Error 
                  ? createMessage.error.message 
                  : 'Failed to send message. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={createMessage.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Detail *</Label>
              <Input
                id="contact"
                type="text"
                placeholder="Email, Telegram, or WhatsApp"
                value={contactDetail}
                onChange={(e) => setContactDetail(e.target.value)}
                required
                disabled={createMessage.isPending}
              />
              <p className="text-sm text-muted-foreground">
                Provide your email, Telegram username, or WhatsApp number so we can reach you
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Tell us how we can help you..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={createMessage.isPending}
                rows={6}
                className="resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid || createMessage.isPending}
            >
              {createMessage.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
