import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export const TokenChart = () => {
  const [timeframe, setTimeframe] = useState("24h");

  // Mock data - replace with real data
  const data = [
    { time: "00:00", price: 4000 },
    { time: "03:00", price: 3000 },
    { time: "06:00", price: 2000 },
    { time: "09:00", price: 2780 },
    { time: "12:00", price: 1890 },
    { time: "15:00", price: 2390 },
    { time: "18:00", price: 3490 },
  ];

  return (
    <Card className="bg-[#1A1F2C] border-[#2A2F3C]">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Price Chart</h2>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px] bg-[#1A1F2C] border-[#2A2F3C]">
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
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3C" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1F2C',
                  border: '1px solid #2A2F3C',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};