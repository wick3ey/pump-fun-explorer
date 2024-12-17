import { Button } from "@/components/ui/button";
import { MessageSquare, History } from "lucide-react";
import { useState } from "react";
import { TransactionHistory } from "./TransactionHistory";
import { TokenChat } from "./TokenChat";

export const ChatTransactionToggle = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={showChat ? "ghost" : "default"}
          onClick={() => setShowChat(false)}
          className="flex-1 text-sm md:text-base"
        >
          <History className="mr-2 h-4 w-4" />
          Recent Transactions
        </Button>
        <Button
          variant={showChat ? "default" : "ghost"}
          onClick={() => setShowChat(true)}
          className="flex-1 text-sm md:text-base"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Open Chat
        </Button>
      </div>

      {showChat ? <TokenChat /> : <TransactionHistory />}
    </div>
  );
};