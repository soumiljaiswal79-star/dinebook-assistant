import { useState, useRef, useEffect, useCallback } from "react";
import { Send } from "lucide-react";
import { createBotEngine, type Message } from "@/lib/botEngine";
import { ChatMessage } from "./ChatMessage";

const engine = createBotEngine();

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "greeting",
      role: "bot",
      content: engine.getGreeting(),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const sendMessage = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = engine.processMessage(trimmed);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mt-1">
              <span className="text-primary-foreground text-xs font-bold">LM</span>
            </div>
            <div className="bg-chat-bot text-chat-bot-foreground rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions */}
      <div className="px-4 pb-2 flex gap-2 flex-wrap">
        {["Book a table", "View menu", "Check availability"].map((action) => (
          <button
            key={action}
            onClick={() => {
              setInput(action);
              setTimeout(() => {
                const userMsg: Message = {
                  id: Date.now().toString(),
                  role: "user",
                  content: action,
                  timestamp: new Date(),
                };
                setMessages((prev) => [...prev, userMsg]);
                setInput("");
                setIsTyping(true);
                setTimeout(() => {
                  const response = engine.processMessage(action);
                  const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "bot",
                    content: response,
                    timestamp: new Date(),
                  };
                  setMessages((prev) => [...prev, botMsg]);
                  setIsTyping(false);
                }, 600);
              }, 100);
            }}
            className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-foreground hover:bg-accent transition-colors font-body"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
