import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#13141F] border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-white">
              SafeDegen
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
          <Link to="/create">
            <Button>Create Token</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};