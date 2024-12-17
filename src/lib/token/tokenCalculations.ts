export const calculateHolders = (vTokensInBondingCurve: number): number => {
  // For new tokens, start with 2 holders (creator and contract)
  return 2;
};

export const calculatePercentageChange = (initialBuy: number, vSolInBondingCurve: number): string => {
  if (!initialBuy || !vSolInBondingCurve) return "0.00";
  
  // Calculate percentage change between initial SOL amount and current SOL in bonding curve
  const change = ((vSolInBondingCurve - initialBuy) / initialBuy) * 100;
  
  // Return formatted string with 2 decimal places
  return change.toFixed(2);
};

export const calculateAge = (timestamp: number): string => {
  const now = Date.now();
  const diffInMinutes = Math.max(1, Math.floor((now - timestamp) / (1000 * 60)));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  } else if (diffInMinutes < 1440) { // Less than 24 hours
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days}d`;
  }
};

export const generateTransactionCounts = (vSolInBondingCurve: number): { [key: string]: number } => {
  if (!vSolInBondingCurve) return { '5m': 0, '1h': 0, '6h': 0, '24h': 0 };
  
  // Start with 1 transaction (the creation transaction)
  const baseTransactions = 1;
  
  return {
    '5m': baseTransactions,
    '1h': baseTransactions,
    '6h': baseTransactions,
    '24h': baseTransactions
  };
};