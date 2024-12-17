import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const TokenBoard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFrame, setTimeFrame] = useState("24h");

  // Mockdata som matchar bilden
  const tokens = [
    {
      rank: 1,
      name: "Pudgy Pengu",
      symbol: "PENGU",
      chain: "SOL",
      power: 5000,
      price: 0.000925,
      age: "1h",
      txns: 11175,
      volume: 925000,
      makers: 5692,
      changes: {
        "5m": 8.65,
        "1h": 37.69,
        "6h": 438,
        "24h": 438
      },
      liquidity: 118000,
      mcap: 922000,
    },
    {
      rank: 2,
      name: "PENGU Pengu",
      symbol: "PENGU",
      chain: "SOL",
      power: 5000,
      price: 0.001721,
      age: "1d",
      txns: 133091,
      volume: 23300000,
      makers: 48703,
      changes: {
        "5m": -8.12,
        "1h": -33.66,
        "6h": -39.31,
        "24h": 128
      },
      liquidity: 212000,
      mcap: 1700000,
    },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num}`;
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(8)}`;
  };

  const formatPercentage = (value: number) => {
    const color = value >= 0 ? 'text-green-500' : 'text-red-500';
    return (
      <div className={`flex items-center space-x-1 ${color}`}>
        {value >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        <span>{Math.abs(value).toFixed(2)}%</span>
      </div>
    );
  };

  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="bg-[#13141F] border-b border-gray-800 p-4">
        <div className="flex items-center space-x-4">
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[180px] bg-[#1A1F2C] border-[#2A2F3C]">
              <SelectValue placeholder="Time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5m">5M</SelectItem>
              <SelectItem value="1h">1H</SelectItem>
              <SelectItem value="6h">6H</SelectItem>
              <SelectItem value="24h">24H</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-800">
              <TableHead className="text-gray-400">TOKEN</TableHead>
              <TableHead className="text-gray-400">PRICE</TableHead>
              <TableHead className="text-gray-400">AGE</TableHead>
              <TableHead className="text-gray-400">TXNS</TableHead>
              <TableHead className="text-gray-400">VOLUME</TableHead>
              <TableHead className="text-gray-400">MAKERS</TableHead>
              <TableHead className="text-gray-400">5M</TableHead>
              <TableHead className="text-gray-400">1H</TableHead>
              <TableHead className="text-gray-400">6H</TableHead>
              <TableHead className="text-gray-400">24H</TableHead>
              <TableHead className="text-gray-400">LIQUIDITY</TableHead>
              <TableHead className="text-gray-400">MCAP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((token) => (
              <TableRow 
                key={`${token.symbol}-${token.rank}`}
                className="hover:bg-[#1A1F2C] cursor-pointer border-b border-gray-800"
                onClick={() => navigate(`/token/${token.symbol}`)}
              >
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">#{token.rank}</span>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="text-orange-500 font-medium">{token.symbol}</span>
                        <span className="text-gray-500">/{token.chain}</span>
                        <span className="text-white">{token.name}</span>
                        <div className="flex items-center space-x-1">
                          <Zap size={14} className="text-yellow-500" />
                          <span className="text-yellow-500">{token.power}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatPrice(token.price)}</TableCell>
                <TableCell>{token.age}</TableCell>
                <TableCell>{token.txns.toLocaleString()}</TableCell>
                <TableCell>{formatNumber(token.volume)}</TableCell>
                <TableCell>{token.makers.toLocaleString()}</TableCell>
                <TableCell>{formatPercentage(token.changes["5m"])}</TableCell>
                <TableCell>{formatPercentage(token.changes["1h"])}</TableCell>
                <TableCell>{formatPercentage(token.changes["6h"])}</TableCell>
                <TableCell>{formatPercentage(token.changes["24h"])}</TableCell>
                <TableCell>{formatNumber(token.liquidity)}</TableCell>
                <TableCell>{formatNumber(token.mcap)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};