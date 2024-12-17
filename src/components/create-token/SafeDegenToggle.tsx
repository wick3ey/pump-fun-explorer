import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { Lock, Flame } from "lucide-react";

interface SafeDegenToggleProps {
  form: UseFormReturn<any>;
}

export const SafeDegenToggle = ({ form }: SafeDegenToggleProps) => {
  return (
    <FormField
      control={form.control}
      name="isSafeDegen"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-white">Token Mode</FormLabel>
          <FormControl>
            <div className="flex items-center space-x-4">
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className={field.value ? "bg-green-500" : "bg-red-500"}
              />
              <div className="flex items-center gap-2">
                {field.value ? (
                  <>
                    <Lock className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">Safe Degen</span>
                  </>
                ) : (
                  <>
                    <Flame className="h-4 w-4 text-red-500" />
                    <span className="text-red-500">Degen Mode</span>
                  </>
                )}
              </div>
            </div>
          </FormControl>
          <FormDescription className="text-gray-400">
            {field.value 
              ? "Tokens are locked until bonding curve is reached. If not reached within 24h, all funds are returned."
              : "Standard token mode with immediate trading enabled."
            }
          </FormDescription>
        </FormItem>
      )}
    />
  );
};