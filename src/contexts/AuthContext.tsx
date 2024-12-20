import { createContext, useContext, ReactNode, useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Clear session and user data
  const clearAuthState = useCallback(() => {
    setSession(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('supabase.auth.token');
  }, []);

  // Initialize session with strict checking
  const initSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }

      if (!session || !session.user) {
        clearAuthState();
        return;
      }

      // Verify session is still valid
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .single();

      if (!profile) {
        console.warn('No profile found for user, logging out');
        await supabase.auth.signOut();
        clearAuthState();
        return;
      }

      setSession(session);
      setUser(session.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Session initialization error:', error);
      clearAuthState();
      toast({
        title: "Session Error",
        description: "Please log in again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthState, toast]);

  // Set up auth state listener
  useEffect(() => {
    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        setSession(session);
        setUser(session.user);
        setIsAuthenticated(true);
        navigate('/');
        
        toast({
          title: "Welcome back!",
          description: `Signed in successfully`,
        });
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        clearAuthState();
        navigate('/');
        
        toast({
          title: "Signed out",
          description: "You have been signed out successfully",
        });
      }
    });

    // Auto-logout after 1 hour of inactivity
    let inactivityTimeout: NodeJS.Timeout;
    
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(async () => {
        if (isAuthenticated) {
          await logout();
          toast({
            title: "Session Expired",
            description: "You have been logged out due to inactivity",
            variant: "destructive",
          });
        }
      }, 60 * 60 * 1000); // 1 hour
    };

    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keypress', resetInactivityTimer);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keypress', resetInactivityTimer);
      clearTimeout(inactivityTimeout);
    };
  }, [navigate, initSession, clearAuthState, isAuthenticated]);

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