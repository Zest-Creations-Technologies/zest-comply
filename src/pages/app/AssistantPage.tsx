import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Send, 
  Loader2, 
  Bot, 
  User, 
  Plus,
  MessageSquare,
  Shield,
  FolderTree,
  FileText,
  Search,
  Clock,
  Archive,
  ArrowLeft,
  Building2,
  Trash2,
  RotateCcw,
  Package,
  CheckCircle,
  Download,
} from 'lucide-react';
import { conversationsApi, type ConversationMessage, type ConversationSession } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG, getWebSocketUrl } from '@/lib/api/config';

// Updated phases to match 7-stage workflow
type Phase = 
  | 'initiation' 
  | 'information_discovery' 
  | 'framework_analysis' 
  | 'structure_generation' 
  | 'document_generation' 
  | 'package_finalization' 
  | 'completed';

const phaseConfig: Record<Phase, { label: string; icon: React.ElementType; description: string }> = {
  initiation: { 
    label: 'Getting Started', 
    icon: MessageSquare,
    description: 'Welcome and initial setup'
  },
  information_discovery: { 
    label: 'Information Discovery', 
    icon: MessageSquare,
    description: 'Gathering company details'
  },
  framework_analysis: { 
    label: 'Framework Analysis', 
    icon: Shield,
    description: 'Analyzing compliance requirements'
  },
  structure_generation: { 
    label: 'Structure Generation', 
    icon: FolderTree,
    description: 'Creating package structure'
  },
  document_generation: { 
    label: 'Document Generation', 
    icon: FileText,
    description: 'Generating compliance documents'
  },
  package_finalization: { 
    label: 'Finalizing', 
    icon: Package,
    description: 'Creating your download package'
  },
  completed: { 
    label: 'Completed', 
    icon: CheckCircle,
    description: 'Your package is ready!'
  },
};

const phaseLabels: Record<string, string> = {
  initiation: 'Initiation',
  information_discovery: 'Discovery',
  framework_analysis: 'Framework Analysis',
  structure_generation: 'Structure Generation',
  document_generation: 'Generating Documents',
  package_finalization: 'Finalizing',
  completed: 'Completed',
};

// Helper to detect retryable error messages
function isRetryableError(message: string): boolean {
  const retryKeywords = [
    "sorry, i couldn't",
    "couldn't generate",
    "couldn't determine",
    "couldn't finalize",
    "please type 'try again'",
    "please type 'retry'",
  ];
  return retryKeywords.some(keyword =>
    message.toLowerCase().includes(keyword.toLowerCase())
  );
}

interface ChatMessage extends ConversationMessage {
  showRetryButton?: boolean;
  isSystemMessage?: boolean;
}

type View = 'list' | 'chat';

const SESSION_STORAGE_KEY = 'agent_session_id';

