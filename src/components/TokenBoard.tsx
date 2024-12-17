import { Card } from "@/components/ui/card";
import { Zap, Timer, ExternalLink, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { KingOfTheHill } from "./KingOfTheHill";
import { TrendingFilter } from "./TrendingFilter";
import { useState, useEffect } from "react";
import { tokenWebSocket } from "@/lib/websocket";
import { TokenList } from "./token/TokenList";
import { useTokenStore } from "@/stores/tokenStore";
import { useToast } from "@/components/ui/use-toast";

export const TokenBoard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h");
  const { tokens, addToken, updateMarketCaps } = useTokenStore();

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateMarketCaps().catch((error) => {
        console.error('Error updating market caps:', error);
        toast({
          title: "Error",
          description: "Failed to update market caps",
          variant: "destructive",
        });
      });
    }, 60000);

    return () => clearInterval(intervalId);
  }, [updateMarketCaps, toast]);

  useEffect(() => {
    tokenWebSocket.onNewToken(async (data) => {
      try {
        console.log('Received new token data:', data);
        await addToken(data);
      } catch (error) {
        console.error('Error processing new token:', error);
        toast({
          title: "Error",
          description: "Failed to add new token",
          variant: "destructive",
        });
      }
    });

    return () => {
      tokenWebSocket.disconnect();
    };
  }, [addToken, toast]);

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  console.log('Current tokens in TokenBoard:', tokens);

  return (
    <div className="space-y-6">
      <KingOfTheHill 
        symbol="PENGU"
        chain="SOL"
        percentageIncrease={12.5}
        age="14h"
        marketCap={75000}
        bondingCurveTarget={98000}
      />

      <TrendingFilter 
        selectedTimeframe={selectedTimeframe}
        onTimeframeChange={handleTimeframeChange}
      />

      <TokenList 
        tokens={tokens} 
        onTokenClick={(symbol) => navigate(`/token/${symbol}`)}
      />
    </div>
  );
};