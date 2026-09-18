// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import multichainConfig from 'src/features/multichain/chains-config';

import config from 'src/config';

function hasSiteKey(): boolean {
  if (config.services.reCaptcha.siteKey) {
    return true;
  }

  // in multichain mode the widget is rendered with the key of the chain the page belongs to
  return Boolean(multichainConfig()?.chains.some((chain) => chain.app_config?.services?.reCaptcha?.siteKey));
}

export function reCaptcha(isPrivateMode: boolean): CspDev.DirectiveDescriptor {
  if (!hasSiteKey() || isPrivateMode) {
    return {};
  }

  return {
    'connect-src': [
      'https://www.google.com/recaptcha/api2/clr',
    ],
    'script-src': [
      'https://www.google.com/recaptcha/api.js',
      'https://www.gstatic.com',
      'https://translate.google.com',
      '\'sha256-FDyPg8CqqIpPAfGVKx1YeKduyLs0ghNYWII21wL+7HM=\'',
    ],
    'style-src': [
      'https://www.gstatic.com',
    ],
    'img-src': [
      'https://translate.google.com',
      'https://www.gstatic.com',
    ],
    'frame-src': [
      'https://www.google.com/recaptcha/api2/anchor',
      'https://www.google.com/recaptcha/api2/bframe',
    ],
  };
}
