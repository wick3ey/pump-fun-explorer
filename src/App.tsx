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
import { Suspense } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Suspense fallback={
      <div className="min-h-screen bg-[#13141F] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <WalletContextProvider>
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
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
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </WalletContextProvider>
    </Suspense>
  </QueryClientProvider>
);

export default App;