import { useCallback, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { BondingCurve, createDefaultBondingCurve } from '@/lib/solana/bondingCurve';
import { calculateMarketCap, shouldGraduateToRaydium, GRADUATION_THRESHOLD } from '@/lib/solana/tokenCreator';
import { useToast } from '@/components/ui/use-toast';

export const useSolanaToken = (tokenAddress?: string) => {
  const [supply, setSupply] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [marketCap, setMarketCap] = useState<number>(0);
  const [isGraduated, setIsGraduated] = useState<boolean>(false);
  const { toast } = useToast();
  
  const bondingCurve = createDefaultBondingCurve();

  const updateTokenMetrics = useCallback((newSupply: number) => {
    const newPrice = bondingCurve.calculatePrice(newSupply);
    const newMarketCap = calculateMarketCap(newSupply, newPrice);
    
    setSupply(newSupply);
    setPrice(newPrice);
    setMarketCap(newMarketCap);
    
    const shouldGraduate = shouldGraduateToRaydium(newMarketCap);
    if (shouldGraduate && !isGraduated) {
      setIsGraduated(true);
      toast({
        title: "Token Graduated! 🎓",
        description: `Token has reached $${GRADUATION_THRESHOLD.toLocaleString()} market cap and will be distributed to Raydium`,
      });
    }
  }, [bondingCurve, isGraduated, toast]);

  return {
    supply,
    price,
    marketCap,
    isGraduated,
    updateTokenMetrics,
    bondingCurve,
  };
};