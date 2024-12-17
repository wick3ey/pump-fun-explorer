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
  bondingCurveTarget
}: KingOfTheHillProps) => {
  const percentageToTarget = ((marketCap / bondingCurveTarget) * 100).toFixed(2);

  return (
    <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Crown className="h-6 w-6 text-yellow-500" />
          <div>
            <h3 className="text-lg font-bold text-yellow-500">King of the Hill</h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">
                Current Leader: {symbol}/{chain} (+{percentageIncrease}%)
              </p>
              <p className="text-sm text-gray-400">Created {age} ago</p>
              <p className="text-sm text-gray-400">
                Current MarketCap: ${marketCap.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">
                {percentageToTarget}% to Bonding Curve (${bondingCurveTarget.toLocaleString()})
              </p>
            </div>
          </div>
        </div>
        <Button 
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
};