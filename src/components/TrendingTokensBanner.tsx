import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TrendingToken {
  symbol: string;
  name: string;
  percentageGain: number;
  marketCap: number;
}

export const TrendingTokensBanner = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock data - in a real app, this would come from your API
  const trendingTokens: TrendingToken[] = [
    { symbol: "PENGU", name: "Pudgy Penguins", percentageGain: 156.2, marketCap: 93374 },
    { symbol: "DOGE", name: "Dogecoin", percentageGain: 89.5, marketCap: 75000 },
    { symbol: "PEPE", name: "Pepe", percentageGain: 234.7, marketCap: 65000 },
    // Add more mock data as needed
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === trendingTokens.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [trendingTokens.length]);

  const handleClick = (symbol: string) => {
    navigate(`/token/${symbol}`);
  };

  return (
    <Card 
      className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 p-3 mb-6 cursor-pointer overflow-hidden"
      onClick={() => handleClick(trendingTokens[currentIndex].symbol)}
    >
      <div className="flex items-center justify-between animate-slide-left">
        <div className="flex items-center space-x-3">
          <Crown className="text-yellow-500 h-6 w-6" />
          <div>
            <h3 className="font-bold text-white">
              {trendingTokens[currentIndex].name} ({trendingTokens[currentIndex].symbol})
            </h3>
            <p className="text-sm text-gray-400">
              King of the Hill Token
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-green-400">
            +{trendingTokens[currentIndex].percentageGain.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-400">
            ${trendingTokens[currentIndex].marketCap.toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
};