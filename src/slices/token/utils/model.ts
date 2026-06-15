// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

export function toTokenModel(fields: Partial<schemas['Token']>): schemas['Token'] {
  return {
    ...fields,
    decimals: fields.decimals ?? '18',
    address_hash: fields.address_hash ?? '',
    circulating_market_cap: fields.circulating_market_cap ?? null,
    circulating_supply: fields.circulating_supply ?? null,
    exchange_rate: fields.exchange_rate ?? null,
    holders_count: fields.holders_count ?? null,
    name: fields.name ?? null,
    symbol: fields.symbol ?? null,
    total_supply: fields.total_supply ?? null,
    type: fields.type ?? 'ERC-20',
    icon_url: fields.icon_url ?? null,
    reputation: fields.reputation ?? null,
    volume_24h: fields.volume_24h ?? null,
  };
}
