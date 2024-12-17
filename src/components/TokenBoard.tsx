import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Crown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export const TokenBoard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("mcap");

  // Mockdata för demonstration
  const tokens = [
    {
      name: "PEPE",
      symbol: "PEPE",
      price: 0.00000123,
      marketCap: 55000, // Over 50k for King of the Hill
      change24h: 15.5,
      volume24h: 987654,
      holders: 1500,
      createdAt: "2024-02-20",
    },
    {
      name: "DOGE",
      symbol: "DOGE",
      price: 0.00000456,
      marketCap: 2345678,
      change24h: -5.2,
      volume24h: 876543,
      holders: 1200,
      createdAt: "2024-02-19",
    },
  ];

  const filteredTokens = tokens
    .filter(token => 
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "mcap":
          return b.marketCap - a.marketCap;
        case "holders":
          return b.holders - a.holders;
        case "time":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const kingOfTheHill = tokens.find(token => token.marketCap >= 50000);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trading Board</h1>
        <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
          Live Updates
        </Badge>
      </div>

      {kingOfTheHill && (
        <Card className="bg-gradient-to-r from-orange-500 to-purple-600 p-1">
          <CardContent className="bg-[#1A1F2C] p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="text-yellow-400 h-6 w-6" />
                <div>
                  <h3 className="font-bold text-lg">King of the Hill</h3>
                  <p className="text-sm text-gray-400">{kingOfTheHill.name} ({kingOfTheHill.symbol})</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">${kingOfTheHill.marketCap.toLocaleString()}</p>
                <p className="text-sm text-gray-400">Market Cap</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#1A1F2C] border-[#2A2F3C]"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] bg-[#1A1F2C] border-[#2A2F3C]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mcap">Market Cap</SelectItem>
            <SelectItem value="holders">Holders</SelectItem>
            <SelectItem value="time">Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-[#1A1F2C] border-[#2A2F3C]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-[#2A2F3C]/50 border-[#2A2F3C]">
                <TableHead className="text-purple-400">Token</TableHead>
                <TableHead className="text-purple-400">Price</TableHead>
                <TableHead className="text-purple-400">24h Change</TableHead>
                <TableHead className="text-purple-400">Market Cap</TableHead>
                <TableHead className="text-purple-400">Volume (24h)</TableHead>
                <TableHead className="text-purple-400">Holders</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTokens.map((token) => (
                <TableRow 
                  key={token.symbol} 
                  className="hover:bg-[#2A2F3C]/50 border-[#2A2F3C] cursor-pointer transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                      <div>
                        <div className="font-bold">{token.name}</div>
                        <div className="text-sm text-gray-400">{token.symbol}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${token.price.toFixed(8)}</TableCell>
                  <TableCell>
                    <div className={`flex items-center space-x-1 ${
                      token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {token.change24h >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                      <span>{Math.abs(token.change24h)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>${token.marketCap.toLocaleString()}</TableCell>
                  <TableCell>${token.volume24h.toLocaleString()}</TableCell>
                  <TableCell>{token.holders.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};