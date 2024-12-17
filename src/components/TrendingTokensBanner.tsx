import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Crown, Zap, Timer } from "lucide-react";

interface TrendingToken {
  rank: number;
  symbol: string;
  name: string;
  percentageGain: number;
  marketCap: number;
  timeFrame: string;
}

export const TrendingTokensBanner = () => {
  const navigate = useNavigate();

  const trendingTokens: TrendingToken[] = [
    { rank: 1, symbol: "PENGU", name: "Pengu", percentageGain: 468, marketCap: 5000, timeFrame: "2h" },
    { rank: 3, symbol: "FLOSS", name: "Floss", percentageGain: 74, marketCap: 3000, timeFrame: "16h" },
    { rank: 4, symbol: "DOGE", name: "Doge", percentageGain: 156, marketCap: 4500, timeFrame: "4h" },
    { rank: 5, symbol: "SHIB", name: "Shiba Inu", percentageGain: 89, marketCap: 3500, timeFrame: "8h" },
  ];

  const handleClick = (symbol: string) => {
    navigate(`/token/${symbol}`);
  };

  return (
    <div className="w-full bg-[#13141F] border-b border-gray-800">
      <div className="overflow-hidden">
        <Carousel
          opts={{
            align: "start",
            loop: true,
            skipSnaps: true,
            dragFree: true,
          }}
          className="w-full cursor-pointer"
        >
          <CarouselContent className="animate-scroll">
            {[...trendingTokens, ...trendingTokens].map((token, index) => (
              <CarouselItem 
                key={index} 
                className="basis-auto pl-8 py-2"
                onClick={() => handleClick(token.symbol)}
              >
                <div className="flex items-center space-x-2 text-sm whitespace-nowrap">
                  <span className="text-gray-500">#{token.rank}</span>
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <div className="flex items-center space-x-2">
                    <span className="text-orange-500 font-bold">{token.symbol}</span>
                    <Zap className="h-4 w-4 text-orange-500" />
                    <span className="text-orange-500">{token.marketCap}</span>
                    <span className="text-green-500">+{token.percentageGain}%</span>
                    <div className="flex items-center text-gray-500">
                      <Timer className="h-3 w-3 mr-1" />
                      <span>{token.timeFrame}</span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};