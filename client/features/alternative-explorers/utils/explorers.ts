// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';
import { mapValues } from 'es-toolkit';

import type { AlternativeExplorer } from '../types/client';

import { stripTrailingSlash, addLeadingSlash } from 'toolkit/utils/url';

const chainExplorers: Array<AlternativeExplorer> = (() => {
  return config.features.alternativeExplorers.items.map((explorer) => ({
    ...explorer,
    baseUrl: stripTrailingSlash(explorer.baseUrl),
    paths: mapValues(explorer.paths, (value) => value ? stripTrailingSlash(addLeadingSlash(value)) : value),
  }));
})();

export default chainExplorers;
