export function formatStars(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '')}k`;
  return n.toString();
}

export function getDifficultyLabel(level: 1 | 2 | 3): string {
  const labels = { 1: 'Beginner Friendly', 2: 'Some Experience Needed', 3: 'Developer Oriented' };
  return labels[level];
}

export function getDifficultyStars(level: 1 | 2 | 3): string {
  return '⭐'.repeat(level);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}
