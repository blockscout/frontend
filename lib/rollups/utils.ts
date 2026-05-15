// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'configs/app';

const feature = config.features.rollup;

export const layerLabels = feature.isEnabled ? {
  current: `L${ feature.layerNumber }`,
  parent: `L${ feature.layerNumber - 1 }`,
} : {
  current: 'L2',
  parent: 'L1',
};
