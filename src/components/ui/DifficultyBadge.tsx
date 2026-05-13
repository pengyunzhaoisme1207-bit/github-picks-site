import { getDifficultyStars, getDifficultyLabel } from '@/lib/utils';

interface DifficultyBadgeProps {
  level: 1 | 2 | 3;
}

const colors = {
  1: 'bg-green-100 text-green-800',
  2: 'bg-amber-100 text-amber-800',
  3: 'bg-red-100 text-red-800',
};

export default function DifficultyBadge({ level }: DifficultyBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${colors[level]}`} title={getDifficultyLabel(level)}>
      <span>{getDifficultyStars(level)}</span>
    </span>
  );
}
