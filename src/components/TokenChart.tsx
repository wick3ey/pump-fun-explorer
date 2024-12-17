import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  Line
} from "recharts";

export const TokenChart = () => {
  const [timeframe, setTimeframe] = useState("1m");

  // Mock candlestick data - replace with real data
  const data = [
    { time: "01:00", open: 0.00000095, close: 0.00000097, high: 0.00000098, low: 0.00000094, volume: 24000 },
    { time: "12:06", open: 0.00000097, close: 0.00000099, high: 0.000001, low: 0.00000096, volume: 28000 },
    { time: "13:00", open: 0.00000099, close: 0.00000096, high: 0.000001, low: 0.00000095, volume: 21000 },
    { time: "14:00", open: 0.00000096, close: 0.00000098, high: 0.00000099, low: 0.00000095, volume: 23000 },
    { time: "15:00", open: 0.00000098, close: 0.00000099, high: 0.000001, low: 0.00000097, volume: 31000 },
  ].map(item => ({
    ...item,
    color: item.close >= item.open ? "#22c55e" : "#ef4444",
    wickHeight: item.high - item.low,
    bodyHeight: Math.abs(item.close - item.open),
    bodyStart: Math.min(item.open, item.close),
    bodyEnd: Math.max(item.open, item.close),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentChange = ((data.close - data.open) / data.open * 100).toFixed(2);
      const sign = percentChange >= 0 ? '+' : '';

      return (
        <div className="bg-[#1A1F2C] p-3 border border-[#2A2F3C] rounded-md text-xs space-y-1">
          <div className="text-[#666] font-medium">PENGU · 1 · Pump</div>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="text-[#666]">O</div>
            <div className="text-[#22c55e] font-mono">{data.open.toFixed(12)}</div>
            <div className="text-[#666]">H</div>
            <div className="text-[#22c55e] font-mono">{data.high.toFixed(12)}</div>
            <div className="text-[#666]">L</div>
            <div className="text-[#ef4444] font-mono">{data.low.toFixed(12)}</div>
            <div className="text-[#666]">C</div>
            <div className="text-[#ef4444] font-mono">{data.close.toFixed(12)}</div>
            <div className="text-[#666]">Change</div>
            <div className={`font-mono ${percentChange >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
              {sign}{percentChange}%
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-[#13141F] border-[#2A2F3C]">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">PENGU/SOL</h2>
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
              <SelectItem value="1d">1d</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#2A2F3C" 
                vertical={false}
              />
              <XAxis 
                dataKey="time" 
                stroke="#666" 
                axisLine={{ stroke: '#2A2F3C' }}
                tickLine={{ stroke: '#2A2F3C' }}
              />
              <YAxis 
                stroke="#666" 
                orientation="right"
                axisLine={{ stroke: '#2A2F3C' }}
                tickLine={{ stroke: '#2A2F3C' }}
                tickFormatter={(value) => value.toFixed(12)}
                domain={['dataMin', 'dataMax']}
                yAxisId="price"
              />
              <YAxis
                stroke="#666"
                orientation="left"
                axisLine={{ stroke: '#2A2F3C' }}
                tickLine={{ stroke: '#2A2F3C' }}
                domain={['dataMin', 'dataMax']}
                yAxisId="volume"
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Volume bars */}
              <Bar
                dataKey="volume"
                fill="#3B82F6"
                opacity={0.3}
                yAxisId="volume"
              />

              {/* Candlestick wicks */}
              <Line
                type="monotone"
                dataKey="high"
                stroke={(props: any) => props.color}
                dot={false}
                yAxisId="price"
              />
              <Line
                type="monotone"
                dataKey="low"
                stroke={(props: any) => props.color}
                dot={false}
                yAxisId="price"
              />

              {/* Candlestick bodies */}
              <Bar
                dataKey="bodyHeight"
                fill={(props: any) => props.color}
                stroke={(props: any) => props.color}
                yAxisId="price"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};