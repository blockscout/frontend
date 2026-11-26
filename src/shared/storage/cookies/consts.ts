// SPDX-License-Identifier: LicenseRef-Blockscout

export enum NAMES {
  NAV_BAR_COLLAPSED = 'nav_bar_collapsed',
  API_TOKEN = '_explorer_key',
  API_TEMP_TOKEN = 'api_temp_token',
  REWARDS_API_TOKEN = 'rewards_api_token',
  REWARDS_REFERRAL_CODE = 'rewards_ref_code',
  TXS_SORT = 'txs_sort',
  COLOR_MODE = 'chakra-ui-color-mode',
  COLOR_THEME = 'chakra-ui-color-theme',
  ADDRESS_IDENTICON_TYPE = 'address_identicon_type',
  ADDRESS_FORMAT = 'address_format',
  TIME_FORMAT = 'time_format',
  LOCAL_TIME = 'local_time',
  INDEXING_ALERT = 'indexing_alert',
  ADBLOCK_DETECTED = 'adblock_detected',
  ANALYTICS_DEBUG = '_analytics_debug',
  ADDRESS_NFT_DISPLAY_TYPE = 'address_nft_display_type',
  HIDE_ADD_TO_WALLET_BUTTON = 'hide_add_to_wallet_button',
  UUID = 'uuid',
  SHOW_SCAM_TOKENS = 'show_scam_tokens',
  SHOW_POOR_REPUTATION_TOKENS = 'show_poor_reputation_tokens',
  APP_PROFILE = 'app_profile',
  CUSTOM_RPC_URL = 'custom_rpc_url',
  CUSTOM_RPC_IN_USE = 'custom_rpc_in_use',
}

export const PRIVATE_MODE_DISALLOWED: ReadonlyArray<NAMES> = [
  NAMES.UUID,
  NAMES.ADBLOCK_DETECTED,
  NAMES.ANALYTICS_DEBUG,
];
