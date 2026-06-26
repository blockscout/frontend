// SPDX-License-Identifier: LicenseRef-Blockscout
import type * as contractsInfo from '@blockscout/contracts-info-types';

interface PoolLink {
  url: string;
  image: string;
  title: string;
};

export default function getPoolLinks(pool?: contractsInfo.Pool): Array<PoolLink> {
  if (!pool) {
    return [];
  }

  return [
    {
      url: pool.coin_gecko_terminal_url,
      image: '/static/gecko_terminal.png',
      title: 'GeckoTerminal',
    },
  ].filter(link => Boolean(link.url));
}
