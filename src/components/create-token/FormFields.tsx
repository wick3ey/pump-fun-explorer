import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface FormFieldsProps {
  form: UseFormReturn<any>;
}

export const FormFields = ({ form }: FormFieldsProps) => {
  return (
    <>
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
    </>
  );
};