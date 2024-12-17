import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string().min(1, "Token name is required"),
  symbol: z.string().min(1, "Token symbol is required").max(10, "Symbol must be 10 characters or less"),
  description: z.string().min(1, "Description is required"),
  supply: z.string().min(1, "Supply is required"),
  image: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "Image is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

const CreateToken = () => {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
      description: "",
      supply: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Create a new Image object to check dimensions
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Token Created!",
      description: `Successfully created ${values.name} (${values.symbol})`,
    });
  };

  return (
    <div className="min-h-screen bg-[#13141F] text-white pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-center mb-8">Create Your Token</h1>
          
          <Card className="bg-[#1A1F2C] border-[#2A2F3C]">
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Pepe Token" 
                            {...field}
                            className="bg-[#13141F] border-[#2A2F3C] text-white"
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
                        <FormLabel>Token Symbol</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. PEPE" 
                            {...field}
                            className="bg-[#13141F] border-[#2A2F3C] text-white"
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your token..." 
                            {...field}
                            className="bg-[#13141F] border-[#2A2F3C] text-white min-h-[100px]"
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
                        <FormLabel>Total Supply</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g. 1000000" 
                            {...field}
                            className="bg-[#13141F] border-[#2A2F3C] text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Create Token
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateToken;