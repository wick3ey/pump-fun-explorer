import { Card } from "@/components/ui/card";
import { TrendingFilter } from "./TrendingFilter";
import { useQuery } from "@tanstack/react-query";
import { fetchTrendingTokens } from "@/services/dexscreener";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";

interface TokenBoardProps {
  searchQuery?: string;
}

export const TokenBoard = ({ searchQuery = "" }: TokenBoardProps) => {
  const navigate = useNavigate();
  const { data: tokens, isLoading, error } = useQuery({
    queryKey: ['trending-tokens'],
    queryFn: fetchTrendingTokens,
    refetchInterval: 60000, // Refetch every minute
  });

  console.log('TokenBoard render:', { tokens, isLoading, error });

  const filteredTokens = tokens?.filter(token => 
    token.baseToken.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.baseToken.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <Card className="bg-[#1A1F2C] border-[#2A2F3C] p-6">
        <div className="text-center text-red-400">
          Failed to load trending tokens. Please try again later.
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <TrendingFilter 
        selectedTimeframe="1h"
        onTimeframeChange={() => {}}
        sortBy="power"
        onSortChange={() => {}}
      />
      
      <Card className="bg-[#1A1F2C] border-[#2A2F3C] p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTokens?.length === 0 ? (
          <div className="text-center text-gray-400">
            No tokens found matching your search
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTokens?.map((token, index) => (
              <div 
                key={`${token.chainId}-${token.pairAddress}`}
                onClick={() => navigate(`/token/${token.baseToken.symbol}`)}
                className="flex items-center justify-between p-4 hover:bg-[#2A2F3C]/50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <span className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs px-2 rounded-full">
                      #{index + 1}
                    </span>
                    <img 
                      src={token.info?.imageUrl || "/placeholder.svg"}
                      alt={token.baseToken.symbol}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {token.baseToken.symbol}
                    </div>
                    <div className="text-sm text-gray-400">
                      {token.baseToken.name}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Zap className="h-4 w-4 text-orange-500" />
                    <span className="text-orange-500 font-bold">
                      {token.power || 0}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    MC ${formatNumber(token.marketCap || 0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};