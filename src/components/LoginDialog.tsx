import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Chrome } from "lucide-react";
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
  const [showUsernameSetup, setShowUsernameSetup] = useState(false);
  const [isGoogleSignInActive, setIsGoogleSignInActive] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const checkUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return !!profile?.username;
    } catch (error) {
      console.error('Error checking user profile:', error);
      return false;
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleSignInActive(true);
      await login();
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsGoogleSignInActive(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setIsGoogleSignInActive(false);
    }
  }, [open]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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
              Sign in with Google to access all features
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {isGoogleSignInActive ? (
              <div className="w-full bg-white/10 p-4 rounded-lg flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="text-white">Signing in with Google...</span>
              </div>
            ) : (
              <Button
                className="w-full bg-white hover:bg-gray-100 text-black"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <Chrome className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
            )}
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