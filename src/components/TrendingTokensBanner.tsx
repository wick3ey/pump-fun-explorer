import { useNavigate } from "react-router-dom";
import { Crown, Zap, TrendingUp } from "lucide-react";

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
    { rank: 1, symbol: "PENGU", power: 5000, percentageGain: 468, timeFrame: "2h" },
    { rank: 2, symbol: "PEPE", power: 5000, percentageGain: 214, timeFrame: "2h" },
    { rank: 3, symbol: "FLOSS", power: 3000, percentageGain: 74, timeFrame: "16h" },
    { rank: 4, symbol: "DOGE", power: 4500, percentageGain: 156, timeFrame: "4h" },
    { rank: 5, symbol: "SHIB", power: 3500, percentageGain: 89, timeFrame: "8h" },
  ];

  const handleClick = (symbol: string) => {
    navigate(`/token/${symbol}`);
  };

  return (
    <div className="w-full bg-[#13141F] border-b border-gray-800 overflow-hidden">
      <div className="flex whitespace-nowrap animate-scroll">
        <div className="flex min-w-full">
          {[...trendingTokens, ...trendingTokens].map((token, index) => (
            <div
              key={index}
              onClick={() => handleClick(token.symbol)}
              className="inline-flex items-center space-x-2 px-8 py-2 cursor-pointer hover:bg-gray-800/50 transition-colors"
            >
              <span className="text-gray-500">#{token.rank}</span>
              {token.rank === 1 && <Crown className="h-4 w-4 text-yellow-500" />}
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-orange-500 font-bold">{token.symbol}</span>
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-orange-500">{token.power}</span>
              <span className="text-green-500">+{token.percentageGain}%</span>
              <span className="text-gray-500">{token.timeFrame}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};