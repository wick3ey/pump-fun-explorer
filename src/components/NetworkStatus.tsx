import { CheckCircle2, AlertCircle } from "lucide-react";

type NetworkStatus = "online" | "maintenance" | "down";

interface NetworkStatusProps {
  status: NetworkStatus;
}

const getStatusConfig = (status: NetworkStatus) => {
  switch (status) {
    case "online":
      return {
        bgColor: "bg-green-500",
        icon: <CheckCircle2 className="h-4 w-4 text-green-100" />,
        text: "Network Stable - Online",
      };
    case "maintenance":
      return {
        bgColor: "bg-yellow-500",
        icon: <AlertCircle className="h-4 w-4 text-yellow-100" />,
        text: "Network Maintenance",
      };
    case "down":
      return {
        bgColor: "bg-red-500",
        icon: <AlertCircle className="h-4 w-4 text-red-100" />,
        text: "Network Down",
      };
  }
};

export const NetworkStatus = ({ status }: NetworkStatusProps) => {
  const config = getStatusConfig(status);

  return (
    <div className={`w-full ${config.bgColor}`}>
      <div className="container mx-auto px-4 py-1.5 flex items-center justify-center gap-2 text-white">
        {config.icon}
        <span className="text-sm font-medium">{config.text}</span>
      </div>
    </div>
  );
};