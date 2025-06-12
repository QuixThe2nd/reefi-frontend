import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProperties extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children: ReactNode;
  readonly type: "submit" | "reset" | "button";
  readonly variant?: "primary" | "secondary" | "danger" | "ghost" | "clear";
  readonly size?: "xs" | "sm" | "md" | "lg";
  readonly isLoading?: boolean;
  readonly tooltip?: string;
  readonly tooltipPosition?: "top" | "bottom" | "left" | "right";
}

export const Button = ({ ref, variant = "primary", size = "md", isLoading = false, type, disabled, children, className = "", tooltip, tooltipPosition = "top", ...properties }: ButtonProperties & Readonly<{ ref?: React.RefObject<HTMLButtonElement | null> }>) => {
  const baseClasses = "relative rounded-lg font-medium transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none";

  const variants = {
    clear: "bg-transparent",
    danger: "bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:via-red-400 hover:to-rose-500 text-white shadow-lg shadow-red-500/25 hover:shadow-red-400/40 focus:ring-red-500 border border-red-500/20",
    ghost: "bg-transparent hover:bg-blue-800/20 text-blue-300 hover:text-blue-200 border border-blue-600/30 hover:border-blue-500/50 focus:ring-blue-500",
    primary: "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:via-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-400/40 focus:ring-blue-500 border border-blue-500/20",
    secondary: "bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 hover:from-slate-600 hover:via-slate-500 hover:to-slate-600 text-white shadow-lg shadow-slate-500/25 hover:shadow-slate-400/40 focus:ring-slate-500 border border-slate-500/30"
  };

  const sizes = {
    lg: "text-lg",
    md: "text-base",
    sm: "text-sm",
    xs: "text-xs"
  };

  const tooltipClasses = tooltip ? "group" : "";

  const tooltipPositionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  };

  const tooltipArrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800",
    left: "left-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-800",
    right: "right-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800"
  };

  const color = () => {
    if (size === "lg") return "px-6 py-3";
    if (size === "md") return "px-4 py-2";
    if (size === "sm") return "px-3 py-1.5";
    return "px-2 py-1";
  };

  return <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${tooltipClasses} ${className}`} disabled={disabled ?? isLoading} ref={ref} type={type} {...properties}>
    <div className="relative overflow-hidden rounded-lg size-full">
      {variant !== "clear" && <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-50" />}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
      <div className="relative flex items-center justify-center gap-2 h-full">
        <div className={`flex items-center justify-center gap-2 ${color()}`}>{isLoading ? <div className="animate-spin rounded-full size-4 border-2 border-white border-t-transparent" /> : undefined}{children}</div>
      </div>
    </div>
    {tooltip ? <div className={`absolute z-50 pointer-events-none opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 ${tooltipPositionClasses[tooltipPosition]}`}>
      <div className="bg-gray-800 text-white text-sm px-2 py-1 rounded whitespace-nowrap shadow-lg border border-gray-700">{tooltip}</div>
      <div className={`absolute size-0 ${tooltipArrowClasses[tooltipPosition]}`} />
    </div> : undefined}
  </button>;
};

Button.displayName = "Button";
