// SPDX-License-Identifier: LicenseRef-Blockscout

import Base64 from 'crypto-js/enc-base64';
import sha256 from 'crypto-js/sha256';
import type CspDev from 'csp-dev';

import type { AdBannerAdditionalProviders, AdBannerProviders } from 'src/features/ads/banner/types/config';
import type { AdTextProviders } from 'src/features/ads/text/types/config';

import { connectAdbutler, placeAd } from 'src/features/ads/banner/utils/adbutler-script';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';

import { mergeDescriptors } from '../utils';

type AdsProviders = AdBannerProviders | AdTextProviders | AdBannerAdditionalProviders | 'specify';

const getProviderDescriptor = (provider: AdsProviders, nonce?: string): CspDev.DirectiveDescriptor => {
  switch (provider) {
    case 'sevio':
      return {
        'connect-src': [
          '*.adx.ws',
          'https://request.adx.ws',
          'https://id5-sync.com',
          'https://lb.eu-1-id5-sync.com/lb/v1',
        ],
        'script-src': [
          'cdn.adx.ws',
          ...(nonce ? [ `'nonce-${ nonce }'` ] : []),
        ],
        'img-src': [
          '*.adx.ws',
        ],
      };
    case 'adbutler':
      return {
        'connect-src': [
          'servedbyadbutler.com',
        ],
        'script-src': [
          'servedbyadbutler.com',
          `'sha256-${ Base64.stringify(sha256(connectAdbutler)) }'`,
          `'sha256-${ Base64.stringify(sha256(placeAd(false) ?? '')) }'`,
          `'sha256-${ Base64.stringify(sha256(placeAd(true) ?? '')) }'`,
        ],
        'img-src': [
          'servedbyadbutler.com',
        ],
      };
    case 'slise':
      return {
        'connect-src': [
          '*.slise.xyz',
        ],
        'script-src': [
          '*.slise.xyz',
        ],
      };
    case 'specify':
      return {
        'connect-src': [
          'app.specify.sh',
        ],
      };
    default:
      return {};
  }
};

export function ads(isPrivateMode: boolean, nonce?: string): CspDev.DirectiveDescriptor {

  if (isPrivateMode) {
    return {};
  }

  const adsBannerFeature = getFeaturePayload(config.features.adsBanner);
  const adsTextFeature = getFeaturePayload(config.features.adsText);

  const providers: Array<AdsProviders> = [
    adsBannerFeature?.provider,
    adsTextFeature?.provider,
    adsBannerFeature && 'additionalProvider' in adsBannerFeature ? adsBannerFeature.additionalProvider : undefined,
    adsBannerFeature?.isSpecifyEnabled ? 'specify' as const : undefined,
  ].filter(Boolean);

  const descriptors = providers.map((provider) => getProviderDescriptor(provider, nonce));

  return mergeDescriptors(...descriptors);
}
