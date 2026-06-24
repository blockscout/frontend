import type { schemas } from '@blockscout/api-types';

export const privateTag: schemas['Tag'] = {
  label: 'my-private-tag',
  display_name: 'my private tag',
  address_hash: '0x',
};

export const publicTag: schemas['Tag'] = {
  label: 'some-public-tag',
  display_name: 'some public tag',
  address_hash: '0x',
};

export const watchlistName: schemas['WatchlistName'] = {
  label: 'watchlist-name',
  display_name: 'watchlist name',
};
