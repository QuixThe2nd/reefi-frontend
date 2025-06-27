import { coins, type TradeableCoin } from "../state/useContracts";

import React from "react";

interface NoticeProperties {
  readonly type: "recommendation" | "opportunity";
  readonly title: string;
  readonly message: string;
  readonly action: string;
  readonly icon: string;
}

const Notice: React.FC<NoticeProperties> = ({ type, title, message, action, icon }) => {
  const styles = {
    opportunity: { bg: "bg-gradient-to-r from-emerald-900/20 via-green-900/20 to-emerald-900/20", border: "border-emerald-400/40", titleColor: "text-emerald-300", messageColor: "text-emerald-100", actionColor: "text-emerald-200", iconColor: "text-emerald-400", actionBg: "bg-emerald-500/20" },
    recommendation: { bg: "bg-gradient-to-r from-blue-900/20 via-cyan-900/20 to-blue-900/20", border: "border-cyan-400/40", titleColor: "text-cyan-300", messageColor: "text-cyan-100", actionColor: "text-cyan-200", iconColor: "text-cyan-400", actionBg: "bg-cyan-500/20" }
  };
  return <div className={`rounded-xl border ${styles[type].border} ${styles[type].bg} p-4 mb-4 backdrop-blur-sm`}>
    <div className="flex items-start space-x-4">
      <div className={`${styles[type].iconColor} text-xl`}>{icon}</div>
      <div className="flex-1">
        <div className={`text-sm font-semibold ${styles[type].titleColor} mb-2`}>{title}</div>
        <div className={`text-xs ${styles[type].messageColor} mb-3 leading-relaxed`}>{message}</div>
        <div className={`inline-flex items-center px-3 py-1.5 rounded-lg ${styles[type].actionBg} border border-white/10`}>
          <span className={`text-xs font-medium ${styles[type].actionColor}`}>💡 {action}</span>
        </div>
      </div>
    </div>
  </div>;
};

const Gauge = ({ value, label, isHealthy, isWarning, isSpread = false }: Readonly<{ value: number; label: string; isHealthy: boolean; isWarning: boolean; isSpread?: boolean }>) => {
  const colors = isSpread ? { green: value <= 10, orange: value <= 20 } : { green: isHealthy, orange: isWarning };
  let color = "rgb(239 68 68)";
  if (colors.green) color = "rgb(34 197 94)";
  else if (colors.orange) color = "rgb(251 146 60)";
  let textColor = "text-red-400";
  if (colors.green) textColor = "text-green-400";
  else if (colors.orange) textColor = "text-orange-400";
  const fillValue = isSpread ? 100 - value * 10 : value;

  const displayValue = () => {
    if (isSpread) return `${value.toFixed(2)}%`;
    return value > 100 ? `${(value / 100).toFixed(1)}x` : `${value.toFixed(1)}%`;
  };

  return <div className="relative size-16">
    <svg aria-label={`${label} Gauge`} className="size-16 -rotate-90" viewBox="0 0 36 36">
      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgb(71 85 105)" strokeWidth="2" />
      <path className="transition-all duration-1000 ease-out" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={color} strokeDasharray={`${fillValue}, 100`} strokeWidth="3" />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className={`text-xs font-bold ${textColor}`}>{displayValue()}</span>
    </div>
    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-slate-400">{label}</div>
  </div>;
};

const Line = ({ pos, color, label, value, top }: Readonly<{ pos: number; color: string; label: string; value: number; show: boolean; top: `${string}%` }>) => <div className={`absolute inset-y-0 w-1 bg-gradient-to-b from-${color}-400/60 via-${color}-500/80 to-${color}-400/60 border border-${color}-400/40 shadow-lg shadow-${color}-500/30 group pointer-events-auto cursor-pointer`} style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
  <div className="size-full bg-gradient-to-b from-white/20 to-transparent" />
  <div className={`bg-${color}-500 absolute left-1/2 -translate-x-1/2 -translate-y-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 border border-${color}-400/50 rounded px-2 py-1 font-mono text-xs text-white shadow-lg pointer-events-none mb-1 whitespace-nowrap`} style={{ top }}>{value.toFixed(4)}</div>
  <div className={`text-${color}-400 absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full text-xs pointer-events-none mt-1 font-semibold ${label.includes(" ") ? "whitespace-nowrap" : ""}`}>{label}</div>
