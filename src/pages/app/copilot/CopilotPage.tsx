import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Bot, Loader2, Plus, Send, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  useCopilotConversations,
  useCopilotMessages,
  useCreateCopilotConversation,
  useSendCopilotMessage,
} from "./useCopilot";

export default function CopilotPage() {
  const { conversations, isLoading: conversationsLoading } = useCopilotConversations();
  const createConversation = useCreateCopilotConversation();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationsLoading && !activeConversationId) {
      if (conversations.length > 0) {
        setActiveConversationId(conversations[0].id);
      } else {
        createConversation.mutate(undefined, {
          onSuccess: (conversation) => setActiveConversationId(conversation.id),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationsLoading, conversations.length]);

  const { messages, isLoading: messagesLoading } = useCopilotMessages(activeConversationId);
  const sendMessage = useSendCopilotMessage(activeConversationId);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sendMessage.isPending]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text || sendMessage.isPending) return;
    setDraft("");
    sendMessage.mutate(text);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-5xl flex-col gap-4 p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Compliance Copilot</h1>
          <p className="text-muted-foreground">
            Ask about your readiness scores, evidence gaps, or framework overlap. Answers are grounded in your real data only.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            createConversation.mutate(undefined, {
              onSuccess: (conversation) => setActiveConversationId(conversation.id),
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          New chat
        </Button>
      </div>

      <Card className="bg-card flex flex-1 flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
          {messagesLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
              <Bot className="h-8 w-8" />
              <p>Ask a question like "What's my SOC 2 readiness score?" or "What evidence is expiring soon?"</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-3", message.role === "user" ? "flex-row-reverse" : "flex-row")}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {message.role === "user" ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={cn(
                      "max-w-[75%] rounded-lg px-4 py-2 text-sm",
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.role === "assistant" && message.metadata_json?.grounded === false && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>Not enough data to answer this confidently.</span>
                      </div>
                    )}
                    {message.role === "assistant" &&
                      message.metadata_json?.data_points_used &&
                      message.metadata_json.data_points_used.length > 0 && (
                        <div className="mt-2 border-t border-border/50 pt-2 text-xs text-muted-foreground">
                          Based on: {message.metadata_json.data_points_used.join(" · ")}
                        </div>
                      )}
                  </div>
                </div>
              ))}
              {sendMessage.isPending && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex items-center rounded-lg bg-muted px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 border-t border-border p-4">
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about your compliance readiness..."
            rows={1}
            className="resize-none"
            disabled={!activeConversationId || sendMessage.isPending}
          />
          <Button onClick={handleSend} disabled={!draft.trim() || !activeConversationId || sendMessage.isPending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
