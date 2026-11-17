// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ThemingConfig } from '@chakra-ui/react';
import { defaultsDeep } from 'es-toolkit/compat';

import type { ColorModeValue } from 'src/config/types';

import config from 'src/config';

import { SEMANTIC_TOKENS_DEFAULT } from './semanticTokensDefault';

const heroBannerButton = config.slices.home.heroBanner?.button;

// A configured pair fills both modes, a single value serves both; anything undefined keeps the default.
function modePair(values: ColorModeValue | undefined) {
  return { value: { _light: values?.[0], _dark: values?.[1] || values?.[0] } };
}

const heroButtonOverrides = {
  colors: {
    button: {
      hero: {
        bg: {
          DEFAULT: modePair(heroBannerButton?._default?.background),
          hover: modePair(heroBannerButton?._hover?.background),
          selected: modePair(heroBannerButton?._selected?.background),
        },
        fg: {
          DEFAULT: modePair(heroBannerButton?._default?.text_color),
          hover: modePair(heroBannerButton?._hover?.text_color),
          selected: modePair(heroBannerButton?._selected?.text_color),
        },
      },
    },
  },
};

const semanticTokens: ThemingConfig['semanticTokens'] = defaultsDeep(heroButtonOverrides, SEMANTIC_TOKENS_DEFAULT);

export default semanticTokens;
