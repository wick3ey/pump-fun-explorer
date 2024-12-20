import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Mail, Chrome } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { UsernameSetupDialog } from "./UsernameSetupDialog";
import { useAuth } from "@/contexts/AuthContext";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginDialog = ({ open, onOpenChange }: LoginDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showUsernameSetup, setShowUsernameSetup] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const checkUserProfile = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();
    
    return !!profile?.username;
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await login();
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    toast({
      title: "Coming Soon",
      description: "Email authentication will be available soon",
    });
  };

  useEffect(() => {
    // Check auth state on component mount
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const hasProfile = await checkUserProfile(session.user.id);
        if (!hasProfile) {
          setShowUsernameSetup(true);
        }
      }
    };
    
    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        const hasProfile = await checkUserProfile(session.user.id);
        if (!hasProfile) {
          setShowUsernameSetup(true);
        } else {
          onOpenChange(false);
          navigate('/');
          toast({
            title: "Welcome back!",
            description: "Successfully signed in",
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, onOpenChange, toast]);

  return (
    <>
      <Dialog open={open && !showUsernameSetup} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#1A1F2C] text-white">
          <DialogHeader>
            <DialogTitle>Welcome to SolUp</DialogTitle>
            <DialogDescription className="text-gray-400">
              Sign in to access all features and start trading
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Button
              className="w-full bg-white hover:bg-gray-100 text-black"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Chrome className="mr-2 h-4 w-4" />
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#1A1F2C] px-2 text-gray-400">Or continue with</span>
              </div>
            </div>
            <Button
              className="w-full bg-[#2A2F3C] hover:bg-[#3A3F4C] text-white"
              onClick={handleEmailSignIn}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <UsernameSetupDialog 
        open={showUsernameSetup} 
        onOpenChange={setShowUsernameSetup}
        onComplete={() => {
          setShowUsernameSetup(false);
          onOpenChange(false);
          navigate('/');
          toast({
            title: "Welcome to SolUp!",
            description: "Your profile has been set up successfully",
          });
        }}
      />
    </>
  );
};