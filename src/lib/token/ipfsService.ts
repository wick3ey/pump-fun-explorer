import { TokenMetadata } from "@/types/token";
import { fetchWithRetry } from "@/lib/utils/apiUtils";

const SUPABASE_PROJECT_ID = 'zyyipfdnmnqhiarszuqh';
const EDGE_FUNCTION_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/ipfs-upload`;

export async function uploadMetadataToIPFS(metadata: TokenMetadata): Promise<string> {
  const formData = new FormData();
  formData.append("file", metadata.pfpImage);
  formData.append("name", metadata.name);
  formData.append("symbol", metadata.symbol);
  formData.append("description", metadata.description);
  formData.append("twitter", metadata.twitter || "");
  formData.append("telegram", metadata.telegram || "");
  formData.append("website", metadata.website || "");
  formData.append("showName", "true");

  try {
    const response = await fetchWithRetry(EDGE_FUNCTION_URL, {
      method: "POST",
      body: formData,
    }, {
      maxRetries: 5,
      baseDelay: 2000,
    });

    const data = await response.json();
    if (!data.metadataUri) {
      throw new Error("Failed to get metadata URI from IPFS");
    }

    return data.metadataUri;
  } catch (error) {
    console.error("IPFS upload error:", error);
    throw new Error("Failed to upload token metadata. Please try again.");
  }
}