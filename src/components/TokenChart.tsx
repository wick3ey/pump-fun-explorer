import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import TradingViewWidget from "./TradingViewWidget";

interface TokenChartProps {
  symbol: string;
}

export const TokenChart = ({ symbol }: TokenChartProps) => {
  const [timeframe, setTimeframe] = useState("1D");

  return (
    <Card className="bg-[#13141F] border-[#2A2F3C]">
      <CardContent className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-xl font-bold text-white">{symbol}/USDT</h2>
            <div className="text-[#22c55e] text-sm">+9.45%</div>
          </div>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[80px] bg-[#13141F] border-[#2A2F3C] text-white h-8">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent className="bg-[#13141F] border-[#2A2F3C]">
              <SelectItem value="1m">1m</SelectItem>
              <SelectItem value="5m">5m</SelectItem>
              <SelectItem value="15m">15m</SelectItem>
              <SelectItem value="1h">1h</SelectItem>
              <SelectItem value="4h">4h</SelectItem>
              <SelectItem value="1D">1D</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-[300px] md:h-[400px]">
          <TradingViewWidget symbol={symbol} />
        </div>
      </CardContent>
    </Card>
  );
};