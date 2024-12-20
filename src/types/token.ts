export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  twitter?: string;
  telegram?: string;
  website?: string;
  pfpImage: File;
  headerImage: File;
  tokenMode: 'og' | 'doxxed' | 'locked';
  power: string;
}