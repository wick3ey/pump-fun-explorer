import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { TokenImageUpload, tokenImageSchema } from "./TokenImageUpload";
import { Rocket, Link, Twitter, MessageCircle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Token name is required"),
  symbol: z.string().min(1, "Token symbol is required").max(10, "Symbol must be 10 characters or less"),
  price: z.string().min(1, "Initial price is required"),
  description: z.string().min(1, "Description is required"),
  telegram: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  twitter: z.string().optional(),
}).merge(tokenImageSchema);

export const TokenForm = () => {
  const { toast } = useToast();
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
      price: "",
      description: "",
      telegram: "",
      website: "",
      twitter: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Token Created!",
      description: `Successfully created ${values.name} (${values.symbol})`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <TokenImageUpload form={form} />

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
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Initial Price ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.000001"
                  placeholder="e.g. 0.000001" 
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
            <FormField
              control={form.control}
              name="telegram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Telegram Link (optional)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://t.me/yourgroup" 
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
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Website Link (optional)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://yourwebsite.com" 
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
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter or X Link (optional)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://x.com/yourusername" 
                      {...field}
                      className="bg-[#13141F]/50 border-[#2A2F3C] text-white placeholder:text-gray-500 focus:ring-purple-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CollapsibleContent>
        </Collapsible>

        <div className="space-y-4">
          <p className="text-sm text-gray-400 italic">tip: coin data cannot be changed after creation</p>
          <p className="text-sm text-purple-400">when your coin completes its bonding curve you receive 0.5 SOL</p>
          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02]"
          >
            <Rocket className="mr-2 h-5 w-5" /> Create Coin
          </Button>
        </div>
      </form>
    </Form>
  );
};