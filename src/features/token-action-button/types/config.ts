// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ColorModeValue } from 'src/config/types';

export interface TokenActionButtonColorState {
  bg?: ColorModeValue;
  text?: ColorModeValue;
}

export interface TokenActionButtonColors {
  _default?: TokenActionButtonColorState;
}

export interface TokenActionButtonConfig {
  text: string;
  url: string;
  logo?: ColorModeValue;
  colors?: TokenActionButtonColors;
}
