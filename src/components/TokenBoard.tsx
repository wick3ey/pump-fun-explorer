import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";

export const TokenBoard = () => {
  // Mockdata för demonstration
  const tokens = [
    {
      name: "PEPE",
      symbol: "PEPE",
      price: 0.00000123,
      marketCap: 1234567,
      change24h: 15.5,
      volume24h: 987654,
    },
    {
      name: "DOGE",
      symbol: "DOGE",
      price: 0.00000456,
      marketCap: 2345678,
      change24h: -5.2,
      volume24h: 876543,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trading Board</h1>
        <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
          Live Updates
        </Badge>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.map((token) => (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};