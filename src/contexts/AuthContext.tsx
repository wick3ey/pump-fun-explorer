import { createContext, useContext, ReactNode, useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { AuthContextType } from "./auth/types";
import { clearAuthState, verifySession, setupInactivityTimer } from "./auth/utils";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateAuthState = useCallback((session: Session | null) => {
    if (session?.user) {
      setSession(session);
      setUser(session.user);
      setIsAuthenticated(true);
    } else {
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const initSession = useCallback(async () => {
    try {
      setIsLoading(true);
      // Clear any existing session on init
      await supabase.auth.signOut();
      updateAuthState(null);
    } catch (error) {
      console.error('Session initialization error:', error);
      updateAuthState(null);
      toast({
        title: "Session Error",
        description: "Please log in again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [updateAuthState, toast]);

  useEffect(() => {
    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        updateAuthState(session);
        navigate('/');
        toast({
          title: "Welcome back!",
          description: "Signed in successfully",
        });
      } else if (event === 'SIGNED_OUT') {
        updateAuthState(null);
        navigate('/');
        toast({
          title: "Signed out",
          description: "You have been signed out successfully",
        });
      }
    });

    const cleanup = setupInactivityTimer(async () => {
      if (isAuthenticated) {
        await logout();
        toast({
          title: "Session Expired",
          description: "You have been logged out due to inactivity",
          variant: "destructive",
        });
      }
    }, isAuthenticated);

    return () => {
      subscription.unsubscribe();
      cleanup();
    };
  }, [navigate, initSession, updateAuthState, isAuthenticated, toast]);

  const login = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      updateAuthState(null);
      clearAuthState();
      navigate('/');
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: error instanceof Error ? error.message : "An error occurred during logout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, session, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}