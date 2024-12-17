import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3, Wallet } from "lucide-react";
import { DegenModeToggle } from "./DegenModeToggle";
import { useState } from "react";
import { LoginDialog } from "./LoginDialog";

export const Header = () => {
  const [isDegenMode, setIsDegenMode] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#13141F] border-b border-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Solup
            </Link>
            <Link to="/">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <BarChart3 className="h-4 w-4 mr-2" />
                Market Overview
              </Button>
            </Link>
            <Link to="/memescope">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                Memescope
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <DegenModeToggle isDegenMode={isDegenMode} onToggle={setIsDegenMode} />
            <Link to="/create">
              <Button className="bg-[#1A1F2C] hover:bg-[#2A2F3C] text-white">
                Create Token
              </Button>
            </Link>
            <Button 
              onClick={() => setShowLoginDialog(true)}
              className="bg-[#9b87f5] hover:bg-[#8b77e5] text-white"
            >
              Log in
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </header>
  );
};