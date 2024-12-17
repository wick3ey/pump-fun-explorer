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
  const { tokens, addToken, updateMarketCaps, searchTokens, filterTokensByMarketCap } = useTokenStore();
  const [kingOfHill, setKingOfHill] = useState<TokenData | null>(null);

  // Uppdatera tokens var 60:e sekund för att hålla age uppdaterad
  useEffect(() => {
    const intervalId = setInterval(() => {
      const updatedTokens = tokens.map(token => ({
        ...token,
        age: calculateAge(token.timestamp)
      }));
      
      // Uppdatera market caps och ages
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
  }, [updateMarketCaps, toast, tokens]);

  useEffect(() => {
    // Find the token with highest marketcap above 40k
    const newKing = tokens
      .filter(token => token.marketCap >= 40000)
      .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))[0];
    
    if (newKing && (!kingOfHill || newKing.marketCap > (kingOfHill.marketCap || 0))) {
      setKingOfHill(newKing);
      console.log('New King of the Hill:', newKing);
    }
  }, [tokens]);

  useEffect(() => {
    tokenWebSocket.onNewToken(async (data) => {
      try {
        console.log('Received new token data:', data);
        await addToken({
          ...data,
          timestamp: Date.now(),
          age: '1m' // Sätt initial ålder till 1 minut
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
    let filteredTokens = searchQuery ? searchTokens(searchQuery) : tokens;

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

  const sortedTokens = getSortedTokens(tokens);

  const calculatePercentageIncrease = (token: TokenData) => {
    return ((token.marketCap || 0) / 40000 * 100 - 100).toFixed(1);
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
        tokens={sortedTokens}
        onTokenClick={(symbol) => navigate(`/token/${symbol}`)}
      />
    </div>
  );
};