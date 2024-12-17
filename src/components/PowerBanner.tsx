import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PowerToken {
  symbol: string;
  power: number;
}

export const PowerBanner = () => {
  const powerTokens: PowerToken[] = [
    { symbol: "MYRO", power: 100 },
    { symbol: "WIF", power: 1000 },
    { symbol: "BONK", power: 500 },
    { symbol: "MYRO", power: 100 },
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
                  <span className={cn(getTickerColor(token.power), "font-bold")}>{token.symbol}</span>
                  <Zap className="h-4 w-4 text-orange-500" />
                  <span className="text-orange-500">{token.power} POWER</span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};