import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';
import { toast } from "@/components/ui/use-toast";

interface MetadataResponse {
  name?: string;
  symbol?: string;
  description?: string;
  image?: string;
}

export const fetchTokenMetadata = async (mintAddress?: string): Promise<MetadataResponse> => {
  if (!mintAddress) {
    return {
      name: 'Unknown Token',
      symbol: 'UNKNOWN',
      description: 'Token metadata not available',
      image: '/placeholder.svg'
    };
  }

  try {
    const connection = new Connection("https://api.mainnet-beta.solana.com");
    const metaplex = Metaplex.make(connection);
    const mintPublicKey = new PublicKey(mintAddress);
    const nft = await metaplex.nfts().findByMint({ mintAddress: mintPublicKey });

    return {
      name: nft.name || mintAddress,
      symbol: nft.symbol || mintAddress.slice(0, 5),
      description: nft.json?.description || `Token on Solana`,
      image: nft.json?.image || '/placeholder.svg'
    };
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    toast({
      title: "Error fetching metadata",
      description: "Could not fetch token metadata",
      variant: "destructive",
    });

    return {
      name: mintAddress,
      symbol: mintAddress.slice(0, 5),
      description: "Token on Solana",
      image: '/placeholder.svg'
    };
  }
};