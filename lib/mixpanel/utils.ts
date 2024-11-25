import type { WalletType } from 'types/client/wallets';
import type { ColorThemeId } from 'types/settings';

export enum EventTypes {
  PAGE_VIEW = 'Page view',
  SEARCH_QUERY = 'Search query',
  LOCAL_SEARCH = 'Local search',
  ADD_TO_WALLET = 'Add to wallet',
  ACCOUNT_ACCESS = 'Account access',
  LOGIN = 'Login',
  ACCOUNT_LINK_INFO = 'Account link info',
  PRIVATE_TAG = 'Private tag',
  VERIFY_ADDRESS = 'Verify address',
  VERIFY_TOKEN = 'Verify token',
  WALLET_CONNECT = 'Wallet connect',
  WALLET_ACTION = 'Wallet action',
  CONTRACT_INTERACTION = 'Contract interaction',
  CONTRACT_VERIFICATION = 'Contract verification',
  QR_CODE = 'QR code',
  PAGE_WIDGET = 'Page widget',
  TX_INTERPRETATION_INTERACTION = 'Transaction interpretation interaction',
  EXPERIMENT_STARTED = 'Experiment started',
  FILTERS = 'Filters',
  BUTTON_CLICK = 'Button click',
  PROMO_BANNER = 'Promo banner',
  APP_FEEDBACK = 'App feedback',
}

/* eslint-disable  @stylistic/indent */
export type EventPayload<Type extends EventTypes> =
Type extends EventTypes.PAGE_VIEW ?
{
  'Page type': string;
  Tab: string;
  Page?: string;
  'Color mode': 'light' | 'dark';
  'Color theme': ColorThemeId | undefined;
} :
Type extends EventTypes.SEARCH_QUERY ? {
  'Search query': string;
  'Source page type': string;
  'Result URL': string;
} :
Type extends EventTypes.LOCAL_SEARCH ? {
  'Search query': string;
  Source: 'Marketplace';
} :
Type extends EventTypes.ADD_TO_WALLET ? (
  {
    Wallet: WalletType;
    Target: 'network';
  } | {
    Wallet: WalletType;
    Target: 'token';
    Token: string;
  }
) :
Type extends EventTypes.ACCOUNT_ACCESS ? {
  Action: 'Dropdown open' | 'Logged out';
} :
Type extends EventTypes.LOGIN ? (
  {
    Action: 'Started';
    Source: string;
  } | {
    Action: 'Wallet' | 'Email';
    Source: 'Options selector';
  } | {
    Action: 'OTP sent';
    Source: 'Email';
  } | {
    Action: 'Success';
    Source: 'Email' | 'Wallet';
  }
) :
Type extends EventTypes.ACCOUNT_LINK_INFO ? {
  Source: 'Profile' | 'Login modal' | 'Profile dropdown' | 'Merits';
  Status: 'Started' | 'OTP sent' | 'Finished';
  Type: 'Email' | 'Wallet';
} :
Type extends EventTypes.PRIVATE_TAG ? {
  Action: 'Form opened' | 'Submit';
  'Page type': string;
  'Tag type': 'Address' | 'Tx';
} :
Type extends EventTypes.VERIFY_ADDRESS ? (
  {
    Action: 'Form opened' | 'Address entered';
    'Page type': string;
  } | {
    Action: 'Sign ownership';
    'Page type': string;
    'Sign method': 'wallet' | 'manual';
  }
) :
Type extends EventTypes.VERIFY_TOKEN ? {
  Action: 'Form opened' | 'Submit';
} :
Type extends EventTypes.WALLET_CONNECT ? {
  Source: 'Header' | 'Login' | 'Profile' | 'Profile dropdown' | 'Smart contracts' | 'Swap button' | 'Merits';
  Status: 'Started' | 'Connected';
} :
Type extends EventTypes.WALLET_ACTION ? (
  {
    Action: 'Open' | 'Address click';
  } | {
    Action: 'Send Transaction' | 'Sign Message' | 'Sign Typed Data';
    Address: string | undefined;
    AppId: string;
  }
) :
Type extends EventTypes.CONTRACT_INTERACTION ? {
  'Method type': 'Read' | 'Write';
  'Method name': string;
} :
Type extends EventTypes.CONTRACT_VERIFICATION ? {
  Method: string;
  Status: 'Method selected' | 'Finished';
} :
Type extends EventTypes.QR_CODE ? {
  'Page type': string;
} :
Type extends EventTypes.PAGE_WIDGET ? (
  {
    Type: 'Tokens dropdown' | 'Tokens show all (icon)' | 'Add to watchlist' | 'Address actions (more button)';
  } | {
    Type: 'Favorite app' | 'More button' | 'Security score' | 'Total contracts' | 'Verified contracts' | 'Analyzed contracts';
    Info: string;
    Source: 'Discovery view' | 'Security view' | 'App modal' | 'App page' | 'Security score popup' | 'Banner';
  } | {
    Type: 'Security score';
    Source: 'Analyzed contracts popup';
  } | {
    Type: 'Action button';
    Info: string;
    Source: 'Txn' | 'NFT collection' | 'NFT item';
  } | {
    Type: 'Address tag';
    Info: string;
    URL: string;
  } | {
    Type: 'Share chart';
    Info: string;
  }
) :
Type extends EventTypes.TX_INTERPRETATION_INTERACTION ? {
  Type: 'Address click' | 'Token click' | 'Domain click';
} :
Type extends EventTypes.EXPERIMENT_STARTED ? {
  'Experiment name': string;
  'Variant name': string;
  Source: 'growthbook';
} :
Type extends EventTypes.FILTERS ? {
  Source: 'Marketplace';
  'Filter name': string;
} :
Type extends EventTypes.BUTTON_CLICK ? {
  Content: string;
  Source: string;
} :
Type extends EventTypes.PROMO_BANNER ? {
  Source: 'Marketplace';
  Link: string;
} :
Type extends EventTypes.APP_FEEDBACK ? {
  Action: 'Rating';
  Source: 'Discovery' | 'App modal' | 'App page';
  AppId: string;
  Score: number;
} :
undefined;
/* eslint-enable  @stylistic/indent */
