import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { Zap } from "lucide-react";

interface PowerOption {
  value: string;
  power: number;
  price: number;
}

const powerOptions: PowerOption[] = [
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
          <FormLabel className="text-white">Power Boost</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
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
                    <Zap className="h-5 w-5 text-orange-500" />
                    {option.power}
                  </div>
                  <div className="text-sm text-gray-400">
                    {option.price} SOL
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