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
  ReferenceLine
} from "recharts";

export const TokenChart = () => {
  const [timeframe, setTimeframe] = useState("24h");

  // Mock candlestick data - replace with real data
  const data = [
    { time: "01:00", open: 0.00000095, close: 0.00000097, high: 0.00000098, low: 0.00000094, volume: 24000 },
    { time: "12:06", open: 0.00000097, close: 0.00000099, high: 0.000001, low: 0.00000096, volume: 28000 },
    { time: "13:00", open: 0.00000099, close: 0.00000096, high: 0.000001, low: 0.00000095, volume: 21000 },
    { time: "14:00", open: 0.00000096, close: 0.00000098, high: 0.00000099, low: 0.00000095, volume: 23000 },
    { time: "15:00", open: 0.00000098, close: 0.00000099, high: 0.000001, low: 0.00000097, volume: 31000 },
  ].map(item => ({
    ...item,
    isPositive: item.close >= item.open,
    bodyHeight: Math.abs(item.close - item.open),
    wickHeight: item.high - item.low,
    centerPoint: (item.open + item.close) / 2,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#1A1F2C] p-2 border border-[#2A2F3C] rounded-md text-xs">
          <p className="text-white">Time: {data.time}</p>
          <p className="text-[#22c55e]">O: {data.open.toFixed(12)}</p>
          <p className="text-[#22c55e]">H: {data.high.toFixed(12)}</p>
          <p className="text-[#ef4444]">L: {data.low.toFixed(12)}</p>
          <p className="text-[#ef4444]">C: {data.close.toFixed(12)}</p>
          <p className="text-[#3B82F6]">Vol: {data.volume}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-[#1A1F2C] border-[#2A2F3C]">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">PENGU/SOL</h2>
            <p className="text-sm text-gray-400">Price Chart</p>
          </div>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px] bg-[#1A1F2C] border-[#2A2F3C] text-white">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1H</SelectItem>
              <SelectItem value="24h">24H</SelectItem>
              <SelectItem value="7d">7D</SelectItem>
              <SelectItem value="30d">30D</SelectItem>
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

              {/* Candlestick bodies */}
              <Bar
                dataKey="bodyHeight"
                fill="#ef4444"
                stroke="#ef4444"
                fillOpacity={1}
                strokeWidth={1}
                stackId="stack"
                yAxisId="price"
              />

              {/* Candlestick wicks */}
              <ReferenceLine
                stroke="#22c55e"
                segment={[
                  { x: 100, y: 200 },
                  { x: 100, y: 400 }
                ]}
                yAxisId="price"
              />

              {/* Price area */}
              <Area
                type="monotone"
                dataKey="close"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.1}
                yAxisId="price"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};