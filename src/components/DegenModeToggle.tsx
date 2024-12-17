import { Button } from "@/components/ui/button";
import { Lock, Flame } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DegenModeToggleProps {
  isDegenMode: boolean;
  onToggle: (mode: boolean) => void;
}

export const DegenModeToggle = ({ isDegenMode, onToggle }: DegenModeToggleProps) => {
  const { toast } = useToast();

  const handleToggle = () => {
    onToggle(!isDegenMode);
    toast({
      title: !isDegenMode ? "Degen Mode Activated" : "Safe Degen Mode Activated",
      description: !isDegenMode 
        ? "Warning: Higher risk, no safety mechanisms" 
        : "Safety mechanisms enabled for token trading",
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleToggle}
      className={`gap-2 transition-colors ${
        isDegenMode 
          ? "bg-red-500 hover:bg-red-600 text-white border-red-600" 
          : "bg-green-500 hover:bg-green-600 text-white border-green-600"
      }`}
    >
      {isDegenMode ? (
        <>
          <Flame className="h-4 w-4" />
          Degen Mode
        </>
      ) : (
        <>
          <Lock className="h-4 w-4" />
          Safe Degen
        </>
      )}
    </Button>
  );
};