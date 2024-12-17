import { useNavigate } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Crown, Zap } from "lucide-react";

interface TrendingToken {
  rank: number;
  symbol: string;
  power: number;
  percentageGain: number;
  timeFrame: string;
}

export const TrendingTokensBanner = () => {
  const navigate = useNavigate();

  const trendingTokens: TrendingToken[] = [
    { rank: 2, symbol: "PEPE", power: 5000, percentageGain: 214, timeFrame: "2h" },
    { rank: 3, symbol: "FLOSS", power: 3000, percentageGain: 74, timeFrame: "16h" },
    { rank: 4, symbol: "DOGE", power: 4500, percentageGain: 156, timeFrame: "4h" },
    { rank: 5, symbol: "SHIB", power: 3500, percentageGain: 89, timeFrame: "8h" },
    { rank: 1, symbol: "PENGU", power: 5000, percentageGain: 468, timeFrame: "2h" },
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
                  <span className="text-orange-500 font-bold">{token.symbol}</span>
                  <Zap className="h-4 w-4 text-orange-500" />
                  <span className="text-orange-500">{token.power}</span>
                  <span className="text-green-500">+{token.percentageGain}%</span>
                  <span className="text-gray-500">{token.timeFrame}</span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};