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
    if (!config.mint || !config.publicKey) {
      throw new Error("Ogiltig transaktionskonfiguration");
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
      throw new Error("Ogiltig transaktionsdata mottagen");
    }

    return new Uint8Array(data);
  } catch (error) {
    console.error("Fel vid skapande av transaktion:", error);
    throw new Error("Kunde inte skapa token-transaktion. Försök igen.");
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
        throw new Error("Ogiltig transaktionsstruktur");
      }

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
        const error = new Error(`Transaktion bekräftad men misslyckades: ${confirmation.value.err}`);
        await recordTransactionError(signature, error.message, 0);
        throw error;
      }
      
      return signature;
    } catch (error) {
      console.error(`Transaktionsförsök ${i + 1} misslyckades:`, error);
      
      if (error instanceof SendTransactionError) {
        const logs = error.logs;
        console.error('Transaktionsloggar:', logs);
        
        await recordTransactionError(null, error instanceof Error ? error.message : 'Okänt fel', 0);
        
        toast({
          title: "Transaktion misslyckades",
          description: `Försök ${i + 1}: ${error instanceof Error ? error.message : 'Okänt fel'}`,
          variant: "destructive",
        });
      }
      
      lastError = error instanceof Error ? error : new Error('Okänt fel inträffade');
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError || new Error('Transaktion misslyckades efter flera försök');
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
      console.error("Kunde inte registrera transaktionsfel:", error);
    }
  } catch (err) {
    console.error("Fel vid registrering av transaktionsmisslyckande:", err);
  }
}