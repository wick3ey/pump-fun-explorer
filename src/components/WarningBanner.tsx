import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const WarningBanner = () => {
  return (
    <Alert variant="destructive" className="my-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Varning för bedrägerier</AlertTitle>
      <AlertDescription>
        Pump & dump-scheman är olagliga och kan leda till stora ekonomiska förluster. 
        Var alltid försiktig med investeringar och gör din egen research.
      </AlertDescription>
    </Alert>
  );
};