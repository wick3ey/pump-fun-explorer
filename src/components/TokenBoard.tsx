import { Card } from "@/components/ui/card";
import { Zap, Timer, ExternalLink, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { KingOfTheHill } from "./KingOfTheHill";
import { TrendingFilter } from "./TrendingFilter";
import { useState, useEffect, useCallback } from "react";
import { tokenWebSocket } from "@/lib/websocket";
import { TokenList } from "./token/TokenList";
import { useTokenStore } from "@/stores/tokenStore";
import { useToast } from "@/components/ui/use-toast";
import { TokenData } from "@/types/token";
import { calculateAge } from "@/lib/token/tokenCalculations";

interface TokenBoardProps {
  searchQuery?: string;
}

export const TokenBoard = ({ searchQuery = "" }: TokenBoardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h");
  const [sortBy, setSortBy] = useState("newest");
  const { tokens, addToken, updateMarketCaps, searchTokens } = useTokenStore();
  const [kingOfHill, setKingOfHill] = useState<TokenData | null>(null);

  // Memoize the update function to prevent recreation on every render
  const updateTokenAges = useCallback(() => {
    const updatedTokens = tokens.map(token => ({
      ...token,
      age: calculateAge(token.timestamp)
    }));
    
    // Only update market caps if needed
    if (JSON.stringify(updatedTokens) !== JSON.stringify(tokens)) {
      updateMarketCaps().catch((error) => {
        console.error('Error updating market caps:', error);
        toast({
          title: "Error",
          description: "Failed to update market caps",
          variant: "destructive",
        });
      });
    }
  }, [tokens, updateMarketCaps, toast]);

  // Update token ages every minute
  useEffect(() => {
    // Initial update
    updateTokenAges();
    
    // Set up interval for updates
    const intervalId = setInterval(updateTokenAges, 60000);
    return () => clearInterval(intervalId);
  }, [updateTokenAges]);

  // Update King of the Hill
  useEffect(() => {
    const KING_THRESHOLD = 40000;
    const newKing = tokens
      .filter(token => (token.marketCap || 0) >= KING_THRESHOLD)
      .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))[0];
    
    if (newKing && (!kingOfHill || newKing.marketCap > (kingOfHill.marketCap || 0))) {
      setKingOfHill(newKing);
    }
  }, [tokens, kingOfHill]);

  // WebSocket token updates
  useEffect(() => {
    tokenWebSocket.onNewToken(async (data) => {
      try {
        await addToken({
          ...data,
          timestamp: Date.now(),
          age: calculateAge(Date.now())
        });
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

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const getSortedTokens = (tokens: TokenData[]) => {
    const filteredTokens = searchQuery ? searchTokens(searchQuery) : tokens;

    return filteredTokens.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (b.timestamp || 0) - (a.timestamp || 0);
        case "oldest":
          return (a.timestamp || 0) - (b.timestamp || 0);
        case "marketcap_high":
          return (b.marketCap || 0) - (a.marketCap || 0);
        case "marketcap_low":
          return (a.marketCap || 0) - (b.marketCap || 0);
        default:
          return 0;
      }
    });
  };

  const calculatePercentageIncrease = (token: TokenData) => {
    const GRADUATION_THRESHOLD = 40000;
    return ((token.marketCap || 0) / GRADUATION_THRESHOLD * 100 - 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {kingOfHill && (
        <KingOfTheHill 
          symbol={kingOfHill.symbol}
          chain={kingOfHill.chain}
          percentageIncrease={Number(calculatePercentageIncrease(kingOfHill))}
          age={kingOfHill.age}
          marketCap={kingOfHill.marketCap || 0}
          bondingCurveTarget={98000}
          image={kingOfHill.image}
        />
      )}

      <TrendingFilter 
        selectedTimeframe={selectedTimeframe}
        onTimeframeChange={handleTimeframeChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      <TokenList 
        tokens={getSortedTokens(tokens)}
        onTokenClick={(symbol) => navigate(`/token/${symbol}`)}
      />
    </div>
  );
};