import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export const TokenChart = () => {
  const [timeframe, setTimeframe] = useState("24h");

  // Mock candlestick data - replace with real data
  const data = [
    { time: "00:00", open: 4000, close: 3000, high: 4100, low: 2900, volume: 2400 },
    { time: "03:00", open: 3000, close: 2000, high: 3200, low: 1900, volume: 2100 },
    { time: "06:00", open: 2000, close: 2780, high: 2800, low: 1950, volume: 2800 },
    { time: "09:00", open: 2780, close: 1890, high: 2800, low: 1800, volume: 2100 },
    { time: "12:00", open: 1890, close: 2390, high: 2500, low: 1850, volume: 2300 },
    { time: "15:00", open: 2390, close: 3490, high: 3600, low: 2300, volume: 3100 },
  ];

  return (
    <Card className="bg-[#1A1F2C] border-[#2A2F3C]">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Price Chart</h2>
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
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3C" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1F2C',
                  border: '1px solid #2A2F3C',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar
                dataKey="volume"
                fill="#3B82F6"
                opacity={0.3}
              />
              <Bar
                dataKey={d => d.open > d.close ? d.open - d.close : d.close - d.open}
                fill={d => d.open > d.close ? '#ef4444' : '#22c55e'}
                stroke={d => d.open > d.close ? '#dc2626' : '#16a34a'}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};