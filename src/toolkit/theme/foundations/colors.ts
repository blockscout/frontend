// SPDX-License-Identifier: LicenseRef-Blockscout

import { defaultsDeep } from 'es-toolkit/compat';

import config from 'src/config';

import { DEFAULT_THEME_COLORS, PALETTE_COLORS } from './colorsDefault';

const colors = {
  ...PALETTE_COLORS,
  theme: defaultsDeep(config.shell.topBar.colorTheme.overrides, DEFAULT_THEME_COLORS),
};

export default colors;
