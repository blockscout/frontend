import { thinsp } from 'toolkit/utils/htmlEntities';

export function formatPercentage(percentage: number) {
  const value = Math.round(percentage * 100);
  if (value === 0 && percentage > 0) {
    return `<${ thinsp }1%`;
  }
  if (value === 100 && percentage < 1) {
    return `>${ thinsp }99%`;
  }
  return `${ value }%`;
}
