import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';

const connection = new Connection("https://api.mainnet-beta.solana.com");
const metaplex = Metaplex.make(connection);

export interface SolanaMetadata {
  name: string;
  symbol: string;
  image?: string;
  description?: string;
}

export const fetchTokenMetadata = async (mintAddress: string): Promise<SolanaMetadata> => {
  try {
    const mint = new PublicKey(mintAddress);
    const nft = await metaplex.nfts().findByMint({ mintAddress: mint });

    return {
      name: nft.name,
      symbol: nft.symbol,
      image: nft.json?.image || '/placeholder.svg',
      description: nft.json?.description || `${nft.symbol} Token on Solana`,
    };
  } catch (error) {
    console.error('Error fetching Solana metadata:', error);
    return {
      name: 'Unknown Token',
      symbol: 'UNKNOWN',
      image: '/placeholder.svg',
      description: 'Token metadata unavailable',
    };
  }
};