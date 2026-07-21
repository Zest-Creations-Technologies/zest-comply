import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Talks to worker/index.js's /api/support-chat route (Cloudflare Workers AI -
// see that file for the system prompt and model). Same-origin, so no CORS
// or CSP connect-src change needed. Rendered wherever LandingHeader is,
// which covers the marketing page and the legal pages that share its chrome.

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const GREETING: ChatMessage = {
  role: "assistant",
  content: "Hi! I'm ZestComply's support assistant. Ask me anything about the platform, supported compliance frameworks, or how it works.",
};

export function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || sending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/support-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Skip the canned greeting - it was never a real turn Workers AI generated.
          messages: nextMessages.slice(1).map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) {
        throw new Error("request_failed");
      }

      const data = (await response.json()) as { reply?: string };
      setMessages([...nextMessages, { role: "assistant", content: data.reply || "Sorry, I didn't catch that - could you rephrase?" }]);
    } catch {
      setError("The support assistant is temporarily unavailable. Please try again, or use Request Access to reach the team directly.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a1617] shadow-2xl shadow-slate-950/50">
          <div className="flex items-center justify-between border-b border-white/10 bg-[#071112] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">ZestComply Support</p>
              <p className="text-xs text-slate-400">Usually answers instantly</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close support chat"
              className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
            <div className="flex flex-col gap-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "self-end bg-[#d8b45d] text-slate-950"
                      : "self-start bg-white/[0.06] text-slate-200"
                  }`}
                >
                  {message.content}
                </div>
              ))}
              {sending && (
                <div className="self-start rounded-xl bg-white/[0.06] px-3 py-2 text-sm text-slate-400">
                  Thinking…
                </div>
              )}
              {error && (
                <div className="self-start rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {error}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-end gap-2 border-t border-white/10 bg-[#071112] p-3">
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question…"
              rows={1}
              className="max-h-24 min-h-[2.5rem] resize-none border-white/10 bg-white/[0.04] text-sm text-white placeholder:text-slate-500"
            />
            <Button
              size="icon"
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              className="h-10 w-10 shrink-0 bg-[#d8b45d] text-slate-950 hover:bg-[#f0d990]"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Button
        onClick={() => setOpen((value) => !value)}
        className="h-14 w-14 rounded-full bg-[#d8b45d] p-0 text-slate-950 shadow-lg shadow-amber-950/30 hover:bg-[#f0d990]"
        aria-label={open ? "Close support chat" : "Open support chat"}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
}
