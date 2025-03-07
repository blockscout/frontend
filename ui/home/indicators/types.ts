import type React from 'react';

import type { MainPageStats } from '@blockscout/stats-types';
import type { HomeStats } from 'types/api/stats';
import type { ChainIndicatorId } from 'types/homepage';

export interface TChainIndicator {
  id: ChainIndicatorId;
  titleMicroservice?: (stats: MainPageStats) => string | undefined;
  title: string;
  value: (stats: HomeStats) => string;
  valueMicroservice?: (stats: MainPageStats) => string | undefined;
  valueDiff?: (stats?: HomeStats) => number | null | undefined;
  icon: React.ReactNode;
  hint?: string;
  hintMicroservice?: (stats: MainPageStats) => string | undefined;
}
