// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';

import type { SelectOption } from 'toolkit/chakra/select';

const feature = config.features.marketplace;

export type SortValue = 'default' | 'rating_score' | 'rating_count';

export const SORT_OPTIONS: Array<SelectOption<SortValue>> = [
  { label: 'Default', value: 'default' },
  (feature.isEnabled && 'api' in feature) && { label: 'Top rated', value: 'rating_score' },
  (feature.isEnabled && 'api' in feature) && { label: 'Most rated', value: 'rating_count' },
].filter(Boolean) as Array<SelectOption<SortValue>>;
