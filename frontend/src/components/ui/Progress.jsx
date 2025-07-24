import React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "../../lib/utils";

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-slate-900/20",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500 transition-all duration-500 ease-out"
      style={{ 
        transform: `translateX(-${100 - (value || 0)}%)`,
        backgroundImage: value >= 80 
          ? "linear-gradient(90deg, #f97316 0%, #eab308 40%, #22c55e 100%)"
          : value >= 50
          ? "linear-gradient(90deg, #f97316 0%, #eab308 100%)"
          : "linear-gradient(90deg, #f97316 0%, #f97316 100%)"
      }}
    />
  </ProgressPrimitive.Root>
));

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
