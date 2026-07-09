import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader2, Plus, Send, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import logoIcon from "@/assets/logo-icon.png";
import {
  useCopilotConversations,
  useCopilotMessages,
  useCreateCopilotConversation,
  useSendCopilotMessage,
} from "./useCopilot";

const SUGGESTED_PROMPTS = [
  "What's my SOC 2 readiness score?",
  "What evidence is expiring soon?",
  "Where do my frameworks overlap?",
  "What's blocking my next audit?",
];

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

  const handleSend = (overrideText?: string) => {
    const text = (overrideText ?? draft).trim();
    if (!text || sendMessage.isPending) return;
    setDraft("");
    sendMessage.mutate(text);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-5xl flex-col gap-4 p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d8b45d]/30 bg-gradient-to-br from-[#fff7df] to-[#f3e6bd] shadow-[0_2px_8px_rgba(122,98,43,0.15)]">
            <img src={logoIcon} alt="" className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">ZestComply AI</h1>
            <p className="text-muted-foreground">
              Ask about your readiness scores, evidence gaps, or framework overlap. Answers are grounded in your real data only.
            </p>
          </div>
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
            <div className="flex h-full flex-col items-center justify-center gap-6 px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-[#d8b45d]/30 bg-gradient-to-br from-[#fff7df] to-[#f3e6bd] shadow-[0_8px_24px_rgba(122,98,43,0.15)]">
                <img src={logoIcon} alt="" className="h-9 w-9" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold text-foreground">Ask me anything about your compliance posture</p>
                <p className="text-sm text-muted-foreground">Answers are grounded in your real data - not generic advice.</p>
              </div>
              <div className="grid w-full max-w-lg gap-2 sm:grid-cols-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    disabled={!activeConversationId || sendMessage.isPending}
                    className="rounded-xl border border-border bg-background px-4 py-3 text-left text-sm text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d8b45d]/50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
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
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-[#d8b45d]/30 bg-gradient-to-br from-[#fff7df] to-[#f3e6bd] text-[#7a622b]"
                    )}
                  >
                    {message.role === "user" ? <UserIcon className="h-4 w-4" /> : <img src={logoIcon} alt="" className="h-4 w-4" />}
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
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d8b45d]/30 bg-gradient-to-br from-[#fff7df] to-[#f3e6bd]">
                    <img src={logoIcon} alt="" className="h-4 w-4" />
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
            className="resize-none focus-visible:ring-[#d8b45d]/50"
            disabled={!activeConversationId || sendMessage.isPending}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!draft.trim() || !activeConversationId || sendMessage.isPending}
            className="bg-[#d8b45d] text-slate-950 hover:bg-[#c9a34e]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
