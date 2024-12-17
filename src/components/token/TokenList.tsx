import { Card } from "@/components/ui/card";
import { Zap, Timer, Lock } from "lucide-react";
import { TokenData } from "@/types/token";

interface TokenListProps {
  tokens: TokenData[];
  onTokenClick: (symbol: string) => void;
}

export const TokenList = ({ tokens, onTokenClick }: TokenListProps) => {
  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return '0';
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(1);
  };

  const validTokens = tokens.filter(token => 
    token.marketCap && 
    token.marketCap > 0 && 
    !isNaN(token.marketCap)
  );

  return (
    <Card className="bg-[#1A1F2C] border-[#2A2F3C]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2A2F3C]">
              <th className="text-left p-4 text-gray-400">TOKEN</th>
              <th className="text-right p-4 text-gray-400">MARKETCAP</th>
              <th className="text-right p-4 text-gray-400">AGE</th>
              <th className="text-right p-4 text-gray-400">TXNS</th>
              <th className="text-right p-4 text-gray-400">HOLDERS</th>
              <th className="text-right p-4 text-gray-400">POWER</th>
              <th className="text-right p-4 text-gray-400">CHAIN</th>
              <th className="text-right p-4 text-gray-400">CHANGE</th>
            </tr>
          </thead>
          <tbody>
            {validTokens.map((token, index) => (
              <tr 
                key={index}
                onClick={() => onTokenClick(token.symbol)}
                className="border-b border-[#2A2F3C] hover:bg-[#2A2F3C]/50 cursor-pointer transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={token.image || "/placeholder.svg"} 
                      alt={token.symbol}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-medium text-white">{token.symbol}</div>
                        <div className="text-sm text-gray-400">{token.name}</div>
                      </div>
                      {token.isSafeDegen && (
                        <Lock className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                </td>
                <td className="text-right p-4 text-white">
                  ${formatNumber(token.marketCap)}
                </td>
                <td className="text-right p-4">
                  <div className="flex items-center justify-end space-x-1 text-gray-400">
                    <Timer className="h-4 w-4" />
                    <span>{token.age}</span>
                  </div>
                </td>
                <td className="text-right p-4">
                  <span className="text-white">{formatNumber(token.transactionCounts?.['24h'] || 0)}</span>
                  <div className="text-xs text-gray-400">24h</div>
                </td>
                <td className="text-right p-4">
                  <span className="text-white">{formatNumber(token.holders)}</span>
                </td>
                <td className="text-right p-4">
                  <div className="flex items-center justify-end space-x-1">
                    <Zap className="h-4 w-4 text-orange-500" />
                    <span className="text-orange-500">{token.power}</span>
                  </div>
                </td>
                <td className="text-right p-4">
                  <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                    {token.chain}
                  </span>
                </td>
                <td className="text-right p-4">
                  <span className={Number(token.percentageChange) >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {Number(token.percentageChange) >= 0 ? '+' : ''}{token.percentageChange}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};