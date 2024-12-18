const IPFS_GATEWAYS = [
  'https://cloudflare-ipfs.com/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/'
];

interface TokenMetadata {
  image: string;
  description: string;
  name: string;
}

const fetchWithTimeout = async (url: string, timeout = 5000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

const tryFetchFromGateways = async (ipfsHash: string): Promise<Response> => {
  for (const gateway of IPFS_GATEWAYS) {
    try {
      const url = `${gateway}${ipfsHash.replace('ipfs://', '')}`;
      const response = await fetchWithTimeout(url);
      if (response.ok) {
        return response;
      }
    } catch (error) {
      console.log(`Failed to fetch from ${gateway}`, error);
      continue;
    }
  }
  throw new Error('Failed to fetch from all IPFS gateways');
};

export const fetchTokenMetadata = async (uri?: string): Promise<TokenMetadata> => {
  if (!uri) {
    return getDefaultMetadata();
  }

  try {
    const ipfsHash = uri.replace('https://ipfs.io/ipfs/', '');
    const response = await tryFetchFromGateways(ipfsHash);
    const metadata = await response.json();

    return {
      image: metadata.image?.replace('ipfs://', IPFS_GATEWAYS[0]) || '/placeholder.svg',
      description: metadata.description || '',
      name: metadata.name || ''
    };
  } catch (error) {
    console.warn('Error fetching token metadata:', error);
    return getDefaultMetadata();
  }
};

const getDefaultMetadata = (): TokenMetadata => ({
  image: '/placeholder.svg',
  description: '',
  name: ''
});