</div>;
const Marker = ({ pos, top, color, value, show = true }: Readonly<{ pos: number; top: string; color: string; label: string; value: number; show?: boolean }>) => show && <div className="absolute transition-all duration-1000 ease-out group" style={{ left: `${pos}%`, top, transform: "translate(-50%, -80%)" }}>
  <div className="flex flex-col items-center">
    <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs px-2 py-1 rounded font-mono shadow-lg mb-1 pointer-events-none bg-${color}-500 border border-${color}-400/50`}>{value.toFixed(4)}</div>
    <div className={`size-4 bg-${color}-500 rounded-full border-2 border-white shadow-lg group-hover:scale-125 transition-transform cursor-pointer pointer-events-auto`} />
  </div>
</div>;
const gradientColor = (color: string) => {
  if (color === "orange") return "orange";
  if (color === "green") return "emerald";
  return "red";
};

const getSpreadColor = (value: number): string => {
  if (value <= 10) return "text-green-400";
  else if (value <= 20) return "text-orange-400";
  return "text-red-400";
};

const Chart = <Label extends string>({ rates: unsortedRates }: Readonly<{ rates: Array<{ value: number; label: Label; color: string; required?: boolean }> }>) => {
  const rates = unsortedRates.toSorted((a, b) => b.value - a.value);
  const withPositions = rates.map(rate => {
    const distance = Math.abs(rate.value - rates[0]!.value);
    const maxDistance = Math.max(...rates.map(r => Math.abs(r.value - rates[0]!.value)), 0.01);
    return { ...rate, position: rate === rates[0]! ? 100 : Math.max(0, 100 - distance / maxDistance * 100) };
  });
  const verticalPositions = Object.fromEntries(withPositions.map((rate, i) => [rate.label, `${20 + i * 70 / Math.max(1, withPositions.length - 1)}%`])) as Record<Label, `${string}%`>;

  const pathPoints = withPositions.map(rate => `${rate.position},${verticalPositions[rate.label].replace("%", "")}`).join(" L ");

  return <div className="relative h-32 overflow-visible rounded-lg border border-slate-700/50 bg-gradient-to-r from-red-900/20 via-slate-800/40 to-green-900/20">
    {/* Separator */}
    <div className="absolute inset-0">{[0, 25, 50, 75, 100].map(p => <div className="absolute inset-y-0 w-px border-l border-slate-500/20 bg-slate-600/30" key={p} style={{ left: `${p}%` }} />)}</div>
    {/* Line */}
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 100 100">
      <defs><linearGradient id="lineGradient" x1="0%" x2="100%" y1="0%" y2="0%"><stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" /><stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" /><stop offset="100%" stopColor="#10b981" stopOpacity="0.8" /></linearGradient></defs>
      <path className="drop-shadow-lg transition-all duration-1000 ease-out" d={`M ${pathPoints}`} fill="none" stroke="url(#lineGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
    </svg>
    {/* Points */}
    {withPositions.map(rate => <Line color={rate.color} key={rate.label} label={rate.label} pos={rate.position} show top={verticalPositions[rate.label]} value={rate.value} />)}
    <div className="pointer-events-none absolute inset-0">{withPositions.map(rate => <Marker color={rate.color} key={rate.label} label={rate.label} pos={rate.position} top={verticalPositions[rate.label]} value={rate.value} />)}</div>
  </div>;
};

interface Properties<Label extends string> {
  readonly token: TradeableCoin;
  readonly targetToken: TradeableCoin;
  readonly spread: number;
  readonly softPeg?: boolean;
  readonly rates: Array<{ value: number; label: Label; color: string; required?: boolean }>;
  readonly details?: string;
}

const PegCard = <Label extends string>({ token, spread, targetToken, details, rates: unsortedRates, softPeg = false }: Properties<Label>) => {
  const rates = unsortedRates.toSorted((a, b) => a.value - b.value);
  const healthRates = rates.filter(rate => rate.required !== false).map(r => r.value);
  const targetPeg = healthRates.at(0) ?? 0;
  const adjustedTargetPeg = softPeg ? 1 - (1 - targetPeg) * 2 : targetPeg;
  const avg = healthRates.slice(1, -1).reduce((sum, number) => sum + number, 0) / (healthRates.length - 2);
  const pegHealth = Number(((avg - adjustedTargetPeg) / (healthRates.at(-1)! - adjustedTargetPeg) * 100).toFixed(2));

  const [isHealthy, isWarning] = [pegHealth > 95, pegHealth > 75 && pegHealth <= 95];

  const notices: NoticeProperties[] = [];
  if (spread >= 5) notices.push({ type: "recommendation", title: "Provide Liquidity", message: `The spread on the Curve pool is high (${spread.toFixed(2)}%).`, action: "Consider supplying liquidity to monetize high spreads", icon: "💧" });

  return <div className="relative w-full">
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 p-6 shadow-2xl backdrop-blur-xl transition-all duration-700 hover:scale-[1.02] hover:shadow-purple-500/10">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 opacity-50 transition-opacity duration-700 hover:opacity-80" />
      <div className="absolute right-4 top-4 size-32 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-60 blur-3xl transition-opacity duration-700 hover:opacity-90" />
      <div className="absolute bottom-4 left-4 size-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-40 blur-2xl transition-opacity duration-700 hover:opacity-70" />
      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img className="size-12" src={coins[token].icon} />
            <div className="text-slate-300">
              <div className="text-sm font-semibold">1 {token}</div>
              <div className="text-xs text-slate-500">→ {targetToken}</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Gauge isHealthy={token === "wstMGP" || token === "syMGP" ? true : isHealthy} isWarning={token === "wstMGP" || token === "syMGP" ? false : isWarning} label={token === "wstMGP" || token === "syMGP" ? "All Time Yield" : "Peg Health"} value={token === "wstMGP" || token === "syMGP" ? 100 * (rates.at(-1)!.value - 1) : pegHealth} />
            {spread !== 0 && <Gauge isHealthy={isHealthy} isSpread isWarning={isWarning} label="Spread" value={spread} />}
          </div>
        </div>
        {notices.length > 0 && <div className="mb-6">{notices.map(notice => <Notice key={notice.title} {...notice} />)}</div>}
        <div className="relative mb-6 rounded-xl border border-slate-700/30 bg-slate-800/20 p-4">
          <Chart rates={rates} />
          {(["Peg Health (vs Mint Rate)", "Spread"] as const).map((label, index2) => {
            const value = index2 === 0 ? pegHealth : spread;
            if (Number.isNaN(value) || value === 0) return undefined;
            const colors = index2 === 0 ? { green: isHealthy, orange: isWarning } : { green: spread <= 10, orange: spread <= 20 };
            let color = "red";
            if (colors.green) color = "green";
            else if (colors.orange) color = "orange";
            const width = index2 === 0 ? value : Math.max(0, 100 - Math.min(spread * 10, 100));
            return <div className="mt-6" key={label}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">{label}</span>
                <span className={`text-xs font-bold text-${color}-400`}>{index2 === 0 ? `${value}%` : `${spread.toFixed(2)}%`}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full border border-slate-700/50 bg-slate-800">
                <div className={`h-full rounded-full bg-gradient-to-r from-${color}-500 to-${gradientColor(color)}-${color === "red" ? "600" : "500"} transition-all duration-1000 ease-out`} style={{ width: `${width}%` }} />
              </div>
            </div>;
          })}
        </div>
        <div className={`grid grid-cols-${Math.min(6, rates.length)} gap-3`}>
          {rates.map(rate => ({ color: rate.color, label: rate.label, value: rate.value.toFixed(4) })).map(({ label, value, color }) => <div className="rounded-lg border border-slate-700/30 bg-slate-800/40 p-2 text-center" key={label}>
            <div className={`text-xs font-semibold text-${color}-400 mb-1`}>{label}</div>
            <div className={`font-mono text-xs ${label === "Spread" ? ["font-bold", getSpreadColor(spread)].join(" ") : "text-slate-200"}`}>{value}</div>
            <div className="text-[10px] text-slate-500">{label === "Spread" ? "Swap Fee" : targetToken}</div>
          </div>)}
        </div>
        <p className="mt-4 text-xs leading-tight text-gray-300">{details}</p>
      </div>
    </div>
  </div>;
};
export default PegCard;
