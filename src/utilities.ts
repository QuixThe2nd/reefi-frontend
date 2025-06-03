export const parseEther = (value: number, decimals = 18): bigint => BigInt(Math.round(value * Number(10n ** BigInt(decimals)) / Number(1n)));
export const formatEther = (value: bigint, decimals = 18): number => {
  const divisor = 10n ** BigInt(decimals);
  const wholePart = value / divisor;
  const fractionalPart = value % divisor;
  return fractionalPart === 0n ? Number(wholePart) : Number(`${String(wholePart)}.${fractionalPart.toString().padStart(decimals, "0").replace(/0+$/u, "")}`);
};
export const formatNumber = (number_: number, decimals = 2): string => {
  if (number_ >= 1_000_000_000) return `${(number_ / 1_000_000_000).toFixed(decimals)}B`;

  if (number_ >= 1_000_000) return `${(number_ / 1_000_000).toFixed(decimals)}M`;

  if (number_ >= 1000) return `${(number_ / 1000).toFixed(decimals)}K`;

  return number_.toFixed(decimals);
};
export const formatTime = (seconds: number, units = 2): string => {
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor(seconds % 86_400 / 3600);
  const minutes = Math.floor(seconds % 3600 / 60);
  const secs = seconds % 60;
  const parts = [];
  if (days > 0) parts.push(`${String(days)} Days`);
  if (hours > 0) parts.push(`${String(hours)} Hours`);
  if (minutes > 0) parts.push(`${String(minutes)} Minutes`);
  if (secs > 0) parts.push(`${String(secs)} Seconds`);
  return parts.slice(0, units).join(", ");
};
export const aprToApy = (apr: number): number => (1 + apr / 365) ** 365 - 1;
