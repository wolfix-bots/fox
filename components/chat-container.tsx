"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatBubble } from "./chat-bubble";
import { ChatInput } from "./chat-input";
import { FoxLogo } from "./fox-logo";
import { Trash2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const WELCOME_SUGGESTIONS = [
  "Tell me a fun fox fact!",
  "What can you help me with?",
  "Tell me a joke",
  "Write me a short poem",
];

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  async function sendMessage(text: string) {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const encodedMessage = encodeURIComponent(text);
      const res = await fetch(
        `https://apis.xcasper.space/api/ai/mistral?message=${encodedMessage}`,
        { method: "GET" }
      );

      if (!res.ok) {
        throw new Error(`API responded with status ${res.status}`);
      }

      const contentType = res.headers.get("content-type") || "";
      
      let reply: string;
      
      if (contentType.includes("application/json")) {
        const data = await res.json();
        reply = data.result || data.message || data.response || data.answer || data.text || data.content || data.reply || (typeof data === "string" ? data : JSON.stringify(data));
      } else {
        reply = await res.text();
      }

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply || "Hmm, I got lost chasing my tail. Try again!",
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Oops! Foxy tripped over a log. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function clearChat() {
    setMessages([]);
  }

  return (
    <div className="flex h-full flex-col">
      {/* Chat header bar */}
      <div className="flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="text-sm font-medium text-foreground">
            Foxy is online
          </span>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Clear chat"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-3">
              <FoxLogo size={72} />
              <h2 className="text-xl font-bold text-foreground text-balance text-center">
                Hey there! I&apos;m Foxy
              </h2>
              <p className="max-w-sm text-center text-sm text-muted-foreground leading-relaxed">
                Your clever AI companion. Ask me anything and I&apos;ll do my best to help!
              </p>
            </div>
            <div className="grid w-full max-w-md grid-cols-2 gap-2">
              {WELCOME_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="rounded-xl bg-card px-3 py-2.5 text-left text-xs font-medium text-foreground shadow-sm ring-1 ring-border transition-all hover:shadow-md hover:ring-primary/40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
              />
            ))}
            {isLoading && (
              <ChatBubble role="assistant" content="" isLoading />
            )}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-background/80 p-4 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Foxy AI by Foxy Tech. Foxy can make mistakes, so double-check responses.
          </p>
        </div>
      </div>
    </div>
  );
}
