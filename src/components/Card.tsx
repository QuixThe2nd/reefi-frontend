import { ReactNode } from "react";

interface CardProperties {
  readonly children: ReactNode;
  readonly className?: string;
  readonly padding?: number;
}

export const Card = ({ children, padding = 6, className = "" }: CardProperties) => <div className={`rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 p-${String(padding)} shadow-2xl backdrop-blur-xl transition-all duration-400 hover:scale-[1.01] hover:shadow-purple-500/10 ${className}`}>
  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 opacity-50 transition-opacity duration-400 hover:opacity-80 pointer-events-none"></div>
  <div className="absolute right-4 top-4 size-32 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-60 blur-3xl transition-opacity duration-400 hover:opacity-90 pointer-events-none"></div>
  <div className="absolute bottom-4 left-4 size-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-40 blur-2xl transition-opacity duration-400 hover:opacity-70 pointer-events-none"></div>
  <div className="relative z-10 w-full">
    <div className="flex flex-col w-full items-center">{children}</div>
  </div>
</div>;
