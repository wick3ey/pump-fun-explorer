import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UsernameSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export const UsernameSetupDialog = ({ open, onOpenChange, onComplete }: UsernameSetupDialogProps) => {
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      setIsChecking(true);
      
      // Check if username is available
      const { data: isAvailable, error: checkError } = await supabase
        .rpc('is_username_available', { username });

      if (checkError) throw checkError;
      
      if (!isAvailable) {
        toast({
          title: "Username taken",
          description: "Please choose a different username",
          variant: "destructive",
        });
        return;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Insert profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{ id: user.id, username }]);

      if (insertError) throw insertError;

      toast({
        title: "Username set!",
        description: "Your profile has been created successfully",
      });
      
      onComplete();
    } catch (error) {
      console.error('Error setting username:', error);
      toast({
        title: "Error",
        description: "Failed to set username. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1F2C] text-white">
        <DialogHeader>
          <DialogTitle>Choose your username</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-[#2A2F3C] border-[#3A3F4C] text-white"
          />
          <Button
            className="w-full bg-[#9b87f5] hover:bg-[#8b77e5] text-white"
            onClick={handleSubmit}
            disabled={isChecking || !username.trim()}
          >
            {isChecking ? 'Setting username...' : 'Continue'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};