export const calculateHolders = (vTokensInBondingCurve: number): number => {
  // Each transaction represents a unique holder in this case
  // We'll use a more conservative estimate based on transaction volume
  return Math.max(2, Math.floor(Math.sqrt(vTokensInBondingCurve / 1000000)));
};

export const calculatePercentageChange = (initialBuy: number, vSolInBondingCurve: number): string => {
  if (!initialBuy || !vSolInBondingCurve) return "0.00";
  
  // Calculate percentage change between initial buy and current bonding curve value
  const change = ((vSolInBondingCurve - initialBuy) / initialBuy) * 100;
  
  // Return formatted string with 2 decimal places
  return change.toFixed(2);
};

export const calculateAge = (timestamp: number): string => {
  const now = Date.now();
  const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}h`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)}d`;
  }
};

export const generateTransactionCounts = (vSolInBondingCurve: number): { [key: string]: number } => {
  if (!vSolInBondingCurve) return { '5m': 0, '1h': 0, '6h': 0, '24h': 0 };
  
  // Base transactions on actual SOL volume
  const baseTransactions = Math.max(2, Math.floor(vSolInBondingCurve));
  
  return {
    '5m': Math.floor(baseTransactions * 0.1),
    '1h': Math.floor(baseTransactions * 0.3),
    '6h': Math.floor(baseTransactions * 0.6),
    '24h': baseTransactions
  };
};