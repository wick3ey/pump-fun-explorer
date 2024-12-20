import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { TokenImageUpload, tokenImageSchema } from "./TokenImageUpload";
import { PowerSelector } from "./PowerSelector";
import { Rocket } from "lucide-react";
import { useState } from "react";
import { SocialLinksSection } from "./SocialLinksSection";
import { SafeDegenToggle } from "./SafeDegenToggle";
import { useWallet } from '@solana/wallet-adapter-react';
import { createToken } from "@/lib/token/tokenCreator";

const formSchema = z.object({
  name: z.string().min(1, "Token name is required"),
  symbol: z.string().min(1, "Token symbol is required").max(10, "Symbol must be 10 characters or less"),
  description: z.string().min(1, "Description is required"),
  telegram: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  twitter: z.string().optional(),
  isSafeDegen: z.boolean().default(true),
  power: z.string().min(1, "Power selection is required"),
  initialBuyAmount: z.number().min(0.1, "Minimum buy amount is 0.1 SOL"),
}).merge(tokenImageSchema);

export const TokenForm = () => {
  const { toast } = useToast();
  const wallet = useWallet();
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
      description: "",
      telegram: "",
      website: "",
      twitter: "",
      isSafeDegen: true,
      power: "100",
      initialBuyAmount: 0.1,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!wallet.connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a token",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const result = await createToken(
        {
          name: values.name,
          symbol: values.symbol,
          description: values.description,
          twitter: values.twitter,
          telegram: values.telegram,
          website: values.website,
          image: values.image,
        },
        values.initialBuyAmount,
        wallet
      );

      if (result.success) {
        toast({
          title: "Token Created!",
          description: result.message,
        });
      } else {
        toast({
          title: "Error creating token",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create token. Please try again.",
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
        
        <SafeDegenToggle form={form} />
        
        <PowerSelector form={form} />

        <div className="grid gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Token Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Pepe Token" 
                    {...field}
                    className="bg-[#13141F]/50 border-[#2A2F3C] text-white placeholder:text-gray-500 focus:ring-purple-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Token Symbol</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. PEPE" 
                    {...field}
                    className="bg-[#13141F]/50 border-[#2A2F3C] text-white placeholder:text-gray-500 focus:ring-purple-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your token..." 
                  {...field}
                  className="bg-[#13141F]/50 border-[#2A2F3C] text-white placeholder:text-gray-500 focus:ring-purple-500 min-h-[120px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="initialBuyAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Initial Buy Amount (SOL)</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="0.1"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  className="bg-[#13141F]/50 border-[#2A2F3C] text-white placeholder:text-gray-500 focus:ring-purple-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SocialLinksSection form={form} />

        <div className="space-y-4">
          <p className="text-sm text-gray-400 italic">tip: coin data cannot be changed after creation</p>
          <Button 
            type="submit" 
            disabled={isCreating || !wallet.connected}
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02]"
          >
            {isCreating ? (
              "Creating Token..."
            ) : (
              <>
                <Rocket className="mr-2 h-5 w-5" /> Launch Coin! 🚀
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};