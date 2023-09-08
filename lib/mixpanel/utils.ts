import type { WalletType } from 'types/client/wallets';

export enum EventTypes {
  PAGE_VIEW = 'Page view',
  SEARCH_QUERY = 'Search query',
  ADD_TO_WALLET = 'Add to wallet',
  ACCOUNT_ACCESS = 'Account access',
  PRIVATE_TAG = 'Private tag',
  VERIFY_ADDRESS = 'Verify address',
  VERIFY_TOKEN = 'Verify token',
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
  'Action': 'Auth0 init' | 'Verification email resent' | 'Logged out';
} :
Type extends EventTypes.PRIVATE_TAG ? {
  'Action': 'Form opened' | 'Submit';
  'Page type': string;
  'Tag type': 'Address' | 'Tx';
} :
Type extends EventTypes.VERIFY_ADDRESS ? (
  {
    'Action': 'Form opened' | 'Address entered';
    'Page type': string;
  } | {
    'Action': 'Sign ownership';
    'Page type': string;
    'Sign method': 'wallet' | 'manual';
  }
) :
Type extends EventTypes.VERIFY_TOKEN ? {
  'Action': 'Form opened' | 'Submit';
} :
undefined;
/* eslint-enable @typescript-eslint/indent */
