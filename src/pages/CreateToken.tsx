import { Card, CardContent } from "@/components/ui/card";
import { TokenForm } from "@/components/create-token/TokenForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateToken = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#13141F] text-white pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-purple-400"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-bold text-center flex-1">Create Your Token</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-purple-400"
            onClick={() => navigate('/')}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
          <Card className="bg-[#1A1F2C] border-[#2A2F3C]">
            <CardContent className="p-6">
              <TokenForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateToken;