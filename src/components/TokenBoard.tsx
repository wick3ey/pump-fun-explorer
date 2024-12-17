import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Timer, ExternalLink, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { KingOfTheHill } from "./KingOfTheHill";
import { TrendingFilter } from "./TrendingFilter";
import { useState, useEffect } from "react";
import { tokenWebSocket } from "@/lib/websocket";
import { TokenList } from "./token/TokenList";
import { useTokenStore } from "@/stores/tokenStore";

export const TokenBoard = () => {
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h");
  const { tokens, addToken, updateMarketCaps } = useTokenStore();

  useEffect(() => {
    // Update market caps every 60 seconds
    const intervalId = setInterval(() => {
      updateMarketCaps();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [updateMarketCaps]);

  useEffect(() => {
    tokenWebSocket.onNewToken(async (data) => {
      const newToken = {
        symbol: data.symbol,
        name: data.name,
        initialSolAmount: data.initialSolAmount || 1,
        age: "new",
        transactions: data.transactions || 0,
        holders: data.holders || 0,
        power: data.power || 0,
        chain: "SOL",
        percentageChange: 0,
        marketCap: 0, // This will be calculated in the store
      };

      await addToken(newToken);
    });

    return () => {
      tokenWebSocket.disconnect();
    };
  }, [addToken]);

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

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