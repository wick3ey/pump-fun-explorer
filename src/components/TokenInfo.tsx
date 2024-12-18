import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Crown, Twitter, Globe, MessageCircle, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useTokenStore } from "@/stores/tokenStore";
import { useSolanaToken } from "@/hooks/useSolanaToken";

interface TokenInfoProps {
  symbol: string;
}

export const TokenInfo = ({ symbol }: TokenInfoProps) => {
  const [amount, setAmount] = useState("");
  const { toast } = useToast();
  const getGraduationProgress = useTokenStore(state => state.getGraduationProgress);
  const graduationProgress = getGraduationProgress(symbol);
  
  const {
    price,
    marketCap,
    isGraduated,
    updateTokenMetrics,
  } = useSolanaToken();

  const handleBuyToken = async () => {
    try {
      const buyAmount = parseFloat(amount);
      if (isNaN(buyAmount) || buyAmount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid amount to buy",
          variant: "destructive",
        });
        return;
      }

      // Here you would integrate with your Solana smart contract
      // For now, we'll just simulate the purchase
      updateTokenMetrics(buyAmount);
      
      toast({
        title: "Purchase Successful",
        description: `Successfully bought ${buyAmount} ${symbol}`,
      });
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Failed to complete the purchase",
        variant: "destructive",
      });
    }
  };

  const handleCopyAddress = () => {
    const contractAddress = `${symbol}...vqs6`;
    navigator.clipboard.writeText(contractAddress);
    toast({
      title: "Address Copied",
      description: "Contract address has been copied to clipboard",
    });
  };

  return (
    <Card className="bg-[#1A1F2C] border-[#2A2F3C]">
      <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white">{symbol}</h2>
            <p className="text-sm text-gray-400">Trading on Solana 🚀</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-2">Graduation Progress</p>
            <Progress value={graduationProgress} className="h-2" />
            <p className="text-xs text-gray-400 mt-1">
              {!isGraduated 
                ? `${graduationProgress.toFixed(1)}% to graduation ($90,000 market cap)`
                : "Token has graduated! 🎓 Distribution to Raydium in progress..."
              }
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-400">Amount (SOL)</label>
              <div className="text-sm text-gray-400">
                Price: {price.toFixed(6)} SOL
              </div>
            </div>
            <Input 
              type="number" 
              placeholder="0.00" 
              className="bg-[#1A1F2C] border-[#2A2F3C] text-white mt-2" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-[#2A2F3C] text-white hover:bg-[#3A3F4C] border-[#3A3F4C]"
              onClick={() => setAmount("0.1")}
            >
              0.1 SOL
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-[#2A2F3C] text-white hover:bg-[#3A3F4C] border-[#3A3F4C]"
              onClick={() => setAmount("0.5")}
            >
              0.5 SOL
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-[#2A2F3C] text-white hover:bg-[#3A3F4C] border-[#3A3F4C]"
              onClick={() => setAmount("1")}
            >
              1 SOL
            </Button>
          </div>

          <Button 
            className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black"
            onClick={handleBuyToken}
            disabled={isGraduated}
          >
            {isGraduated ? 'Token Graduated - Trading on Raydium' : 'Buy Token'}
          </Button>
        </div>

        <div className="flex justify-center space-x-4 pt-4 border-t border-[#2A2F3C]">
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
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Contract Address:</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyAddress}
              className="text-gray-400 hover:text-white"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm font-mono text-white break-all">{symbol}...vqs6</p>
        </div>
      </CardContent>
    </Card>
  );
};
