import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TrendingTokensBanner } from "./components/TrendingTokensBanner";
import { Header } from "./components/Header";
import Index from "./pages/Index";
import CreateToken from "./pages/CreateToken";
import TokenProfile from "./pages/TokenProfile";
import Memescope from "./pages/Memescope";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-[#13141F]">
          <Header />
          <TrendingTokensBanner />
          <main className="pt-4">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/create" element={<CreateToken />} />
              <Route path="/token/:symbol" element={<TokenProfile />} />
              <Route path="/memescope" element={<Memescope />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;