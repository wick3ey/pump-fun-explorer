import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="w-full bg-white/90 backdrop-blur-sm border-b border-gray-200 fixed top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">pump.fun</span>
          <span className="text-sm text-warning px-2 py-1 rounded-full border border-warning">Info</span>
        </div>
        <nav>
          <Button variant="ghost" className="text-primary hover:text-primary-hover">
            Läs mer
          </Button>
        </nav>
      </div>
    </header>
  );
};