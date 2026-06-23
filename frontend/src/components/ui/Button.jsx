import React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(({ className, variant = "primary", size = "default", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200",
    secondary: "bg-[#111111] text-white border border-[#2A2A2A] hover:bg-[#1A1A1A] hover:border-[#3A3A3A]",
    outline: "border border-[#2A2A2A] bg-transparent hover:bg-[#111111] text-white",
    ghost: "bg-transparent hover:bg-[#111111] text-[#A0A0A0] hover:text-white",
  };
  
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 px-3 text-xs",
    lg: "h-11 px-8",
    icon: "h-9 w-9",
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
