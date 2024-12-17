import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Zap, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PowerToken {
  symbol: string;
  name: string;
  power: number;
  rank?: number;
  percentage?: number;
  timeFrame?: string;
}

export const PowerBanner = () => {
  const powerTokens: PowerToken[] = [
    { symbol: "MYRO", name: "Myro", power: 100 },
    { symbol: "WIF", name: "Friend.tech", power: 1000 },
    { symbol: "BONK", name: "Bonk", power: 500 },
    { symbol: "MYRO", name: "Myro", power: 100 },
    { rank: 1, symbol: "PENGU", name: "Pengu", power: 5000, percentage: 468, timeFrame: "2h" },
    { rank: 3, symbol: "FLOSS", name: "Floss", power: 3000, percentage: 74, timeFrame: "16h" },
    { rank: 4, symbol: "DOGE", name: "Doge", power: 4500, percentage: 156, timeFrame: "4h" },
    { rank: 5, symbol: "SHIB", name: "Shiba Inu", power: 3500, percentage: 89, timeFrame: "8h" }
  ];

  const getTickerColor = (power: number) => {
    if (power >= 1000) return "text-yellow-500"; // Gold for 1000+ POWER
    if (power >= 500) return "text-green-500"; // Green for 500+ POWER
    return "text-purple-500"; // Purple for others
  };

  return (
    <div className="w-full bg-[#1A1F2C] border-b border-gray-800">
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
            {[...powerTokens, ...powerTokens].map((token, index) => (
              <CarouselItem key={index} className="basis-auto pl-8 py-2">
                <div className="flex items-center space-x-2 text-sm whitespace-nowrap">
                  {token.rank && (
                    <>
                      <span className="text-gray-500">#{token.rank}</span>
                      <Crown className="h-4 w-4 text-yellow-500" />
                    </>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className={cn(getTickerColor(token.power), "font-bold")}>{token.symbol}</span>
                    <Zap className="h-4 w-4 text-orange-500" />
                    <span className="text-orange-500">{token.power} POWER</span>
                    {token.percentage && (
                      <>
                        <span className="text-green-500">+{token.percentage}%</span>
                        <span className="text-gray-500">{token.timeFrame}</span>
                      </>
                    )}
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