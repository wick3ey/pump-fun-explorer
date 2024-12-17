import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { TokenImageUpload, tokenImageSchema } from "./TokenImageUpload";
import { Rocket } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { SocialLinksSection } from "./SocialLinksSection";
import { SafeDegenToggle } from "./SafeDegenToggle";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(1, "Token name is required"),
  symbol: z.string().min(1, "Token symbol is required").max(10, "Symbol must be 10 characters or less"),
  description: z.string().min(1, "Description is required"),
  telegram: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  twitter: z.string().optional(),
  isSafeDegen: z.boolean().default(true),
}).merge(tokenImageSchema);

export const TokenForm = () => {
  const { toast } = useToast();
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [initialBuyAmount, setInitialBuyAmount] = useState("");

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
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setShowBuyDialog(true);
  };

  const handleCreateToken = () => {
    setShowBuyDialog(false);
    console.log("Creating token with initial buy amount:", initialBuyAmount);
    toast({
      title: "Token Created!",
      description: `Successfully created ${form.getValues("name")} (${form.getValues("symbol")})`,
    });
  };

  const handleQuickSelect = (amount: string) => {
    setInitialBuyAmount(amount);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <TokenImageUpload form={form} />

          <SafeDegenToggle form={form} />

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

          <Collapsible open={showMoreOptions} onOpenChange={setShowMoreOptions}>
            <CollapsibleTrigger className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
              {showMoreOptions ? "Hide more options ↑" : "Show more options ↓"}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-6 mt-6">
              <SocialLinksSection form={form} />
            </CollapsibleContent>
          </Collapsible>

          <div className="space-y-4">
            <p className="text-sm text-gray-400 italic">tip: coin data cannot be changed after creation</p>
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <Rocket className="mr-2 h-5 w-5" /> Launch Coin! 🚀
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
        <DialogContent className="bg-[#1A1F2C] border-[#2A2F3C] text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Initial Supply Purchase</DialogTitle>
            <DialogDescription className="text-gray-400">
              Choose how many {form.getValues("symbol")} you want to buy (optional)
              <p className="mt-2 text-sm">tip: it's optional but buying a small amount of coins helps protect your coin from snipers</p>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-2 mb-4">
              <Button 
                type="button"
                onClick={() => handleQuickSelect("1")}
                className="flex-1 bg-[#2A2F3C] hover:bg-[#3A3F4C] text-white"
              >
                1 SOL
              </Button>
              <Button 
                type="button"
                onClick={() => handleQuickSelect("3")}
                className="flex-1 bg-[#2A2F3C] hover:bg-[#3A3F4C] text-white"
              >
                3 SOL
              </Button>
              <Button 
                type="button"
                onClick={() => handleQuickSelect("5")}
                className="flex-1 bg-[#2A2F3C] hover:bg-[#3A3F4C] text-white"
              >
                5 SOL
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="0.0"
                value={initialBuyAmount}
                onChange={(e) => setInitialBuyAmount(e.target.value)}
                className="bg-[#13141F]/50 border-[#2A2F3C] text-white"
              />
              <span className="text-white">SOL</span>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowBuyDialog(false)}
              className="bg-transparent border-[#2A2F3C] text-white hover:bg-[#2A2F3C]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateToken}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Create Coin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};