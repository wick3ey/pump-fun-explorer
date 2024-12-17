import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const TokenHeader = () => {
  const { toast } = useToast();

  const handleVote = (type: 'moon' | 'gensler') => {
    // This would normally check wallet connection and handle the vote
    toast({
      title: "Wallet connection required",
      description: "Please connect your wallet to vote",
      variant: "destructive",
    });
  };

  return (
    <div className="relative w-full h-48 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg overflow-hidden mb-6">
      <div className="absolute inset-0 bg-[url('/lovable-uploads/ace4dc8b-8a5d-4d71-9f5d-b0815369aff5.png')] bg-cover bg-center opacity-20" />
      
      <div className="relative h-full flex items-center px-6">
        <div className="flex items-center gap-6">
          <img 
            src="/lovable-uploads/6b165013-9c87-47f9-8ac0-9127b2f927e6.png" 
            alt="DOGE" 
            className="w-24 h-24 rounded-full border-4 border-white/10"
          />
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2">Dogecoin (DOGE)</h1>
            <div className="flex gap-4 items-center">
              <p className="text-gray-300">The Original Meme Coin</p>
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
  );
};