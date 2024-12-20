import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WalletContextProvider } from "@/contexts/WalletContext";
import { TrendingTokensBanner } from "./components/TrendingTokensBanner";
import { PowerBanner } from "./components/PowerBanner";
import { Header } from "./components/Header";
import Index from "./pages/Index";
import CreateToken from "./pages/CreateToken";
import TokenProfile from "./pages/TokenProfile";
import Memescope from "./pages/Memescope";
import { Suspense, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./components/ui/use-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const { toast } = useToast();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.id);
        toast({
          title: "Signed in successfully",
          description: "Welcome back!",
        });
      }
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        toast({
          title: "Signed out",
          description: "Come back soon!",
        });
      }
      if (event === 'USER_UPDATED') {
        console.log('User updated:', session?.user?.id);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <div className="min-h-screen bg-[#13141F]">
      <Header />
      <Toaster />
      <Sonner />
      <main className="flex flex-col">
        <div className="mt-16">
          <TrendingTokensBanner />
          <PowerBanner />
        </div>
        <div className="container mx-auto px-4 py-4">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create" element={<CreateToken />} />
            <Route path="/token/:symbol" element={<TokenProfile />} />
            <Route path="/memescope" element={<Memescope />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletContextProvider>
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Suspense 
                fallback={
                  <div className="min-h-screen bg-[#13141F] flex items-center justify-center">
                    <div className="text-white">Loading...</div>
                  </div>
                }
              >
                <AppContent />
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </WalletContextProvider>
    </QueryClientProvider>
  );
};

export default App;