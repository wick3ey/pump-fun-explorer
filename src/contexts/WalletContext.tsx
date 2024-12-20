import { FC, ReactNode, useMemo, useState, useEffect } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { 
  PhantomWalletAdapter, 
  SolflareWalletAdapter,
  GlowWalletAdapter,
  LedgerWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { useToast } from '@/components/ui/use-toast';

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Use QuickNode RPC endpoint from environment variable or fallback to public endpoint
  const endpoint = import.meta.env.VITE_RPC_ENDPOINT || clusterApiUrl('mainnet-beta');
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new GlowWalletAdapter(),
      new LedgerWalletAdapter()
    ],
    []
  );

  useEffect(() => {
    const handleWalletError = (error: Error) => {
      console.error('Plånboksfel:', error);
      toast({
        title: "Plånboksfel",
        description: `Ett fel uppstod med plånboken: ${error.message}`,
        variant: "destructive",
      });
      setIsConnecting(false);
    };

    window.addEventListener('walletError', handleWalletError as any);
    return () => window.removeEventListener('walletError', handleWalletError as any);
  }, [toast]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect={false}
        onError={(error) => {
          console.error('Plånboksfel:', error);
          toast({
            title: "Anslutningsfel",
            description: "Kunde inte ansluta till plånboken. Försök igen.",
            variant: "destructive",
          });
          setIsConnecting(false);
        }}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};