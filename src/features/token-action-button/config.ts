// SPDX-License-Identifier: LicenseRef-Blockscout

import type { TokenActionButtonConfig } from 'src/features/token-action-button/types/config';

import { getEnvValue, parseEnvJson } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

const value = parseEnvJson<TokenActionButtonConfig>(getEnvValue('NEXT_PUBLIC_TOKEN_ACTION_BUTTON_CONFIG'));

const title = 'Token action button';

const config: Feature<{ button: TokenActionButtonConfig }> = (() => {
  if (value?.text && value.url) {
    return Object.freeze({
      title,
      isEnabled: true,
      button: value,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
