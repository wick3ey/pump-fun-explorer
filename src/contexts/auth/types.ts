import { Session, User } from "@supabase/supabase-js";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}