export const calculateHolders = (vTokensInBondingCurve: number): number => {
  if (!vTokensInBondingCurve) return 0;
  // Calculate based on vTokens, assuming each holder has at least 100k tokens
  return Math.floor(vTokensInBondingCurve / 100_000);
};

export const calculatePercentageChange = (initialBuy: number, vSolInBondingCurve: number): string => {
  if (!initialBuy || !vSolInBondingCurve || initialBuy === 0) return "0.00";
  const change = ((vSolInBondingCurve - initialBuy) / initialBuy) * 100;
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
  
  // Base transactions proportional to vSol in bonding curve
  const baseTransactions = Math.floor(vSolInBondingCurve * 10);
  
  return {
    '5m': Math.floor(baseTransactions * 0.1),
    '1h': Math.floor(baseTransactions * 0.3),
    '6h': Math.floor(baseTransactions * 0.6),
    '24h': baseTransactions
  };
};