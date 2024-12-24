import { TokenRow, ProfileRow, TransactionRow } from './tables';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: {
          created_at?: string;
          id: string;
          updated_at?: string;
          username: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          updated_at?: string;
          username?: string;
        };
        Relationships: [];
      };
      tokens: {
        Row: TokenRow;
        Insert: {
          contract_address?: string | null;
          created_at?: string;
          creator_id?: string | null;
          description?: string | null;
          id?: string;
          is_graduated?: boolean | null;
          market_cap?: number | null;
          name: string;
          power?: number | null;
          symbol: string;
          updated_at?: string;
        };
        Update: {
          contract_address?: string | null;
          created_at?: string;
          creator_id?: string | null;
          description?: string | null;
          id?: string;
          is_graduated?: boolean | null;
          market_cap?: number | null;
          name?: string;
          power?: number | null;
          symbol?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: TransactionRow;
        Insert: {
          amount: number;
          created_at?: string;
          error_message?: string | null;
          id?: string;
          price: number;
          signature?: string | null;
          status: string;
          token_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string;
          error_message?: string | null;
          id?: string;
          price?: number;
          signature?: string | null;
          status?: string;
          token_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_token_id_fkey";
            columns: ["token_id"];
            isOneToOne: false;
            referencedRelation: "tokens";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_username_available: {
        Args: {
          username: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};