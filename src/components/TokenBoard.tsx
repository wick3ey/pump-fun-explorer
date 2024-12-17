import { Card } from "@/components/ui/card";
import { Zap, Timer, ExternalLink, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { KingOfTheHill } from "./KingOfTheHill";
import { TrendingFilter } from "./TrendingFilter";
import { useState, useEffect, useCallback, useRef } from "react";
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
  const intervalRef = useRef<NodeJS.Timeout>();
  const prevTokensRef = useRef(tokens);

  const updateTokenAges = useCallback(() => {
    const updatedTokens = tokens.map(token => ({
      ...token,
      age: calculateAge(token.timestamp)
    }));
    
    // Only update if market caps have actually changed
    if (JSON.stringify(updatedTokens) !== JSON.stringify(prevTokensRef.current)) {
      prevTokensRef.current = updatedTokens;
      updateMarketCaps().catch(console.error);
    }
  }, [tokens, updateMarketCaps]);

  // Update token ages every minute
  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Initial update
    updateTokenAges();
    
    // Set new interval
    intervalRef.current = setInterval(updateTokenAges, 60000);
    
    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateTokenAges]);

  // Update King of the Hill
  useEffect(() => {
    const KING_THRESHOLD = 40000;
    const newKing = tokens
      .filter(token => (token.marketCap || 0) >= KING_THRESHOLD)
      .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))[0];
    
    if (newKing && (!kingOfHill || newKing.marketCap !== kingOfHill.marketCap)) {
      setKingOfHill(newKing);
    }
  }, [tokens]);

  // WebSocket token updates
  useEffect(() => {
    const handleNewToken = async (data: TokenData) => {
      try {
        const timestamp = Date.now();
        await addToken({
          ...data,
          timestamp,
          age: calculateAge(timestamp)
        });
      } catch (error) {
        console.error('Error processing new token:', error);
      }
    };

    tokenWebSocket.onNewToken(handleNewToken);

    return () => {
      tokenWebSocket.disconnect();
    };
  }, [addToken]);

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const getSortedTokens = useCallback((tokens: TokenData[]) => {
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
  }, [sortBy, searchQuery, searchTokens]);

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