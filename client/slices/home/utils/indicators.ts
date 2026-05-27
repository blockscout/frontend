// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';

import type { TChainIndicator } from 'client/slices/home/types/client';

export const isIndicatorEnabled = ({ id }: TChainIndicator) => config.slices.home.charts.includes(id);

export const sortIndicators = (a: TChainIndicator, b: TChainIndicator) => {
  if (config.slices.home.charts.indexOf(a.id) > config.slices.home.charts.indexOf(b.id)) {
    return 1;
  }

  if (config.slices.home.charts.indexOf(a.id) < config.slices.home.charts.indexOf(b.id)) {
    return -1;
  }

  return 0;
};
