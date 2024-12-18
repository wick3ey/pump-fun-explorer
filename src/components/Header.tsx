import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Wallet, Menu } from "lucide-react";
import { DegenModeToggle } from "./DegenModeToggle";
import { useState } from "react";
import { LoginDialog } from "./LoginDialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const Header = () => {
  const [isDegenMode, setIsDegenMode] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const location = useLocation();
  const { connected } = useWallet();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#13141F] border-b border-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              SolUp
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/">
                <Button 
                  variant="ghost" 
                  className={`text-gray-400 hover:text-white ${isActive('/') ? 'bg-[#2A2F3C] text-white' : ''}`}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Market Overview
                </Button>
              </Link>
              <Link to="/memescope">
                <Button 
                  variant="ghost" 
                  className={`text-gray-400 hover:text-white ${isActive('/memescope') ? 'bg-[#2A2F3C] text-white' : ''}`}
                >
                  Memescope
                </Button>
              </Link>
              <Link to="/create">
                <Button 
                  className={`bg-[#1A1F2C] hover:bg-[#2A2F3C] text-white ${isActive('/create') ? 'bg-[#2A2F3C]' : ''}`}
                >
                  Create Token
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              onClick={() => setShowLoginDialog(true)}
              className="bg-[#9b87f5] hover:bg-[#8b77e5] text-white"
            >
              Log in
            </Button>
            <DegenModeToggle isDegenMode={isDegenMode} onToggle={setIsDegenMode} />
            <WalletMultiButton />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-white p-2"
                >
                  <Menu className="h-8 w-8" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-full sm:w-[300px] bg-[#13141F] border-l border-gray-800 p-0"
              >
                <div className="flex flex-col h-full p-6">
                  <div className="space-y-6">
                    <Link to="/" className="block">
                      <Button 
                        variant="ghost" 
                        className={`w-full justify-start text-gray-400 hover:text-white text-lg py-4 ${
                          isActive('/') ? 'bg-[#2A2F3C] text-white' : ''
                        }`}
                      >
                        <BarChart3 className="h-5 w-5 mr-3" />
                        Market Overview
                      </Button>
                    </Link>
                    <Link to="/memescope" className="block">
                      <Button 
                        variant="ghost" 
                        className={`w-full justify-start text-gray-400 hover:text-white text-lg py-4 ${
                          isActive('/memescope') ? 'bg-[#2A2F3C] text-white' : ''
                        }`}
                      >
                        Memescope
                      </Button>
                    </Link>
                    <Link to="/create" className="block">
                      <Button 
                        className={`w-full bg-[#1A1F2C] hover:bg-[#2A2F3C] text-white text-lg py-4 ${
                          isActive('/create') ? 'bg-[#2A2F3C]' : ''
                        }`}
                      >
                        Create Token
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-auto space-y-6">
                    <Button 
                      onClick={() => setShowLoginDialog(true)}
                      className="w-full bg-[#9b87f5] hover:bg-[#8b77e5] text-white text-lg py-4"
                    >
                      Log in
                    </Button>
                    <DegenModeToggle isDegenMode={isDegenMode} onToggle={setIsDegenMode} />
                    <WalletMultiButton className="w-full" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </header>
  );
};