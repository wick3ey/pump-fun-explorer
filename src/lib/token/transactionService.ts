import { Connection, VersionedTransaction, TransactionConfirmationStrategy, SendTransactionError } from "@solana/web3.js";
import { fetchWithRetry } from "@/lib/utils/apiUtils";
import { TransactionConfig } from "./types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PUMP_PORTAL_API_BASE = 'https://pumpportal.fun/api';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export async function getCreateTransaction(config: TransactionConfig): Promise<Uint8Array> {
  try {
    console.log("Creating transaction with config:", config);
    
    if (!config.mint || !config.publicKey) {
      throw new Error("Invalid transaction configuration");
    }

    const response = await fetchWithRetry(`${PUMP_PORTAL_API_BASE}/trade-local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Version": "1.0.0",
        "X-Request-Timestamp": Date.now().toString(),
      },
      body: JSON.stringify({
        publicKey: config.publicKey,
        action: "create",
        tokenMetadata: config.metadata,
        mint: config.mint.toString(),
        denominatedInSol: "true",
        amount: config.initialBuyAmount,
        supply: config.supply,
        slippage: 10,
        priorityFee: 0.0005,
        pool: "pump"
      })
    });

    const data = await response.arrayBuffer();
    if (!data || data.byteLength === 0) {
      throw new Error("Invalid transaction data received");
    }

    return new Uint8Array(data);
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw new Error("Could not create token transaction. Please try again.");
  }
}

export async function sendTransactionWithRetry(
  connection: Connection,
  transaction: VersionedTransaction,
  maxRetries = MAX_RETRIES
): Promise<string> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Attempt ${i + 1} to send transaction`);

      // Get a fresh blockhash for each attempt
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
      transaction.message.recentBlockhash = blockhash;

      console.log("Using blockhash:", blockhash);

      // Send with more aggressive confirmation strategy
      const signature = await connection.sendTransaction(transaction, {
        maxRetries: 5,
        skipPreflight: false,
        preflightCommitment: 'processed',
        minContextSlot: await connection.getSlot('finalized'),
      });
      
      console.log("Transaction sent with signature:", signature);
      
      // Wait for confirmation with a more detailed strategy
      const confirmationStrategy: TransactionConfirmationStrategy = {
        signature,
        blockhash,
        lastValidBlockHeight
      };
      
      const confirmation = await connection.confirmTransaction(confirmationStrategy, 'confirmed');
      
      if (confirmation.value.err) {
        const error = new Error(`Transaction confirmed but failed: ${confirmation.value.err}`);
        await recordTransactionError(signature, error.message, 0);
        throw error;
      }
      
      console.log("Transaction confirmed successfully");
      return signature;
    } catch (error) {
      console.error(`Transaction attempt ${i + 1} failed:`, error);
      
      if (error instanceof SendTransactionError) {
        const logs = error.logs;
        console.error('Transaction logs:', logs);
        
        await recordTransactionError(null, error instanceof Error ? error.message : 'Unknown error', 0);
        
        toast({
          title: "Transaction failed",
          description: `Attempt ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
          variant: "destructive",
        });
      }
      
      lastError = error instanceof Error ? error : new Error('Unknown error occurred');
      
      if (i < maxRetries - 1) {
        const delay = RETRY_DELAY * Math.pow(2, i);
        console.log(`Waiting ${delay}ms before next attempt...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Transaction failed after multiple attempts');
}

async function recordTransactionError(signature: string | null, errorMessage: string, amount: number) {
  try {
    const { error } = await supabase
      .from('transactions')
      .insert({
        status: 'failed',
        error_message: errorMessage,
        signature,
        amount: amount,
        price: amount,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      });

    if (error) {
      console.error("Could not record transaction error:", error);
    }
  } catch (err) {
    console.error("Error recording transaction failure:", err);
  }
}