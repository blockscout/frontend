import type { WalletType } from 'types/client/wallets';

export enum EventTypes {
  PAGE_VIEW = 'Page view',
  SEARCH_QUERY = 'Search query',
  ADD_TO_WALLET = 'Add to wallet',
}

/* eslint-disable @typescript-eslint/indent */
export type EventPayload<Type extends EventTypes> =
Type extends EventTypes.PAGE_VIEW ?
{
  'Page type': string;
  'Tab': string;
  'Page'?: string;
} :
Type extends EventTypes.SEARCH_QUERY ? {
  'Search query': string;
  'Source page type': string;
  'Result URL': string;
} :
Type extends EventTypes.ADD_TO_WALLET ? (
  {
    'Wallet': WalletType;
    'Target': 'network';
  } | {
    'Wallet': WalletType;
    'Target': 'token';
    'Token': string;
  }
) :
undefined;
/* eslint-enable @typescript-eslint/indent */
