import { useState } from 'react';
import { Mail, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSyncEmails } from '@/hooks/useDeals';

export function EmailSync() {
  const [mailboxId, setMailboxId] = useState('');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const syncEmails = useSyncEmails();

  const handleSync = () => {
    if (!mailboxId) {
      setIsConfigOpen(true);
      return;
    }
    syncEmails.mutate(mailboxId);
  };

  const handleSaveMailbox = () => {
    localStorage.setItem('prebind-mailbox-id', mailboxId);
    setIsConfigOpen(false);
    syncEmails.mutate(mailboxId);
  };

  // Load saved mailbox on mount
  useState(() => {
    const saved = localStorage.getItem('prebind-mailbox-id');
    if (saved) setMailboxId(saved);
  });

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSync}
        disabled={syncEmails.isPending}
        className="gap-2"
      >
        {syncEmails.isPending ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <Mail className="h-4 w-4" />
        )}
        {syncEmails.isPending ? 'Syncing...' : 'Sync Emails'}
      </Button>

      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Email Sync</DialogTitle>
            <DialogDescription>
              Enter your Microsoft 365 mailbox ID to sync incoming insurance enquiries.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mailbox ID (Email Address)</label>
              <Input
                placeholder="enquiries@yourcompany.com"
                value={mailboxId}
                onChange={(e) => setMailboxId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This should be the email address where insurance enquiries are received.
                Make sure your Azure AD app has Mail.Read permissions for this mailbox.
              </p>
            </div>
            <Button onClick={handleSaveMailbox} className="w-full">
              Save & Sync Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
