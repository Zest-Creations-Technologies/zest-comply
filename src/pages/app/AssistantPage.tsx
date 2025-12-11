import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  CheckCircle2
} from 'lucide-react';
import { conversationsApi, type Message, type ConversationPhase } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG, getWebSocketUrl } from '@/lib/api/config';

const phaseConfig: Record<ConversationPhase, { label: string; icon: React.ElementType }> = {
  discovery: { label: 'Discovery', icon: MessageSquare },
  framework_selection: { label: 'Framework Selection', icon: Shield },
  structure_approval: { label: 'Structure Approval', icon: FolderTree },
  document_generation: { label: 'Generating Documents', icon: FileText },
  completed: { label: 'Completed', icon: CheckCircle2 },
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<ConversationPhase>('discovery');
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startNewConversation = useCallback(async () => {
    setIsLoading(true);
    try {
      const conversation = await conversationsApi.createConversation();
      setConversationId(conversation.id);
      setCurrentPhase(conversation.phase);
      
      // Load initial messages
      const initialMessages = await conversationsApi.getMessages(conversation.id);
      setMessages(initialMessages);
      
      // Connect to WebSocket if not in mock mode
      if (!API_CONFIG.useMocks) {
        connectWebSocket(conversation.id);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start conversation',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const connectWebSocket = (convId: string) => {
    const token = localStorage.getItem('access_token');
    const wsUrl = `${getWebSocketUrl()}?conversation_id=${convId}&token=${token}`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      setIsConnected(true);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        setMessages((prev) => [...prev, data.message]);
      } else if (data.type === 'phase_change') {
        setCurrentPhase(data.phase);
      }
    };
    
    ws.onclose = () => {
      setIsConnected(false);
    };
    
    ws.onerror = () => {
      toast({
        title: 'Connection error',
        description: 'Failed to connect to assistant',
        variant: 'destructive',
      });
    };
    
    wsRef.current = ws;
  };

  useEffect(() => {
    // Auto-start a conversation on mount
    startNewConversation();
    
    return () => {
      wsRef.current?.close();
    };
  }, [startNewConversation]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: 'temp-' + Date.now(),
      conversation_id: conversationId || '',
      role: 'user',
      content: inputValue,
      created_at: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    if (API_CONFIG.useMocks) {
      // Simulate AI response in mock mode
      setTimeout(() => {
        const assistantMessage: Message = {
          id: 'msg-' + Date.now(),
          conversation_id: conversationId || '',
          role: 'assistant',
          content: getMockResponse(inputValue, currentPhase),
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
    } else if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'message', content: inputValue }));
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const PhaseIcon = phaseConfig[currentPhase].icon;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Phase indicator */}
      <div className="border-b border-border bg-card px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <PhaseIcon className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">
                {phaseConfig[currentPhase].label}
              </span>
            </div>
            {/* Phase progress */}
            <div className="hidden md:flex items-center gap-2">
              {(Object.keys(phaseConfig) as ConversationPhase[]).map((phase, index) => {
                const phases = Object.keys(phaseConfig) as ConversationPhase[];
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
function getMockResponse(input: string, phase: ConversationPhase): string {
  const lowerInput = input.toLowerCase();
  
  if (phase === 'discovery') {
    if (lowerInput.includes('tech') || lowerInput.includes('software') || lowerInput.includes('saas')) {
      return "Great! As a technology/SaaS company, you'll likely need to demonstrate strong security controls to your customers. Based on this, I'd recommend considering SOC 2 Type II, which is the gold standard for SaaS companies.\n\nCan you tell me more about:\n1. How many employees does your company have?\n2. Do you handle any personal data from EU residents?\n3. Do you process any healthcare-related information?";
    }
    return "Thank you for sharing that. To better understand your compliance needs, could you tell me:\n\n1. What industry is your organization in?\n2. What types of data do you handle (customer data, financial data, health records)?\n3. Who are your primary customers (enterprises, SMBs, consumers)?";
  }
  
  return "Thank you for that information. Let me process what you've shared and provide some recommendations. Based on our conversation, I'm analyzing the compliance frameworks that would best suit your organization.";
}
