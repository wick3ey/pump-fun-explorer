import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { UseFormReturn } from "react-hook-form";
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
      <div className="flex justify-center mb-6">
        <Avatar className="w-32 h-32">
          <AvatarImage src={imagePreview || ""} alt="Token preview" />
          <AvatarFallback className="bg-[#13141F] text-white">
            500x500
          </AvatarFallback>
        </Avatar>
      </div>

      <FormField
        control={form.control}
        name="image"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel>Token Image (500x500)</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  onChange(e.target.files);
                  handleImageChange(e);
                }}
                className="bg-[#13141F] border-[#2A2F3C] text-white file:text-white file:bg-[#2A2F3C] file:border-0 file:rounded-md cursor-pointer"
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