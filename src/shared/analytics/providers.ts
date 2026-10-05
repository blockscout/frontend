// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';
import { mixpanelProvider } from 'src/services/mixpanel/provider';

import type { AnalyticsProvider } from './provider';

interface ProviderRegistration {
  readonly provider: AnalyticsProvider;
  readonly isEnabled: () => boolean;
}

const PROVIDERS: ReadonlyArray<ProviderRegistration> = [
  { provider: mixpanelProvider, isEnabled: () => Boolean(config.services.mixpanel.projectToken) },
];

export function getEnabledProviders(): Array<AnalyticsProvider> {
  return PROVIDERS.filter(({ isEnabled }) => isEnabled()).map(({ provider }) => provider);
}
