import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MessageCircle, Link, Twitter } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface SocialLinksSectionProps {
  form: UseFormReturn<any>;
}

export const SocialLinksSection = ({ form }: SocialLinksSectionProps) => {
  return (
    <>
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
    </>
  );
};