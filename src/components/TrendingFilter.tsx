import { Button } from "@/components/ui/button";

interface TrendingFilterProps {
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

export const TrendingFilter = ({ selectedTimeframe, onTimeframeChange }: TrendingFilterProps) => {
  const timeframes = [
    { label: "5M", value: "5m" },
    { label: "1H", value: "1h" },
    { label: "6H", value: "6h" },
    { label: "24H", value: "24h" },
  ];

  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="flex items-center space-x-2 bg-[#1E2436] rounded-full p-1.5">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          Last 24 hours
        </Button>
      </div>

      <div className="flex items-center space-x-2 bg-[#1E2436] rounded-full p-1.5">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          Trending
        </Button>
        {timeframes.map((timeframe) => (
          <Button
            key={timeframe.value}
            variant={selectedTimeframe === timeframe.value ? "default" : "ghost"}
            size="sm"
            onClick={() => onTimeframeChange(timeframe.value)}
            className={selectedTimeframe === timeframe.value 
              ? "bg-blue-600 text-white hover:bg-blue-700" 
              : "text-gray-400 hover:text-white"
            }
          >
            {timeframe.label}
          </Button>
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-white"
      >
        Top
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-white"
      >
        Gainers
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-white"
      >
        New Pairs
      </Button>
    </div>
  );
};