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
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-900": variant === "primary",
            "bg-gold-500 text-brand-900 hover:bg-gold-600 active:bg-gold-700": variant === "secondary",
            "border-2 border-brand-700 text-brand-700 hover:bg-brand-50 active:bg-brand-100": variant === "outline",
            "text-brand-700 hover:bg-brand-50 active:bg-brand-100": variant === "ghost",
            "px-4 py-2 text-sm rounded-md": size === "sm",
            "px-6 py-3 text-base rounded-lg": size === "md",
            "px-8 py-4 text-lg rounded-xl": size === "lg",
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
