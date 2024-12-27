import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const WarningBanner = () => {
  return (
    <Alert variant="destructive" className="my-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Warning: Fraud Risk</AlertTitle>
      <AlertDescription>
        Pump & dump schemes are illegal and can lead to significant financial losses.
        Always be cautious with investments and do your own research.
      </AlertDescription>
    </Alert>
  );
};