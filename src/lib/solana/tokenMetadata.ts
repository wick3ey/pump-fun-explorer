import { toast } from "@/components/ui/use-toast";
import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';

const IPFS_GATEWAYS = [
  "https://ipfs.io/ipfs/",
  "https://w3s.link/ipfs/",
  "https://nftstorage.link/ipfs/",
  "https://cf-ipfs.com/ipfs/",
  "https://gateway.pinata.cloud/ipfs/",
  "https://ipfs.fleek.co/ipfs/",
  "https://gateway.ipfs.io/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
  "https://ipfs.infura.io/ipfs/",
  "https://ipfs.dweb.link/ipfs/"
];

interface MetadataResponse {
  name?: string;
  symbol?: string;
  description?: string;
  image?: string;
}

const fetchWithTimeout = async (url: string, timeout = 5000): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

const fetchMetaplexMetadata = async (mintAddress: string): Promise<string | null> => {
  try {
    const connection = new Connection("https://api.mainnet-beta.solana.com");
    const metaplex = Metaplex.make(connection);
    const mintPublicKey = new PublicKey(mintAddress);
    const nft = await metaplex.nfts().findByMint({ mintAddress: mintPublicKey });
    return nft.json?.image || null;
  } catch (error) {
    console.warn('Failed to fetch Metaplex metadata:', error);
    return null;
  }
};

const fetchFromGateways = async (uri: string): Promise<MetadataResponse> => {
  // If it's not an IPFS URI, try direct fetch first
  if (!uri.includes('ipfs://') && !uri.includes('/ipfs/')) {
    try {
      const response = await fetchWithTimeout(uri);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`Failed to fetch from direct URI: ${uri}`, error);
    }
  }

  // Extract IPFS hash and try all gateways
  const ipfsHash = uri.replace('ipfs://', '').replace('/ipfs/', '');
  
  for (const gateway of IPFS_GATEWAYS) {
    try {
      const response = await fetchWithTimeout(`${gateway}${ipfsHash}`);
      if (response.ok) {
        const data = await response.json();
        if (data.image) {
          return data;
        }
      }
    } catch (error) {
      console.warn(`Failed to fetch from gateway ${gateway}`, error);
      continue;
    }
  }

  throw new Error('Failed to fetch metadata from all gateways');
};

const fetchArweaveMetadata = async (uri: string): Promise<MetadataResponse | null> => {
  if (uri.startsWith('ar://')) {
    try {
      const arweaveGateway = 'https://arweave.net/';
      const arweaveHash = uri.replace('ar://', '');
      const response = await fetchWithTimeout(`${arweaveGateway}${arweaveHash}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Failed to fetch Arweave metadata:', error);
    }
  }
  return null;
};

export const fetchTokenMetadata = async (mintAddress?: string): Promise<MetadataResponse> => {
  if (!mintAddress) {
    throw new Error('No mint address provided');
  }

  try {
    // Strategy 1: Try Metaplex direct fetch
    const metaplexImage = await fetchMetaplexMetadata(mintAddress);
    if (metaplexImage) {
      return {
        image: metaplexImage,
        name: mintAddress,
        symbol: mintAddress.slice(0, 5),
        description: "Token on Solana"
      };
    }

    // Strategy 2: Try fetching from token URI
    const connection = new Connection("https://api.mainnet-beta.solana.com");
    const metaplex = Metaplex.make(connection);
    const mintPublicKey = new PublicKey(mintAddress);
    const nft = await metaplex.nfts().findByMint({ mintAddress: mintPublicKey });
    
    if (nft.uri) {
      // Strategy 3: Try IPFS gateways
      try {
        const metadata = await fetchFromGateways(nft.uri);
        return {
          ...metadata,
          name: metadata.name || mintAddress,
          symbol: metadata.symbol || mintAddress.slice(0, 5),
          description: metadata.description || "Token on Solana"
        };
      } catch (error) {
        console.warn('Failed to fetch from IPFS gateways:', error);
      }

      // Strategy 4: Try Arweave if applicable
      const arweaveMetadata = await fetchArweaveMetadata(nft.uri);
      if (arweaveMetadata) {
        return {
          ...arweaveMetadata,
          name: arweaveMetadata.name || mintAddress,
          symbol: arweaveMetadata.symbol || mintAddress.slice(0, 5),
          description: arweaveMetadata.description || "Token on Solana"
        };
      }
    }

    throw new Error('Failed to fetch metadata from all available sources');

  } catch (error) {
    console.error("Error fetching token metadata:", error);
    toast({
      title: "Error fetching metadata",
      description: "Failed to fetch token metadata",
      variant: "destructive",
    });

    throw error;
  }
};