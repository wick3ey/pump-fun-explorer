import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Mail, CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginDialog = ({ open, onOpenChange }: LoginDialogProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      setShowPayment(true);
    } else {
      // Handle login
      toast({
        title: "Login functionality coming soon",
        description: "Please try again later",
      });
    }
  };

  const handlePayment = async (method: 'sol' | 'card') => {
    toast({
      title: `${method === 'sol' ? 'SOL' : 'Card'} payment initiated`,
      description: "Payment processing coming soon",
    });
  };

  if (showPayment) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#1A1F2C] text-white">
          <DialogHeader>
            <DialogTitle>Subscribe to pump.fun</DialogTitle>
            <DialogDescription className="text-gray-400">
              $4/month subscription fee helps keep our community clean from bots and spam.
              This subscription enables access to voice chat and messaging features.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600"
              onClick={() => handlePayment('sol')}
            >
              Pay with SOL
            </Button>
            <Button
              className="w-full bg-purple-500 hover:bg-purple-600"
              onClick={() => handlePayment('card')}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Pay with Card
            </Button>
            <p className="text-sm text-gray-400 text-center">
              Secure payment processing. Cancel anytime.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1F2C] text-white">
        <DialogHeader>
          <DialogTitle>{isSignUp ? 'Create Account' : 'Welcome Back'}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {isSignUp 
              ? 'Create an account to access voice chat and messaging features' 
              : 'Log in to your pump.fun account'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {isSignUp && (
            <Input
              placeholder="Username"
              className="bg-[#13141F]/50 border-[#2A2F3C] text-white"
            />
          )}
          <Input
            type="email"
            placeholder="Email"
            className="bg-[#13141F]/50 border-[#2A2F3C] text-white"
          />
          <Input
            type="password"
            placeholder="Password"
            className="bg-[#13141F]/50 border-[#2A2F3C] text-white"
          />
          <Button type="submit" className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]">
            {isSignUp ? 'Sign Up' : 'Log In'}
          </Button>
          {isSignUp && (
            <Button
              type="button"
              className="w-full bg-red-500 hover:bg-red-600"
              onClick={() => {
                toast({
                  title: "Google Sign Up coming soon",
                  description: "Please try again later",
                });
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              Sign up with Gmail
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            className="w-full text-gray-400 hover:text-white"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};