import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TokenHeaderProps {
  name: string;
  symbol: string;
  description: string;
  pfpUrl: string;
  headerUrl: string;
}

export const TokenHeader = ({ name, symbol, description, pfpUrl, headerUrl }: TokenHeaderProps) => {
  const { toast } = useToast();

  // Get token-specific metadata
  const getTokenMetadata = (symbol: string) => {
    const metadata: { [key: string]: { pfp: string, header: string, description: string } } = {
      'WIF': {
        pfp: "https://s2.coinmarketcap.com/static/img/coins/64x64/24735.png",
        header: "/lovable-uploads/ace4dc8b-8a5d-4d71-9f5d-b0815369aff5.png",
        description: "Friend.tech for Solana 🐕"
      },
      'BONK': {
        pfp: "https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png",
        header: "https://pbs.twimg.com/profile_banners/1597711639827345408/1703815901/1500x500",
        description: "The First Solana Dog Coin 🐕"
      },
      'MYRO': {
        pfp: "https://s2.coinmarketcap.com/static/img/coins/64x64/28736.png",
        header: "https://pbs.twimg.com/profile_banners/1743386799192363008/1704484995/1500x500",
        description: "The Solana Memecoin for the People 🐕"
      },
      'POPCAT': {
        pfp: "https://s2.coinmarketcap.com/static/img/coins/64x64/28741.png",
        header: "https://pbs.twimg.com/profile_banners/1745165440557228032/1704900471/1500x500",
        description: "The First Cat Coin on Solana 🐱"
      },
      'SLERF': {
        pfp: "https://s2.coinmarketcap.com/static/img/coins/64x64/28768.png",
        header: "https://pbs.twimg.com/profile_banners/1745960508466450432/1705101297/1500x500",
        description: "The Memecoin That Slerf'd 🌊"
      },
      'BOME': {
        pfp: "https://s2.coinmarketcap.com/static/img/coins/64x64/28803.png",
        header: "https://pbs.twimg.com/profile_banners/1747474353911648256/1705445397/1500x500",
        description: "BOME on Solana 💣"
      }
    };
    return metadata[symbol] || {
      pfp: "/placeholder.svg",
      header: "",
      description: `${symbol} Token on Solana`
    };
  };

  const tokenMetadata = getTokenMetadata(symbol);

  const handleVote = (type: 'moon' | 'gensler') => {
    toast({
      title: "Wallet connection required",
      description: "Please connect your wallet to vote",
      variant: "destructive",
    });
  };

  return (
    <div className="relative w-full h-48 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg overflow-hidden mb-6">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20" 
        style={{ backgroundImage: `url(${tokenMetadata.header || headerUrl})` }}
      />
      
      <div className="relative h-full flex items-center px-6">
        <div className="flex items-center gap-6">
          <img 
            src={tokenMetadata.pfp || pfpUrl}
            alt={`${symbol} logo`}
            className="w-24 h-24 rounded-full border-4 border-white/10"
          />
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2">{name} ({symbol})</h1>
            <div className="flex gap-4 items-center">
              <p className="text-gray-300">{tokenMetadata.description || description}</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleVote('moon')}
                  className="bg-green-500 hover:bg-green-600 text-white gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  MOON
                </Button>
                <Button
                  onClick={() => handleVote('gensler')}
                  className="bg-red-500 hover:bg-red-600 text-white gap-2"
                >
                  <ThumbsDown className="w-4 h-4" />
                  GENSLER
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};