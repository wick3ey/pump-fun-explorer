import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KingOfTheHillProps {
  symbol: string;
  chain: string;
  percentageIncrease: number;
  age: string;
  marketCap: number;
  bondingCurveTarget: number;
}

export const KingOfTheHill = ({
  symbol,
  chain,
  percentageIncrease,
  age,
  marketCap,
  bondingCurveTarget,
}: KingOfTheHillProps) => {
  const percentageToTarget = ((marketCap / bondingCurveTarget) * 100).toFixed(2);

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: 'url(/lovable-uploads/68f0d645-38ab-456c-830a-fa26d4085d7a.png)' }}
      />
      <div className="relative bg-gradient-to-r from-[#1A1F2C]/90 to-[#1A1F2C]/80 p-6 rounded-lg border border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src="/lovable-uploads/6b165013-9c87-47f9-8ac0-9127b2f927e6.png"
                alt="Doge" 
                className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500"
              />
              <Crown className="h-6 w-6 text-yellow-500 absolute -top-2 -right-2" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-yellow-500 mb-1">King of the Hill</h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-300">
                  Current Leader: {symbol}/{chain} (+{percentageIncrease}%)
                </p>
                <p className="text-sm text-gray-400">Created {age} ago</p>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-400">
                    MarketCap: ${marketCap.toLocaleString()}
                  </p>
                  <span className="text-gray-600">•</span>
                  <p className="text-sm text-gray-400">
                    {percentageToTarget}% to Target (${bondingCurveTarget.toLocaleString()})
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white px-6"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};