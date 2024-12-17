import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Filter, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTokenStore } from "@/stores/tokenStore";
import { useEffect, useState } from "react";
import { TokenData } from "@/types/token";
import { Skeleton } from "@/components/ui/skeleton";

const TokenCard = ({ token }: { token: TokenData }) => {
  const { toast } = useToast();
  const progressToGraduation = (token.marketCap / 96000) * 100;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(token.contractAddress || '');
    toast({
      title: "Address copied",
      description: "Contract address has been copied to clipboard",
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 3)}...${address.slice(-3)}`;
  };

  return (
    <Card className="bg-[#1E2028] p-4 mb-4 hover:bg-[#2A2F3C] transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <img 
            src={token.image || "/placeholder.svg"} 
            alt={token.symbol}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div>
            <div className="font-medium text-white">{token.symbol}</div>
            <div className="text-sm text-gray-400">{token.name}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-green-400">+{token.power || 0}%</div>
          <div className="text-sm text-gray-400">MC ${token.marketCap?.toLocaleString()}</div>
        </div>
      </div>
      
      {token.marketCap && token.marketCap < 96000 && (
        <div className="mt-2">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-400">Progress to graduation</span>
            <span className="text-sm text-gray-400">{progressToGraduation.toFixed(1)}%</span>
          </div>
          <Progress value={progressToGraduation} className="h-2" />
        </div>
      )}
      
      <div className="mt-2 flex items-center space-x-4 text-sm">
        {token.contractAddress && (
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">
              {truncateAddress(token.contractAddress)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleCopyAddress}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
        <span className="text-gray-400">Age: {token.age}</span>
      </div>
    </Card>
  );
};

const TokenSection = ({ 
  title, 
  tokens, 
  isLoading 
}: { 
  title: string;
  tokens: TokenData[];
  isLoading: boolean;
}) => (
  <div>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <Button variant="ghost" size="sm">
        <Filter className="h-4 w-4 mr-2" />
        Filter
      </Button>
    </div>
    {isLoading ? (
      Array.from({ length: 2 }).map((_, index) => (
        <Card key={index} className="bg-[#1E2028] p-4 mb-4">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </Card>
      ))
    ) : (
      tokens.map((token, index) => (
        <TokenCard key={`${token.symbol}-${index}`} token={token} />
      ))
    )}
  </div>
);

const Memescope = () => {
  const { tokens } = useTokenStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state for smoother UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const categorizeTokens = (tokens: TokenData[]) => {
    return {
      new: tokens.filter(t => t.marketCap && t.marketCap < 30000),
      graduating: tokens.filter(t => t.marketCap && t.marketCap >= 30000 && t.marketCap < 96000),
      graduated: tokens.filter(t => t.marketCap && t.marketCap >= 96000),
    };
  };

  const categorizedTokens = categorizeTokens(tokens);

  return (
    <div className="min-h-screen bg-[#13141F] text-white">
      <main className="container mx-auto px-4 pt-28 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">MEMESCOPE</h1>
          <p className="text-gray-400">
            Customized real-time feeds of new tokens matching your selected preset filters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TokenSection 
            title="NEWLY CREATED" 
            tokens={categorizedTokens.new}
            isLoading={isLoading}
          />
          <TokenSection 
            title="ABOUT TO GRADUATE" 
            tokens={categorizedTokens.graduating}
            isLoading={isLoading}
          />
          <TokenSection 
            title="GRADUATED" 
            tokens={categorizedTokens.graduated}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default Memescope;