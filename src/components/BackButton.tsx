import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  /** Route to navigate back to */
  route: string;
  /** Optional button text override */
  label?: string;
}

export function BackButton({ route, label = "Back" }: BackButtonProps) {
  const navigate = useNavigate();
  return (
    <Button
      variant="outline"
      onClick={() => navigate(route)}
      className="mb-4 flex items-center"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
