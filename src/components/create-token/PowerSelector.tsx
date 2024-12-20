import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { Zap, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PowerOption {
  value: string;
  power: number;
  price: number;
}

const powerOptions: PowerOption[] = [
  { value: "0", power: 0, price: 0 },
  { value: "100", power: 100, price: 0.7 },
  { value: "500", power: 500, price: 1.5 },
  { value: "1000", power: 1000, price: 3.5 },
];

interface PowerSelectorProps {
  form: UseFormReturn<any>;
}

export const PowerSelector = ({ form }: PowerSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="power"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white flex items-center gap-2">
            Power Boost (Optional)
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Boost your token's visibility and trading power. This is optional but can help increase your token's success.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              {powerOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    field.value === option.value
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-[#2A2F3C] bg-[#13141F]/50 hover:border-purple-500/50"
                  }`}
                >
                  <RadioGroupItem
                    value={option.value}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-2 text-xl font-bold text-white mb-2">
                    {option.power === 0 ? (
                      "No Boost"
                    ) : (
                      <>
                        <Zap className="h-5 w-5 text-orange-500" />
                        {option.power}
                      </>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {option.price === 0 ? "Free" : `${option.price} SOL`}
                  </div>
                </label>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};