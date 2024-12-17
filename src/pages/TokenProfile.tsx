import { Card } from "@/components/ui/card";
import { TokenChart } from "@/components/TokenChart";
import { TokenInfo } from "@/components/TokenInfo";
import { TransactionHistory } from "@/components/TransactionHistory";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TokenHeader } from "@/components/TokenHeader";

const TokenProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#13141F] text-white">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <TokenHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TokenChart />
          </div>
          <div>
            <TokenInfo />
          </div>
        </div>

        <div className="mt-6">
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
};

export default TokenProfile;