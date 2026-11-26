// SPDX-License-Identifier: LicenseRef-Blockscout

// The types source - node_modules/@wagmi/core/src/connectors/injected.ts
import type { Simplify } from 'type-fest';
import type { EIP1193Provider } from 'viem';

type WalletProviderFlags =
  'isApexWallet' |
  'isAvalanche' |
  'isBackpack' |
  'isBifrost' |
  'isBitKeep' |
  'isBitski' |
  'isBlockWallet' |
  'isBraveWallet' |
  'isCoinbaseWallet' |
  'isDawn' |
  'isEnkrypt' |
  'isExodus' |
  'isFrame' |
  'isFrontier' |
  'isGamestop' |
  'isHyperPay' |
  'isImToken' |
  'isKuCoinWallet' |
  'isMathWallet' |
  'isMetaMask' |
  'isOkxWallet' |
  'isOKExWallet' |
  'isOneInchAndroidWallet' |
  'isOneInchIOSWallet' |
  'isOpera' |
  'isPhantom' |
  'isPortal' |
  'isRabby' |
  'isRainbow' |
  'isStatus' |
  'isTally' |
  'isTokenPocket' |
  'isTokenary' |
  'isTrust' |
  'isTrustWallet' |
  'isXDEFI' |
  'isZerion';

export type WalletProvider = Simplify<
EIP1193Provider & {
  [key in WalletProviderFlags]?: true | undefined
} & {
  providers?: Array<WalletProvider> | undefined;
  _events?: { connect?: (() => void) | undefined } | undefined;
  _state?:
  | {
    accounts?: Array<string>;
    initialized?: boolean;
    isConnected?: boolean;
    isPermanentlyDisconnected?: boolean;
    isUnlocked?: boolean;
  } |
  undefined;
}
>;
