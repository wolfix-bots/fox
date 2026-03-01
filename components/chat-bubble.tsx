"use client";

import { FoxLogo } from "./fox-logo";
import { User } from "lucide-react";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

export function ChatBubble({ role, content, isLoading }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card ring-1 ring-border"
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <FoxLogo size={22} />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`relative max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-card text-card-foreground ring-1 ring-border"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center gap-1 py-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-current opacity-40 [animation-delay:0ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-current opacity-40 [animation-delay:150ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-current opacity-40 [animation-delay:300ms]" />
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{content}</p>
        )}
      </div>
    </div>
  );
}
