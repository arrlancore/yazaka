"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function RefreshButton() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Button onClick={handleRefresh} className="w-full">
      <RefreshCw className="w-4 h-4 mr-2" />
      Coba Lagi
    </Button>
  );
}