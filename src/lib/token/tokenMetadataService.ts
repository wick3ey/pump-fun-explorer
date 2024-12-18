interface TokenMetadata {
  image: string;
  description: string;
  name: string;
}

export const fetchTokenMetadata = async (): Promise<TokenMetadata> => {
  return {
    image: '/placeholder.svg',
    description: '',
    name: ''
  };
};