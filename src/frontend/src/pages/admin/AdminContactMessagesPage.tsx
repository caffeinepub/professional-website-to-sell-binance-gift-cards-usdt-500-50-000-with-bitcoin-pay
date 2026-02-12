import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetContactMessages } from '@/hooks/useQueries';
import { Loader2, MessageSquare, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AdminContactMessagesPage() {
  const navigate = useNavigate();
  const { data: messages, isLoading, isError } = useGetContactMessages();

  if (isError) {
    return (
      <div className="container py-12 max-w-2xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load contact messages. You may not have permission to access this page.
          </AlertDescription>
        </Alert>
        <Button 
          className="mt-4"
          onClick={() => navigate({ to: '/' })}
        >
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/admin/orders' })}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        
        <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
          <MessageSquare className="h-8 w-8" />
          Admin: Contact Messages
        </h1>
        <p className="text-lg text-muted-foreground">
          View all customer inquiries and support requests
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Messages</CardTitle>
          <CardDescription>
            {messages ? `${messages.length} total messages` : 'Loading messages...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : messages && messages.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((msg) => (
                    <TableRow key={msg.id}>
                      <TableCell className="font-mono text-sm">#{msg.id.toString()}</TableCell>
                      <TableCell className="font-medium">{msg.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{msg.contactDetail}</TableCell>
                      <TableCell className="max-w-md">
                        <div className="line-clamp-2 text-sm text-muted-foreground">
                          {msg.message}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No messages found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
