import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-[#1A1F2C]/90 backdrop-blur-sm border-b border-[#2A2F3C] fixed top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            pump.fun
          </span>
        </div>
        <nav className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="text-white hover:text-purple-400 transition-colors"
            onClick={() => navigate('/create')}
          >
            Create Token
          </Button>
          <Button 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            Connect Wallet
          </Button>
        </nav>
      </div>
    </header>
  );
};