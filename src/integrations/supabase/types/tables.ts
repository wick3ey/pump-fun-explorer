export type TokenRow = {
  id: string;
  symbol: string;
  name: string;
  description: string | null;
  creator_id: string | null;
  contract_address: string | null;
  market_cap: number | null;
  is_graduated: boolean | null;
  created_at: string;
  updated_at: string;
  power: number | null;
}

export type ProfileRow = {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export type TransactionRow = {
  id: string;
  token_id: string | null;
  user_id: string | null;
  amount: number;
  price: number;
  status: string;
  error_message: string | null;
  signature: string | null;
  created_at: string;
}