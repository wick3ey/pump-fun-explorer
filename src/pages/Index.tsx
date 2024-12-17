import { TokenBoard } from "@/components/TokenBoard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useTokenStore } from "@/stores/tokenStore";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { tokens } = useTokenStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 30) { // Likely a contract address
      const foundToken = tokens.find(token => 
        token.contractAddress.toLowerCase() === query.toLowerCase()
      );

      if (foundToken) {
        navigate(`/token/${foundToken.symbol}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#13141F] text-white">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              placeholder="Search token by ticker or address..." 
              className="w-full pl-10 bg-[#1A1F2C] border-[#2A2F3C] text-white placeholder:text-gray-400"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        <TokenBoard searchQuery={searchQuery} />
      </main>
    </div>
  );
};

export default Index;