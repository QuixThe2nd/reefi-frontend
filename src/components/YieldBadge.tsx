import { memo, type ReactElement } from "react";

type Yield = Readonly<{
  asset: string;
  logo: string;
  suffix?: "+";
}> & (Readonly<{
  apy: number;
  apr?: undefined;
  value?: number;
}> | Readonly<{
  apr: number;
  apy?: undefined;
  value?: number;
} | Readonly<{
  value: string | number;
  apr?: undefined;
  apy?: undefined;
}>>);

type Properties = Yield & Readonly<{ breakdown: Yield[] }>;

const BadgeComponent = ({ title, value, breakdown }: Readonly<{ title: string; value: string; breakdown?: Yield[] }>): ReactElement => <div className="group relative flex cursor-help items-center rounded-lg bg-gray-700 px-3 py-1 text-sm" title={`${title}: ${value}`}>
  <div className="mr-2 size-2 rounded-full bg-blue-400" />
  <span>{title}: {value}</span>
  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 min-w-54 -translate-x-1/2 rounded bg-black px-3 py-2 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
    <div className="space-y-1">
      {breakdown?.map(item => {
        let displayValue: string | number;
        if (item.value !== undefined) displayValue = item.value;
        else if (item.apy === undefined) displayValue = `${((item.apr ?? 0) * 100).toFixed(2)}% APR`;
        else displayValue = `${(item.apy * 100).toFixed(2)}% APY`;
        return <div className="flex justify-between gap-2" key={item.asset}>
          <div className="flex gap-1">
            <img className="size-4" src={item.logo} />
            <span>{item.asset}:</span>
          </div>
          <span>{displayValue}
          </span>
        </div>;
      })}
    </div>
  </div>
</div>;

export const Badge = memo(BadgeComponent);

export const YieldBadge = memo(({ asset, apy, apr, suffix, breakdown, value }: Properties): ReactElement => {
  const yieldType = apy === undefined ? "APR" : "APY";
  const yieldValue = apy ?? apr;
  const percentage = yieldValue ? Math.round(yieldValue * 10_000) / 100 : undefined;
  const valueString = percentage ? `${String(percentage)}%` : String(value);
  return <Badge breakdown={breakdown} title={`${asset} ${yieldType}`} value={valueString + (suffix ?? "")} />;
});
YieldBadge.displayName = "YieldBadge";
