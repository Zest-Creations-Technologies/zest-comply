import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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
} from 'lucide-react';
import { conversationsApi, type ConversationMessage } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG, getWebSocketUrl } from '@/lib/api/config';

type Phase = 'initiation' | 'information_discovery' | 'framework_determination' | 'structure_synthesis' | 'content_generation';

const phaseConfig: Record<Phase, { label: string; icon: React.ElementType }> = {
  initiation: { label: 'Initiation', icon: MessageSquare },
  information_discovery: { label: 'Information Discovery', icon: MessageSquare },
  framework_determination: { label: 'Framework Determination', icon: Shield },
  structure_synthesis: { label: 'Structure Synthesis', icon: FolderTree },
  content_generation: { label: 'Content Generation', icon: FileText },
};

interface GenerationProgress {
  file: string;
  progress: number;
  status: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>('initiation');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setIsLoading(false);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message:', data);
      
      switch (data.event_type) {
        case 'info':
          // Session initialization
          if (data.session_id) {
            setSessionId(data.session_id);
          }
          if (data.payload?.phase) {
            setCurrentPhase(data.payload.phase as Phase);
          }
          break;
          
        case 'question':
          // Agent asking a question
          const questionMessage: ConversationMessage = {
            id: `msg-${Date.now()}`,
            session_id: data.session_id || sessionId || '',
            role: 'assistant',
            content: data.text,
            created_at: data.timestamp || new Date().toISOString(),
            updated_at: data.timestamp || new Date().toISOString(),
          };
          setMessages((prev) => [...prev, questionMessage]);
          setIsLoading(false);
          break;
          
        case 'phase_change':
          // Phase transition
          setCurrentPhase(data.payload.phase as Phase);
          toast({
            title: 'Phase changed',
            description: data.payload.description,
          });
          break;
          
        case 'file_generated':
          // Document created
          toast({
            title: 'File generated',
            description: `Created: ${data.payload.path}`,
          });
          break;
          
        case 'generation_progress':
          // Progress update
          setGenerationProgress({
            file: data.payload.file,
            progress: data.payload.progress,
            status: data.payload.status,
          });
          break;
          
        case 'error':
          // Error occurred
          toast({
            title: 'Error',
            description: data.payload.error,
            variant: 'destructive',
          });
          setIsLoading(false);
          break;
      }
    };
    
    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      setIsConnected(false);
      if (event.code === 1008) {
        toast({
          title: 'Connection closed',
          description: event.reason || 'Authentication failed',
          variant: 'destructive',
        });
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
  }, [toast, sessionId]);

  const startNewConversation = useCallback(() => {
    setIsLoading(true);
    setMessages([]);
    setSessionId(null);
    setCurrentPhase('initiation');
    setGenerationProgress(null);
    
    // Close existing connection
    wsRef.current?.close();
    
    if (API_CONFIG.useMocks) {
      // Mock mode
      const initialMessage: ConversationMessage = {
        id: 'msg-welcome',
        session_id: 'mock-session',
        role: 'assistant',
        content: "Welcome to Zest Comply! I'm here to help you create comprehensive compliance documentation. Let's start by understanding your organization. What industry are you in?",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setMessages([initialMessage]);
      setSessionId('mock-session');
      setIsLoading(false);
    } else {
      // Connect to real WebSocket (no session_id for new conversation)
      connectWebSocket();
    }
  }, [connectWebSocket]);

  useEffect(() => {
    // Auto-start a conversation on mount
    startNewConversation();
    
    return () => {
      wsRef.current?.close();
    };
  }, [startNewConversation]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: ConversationMessage = {
      id: 'temp-' + Date.now(),
      session_id: sessionId || '',
      role: 'user',
      content: inputValue,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue('');
    setIsLoading(true);
    
    if (API_CONFIG.useMocks) {
      // Simulate AI response in mock mode
      setTimeout(() => {
        const assistantMessage: ConversationMessage = {
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
      // Send answer event per API spec
      wsRef.current.send(JSON.stringify({
        event_type: 'answer',
        text: messageText,
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const PhaseIcon = phaseConfig[currentPhase]?.icon || MessageSquare;
  const phaseLabel = phaseConfig[currentPhase]?.label || currentPhase;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Phase indicator */}
      <div className="border-b border-border bg-card px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <PhaseIcon className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">
                {phaseLabel}
              </span>
            </div>
            {/* Phase progress */}
            <div className="hidden md:flex items-center gap-2">
              {(Object.keys(phaseConfig) as Phase[]).map((phase, index) => {
                const phases = Object.keys(phaseConfig) as Phase[];
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

      {/* Messages area */}
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
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
                    <span className="text-sm text-muted-foreground">Thinking...</span>
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
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={!inputValue.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          {API_CONFIG.useMocks ? 'Running in demo mode' : isConnected ? 'Connected' : 'Connecting...'}
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