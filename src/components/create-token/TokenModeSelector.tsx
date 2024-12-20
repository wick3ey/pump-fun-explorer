import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { Shield, Lock, Crown, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TokenModeSelectorProps {
  form: UseFormReturn<any>;
}

const tokenModes = [
  {
    value: "og",
    label: "OG Degen Mode",
    description: "Standard meme token with immediate trading enabled",
    icon: Crown,
    color: "text-yellow-500",
    details: "• Immediate trading enabled\n• Standard meme token creation\n• No restrictions on buying or selling"
  },
  {
    value: "doxxed",
    label: "Doxxed Degen Mode",
    description: "Verified developer identity for increased trust",
    icon: Shield,
    color: "text-green-500",
    details: "• Developer KYC verification\n• Public developer identity\n• Enhanced trust and transparency\n• Standard trading features"
  },
  {
    value: "locked",
    label: "Locked Degen Mode",
    description: "Trading locked until Raydium deployment",
    icon: Lock,
    color: "text-purple-500",
    details: "• Selling locked until Raydium deployment\n• 24h timeframe to reach bonding curve\n• Auto-refund if curve not reached (minus fees)\n• Dev investment not refundable"
  }
];

export const TokenModeSelector = ({ form }: TokenModeSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="tokenMode"
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-white flex items-center gap-2">
            Token Mode
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Select how your token will operate. Each mode has different features and security measures.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-1 gap-4"
            >
              {tokenModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <label
                    key={mode.value}
                    className={`relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      field.value === mode.value
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-[#2A2F3C] bg-[#13141F]/50 hover:border-purple-500/50"
                    }`}
                  >
                    <RadioGroupItem
                      value={mode.value}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`h-5 w-5 ${mode.color}`} />
                      <span className="text-lg font-bold text-white">{mode.label}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{mode.description}</p>
                    <div className="text-xs text-gray-500 whitespace-pre-line">{mode.details}</div>
                  </label>
                );
              })}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};