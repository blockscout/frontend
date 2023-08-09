import type { AdTextProviders } from 'types/client/adProviders';

import { getEnvValue } from '../utils';

const provider: AdTextProviders = (() => {
  const envValue = getEnvValue(process.env.NEXT_PUBLIC_AD_TEXT_PROVIDER);
  const SUPPORTED_AD_BANNER_PROVIDERS = [ 'coinzilla', 'none' ];

  return envValue && SUPPORTED_AD_BANNER_PROVIDERS.includes(envValue) ? envValue as AdTextProviders : 'coinzilla';
})();

export default Object.freeze({
  title: 'Text ads',
  isEnabled: provider !== 'none',
  provider,
});
