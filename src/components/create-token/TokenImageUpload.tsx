import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { UseFormReturn } from "react-hook-form";
import { ImagePlus } from "lucide-react";
import * as z from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const tokenImageSchema = z.object({
  image: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "Image is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

interface TokenImageUploadProps {
  form: UseFormReturn<any>;
}

export const TokenImageUpload = ({ form }: TokenImageUploadProps) => {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const img = new Image();
      img.onload = () => {
        if (img.width !== 500 || img.height !== 500) {
          toast({
            title: "Invalid image dimensions",
            description: "Image must be exactly 500x500 pixels",
            variant: "destructive",
          });
          e.target.value = '';
          setImagePreview(null);
          form.setValue('image', undefined as any);
        }
      };
      img.src = URL.createObjectURL(file);
    }
  };

  return (
    <>
      <div className="flex justify-center mb-8">
        <div className="relative group">
          <Avatar className="w-40 h-40 ring-4 ring-purple-500/20 transition-all duration-300 group-hover:ring-purple-500/40">
            <AvatarImage src={imagePreview || ""} alt="Token preview" className="object-cover" />
            <AvatarFallback className="bg-[#13141F]/80 text-white flex flex-col items-center justify-center">
              <ImagePlus className="w-8 h-8 mb-2" />
              <span className="text-sm">500x500</span>
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white text-sm">Change Image</span>
          </div>
        </div>
      </div>

      <FormField
        control={form.control}
        name="image"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel className="text-white">Token Image (500x500)</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  onChange(e.target.files);
                  handleImageChange(e);
                }}
                className="bg-[#13141F]/50 border-[#2A2F3C] text-white file:text-white file:bg-[#2A2F3C] file:border-0 file:rounded-md cursor-pointer hover:bg-[#13141F]/70 transition-colors file:mr-4"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};