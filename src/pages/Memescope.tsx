import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Wallet } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TokenCard = ({ token }: { token: any }) => (
  <Card className="bg-[#1E2028] p-4 mb-4 hover:bg-[#2A2F3C] transition-colors">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
        <div>
          <div className="font-medium text-white">{token.symbol}</div>
          <div className="text-sm text-gray-400">{token.name}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-green-400">+{token.change}%</div>
        <div className="text-sm text-gray-400">MC ${token.marketCap}</div>
      </div>
    </div>
  </Card>
);

const Memescope = () => {
  const mockTokens = {
    new: [
      { symbol: "SMILE", name: "Smile Token", change: 2.5, marketCap: "6.5K" },
      { symbol: "PENGU", name: "PenguPhantom", change: 7.0, marketCap: "7K" },
    ],
    graduating: [
      { symbol: "PEPU", name: "Pepe Unchained", change: 26, marketCap: "89K" },
      { symbol: "RT", name: "Rugtrust Solana", change: 25, marketCap: "91K" },
    ],
    graduated: [
      { symbol: "BYTEDAN", name: "ByteDance", change: 24, marketCap: "101K" },
      { symbol: "MERO", name: "Mero Mero", change: 22, marketCap: "117K" },
    ],
  };

  return (
    <div className="min-h-screen bg-[#13141F] text-white">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">MEMESCOPE</h1>
          <p className="text-gray-400">
            Customized real-time feeds of new tokens matching your selected preset filters.
          </p>
        </div>

        <div className="flex items-center space-x-4 mb-8">
          <Button variant="outline" className="bg-[#1E2028] text-white">
            Quick Buy
          </Button>
          <Button variant="outline" className="bg-[#1E2028] text-white">
            0.01
          </Button>
          <Button variant="outline" className="bg-[#1E2028] text-white">
            Presets
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" className="bg-[#1E2028] text-white">S1</Button>
            <Button variant="outline" className="bg-[#1E2028] text-white">S2</Button>
            <Button variant="outline" className="bg-[#1E2028] text-white">S3</Button>
          </div>
          <Select>
            <SelectTrigger className="w-[200px] bg-[#1E2028] border-[#2A2F3C]">
              <SelectValue placeholder="Wallet 1" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wallet1">Wallet 1</SelectItem>
              <SelectItem value="wallet2">Wallet 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">NEWLY CREATED</h2>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter 6
              </Button>
            </div>
            {mockTokens.new.map((token, index) => (
              <TokenCard key={index} token={token} />
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">ABOUT TO GRADUATE</h2>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter 2
              </Button>
            </div>
            {mockTokens.graduating.map((token, index) => (
              <TokenCard key={index} token={token} />
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">GRADUATED</h2>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter 2
              </Button>
            </div>
            {mockTokens.graduated.map((token, index) => (
              <TokenCard key={index} token={token} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Memescope;