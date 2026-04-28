export const WEIGHT_COLORS = {
  3: '#b83b3b',
  2: '#4a6b8c',
  1: '#5c7a6b',
} as const;

export const PAPER_BG = '#f4f1e8';

export function getPoetColor(weight: number): string {
  return WEIGHT_COLORS[weight as keyof typeof WEIGHT_COLORS] ?? WEIGHT_COLORS[1];
}
