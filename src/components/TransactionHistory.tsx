import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const TransactionHistory = () => {
  // Mock data - replace with real data
  const transactions = [
    {
      account: "CPFh8N",
      type: "sell",
      sol: 0.304,
      amount: "3.65m",
      time: "2s ago",
      hash: "3VxTN3"
    },
    {
      account: "8HZk3A",
      type: "buy",
      sol: 0.199,
      amount: "2.38m",
      time: "42s ago",
      hash: "39aEWx"
    },
  ];

  return (
    <Card className="bg-[#1A1F2C] border-[#2A2F3C]">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-[#2A2F3C]/50 border-[#2A2F3C]">
                <TableHead className="text-purple-400">Account</TableHead>
                <TableHead className="text-purple-400">Type</TableHead>
                <TableHead className="text-purple-400">SOL</TableHead>
                <TableHead className="text-purple-400">PENGU</TableHead>
                <TableHead className="text-purple-400">Time</TableHead>
                <TableHead className="text-purple-400">Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow 
                  key={tx.hash}
                  className="hover:bg-[#2A2F3C]/50 border-[#2A2F3C]"
                >
                  <TableCell className="font-medium">{tx.account}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={tx.type === 'buy' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}
                    >
                      {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{tx.sol}</TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>{tx.time}</TableCell>
                  <TableCell className="font-mono">{tx.hash}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};