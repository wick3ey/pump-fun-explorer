import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Crown, Twitter, Globe, MessageCircle } from "lucide-react";
import { useState } from "react";

export const TokenInfo = () => {
  const [slippage, setSlippage] = useState(1);
  const [isBuying, setIsBuying] = useState(true);
  const [amount, setAmount] = useState("");

  // Mock wallet balance - in a real app, this would come from your wallet connection
  const mockBalance = 10.5; // SOL

  const handleMaxClick = () => {
    if (isBuying) {
      setAmount(mockBalance.toString());
    } else {
      // Mock token balance - in a real app, this would come from your wallet
      setAmount("1000000"); // PENGU amount
    }
  };

  return (
    <Card className="bg-[#1A1F2C] border-[#2A2F3C]">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
          <div>
            <h2 className="text-xl font-bold text-white">PENGU</h2>
            <p className="text-gray-400">Spreading good vibes across the meta 🐧</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <Button 
            className={`flex-1 ${isBuying ? 'bg-[#22c55e] hover:bg-[#16a34a] text-black' : 'bg-transparent border border-[#22c55e] text-[#22c55e]'}`}
            onClick={() => setIsBuying(true)}
          >
            Buy
          </Button>
          <Button 
            className={`flex-1 ${!isBuying ? 'bg-[#ea384c] hover:bg-[#dc2626] text-white' : 'bg-transparent border border-[#ea384c] text-[#ea384c]'}`}
            onClick={() => setIsBuying(false)}
          >
            Sell
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-400">Amount (SOL)</label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleMaxClick}
                className="text-xs bg-[#2A2F3C] text-white hover:bg-[#3A3F4C] border-[#3A3F4C]"
              >
                Max {isBuying ? `${mockBalance} SOL` : "1M PENGU"}
              </Button>
            </div>
            <Input 
              type="number" 
              placeholder="0.00" 
              className="bg-[#1A1F2C] border-[#2A2F3C] text-white mt-2" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-[#2A2F3C] text-white hover:bg-[#3A3F4C] border-[#3A3F4C]"
              onClick={() => setAmount("0.1")}
            >
              0.1 SOL
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-[#2A2F3C] text-white hover:bg-[#3A3F4C] border-[#3A3F4C]"
              onClick={() => setAmount("0.5")}
            >
              0.5 SOL
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-[#2A2F3C] text-white hover:bg-[#3A3F4C] border-[#3A3F4C]"
              onClick={() => setAmount("1")}
            >
              1 SOL
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-400">Slippage</label>
              <span className="text-sm text-white">{slippage}%</span>
            </div>
            <Slider 
              defaultValue={[1]} 
              max={5} 
              step={0.1} 
              value={[slippage]}
              onValueChange={([value]) => setSlippage(value)}
            />
          </div>

          <Button 
            className={`w-full ${
              isBuying 
                ? 'bg-[#22c55e] hover:bg-[#16a34a] text-black' 
                : 'bg-[#ea384c] hover:bg-[#dc2626] text-white'
            }`}
          >
            {isBuying ? 'Place Buy Order' : 'Place Sell Order'}
          </Button>
        </div>

        <div className="space-y-4 pt-4 border-t border-[#2A2F3C]">
          <div>
            <p className="text-sm text-gray-400">Bonding Curve Progress</p>
            <Progress value={57} className="mt-2" />
            <p className="text-xs text-gray-400 mt-1">Graduate at $93,374 market cap</p>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <Crown className="text-yellow-500" />
              <p className="text-sm text-gray-400">King of the Hill Progress: 67%</p>
            </div>
            <Progress value={67} className="mt-2" />
          </div>
        </div>

        <div className="flex space-x-4 pt-4 border-t border-[#2A2F3C]">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Twitter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Globe className="h-4 w-4" />
          </Button>
        </div>

        <div className="pt-4 border-t border-[#2A2F3C]">
          <p className="text-sm text-gray-400">Contract Address:</p>
          <p className="text-sm font-mono text-white">PENGU...vqs6</p>
        </div>
      </CardContent>
    </Card>
  );
};