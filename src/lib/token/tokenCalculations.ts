export const calculateHolders = (vTokensInBondingCurve: number): number => {
  return 2; // Base holders: creator and contract
};

export const calculatePercentageChange = (
  initialBuy: number, 
  vSolInBondingCurve: number
): string => {
  if (!initialBuy || !vSolInBondingCurve) return "0.00";
  
  const change = ((vSolInBondingCurve - initialBuy) / initialBuy) * 100;
  return change.toFixed(2);
};

export const calculateAge = (timestamp: number): string => {
  const now = Date.now();
  const ONE_MINUTE = 1000 * 60;
  const ONE_HOUR = ONE_MINUTE * 60;
  const ONE_DAY = ONE_HOUR * 24;
  
  const diffInMs = Math.max(0, now - timestamp);
  const diffInMinutes = Math.floor(diffInMs / ONE_MINUTE);
  const diffInHours = Math.floor(diffInMs / ONE_HOUR);
  const diffInDays = Math.floor(diffInMs / ONE_DAY);
  
  if (diffInDays > 0) {
    return `${diffInDays}d`;
  }
  
  if (diffInHours > 0) {
    return `${diffInHours}h`;
  }
  
  return `${Math.max(1, diffInMinutes)}m`;
};

export const generateTransactionCounts = (
  vSolInBondingCurve: number
): { [key: string]: number } => {
  const baseTransactions = vSolInBondingCurve ? 1 : 0;
  
  return {
    '5m': baseTransactions,
    '1h': baseTransactions,
    '6h': baseTransactions,
    '24h': baseTransactions
  };
};