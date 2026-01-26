import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const demoSequence: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Can I underwrite a Title to Shares risk in India?",
  },
  {
    id: "2",
    role: "assistant",
    content:
      "No, this is outside of the agreed jurisdictions with the coverholders and would result in a binder breach. Can I help with anything else?",
  },
  {
    id: "3",
    role: "user",
    content: "Yes, what is our top line capacity for title to shares?",
  },
  {
    id: "4",
    role: "assistant",
    content: "The maximum line capacity for Title to Shares is £100,000,000.00.",
  },
];

export function BinderChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenClicked, setHasBeenClicked] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (currentStep >= demoSequence.length) return;

    // Add user message
    const userMessage = demoSequence[currentStep];
    if (userMessage) {
      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      
      // Add bot response after a short delay
      if (currentStep + 1 < demoSequence.length) {
        setTimeout(() => {
          const botMessage = demoSequence[currentStep + 1];
          if (botMessage) {
            setMessages((prev) => [...prev, botMessage]);
          }
        }, 600);
      }
      
      setCurrentStep((prev) => prev + 2);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      {/* Floating Toggle Button */}
      <Button
        onClick={() => {
          setIsOpen(!isOpen);
          setHasBeenClicked(true);
        }}
        className={cn(
          "fixed bottom-16 right-6 z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-300",
          "bg-gradient-to-br from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500",
          "hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/25",
          isOpen ? "rotate-90" : "",
          !hasBeenClicked && !isOpen && "animate-bounce-slow"
        )}
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </Button>

      {/* Chat Panel */}
      <div
        className={cn(
          "fixed bottom-36 right-6 z-50 w-96 rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl transition-all duration-300",
          "flex flex-col overflow-hidden",
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
        style={{ height: "500px" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border/50 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-teal-600">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Chat to Binder</h3>
            <p className="text-xs text-muted-foreground">
              Ask questions about your binder terms
            </p>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    message.role === "user"
                      ? "bg-primary/20"
                      : "bg-gradient-to-br from-cyan-500 to-teal-600"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-primary" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted/50 text-foreground rounded-bl-md border border-border/50"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border/50 bg-background/50 p-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={currentStep >= demoSequence.length ? "Demo complete" : "Press Enter to continue demo..."}
              className="flex-1 rounded-full border-border/50 bg-muted/30 px-4 focus-visible:ring-cyan-500/50"
              disabled={currentStep >= demoSequence.length}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={currentStep >= demoSequence.length}
              className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 disabled:opacity-50"
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
