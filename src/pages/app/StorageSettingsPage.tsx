import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Cloud, Check, X, ExternalLink } from 'lucide-react';
import { storageApi, type LinkedProviderInfo, type StorageProvider } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const ALL_PROVIDERS: StorageProvider[] = ['google_drive', 'dropbox', 'onedrive'];

const providerConfig: Record<StorageProvider, { name: string; iconClass: string; iconColor: string; bgColor: string }> = {
  google_drive: { name: 'Google Drive', iconClass: 'fa-brands fa-google-drive', iconColor: '#4285F4', bgColor: 'bg-blue-500/10' },
  dropbox: { name: 'Dropbox', iconClass: 'fa-brands fa-dropbox', iconColor: '#0061FF', bgColor: 'bg-sky-500/10' },
  onedrive: { name: 'OneDrive', iconClass: 'fa-solid fa-cloud', iconColor: '#0078D4', bgColor: 'bg-cyan-500/10' },
};

export default function StorageSettingsPage() {
  const [linkedProviders, setLinkedProviders] = useState<LinkedProviderInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await storageApi.getLinkedProviders();
      setLinkedProviders(data.linked_providers);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load storage providers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const isLinked = (provider: StorageProvider) => {
    return linkedProviders.some(p => p.provider === provider);
  };

  const getLinkedInfo = (provider: StorageProvider) => {
    return linkedProviders.find(p => p.provider === provider);
  };

  const handleLink = async (provider: StorageProvider) => {
    setActionLoading(provider);
    try {
      const redirectUri = `${window.location.origin}/app/settings/storage`;
      const { authorization_url } = await storageApi.linkProvider(provider, redirectUri);
      if (authorization_url.startsWith('#')) {
        // Mock mode
        toast({ title: 'Demo mode', description: 'Would redirect to OAuth flow' });
        await loadProviders();
      } else {
        window.location.href = authorization_url;
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to connect storage provider',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnlink = async (provider: StorageProvider) => {
    setActionLoading(provider);
    try {
      await storageApi.unlinkProvider(provider);
      await loadProviders();
      toast({ title: 'Storage disconnected' });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to disconnect storage provider',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cloud Storage</h1>
        <p className="text-muted-foreground">
          Connect cloud storage to automatically save your compliance documents
        </p>
      </div>

      <div className="space-y-4">
        {ALL_PROVIDERS.map((provider) => {
          const config = providerConfig[provider];
          const linked = isLinked(provider);
          const info = getLinkedInfo(provider);
          
          return (
            <Card key={provider} className="bg-card">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                    <i className={config.iconClass} style={{ color: config.iconColor, fontSize: '24px' }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">{config.name}</h3>
                      {linked ? (
                        <Badge variant="default" className="bg-primary/10 text-primary">
                          <Check className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          Not connected
                        </Badge>
                      )}
                    </div>
                    {linked && info && (
                      <p className="text-sm text-muted-foreground">
                        Connected {formatDate(info.linked_at)}
                      </p>
                    )}
                    {!linked && (
                      <p className="text-sm text-muted-foreground">
                        Connect to automatically export documents
                      </p>
                    )}
                  </div>
                </div>
                
                {linked ? (
                  <Button
                    variant="outline"
                    onClick={() => handleUnlink(provider)}
                    disabled={actionLoading === provider}
                  >
                    {actionLoading === provider ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Disconnect
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleLink(provider)}
                    disabled={actionLoading === provider}
                  >
                    {actionLoading === provider ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            About Cloud Storage Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            When you connect a cloud storage provider, your generated compliance documents 
            will be automatically saved to a "Zest Comply" folder in your connected storage.
          </p>
          <p>
            You can connect multiple providers and choose which one to use when exporting 
            documents from your assessments.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
