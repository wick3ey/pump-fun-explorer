import { Connection, VersionedTransaction, TransactionConfirmationStrategy } from "@solana/web3.js";
import { fetchWithRetry } from "@/lib/utils/apiUtils";
import { TransactionConfig } from "./types";

const PUMP_PORTAL_API_BASE = 'https://pumpportal.fun/api';

export async function getCreateTransaction(config: TransactionConfig): Promise<Uint8Array> {
  try {
    // Ensure we have a valid mint address
    if (!config.mint) {
      throw new Error("Mint address is required");
    }

    const response = await fetchWithRetry(`${PUMP_PORTAL_API_BASE}/trade-local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicKey: config.publicKey,
        action: "create",
        tokenMetadata: {
          name: config.metadata.name,
          symbol: config.metadata.symbol,
          uri: config.metadataUri,
        },
        mint: config.mint.toString(), // Ensure mint is converted to string
        denominatedInSol: "true",
        amount: config.initialBuyAmount,
        slippage: 10,
        priorityFee: 0.0005,
        pool: "pump"
      })
    });

    const data = await response.arrayBuffer();
    if (!data || data.byteLength === 0) {
      throw new Error("Received empty transaction data");
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
  maxRetries = 3
): Promise<string> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const signature = await connection.sendTransaction(transaction, {
        maxRetries: 3,
        skipPreflight: false,
      });
      
      const confirmationStrategy: TransactionConfirmationStrategy = {
        signature,
        blockhash: transaction.message.recentBlockhash,
        lastValidBlockHeight: await connection.getBlockHeight()
      };
      
      const confirmation = await connection.confirmTransaction(confirmationStrategy);
      
      if (confirmation.value.err) {
        throw new Error(`Transaction confirmed but failed: ${confirmation.value.err}`);
      }
      
      return signature;
    } catch (error) {
      console.error(`Transaction attempt ${i + 1} failed:`, error);
      lastError = error as Error;
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  throw lastError || new Error('Transaction failed after multiple attempts');
}