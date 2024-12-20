import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TokenHeaderProps {
  name: string;
  symbol: string;
  description: string;
  pfpUrl: string;
  headerUrl?: string;
}

export const TokenHeader = ({ name, symbol, description, pfpUrl, headerUrl }: TokenHeaderProps) => {
  const { toast } = useToast();

  const handleVote = (type: 'moon' | 'gensler') => {
    toast({
      title: `Voted ${type.toUpperCase()}!`,
      description: `Your ${type} vote has been recorded`,
    });
  };

  const headerStyle = headerUrl 
    ? { backgroundImage: `url(${headerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: 'linear-gradient(to right, rgb(126, 34, 206), rgb(37, 99, 235))' };

  return (
    <div className="relative w-full h-48 rounded-lg overflow-hidden mb-6" style={headerStyle}>
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative h-full flex items-center px-6">
        <div className="flex items-center gap-6">
          <img 
            src={pfpUrl || "/placeholder.svg"}
            alt={`${symbol} logo`}
            className="w-24 h-24 rounded-full border-4 border-white/10"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2">{name} ({symbol})</h1>
            <div className="flex gap-4 items-center">
              <p className="text-gray-300">{description}</p>
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