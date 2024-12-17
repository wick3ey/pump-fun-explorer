import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Filter, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const TokenCard = ({ token }: { token: any }) => {
  const { toast } = useToast();
  const progressToGraduation = token.marketCap / 96000 * 100;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(token.contractAddress);
    toast({
      title: "Address copied",
      description: "Contract address has been copied to clipboard",
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 3)}...${address.slice(-3)}`;
  };

  return (
    <Card className="bg-[#1E2028] p-4 mb-4 hover:bg-[#2A2F3C] transition-colors">
      <div className="flex items-center justify-between mb-2">
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
      
      {token.section === 'graduating' && (
        <div className="mt-2">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-400">Progress to graduation</span>
            <span className="text-sm text-gray-400">{progressToGraduation.toFixed(1)}%</span>
          </div>
          <Progress value={progressToGraduation} className="h-2" />
        </div>
      )}
      
      <div className="mt-2 flex items-center space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">
            {truncateAddress(token.contractAddress)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={handleCopyAddress}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-gray-400">DH: {token.devHolding}%</span>
        {token.communityTakeover && (
          <span className="text-yellow-500">CTO</span>
        )}
      </div>
    </Card>
  );
};

const Memescope = () => {
  const mockTokens = {
    new: [
      { 
        symbol: "SMILE", 
        name: "Smile Token", 
        change: 2.5, 
        marketCap: "6.5K",
        contractAddress: "0x123abc789def",
        devHolding: 5,
        communityTakeover: false
      },
      { 
        symbol: "PENGU", 
        name: "PenguPhantom", 
        change: 7.0, 
        marketCap: "7K",
        contractAddress: "0x456def123abc",
        devHolding: 3,
        communityTakeover: false
      },
    ],
    graduating: [
      { 
        symbol: "PEPU", 
        name: "Pepe Unchained", 
        change: 26, 
        marketCap: "89K",
        contractAddress: "0x789ghi456jkl",
        devHolding: 0,
        communityTakeover: true
      },
      { 
        symbol: "RT", 
        name: "Rugtrust Solana", 
        change: 25, 
        marketCap: "91K",
        contractAddress: "0x012mno345pqr",
        devHolding: 2,
        communityTakeover: false
      },
    ],
    graduated: [
      { 
        symbol: "BYTEDAN", 
        name: "ByteDance", 
        change: 24, 
        marketCap: "101K",
        contractAddress: "0x345stu678vwx",
        devHolding: 1,
        communityTakeover: true
      },
      { 
        symbol: "MERO", 
        name: "Mero Mero", 
        change: 22, 
        marketCap: "117K",
        contractAddress: "0x678yza901bcd",
        devHolding: 4,
        communityTakeover: false
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#13141F] text-white">
      <main className="container mx-auto px-4 pt-28 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">MEMESCOPE</h1>
          <p className="text-gray-400">
            Customized real-time feeds of new tokens matching your selected preset filters.
          </p>
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
              <TokenCard key={index} token={{ ...token, section: 'new' }} />
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
              <TokenCard key={index} token={{ ...token, section: 'graduating' }} />
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
              <TokenCard key={index} token={{ ...token, section: 'graduated' }} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Memescope;
