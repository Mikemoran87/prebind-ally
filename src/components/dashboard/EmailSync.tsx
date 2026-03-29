import { useState } from 'react';
import { Mail, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSyncEmails } from '@/hooks/useDeals';
import { Badge } from '@/components/ui/badge';

export function EmailSync() {
  const [mailboxId, setMailboxId] = useState('');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const syncEmails = useSyncEmails();

  const isConfigured = !!localStorage.getItem('prebind-mailbox-id');

  const handleSync = () => {
    const saved = localStorage.getItem('prebind-mailbox-id');
    if (!saved) {
      setIsConfigOpen(true);
      return;
    }
    syncEmails.mutate(saved);
  };

  const handleSaveMailbox = () => {
    localStorage.setItem('prebind-mailbox-id', mailboxId);
    setIsConfigOpen(false);
    syncEmails.mutate(mailboxId);
  };

  return (
    <div className="flex items-center gap-2">
      {!isConfigured && (
        <Badge variant="outline" className="text-xs text-muted-foreground border-border/50">
          Email sync: not configured
        </Badge>
      )}
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
          <Button variant="ghost" size="icon" title="Configure email sync">
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Email Sync</DialogTitle>
            <DialogDescription>
              Connect your Microsoft 365 mailbox to automatically intake broker submissions. Requires Azure AD app with Mail.Read permission.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mailbox Email Address</label>
              <Input
                placeholder="enquiries@yourcompany.com"
                value={mailboxId}
                onChange={(e) => setMailboxId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The inbox where broker submissions arrive. Your Azure AD app must have Mail.Read permission for this address.
              </p>
            </div>
            <Button onClick={handleSaveMailbox} className="w-full" disabled={!mailboxId}>
              Save & Sync Now
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Need help setting this up?{' '}
              <a href="mailto:hello@prebind.ai" className="text-primary hover:underline">Contact us</a>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
