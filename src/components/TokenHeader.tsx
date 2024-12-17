import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { LoginDialog } from "./LoginDialog";
import { useAuth } from "@/contexts/AuthContext";

interface TokenHeaderProps {
  name: string;
  symbol: string;
  description: string;
  pfpUrl: string;
  headerUrl: string;
}

export const TokenHeader = ({ name, symbol, description }: TokenHeaderProps) => {
  const { toast } = useToast();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleVote = (type: 'moon' | 'gensler') => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    
    toast({
      title: `Voted ${type.toUpperCase()}!`,
      description: `Your ${type} vote has been recorded`,
    });
  };

  return (
    <>
      <div className="relative w-full h-48 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg overflow-hidden mb-6">
        <div className="relative h-full flex items-center px-6">
          <div className="flex items-center gap-6">
            <img 
              src="/placeholder.svg"
              alt={`${symbol} logo`}
              className="w-24 h-24 rounded-full border-4 border-white/10"
            />
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">{name} ({symbol})</h1>
              <div className="flex gap-4 items-center">
                <p className="text-gray-300">{description}</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleVote('moon')}
                    className="bg-green-500 hover:bg-green-600 text-white gap-2"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    MOON
                  </Button>
                  <Button
                    onClick={() => handleVote('gensler')}
                    className="bg-red-500 hover:bg-red-600 text-white gap-2"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    GENSLER
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </>
  );
};