export default function AssistantPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<View>('list');
  
  // Conversations list state
  const [conversations, setConversations] = useState<ConversationSession[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<ConversationSession | null>(null);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>('initiation');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [phaseStartTime, setPhaseStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 3;
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Timer for long-running phases
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (phaseStartTime && (currentPhase === 'document_generation' || currentPhase === 'structure_generation')) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - phaseStartTime) / 1000));
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phaseStartTime, currentPhase]);

  // Load conversations list
  const loadConversations = useCallback(async () => {
    setListLoading(true);
    try {
      const isArchived = activeTab === 'archived' ? true : undefined;
      const data = await conversationsApi.getConversations(isArchived);
      setConversations(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load conversations',
        variant: 'destructive',
      });
    } finally {
      setListLoading(false);
    }
  }, [activeTab, toast]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Handle URL param for opening a conversation
  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (conversationId && view === 'list') {
      openConversation(conversationId);
    }
  }, [searchParams]);

  const connectWebSocket = useCallback((existingSessionId?: string) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to use the assistant',
        variant: 'destructive',
      });
      return;
    }

    // Build WebSocket URL with token and optional session_id
    let wsUrl = `${getWebSocketUrl()}?token=${token}`;
    if (existingSessionId) {
      wsUrl += `&session_id=${existingSessionId}`;
    }
    
    console.log('Connecting to WebSocket:', wsUrl.replace(token, '[TOKEN]'));
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setIsReconnecting(false);
      setIsLoading(false);
      reconnectAttemptsRef.current = 0;
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message:', data);
      
      // Store session_id from any message that includes it
      if (data.session_id && !sessionId) {
        setSessionId(data.session_id);
        localStorage.setItem(SESSION_STORAGE_KEY, data.session_id);
      }
      
      switch (data.event_type) {
        case 'info': {
          // Handle session initialization/resumption
          if (data.payload?.resumed !== undefined) {
            toast({
              title: data.payload.resumed ? 'Session resumed' : 'Session started',
              description: data.payload.message,
            });
          }
          
          // Update phase if present
          if (data.payload?.phase) {
            const newPhase = data.payload.phase as Phase;
            if (newPhase !== currentPhase) {
              setCurrentPhase(newPhase);
              if (newPhase === 'document_generation' || newPhase === 'structure_generation') {
                setPhaseStartTime(Date.now());
              } else {
                setPhaseStartTime(null);
              }
            }
          }
          
          // Show info messages in chat as system messages (optional display)
          if (data.payload?.message && !data.payload?.resumed) {
            const infoMessage: ChatMessage = {
              id: `info-${Date.now()}`,
              session_id: data.session_id || sessionId || '',
              role: 'assistant',
              content: data.payload.message,
              created_at: data.timestamp || new Date().toISOString(),
              updated_at: data.timestamp || new Date().toISOString(),
              isSystemMessage: true,
              showRetryButton: isRetryableError(data.payload.message),
            };
            setMessages((prev) => [...prev, infoMessage]);
            setIsLoading(false);
          }
          break;
        }
          
        case 'question': {
          const questionMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            session_id: data.session_id || sessionId || '',
            role: 'assistant',
            content: data.payload?.message || data.text || '',
            created_at: data.timestamp || new Date().toISOString(),
            updated_at: data.timestamp || new Date().toISOString(),
          };
          setMessages((prev) => [...prev, questionMessage]);
          setIsLoading(false);
          break;
        }
          
        case 'phase_change': {
          const { from_phase, to_phase, description } = data.payload;
          console.log(`Phase change: ${from_phase} → ${to_phase}`);
          
          const newPhase = to_phase as Phase;
          setCurrentPhase(newPhase);
          
          // Start timer for long phases
          if (newPhase === 'document_generation' || newPhase === 'structure_generation') {
            setPhaseStartTime(Date.now());
          } else {
            setPhaseStartTime(null);
          }
          
          toast({
            title: 'Phase changed',
            description: description || `Moving to ${phaseLabels[newPhase] || newPhase}`,
          });
          break;
        }
          
        case 'error': {
          const errorMessage = data.payload?.error || 'An error occurred';
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
          setIsLoading(false);
          
          // Add error to chat if it's a retryable workflow error
          if (data.payload?.code === 'workflow_error') {
            const errorChatMessage: ChatMessage = {
              id: `error-${Date.now()}`,
              session_id: data.session_id || sessionId || '',
              role: 'assistant',
              content: errorMessage,
              created_at: data.timestamp || new Date().toISOString(),
              updated_at: data.timestamp || new Date().toISOString(),
              showRetryButton: true,
            };
            setMessages((prev) => [...prev, errorChatMessage]);
          }
          break;
        }
      }
    };
    
    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      setIsConnected(false);
      
      if (event.code === 1008) {
        // Authentication error
        toast({
          title: 'Connection closed',
          description: event.reason || 'Authentication failed',
          variant: 'destructive',
        });
      } else if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
        // Attempt reconnection for unexpected closures
        setIsReconnecting(true);
        reconnectAttemptsRef.current++;
        const delay = 2000 * reconnectAttemptsRef.current;
        console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);
        setTimeout(() => {
          if (sessionId) {
            connectWebSocket(sessionId);
          }
        }, delay);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: 'Connection error',
        description: 'Failed to connect to assistant',
        variant: 'destructive',
      });
    };
    
    wsRef.current = ws;
  }, [toast, sessionId, currentPhase]);

  const startNewConversation = useCallback(() => {
    setView('chat');
    setIsLoading(true);
    setMessages([]);
    setSessionId(null);
    setCurrentPhase('initiation');
    setPhaseStartTime(null);
    setSearchParams({});
    localStorage.removeItem(SESSION_STORAGE_KEY);
    
    wsRef.current?.close();
    
    if (API_CONFIG.useMocks) {
      const initialMessage: ChatMessage = {
        id: 'msg-welcome',
        session_id: 'mock-session',
        role: 'assistant',
        content: "Hi! I'm Zest Comply, and I'm here to help you create a professional compliance documentation package. To get started, what's your company name?",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setMessages([initialMessage]);
      setSessionId('mock-session');
      setIsLoading(false);
    } else {
      connectWebSocket();
    }
  }, [connectWebSocket, setSearchParams]);

  const openConversation = useCallback(async (conversationId: string) => {
    setView('chat');
    setIsLoading(true);
    setMessages([]);
    setSessionId(conversationId);
    setPhaseStartTime(null);
    
    wsRef.current?.close();
    
    try {
      // Fetch conversation history
      const session = await conversationsApi.getConversation(conversationId);
      
      // Set phase from session
      if (session.current_phase) {
        setCurrentPhase(session.current_phase as Phase);
      }
      
      // Load messages
      if (session.messages && session.messages.length > 0) {
        setMessages(session.messages);
      }
      
      if (!API_CONFIG.useMocks) {
        // Connect WebSocket with session_id to resume
        connectWebSocket(conversationId);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load conversation',
        variant: 'destructive',
      });
      setView('list');
      setIsLoading(false);
    }
  }, [connectWebSocket, toast]);

  const goBackToList = () => {
    wsRef.current?.close();
    setView('list');
    setMessages([]);
    setSessionId(null);
    setSearchParams({});
    loadConversations();
  };

  const sendMessage = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || isLoading) return;
    
    const userMessage: ChatMessage = {
      id: 'temp-' + Date.now(),
      session_id: sessionId || '',
      role: 'user',
      content: messageText,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    if (!text) setInputValue('');
    setIsLoading(true);
    
    if (API_CONFIG.useMocks) {
      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: 'msg-' + Date.now(),
          session_id: sessionId || '',
          role: 'assistant',
          content: getMockResponse(messageText, currentPhase),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
    } else if (wsRef.current?.readyState === WebSocket.OPEN) {
      // Send message in new format: { text: "..." }
      wsRef.current.send(JSON.stringify({ text: messageText }));
    }
  };

  const handleRetry = () => {
    sendMessage('try again');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Conversation list handlers
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

  const handleDeleteClick = (conv: ConversationSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversationToDelete(conv);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!conversationToDelete) return;
    try {
      await conversationsApi.deleteConversation(conversationToDelete.id);
      await loadConversations();
      toast({ title: 'Conversation deleted' });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete conversation',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setConversationToDelete(null);
    }
  };

  const getSessionTitle = (conv: ConversationSession): string => {
    if (conv.company_name) return conv.company_name;
    if (conv.company_industry) return `${conv.company_industry} Assessment`;
    return 'Compliance Assessment';
  };

  const getSessionStatus = (conv: ConversationSession): 'active' | 'completed' | 'archived' => {
    if (conv.is_archived) return 'archived';
    if (conv.current_phase === 'completed') return 'completed';
    return 'active';
  };

  const statusStyles: Record<string, string> = {
    active: 'bg-primary/10 text-primary',
    completed: 'bg-accent/10 text-accent-foreground',
    archived: 'bg-muted text-muted-foreground',
  };

  const filteredConversations = conversations.filter((conv) => {
    const title = getSessionTitle(conv);
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.company_industry?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const status = getSessionStatus(conv);
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'active' && status === 'active') ||
      (activeTab === 'completed' && status === 'completed') ||
      (activeTab === 'archived' && status === 'archived');
    return matchesSearch && matchesTab;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatElapsedTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  const PhaseIcon = phaseConfig[currentPhase]?.icon || MessageSquare;
  const phaseLabel = phaseConfig[currentPhase]?.label || currentPhase;
  const phases = Object.keys(phaseConfig) as Phase[];

  // Get connection status text
  const getConnectionStatus = (): string => {
    if (API_CONFIG.useMocks) return 'Demo mode';
    if (isReconnecting) return 'Reconnecting...';
    if (isConnected) return 'Connected';
    return 'Connecting...';
  };

  // Render conversations list view
  if (view === 'list') {
    if (listLoading) {
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
            <h1 className="text-2xl font-bold text-foreground">AI Assistant</h1>
            <p className="text-muted-foreground">
              Start a new assessment or continue an existing conversation
            </p>
          </div>
          <Button onClick={startNewConversation}>
            <Plus className="h-4 w-4 mr-2" />
            New Assessment
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
                <Button onClick={startNewConversation}>
                  Start New Assessment
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredConversations.map((conv) => {
              const title = getSessionTitle(conv);
              const status = getSessionStatus(conv);
              return (
                <Card
                  key={conv.id}
                  className="bg-card hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => openConversation(conv.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-foreground truncate">
                            {title}
                          </h3>
                          <Badge variant="secondary" className={statusStyles[status]}>
                            {status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDate(conv.updated_at)}
                          </span>
                          {conv.company_industry && (
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3.5 w-3.5" />
                              {conv.company_industry}
                            </span>
                          )}
                          <span>Phase: {phaseLabels[conv.current_phase] || conv.current_phase}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {status !== 'archived' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleArchive(conv.id, e)}
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteClick(conv, e)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{conversationToDelete ? getSessionTitle(conversationToDelete) : ''}"? 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Render chat view
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Phase indicator */}
      <div className="border-b border-border bg-card px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={goBackToList}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <PhaseIcon className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">
                {phaseLabel}
              </span>
              {phaseStartTime && elapsedTime > 0 && (
                <span className="text-sm text-muted-foreground">
                  ({formatElapsedTime(elapsedTime)})
                </span>
              )}
            </div>
            {/* Phase progress */}
            <div className="hidden md:flex items-center gap-2">
              {phases.map((phase, index) => {
                const currentIndex = phases.indexOf(currentPhase);
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;
                
                return (
                  <div key={phase} className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isCompleted
                          ? 'bg-primary'
                          : isCurrent
                          ? 'bg-primary animate-pulse'
                          : 'bg-muted'
                      }`}
                    />
                    {index < phases.length - 1 && (
                      <div
                        className={`w-8 h-0.5 ${
                          isCompleted ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={startNewConversation}>
            <Plus className="h-4 w-4 mr-1" />
            New Session
          </Button>
        </div>
      </div>

      {/* Long phase warning */}
      {(currentPhase === 'document_generation') && isLoading && (
        <div className="bg-primary/10 border-b border-primary/20 px-6 py-3">
          <div className="flex items-center gap-3 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-foreground">
              Generating compliance documents... This may take 5-15 minutes. Please don't close this window.
            </span>
            {elapsedTime > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {formatElapsedTime(elapsedTime)} elapsed
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Completed phase - Download ready */}
      {currentPhase === 'completed' && sessionId && (
        <div className="bg-accent/10 border-b border-accent/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-accent" />
              <span className="font-medium text-foreground">
                Your compliance package is ready!
              </span>
            </div>
            <Button asChild>
              <a href={`${API_CONFIG.baseUrl}/api/v1/packages/${sessionId}/download`} download>
                <Download className="h-4 w-4 mr-2" />
                Download Package
              </a>
            </Button>
          </div>
        </div>
      )}

      {/* Messages area */}
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              <div
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role !== 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <Card
                  className={`max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : message.isSystemMessage
                      ? 'bg-muted/50 border-dashed'
                      : 'bg-card'
                  }`}
                >
                  <CardContent className="p-3">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </CardContent>
                </Card>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              {/* Retry button for retryable errors */}
              {message.showRetryButton && message.role === 'assistant' && (
                <div className="flex justify-start pl-11 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    disabled={isLoading}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <Card className="bg-card">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {currentPhase === 'document_generation' 
                        ? 'Generating documents...' 
                        : currentPhase === 'structure_generation'
                        ? 'Creating structure...'
                        : currentPhase === 'framework_analysis'
                        ? 'Analyzing requirements...'
                        : 'Thinking...'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t border-border bg-card p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            placeholder={currentPhase === 'completed' ? 'Conversation completed' : 'Type your message...'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading || currentPhase === 'completed'}
            className="flex-1"
          />
          <Button 
            onClick={() => sendMessage()} 
            disabled={!inputValue.trim() || isLoading || currentPhase === 'completed'}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          {getConnectionStatus()}
        </p>
      </div>
    </div>
  );
}

// Mock responses for demo mode
function getMockResponse(input: string, phase: Phase): string {
  const lowerInput = input.toLowerCase();
  
  if (phase === 'information_discovery' || phase === 'initiation') {
    if (lowerInput.includes('tech') || lowerInput.includes('software') || lowerInput.includes('saas')) {
      return "Great! As a technology/SaaS company, you'll likely need to demonstrate strong security controls to your customers. Based on this, I'd recommend considering SOC 2 Type II, which is the gold standard for SaaS companies.\n\nCan you tell me more about:\n1. How many employees does your company have?\n2. Do you handle any personal data from EU residents?\n3. Do you process any healthcare-related information?";
    }
    return "Thank you for sharing that. To better understand your compliance needs, could you tell me:\n\n1. What industry is your organization in?\n2. What types of data do you handle (customer data, financial data, health records)?\n3. Who are your primary customers (enterprises, SMBs, consumers)?";
  }
  
  return "Thank you for that information. Let me process what you've shared and provide some recommendations. Based on our conversation, I'm analyzing the compliance frameworks that would best suit your organization.";
}
