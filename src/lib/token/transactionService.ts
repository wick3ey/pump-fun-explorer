import { Connection, VersionedTransaction, TransactionConfirmationStrategy, SendTransactionError } from "@solana/web3.js";
import { fetchWithRetry } from "@/lib/utils/apiUtils";
import { TransactionConfig } from "./types";
import { toast } from "@/components/ui/use-toast";

const PUMP_PORTAL_API_BASE = 'https://pumpportal.fun/api';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export async function getCreateTransaction(config: TransactionConfig): Promise<Uint8Array> {
  try {
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
    console.error("Transaction creation error:", error);
    throw new Error("Failed to create token transaction. Please try again.");
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
      if (!transaction.message || !transaction.message.recentBlockhash) {
        throw new Error("Invalid transaction structure");
      }

      // Get the latest blockhash before sending
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.message.recentBlockhash = blockhash;

      const signature = await connection.sendTransaction(transaction, {
        maxRetries: 3,
        skipPreflight: false,
        preflightCommitment: 'processed',
        minContextSlot: await connection.getSlot('finalized'),
      });
      
      const confirmationStrategy: TransactionConfirmationStrategy = {
        signature,
        blockhash,
        lastValidBlockHeight
      };
      
      const confirmation = await connection.confirmTransaction(confirmationStrategy, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error(`Transaction confirmed but failed: ${confirmation.value.err}`);
      }
      
      return signature;
    } catch (error) {
      console.error(`Transaction attempt ${i + 1} failed:`, error);
      
      if (error instanceof SendTransactionError) {
        const logs = error.logs;
        console.error('Transaction logs:', logs);
        toast({
          title: "Transaction Failed",
          description: `Attempt ${i + 1}: ${error.message}`,
          variant: "destructive",
        });
      }
      
      lastError = error as Error;
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError || new Error('Transaction failed after multiple attempts');
}