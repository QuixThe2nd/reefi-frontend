import * as React from "react";

interface TokenData {
  mint: number;
  marketBuy: number;
  spread: number;
  marketSell: number;
  burn: number;
  originalMint?: number;
  originalBurn?: number;
}

interface PegCardProperties {
  token: string;
  data: TokenData;
  targetToken: string;
}

interface GaugeProperties {
  value: number;
  label: string;
  isHealthy: boolean;
  isWarning: boolean;
  spread?: number;
  isSpread?: boolean;
}

interface MarkerProperties {
  pos: number;
  top: string;
  color: string;
  label: string;
  value: number;
  show?: boolean;
}

interface LineProperties {
  pos: number;
  color: string;
  label: string;
  value: number;
  show: boolean;
  top: string;
}

interface NoticeProperties {
  type: "opportunity" | "recommendation" | "caution";
  title: string;
  message: string;
  action: string;
  icon: string;
}

const Notice: React.FC<NoticeProperties> = ({ type, title, message, action, icon }) => {
  const styles = {
    opportunity: {
      bg: "bg-gradient-to-r from-emerald-900/20 via-green-900/20 to-emerald-900/20",
      border: "border-emerald-400/40",
      titleColor: "text-emerald-300",
      messageColor: "text-emerald-100",
      actionColor: "text-emerald-200",
      iconColor: "text-emerald-400",
      actionBg: "bg-emerald-500/20"
    },
    recommendation: {
      bg: "bg-gradient-to-r from-blue-900/20 via-cyan-900/20 to-blue-900/20",
      border: "border-cyan-400/40",
      titleColor: "text-cyan-300",
      messageColor: "text-cyan-100",
      actionColor: "text-cyan-200",
      iconColor: "text-cyan-400",
      actionBg: "bg-cyan-500/20"
    },
    caution: {
      bg: "bg-gradient-to-r from-amber-900/20 via-yellow-900/20 to-amber-900/20",
      border: "border-amber-400/40",
      titleColor: "text-amber-300",
      messageColor: "text-amber-100",
      actionColor: "text-amber-200",
      iconColor: "text-amber-400",
      actionBg: "bg-amber-500/20"
    }
  };

  const style = styles[type];

  return (
    <div className={`rounded-xl border ${style.border} ${style.bg} p-4 mb-4 backdrop-blur-sm`}>
      <div className="flex items-start space-x-4">
        <div className={`${style.iconColor} text-xl`}>{icon}</div>
        <div className="flex-1">
          <div className={`text-sm font-semibold ${style.titleColor} mb-2`}>{title}</div>
          <div className={`text-xs ${style.messageColor} mb-3 leading-relaxed`}>{message}</div>
          <div className={`inline-flex items-center px-3 py-1.5 rounded-lg ${style.actionBg} border border-white/10`}>
            <span className={`text-xs font-medium ${style.actionColor}`}>💡 {action}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Gauge: React.FC<GaugeProperties> = ({ value, label, isHealthy, isWarning, isSpread = false }) => {
  const colors = isSpread ? { green: value <= 10, orange: value <= 20 } : { green: isHealthy, orange: isWarning };
  let color = "rgb(239 68 68)";
  if (colors.green) color = "rgb(34 197 94)";
  else if (colors.orange) color = "rgb(251 146 60)";
  let textColor = "text-red-400";
  if (colors.green) textColor = "text-green-400";
  else if (colors.orange) textColor = "text-orange-400";
  const fillValue = isSpread ? Math.max(0, 100 - Math.min(value * 3.33, 100)) : value;

  return (
    <div className="relative size-16">
      <svg className="size-16 -rotate-90" viewBox="0 0 36 36">
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgb(71 85 105)" strokeWidth="2"/>
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${fillValue}, 100`} className="transition-all duration-1000 ease-out"/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xs font-bold ${textColor}`}>{isSpread ? `${value.toFixed(2)}%` : `${Math.round(value)}%`}</span>
      </div>
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-slate-400">{label}</div>
    </div>
  );
};

const Line: React.FC<LineProperties> = ({ pos, color, label, value, top }) => <div className={`absolute inset-y-0 w-1 bg-gradient-to-b from-${color}-400/60 via-${color}-500/80 to-${color}-400/60 border border-${color}-400/40 shadow-lg shadow-${color}-500/30 group pointer-events-auto cursor-pointer`} style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
  <div className="size-full bg-gradient-to-b from-white/20 to-transparent"></div>
  <div className={`bg-${color}-500 absolute left-1/2 -translate-x-1/2 -translate-y-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 border border-${color}-400/50 rounded px-2 py-1 font-mono text-xs text-white shadow-lg pointer-events-none mb-1 whitespace-nowrap`} style={{ top }}>{value.toFixed(4)}</div>
  <div className={`text-${color}-400 absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full text-xs pointer-events-none mt-1 font-semibold ${label.includes(" ") ? "whitespace-nowrap" : ""}`}>{label}</div>
</div>;

const Marker: React.FC<MarkerProperties> = ({ pos, top, color, value, show = true }) => show &&
  <div className="absolute transition-all duration-1000 ease-out group" style={{ left: `${pos}%`, top, transform: "translate(-50%, -80%)" }}>
    <div className="flex flex-col items-center">
      <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs px-2 py-1 rounded font-mono shadow-lg mb-1 pointer-events-none bg-${color}-500 border border-${color}-400/50`}>{value.toFixed(4)}</div>
      <div className={`size-4 bg-${color}-500 rounded-full border-2 border-white shadow-lg group-hover:scale-125 transition-transform cursor-pointer pointer-events-auto`}></div>
    </div>
  </div>;

const PegCard: React.FC<PegCardProperties> = ({ token, data, targetToken }) => {
  const { mint, marketBuy, marketSell, burn, spread, originalMint, originalBurn } = data;

  const [buyDistribution, sellDistribution, burnDistribution, originalMintDistribution, originalBurnDistribution] = [
    Math.abs(marketBuy - mint),
    Math.abs(marketSell - mint),
    Math.abs(burn - mint),
    originalMint ? Math.abs(originalMint - mint) : 0,
    originalBurn ? Math.abs(originalBurn - mint) : 0
  ];

  const maxDistribution = Math.max(buyDistribution, sellDistribution, burnDistribution, originalMintDistribution, originalBurnDistribution, 0.01);
  const [mintPos, buyPos, sellPos, burnPos, originalMintPos, originalBurnPos] = [
    100,
    Math.max(0, 100 - buyDistribution / maxDistribution * 100),
    Math.max(0, 100 - sellDistribution / maxDistribution * 100),
    Math.max(0, 100 - burnDistribution / maxDistribution * 100),
    originalMint ? Math.max(0, 100 - originalMintDistribution / maxDistribution * 100) : undefined,
    originalBurn ? Math.max(0, 100 - originalBurnDistribution / maxDistribution * 100) : undefined
  ];

  const values = originalMintPos === undefined ? [buyPos, sellPos] : [buyPos, sellPos, originalMintPos];
  const healthScore = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const [isHealthy, isWarning] = [healthScore > 95, healthScore > 75 && healthScore <= 95];

  // Generate actionable recommendations based on spread and health
  const notices: NoticeProperties[] = [];

  if (spread >= 5) notices.push({ type: "recommendation", title: "Provide Liquidity", message: `The spread between the buy and sell price on Curve is ${spread.toFixed(2)}%.`, action: "Consider supplying liquidity to monetize high spreads and tighten the peg", icon: "💧" });
  if (mint < marketSell) notices.push({ type: "recommendation", title: "Arbitrage", message: "The mint price is less than the market sell price.", action: `Consider minting ${token} then selling`, icon: "💧" });
  if (burn > marketBuy) notices.push({ type: "recommendation", title: "Arbitrage", message: "The burn price is higher than the market buy price.", action: `Consider buying ${token} then burning`, icon: "💧" });

  const allRates = [
    { value: mint, pos: mintPos, label: "Mint", color: "green" },
    { value: marketBuy, pos: buyPos, label: "Buy", color: "blue" },
    { value: marketSell, pos: sellPos, label: "Sell", color: "red" },
    { value: burn, pos: burnPos, label: "Burn", color: "slate" },
    ...originalMint === undefined ? [] : [{ value: originalMint, pos: originalMintPos, label: "Orig Mint", color: "emerald" }],
    ...originalBurn === undefined ? [] : [{ value: originalBurn, pos: originalBurnPos, label: "Orig Burn", color: "gray" }]
  ] as const;

  const sortedRates = [...allRates].sort((a, b) => b.value - a.value);

  // Define all possible rate labels as a union type
  type RateLabel = "Mint" | "Buy" | "Sell" | "Burn" | "Orig Mint" | "Orig Burn";
  const topPositions: Record<RateLabel, string> = {} as Record<RateLabel, string>;
  let index = 0;
  for (const rate of sortedRates) {
    const topPercent = 20 + index * 70 / Math.max(1, sortedRates.length - 1);
    topPositions[rate.label as RateLabel] = `${String(topPercent)}%`;
    index++;
  }

  // Generate SVG path points based on sorted order - fixed
  const svgPathPoints = sortedRates.map(rate => {
    const label = rate.label as RateLabel;
    const topPercent = Number(topPositions[label].replace("%", ""));
    return `${String(rate.pos)},${String(topPercent)}`;
  }).join(" L ");

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 p-6 shadow-2xl backdrop-blur-xl transition-all duration-700 hover:scale-[1.02] hover:shadow-purple-500/10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 opacity-50 transition-opacity duration-700 hover:opacity-80"></div>
        <div className="absolute right-4 top-4 size-32 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-60 blur-3xl transition-opacity duration-700 hover:opacity-90"></div>
        <div className="absolute bottom-4 left-4 size-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-40 blur-2xl transition-opacity duration-700 hover:opacity-70"></div>

        <div className="relative z-10">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative flex size-12 items-center justify-center rounded-xl border border-blue-400/30 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-sm font-bold text-white shadow-xl">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <span className="relative">{token}</span>
              </div>
              <div className="text-slate-300">
                <div className="text-sm font-semibold">1 {token}</div>
                <div className="text-xs text-slate-500">→ {targetToken}</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Gauge value={healthScore} label="Peg Health" isHealthy={isHealthy} isWarning={isWarning} />
              <Gauge value={spread} label="Spread" isHealthy={isHealthy} isWarning={isWarning} isSpread />
            </div>
          </div>

          {notices.length > 0 &&
            <div className="mb-6">
              {notices.map((notice, index) => <Notice key={index} {...notice} />)}
            </div>
          }

          <div className="relative mb-6 rounded-xl border border-slate-700/30 bg-slate-800/20 p-4">
            <div className="relative h-32 overflow-visible rounded-lg border border-slate-700/50 bg-gradient-to-r from-red-900/20 via-slate-800/40 to-green-900/20">
              <div className="absolute inset-0">
                {[0, 25, 50, 75, 100].map(p => <div key={p} className="absolute inset-y-0 w-px border-l border-slate-500/20 bg-slate-600/30" style={{ left: `${p}%` }}></div>)}
              </div>

              {allRates.map(rate => <Line key={rate.label} pos={rate.pos} color={rate.color} label={rate.label} value={rate.value} show={true} top={topPositions[rate.label] ?? 0} />)}

              <svg className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8"/>
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.8"/>
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.3"/>
                  </linearGradient>
                </defs>
                <path d={`M ${svgPathPoints}`} stroke="url(#lineGradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg transition-all duration-1000 ease-out"/>
                <path d={`M ${buyPos},${Number(topPositions.Buy.replace("%", ""))} L ${sellPos},${Number(topPositions.Sell.replace("%", ""))}`} stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" fill="none" className="opacity-80 transition-all duration-1000 ease-out"/>
              </svg>

              <div className="pointer-events-none absolute inset-0">
                {allRates.map(rate => {
                  const topPercent = Number(topPositions[rate.label].replace("%", ""));
                  // Convert SVG viewBox coordinate (0-100) to CSS percentage for proper alignment
                  const adjustedTop = `${topPercent}%`;
                  return <Marker key={rate.label} pos={rate.pos} top={adjustedTop} color={rate.color} label={rate.label} value={rate.value} />;
                })}
              </div>

              <div className="absolute inset-x-0 bottom-1 flex justify-end px-2 text-xs text-slate-500">
                <span>Closer to mint rate</span>
              </div>
            </div>

            {(["Peg Health (vs Mint Rate)", "Spread"] as const).map((label, index) => {
              const value = index === 0 ? healthScore : spread;
              const colors = index === 0 ? { green: isHealthy, orange: isWarning } : { green: spread <= 10, orange: spread <= 20 };
              let color = "red";
              if (colors.green) color = "green";
              else if (colors.orange) color = "orange";
              const width = index === 0 ? value : Math.max(0, 100 - Math.min(spread, 100));
              return (
                <div key={label} className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{label}</span>
                    <span className={`text-xs font-bold text-${color}-400`}>{index === 0 ? `${value}%` : `${spread.toFixed(2)}%`}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full border border-slate-700/50 bg-slate-800">
                    <div className={`h-full rounded-full bg-gradient-to-r from-${color}-500 to-${color === "orange" ? "orange" : color === 'green' ? 'emerald' : 'red'}-${color === "red" ? "600" : "500"} transition-all duration-1000 ease-out`} style={{ width: `${width}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-5 gap-3">
            {[
              { color: "emerald", label: "Mint", value: mint.toFixed(4) },
              { color: "blue", label: "Buy", value: marketBuy.toFixed(4) },
              { color: "orange", label: "Spread", value: `${spread.toFixed(2)}%` },
              { color: "red", label: "Sell", value: marketSell.toFixed(4) },
              { color: "slate", label: "Burn", value: burn.toFixed(4) }
            ].map(({ label, value, color }) => <div key={label} className="rounded-lg border border-slate-700/30 bg-slate-800/40 p-2 text-center">
              <div className={`text-xs font-semibold text-${color}-400 mb-1`}>{label}</div>
              <div className={`font-mono text-xs ${label === "Spread" ? `font-bold ${spread <= 10 ? "text-green-400" : spread <= 20 ? 'text-orange-400' : 'text-red-400'}` : "text-slate-200"}`}>{value}</div>
              <div className="text-[10px] text-slate-500">{label === "Spread" ? "depeg risk" : targetToken}</div>
            </div>)}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PegCard;
