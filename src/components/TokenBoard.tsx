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
  const [localTokens, setLocalTokens] = useState<TokenData[]>(tokens);

  // Update local tokens with current ages
  const updateTokenAges = useCallback(() => {
    setLocalTokens(tokens.map(token => ({
      ...token,
      age: calculateAge(token.timestamp)
    })));
  }, [tokens]);

  // Initial setup and interval for age updates
  useEffect(() => {
    updateTokenAges();
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(updateTokenAges, 10000); // Update every 10 seconds
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateTokenAges]);

  // Update King of the Hill
  useEffect(() => {
    const KING_THRESHOLD = 40000;
    const newKing = localTokens
      .filter(token => (token.marketCap || 0) >= KING_THRESHOLD)
      .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))[0];
    
    if (newKing && (!kingOfHill || newKing.marketCap !== kingOfHill.marketCap)) {
      setKingOfHill(newKing);
    }
  }, [localTokens]);

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
        tokens={getSortedTokens(localTokens)}
        onTokenClick={(symbol) => navigate(`/token/${symbol}`)}
      />
    </div>
  );
};