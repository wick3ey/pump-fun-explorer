import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { TokenImageUpload, tokenImageSchema } from "./TokenImageUpload";
import { PowerSelector } from "./PowerSelector";
import { TokenModeSelector } from "./TokenModeSelector";
import { Rocket, Wallet } from "lucide-react";
import { useState } from "react";
import { SocialLinksSection } from "./SocialLinksSection";
import { useWallet } from '@solana/wallet-adapter-react';
import { createToken } from "@/lib/token/createTokenTransaction";
import { FormFields } from "./FormFields";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(1, "Token name is required"),
  symbol: z.string().min(1, "Token symbol is required").max(10, "Symbol must be 10 characters or less"),
  description: z.string().min(1, "Description is required"),
  telegram: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  twitter: z.string().optional(),
  tokenMode: z.enum(["og", "doxxed", "locked"], {
    required_error: "Please select a token mode",
  }),
  power: z.string().min(1, "Power selection is required"),
  initialBuyAmount: z.number().min(0.1, "Minimum buy amount is 0.1 SOL"),
  ...tokenImageSchema.shape
});

export const TokenForm = () => {
  const { toast } = useToast();
  const wallet = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
      description: "",
      telegram: "",
      website: "",
      twitter: "",
      tokenMode: "og",
      power: "0",
      initialBuyAmount: 0.1,
    },
  });

  const handleWalletConnection = async () => {
    try {
      if (!wallet.connected && wallet.connect) {
        await wallet.connect();
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!wallet.connected || !wallet.publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a token",
        variant: "destructive",
      });
      await handleWalletConnection();
      return;
    }

    if (!values.pfpImage?.[0] || !values.headerImage?.[0]) {
      toast({
        title: "Missing Images",
        description: "Please upload both profile and header images",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const result = await createToken({
        name: values.name,
        symbol: values.symbol,
        description: values.description,
        twitter: values.twitter,
        telegram: values.telegram,
        website: values.website,
        pfpImage: values.pfpImage[0],
        headerImage: values.headerImage[0],
        tokenMode: values.tokenMode,
        power: values.power,
      }, values.initialBuyAmount, wallet);

      if (result.success && result.txUrl) {
        toast({
          title: "Token Created!",
          description: `Your token has been created successfully! View transaction: ${result.txUrl}`,
        });
        navigate(`/token/${values.symbol}`);
      }
    } catch (error) {
      console.error("Token creation error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create token. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <TokenImageUpload form={form} />
        <TokenModeSelector form={form} />
        <PowerSelector form={form} />
        <FormFields form={form} />
        <SocialLinksSection form={form} />

        <div className="space-y-4">
          <p className="text-sm text-gray-400 italic">tip: coin data cannot be changed after creation</p>
          {!wallet.connected ? (
            <Button 
              type="button"
              onClick={handleWalletConnection}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Wallet className="mr-2 h-5 w-5" /> Connect Wallet
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={isCreating}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02]"
            >
              {isCreating ? (
                "Creating Token..."
              ) : (
                <>
                  <Rocket className="mr-2 h-5 w-5" /> Launch Token! 🚀
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
