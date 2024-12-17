import { Card } from "@/components/ui/card";
import { TokenChart } from "@/components/TokenChart";
import { TokenInfo } from "@/components/TokenInfo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { TokenHeader } from "@/components/TokenHeader";
import { useQuery } from "@tanstack/react-query";
import { ChatTransactionToggle } from "@/components/ChatTransactionToggle";
import { VoiceChat } from "@/components/VoiceChat";

const TokenProfile = () => {
  const navigate = useNavigate();
  const { symbol } = useParams();

  const { data: token } = useQuery({
    queryKey: ['token', symbol],
    queryFn: async () => {
      if (symbol === 'DOGE') {
        return {
          name: "Dogecoin",
          symbol: "DOGE",
          description: "The Original Meme Coin",
          pfpUrl: "/lovable-uploads/6b165013-9c87-47f9-8ac0-9127b2f927e6.png",
          headerUrl: "/lovable-uploads/ace4dc8b-8a5d-4d71-9f5d-b0815369aff5.png"
        };
      }
      
      return {
        name: symbol,
        symbol: symbol,
        description: `${symbol} Token on Solana`,
        pfpUrl: "/placeholder.svg",
        headerUrl: ""
      };
    }
  });

  return (
    <div className="min-h-screen bg-[#13141F] text-white">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {token && <TokenHeader {...token} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1A1F2C] rounded-lg p-4 md:p-0">
              <TokenChart symbol={symbol || ''} />
            </div>
            <div className="md:hidden">
              <TokenInfo symbol={symbol || ''} />
            </div>
            <ChatTransactionToggle />
          </div>
          <div className="hidden md:block space-y-6">
            <TokenInfo symbol={symbol || ''} />
            <VoiceChat tokenSymbol={symbol || ''} />
          </div>
        </div>

        <div className="md:hidden mt-6">
          <VoiceChat tokenSymbol={symbol || ''} />
        </div>
      </div>
    </div>
  );
};

export default TokenProfile;