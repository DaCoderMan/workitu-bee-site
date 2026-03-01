"use client";

import { useState } from "react";
import { Send, Loader2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

type Message = {
  role: "user" | "bee";
  content: string;
  time: string;
};

export function BeeChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || sending) return;

    const userMsg: Message = {
      role: "user",
      content: message,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setSending(true);

    try {
      const res = await fetch("/api/dashboard/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });

      if (!res.ok) throw new Error("Failed to send");

      const beeMsg: Message = {
        role: "bee",
        content:
          "Message received! Yonatan will review it and get back to you soon. For urgent matters, book a call from the sidebar.",
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, beeMsg]);
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Chat with Bee</CardTitle>
        </div>
        <CardDescription>
          Send a message about your project. We&apos;ll respond within 24 hours.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {messages.length > 0 && (
          <div className="mb-4 flex max-h-64 flex-col gap-3 overflow-y-auto rounded-md border p-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="mt-0.5 text-xs text-muted-foreground">
                  {msg.time}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="min-h-[60px] resize-none"
          />
          <Button
            size="icon"
            className="h-auto"
            onClick={handleSend}
            disabled={sending || !message.trim()}
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
