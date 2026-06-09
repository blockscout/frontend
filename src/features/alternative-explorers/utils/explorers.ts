// SPDX-License-Identifier: LicenseRef-Blockscout

import { mapValues } from 'es-toolkit';

import type { AlternativeExplorer } from '../types/client';

import config from 'src/config';

import { stripTrailingSlash, addLeadingSlash } from 'src/toolkit/utils/url';

const chainExplorers: Array<AlternativeExplorer> = (() => {
  return config.features.alternativeExplorers.items.map((explorer) => ({
    ...explorer,
    baseUrl: stripTrailingSlash(explorer.baseUrl),
    paths: mapValues(explorer.paths, (value) => value ? stripTrailingSlash(addLeadingSlash(value)) : value),
  }));
})();

export default chainExplorers;
