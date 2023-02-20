import { Asset, Stats } from './types';

export function getStatsDiff(base: Array<Asset>, pr: Array<Asset>): Stats {
  const oldSize = base.reduce((acc, a) => acc + a.size, 0);
  const newSize = pr.reduce((acc, a) => acc + a.size, 0);
  const diff = newSize - oldSize;
  const diffPercentage = diff / (oldSize / 100);
  return {
    total: {
      oldSize,
      newSize,
      diff,
      diffPercentage,
    },
  };
}
