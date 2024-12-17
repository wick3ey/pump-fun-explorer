import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TrendingFilterProps {
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const TrendingFilter = ({ 
  selectedTimeframe, 
  onTimeframeChange,
  sortBy,
  onSortChange
}: TrendingFilterProps) => {
  const timeframes = [
    { label: "5M", value: "5m" },
    { label: "1H", value: "1h" },
    { label: "6H", value: "6h" },
    { label: "24H", value: "24h" },
  ];

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-[#1E2436] rounded-full p-1.5">
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

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px] bg-[#1E2436] border-none">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="marketcap_high">Highest Market Cap</SelectItem>
            <SelectItem value="marketcap_low">Lowest Market Cap</SelectItem>
            <SelectItem value="trending">Most Transactions</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};