import type { WalletType } from 'types/client/wallets';

export enum EventTypes {
  PAGE_VIEW = 'Page view',
  SEARCH_QUERY = 'Search query',
  ADD_TO_WALLET = 'Add to wallet',
  ACCOUNT_ACCESS = 'Account access',
}

/* eslint-disable @typescript-eslint/indent */
export type EventPayload<Type extends EventTypes> =
Type extends EventTypes.PAGE_VIEW ?
{
  'Page type': string;
  'Tab': string;
  'Page'?: string;
  'Color mode': 'light' | 'dark';
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
Type extends EventTypes.ACCOUNT_ACCESS ? {
  'Action': 'auth0_init' | 'verification_email_resent' | 'logged_out';
} :
undefined;
/* eslint-enable @typescript-eslint/indent */
