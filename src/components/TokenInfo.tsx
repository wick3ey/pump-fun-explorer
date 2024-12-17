import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Crown, Twitter, Globe, MessageCircle } from "lucide-react";

export const TokenInfo = () => {
  return (
    <Card className="bg-[#1A1F2C] border-[#2A2F3C]">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
          <div>
            <h2 className="text-xl font-bold">PENGU</h2>
            <p className="text-gray-400">Spreading good vibes across the meta 🐧</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Amount (SOL)</label>
            <Input 
              type="number" 
              placeholder="0.00" 
              className="bg-[#1A1F2C] border-[#2A2F3C]" 
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">0.1 SOL</Button>
            <Button variant="outline" size="sm" className="flex-1">0.5 SOL</Button>
            <Button variant="outline" size="sm" className="flex-1">1 SOL</Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Slippage</label>
            <Slider defaultValue={[1]} max={5} step={0.1} />
          </div>

          <Button className="w-full bg-purple-600 hover:bg-purple-700">Place Trade</Button>
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
          <Button variant="ghost" size="sm">
            <Twitter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Globe className="h-4 w-4" />
          </Button>
        </div>

        <div className="pt-4 border-t border-[#2A2F3C]">
          <p className="text-sm text-gray-400">Contract Address:</p>
          <p className="text-sm font-mono">PENGU...vqs6</p>
        </div>
      </CardContent>
    </Card>
  );
};