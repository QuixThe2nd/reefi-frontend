import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProperties extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "clear";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  children: ReactNode;
  type: "submit" | "reset" | "button";
}

export const Button = ({ ref, variant = "primary", size = "md", isLoading = false, type, disabled, children, className = "", ...properties }: ButtonProperties & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  const baseClasses = "relative overflow-hidden rounded-lg font-medium transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none";

  const variants = {
    clear: "bg-transparent",
    danger: "bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:via-red-400 hover:to-rose-500 text-white shadow-lg shadow-red-500/25 hover:shadow-red-400/40 focus:ring-red-500 border border-red-500/20",
    ghost: "bg-transparent hover:bg-blue-800/20 text-blue-300 hover:text-blue-200 border border-blue-600/30 hover:border-blue-500/50 focus:ring-blue-500",
    primary: "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:via-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-400/40 focus:ring-blue-500 border border-blue-500/20",
    secondary: "bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 hover:from-slate-600 hover:via-slate-500 hover:to-slate-600 text-white shadow-lg shadow-slate-500/25 hover:shadow-slate-400/40 focus:ring-slate-500 border border-slate-500/30"
  };

  const sizes = {
    lg: "px-6 py-3 text-lg",
    md: "px-4 py-2 text-base",
    sm: "px-3 py-1.5 text-sm",
    xs: "px-2 py-1 text-xs"
  };

  return (
    <button ref={ref} disabled={disabled ?? isLoading} type={type} className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...properties}>
      {variant !== "clear" && <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-50" />}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
      <div className="relative flex items-center justify-center gap-2">
        {isLoading && <div className="animate-spin rounded-full size-4 border-2 border-white border-t-transparent" />}
        {children}
      </div>
    </button>
  );
};

Button.displayName = "Button";
