import { cn } from "@/lib/utils";
import { forwardRef, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-400/50 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-brand-900 text-white hover:bg-brand-800 shadow-lg shadow-brand-900/15": variant === "primary",
            "bg-accent-400 text-brand-900 hover:bg-accent-300 shadow-lg shadow-accent-400/20": variant === "secondary",
            "border-2 border-brand-300 text-brand-700 hover:border-brand-500 hover:bg-brand-50": variant === "outline",
            "text-brand-700 hover:bg-brand-100": variant === "ghost",
            "px-5 py-2.5 text-sm rounded-lg": size === "sm",
            "px-7 py-3.5 text-base rounded-xl": size === "md",
            "px-9 py-4 text-lg rounded-xl": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
