import { toast } from "@/components/ui/use-toast";

const IPFS_GATEWAYS = [
  "https://ipfs.io/ipfs/",
  "https://w3s.link/ipfs/",
  "https://nftstorage.link/ipfs/",
  "https://cf-ipfs.com/ipfs/"
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

const fetchFromGateways = async (uri: string): Promise<MetadataResponse> => {
  // If it's not an IPFS URI, try direct fetch
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

  // Extract IPFS hash
  const ipfsHash = uri.replace('ipfs://', '').replace('/ipfs/', '');
  
  // Try each gateway
  for (const gateway of IPFS_GATEWAYS) {
    try {
      const response = await fetchWithTimeout(`${gateway}${ipfsHash}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`Failed to fetch from gateway ${gateway}`, error);
      continue;
    }
  }

  // If all gateways fail, return default metadata
  return {
    name: "Unknown Token",
    symbol: "???",
    description: "Metadata unavailable",
    image: "/placeholder.svg"
  };
};

export const fetchTokenMetadata = async (mintAddress?: string): Promise<MetadataResponse> => {
  if (!mintAddress) {
    return {
      name: "Unknown Token",
      symbol: "???",
      description: "No mint address provided",
      image: "/placeholder.svg"
    };
  }

  try {
    // For now, return placeholder data since we can't reliably fetch metadata
    return {
      name: "Token",
      symbol: mintAddress.slice(0, 5),
      description: "Token on Solana",
      image: "/placeholder.svg"
    };
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    toast({
      title: "Error fetching metadata",
      description: "Using fallback data",
      variant: "destructive",
    });

    return {
      name: "Unknown Token",
      symbol: mintAddress.slice(0, 5),
      description: "Metadata unavailable",
      image: "/placeholder.svg"
    };
  }
};