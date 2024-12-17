import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isSubscribed: boolean;
  checkSubscription: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isSubscribed: false,
  checkSubscription: async () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const checkSubscription = async () => {
    if (!user) return false;
    
    try {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      const hasValidSubscription = subscription && 
        new Date(subscription.valid_until) > new Date();
      
      setIsSubscribed(hasValidSubscription);
      return hasValidSubscription;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkSubscription();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkSubscription();
      } else {
        setIsSubscribed(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isSubscribed, checkSubscription }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};