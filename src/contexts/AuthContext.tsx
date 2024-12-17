import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  isSubscribed: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  isSubscribed: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <AuthContext.Provider value={{ user, loading, isSubscribed }}>
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