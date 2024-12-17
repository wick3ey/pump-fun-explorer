import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";

interface ChatMessage {
  id: number;
  user: string;
  message: string;
  timestamp: string;
}

export const TokenChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      user: "Anon",
      message: "GM frens! 🚀",
      timestamp: "2m ago"
    },
    {
      id: 2,
      user: "Degen",
      message: "Bullish on this one 🔥",
      timestamp: "1m ago"
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setMessages([...messages, {
      id: messages.length + 1,
      user: "You",
      message: message.trim(),
      timestamp: "just now"
    }]);
    setMessage("");
  };

  return (
    <Card className="bg-[#1A1F2C] border-[#2A2F3C]">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="h-[300px] overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-purple-400">{msg.user}</span>
                  <span className="text-xs text-gray-400">{msg.timestamp}</span>
                </div>
                <p className="text-white">{msg.message}</p>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="bg-[#13141F]/50 border-[#2A2F3C] text-white"
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};