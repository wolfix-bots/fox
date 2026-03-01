import { FoxLogo } from "@/components/fox-logo";
import { ColorPicker } from "@/components/color-picker";
import { ChatContainer } from "@/components/chat-container";

export default function Home() {
  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* Top navigation bar */}
      <header className="flex items-center justify-between border-b border-border bg-card/60 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <FoxLogo size={32} />
          <div className="flex flex-col">
            <h1 className="text-base font-bold leading-tight text-foreground tracking-tight">
              Foxy
            </h1>
            <span className="text-[10px] font-medium text-muted-foreground">
              by Foxy Tech
            </span>
          </div>
        </div>
        <ColorPicker />
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-hidden">
        <ChatContainer />
      </main>
    </div>
  );
}
