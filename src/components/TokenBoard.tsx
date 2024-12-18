import { Card } from "@/components/ui/card";
import { TrendingFilter } from "./TrendingFilter";

interface TokenBoardProps {
  searchQuery?: string;
}

export const TokenBoard = ({ searchQuery = "" }: TokenBoardProps) => {
  return (
    <div className="space-y-6">
      <TrendingFilter 
        selectedTimeframe="1h"
        onTimeframeChange={() => {}}
        sortBy="newest"
        onSortChange={() => {}}
      />
      
      <Card className="bg-[#1A1F2C] border-[#2A2F3C] p-6">
        <div className="text-center text-gray-400">
          No tokens available
        </div>
      </Card>
    </div>
  );
};