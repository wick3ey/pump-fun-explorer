// Base types
type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Profile related types
interface ProfileRow {
  created_at: string
  id: string
  updated_at: string
  username: string
}

interface ProfileInsert {
  created_at?: string
  id: string
  updated_at?: string
  username: string
}

interface ProfileUpdate {
  created_at?: string
  id?: string
  updated_at?: string
  username?: string
}

// Token related types
interface TokenRow {
  contract_address: string | null
  created_at: string
  creator_id: string | null
  description: string | null
  id: string
  is_graduated: boolean | null
  market_cap: number | null
  name: string
  power: number | null
  symbol: string
  updated_at: string
}

interface TokenInsert {
  contract_address?: string | null
  created_at?: string
  creator_id?: string | null
  description?: string | null
  id?: string
  is_graduated?: boolean | null
  market_cap?: number | null
  name: string
  power?: number | null
  symbol: string
  updated_at?: string
}

interface TokenUpdate {
  contract_address?: string | null
  created_at?: string
  creator_id?: string | null
  description?: string | null
  id?: string
  is_graduated?: boolean | null
  market_cap?: number | null
  name?: string
  power?: number | null
  symbol?: string
  updated_at?: string
}

// Transaction related types
interface TransactionRow {
  amount: number
  created_at: string
  error_message: string | null
  id: string
  price: number
  signature: string | null
  status: string
  token_id: string | null
  user_id: string | null
}

interface TransactionInsert {
  amount: number
  created_at?: string
  error_message?: string | null
  id?: string
  price: number
  signature?: string | null
  status: string
  token_id?: string | null
  user_id?: string | null
}

interface TransactionUpdate {
  amount?: number
  created_at?: string
  error_message?: string | null
  id?: string
  price?: number
  signature?: string | null
  status?: string
  token_id?: string | null
  user_id?: string | null
}

// Database interface
interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow
        Insert: ProfileInsert
        Update: ProfileUpdate
        Relationships: []
      }
      tokens: {
        Row: TokenRow
        Insert: TokenInsert
        Update: TokenUpdate
        Relationships: []
      }
      transactions: {
        Row: TransactionRow
        Insert: TransactionInsert
        Update: TransactionUpdate
        Relationships: [
          {
            foreignKeyName: "transactions_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      is_username_available: {
        Args: { username: string }
        Returns: boolean
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type {
  Database,
  Json,
  ProfileRow,
  ProfileInsert,
  ProfileUpdate,
  TokenRow,
  TokenInsert,
  TokenUpdate,
  TransactionRow,
  TransactionInsert,
  TransactionUpdate
}