import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  MessageSquare, 
  Clock, 
  Archive,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { conversationsApi, type Conversation, type ConversationPhase } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const phaseLabels: Record<ConversationPhase, string> = {
  discovery: 'Discovery',
  framework_selection: 'Framework Selection',
  structure_approval: 'Structure Approval',
  document_generation: 'Generating',
  completed: 'Completed',
};

const statusStyles: Record<string, string> = {
  active: 'bg-primary/10 text-primary',
  completed: 'bg-accent/10 text-accent-foreground',
  archived: 'bg-muted text-muted-foreground',
};

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await conversationsApi.getConversations();
      setConversations(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load conversations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await conversationsApi.archiveConversation(id);
      await loadConversations();
      toast({ title: 'Conversation archived' });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to archive conversation',
        variant: 'destructive',
      });
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'active' && conv.status === 'active') ||
      (activeTab === 'completed' && conv.status === 'completed') ||
      (activeTab === 'archived' && conv.status === 'archived');
    return matchesSearch && matchesTab;
  });

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
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Conversations</h1>
          <p className="text-muted-foreground">
            View and manage your compliance assessment sessions
          </p>
        </div>
        <Button onClick={() => navigate('/app/assistant')}>
          <MessageSquare className="h-4 w-4 mr-2" />
          New Session
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Conversations list */}
      {filteredConversations.length === 0 ? (
        <Card className="bg-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No conversations found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search' : 'Start your first compliance assessment'}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate('/app/assistant')}>
                Start New Assessment
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredConversations.map((conv) => (
            <Card
              key={conv.id}
              className="bg-card hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/app/assistant?conversation=${conv.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-foreground truncate">
                        {conv.title}
                      </h3>
                      <Badge variant="secondary" className={statusStyles[conv.status]}>
                        {conv.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDate(conv.updated_at)}
                      </span>
                      <span>Phase: {phaseLabels[conv.phase]}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {conv.status !== 'archived' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleArchive(conv.id, e)}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
