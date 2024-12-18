const IPFS_GATEWAY = 'https://cloudflare-ipfs.com/ipfs/';

interface TokenMetadata {
  image: string;
  description: string;
  name: string;
}

export const fetchTokenMetadata = async (uri: string): Promise<TokenMetadata> => {
  if (!uri) {
    return getDefaultMetadata();
  }

  try {
    // Replace ipfs.io with Cloudflare gateway for better reliability
    const modifiedUri = uri.replace('https://ipfs.io/ipfs/', IPFS_GATEWAY);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(modifiedUri, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const metadata = await response.json();
      return {
        image: metadata.image || '/placeholder.svg',
        description: metadata.description || '',
        name: metadata.name || ''
      };
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      return getDefaultMetadata();
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    return getDefaultMetadata();
  }
};

const getDefaultMetadata = (): TokenMetadata => ({
  image: '/placeholder.svg',
  description: '',
  name: ''
});