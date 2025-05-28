export const parseEther = (value: number, decimals = 18): bigint => BigInt(Math.round((value * Number(10n ** BigInt(decimals))) / Number(1n)))
export const formatEther = (value: bigint, decimals = 18): number => {
  const divisor = 10n ** BigInt(decimals)
  const wholePart = value / divisor
  const fractionalPart = value % divisor
  return fractionalPart === 0n ? Number(wholePart) : Number(`${wholePart}.${fractionalPart.toString().padStart(decimals, '0').replace(/0+$/, '')}`)
}
export const formatNumber = (num: number, decimals = 2): string => num >= 1_000_000_000 ? `${(num / 1_000_000_000).toFixed(decimals)}B` : num >= 1_000_000 ? `${(num / 1_000_000).toFixed(decimals)}M` : num >= 1_000 ? `${(num / 1_000).toFixed(decimals)}K` : num.toFixed(decimals);
export const formatTime = (seconds: number): string => seconds < 60 ? `${seconds} Seconds` : seconds < 3600 ? `${Math.floor(seconds / 60)} Minutes` : seconds < 86400 ? `${Math.floor(seconds / 3600)} Hours` : `${Math.floor(seconds / 86400)} Days`;
export const aprToApy = (apr: number): number => (1 + apr / 365) ** 365 - 1
