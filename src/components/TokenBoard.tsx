import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Timer, ExternalLink, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { KingOfTheHill } from "./KingOfTheHill";
import { TrendingFilter } from "./TrendingFilter";
import { useState, useEffect } from "react";
import { tokenWebSocket } from "@/lib/websocket";
import { useToast } from "@/components/ui/use-toast";

interface TokenData {
  symbol: string;
  name: string;
  marketCap: number;
  age: string;
  transactions: number;
  holders: number;
  power: number;
  chain: string;
  percentageChange: number;
  isSafeDegen?: boolean;
}

export const TokenBoard = () => {
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h");
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Initial tokens data
    setTokens([
      {
        symbol: "WIF",
        name: "Friend.tech",
        marketCap: 675000000,
        age: "3m",
        transactions: 1562,
        holders: 890,
        power: 468,
        chain: "SOL",
        percentageChange: 12.5,
        isSafeDegen: true
      },
      {
        symbol: "BONK",
        name: "Bonk",
        marketCap: 543000000,
        age: "1y",
        transactions: 2341,
        holders: 1502,
        power: 389,
        chain: "SOL",
        percentageChange: -2.3
      },
      {
        symbol: "MYRO",
        name: "Myro",
        marketCap: 234000000,
        age: "2m",
        transactions: 892,
        holders: 456,
        power: 345,
        chain: "SOL",
        percentageChange: 5.6
      },
      {
        symbol: "POPCAT",
        name: "Pop Cat",
        marketCap: 123000000,
        age: "1m",
        transactions: 567,
        holders: 234,
        power: 289,
        chain: "SOL",
        percentageChange: -1.2
      },
      {
        symbol: "SLERF",
        name: "Slerf",
        marketCap: 98000000,
        age: "2w",
        transactions: 456,
        holders: 189,
        power: 234,
        chain: "SOL",
        percentageChange: 8.9
      },
      {
        symbol: "BOME",
        name: "Book of Meme",
        marketCap: 87000000,
        age: "1m",
        transactions: 345,
        holders: 167,
        power: 198,
        chain: "SOL",
        percentageChange: 3.4
      },
      {
        symbol: "MNGO",
        name: "Mango",
        marketCap: 76000000,
        age: "2y",
        transactions: 289,
        holders: 145,
        power: 167,
        chain: "SOL",
        percentageChange: -0.8
      },
      {
        symbol: "SAMO",
        name: "Samoyedcoin",
        marketCap: 65000000,
        age: "2y",
        transactions: 234,
        holders: 123,
        power: 145,
        chain: "SOL",
        percentageChange: 1.2
      },
      {
        symbol: "PEPE",
        name: "Pepe on Solana",
        marketCap: 54000000,
        age: "6m",
        transactions: 189,
        holders: 98,
        power: 123,
        chain: "SOL",
        percentageChange: -4.5
      },
      {
        symbol: "DOGE",
        name: "Dogecoin on Solana",
        marketCap: 43000000,
        age: "1y",
        transactions: 145,
        holders: 76,
        power: 98,
        chain: "SOL",
        percentageChange: 2.1
      }
    ]);

    // Subscribe to new tokens
    tokenWebSocket.onNewToken((data) => {
      // Assuming the data comes in a format that needs to be transformed
      const newToken: TokenData = {
        symbol: data.symbol,
        name: data.name,
        marketCap: data.marketCap || 0,
        age: "new",
        transactions: data.transactions || 0,
        holders: data.holders || 0,
        power: data.power || 0,
        chain: "SOL",
        percentageChange: 0,
      };

      setTokens(prev => [newToken, ...prev].slice(0, 10));
      
      toast({
        title: "Ny Token Upptäckt!",
        description: `${newToken.name} (${newToken.symbol}) har lagts till i listan`,
      });
    });

    return () => {
      tokenWebSocket.disconnect();
    };
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleRowClick = (symbol: string) => {
    navigate(`/token/${symbol}`);
  };

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
    // Here you would typically fetch new data based on the timeframe
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
              {tokens.map((token, index) => (
                <tr 
                  key={index}
                  onClick={() => handleRowClick(token.symbol)}
                  className="border-b border-[#2A2F3C] hover:bg-[#2A2F3C]/50 cursor-pointer transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
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
                  <td className="text-right p-4 text-white">{formatNumber(token.transactions)}</td>
                  <td className="text-right p-4 text-white">{formatNumber(token.holders)}</td>
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
                    <span className={token.percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {token.percentageChange >= 0 ? '+' : ''}{token.percentageChange}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
