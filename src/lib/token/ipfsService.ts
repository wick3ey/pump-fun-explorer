import { TokenMetadata } from "@/types/token";
import { supabase } from "@/integrations/supabase/client";

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
    console.log("Uploading metadata to IPFS via Edge Function...");
    const { data, error } = await supabase.functions.invoke('ipfs-upload', {
      body: formData,
    });

    if (error) {
      console.error("IPFS upload error:", error);
      throw new Error("Failed to upload token metadata");
    }

    if (!data.metadataUri) {
      throw new Error("Failed to get metadata URI from IPFS");
    }

    console.log("Successfully uploaded to IPFS:", data);
    return data.metadataUri;
  } catch (error) {
    console.error("IPFS upload error:", error);
    throw new Error("Failed to upload token metadata. Please try again.");
  }
}