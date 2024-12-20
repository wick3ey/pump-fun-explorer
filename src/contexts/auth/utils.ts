import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const clearAuthState = () => {
  localStorage.removeItem('supabase.auth.token');
};

export const verifySession = async (session: Session | null) => {
  if (!session?.user) return false;

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', session.user.id)
    .single();

  return !!profile;
};

export const setupInactivityTimer = (
  onTimeout: () => void,
  isAuthenticated: boolean
) => {
  let inactivityTimeout: NodeJS.Timeout;

  const resetTimer = () => {
    clearTimeout(inactivityTimeout);
    if (isAuthenticated) {
      inactivityTimeout = setTimeout(onTimeout, 60 * 60 * 1000); // 1 hour
    }
  };

  window.addEventListener('mousemove', resetTimer);
  window.addEventListener('keypress', resetTimer);

  resetTimer();

  return () => {
    window.removeEventListener('mousemove', resetTimer);
    window.removeEventListener('keypress', resetTimer);
    clearTimeout(inactivityTimeout);
  };
};