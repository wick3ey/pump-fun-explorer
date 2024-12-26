import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const ConnectWallet = () => {
  const { connected, publicKey } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      }
    };
    
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const updateWalletAddress = async () => {
      if (connected && publicKey && !isUpdating) {
        setIsUpdating(true);
        const { error } = await supabase
          .from('profiles')
          .update({ wallet_address: publicKey.toString() })
          .eq('id', (await supabase.auth.getUser()).data.user?.id);

        if (error) {
          toast({
            title: "Ett fel uppstod",
            description: "Kunde inte länka plånboken till ditt konto. Försök igen.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Plånbok ansluten!",
            description: "Din plånbok har länkats till ditt konto.",
          });
          navigate('/');
        }
        setIsUpdating(false);
      }
    };

    updateWalletAddress();
  }, [connected, publicKey, navigate, toast, isUpdating]);

  return (
    <div className="min-h-screen bg-[#13141F] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1A1F2C]/50 border-[#2A2F3C]">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-white">Anslut din plånbok</h1>
            <p className="text-gray-400">Anslut din Solana-plånbok för att fortsätta</p>
            <div className="flex justify-center pt-4">
              <WalletMultiButton className="bg-purple-600 hover:bg-purple-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectWallet;