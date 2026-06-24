import { LoadingSwap } from "@/components/ui/loading-swap";
import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import React from "react";

const LoadingAgencyPage = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className={cn("col-start-1 col-end-2 row-start-1 row-end-2")}>
        <Loader2Icon className="animate-spin" />
      </div>
    </div>
  );
};

export default LoadingAgencyPage;
