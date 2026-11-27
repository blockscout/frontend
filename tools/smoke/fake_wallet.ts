import type { Page } from '@playwright/test';

interface FakeWalletParams {
  readonly uuid: string;
  readonly name: string;
  readonly address: string;
  readonly chainId: number;
}

interface RequestArguments {
  readonly method: string;
  readonly params?: ReadonlyArray<unknown>;
}

type RequestHandler = (params: RequestArguments['params']) => unknown;

export const FAKE_WALLET = {
  uuid: '5f1a3f4e-2b8c-4d7a-9e61-0c3b7a2d9f45',
  name: 'Smoke Wallet',
  address: '0x402D7b032BAf94174Df28091b52465df086381A1',
} as const;

// The EIP-1193 spec - https://eips.ethereum.org/EIPS/eip-1193
// The EIP-6963 spec - https://eips.ethereum.org/EIPS/eip-6963
// Serialized into the page as an init script, so it can reference nothing outside its own body.
const announceFakeWallet = ({ uuid, name, address, chainId }: FakeWalletParams): void => {
  const chainIdHex = `0x${ chainId.toString(16) }`;
  let isConnected = false;

  const rpcError = (code: number, message: string) => Object.assign(new Error(message), { code });

  const connect = () => {
    isConnected = true;
    return [ address ];
  };

  const switchChain: RequestHandler = (params) => {
    const [ { chainId: requestedChainId } ] = params as [ { readonly chainId: string } ];
    if (requestedChainId !== chainIdHex) {
      throw rpcError(4902, `The fake wallet has no chain ${ requestedChainId }`);
    }
    return null;
  };

  const handlers = new Map<string, RequestHandler>([
    [ 'eth_requestAccounts', connect ],
    [ 'wallet_requestPermissions', () => [ { parentCapability: 'eth_accounts', caveats: [ { type: 'restrictReturnedAccounts', value: connect() } ] } ] ],
    [ 'eth_accounts', () => isConnected ? [ address ] : [] ],
    [ 'eth_chainId', () => chainIdHex ],
    [ 'wallet_switchEthereumChain', switchChain ],
    // the login that follows the connection asks for a signature; with no key to sign with, the fake wallet declines it
    // the way a user can, which leaves the wallet connected and the user logged out
    [ 'personal_sign', () => {
      throw rpcError(4001, 'User rejected the request.');
    } ],
  ]);

  const request = async({ method, params }: RequestArguments): Promise<unknown> => {
    const handler = handlers.get(method);
    if (!handler) {
      throw rpcError(4200, `The fake wallet does not support ${ method }`);
    }
    return handler(params);
  };

  const provider = {
    request,
    // the fake wallet never changes accounts or chains, so it has no event to emit
    on: () => provider,
    removeListener: () => provider,
  };

  const info = {
    uuid,
    name,
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32"/></svg>',
    rdns: 'com.blockscout.smoke',
  };

  const announce = () => {
    window.dispatchEvent(new CustomEvent('eip6963:announceProvider', { detail: Object.freeze({ info, provider }) }));
  };

  window.addEventListener('eip6963:requestProvider', announce);
  announce();
};

export const injectFakeWallet = async(page: Page, chainId: number): Promise<void> => {
  await page.addInitScript(announceFakeWallet, { ...FAKE_WALLET, chainId });
};
