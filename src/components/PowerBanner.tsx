import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PowerToken {
  symbol: string;
  name: string;
  power: number;
}

export const PowerBanner = () => {
  // Mock data - in a real app this would come from your API
  const powerTokens: PowerToken[] = [
    { symbol: "WIF", name: "Friend.tech", power: 1000 },
    { symbol: "BONK", name: "Bonk", power: 500 },
    { symbol: "MYRO", name: "Myro", power: 100 },
  ];

  const getTickerColor = (power: number) => {
    switch (power) {
      case 1000:
        return "text-yellow-500 font-bold"; // Gold for 1000 POWER
      case 500:
        return "text-green-500 font-bold"; // Green for 500 POWER
      default:
        return "text-purple-500 font-bold"; // Default purple for 100 POWER
    }
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
                  <div className="flex items-center space-x-2">
                    <span className={cn(getTickerColor(token.power))}>{token.symbol}</span>
                    <Zap className="h-4 w-4 text-orange-500" />
                    <span className="text-orange-500">{token.power} POWER</span>
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