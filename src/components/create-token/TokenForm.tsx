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

const formSchema = z.object({
  name: z.string().min(1, "Token name is required"),
  symbol: z.string().min(1, "Token symbol is required").max(10, "Symbol must be 10 characters or less"),
  description: z.string().min(1, "Description is required"),
  supply: z.string().min(1, "Supply is required"),
}).merge(tokenImageSchema);

export const TokenForm = () => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
      description: "",
      supply: "",
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
          name="supply"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Total Supply</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="e.g. 1000000" 
                  {...field}
                  className="bg-[#13141F]/50 border-[#2A2F3C] text-white placeholder:text-gray-500 focus:ring-purple-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02]"
        >
          <Rocket className="mr-2 h-5 w-5" /> Launch Token
        </Button>
      </form>
    </Form>
  );
};