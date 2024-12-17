import { Zap, TrendingUp } from "lucide-react";

interface PowerToken {
  symbol: string;
  power: number;
  percentageGain: number;
}

export const PowerBanner = () => {
  const powerTokens: PowerToken[] = [
    { symbol: "MYRO", power: 1200, percentageGain: 45 },
    { symbol: "WIF", power: 1000, percentageGain: 32 },
    { symbol: "BONK", power: 800, percentageGain: 28 },
    { symbol: "DOGE", power: 750, percentageGain: 15 },
  ];

  return (
    <div className="w-full bg-[#1A1F2C] border-b border-gray-800 overflow-hidden">
      <div className="flex whitespace-nowrap animate-scroll">
        <div className="flex min-w-full">
          {[...powerTokens, ...powerTokens].map((token, index) => (
            <div
              key={index}
              className="inline-flex items-center space-x-2 px-8 py-2 cursor-pointer hover:bg-gray-800/50 transition-colors"
            >
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-orange-500 font-bold">{token.symbol}</span>
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-orange-500">{token.power} POWER</span>
              <span className="text-green-500">+{token.percentageGain}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};