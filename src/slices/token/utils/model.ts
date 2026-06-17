// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

export function toTokenModel(fields: Partial<schemas['Token']>): schemas['Token'] {
  return {
    ...fields,
    decimals: fields.decimals ?? null,
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
    is_bridged: fields.is_bridged ?? false,
  };
}

export function toTokenInstanceModel(fields: Partial<schemas['TokenInstance']>): schemas['TokenInstance'] {
  return {
    ...fields,
    id: fields.id ?? '',
    token: fields.token ?? null,
    animation_url: fields.animation_url ?? null,
    external_app_url: fields.external_app_url ?? null,
    image_url: fields.image_url ?? null,
    is_unique: fields.is_unique ?? null,
    media_type: fields.media_type ?? null,
    media_url: fields.media_url ?? null,
    metadata: fields.metadata ?? null,
    owner: fields.owner ?? null,
    thumbnails: fields.thumbnails ?? null,
  };
}
