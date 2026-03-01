import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useGetContactMessages, useMarkContactMessageAsRead } from '@/hooks/useQueries';
import { Loader2, MessageSquare, AlertCircle, MailOpen, Mail, CheckCheck } from 'lucide-react';

export default function AdminContactMessagesPage() {
  const { data: messages = [], isLoading, isError } = useGetContactMessages();
  const markAsReadMutation = useMarkContactMessageAsRead();
  const [expandedId, setExpandedId] = useState<bigint | null>(null);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const handleMarkAsRead = async (id: bigint, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markAsReadMutation.mutateAsync(id);
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleRowClick = async (id: bigint, isRead: boolean) => {
    setExpandedId((prev) => (prev === id ? null : id));
    if (!isRead) {
      try {
        await markAsReadMutation.mutateAsync(id);
      } catch (err) {
        // silent
      }
    }
  };

  if (isError) {
    return (
      <AdminLayout>
        <div className="p-6 max-w-2xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load contact messages. You may not have permission to access this page.
            </AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              Contact Messages
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {messages.length} total · {unreadCount} unread
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-blue-500 text-white">
              {unreadCount} unread
            </Badge>
          )}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">All Messages</CardTitle>
            <CardDescription>
              Click a row to expand the full message. Unread messages are highlighted.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : messages.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8 pl-4">Status</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Message Preview</TableHead>
                      <TableHead className="text-right pr-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...messages].reverse().map((msg) => (
                      <>
                        <TableRow
                          key={msg.id.toString()}
                          className={`cursor-pointer transition-colors ${
                            !msg.isRead
                              ? 'bg-blue-50/60 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                              : 'hover:bg-muted/40'
                          } ${expandedId === msg.id ? 'border-b-0' : ''}`}
                          onClick={() => handleRowClick(msg.id, msg.isRead)}
                        >
                          <TableCell className="pl-4">
                            {msg.isRead ? (
                              <MailOpen className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Mail className="h-4 w-4 text-blue-500" />
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            #{msg.id.toString()}
                          </TableCell>
                          <TableCell className={`text-sm ${!msg.isRead ? 'font-semibold' : 'font-medium'}`}>
                            {msg.name}
                            {!msg.isRead && (
                              <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-500" />
                            )}
                          </TableCell>
                          <TableCell className="text-sm max-w-[140px] truncate">
                            {msg.contactDetail}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[200px]">
                            <span className="line-clamp-1">
                              {msg.message}
                            </span>
                          </TableCell>
                          <TableCell className="text-right pr-4">
                            {!msg.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleMarkAsRead(msg.id, e)}
                                disabled={markAsReadMutation.isPending}
                                className="h-7 text-xs gap-1"
                              >
                                {markAsReadMutation.isPending ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <CheckCheck className="h-3.5 w-3.5" />
                                )}
                                Mark Read
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                        {expandedId === msg.id && (
                          <TableRow
                            key={`expanded-${msg.id}`}
                            className={!msg.isRead ? 'bg-blue-50/40 dark:bg-blue-950/10' : 'bg-muted/20'}
                          >
                            <TableCell colSpan={6} className="px-6 pb-4 pt-2">
                              <div className="rounded-lg border border-border/60 bg-background p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    Full Message
                                  </span>
                                  <span className="text-xs text-muted-foreground">from {msg.name} · {msg.contactDetail}</span>
                                </div>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No messages found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
