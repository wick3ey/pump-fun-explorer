import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown, Zap, Timer, ExternalLink } from "lucide-react";
import { TrendingTokensBanner } from "./TrendingTokensBanner";
import { useNavigate } from "react-router-dom";

interface TokenData {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  age: string;
  transactions: number;
  holders: number;
  power: number;
  chain: string;
  percentageChange: number;
}

export const TokenBoard = () => {
  const navigate = useNavigate();

  // Mock data - i en riktig app skulle detta komma från din API
  const tokens: TokenData[] = [
    {
      symbol: "PENGU",
      name: "Pudgy Penguins",
      price: 0.000000435,
      marketCap: 5000,
      age: "1h",
      transactions: 156,
      holders: 89,
      power: 468,
      chain: "SOL",
      percentageChange: 12.5
    },
    {
      symbol: "PEPE",
      name: "Pepe",
      price: 0.000000123,
      marketCap: 3000,
      age: "2h",
      transactions: 200,
      holders: 150,
      power: 214,
      chain: "SOL",
      percentageChange: 5.0
    },
    {
      symbol: "FLOSS",
      name: "Floss",
      price: 0.000000456,
      marketCap: 4000,
      age: "16h",
      transactions: 100,
      holders: 75,
      power: 74,
      chain: "SOL",
      percentageChange: 8.0
    },
    {
      symbol: "DOGE",
      name: "Dogecoin",
      price: 0.000001234,
      marketCap: 4500,
      age: "4h",
      transactions: 300,
      holders: 200,
      power: 156,
      chain: "SOL",
      percentageChange: 10.0
    },
    {
      symbol: "SHIB",
      name: "Shiba Inu",
      price: 0.000000789,
      marketCap: 3500,
      age: "8h",
      transactions: 250,
      holders: 180,
      power: 89,
      chain: "SOL",
      percentageChange: 6.0
    },
  ];

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

  return (
    <div className="space-y-6">
      {/* King of the Hill Banner */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className="h-6 w-6 text-yellow-500" />
            <div>
              <h3 className="text-lg font-bold text-yellow-500">King of the Hill</h3>
              <p className="text-sm text-gray-400">Current Leader: PENGU/SOL</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20"
          >
            View Details
          </Button>
        </div>
      </div>

      {/* Advertisement Banner */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/10 p-4 rounded-lg border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h3 className="text-lg font-bold text-purple-400">Featured Project</h3>
              <p className="text-sm text-gray-400">Discover the next big thing in crypto</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
          >
            Learn More
          </Button>
        </div>
      </div>

      <TrendingTokensBanner />

      <Card className="bg-[#1A1F2C] border-[#2A2F3C]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A2F3C]">
                <th className="text-left p-4 text-gray-400">TOKEN</th>
                <th className="text-right p-4 text-gray-400">PRICE</th>
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
                      <div>
                        <div className="font-medium text-white">{token.symbol}</div>
                        <div className="text-sm text-gray-400">{token.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right p-4 text-white">
                    ${token.price.toFixed(12)}
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
